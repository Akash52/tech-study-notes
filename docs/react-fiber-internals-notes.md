# React Fiber Internals Deep Dive — "Smoosh Mode"

> **Featuring:** Dan Abramov (React Core Team)
>
> **Concept:** Building a "smoosh mode" that strips unnecessary `<div>` wrappers from React output — used as a vehicle to explore how React Fiber actually works under the hood.

---

## 1. The Problem: Div Soup

React apps tend to accumulate deeply nested `<div>` elements that exist purely as component wrappers, not for styling or semantics. This bloats the DOM, hurts readability, and can cause minor performance overhead (each extra node = one more Fiber to process).

**Goal:** Implement a mode that automatically removes unnecessary `<div>` elements from the rendered output.

---

## 2. React Project Structure (Where Things Live)

```
react/
├── packages/                  # Yarn workspaces — one folder per package
│   ├── react/
│   │   └── src/
│   │       └── __tests__/     # Tests for the react package
│   ├── react-dom/
│   │   └── src/
│   │       └── __tests__/     # Tests for react-dom
│   └── react-reconciler/
│       └── src/
│           ├── ReactFiberBeginWork.js    # ← "Begin" phase
│           ├── ReactFiberCompleteWork.js # ← "Complete" phase
│           └── ReactFiberCommitWork.js   # ← "Commit" phase
```

- Tests live in `packages/<pkg>/src/__tests__/`.
- Tests routinely span multiple packages (e.g. a test imports both `react` and `react-dom`).
- Run a single test file: `yarn test --watch <test-file-name>`.

---

## 3. Approach A — The Quick Hack (Override `createElement`)

### How JSX compiles

```jsx
// You write:
<div className="box">Hello</div>

// Babel compiles to:
React.createElement('div', { className: 'box' }, 'Hello');
```

### The hack

Intercept `createElement` and swap every `"div"` type with `React.Fragment`:

```js
// packages/react/src/ReactElement.js
// Inside createElement(type, config, children):

if (type === 'div') {
  type = REACT_FRAGMENT_TYPE;   // Symbol.for('react.fragment')
}
```

**Why this works:** Fragments render their children without creating a DOM node, so every `<div>` wrapper simply disappears.

**Key detail — what is `React.Fragment`?**

It's just a `Symbol`:

```js
// packages/shared/ReactSymbols.js
export const REACT_FRAGMENT_TYPE = Symbol.for('react.fragment');
```

Symbols are JavaScript primitives. `Symbol.for(key)` returns the **same symbol** across different realms (iframes, workers, etc.), making them ideal for tagging internal React types.

### Live demo trick (hacking a running page)

You can access React's internals on any page via React DevTools' `__REACT_DEVTOOLS_GLOBAL_HOOK__`:

```js
// In the browser console (with React DevTools installed):
const reactDom = __REACT_DEVTOOLS_GLOBAL_HOOK__.renderers.get(1);
// Navigate to a createElement call, set a breakpoint, grab `React`

const oldCreate = React.createElement;
React.createElement = (type, ...args) => {
  if (type === 'div') type = Symbol.for('react.fragment');
  return oldCreate(type, ...args);
};
```

---

## 4. The Fiber Architecture — Core Mental Model

### What is a Fiber?

A Fiber is a plain JS object — a node in React's internal tree. Each Fiber represents a **unit of work** and holds:

| Field        | Purpose                                                  |
|:-------------|:---------------------------------------------------------|
| `tag`        | Enum identifying the Fiber kind (see `ReactWorkTags.js`) |
| `type`       | The element type (`'div'`, `MyComponent`, etc.)          |
| `stateNode`  | The real DOM node (for host components) or class instance |
| `memoizedState` | Hooks state / class component state                   |
| `child`      | First child Fiber                                        |
| `sibling`    | Next sibling Fiber                                       |
| `return`     | Parent Fiber (named "return" because traversal goes up)  |
| `mode`       | Bitmask of active modes (StrictMode, ConcurrentMode…)    |

### Fiber tags (`ReactWorkTags.js`)

```
FunctionComponent, ClassComponent, HostComponent (div, span, etc.),
HostText, Fragment, Mode, SuspenseComponent, ...
```

### Why Fibers exist

React elements (`<div>`, `<App>`) are **recreated every render**. Fibers are **persistent** — they give each position in the tree a stable identity. This is how React knows a `<div>` in position 3 is the "same" div as last render, so it can skip recreating its DOM node and preserve state.

---

## 5. Double Buffering — The Two-Tree Model

Inspired by how game engines avoid screen tearing:

```
                 Root Fiber
                 ┌───────┐
    current ───► │       │ ◄─── workInProgress
                 └───────┘
                   /    \
          ┌──────┐      ┌──────┐
          │ App  │      │ App' │   (alternate / draft)
          └──────┘      └──────┘
            ...           ...
```

1. The **current** tree is what's on screen.
2. On update, React builds a **work-in-progress** (WIP) copy.
3. WIP is safe to mutate — it's invisible to the user.
4. When WIP is complete, the root pointer swaps: WIP becomes current.
5. The old current becomes the next draft (recycled — at most 2 copies per Fiber).

**Why this matters:**

- You can **abandon** an in-progress render (e.g. a higher-priority update arrives) without corrupting the visible DOM.
- Enables **Concurrent Mode**: start rendering off-screen, pause for user interactions, resume later.
- Enables **Suspense**: render a new screen in memory; only swap when data is ready (avoid flash-of-spinner).

---

## 6. The Three Phases of Rendering

### Phase 1 — Begin Work (entering a node)

**File:** `ReactFiberBeginWork.js`

```
function beginWork(current, workInProgress, renderLanes) {
  switch (workInProgress.tag) {
    case FunctionComponent:  → update/mount the function component
    case ClassComponent:     → update/mount the class component
    case HostComponent:      → handle <div>, <span>, etc.
    case Fragment:           → reconcile fragment children
    case Mode:               → pass through
    ...
  }
}
```

- Traverses **downward** into the tree (parent → child).
- Calls render functions / reconciles children.
- Skips subtrees with no pending updates (bailout optimization).
- **Never mutates the DOM.**

### Phase 2 — Complete Work (exiting a node)

**File:** `ReactFiberCompleteWork.js`

```
function completeWork(current, workInProgress, renderLanes) {
  switch (workInProgress.tag) {
    case HostComponent:
      // Create the real DOM node
      const instance = createInstance(type, props);
      // Attach completed children to it
      appendAllChildren(instance, workInProgress);
      workInProgress.stateNode = instance;
      break;
    case FunctionComponent:
    case Fragment:
      // Nothing to create — just bubble up
      break;
    ...
  }
}
```

- Traverses **upward** (leaf → root).
- For host components: **creates** the actual DOM element and **connects children** to it.
- The newly built DOM subtree is still detached from the document — safe to assemble.
- Tags Fibers that need DOM mutations as having **effects**.

#### `appendAllChildren` — the key connector

A while-loop (iterative for performance; conceptually recursive) that:

1. Walks the Fiber's children and siblings.
2. Skips over component Fibers (they have no DOM node).
3. When it finds a `HostComponent` or `HostText` Fiber, calls `parent.appendChild(child)`.

This is how the off-screen DOM tree gets wired together.

### Phase 3 — Commit (flushing to the real DOM)

**File:** `ReactFiberCommitWork.js`

- Runs **after** the entire tree is processed.
- Walks every Fiber tagged with an effect.
- Performs actual DOM mutations: insertions, updates, deletions.
- Calls lifecycle methods / `useEffect` callbacks.
- Swaps the root pointer (WIP becomes current).

**Placement effect** = inserting a newly created subtree into the container.

```
commitPlacement(fiber) {
  // Find closest DOM-ancestor in the Fiber tree
  // Find the children that need inserting
  // Call container.appendChild(child) or container.insertBefore(child, before)
}
```

### Traversal order visualized

```
        App              begin App
       / | \             begin div1
    div1 div2 div3       complete div1
      |                  begin div2
      P                  complete div2
                         begin div3
                         begin P
                         complete P
                         complete div3
                         complete App
                         ── commit ──
```

---

## 7. Approach B — Implementing Smoosh Mode in the Reconciler

Three surgical changes are needed — that's it.

### Change 1: `completeWork` — don't create DOM nodes for `<div>`

```js
// ReactFiberCompleteWork.js — inside case HostComponent:
if (type !== 'div') {
  const instance = createInstance(type, newProps, ...);
  appendAllChildren(instance, workInProgress);
  workInProgress.stateNode = instance;
}
// If it IS a div, stateNode stays null — no DOM node created.
```

### Change 2: `appendAllChildren` — skip div Fibers, descend into their children

```js
// When connecting children to a parent DOM node:
if (node.tag === HostComponent && node.type !== 'div') {
  parent.appendChild(node.stateNode);  // normal attachment
} else {
  // It's a div (or a component) — skip it, look at ITS children instead
}
```

### Change 3: `commitPlacement` — same skip logic for the top-level insertion

```js
// When inserting into the real document container:
if (node.tag === HostComponent && node.type !== 'div') {
  container.appendChild(node.stateNode);
}
// Skip div nodes — descend to find non-div children to attach.
```

**Result:** All `<div>` Fibers still exist in the Fiber tree (for reconciliation / identity), but no corresponding DOM nodes are created or attached. The rendered HTML has zero divs.

---

## 8. Making It a Toggleable Mode (like StrictMode)

### Step 1: Define a new symbol

```js
// packages/react/src/React.js
export { REACT_SMOOSH_TYPE as SmooshMode } from 'shared/ReactSymbols';

// packages/shared/ReactSymbols.js
export const REACT_SMOOSH_TYPE = Symbol.for('react.smoosh');
```

### Step 2: Register the new mode bitmask

```js
// packages/react-reconciler/src/ReactTypeOfMode.js
export const NoMode      = 0b00000;
export const StrictMode  = 0b00001;
export const ConcurrentMode = 0b00010;
// ...
export const SmooshMode  = 0b10000;  // new bit
```

### Step 3: Create the right Fiber for it

```js
// ReactFiber.js — createFiberFromTypeAndProps()
case REACT_SMOOSH_TYPE:
  fiberTag = Mode;
  mode |= SmooshMode;  // bitwise OR — adds the flag
  break;
```

Mode Fibers propagate: every child Fiber copies `mode` from its parent. So wrapping a subtree in `<React.SmooshMode>` sets the flag for the entire subtree.

### Step 4: Gate the div-skipping on the mode flag

```js
// In completeWork and appendAllChildren:
const isSmooshed = (workInProgress.mode & SmooshMode) !== 0;

if (type !== 'div' || !isSmooshed) {
  // Create DOM node normally
} else {
  // Skip — no DOM node for this div
}
```

### Usage

```jsx
function App() {
  return (
    <>
      {/* These divs render normally */}
      <div className="normal">
        <p>I keep my divs</p>
      </div>

      {/* These divs get smooshed away */}
      <React.SmooshMode>
        <div>
          <div>
            <p>No divs around me!</p>
          </div>
        </div>
      </React.SmooshMode>
    </>
  );
}
```

---

## 9. Key Insights for Working in the React Codebase

**Organized by phase, not by component type.** Don't look for "FunctionComponent.js" — instead, look at what phase you care about:

| Question | File |
|:---------|:-----|
| What happens when React enters a Fiber? | `ReactFiberBeginWork.js` |
| What happens when React finishes a Fiber? | `ReactFiberCompleteWork.js` |
| What happens when React flushes to the DOM? | `ReactFiberCommitWork.js` |

**No class hierarchy.** Pre-v16 React used classes with inheritance. Fiber uses a single data structure + switch statements. This avoids dynamic dispatch, makes features like Fragments trivial to add, and lets Google Closure Compiler inline everything aggressively.

**The "host config" abstraction is zero-cost.** Functions like `appendChild` look abstract (`appendChildToContainer`) but Closure Compiler inlines them to literal `parent.appendChild(child)` in production. The abstraction exists so React Native (and other renderers) can swap implementations — it doesn't add runtime overhead on the web.

**Symbols are everywhere.** Fragment, StrictMode, Suspense, etc. are all Symbols. This gives them a unique identity that works across JavaScript realms.

---

## 10. Concurrent Mode & Suspense — Why the Architecture Matters

The double-buffering / Fiber architecture directly enables:

- **Time-slicing:** Start rendering, pause for high-priority work (e.g. user input), resume later. Possible because the WIP tree is uncommitted — you can abandon it at no cost.
- **Suspense:** Render a new route in memory. If data loads within ~200ms, swap instantly (no spinner). If it takes longer, show a fallback. The old screen stays visible during the wait because it's the current tree — untouched.
- **Future: resumable rendering.** Today, if an in-progress render is interrupted, React restarts from the root (skipping unchanged subtrees). A planned optimization would let React pick up exactly where it left off.

---

## 11. Quick Reference

```
createElement(type, props, ...children)
  → creates an Element (lightweight description)
  → Fiber reconciler compares new Elements to existing Fibers
  → Fibers persist across renders; Elements are ephemeral

Fiber lifecycle:
  beginWork   →  enter node, reconcile children, set up work
  completeWork →  exit node, create DOM nodes, wire children
  commitWork  →  flush all effects to the real DOM, swap trees

Key files:
  ReactElement.js           — createElement lives here
  ReactFiberBeginWork.js    — the big switch on fiber.tag
  ReactFiberCompleteWork.js — DOM node creation + child wiring
  ReactFiberCommitWork.js   — actual DOM mutations
  ReactWorkTags.js          — enum of all Fiber tag types
  ReactTypeOfMode.js        — bitmask values for modes
  ReactSymbols.js           — Symbol definitions for built-in types
```

---

*Based on a live coding session with Dan Abramov exploring React Fiber internals through the lens of building a "smoosh mode" feature.*
