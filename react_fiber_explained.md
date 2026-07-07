# React Fiber, Explained Simply

*A plain-language note on how React decides what to update, and why it matters for performance.*

---

## The Problem Fiber Solves

Imagine your web page has exactly **one worker** available to do everything: run your JavaScript, calculate layout, and paint pixels to the screen. That worker is the browser's **main thread**.

Before Fiber, whenever something changed in a React app (a click, new data from a server, etc.), React would grab that one worker and walk through the *entire* affected part of the component tree, top to bottom, in a single uninterrupted pass — figuring out what changed and immediately applying it. It could not stop halfway through, check if something more urgent had come in, and come back later. It just had to finish the whole job first.

That's fine for small updates. But once an app gets more interactive and complex, this becomes a real problem:

- A **big, low-urgency update** (like refreshing a "likes" counter from the server) could get started first.
- A **tiny, high-urgency update** (like the letter you just typed) has to wait in line behind it.
- The result: typing lags, animations stutter, scrolling feels janky — even though the update actually holding things up wasn't important enough to justify the delay.

Making React itself run faster doesn't fix this. The real issue is that **all updates were treated as equally urgent**, with no way to pause and let something more important go first.

---

## The Core Idea Behind Fiber

Fiber is React's rewrite of its internal update engine (called the **reconciler** — the part of React that figures out what changed and needs to be updated). Its whole purpose is to give React three new abilities it didn't have before:

1. **Pause work** partway through and hand control back to the browser.
2. **Resume** that work later, right where it left off.
3. **Prioritize** — let an urgent update jump the queue ahead of one that's already in progress.

Think of it like a project manager who used to do every task from start to finish in one go, no interruptions. Fiber teaches that manager how to break big jobs into smaller pieces, keep a clock running, and drop everything for a genuinely urgent request — then pick the old task back up afterward.

---

## How It Actually Works (Simplified)

### 1. A "fiber" is just a unit of work
Every component instance in your app gets a small JavaScript object called a **fiber**. Each fiber:
- Represents one piece of work (roughly: one component to process).
- Keeps a link to its child, its next sibling, and its parent, so React can walk the whole tree.
- Together, all these fibers form a **fiber tree** — a map of your entire app that React can walk through in small, resumable steps instead of one long recursive dive.

### 2. Two phases: "figure it out" vs. "make it real"
React splits the update process into two phases:

| Phase | What happens | Can it be paused? |
|---|---|---|
| **Render / Reconciliation phase** | React builds a "work-in-progress" version of the tree and figures out exactly what needs to change | ✅ Yes — this is where the pausing/resuming happens |
| **Commit phase** | React actually applies those changes to the real DOM | ❌ No — this has to happen in one go, or the screen would show a half-updated, inconsistent UI |

This separation is the key trick: all the *thinking* can be interrupted, but the *actual visual update* always happens instantly and completely once React starts it.

### 3. A background copy, not live edits
While figuring things out, React doesn't touch the real screen at all — it builds a separate "work-in-progress" copy of the tree in memory first. Only once that's fully worked out does it swap it in. This avoids showing users a flickering, half-finished screen, and lets React reuse memory efficiently between updates.

### 4. Everything gets a priority level
Not all updates are equal, so Fiber assigns each one a priority, roughly from most to least urgent:
- Immediate/synchronous updates
- Must-happen-this-tick updates
- Animation-frame updates
- High priority (e.g., you typing)
- Low priority (e.g., data quietly syncing from a server)
- Off-screen (things not currently visible, done last)

If a high-priority update arrives while React is partway through a low-priority one, React can drop the low-priority work-in-progress, handle the urgent one first, and come back to finish the rest afterward.

---

## Why This Matters in Practice

- **Smoother, more responsive apps.** Typing, scrolling, and animations stay fluid even while heavier background updates are happening — because urgent work no longer waits behind unimportant work.
- **The React DevTools Profiler makes more sense.** The "render phase" and "commit phase" you see in profiling tools map directly to this two-phase design.
- **It's the foundation for modern React features.** Concurrent rendering, `startTransition`, and automatic batching (React 18+) all exist *because* Fiber made pausable, prioritized rendering possible in the first place.
- **A few small behavior changes fall out of this.** For example, lifecycle methods can occasionally fire in a different order than developers expect, since a high-priority update can interrupt a low-priority one mid-flight.
- **It opens the door to future wins**, like streaming in parts of the UI as they load, or processing independent branches of the component tree in parallel.

---

## One-Line Summary (for a quick explanation to anyone)

> **Old React** did every update in one uninterruptible rush, so urgent changes could get stuck behind unimportant ones. **Fiber** broke that work into small, pausable, prioritizable pieces — so React can drop what it's doing for something urgent, then pick the rest back up — keeping the app fast and responsive.

---
*Based on Lin Clark's "A Cartoon Intro to Fiber" (React Conf 2017) — https://www.youtube.com/watch?v=ZCuYPiUIONs*
