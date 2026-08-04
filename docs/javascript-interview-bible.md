# The JavaScript Interview Bible
### The Deepest Guide Ever Written — From Engine Internals to Production War Stories

> This isn't a list of questions. This is the book that teaches you HOW JavaScript actually works so deeply that no question can surprise you. Every concept is explained the way you'd explain it to a colleague at a whiteboard — with the "why behind the why," real production stories, engine-level truth, and code you can run.

---

# TABLE OF CONTENTS

**PART I — THE ENGINE ROOM: How JavaScript Actually Runs**
- Chapter 1: Execution Context — The Hidden Backbone
- Chapter 2: Scope Chain & Lexical Environment
- Chapter 3: The Call Stack — Visualized
- Chapter 4: Memory Management & Garbage Collection
- Chapter 5: The Event Loop — The Full, Honest Truth

**PART II — THE TYPE SYSTEM: Every Edge Case That Exists**
- Chapter 6: Primitives — Deeper Than You Think
- Chapter 7: Type Coercion — The Complete Algorithm
- Chapter 8: == vs === — The Actual Specification Steps
- Chapter 9: typeof, instanceof, and Their Traps

**PART III — FUNCTIONS: The Heart of the Language**
- Chapter 10: Functions Are Objects (Really)
- Chapter 11: Closures — The Full Mental Model
- Chapter 12: `this` — Every Single Rule
- Chapter 13: call, apply, bind — Build Them Yourself
- Chapter 14: Higher-Order Functions & Functional Patterns

**PART IV — OBJECTS & PROTOTYPES: The Real Inheritance**
- Chapter 15: The Prototype Chain — What `class` Is Hiding
- Chapter 16: Property Descriptors & Object.defineProperty
- Chapter 17: Composition vs Inheritance — The Real Debate
- Chapter 18: Proxy & Reflect — Metaprogramming

**PART V — ASYNC MASTERY: Beyond the Basics**
- Chapter 19: Promises — Build One From Scratch
- Chapter 20: async/await — The Traps Nobody Warns You About
- Chapter 21: Generators & Iterators — The Protocol
- Chapter 22: Advanced Async Patterns (Race Conditions, Cancellation, Retry)

**PART VI — ADVANCED WEAPONS**
- Chapter 23: Symbol & Well-Known Symbols
- Chapter 24: WeakMap, WeakSet, WeakRef, FinalizationRegistry
- Chapter 25: Tagged Template Literals
- Chapter 26: Regex in JavaScript — Actually Useful
- Chapter 27: Modules Deep Dive — Static vs Dynamic Import

**PART VII — THE BROWSER: DOM, Events & APIs**
- Chapter 28: Event Bubbling, Capturing & Delegation
- Chapter 29: Critical Rendering Path
- Chapter 30: Web Storage, IndexedDB, Cookies
- Chapter 31: Web Workers & Service Workers
- Chapter 32: IntersectionObserver, MutationObserver, ResizeObserver

**PART VIII — PATTERNS & ARCHITECTURE**
- Chapter 33: Design Patterns in JavaScript
- Chapter 34: Error Handling — A Production Strategy
- Chapter 35: Security — XSS, Prototype Pollution, and More

**PART IX — PERFORMANCE**
- Chapter 36: The 4 Types of Memory Leaks
- Chapter 37: Debounce, Throttle, and requestAnimationFrame
- Chapter 38: Lazy Loading, Code Splitting, Tree Shaking

**PART X — 50 CODING CHALLENGES**
- Challenges 1–15: Foundation (Junior)
- Challenges 16–35: Intermediate (Mid-Level)
- Challenges 36–50: Advanced (Senior/Staff)

---

# PART I — THE ENGINE ROOM

---

## Chapter 1: Execution Context — The Hidden Backbone

Every time JavaScript runs a piece of code, it creates an invisible wrapper called an **Execution Context**. Understanding this is like understanding the foundation of a building — you never see it, but everything stands on it.

### What Is an Execution Context?

Think of it as a box that holds three things:

1. **Variable Environment** — all the variables, functions, and arguments declared in this scope
2. **Scope Chain** — a link to the parent context (how inner functions "see" outer variables)
3. **`this` binding** — what `this` refers to in this context

There are three types of execution contexts:

**Global Execution Context (GEC):** Created when your script first loads. In a browser, its `this` is the `window` object. In Node.js, it's the `global` object. There's only ever one of these.

**Function Execution Context (FEC):** Created every time a function is called. Each call gets its own context — even if the same function is called twice.

**Eval Execution Context:** Created when code runs inside `eval()`. We ignore this because you should never use `eval()`.

### The Two Phases

Every execution context goes through two phases:

**Phase 1 — Creation Phase (before your code runs a single line):**

JavaScript scans through the code and:
- Allocates memory for all `var` declarations (set to `undefined`)
- Allocates memory for all function declarations (stored in full)
- Sets up the scope chain
- Determines the value of `this`
- `let` and `const` declarations are noted but NOT initialized (they enter the Temporal Dead Zone)

This is hoisting. It's not "moving" code — it's the engine setting up memory before execution begins.

**Phase 2 — Execution Phase:**

JavaScript runs your code line by line, assigning values and executing logic.

```js
// Let's trace what the engine ACTUALLY does:

console.log(team);     // ?
console.log(greet);    // ?
console.log(score);    // ?

var team = 'Alpha';
let score = 100;

function greet() {
  return 'Hello';
}

// CREATION PHASE sets up:
// team → undefined (var is hoisted with undefined)
// greet → function greet() { return 'Hello' } (fully hoisted)
// score → TDZ (let is hoisted but NOT initialized)

// EXECUTION PHASE runs line by line:
// Line 1: console.log(team) → undefined
// Line 2: console.log(greet) → [Function: greet]
// Line 3: console.log(score) → ReferenceError! (TDZ)
// Script STOPS — lines after the error never run
```

### Why This Matters in Real Life

You're debugging a React app. A function works when defined with `function`, but breaks when you refactor it to `const`. Now you know why — the component tried to use it before the `const` line, and `const` doesn't hoist the same way.

### Interview Question: Trace the Execution

```js
var x = 1;

function outer() {
  console.log(x);    // ?
  var x = 2;
  console.log(x);    // ?

  function inner() {
    console.log(x);  // ?
    var x = 3;
    console.log(x);  // ?
  }

  inner();
  console.log(x);    // ?
}

outer();
console.log(x);      // ?
```

**Answer:** `undefined, 2, undefined, 3, 2, 1`

Each function creates its OWN execution context. The `var x` inside `outer` shadows the global `x`. The `var x` inside `inner` shadows the outer `x`. During each function's creation phase, its local `var x` is hoisted to `undefined`, which is what the first `console.log` in each function sees.

---

## Chapter 2: Scope Chain & Lexical Environment

### The Scope Chain Explained with a Building Metaphor

Imagine a 5-story building. Each floor is a scope. When you need something (a variable), you first check your own floor. If it's not there, you go down one floor. Then the next. All the way to the ground floor (global scope). You never go UP — only down.

```js
const building = 'Global Floor';         // Ground floor

function floor1() {
  const office = 'Floor 1 Office';

  function floor2() {
    const desk = 'Floor 2 Desk';

    function floor3() {
      // Needs: desk, office, building
      console.log(desk);       // Found on Floor 2 ✓
      console.log(office);     // Found on Floor 1 ✓
      console.log(building);   // Found on Ground Floor ✓
      console.log(basement);   // ReferenceError — doesn't exist anywhere
    }

    floor3();
  }

  floor2();
}

floor1();
```

### Lexical vs Dynamic Scope

JavaScript uses **lexical (static) scope** — the scope is determined by WHERE the function is WRITTEN in the code, not where it's called from.

```js
const name = 'Global';

function printName() {
  console.log(name);
}

function wrapper() {
  const name = 'Wrapper';
  printName();  // What prints?
}

wrapper(); // "Global" — NOT "Wrapper"
```

Why "Global"? Because `printName` was WRITTEN in the global scope. Its scope chain is `printName → global`. It doesn't matter that it was CALLED from inside `wrapper`. The scope chain is set when the function is created (written), not when it's invoked.

This is the foundation of closures. Memorize this: **a function's scope chain is baked in at creation time**.

### Block Scope vs Function Scope

```js
function example() {
  // Function scope — var lives here
  var funcScoped = 'I exist in the entire function';

  if (true) {
    // Block scope — let/const live here
    let blockScoped = 'I only exist in this if-block';
    var stillFuncScoped = 'I leak out of this block';
  }

  console.log(funcScoped);      // ✓ accessible
  console.log(stillFuncScoped); // ✓ accessible (var ignores blocks)
  console.log(blockScoped);     // ReferenceError (let stays in block)
}
```

### The Scope Chain in Closures — The Engine View

When a function is created, the engine attaches an internal property called `[[Environment]]` that points to the scope where the function was born. This is a direct reference to the parent's variable storage, not a copy. That's why closures work — the inner function holds a living reference to the outer scope's variables.

```js
function createMultiplier(factor) {
  // factor = 5 is stored in this execution context
  // When we return the inner function, it carries a [[Environment]]
  // pointer back to THIS context

  return function(number) {
    // This function was born inside createMultiplier's scope
    // Its [[Environment]] points to { factor: 5 }
    return number * factor;
  };
}

const double = createMultiplier(2);  // [[Environment]] → { factor: 2 }
const triple = createMultiplier(3);  // [[Environment]] → { factor: 3 }

// createMultiplier has finished running, but its context is NOT
// garbage collected because double and triple still reference it

double(10); // 20
triple(10); // 30
```

---

## Chapter 3: The Call Stack — Visualized

The call stack is JavaScript's to-do list. It's a LIFO (Last In, First Out) data structure. Functions go on top when called, and come off the top when they return.

### Stack Overflow — How It Happens

```js
function chicken() {
  return egg();
}

function egg() {
  return chicken();
}

chicken();
// RangeError: Maximum call stack size exceeded
```

The stack grows with every call but nothing ever returns, so it keeps growing until the engine says "enough" (typically around 10,000–25,000 frames depending on the engine).

### Real-World Stack Trace Reading

When you see an error in production:

```
TypeError: Cannot read property 'name' of undefined
    at formatUser (utils.js:42)
    at processOrder (orders.js:18)
    at handleSubmit (form.js:7)
    at HTMLButtonElement.onclick (index.html:15)
```

Read it bottom to top: the user clicked a button → `handleSubmit` was called → which called `processOrder` → which called `formatUser` → which crashed because something was `undefined`. The stack trace IS the call stack at the moment of the crash.

---

## Chapter 4: Memory Management & Garbage Collection

### How JavaScript Manages Memory

JavaScript handles memory automatically, but "automatic" doesn't mean "perfect." Understanding this prevents some of the worst production bugs.

**The lifecycle:**

1. **Allocate** — you create a variable, the engine finds memory for it
2. **Use** — you read and write the variable
3. **Release** — when the variable is no longer reachable, the Garbage Collector (GC) frees the memory

### Mark-and-Sweep — How the GC Works

The GC starts from "roots" (global object, currently executing functions, etc.) and follows every reference chain. Anything it can reach is "alive." Anything it can't reach is "garbage" and gets freed.

```js
function processData() {
  const hugeArray = new Array(1000000).fill('data');
  // hugeArray is reachable here — GC won't touch it

  const result = hugeArray.length;
  return result;
}
// After processData() returns, hugeArray is no longer reachable
// from any root. GC will eventually free it.
```

### The 4 Types of Memory Leaks (Senior-Level Knowledge)

**Leak Type 1: Accidental Globals**

```js
function handleData() {
  results = [];  // No const/let/var — this is now window.results!
  // It will NEVER be garbage collected because globals are always reachable
}
```

**Leak Type 2: Forgotten Timers and Callbacks**

```js
// This interval runs FOREVER, and the closure keeps `hugeData` alive
const hugeData = loadMassiveDataset();

setInterval(() => {
  const element = document.getElementById('status');
  if (element) {
    element.textContent = hugeData.summary;
  }
  // Even if #status is removed from the DOM, this interval keeps running
  // and keeps hugeData in memory
}, 5000);

// FIX: Store the interval ID and clear it when done
const intervalId = setInterval(/* ... */);
// Later:
clearInterval(intervalId);
```

**Leak Type 3: Detached DOM References**

```js
const elements = {};

function addButton() {
  const btn = document.createElement('button');
  document.body.appendChild(btn);
  elements.myButton = btn;  // JS reference stored
}

function removeButton() {
  document.body.removeChild(elements.myButton);
  // The DOM node is removed from the page BUT
  // elements.myButton still references it in JS memory!
  // The GC can't free it.

  // FIX: Also delete the JS reference
  elements.myButton = null;
}
```

**Leak Type 4: Closures Holding Onto Large Scopes**

```js
function createProcessor() {
  const cache = new Map();       // Grows forever
  const hugeBuffer = Buffer.alloc(1024 * 1024 * 50); // 50MB

  return function process(key, data) {
    cache.set(key, data);
    // cache is NEVER cleared — it grows with every call
    // hugeBuffer is captured by the closure even if process() never uses it
  };
}

// FIX: Only capture what you need, and implement cache eviction
function createProcessor() {
  const cache = new Map();
  const MAX_CACHE = 1000;

  return function process(key, data) {
    if (cache.size >= MAX_CACHE) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    cache.set(key, data);
  };
}
```

---

## Chapter 5: The Event Loop — The Full, Honest Truth

Most guides show you the simple version. This is the complete version.

### The Architecture

```
┌───────────────────────────────────────────────┐
│                  Call Stack                     │
│  (your synchronous code runs here, one         │
│   function at a time)                          │
└─────────────────────┬─────────────────────────┘
                      │ When stack is empty,
                      │ the Event Loop checks:
                      ▼
┌─────────────────────────────────────────────────┐
│  1. MICROTASK QUEUE (drain ALL before moving on)│
│     - Promise.then / .catch / .finally          │
│     - queueMicrotask()                          │
│     - MutationObserver callbacks                │
│     - await (resumes after await are microtasks)│
└─────────────────────┬───────────────────────────┘
                      │ All microtasks drained?
                      ▼
┌─────────────────────────────────────────────────┐
│  2. RENDER STEPS (if browser, ~every 16.67ms)   │
│     - requestAnimationFrame callbacks            │
│     - Style calculation                          │
│     - Layout                                     │
│     - Paint                                      │
└─────────────────────┬───────────────────────────┘
                      │ Render done (or skipped)?
                      ▼
┌─────────────────────────────────────────────────┐
│  3. MACROTASK QUEUE (pick ONE, then loop back)  │
│     - setTimeout / setInterval                   │
│     - setImmediate (Node.js)                     │
│     - I/O callbacks                              │
│     - UI events (click, scroll, keydown)         │
│     - MessageChannel                             │
└─────────────────────────────────────────────────┘
```

The critical rule: **All microtasks drain completely before any macrotask runs**. And between macrotasks, all microtasks drain again. This means a microtask that queues another microtask will run BEFORE the next setTimeout — even if that setTimeout's delay is 0.

### The Ultimate Event Loop Question

Predict the exact output order:

```js
console.log('1');

setTimeout(() => {
  console.log('2');
  Promise.resolve().then(() => console.log('3'));
}, 0);

Promise.resolve().then(() => {
  console.log('4');
  setTimeout(() => console.log('5'), 0);
});

Promise.resolve().then(() => console.log('6'));

setTimeout(() => console.log('7'), 0);

console.log('8');
```

**Answer: `1, 8, 4, 6, 2, 3, 7, 5`**

Trace:

1. `1` — synchronous, runs immediately
2. `setTimeout(() => '2'...)` — macrotask queued (M1)
3. `Promise.then(() => '4'...)` — microtask queued (m1)
4. `Promise.then(() => '6')` — microtask queued (m2)
5. `setTimeout(() => '7')` — macrotask queued (M2)
6. `8` — synchronous, runs immediately

Stack is now empty. Drain microtask queue:
7. m1 runs: `4` prints. It schedules `setTimeout(() => '5')` (M3).
8. m2 runs: `6` prints.

Microtask queue is empty. Pick next macrotask:
9. M1 runs: `2` prints. It schedules `Promise.then(() => '3')` (m3).
   Drain microtasks before next macrotask: m3 runs: `3` prints.

Pick next macrotask:
10. M2 runs: `7` prints.

Pick next macrotask:
11. M3 runs: `5` prints.

### requestAnimationFrame — Where Does It Fit?

`requestAnimationFrame` (rAF) is not a macrotask and not a microtask. It runs during the render step, AFTER microtasks but BEFORE the next macrotask:

```js
setTimeout(() => console.log('setTimeout'), 0);
requestAnimationFrame(() => console.log('rAF'));
Promise.resolve().then(() => console.log('Promise'));

// Typical output: Promise, rAF, setTimeout
// (but rAF timing depends on the browser's paint schedule)
```

### Node.js Event Loop — The Differences

Node.js has a more complex event loop with 6 phases: timers → pending callbacks → idle/prepare → poll → check → close callbacks. The key difference is `process.nextTick()`, which runs BEFORE Promise microtasks:

```js
Promise.resolve().then(() => console.log('Promise'));
process.nextTick(() => console.log('nextTick'));

// Node.js output: nextTick, Promise
// (nextTick queue drains before the Promise microtask queue)
```

---

# PART II — THE TYPE SYSTEM

---

## Chapter 6: Primitives — Deeper Than You Think

### The 7 Primitive Types

```
string   → 'hello', "world", `template`
number   → 42, 3.14, Infinity, NaN, -0
boolean  → true, false
null     → null (intentional absence)
undefined → undefined (unintentional absence / not yet assigned)
symbol   → Symbol('description') (unique, immutable identifier)
bigint   → 42n, 9007199254740993n (arbitrary precision integers)
```

### The Weird Parts Nobody Teaches

**-0 exists and has real uses:**

```js
const negZero = -0;
negZero === 0;           // true (=== lies here!)
Object.is(negZero, 0);  // false (Object.is tells the truth)
1 / negZero;             // -Infinity
1 / 0;                   // Infinity

// Real use: tracking direction in animations
// velocity of -0 means "moving left but stopped"
// velocity of 0 means "moving right but stopped"
```

**NaN — the only value not equal to itself:**

```js
NaN === NaN;            // false (this is by IEEE 754 specification)
Number.isNaN(NaN);      // true (correct way to check)
isNaN('hello');          // true (WRONG — coerces string first)
Number.isNaN('hello');  // false (correct — no coercion)
```

**Autoboxing — how primitives have methods:**

```js
const str = 'hello';
str.toUpperCase(); // 'HELLO' — but str is a primitive, not an object!

// Behind the scenes, the engine does:
// 1. Creates a temporary String object: new String('hello')
// 2. Calls .toUpperCase() on it
// 3. Returns 'HELLO'
// 4. Throws away the temporary object

// This is why this FAILS:
str.customProp = 'test';
console.log(str.customProp); // undefined
// The temporary object was discarded
```

### typeof — The Complete Results Table

```js
typeof undefined      // "undefined"
typeof null           // "object" ← FAMOUS BUG (since JS 1.0, can never be fixed)
typeof true           // "boolean"
typeof 42             // "number"
typeof 'hello'        // "string"
typeof Symbol()       // "symbol"
typeof 42n            // "bigint"
typeof {}             // "object"
typeof []             // "object" ← arrays are objects
typeof function(){}   // "function" ← special case, actually an object
typeof NaN            // "number" ← NaN is a number 🤯
```

**The reliable type check:**

```js
function getType(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}
```

---

## Chapter 7: Type Coercion — The Complete Algorithm

This is what separates a JavaScript developer who "knows" the language from one who truly UNDERSTANDS it.

### The Three Coercion Types

JavaScript converts values using three abstract operations:

**ToPrimitive(input)** — converts objects to primitives:
1. If input has `[Symbol.toPrimitive]()`, call it
2. Otherwise, try `valueOf()`, then `toString()` (for numbers)
3. Or try `toString()`, then `valueOf()` (for strings)

**ToNumber(input):**
```js
Number(undefined)   // NaN
Number(null)        // 0
Number(true)        // 1
Number(false)       // 0
Number('')          // 0
Number(' ')         // 0 (whitespace strings → 0)
Number('123')       // 123
Number('123abc')    // NaN
Number([])          // 0 ([] → '' → 0)
Number([5])         // 5 ([5] → '5' → 5)
Number([1,2])       // NaN ([1,2] → '1,2' → NaN)
Number({})          // NaN
```

**ToString(input):**
```js
String(undefined)   // 'undefined'
String(null)        // 'null'
String(true)        // 'true'
String(false)       // 'false'
String(0)           // '0'
String(-0)          // '0' (not '-0'!)
String([1,2,3])     // '1,2,3'
String({})          // '[object Object]'
```

### The + Operator — The Full Rules

The `+` operator is special because it does BOTH addition and concatenation:

**Rule 1:** If either operand is a string, convert the other to a string and concatenate.
**Rule 2:** Otherwise, convert both to numbers and add.
**Rule 3:** Objects get ToPrimitive first (which usually gives a string via toString).

```js
// String wins — concatenation
'5' + 3        // '53'
3 + '5'        // '35'
'5' + null     // '5null'
'5' + undefined // '5undefined'

// Both numbers — addition
5 + 3          // 8
5 + null       // 5 (null → 0)
5 + undefined  // NaN (undefined → NaN)

// Objects — ToPrimitive first
5 + {}         // '5[object Object]'
[] + []        // '' (both become '' then concatenate)
[] + {}        // '[object Object]'
{} + []        // 0 (ONLY in console — {} is parsed as empty block, +[] is 0)

// The most confusing one:
true + true    // 2 (both → 1, then 1 + 1)
true + '1'     // 'true1' (string wins)
```

---

## Chapter 8: == vs === — The Actual Specification

### The === Algorithm (Strict Equality)

Simple: if the types are different, return `false`. If the types are the same, compare values. Done.

The only special case: `NaN !== NaN`.

### The == Algorithm (Abstract Equality) — Step by Step

This is the exact algorithm from the ECMAScript specification:

```
1. If types are the same → use ===
2. null == undefined → true
3. undefined == null → true
4. number == string → convert string to number, then compare
5. boolean == anything → convert boolean to number, then compare
6. object == primitive → convert object via ToPrimitive, then compare
```

Let's trace some infamous examples:

```js
// Example 1: [] == false
// Step: boolean == anything → convert boolean to number
// false → 0, so now: [] == 0
// Step: object == primitive → ToPrimitive([])
// [].toString() → '', so now: '' == 0
// Step: string == number → ToNumber('')
// '' → 0, so now: 0 == 0
// Result: true ✓

// Example 2: [] == ![]
// First, ![] is evaluated: [] is truthy, so ![] → false
// Now: [] == false → (same as Example 1) → true ✓
// An array is "equal" to its own negation!

// Example 3: '' == 0
// string == number → ToNumber('')
// '' → 0, so: 0 == 0
// Result: true ✓

// Example 4: '0' == false
// boolean == anything → ToNumber(false) → 0
// '0' == 0 → string == number → ToNumber('0') → 0
// 0 == 0 → true ✓

// But: '' == false → true AND '0' == false → true
// Yet: '' == '0' → false! (same type, different strings)
// Transitivity is BROKEN with ==
```

### When == Is Actually Useful

There's exactly one legitimate use: checking for `null` OR `undefined` in one comparison.

```js
// Without == (verbose)
if (value === null || value === undefined) {
  // ...
}

// With == (clean, and this IS safe)
if (value == null) {
  // catches both null and undefined, nothing else
}
```

The Airbnb guide still says use `===` everywhere for consistency. But knowing that `== null` is safe is senior-level knowledge.

---

## Chapter 9: instanceof and Its Traps

### How instanceof Works

`instanceof` walks up the prototype chain of the left side, checking if any prototype matches the right side's `.prototype`:

```js
class Animal {}
class Dog extends Animal {}

const rex = new Dog();

rex instanceof Dog;    // true — Dog.prototype is in rex's chain
rex instanceof Animal; // true — Animal.prototype is also in rex's chain
rex instanceof Object; // true — Object.prototype is at the end of every chain
```

### The Traps

**Trap 1: Primitives always return false:**

```js
'hello' instanceof String;  // false — primitives aren't objects
42 instanceof Number;        // false

// vs
new String('hello') instanceof String; // true — this IS an object
```

**Trap 2: Cross-frame/realm issues:**

```js
// If you receive an array from an iframe or a different Node.js module
// (like via JSON.parse in a worker), instanceof may fail because
// each realm has its own Array constructor

const arr = iframe.contentWindow.eval('[]');
arr instanceof Array;        // false!
Array.isArray(arr);           // true — this is the reliable way
```

**Trap 3: You can fake it with Symbol.hasInstance:**

```js
class EvenNumber {
  static [Symbol.hasInstance](num) {
    return typeof num === 'number' && num % 2 === 0;
  }
}

4 instanceof EvenNumber;  // true
5 instanceof EvenNumber;  // false
```

---

# PART III — FUNCTIONS

---

## Chapter 10: Functions Are Objects

In JavaScript, functions are first-class objects. They can have properties, be passed as arguments, and be returned from other functions.

```js
function greet(name) {
  return `Hello, ${name}`;
}

// Functions have properties
console.log(greet.name);     // 'greet'
console.log(greet.length);   // 1 (number of parameters)

// You can add custom properties
greet.callCount = 0;
function trackedGreet(name) {
  trackedGreet.callCount += 1;
  return greet(name);
}

// Functions have a prototype property (used when called with new)
console.log(greet.prototype); // {} (every function gets one)
```

### arguments vs rest — The Full Story

```js
function oldWay() {
  console.log(arguments);        // { 0: 'a', 1: 'b', length: 2 } — array-LIKE
  console.log(arguments.map);    // undefined — it's NOT an array!
  // To use array methods, you had to convert it:
  const args = Array.prototype.slice.call(arguments);
}

function newWay(...args) {
  console.log(args);             // ['a', 'b'] — a REAL array
  console.log(args.map);         // [Function: map] — all array methods work
}

// Arrow functions don't have `arguments` at all:
const arrowFn = () => {
  console.log(arguments); // ReferenceError (or captures outer arguments)
};
```

---

## Chapter 11: Closures — The Full Mental Model

### The Definition That Actually Makes Sense

A closure is not complicated. A closure happens when:
1. You have a function INSIDE another function
2. The inner function USES a variable from the outer function
3. The inner function is ACCESSIBLE after the outer function has returned

That's it. The inner function "closes over" the outer variables, keeping them alive.

### The Five Closure Patterns Every Developer Must Know

**Pattern 1: Data Privacy (The Module Pattern)**

```js
function createBankAccount(initialBalance) {
  let balance = initialBalance; // Private — no one can access directly

  return {
    deposit(amount) {
      if (amount <= 0) throw new Error('Deposit must be positive');
      balance += amount;
      return balance;
    },
    withdraw(amount) {
      if (amount > balance) throw new Error('Insufficient funds');
      balance -= amount;
      return balance;
    },
    getBalance() {
      return balance;
    },
  };
}

const account = createBankAccount(1000);
account.deposit(500);     // 1500
account.withdraw(200);    // 1300
account.getBalance();     // 1300
account.balance;          // undefined — truly private!
```

**Pattern 2: Function Factory**

```js
function createTaxCalculator(taxRate) {
  return function(amount) {
    return amount + (amount * taxRate);
  };
}

const calcGST = createTaxCalculator(0.18);      // India GST 18%
const calcVAT = createTaxCalculator(0.20);      // UK VAT 20%
const calcSalesTax = createTaxCalculator(0.0725); // CA sales tax

calcGST(1000);       // 1180
calcVAT(1000);       // 1200
calcSalesTax(1000);  // 1072.5
```

**Pattern 3: Memoization / Caching**

```js
function createExpensiveProcessor() {
  const cache = new Map();

  return function process(input) {
    if (cache.has(input)) {
      console.log('Cache hit');
      return cache.get(input);
    }

    console.log('Computing...');
    // Simulate expensive operation
    const result = input.split('').reverse().join('').toUpperCase();
    cache.set(input, result);
    return result;
  };
}

const process = createExpensiveProcessor();
process('hello');  // Computing... → 'OLLEH'
process('hello');  // Cache hit → 'OLLEH' (instant)
process('world');  // Computing... → 'DLROW'
```

**Pattern 4: Event Handler State**

```js
function createToggleButton(element) {
  let isOn = false; // State persists across clicks via closure

  element.addEventListener('click', () => {
    isOn = !isOn;
    element.textContent = isOn ? 'ON' : 'OFF';
    element.style.backgroundColor = isOn ? '#4CAF50' : '#f44336';
  });
}
```

**Pattern 5: Partial Application**

```js
function createLogger(prefix) {
  return function(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${prefix}] ${message}`);
  };
}

const dbLog = createLogger('DATABASE');
const apiLog = createLogger('API');
const authLog = createLogger('AUTH');

dbLog('Connection established');    // [2026-08-04...] [DATABASE] Connection established
apiLog('Request received');         // [2026-08-04...] [API] Request received
authLog('User logged in');          // [2026-08-04...] [AUTH] User logged in
```

### The Classic Closure Trap (and 3 Fixes)

```js
// THE BUG
for (var i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 5, 5, 5, 5, 5 — because var i is shared across all iterations

// FIX 1: let (creates new binding per iteration)
for (let i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 100);
}

// FIX 2: IIFE (creates new scope per iteration)
for (var i = 0; i < 5; i++) {
  (function(j) {
    setTimeout(() => console.log(j), 100);
  })(i);
}

// FIX 3: setTimeout's third argument (passed to the callback)
for (var i = 0; i < 5; i++) {
  setTimeout((j) => console.log(j), 100, i);
}
```

---

## Chapter 12: `this` — Every Single Rule, Ranked by Priority

When multiple rules could apply, the one higher on this list wins:

### Rule 1 (Highest Priority): `new` Keyword

```js
function Person(name) {
  // this = brand new empty object
  this.name = name;
  // return this (implicit)
}

const alice = new Person('Alice');
// this = { name: 'Alice' }
```

### Rule 2: Explicit Binding (call, apply, bind)

```js
function greet() {
  return `Hello, ${this.name}`;
}

const user = { name: 'Bob' };

greet.call(user);    // 'Hello, Bob' — this = user
greet.apply(user);   // 'Hello, Bob' — this = user
const bound = greet.bind(user);
bound();             // 'Hello, Bob' — this = user (permanently)
```

### Rule 3: Implicit Binding (Dot Notation)

```js
const obj = {
  name: 'Charlie',
  greet() {
    return `Hello, ${this.name}`;
  }
};

obj.greet(); // 'Hello, Charlie' — this = object before the dot
```

**The Implicit Binding Trap (Lost `this`):**

```js
const obj = {
  name: 'Charlie',
  greet() { return `Hello, ${this.name}`; }
};

const fn = obj.greet;  // Extracting the method — loses the object!
fn(); // 'Hello, undefined' — this is now global/undefined

// This happens ALL THE TIME with callbacks:
setTimeout(obj.greet, 100); // 'Hello, undefined'

// FIX: bind, or use an arrow function wrapper
setTimeout(() => obj.greet(), 100); // 'Hello, Charlie'
setTimeout(obj.greet.bind(obj), 100); // 'Hello, Charlie'
```

### Rule 4 (Lowest Priority): Default Binding

```js
function standalone() {
  return this;
}

standalone(); // window (browser) or global (Node.js) — in sloppy mode
// undefined — in strict mode ('use strict')
```

### Arrow Functions: NOT a Rule — A Different System

Arrow functions don't have their own `this`. They capture `this` from the enclosing scope at creation time. No rule can override it:

```js
const obj = {
  name: 'Dave',
  // arrow function captures `this` from where it's written
  // which is the global scope (or module scope)
  greet: () => `Hello, ${this.name}`,
};

obj.greet(); // 'Hello, undefined' — this is NOT obj!

// Arrow functions shine inside methods:
const obj2 = {
  name: 'Eve',
  greetDelayed() {
    // this = obj2 (regular method call)
    setTimeout(() => {
      // Arrow inherits this from greetDelayed — it's obj2!
      console.log(`Hello, ${this.name}`);
    }, 100);
  },
};

obj2.greetDelayed(); // 'Hello, Eve' ✓
```

---

## Chapter 13: call, apply, bind — Build Them Yourself

Understanding these deeply means building them from scratch.

### Implement call

```js
Function.prototype.myCall = function(context, ...args) {
  // If context is null/undefined, default to globalThis
  context = context ?? globalThis;
  // Wrap primitive values
  context = Object(context);

  // Create a unique key so we don't overwrite existing properties
  const uniqueKey = Symbol('fn');
  context[uniqueKey] = this;   // 'this' here is the function being called

  const result = context[uniqueKey](...args);
  delete context[uniqueKey];   // Clean up

  return result;
};
```

### Implement apply

```js
Function.prototype.myApply = function(context, args = []) {
  context = context ?? globalThis;
  context = Object(context);

  const uniqueKey = Symbol('fn');
  context[uniqueKey] = this;

  const result = context[uniqueKey](...args);
  delete context[uniqueKey];

  return result;
};
```

### Implement bind

```js
Function.prototype.myBind = function(context, ...boundArgs) {
  const fn = this;

  return function boundFn(...callArgs) {
    // Support use as constructor with 'new'
    if (new.target) {
      return new fn(...boundArgs, ...callArgs);
    }
    return fn.apply(context, [...boundArgs, ...callArgs]);
  };
};
```

---

## Chapter 14: Higher-Order Functions & Functional Patterns

### Build map, filter, reduce From Scratch

```js
// MAP — transform every element
Array.prototype.myMap = function(callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this) { // Handle sparse arrays
      result.push(callback(this[i], i, this));
    }
  }
  return result;
};

// FILTER — keep elements that pass the test
Array.prototype.myFilter = function(callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this && callback(this[i], i, this)) {
      result.push(this[i]);
    }
  }
  return result;
};

// REDUCE — accumulate into a single value
Array.prototype.myReduce = function(callback, initialValue) {
  let accumulator;
  let startIndex;

  if (arguments.length >= 2) {
    accumulator = initialValue;
    startIndex = 0;
  } else {
    if (this.length === 0) throw new TypeError('Reduce of empty array with no initial value');
    accumulator = this[0];
    startIndex = 1;
  }

  for (let i = startIndex; i < this.length; i++) {
    if (i in this) {
      accumulator = callback(accumulator, this[i], i, this);
    }
  }

  return accumulator;
};
```

### Compose and Pipe — Functional Architecture

```js
// Compose: right to left (mathematical tradition)
const compose = (...fns) =>
  (value) => fns.reduceRight((acc, fn) => fn(acc), value);

// Pipe: left to right (readable order)
const pipe = (...fns) =>
  (value) => fns.reduce((acc, fn) => fn(acc), value);

// Usage — data processing pipeline
const processUser = pipe(
  (user) => ({ ...user, name: user.name.trim() }),
  (user) => ({ ...user, email: user.email.toLowerCase() }),
  (user) => ({ ...user, age: Number(user.age) }),
  (user) => {
    if (user.age < 0 || user.age > 150) throw new Error('Invalid age');
    return user;
  },
);

processUser({ name: '  Alice  ', email: 'ALICE@Example.COM', age: '30' });
// { name: 'Alice', email: 'alice@example.com', age: 30 }
```

---

# PART IV — OBJECTS & PROTOTYPES

---

## Chapter 15: The Prototype Chain — What `class` Is Hiding

### The Chain Visualized

```js
const dog = { bark() { return 'Woof!'; } };

// When you call dog.bark():
// 1. Engine checks: does dog have 'bark'? YES → call it

// When you call dog.toString():
// 1. Engine checks: does dog have 'toString'? NO
// 2. Follow dog.__proto__ → Object.prototype
// 3. Does Object.prototype have 'toString'? YES → call it

// When you call dog.fly():
// 1. Engine checks: does dog have 'fly'? NO
// 2. Follow dog.__proto__ → Object.prototype — NO
// 3. Follow Object.prototype.__proto__ → null (end of chain)
// 4. Return undefined
```

### What `class` Actually Creates

```js
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal {
  bark() {
    return `${this.name} says Woof!`;
  }
}

// Under the hood, this creates:
// Dog.prototype = { bark: [Function], __proto__: Animal.prototype }
// Animal.prototype = { speak: [Function], __proto__: Object.prototype }

const rex = new Dog('Rex');
// rex = { name: 'Rex', __proto__: Dog.prototype }

// The prototype chain:
// rex → Dog.prototype → Animal.prototype → Object.prototype → null
```

### Object.create — The Raw Prototype Tool

```js
const vehicleProto = {
  start() { return `${this.model} starting...`; },
  stop() { return `${this.model} stopping...`; },
};

const car = Object.create(vehicleProto);
car.model = 'Tesla Model 3';
car.start(); // 'Tesla Model 3 starting...'

// car's prototype chain:
// car → vehicleProto → Object.prototype → null
```

---

## Chapter 16: Property Descriptors

Every property has hidden attributes that control its behavior:

```js
const user = { name: 'Alice' };

console.log(Object.getOwnPropertyDescriptor(user, 'name'));
// {
//   value: 'Alice',
//   writable: true,     ← can the value change?
//   enumerable: true,   ← does it show in for...in loops?
//   configurable: true  ← can this descriptor be changed?
// }

// Make a property read-only
Object.defineProperty(user, 'id', {
  value: 12345,
  writable: false,       // Can't change the value
  enumerable: true,      // Shows in Object.keys()
  configurable: false,   // Can't delete or reconfigure
});

user.id = 99999;        // Silently fails (or throws in strict mode)
console.log(user.id);   // 12345
```

### Getters and Setters — Computed Properties

```js
const temperature = {
  _celsius: 0,

  get fahrenheit() {
    return this._celsius * 9/5 + 32;
  },

  set fahrenheit(value) {
    this._celsius = (value - 32) * 5/9;
  },

  get celsius() {
    return this._celsius;
  },

  set celsius(value) {
    if (value < -273.15) throw new Error('Below absolute zero');
    this._celsius = value;
  },
};

temperature.celsius = 100;
console.log(temperature.fahrenheit); // 212
temperature.fahrenheit = 32;
console.log(temperature.celsius);    // 0
```

---

## Chapter 17: Composition vs Inheritance

### Why "Favor Composition Over Inheritance"

Inheritance creates rigid hierarchies. What if you need a `FlyingSwimmingRobot`?

```js
// INHERITANCE: The Diamond Problem
class Animal { eat() {} }
class Flyer extends Animal { fly() {} }
class Swimmer extends Animal { swim() {} }
// class FlyingSwimmer extends Flyer, Swimmer {} ← IMPOSSIBLE in JS

// COMPOSITION: Mix and match
const canFly = (state) => ({
  fly: () => `${state.name} is flying at ${state.altitude}ft`,
});

const canSwim = (state) => ({
  swim: () => `${state.name} is swimming at ${state.depth}m`,
});

const canWalk = (state) => ({
  walk: () => `${state.name} is walking`,
});

function createDuck(name) {
  const state = { name, altitude: 0, depth: 0 };

  return {
    ...canFly(state),
    ...canSwim(state),
    ...canWalk(state),
    quack: () => `${name}: Quack!`,
  };
}

const duck = createDuck('Donald');
duck.fly();   // 'Donald is flying at 0ft'
duck.swim();  // 'Donald is swimming at 0m'
duck.quack(); // 'Donald: Quack!'
```

---

## Chapter 18: Proxy & Reflect — Metaprogramming

Proxy lets you intercept and customize fundamental operations on objects.

### Validation Proxy

```js
function createValidatedObject(schema) {
  return new Proxy({}, {
    set(target, property, value) {
      if (property in schema) {
        const validator = schema[property];
        if (!validator(value)) {
          throw new TypeError(
            `Invalid value for "${property}": ${JSON.stringify(value)}`
          );
        }
      }
      target[property] = value;
      return true;
    },
  });
}

const user = createValidatedObject({
  name: (v) => typeof v === 'string' && v.length > 0,
  age: (v) => typeof v === 'number' && v >= 0 && v <= 150,
  email: (v) => typeof v === 'string' && v.includes('@'),
});

user.name = 'Alice';          // ✓
user.age = 30;                // ✓
user.email = 'a@b.com';       // ✓
user.age = -5;                // TypeError: Invalid value for "age"
user.email = 'not-an-email';  // TypeError: Invalid value for "email"
```

### Negative Array Indexing (Like Python)

```js
function createSmartArray(...items) {
  return new Proxy(items, {
    get(target, prop) {
      const index = Number(prop);
      if (Number.isInteger(index) && index < 0) {
        return target[target.length + index];
      }
      return Reflect.get(target, prop);
    },
  });
}

const arr = createSmartArray('a', 'b', 'c', 'd', 'e');
arr[-1];  // 'e'
arr[-2];  // 'd'
arr[0];   // 'a'
```

### Observable Object (Change Detection)

```js
function createObservable(target, onChange) {
  return new Proxy(target, {
    set(obj, prop, value) {
      const oldValue = obj[prop];
      obj[prop] = value;
      onChange({ property: prop, oldValue, newValue: value });
      return true;
    },
    deleteProperty(obj, prop) {
      const oldValue = obj[prop];
      delete obj[prop];
      onChange({ property: prop, oldValue, newValue: undefined, deleted: true });
      return true;
    },
  });
}

const state = createObservable({ count: 0, name: 'App' }, (change) => {
  console.log(`${change.property}: ${change.oldValue} → ${change.newValue}`);
});

state.count = 1;    // count: 0 → 1
state.name = 'MyApp'; // name: App → MyApp
```

---

# PART V — ASYNC MASTERY

---

## Chapter 19: Promises — Build One From Scratch

### A Simplified Promise Implementation

```js
class MyPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.callbacks = [];

    const resolve = (value) => {
      if (this.state !== 'pending') return;
      this.state = 'fulfilled';
      this.value = value;
      this.callbacks.forEach((cb) => cb.onFulfilled(value));
    };

    const reject = (reason) => {
      if (this.state !== 'pending') return;
      this.state = 'rejected';
      this.value = reason;
      this.callbacks.forEach((cb) => cb.onRejected(reason));
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const handle = (callback, fallback) => (value) => {
        try {
          if (typeof callback === 'function') {
            const result = callback(value);
            if (result instanceof MyPromise) {
              result.then(resolve, reject);
            } else {
              resolve(result);
            }
          } else {
            fallback(value);
          }
        } catch (err) {
          reject(err);
        }
      };

      if (this.state === 'fulfilled') {
        queueMicrotask(() => handle(onFulfilled, resolve)(this.value));
      } else if (this.state === 'rejected') {
        queueMicrotask(() => handle(onRejected, reject)(this.value));
      } else {
        this.callbacks.push({
          onFulfilled: handle(onFulfilled, resolve),
          onRejected: handle(onRejected, reject),
        });
      }
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  static resolve(value) {
    return new MyPromise((resolve) => resolve(value));
  }

  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason));
  }
}
```

---

## Chapter 20: async/await — The Traps Nobody Warns You About

### Trap 1: Sequential When You Mean Parallel

```js
// SLOW — each awaits waits for the previous one (3 seconds total)
async function fetchAllSlow() {
  const users = await fetchUsers();       // 1 second
  const products = await fetchProducts(); // 1 second (starts AFTER users)
  const orders = await fetchOrders();     // 1 second (starts AFTER products)
  return { users, products, orders };
}

// FAST — all three run simultaneously (1 second total)
async function fetchAllFast() {
  const [users, products, orders] = await Promise.all([
    fetchUsers(),
    fetchProducts(),
    fetchOrders(),
  ]);
  return { users, products, orders };
}
```

### Trap 2: forEach Doesn't Wait for Async

```js
// BROKEN — all requests fire simultaneously, forEach doesn't await
const ids = [1, 2, 3, 4, 5];
ids.forEach(async (id) => {
  const data = await fetchData(id);
  console.log(data); // Prints in random order!
});
console.log('Done'); // Prints BEFORE any data!

// FIX — for...of respects await
for (const id of ids) {
  const data = await fetchData(id);
  console.log(data); // Sequential, ordered
}
console.log('Done'); // Prints after ALL data

// FIX (parallel) — use Promise.all with map
const results = await Promise.all(ids.map((id) => fetchData(id)));
console.log('Done'); // Prints after ALL data (but they ran in parallel)
```

### Trap 3: Missing Error Handling

```js
// DANGEROUS — unhandled rejection crashes Node.js
async function riskyFunction() {
  const data = await fetch('/api/data');
  return data.json();
}

// SAFE — always wrap async logic
async function safeFunction() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch failed:', error.message);
    return null; // or rethrow, or return a default
  }
}
```

### Trap 4: await Inside a Return

```js
// These are DIFFERENT:
async function example1() {
  return await fetchData(); // try/catch CAN catch errors from fetchData
}

async function example2() {
  return fetchData(); // try/catch CANNOT catch errors — the promise is returned unwrapped
}

// This matters when you have a try/catch:
async function safe() {
  try {
    return await fetchData(); // Error caught ✓
  } catch (err) {
    console.error(err);
  }
}

async function unsafe() {
  try {
    return fetchData(); // Error NOT caught — it escapes!
  } catch (err) {
    console.error(err); // Never runs
  }
}
```

---

## Chapter 21: Generators & Iterators — The Protocol

### The Iterator Protocol

Any object with a `next()` method that returns `{ value, done }` is an iterator:

```js
function createRangeIterator(start, end) {
  let current = start;

  return {
    next() {
      if (current <= end) {
        return { value: current++, done: false };
      }
      return { value: undefined, done: true };
    },
  };
}

const iter = createRangeIterator(1, 3);
iter.next(); // { value: 1, done: false }
iter.next(); // { value: 2, done: false }
iter.next(); // { value: 3, done: false }
iter.next(); // { value: undefined, done: true }
```

### Generators — Iterator Factories

Generators make iterators easy to write. The `yield` keyword pauses the function:

```js
function* range(start, end) {
  for (let i = start; i <= end; i++) {
    yield i; // Pause here, return i, resume when .next() is called
  }
}

// Use in for...of
for (const num of range(1, 5)) {
  console.log(num); // 1, 2, 3, 4, 5
}

// Spread into array
const nums = [...range(1, 5)]; // [1, 2, 3, 4, 5]
```

### Infinite Sequences

```js
function* fibonacci() {
  let a = 0;
  let b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

// Take the first 10 fibonacci numbers
function take(gen, n) {
  const result = [];
  for (const value of gen) {
    result.push(value);
    if (result.length >= n) break;
  }
  return result;
}

take(fibonacci(), 10); // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

### Async Generators — Streaming Data

```js
async function* fetchPages(url) {
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(`${url}?page=${page}`);
    const data = await response.json();
    yield data.results;
    hasMore = data.hasNextPage;
    page += 1;
  }
}

// Process pages as they arrive
for await (const pageResults of fetchPages('/api/users')) {
  pageResults.forEach((user) => renderUser(user));
}
```

---

## Chapter 22: Advanced Async Patterns

### Pattern 1: Retry with Exponential Backoff

```js
async function withRetry(fn, maxRetries = 3, baseDelay = 1000) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) throw error;

      const delay = baseDelay * Math.pow(2, attempt);
      const jitter = delay * Math.random() * 0.1;
      console.log(`Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay + jitter));
    }
  }
}

// Usage
const data = await withRetry(() => fetch('/api/unstable-endpoint'), 5, 500);
```

### Pattern 2: Cancellable Async Operations

```js
function createCancellableRequest(url) {
  const controller = new AbortController();

  const promise = fetch(url, { signal: controller.signal })
    .then((res) => res.json());

  return {
    promise,
    cancel: () => controller.abort(),
  };
}

// Usage — cancel previous search when user types again
let currentRequest = null;

function onSearchInput(query) {
  if (currentRequest) currentRequest.cancel();

  currentRequest = createCancellableRequest(`/api/search?q=${query}`);
  currentRequest.promise
    .then(renderResults)
    .catch((err) => {
      if (err.name !== 'AbortError') console.error(err);
    });
}
```

### Pattern 3: Concurrency Limiter

```js
async function asyncPool(limit, items, fn) {
  const results = [];
  const executing = new Set();

  for (const [index, item] of items.entries()) {
    const promise = fn(item, index).then((result) => {
      executing.delete(promise);
      return result;
    });

    results.push(promise);
    executing.add(promise);

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}

// Process 100 URLs, but only 5 at a time
const urls = Array.from({ length: 100 }, (_, i) => `/api/page/${i}`);
const data = await asyncPool(5, urls, (url) => fetch(url).then((r) => r.json()));
```

---

# PART VI — ADVANCED WEAPONS

---

## Chapter 23: Symbols

Symbols are unique, immutable identifiers. Their primary use is adding properties to objects without risking name collisions.

```js
// Every Symbol is unique
const id1 = Symbol('id');
const id2 = Symbol('id');
id1 === id2; // false — even with the same description

// Use as object keys
const user = {
  name: 'Alice',
  [id1]: 12345,  // Hidden from normal iteration
};

Object.keys(user);           // ['name'] — Symbol keys are invisible
Object.getOwnPropertySymbols(user); // [Symbol(id)] — only way to find them
```

### Well-Known Symbols — Customizing Language Behavior

```js
// Symbol.iterator — make any object iterable
class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;
    return {
      next() {
        return current <= end
          ? { value: current++, done: false }
          : { done: true };
      },
    };
  }
}

for (const n of new Range(1, 5)) console.log(n); // 1, 2, 3, 4, 5
[...new Range(3, 7)]; // [3, 4, 5, 6, 7]

// Symbol.toPrimitive — control type coercion
class Money {
  constructor(amount, currency) {
    this.amount = amount;
    this.currency = currency;
  }

  [Symbol.toPrimitive](hint) {
    if (hint === 'number') return this.amount;
    if (hint === 'string') return `${this.amount} ${this.currency}`;
    return this.amount; // default
  }
}

const price = new Money(42.5, 'USD');
+price;           // 42.5
`${price}`;       // '42.5 USD'
price + 10;       // 52.5
```

---

## Chapter 24: WeakMap, WeakSet, WeakRef

### WeakMap — The Memory-Safe Cache

WeakMap keys are held weakly — if nothing else references the key, both the key and value get garbage collected:

```js
// Associating private data with DOM elements without memory leaks
const elementData = new WeakMap();

function trackElement(element) {
  elementData.set(element, {
    clickCount: 0,
    createdAt: Date.now(),
  });
}

function handleClick(element) {
  const data = elementData.get(element);
  data.clickCount += 1;
}

// When the DOM element is removed from the page and no JS references remain,
// the WeakMap entry is automatically garbage collected. No cleanup needed!
```

### WeakRef — When You Need a "Maybe" Reference

```js
class ImageCache {
  #cache = new Map();

  get(url) {
    const ref = this.#cache.get(url);
    if (ref) {
      const image = ref.deref(); // Returns the object, or undefined if GC'd
      if (image) return image;
    }
    return null;
  }

  set(url, image) {
    this.#cache.set(url, new WeakRef(image));
  }
}

// Images are cached but can be garbage collected if memory is tight
```

---

## Chapter 25: Tagged Template Literals

```js
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i] !== undefined
      ? `<mark>${values[i]}</mark>`
      : '';
    return result + str + value;
  }, '');
}

const name = 'Alice';
const role = 'Admin';

highlight`User ${name} has role ${role}`;
// 'User <mark>Alice</mark> has role <mark>Admin</mark>'

// Real use: SQL injection prevention
function sql(strings, ...values) {
  const escaped = values.map((v) =>
    typeof v === 'string' ? v.replace(/'/g, "''") : v
  );
  return strings.reduce((q, str, i) =>
    q + str + (escaped[i] ?? ''), ''
  );
}
```

---

# PART VII — THE BROWSER

---

## Chapter 28: Event Bubbling, Capturing & Delegation

### The Three Phases

When you click a button inside a div inside the body:

```
CAPTURING (top down):  window → document → body → div → button
TARGET:                button (the element you actually clicked)
BUBBLING (bottom up):  button → div → body → document → window
```

```js
// By default, listeners fire during BUBBLING
parent.addEventListener('click', handler);

// To listen during CAPTURING, pass true as third argument
parent.addEventListener('click', handler, true);

// To stop the event from going further:
element.addEventListener('click', (e) => {
  e.stopPropagation();  // Stops bubbling/capturing
});
```

### Event Delegation — The Performance Pattern

Instead of 1000 listeners on 1000 list items, put ONE listener on the parent:

```js
// BAD — 1000 event listeners
document.querySelectorAll('.item').forEach((item) => {
  item.addEventListener('click', handleItemClick);
});

// GOOD — 1 event listener, handles all items (even future ones)
document.getElementById('list').addEventListener('click', (e) => {
  const item = e.target.closest('.item');
  if (!item) return; // Click wasn't on an item

  const itemId = item.dataset.id;
  handleItemClick(itemId);
});

// This even works for items added AFTER the listener was created!
```

---

## Chapter 29: Critical Rendering Path

When a browser loads a page:

1. **HTML → DOM** (parse HTML into a tree of nodes)
2. **CSS → CSSOM** (parse CSS into a style tree)
3. **DOM + CSSOM → Render Tree** (combine — only visible elements)
4. **Layout** (calculate positions and sizes)
5. **Paint** (draw pixels)
6. **Composite** (layer management for transforms, opacity)

**What blocks rendering:**
- CSS is render-blocking (the browser won't paint until CSSOM is built)
- JavaScript is parser-blocking (the browser stops parsing HTML when it hits a script tag)
- Solution: `<script defer>` (parse HTML first, run JS after) or `<script async>` (download in parallel, run when ready)

---

## Chapter 30: Web Storage

```js
// localStorage — persists forever (until manually cleared)
localStorage.setItem('theme', 'dark');
localStorage.getItem('theme');    // 'dark'
localStorage.removeItem('theme');

// sessionStorage — persists until the tab is closed
sessionStorage.setItem('tempData', JSON.stringify({ x: 1 }));

// Cookies — sent with every HTTP request (use for auth tokens)
document.cookie = 'session=abc123; max-age=3600; path=/; secure';

// IndexedDB — for large, structured data (async API)
// Like a real database in the browser
```

**Storage limits:** localStorage/sessionStorage ~5-10MB. IndexedDB varies but typically 50MB+ (browser asks for permission beyond that). Cookies: 4KB per cookie.

---

# PART VIII — PATTERNS & ARCHITECTURE

---

## Chapter 33: Design Patterns in JavaScript

### Singleton — One Instance Only

```js
class Database {
  static #instance = null;

  constructor(connectionString) {
    if (Database.#instance) {
      return Database.#instance;
    }
    this.connectionString = connectionString;
    this.connected = false;
    Database.#instance = this;
  }

  connect() {
    this.connected = true;
    return `Connected to ${this.connectionString}`;
  }
}

const db1 = new Database('mongodb://localhost');
const db2 = new Database('postgres://localhost'); // Returns same instance!
db1 === db2; // true
```

### Observer / PubSub

```js
class EventEmitter {
  #events = new Map();

  on(event, callback) {
    if (!this.#events.has(event)) {
      this.#events.set(event, []);
    }
    this.#events.get(event).push(callback);
    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  off(event, callback) {
    const handlers = this.#events.get(event);
    if (handlers) {
      this.#events.set(event, handlers.filter((h) => h !== callback));
    }
  }

  emit(event, ...args) {
    const handlers = this.#events.get(event) || [];
    handlers.forEach((handler) => handler(...args));
  }

  once(event, callback) {
    const unsubscribe = this.on(event, (...args) => {
      callback(...args);
      unsubscribe();
    });
  }
}

// Usage
const store = new EventEmitter();
const unsub = store.on('userLogin', (user) => {
  console.log(`${user.name} logged in`);
});
store.emit('userLogin', { name: 'Alice' }); // 'Alice logged in'
unsub(); // Clean up
```

### Strategy Pattern

```js
const pricingStrategies = {
  regular: (price) => price,
  premium: (price) => price * 0.9,        // 10% discount
  vip: (price) => price * 0.8,            // 20% discount
  employee: (price) => price * 0.5,       // 50% discount
};

function calculatePrice(basePrice, customerType) {
  const strategy = pricingStrategies[customerType] || pricingStrategies.regular;
  return strategy(basePrice);
}

calculatePrice(100, 'vip');      // 80
calculatePrice(100, 'employee'); // 50
calculatePrice(100, 'regular');  // 100
```

---

## Chapter 34: Error Handling — A Production Strategy

### Custom Error Classes

```js
class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true; // Distinguishes expected from unexpected errors
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(resource, id) {
    super(`${resource} with id ${id} not found`, 404, 'NOT_FOUND');
  }
}

class ValidationError extends AppError {
  constructor(field, message) {
    super(`Validation failed: ${field} — ${message}`, 400, 'VALIDATION');
    this.field = field;
  }
}

// Usage
function getUser(id) {
  const user = database.find(id);
  if (!user) throw new NotFoundError('User', id);
  return user;
}
```

### Global Error Boundaries

```js
// Browser — catch all unhandled errors
window.addEventListener('error', (event) => {
  logToService({
    message: event.message,
    filename: event.filename,
    line: event.lineno,
    stack: event.error?.stack,
  });
});

// Catch unhandled Promise rejections
window.addEventListener('unhandledrejection', (event) => {
  logToService({
    message: event.reason?.message || 'Unknown promise rejection',
    stack: event.reason?.stack,
  });
  event.preventDefault(); // Prevents console error
});
```

---

## Chapter 35: Security

### XSS (Cross-Site Scripting)

```js
// VULNERABLE — inserting user input as HTML
element.innerHTML = userInput;
// If userInput is '<script>stealCookies()</script>' — game over

// SAFE — use textContent (escapes HTML)
element.textContent = userInput;

// SAFE — sanitize before inserting HTML
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
```

### Prototype Pollution

```js
// DANGEROUS — merging user-controlled objects
function merge(target, source) {
  for (const key in source) {
    if (typeof source[key] === 'object') {
      target[key] = merge(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// Attacker sends: { "__proto__": { "isAdmin": true } }
merge({}, JSON.parse(userInput));
// Now EVERY object in the application has isAdmin === true!

// FIX — block dangerous keys
function safeMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue; // Skip dangerous keys
    }
    // ... rest of merge logic
  }
}
```

---

# PART IX — PERFORMANCE

---

## Chapter 36: Memory Leaks — Detection & Prevention

```js
// Quick detection technique: take heap snapshots
// 1. Open Chrome DevTools → Memory tab
// 2. Take a snapshot
// 3. Perform the action you suspect leaks
// 4. Take another snapshot
// 5. Compare — look for objects that shouldn't be growing

// Common React leak — missing cleanup
function useInterval(callback, delay) {
  useEffect(() => {
    const id = setInterval(callback, delay);
    return () => clearInterval(id); // THIS LINE prevents the leak
  }, [callback, delay]);
}
```

## Chapter 37: Debounce, Throttle, and rAF

```js
// DEBOUNCE — wait until action stops for N ms
// Use for: search input, window resize, form autosave
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// THROTTLE — run at most once every N ms
// Use for: scroll events, mousemove, API rate limiting
function throttle(fn, limit) {
  let waiting = false;
  return function(...args) {
    if (!waiting) {
      fn.apply(this, args);
      waiting = true;
      setTimeout(() => { waiting = false; }, limit);
    }
  };
}

// requestAnimationFrame throttle — perfectly synced with the screen
// Use for: animations, scroll-linked effects
function rafThrottle(fn) {
  let ticking = false;
  return function(...args) {
    if (!ticking) {
      requestAnimationFrame(() => {
        fn.apply(this, args);
        ticking = false;
      });
      ticking = true;
    }
  };
}
```

---

# PART X — 50 CODING CHALLENGES

---

## 🟢 Foundation (Junior)

### Challenge 1: isPalindrome

```js
// Check if a string is a palindrome (reads same forwards and backwards)
function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}

isPalindrome('A man, a plan, a canal: Panama'); // true
isPalindrome('hello');                           // false
```

### Challenge 2: FizzBuzz (the "Can You Code?" test)

```js
function fizzBuzz(n) {
  return Array.from({ length: n }, (_, i) => {
    const num = i + 1;
    if (num % 15 === 0) return 'FizzBuzz';
    if (num % 3 === 0) return 'Fizz';
    if (num % 5 === 0) return 'Buzz';
    return num;
  });
}
```

### Challenge 3: Reverse a string (without .reverse())

```js
function reverseString(str) {
  let result = '';
  for (let i = str.length - 1; i >= 0; i--) {
    result += str[i];
  }
  return result;
}

// Or using reduce:
const reverse = (str) => [...str].reduce((rev, char) => char + rev, '');
```

### Challenge 4: Count character occurrences

```js
function charCount(str) {
  return [...str.toLowerCase()].reduce((counts, char) => {
    counts[char] = (counts[char] || 0) + 1;
    return counts;
  }, {});
}

charCount('hello'); // { h: 1, e: 1, l: 2, o: 1 }
```

### Challenge 5: Find the largest number in each sub-array

```js
function largestOfEach(arr) {
  return arr.map((sub) => Math.max(...sub));
}

largestOfEach([[4, 5, 1], [13, 27, 18], [32, 35, 37]]); // [5, 27, 37]
```

### Challenge 6: Title case a sentence

```js
function titleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

titleCase("i'm a little tea pot"); // "I'm A Little Tea Pot"
```

### Challenge 7: Remove duplicates from array

```js
// Method 1: Set
const unique = (arr) => [...new Set(arr)];

// Method 2: filter
const unique2 = (arr) => arr.filter((item, i) => arr.indexOf(item) === i);

// Method 3: reduce
const unique3 = (arr) =>
  arr.reduce((acc, item) => (acc.includes(item) ? acc : [...acc, item]), []);
```

### Challenge 8: Chunk an array

```js
function chunk(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

chunk([1, 2, 3, 4, 5, 6, 7], 3); // [[1,2,3], [4,5,6], [7]]
```

### Challenge 9: Flatten an array (one level)

```js
const flatten = (arr) => arr.reduce((flat, item) =>
  flat.concat(Array.isArray(item) ? item : [item]), []
);

flatten([1, [2, 3], [4, [5]]]); // [1, 2, 3, 4, [5]]
```

### Challenge 10: Find the missing number

```js
// Array of 1..n with one missing number
function findMissing(arr, n) {
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = arr.reduce((sum, num) => sum + num, 0);
  return expectedSum - actualSum;
}

findMissing([1, 2, 4, 5, 6], 6); // 3
```

### Challenge 11: Count vowels

```js
const countVowels = (str) =>
  (str.match(/[aeiou]/gi) || []).length;
```

### Challenge 12: Truncate a string

```js
function truncate(str, maxLength) {
  return str.length > maxLength ? str.slice(0, maxLength - 3) + '...' : str;
}
```

### Challenge 13: Sum all numbers in a range

```js
function rangeSum(a, b) {
  const [min, max] = [Math.min(a, b), Math.max(a, b)];
  return ((max - min + 1) * (min + max)) / 2;
}
```

### Challenge 14: Capitalize first letter of each word

```js
const capitalize = (str) =>
  str.replace(/\b\w/g, (char) => char.toUpperCase());
```

### Challenge 15: Check if two strings are anagrams

```js
function isAnagram(str1, str2) {
  const normalize = (s) => s.toLowerCase().replace(/\s/g, '').split('').sort().join('');
  return normalize(str1) === normalize(str2);
}

isAnagram('listen', 'silent'); // true
```

---

## 🟡 Intermediate (Mid-Level)

### Challenge 16: Deep flatten (any depth)

```js
function deepFlatten(arr) {
  return arr.reduce(
    (flat, item) =>
      flat.concat(Array.isArray(item) ? deepFlatten(item) : item),
    []
  );
}

deepFlatten([1, [2, [3, [4, [5]]]]]); // [1, 2, 3, 4, 5]
```

### Challenge 17: Group by property

```js
function groupBy(arr, key) {
  return arr.reduce((groups, item) => {
    const groupKey = typeof key === 'function' ? key(item) : item[key];
    (groups[groupKey] = groups[groupKey] || []).push(item);
    return groups;
  }, {});
}

const people = [
  { name: 'Alice', dept: 'Eng' },
  { name: 'Bob', dept: 'Sales' },
  { name: 'Charlie', dept: 'Eng' },
];

groupBy(people, 'dept');
// { Eng: [{name: 'Alice'...}, {name: 'Charlie'...}], Sales: [{name: 'Bob'...}] }
```

### Challenge 18: Deep equality check

```js
function deepEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;

  if (typeof a === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) => deepEqual(a[key], b[key]));
  }

  return false;
}
```

### Challenge 19: Implement debounce with leading/trailing options

```js
function debounce(fn, delay, { leading = false, trailing = true } = {}) {
  let timer = null;
  let lastArgs = null;

  return function(...args) {
    const callNow = leading && timer === null;
    lastArgs = args;

    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      if (trailing && lastArgs) {
        fn.apply(this, lastArgs);
        lastArgs = null;
      }
    }, delay);

    if (callNow) {
      fn.apply(this, args);
      lastArgs = null;
    }
  };
}
```

### Challenge 20: Implement Array.prototype.flat

```js
function flat(arr, depth = 1) {
  if (depth <= 0) return arr.slice();

  return arr.reduce((acc, item) => {
    if (Array.isArray(item)) {
      acc.push(...flat(item, depth - 1));
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
}

flat([1, [2, [3, [4]]]], 2); // [1, 2, 3, [4]]
flat([1, [2, [3, [4]]]], Infinity); // [1, 2, 3, 4]
```

### Challenge 21: Implement Object.assign

```js
function objectAssign(target, ...sources) {
  if (target == null) throw new TypeError('Cannot convert undefined or null to object');
  const result = Object(target);

  sources.forEach((source) => {
    if (source != null) {
      Object.keys(source).forEach((key) => {
        result[key] = source[key];
      });
      // Also copy Symbol keys
      Object.getOwnPropertySymbols(source).forEach((sym) => {
        if (Object.prototype.propertyIsEnumerable.call(source, sym)) {
          result[sym] = source[sym];
        }
      });
    }
  });

  return result;
}
```

### Challenge 22: Implement a simple EventEmitter

```js
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, fn) {
    (this.events[event] = this.events[event] || []).push(fn);
    return this;
  }

  off(event, fn) {
    this.events[event] = (this.events[event] || []).filter((f) => f !== fn);
    return this;
  }

  emit(event, ...args) {
    (this.events[event] || []).forEach((fn) => fn(...args));
    return this;
  }

  once(event, fn) {
    const wrapper = (...args) => {
      fn(...args);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }
}
```

### Challenge 23: Convert object to query string and back

```js
function toQueryString(obj) {
  return Object.entries(obj)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

function fromQueryString(qs) {
  return Object.fromEntries(
    qs.split('&').map((pair) => pair.split('=').map(decodeURIComponent))
  );
}

toQueryString({ name: 'Alice', age: 30, city: 'New York' });
// 'name=Alice&age=30&city=New%20York'
```

### Challenge 24: Implement Promise.allSettled

```js
function allSettled(promises) {
  return Promise.all(
    promises.map((p) =>
      Promise.resolve(p)
        .then((value) => ({ status: 'fulfilled', value }))
        .catch((reason) => ({ status: 'rejected', reason }))
    )
  );
}
```

### Challenge 25: Implement JSON.stringify (basic version)

```js
function jsonStringify(value) {
  if (value === null) return 'null';
  if (typeof value === 'boolean') return String(value);
  if (typeof value === 'number') {
    return Number.isFinite(value) ? String(value) : 'null';
  }
  if (typeof value === 'string') return `"${value}"`;

  if (Array.isArray(value)) {
    const items = value.map((item) => jsonStringify(item) ?? 'null');
    return `[${items.join(',')}]`;
  }

  if (typeof value === 'object') {
    const pairs = Object.keys(value)
      .filter((key) => value[key] !== undefined && typeof value[key] !== 'function')
      .map((key) => `"${key}":${jsonStringify(value[key])}`);
    return `{${pairs.join(',')}}`;
  }

  return undefined;
}
```

### Challenge 26: Implement a deep clone

```js
function deepClone(obj, seen = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags);
  if (seen.has(obj)) return seen.get(obj); // Handle circular references

  const clone = Array.isArray(obj) ? [] : {};
  seen.set(obj, clone);

  for (const key of Reflect.ownKeys(obj)) {
    clone[key] = deepClone(obj[key], seen);
  }

  return clone;
}
```

### Challenge 27: LRU Cache

```js
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // Map preserves insertion order
  }

  get(key) {
    if (!this.cache.has(key)) return -1;

    // Move to end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Delete the least recently used (first item in Map)
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }
}
```

### Challenge 28: Difference between two objects

```js
function diff(obj1, obj2) {
  const result = {};
  const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

  for (const key of allKeys) {
    if (!(key in obj1)) {
      result[key] = { type: 'added', value: obj2[key] };
    } else if (!(key in obj2)) {
      result[key] = { type: 'removed', value: obj1[key] };
    } else if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
      const nested = diff(obj1[key], obj2[key]);
      if (Object.keys(nested).length > 0) {
        result[key] = { type: 'nested', changes: nested };
      }
    } else if (obj1[key] !== obj2[key]) {
      result[key] = { type: 'changed', from: obj1[key], to: obj2[key] };
    }
  }

  return result;
}
```

### Challenge 29: Implement setInterval using setTimeout

```js
function mySetInterval(fn, delay) {
  let cancelled = false;

  function loop() {
    if (!cancelled) {
      fn();
      setTimeout(loop, delay);
    }
  }

  setTimeout(loop, delay);

  return { cancel: () => { cancelled = true; } };
}
```

### Challenge 30: Pipe / Compose

```js
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);
const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);

const processText = pipe(
  (s) => s.trim(),
  (s) => s.toLowerCase(),
  (s) => s.replace(/\s+/g, '-'),
);

processText('  Hello World  '); // 'hello-world'
```

### Challenge 31: Curry function

```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return (...more) => curried(...args, ...more);
  };
}

const add = curry((a, b, c) => a + b + c);
add(1)(2)(3);   // 6
add(1, 2)(3);   // 6
add(1)(2, 3);   // 6
```

### Challenge 32: Throttle with leading and trailing

```js
function throttle(fn, limit) {
  let waiting = false;
  let lastArgs = null;

  return function(...args) {
    if (!waiting) {
      fn.apply(this, args);
      waiting = true;
      setTimeout(() => {
        waiting = false;
        if (lastArgs) {
          fn.apply(this, lastArgs);
          lastArgs = null;
        }
      }, limit);
    } else {
      lastArgs = args;
    }
  };
}
```

### Challenge 33: getElementsByClassName (without the built-in)

```js
function getElementsByClassName(root, className) {
  const result = [];

  function traverse(node) {
    if (node.classList && node.classList.contains(className)) {
      result.push(node);
    }
    for (const child of node.children) {
      traverse(child);
    }
  }

  traverse(root);
  return result;
}
```

### Challenge 34: Implement a simple Virtual DOM diff

```js
function diff(oldNode, newNode) {
  // Node was removed
  if (!newNode) return { type: 'REMOVE' };

  // Text nodes
  if (typeof oldNode === 'string' || typeof newNode === 'string') {
    if (oldNode !== newNode) return { type: 'TEXT', value: newNode };
    return null;
  }

  // Different tag
  if (oldNode.tag !== newNode.tag) return { type: 'REPLACE', value: newNode };

  // Same tag — diff children and props
  const propPatches = diffProps(oldNode.props, newNode.props);
  const childPatches = diffChildren(oldNode.children, newNode.children);

  return { type: 'UPDATE', propPatches, childPatches };
}

function diffProps(oldProps = {}, newProps = {}) {
  const patches = [];
  // Check new and changed props
  for (const [key, value] of Object.entries(newProps)) {
    if (oldProps[key] !== value) patches.push({ key, value });
  }
  // Check removed props
  for (const key of Object.keys(oldProps)) {
    if (!(key in newProps)) patches.push({ key, value: undefined });
  }
  return patches;
}

function diffChildren(oldChildren = [], newChildren = []) {
  return newChildren.map((child, i) => diff(oldChildren[i], child));
}
```

### Challenge 35: Implement Promise.race

```js
function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    for (const promise of promises) {
      Promise.resolve(promise).then(resolve, reject);
    }
  });
}
```

---

## 🔴 Advanced (Senior / Staff)

### Challenge 36: Implement async/await using generators

```js
function asyncRunner(generatorFn) {
  return function(...args) {
    const gen = generatorFn(...args);

    return new Promise((resolve, reject) => {
      function step(nextFn) {
        let result;
        try {
          result = nextFn();
        } catch (err) {
          return reject(err);
        }

        if (result.done) return resolve(result.value);

        Promise.resolve(result.value).then(
          (value) => step(() => gen.next(value)),
          (err) => step(() => gen.throw(err))
        );
      }

      step(() => gen.next());
    });
  };
}

// Usage — this behaves exactly like async/await
const fetchData = asyncRunner(function* () {
  const response = yield fetch('/api/data');
  const data = yield response.json();
  return data;
});
```

### Challenge 37: Implement a task scheduler with concurrency limit

```js
class TaskScheduler {
  constructor(concurrency) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }

  add(asyncFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn: asyncFn, resolve, reject });
      this.#run();
    });
  }

  #run() {
    while (this.running < this.concurrency && this.queue.length > 0) {
      const { fn, resolve, reject } = this.queue.shift();
      this.running += 1;

      fn()
        .then(resolve)
        .catch(reject)
        .finally(() => {
          this.running -= 1;
          this.#run();
        });
    }
  }
}

// Usage — fetch 100 URLs, max 3 at a time
const scheduler = new TaskScheduler(3);
const urls = Array.from({ length: 100 }, (_, i) => `https://api.example.com/${i}`);

const results = await Promise.all(
  urls.map((url) => scheduler.add(() => fetch(url).then((r) => r.json())))
);
```

### Challenge 38: Implement Function.prototype.bind (spec-compliant)

```js
Function.prototype.myBind = function(thisArg, ...boundArgs) {
  if (typeof this !== 'function') {
    throw new TypeError('Bind must be called on a function');
  }

  const targetFn = this;
  const BoundFn = function(...callArgs) {
    // If used as a constructor (with new), ignore thisArg
    const context = this instanceof BoundFn ? this : thisArg;
    return targetFn.apply(context, [...boundArgs, ...callArgs]);
  };

  // Maintain prototype chain for new
  if (targetFn.prototype) {
    BoundFn.prototype = Object.create(targetFn.prototype);
  }

  return BoundFn;
};
```

### Challenge 39: Implement JSON.parse (basic)

```js
function jsonParse(str) {
  let i = 0;

  function parseValue() {
    skipWhitespace();
    const char = str[i];
    if (char === '"') return parseString();
    if (char === '{') return parseObject();
    if (char === '[') return parseArray();
    if (char === 't') return parseLiteral('true', true);
    if (char === 'f') return parseLiteral('false', false);
    if (char === 'n') return parseLiteral('null', null);
    return parseNumber();
  }

  function parseString() {
    i++; // skip opening "
    let result = '';
    while (str[i] !== '"') {
      if (str[i] === '\\') {
        i++;
        const escapes = { n: '\n', t: '\t', r: '\r', '"': '"', '\\': '\\' };
        result += escapes[str[i]] || str[i];
      } else {
        result += str[i];
      }
      i++;
    }
    i++; // skip closing "
    return result;
  }

  function parseNumber() {
    const start = i;
    if (str[i] === '-') i++;
    while (i < str.length && /[\d.eE+\-]/.test(str[i])) i++;
    return Number(str.slice(start, i));
  }

  function parseObject() {
    i++; // skip {
    const obj = {};
    skipWhitespace();
    if (str[i] === '}') { i++; return obj; }
    while (true) {
      skipWhitespace();
      const key = parseString();
      skipWhitespace();
      i++; // skip :
      obj[key] = parseValue();
      skipWhitespace();
      if (str[i] === '}') { i++; return obj; }
      i++; // skip ,
    }
  }

  function parseArray() {
    i++; // skip [
    const arr = [];
    skipWhitespace();
    if (str[i] === ']') { i++; return arr; }
    while (true) {
      arr.push(parseValue());
      skipWhitespace();
      if (str[i] === ']') { i++; return arr; }
      i++; // skip ,
    }
  }

  function parseLiteral(text, value) {
    i += text.length;
    return value;
  }

  function skipWhitespace() {
    while (i < str.length && ' \t\n\r'.includes(str[i])) i++;
  }

  return parseValue();
}
```

### Challenge 40: Implement a Reactive State System (like Vue/MobX)

```js
function reactive(obj) {
  const subscribers = new Map();
  let activeEffect = null;

  function track(key) {
    if (activeEffect) {
      if (!subscribers.has(key)) subscribers.set(key, new Set());
      subscribers.get(key).add(activeEffect);
    }
  }

  function trigger(key) {
    const effects = subscribers.get(key);
    if (effects) effects.forEach((effect) => effect());
  }

  const proxy = new Proxy(obj, {
    get(target, key) {
      track(key);
      return target[key];
    },
    set(target, key, value) {
      target[key] = value;
      trigger(key);
      return true;
    },
  });

  function effect(fn) {
    activeEffect = fn;
    fn(); // Run once to collect dependencies
    activeEffect = null;
  }

  return { state: proxy, effect };
}

// Usage
const { state, effect } = reactive({ count: 0, name: 'App' });

effect(() => {
  console.log(`Count is: ${state.count}`);
});

state.count = 1;  // Automatically logs: "Count is: 1"
state.count = 2;  // Automatically logs: "Count is: 2"
```

### Challenge 41: Implement a simple template engine

```js
function template(str) {
  return function(data) {
    return str.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? data[key] : match;
    });
  };
}

const render = template('Hello {{name}}, you are {{age}} years old!');
render({ name: 'Alice', age: 30 });
// 'Hello Alice, you are 30 years old!'
```

### Challenge 42: Implement a dependency injection container

```js
class Container {
  #factories = new Map();
  #singletons = new Map();

  register(name, factory, singleton = false) {
    this.#factories.set(name, { factory, singleton });
  }

  resolve(name) {
    const entry = this.#factories.get(name);
    if (!entry) throw new Error(`"${name}" is not registered`);

    if (entry.singleton) {
      if (!this.#singletons.has(name)) {
        this.#singletons.set(name, entry.factory(this));
      }
      return this.#singletons.get(name);
    }

    return entry.factory(this);
  }
}

// Usage
const container = new Container();
container.register('logger', () => ({ log: console.log }), true);
container.register('userService', (c) => ({
  getUser: (id) => {
    c.resolve('logger').log(`Fetching user ${id}`);
    return { id, name: 'Alice' };
  },
}));

const userService = container.resolve('userService');
userService.getUser(1); // logs "Fetching user 1", returns { id: 1, name: 'Alice' }
```

### Challenge 43: Implement a middleware pipeline (like Express)

```js
function createApp() {
  const middlewares = [];

  function use(fn) {
    middlewares.push(fn);
  }

  function handle(req, res) {
    let index = 0;

    function next(err) {
      if (index >= middlewares.length) return;
      const middleware = middlewares[index++];

      try {
        if (err) {
          // Error-handling middleware has 4 params
          if (middleware.length === 4) {
            middleware(err, req, res, next);
          } else {
            next(err); // Skip non-error middleware
          }
        } else {
          middleware(req, res, next);
        }
      } catch (e) {
        next(e);
      }
    }

    next();
  }

  return { use, handle };
}
```

### Challenge 44: Implement a Promise-based sleep + timeout utility

```js
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function withTimeout(promise, ms, message = 'Operation timed out') {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(message)), ms)
  );
  return Promise.race([promise, timeout]);
}

// Usage
const data = await withTimeout(fetch('/api/slow'), 5000, 'API call timed out');
```

### Challenge 45: Implement Object.is

```js
function objectIs(a, b) {
  // Handle +0 !== -0
  if (a === 0 && b === 0) {
    return 1 / a === 1 / b; // 1/+0 = Infinity, 1/-0 = -Infinity
  }

  // Handle NaN === NaN
  if (a !== a && b !== b) return true; // Only NaN !== NaN

  return a === b;
}

objectIs(+0, -0);   // false (=== says true)
objectIs(NaN, NaN); // true  (=== says false)
objectIs(42, 42);   // true
```

### Challenge 46: Implement a pub/sub with wildcard support

```js
class WildcardEmitter {
  constructor() {
    this.handlers = new Map();
  }

  on(pattern, handler) {
    if (!this.handlers.has(pattern)) {
      this.handlers.set(pattern, []);
    }
    this.handlers.get(pattern).push(handler);
  }

  emit(event, ...args) {
    this.handlers.forEach((handlers, pattern) => {
      const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
      if (regex.test(event)) {
        handlers.forEach((h) => h(...args));
      }
    });
  }
}

const emitter = new WildcardEmitter();
emitter.on('user.*', (data) => console.log('User event:', data));
emitter.on('user.login', (data) => console.log('Login:', data));

emitter.emit('user.login', { name: 'Alice' });
// "User event: { name: 'Alice' }"
// "Login: { name: 'Alice' }"
```

### Challenge 47: Implement a memoize with TTL (cache expiry)

```js
function memoizeWithTTL(fn, ttl = 60000) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);
    const cached = cache.get(key);

    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.value;
    }

    const result = fn.apply(this, args);
    cache.set(key, { value: result, timestamp: Date.now() });

    // Cleanup expired entries periodically
    if (cache.size > 100) {
      const now = Date.now();
      for (const [k, v] of cache) {
        if (now - v.timestamp >= ttl) cache.delete(k);
      }
    }

    return result;
  };
}
```

### Challenge 48: Implement a simple state machine

```js
function createStateMachine(config) {
  let currentState = config.initial;

  return {
    get state() { return currentState; },

    transition(event) {
      const stateConfig = config.states[currentState];
      const nextState = stateConfig?.on?.[event];

      if (!nextState) {
        throw new Error(`Invalid transition: ${currentState} + ${event}`);
      }

      const prevState = currentState;
      currentState = nextState;
      config.onTransition?.({ from: prevState, to: nextState, event });
      return currentState;
    },
  };
}

// Usage — traffic light
const light = createStateMachine({
  initial: 'red',
  states: {
    red: { on: { NEXT: 'green' } },
    green: { on: { NEXT: 'yellow' } },
    yellow: { on: { NEXT: 'red' } },
  },
  onTransition: ({ from, to }) => console.log(`${from} → ${to}`),
});

light.transition('NEXT'); // red → green
light.transition('NEXT'); // green → yellow
light.transition('NEXT'); // yellow → red
```

### Challenge 49: Implement Array.prototype.reduce using recursion

```js
function reduceRecursive(arr, callback, accumulator, index = 0) {
  if (index >= arr.length) return accumulator;

  const newAcc = arguments.length >= 3 || index > 0
    ? callback(accumulator, arr[index], index, arr)
    : arr[index]; // No initial value: use first element

  return reduceRecursive(arr, callback, newAcc, index + 1);
}

reduceRecursive([1, 2, 3, 4], (sum, n) => sum + n, 0); // 10
```

### Challenge 50: Implement a lazy evaluation chain

```js
class Lazy {
  constructor(source) {
    this.source = source;
    this.operations = [];
  }

  static from(iterable) {
    return new Lazy(iterable);
  }

  map(fn) {
    const clone = new Lazy(this.source);
    clone.operations = [...this.operations, { type: 'map', fn }];
    return clone;
  }

  filter(fn) {
    const clone = new Lazy(this.source);
    clone.operations = [...this.operations, { type: 'filter', fn }];
    return clone;
  }

  take(n) {
    const clone = new Lazy(this.source);
    clone.operations = [...this.operations, { type: 'take', n }];
    return clone;
  }

  toArray() {
    const result = [];
    let taken = 0;
    let takeLimit = Infinity;

    // Find the take limit
    for (const op of this.operations) {
      if (op.type === 'take') takeLimit = op.n;
    }

    for (const item of this.source) {
      let value = item;
      let keep = true;

      for (const op of this.operations) {
        if (op.type === 'map') {
          value = op.fn(value);
        } else if (op.type === 'filter') {
          if (!op.fn(value)) { keep = false; break; }
        }
      }

      if (keep) {
        result.push(value);
        taken += 1;
        if (taken >= takeLimit) break;
      }
    }

    return result;
  }
}

// Usage — processes only the minimum elements needed
const result = Lazy.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  .filter((n) => n % 2 === 0)
  .map((n) => n * 10)
  .take(3)
  .toArray();
// [20, 40, 60] — only processed 6 elements, not all 10
```

---

# BONUS: The Interview Mindset

## How to Answer ANY JavaScript Question

**Step 1 — Name It:** "This question is about closures..."

**Step 2 — Define It Simply:** "A closure is when a function remembers variables from the scope where it was created."

**Step 3 — Draw It or Code It:** Write a 5-line example on the whiteboard.

**Step 4 — Connect It:** "You see this in React hooks — useState is literally a closure."

**Step 5 — Show the Edge Case:** "The classic trap is the for-loop with var, where all callbacks share the same variable."

## The Questions YOU Should Ask the Interviewer

- "What's your team's approach to error handling?"
- "Do you use TypeScript, or any static analysis tools?"
- "What's the most interesting JavaScript bug your team has dealt with?"
- "How do you handle state management in your frontend?"

These show that you think about code quality, not just code output.

---

## Quick Reference: What to Study by Interview Level

**Junior:** Types, scope, closures (basic), array methods, Promises, ES6 syntax, DOM basics.

**Mid-Level:** Event loop, prototype chain, `this` binding, async patterns, error handling, design patterns, performance basics.

**Senior:** Engine internals, memory management, Proxy/Reflect, generators, security, system design patterns, build tooling, mentoring ability.

**Staff+:** Architecture decisions, trade-off analysis, performance profiling, cross-team API design, ability to explain complex concepts simply.

---

*This guide distills the principles from the Airbnb JavaScript Style Guide and extends them into the full depth of the language. The style guide tells you WHAT to write. This guide teaches you WHY — so that no question, no edge case, and no production bug can catch you off guard.*

*Keep building. Keep breaking things. Keep learning.*
