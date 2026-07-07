# JavaScript Interview Mastery Guide

JavaScript interview preparation covering core language concepts, practical coding patterns, and real-world scenarios. Questions are organized by category and difficulty, progressing from foundational topics to advanced concepts.

| Prerequisite | Description |
|---|---|
| Programming fundamentals | Variables, control flow, functions, data structures |
| HTML/CSS basics | Understanding of web page structure and styling |
| ES6+ syntax | Arrow functions, destructuring, template literals, modules |

## Description

This guide contains 45 questions across six categories: foundational, conceptual, practical coding, real-world scenarios, advanced, and behavioral. Each question includes a description, code examples, and interview guidance.

### How to use this guide

| Week | Focus | Questions |
|---|---|---|
| 1 | Foundational concepts | Q1-Q10 plus quick-fire round |
| 2 | Conceptual depth | Q11-Q15 plus most commonly asked |
| 3 | Practical coding | Q16-Q20 plus real-world scenarios |
| 4 | Advanced and behavioral | Q26-Q35 plus mock interviews |

Study recommendations:

1. Start with foundational questions -- they appear in most interviews.
2. Practice explanations out loud as if in an actual interview.
3. Write solutions on paper or a whiteboard before typing them.
4. Aim to explain core concepts in two to three minutes.
5. Review weak areas and know what pitfalls to avoid.

### What interviewers evaluate

| Signal | What it means |
|---|---|
| Conceptual understanding | Knows *why*, not just *how* |
| Practical experience | Can apply knowledge to real problems |
| Problem-solving approach | Thinks through challenges methodically |
| Code quality | Writes clean, maintainable code |
| Communication | Explains complex topics clearly |
| Growth mindset | Handles unknowns constructively |

> **Warning:** Common red flags include memorized answers without understanding, inability to explain trade-offs, no awareness of edge cases, and defensiveness when questioned.

### The PREP framework for technical answers

| Step | Action |
|---|---|
| **P**oint | State the answer directly |
| **R**eason | Explain why or how it works |
| **E**xample | Provide code or a real-world scenario |
| **P**oint | Summarize and mention related concepts |

### Handling unknowns

When you do not know the answer, use one of these approaches:

| Approach | Example phrasing |
|---|---|
| Partial knowledge | "I am not completely familiar with that, but based on my understanding of [related concept], I believe it works like this..." |
| Problem-solving | "I have not used that before, but here is how I would approach figuring it out..." |
| Redirect to strengths | "I have not worked with that API, but I have extensive experience with [similar concept]." |
| Honest professional | "I do not have hands-on experience with that, but it is on my learning roadmap because [reason]." |

---

## Foundational Questions

### var, let, and const

#### Description

JavaScript has three variable declaration keywords that differ in scope, hoisting behavior, and reassignment rules.

| Feature | `var` | `let` | `const` |
|---|---|---|---|
| Scope | Function | Block | Block |
| Hoisted | Yes (initialized to `undefined`) | Yes (not initialized -- TDZ) | Yes (not initialized -- TDZ) |
| Redeclarable | Yes | No | No |
| Reassignable | Yes | Yes | No |
| Must initialize | No | No | Yes |

`const` prevents reassignment of the binding, not mutation of objects or arrays. For objects and arrays the reference is constant but properties can be modified.

> **Note:** The Temporal Dead Zone (TDZ) is the period between entering a scope and the actual declaration. Accessing a `let` or `const` variable during this time throws a `ReferenceError`.

#### Examples

```javascript
// var - function scoped, avoid in modern code
function varExample() {
  if (true) {
    var x = 10;
  }
  console.log(x); // 10 - accessible outside block
}

// let - block scoped, can reassign
function letExample() {
  let count = 0;
  if (true) {
    let count = 10; // Different variable
    count++; // 11
  }
  console.log(count); // 0 - original unchanged
}

// const - block scoped, cannot reassign
const user = { name: 'John' };
user.name = 'Jane'; // Allowed - modifying property
// user = {};        // TypeError - cannot reassign reference
```

#### Interview guidance

**How to explain it:** "var is function-scoped and hoisted with undefined, let and const are block-scoped and sit in the Temporal Dead Zone until their declaration is reached. I default to const and switch to let only when reassignment is needed; var is a code smell in modern JavaScript."

**Common follow-ups:**

| Question | Key points |
|---|---|
| What is the Temporal Dead Zone? | Period between scope entry and declaration; accessing the variable throws a `ReferenceError` |
| Can you explain hoisting with these keywords? | `var` is hoisted and initialized to `undefined`; `let`/`const` are hoisted but not initialized |
| Why avoid `var`? | Function scope causes unexpected bugs in loops and conditionals; too permissive |

**Difficulty:** Beginner

---

### Loose equality vs strict equality

#### Description

`==` (loose equality) performs type coercion before comparing values. `===` (strict equality) compares both value and type without coercion.

Type coercion means JavaScript automatically converts operands to a common type before comparing, which can produce unexpected results.

#### Examples

```javascript
// == performs type coercion
console.log(5 == '5');          // true - string coerced to number
console.log(null == undefined); // true - special case
console.log(0 == false);       // true - boolean coerced to number
console.log('' == false);      // true - both coerced to 0

// === strict equality, no coercion
console.log(5 === '5');          // false - different types
console.log(null === undefined); // false - different types
console.log(0 === false);       // false - different types

// Best practice
const userInput = '0';
if (userInput === '0') {       // Explicit and clear
  console.log('String zero');
}
```

> **Warning:** `[] == ![]` evaluates to `true`. `![]` converts to `false`, `[]` converts to `""` then `0`, `false` converts to `0`, so `0 == 0` is `true`. This demonstrates why `==` should be avoided.

#### Interview guidance

**How to explain it:** "I always use strict equality except when checking for null or undefined together with `value == null`, which catches both. ESLint's eqeqeq rule enforces this."

**Common follow-ups:**

| Question | Key points |
|---|---|
| When would you use `==` over `===`? | Only `value == null` to catch both `null` and `undefined` |
| What is type coercion? | Automatic conversion between types; `'5' + 5` gives `'55'`, `'5' - 5` gives `0` |

**Difficulty:** Beginner

---

### The this keyword

#### Description

`this` is a keyword whose value is determined by how a function is called, not where it is defined. There are five binding rules:

| Rule | Context | Value of `this` |
|---|---|---|
| Default binding | Standalone call | Global object (or `undefined` in strict mode) |
| Implicit binding | Method call (`obj.fn()`) | The object before the dot |
| Explicit binding | `call()`, `apply()`, `bind()` | The explicitly provided object |
| New binding | `new Constructor()` | The newly created object |
| Arrow function | Lexical | Inherited from enclosing scope |

#### Examples

```javascript
// Default binding
function showThis() {
  console.log(this); // Window (or undefined in strict mode)
}
showThis();

// Implicit binding
const user = {
  name: 'Alice',
  greet() {
    console.log(this.name); // 'Alice'
  }
};
user.greet();

// Lost implicit binding - common gotcha
const greet = user.greet;
greet(); // undefined - this is now global/undefined
```

```javascript
// Explicit binding
function introduce(greeting) {
  console.log(`${greeting}, I am ${this.name}`);
}
const person = { name: 'Bob' };

introduce.call(person, 'Hello');   // "Hello, I am Bob"
introduce.apply(person, ['Hi']);   // "Hi, I am Bob"

const bound = introduce.bind(person);
bound('Hey');                      // "Hey, I am Bob"
```

```javascript
// Arrow functions - lexical this
const obj = {
  name: 'Dave',
  regularFunc: function () {
    setTimeout(function () {
      console.log(this.name); // undefined - lost context
    }, 100);
  },
  arrowFunc: function () {
    setTimeout(() => {
      console.log(this.name); // 'Dave' - inherits from obj
    }, 100);
  }
};
```

#### Interview guidance

**How to explain it:** "this is determined by call-site, not definition. The four rules in priority order are: new binding, explicit binding, implicit binding, default binding. Arrow functions bypass all of these and capture this lexically from their enclosing scope."

**Common follow-ups:**

| Question | Key points |
|---|---|
| Difference between `call`, `apply`, and `bind`? | `call`/`apply` invoke immediately (comma args vs array); `bind` returns a new function |
| How do arrow functions handle `this`? | No own binding; captured from surrounding lexical scope at definition time |
| What happens with `this` in event handlers? | Points to the element that received the event; arrow functions or `bind` override this |

**Difficulty:** Intermediate

---

### Closures

#### Description

A closure is a function that retains access to variables from its outer (enclosing) scope even after the outer function has returned. JavaScript functions maintain a reference to their lexical environment. Closures are created every time a function is created.

Common use cases include data privacy, callbacks, partial application, and the module pattern.

> **Note:** Closures keep their outer scope in memory. Be mindful of retaining references to large data structures unnecessarily.

#### Examples

```javascript
// Basic closure - data privacy
function createCounter() {
  let count = 0; // Private variable

  return {
    increment() { return ++count; },
    decrement() { return --count; },
    getCount()  { return count; }
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount());  // 2
// count is not accessible directly
```

```javascript
// Factory function using closure
function makeMultiplier(multiplier) {
  return function (number) {
    return number * multiplier;
  };
}

const double = makeMultiplier(2);
const triple = makeMultiplier(3);
console.log(double(5)); // 10
console.log(triple(5)); // 15
```

#### Interview guidance

**How to explain it:** "A closure is a function bundled with its lexical environment. The inner function remembers variables from the outer scope even after the outer function has returned. I use closures for data privacy, factory functions, and maintaining state in callbacks."

**Common follow-ups:**

| Question | Key points |
|---|---|
| Scope vs closure? | Scope defines where variables are accessible; a closure is a function that remembers its lexical scope when executing outside it |
| Can closures cause memory leaks? | Yes, if they hold references to large objects or DOM elements that are no longer needed |
| How do closures relate to the module pattern? | The module pattern uses closures to create private variables, exposing only a public API |

**Difficulty:** Intermediate

---

### Event delegation

#### Description

Event delegation is a pattern where a single event listener on a parent element handles events from multiple child elements by leveraging event bubbling. Instead of attaching individual listeners to each child, the parent catches events as they bubble up.

| Benefit | Explanation |
|---|---|
| Performance | Fewer event listeners in memory |
| Dynamic elements | Works with elements added after page load |
| Cleaner code | One listener instead of many |
| Memory efficiency | Important with thousands of elements |

#### Examples

```javascript
// ✅ With delegation - one listener on parent
const list = document.querySelector('.list');
list.addEventListener('click', (e) => {
  if (e.target.matches('.item')) {
    console.log('Item clicked:', e.target.textContent);
  }
});
```

```javascript
// Real-world example: todo list with multiple actions
const todoList = document.getElementById('todo-list');

todoList.addEventListener('click', (e) => {
  const target = e.target;

  if (target.matches('.delete-btn')) {
    target.closest('.todo-item').remove();
  }

  if (target.matches('.todo-checkbox')) {
    target.closest('.todo-item').classList.toggle('completed');
  }

  if (target.matches('.edit-btn')) {
    editTodo(target.closest('.todo-item'));
  }
});

// New items work automatically - no extra listeners needed
function addTodo(text) {
  const html = `
    <div class="todo-item">
      <input type="checkbox" class="todo-checkbox">
      <span>${text}</span>
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    </div>`;
  todoList.insertAdjacentHTML('beforeend', html);
}
```

#### Interview guidance

**How to explain it:** "Event delegation attaches one listener to a parent and uses event bubbling to handle child events. It improves performance, handles dynamically added elements, and simplifies code. I use e.target.matches() or e.target.closest() to identify the source."

**Common follow-ups:**

| Question | Key points |
|---|---|
| Explain event bubbling and capturing | Three phases: capturing (down), target, bubbling (up). Delegation leverages bubbling |
| How do you stop delegation? | `e.stopPropagation()` prevents bubbling; use cautiously as it can break other listeners |
| Events that do not bubble? | `focus`, `blur`, `load` do not bubble; use `focusin`/`focusout` or capturing phase instead |

**Difficulty:** Intermediate

---

### Promises and callbacks

#### Description

Promises are objects representing the eventual completion or failure of an asynchronous operation. They replace nested callbacks with linear chains and centralized error handling.

| Aspect | Callbacks | Promises |
|---|---|---|
| Nesting | Deep nesting (callback hell) | Flat chaining |
| Error handling | Per-level error checks | Centralized `.catch()` |
| Composition | Manual coordination | `Promise.all()`, `Promise.race()`, etc. |
| Return value | None | Thenable object that can be passed around |

A Promise is in one of three states:

| State | Meaning |
|---|---|
| Pending | Operation not yet complete |
| Fulfilled | Operation succeeded; value available |
| Rejected | Operation failed; reason available |

Once settled (fulfilled or rejected), a Promise's state is immutable.

#### Examples

```javascript
// ✅ Promise chain
fetchUser(userId)
  .then(user => fetchPosts(user.id))
  .then(posts => fetchComments(posts[0].id))
  .then(comments => displayData(comments))
  .catch(error => handleError(error))
  .finally(() => hideLoader());
```

```javascript
// Creating a Promise
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) {
        resolve({ id, name: 'Alice' });
      } else {
        reject(new Error('Invalid user ID'));
      }
    }, 1000);
  });
}
```

```javascript
// Promise static methods
const p1 = fetchUser(1);
const p2 = fetchPosts(1);
const p3 = fetchComments(1);

// All succeed or first rejection
Promise.all([p1, p2, p3])
  .then(([user, posts, comments]) => { /* ... */ })
  .catch(error => { /* at least one failed */ });

// First to settle
Promise.race([p1, p2, p3])
  .then(result => { /* first completed */ });

// All settle regardless of outcome
Promise.allSettled([p1, p2, p3])
  .then(results => {
    results.forEach(r => {
      if (r.status === 'fulfilled') console.log(r.value);
      else console.log(r.reason);
    });
  });
```

```javascript
// ✅ async/await - syntactic sugar over Promises
async function loadUserData(userId) {
  try {
    const user = await fetchUser(userId);
    const posts = await fetchPosts(user.id);
    const comments = await fetchComments(posts[0].id);
    displayData(user, posts, comments);
  } catch (error) {
    handleError(error);
  } finally {
    hideLoader();
  }
}
```

> **Warning:** Always handle rejections. An unhandled `fetchUser(0)` call produces an unhandled promise rejection. Add `.catch()` or wrap in `try/catch`.

#### Interview guidance

**How to explain it:** "Promises represent eventual async results and replace nested callbacks with flat chains and centralized error handling. async/await is syntactic sugar on top of Promises that makes async code read like synchronous code. I always add .catch() or try/catch to handle rejections."

**Common follow-ups:**

| Question | Key points |
|---|---|
| `Promise.all()` vs `Promise.allSettled()`? | `all` short-circuits on first rejection; `allSettled` waits for every promise and returns all outcomes |
| Explain promise chaining | Each `.then()` returns a new Promise; returned values are wrapped; returned Promises are awaited |
| Error propagation in chains? | Errors propagate down until caught by a `.catch()`, similar to try/catch |

**Difficulty:** Intermediate

---

### The event loop

#### Description

JavaScript is single-threaded. The event loop is the mechanism that enables non-blocking asynchronous operations by coordinating the call stack, task queues, and Web APIs.

| Component | Role |
|---|---|
| Call stack | Executes synchronous code (LIFO) |
| Web APIs | Browser-provided (setTimeout, fetch, DOM events); run outside the JS thread |
| Microtask queue | Holds Promise callbacks; higher priority |
| Callback queue (task/macro queue) | Holds setTimeout, setInterval, I/O callbacks |
| Event loop | Monitors the stack and queues; moves callbacks to the stack when it is empty |

Execution order:

1. Execute all synchronous code on the call stack.
2. When the stack is empty, drain the microtask queue (Promises, `queueMicrotask`).
3. Take one callback from the macrotask queue (setTimeout, setInterval, I/O).
4. Repeat from step 2.

#### Examples

```javascript
console.log('1: Start');

setTimeout(() => {
  console.log('2: setTimeout callback');
}, 0);

Promise.resolve()
  .then(() => {
    console.log('3: Promise then');
  });

console.log('4: End');

// Output:
// 1: Start
// 4: End
// 3: Promise then       (microtask)
// 2: setTimeout callback (macrotask)
```

> **Warning:** Long-running synchronous code blocks the event loop, freezing the UI. Break heavy computations into chunks with `setTimeout(chunk, 0)` or offload to Web Workers.

#### Interview guidance

**How to explain it:** "JavaScript runs on a single thread. The event loop picks tasks from queues when the call stack is empty. Microtasks (Promises) always run before macrotasks (setTimeout). Even setTimeout with 0ms delay waits for all synchronous code and microtasks to finish."

**Common follow-ups:**

| Question | Key points |
|---|---|
| Microtasks vs macrotasks? | Microtasks (Promises, queueMicrotask) run before macrotasks (setTimeout, I/O); all microtasks drain before the next macrotask |
| Why does `setTimeout(fn, 0)` not run immediately? | Callback goes to the macrotask queue and waits for the call stack and microtask queue to empty |
| How to avoid blocking the event loop? | Chunk work with setTimeout, use Web Workers, use async I/O, avoid synchronous APIs for large data |

**Difficulty:** Intermediate

---

### Prototypal inheritance

#### Description

JavaScript uses prototypal inheritance where objects inherit directly from other objects. Every object has an internal `[[Prototype]]` link. When a property is accessed, JavaScript walks up the prototype chain until the property is found or `null` is reached.

| Concept | Description |
|---|---|
| `[[Prototype]]` | Internal link; accessed via `Object.getPrototypeOf()` or `__proto__` |
| `Constructor.prototype` | Object that becomes `[[Prototype]]` of instances created with `new` |
| Chain terminus | `Object.prototype` whose prototype is `null` |
| ES6 classes | Syntactic sugar over prototypal inheritance |

#### Examples

```javascript
// Object.create
const animal = {
  type: 'Animal',
  eat() {
    console.log(`${this.name} is eating`);
  }
};

const dog = Object.create(animal);
dog.name = 'Buddy';
dog.bark = function () {
  console.log(`${this.name} is barking`);
};

dog.eat();  // "Buddy is eating" - inherited
dog.bark(); // "Buddy is barking" - own method
console.log(Object.getPrototypeOf(dog) === animal); // true
```

```javascript
// ES6 class syntax (sugar over prototypes)
class Animal {
  constructor(name) { this.name = name; }
  eat() { console.log(`${this.name} is eating`); }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
  bark() { console.log(`${this.name} barks`); }
}

const buddy = new Dog('Buddy', 'Golden Retriever');
console.log(buddy instanceof Dog);    // true
console.log(buddy instanceof Animal); // true
```

#### Interview guidance

**How to explain it:** "JavaScript objects inherit directly from other objects through the prototype chain. When a property is not found on the object itself, the engine walks up the chain. ES6 classes are syntactic sugar; underneath, the same prototypal mechanism applies."

**Common follow-ups:**

| Question | Key points |
|---|---|
| `__proto__` vs `prototype`? | `prototype` is on constructors and becomes `[[Prototype]]` of instances; `__proto__` is the actual prototype link on an instance |
| Check own property vs inherited? | `obj.hasOwnProperty('prop')` returns true only for own properties |
| Change prototype after creation? | Possible with `Object.setPrototypeOf()` but discouraged for performance reasons |

**Difficulty:** Intermediate

---

### Hoisting

#### Description

Hoisting is JavaScript's behavior of processing declarations during the compilation phase before code execution. Only declarations are hoisted, not initializations.

| Declaration type | Hoisted? | Initialized? |
|---|---|---|
| `var` | Yes | To `undefined` |
| Function declaration | Yes | Fully (name and body) |
| `let` / `const` | Yes | No (Temporal Dead Zone) |
| `class` | Yes | No (Temporal Dead Zone) |
| Function expression | Variable only | Not the function value |
| Arrow function | Variable only | Not the function value |

#### Examples

```javascript
// var hoisting
console.log(x); // undefined (not ReferenceError)
var x = 5;
console.log(x); // 5

// Function declaration - fully hoisted
greet(); // "Hello!" - works
function greet() {
  console.log('Hello!');
}

// Function expression - NOT fully hoisted
sayHi(); // TypeError: sayHi is not a function
var sayHi = function () {
  console.log('Hi!');
};
```

```javascript
// let/const - Temporal Dead Zone
console.log(y); // ReferenceError
let y = 10;

// Class - Temporal Dead Zone
const inst = new MyClass(); // ReferenceError
class MyClass {
  constructor() { this.name = 'Test'; }
}
```

> **Note:** Hoisting with `var` can silently produce `undefined` values instead of errors. Prefer `let`/`const` to surface bugs early via the Temporal Dead Zone.

#### Interview guidance

**How to explain it:** "During compilation, JavaScript moves declarations to the top of their scope. var declarations are initialized to undefined; function declarations are fully available. let, const, and class are hoisted but remain in the Temporal Dead Zone until the declaration line is reached."

**Common follow-ups:**

| Question | Key points |
|---|---|
| What is the Temporal Dead Zone? | Period between scope entry and the declaration; accessing the variable throws a `ReferenceError` |
| Why are function declarations fully hoisted but expressions are not? | Declarations define name and body at compile time; expressions are assignments where only the variable is hoisted |
| Same name for variable and function? | Function declarations take precedence during hoisting; runtime assignments overwrite |

**Difficulty:** Beginner

---

### null and undefined

#### Description

Both represent the absence of a value but serve different purposes.

| Aspect | `undefined` | `null` |
|---|---|---|
| Assigned by | JavaScript automatically | Programmer explicitly |
| Meaning | Not yet assigned | Intentionally empty |
| `typeof` | `"undefined"` | `"object"` (historical bug) |
| Use case | Uninitialized variable, missing parameter, missing property | Cleared value, "no object", optional placeholder |

```javascript
console.log(null == undefined);  // true  (loose)
console.log(null === undefined); // false (strict)
```

#### Examples

```javascript
// undefined - automatic
let x;
console.log(x);                   // undefined
console.log({ name: 'A' }.age);  // undefined (missing prop)
```

```javascript
// null - intentional
let user = null; // explicitly no user

function findUser(id) {
  const user = database.find(id);
  return user || null; // explicit "not found"
}
```

```javascript
// Nullish coalescing vs logical OR
const username = userInput ?? 'Guest';
// Only null/undefined trigger the fallback

const usernameOr = userInput || 'Guest';
// Also triggers on '', 0, false
```

> **Note:** `typeof null` returns `"object"` due to a bug in JavaScript's original implementation that cannot be fixed without breaking existing code.

#### Interview guidance

**How to explain it:** "undefined means a value has not been assigned yet; null means intentionally empty. I use null to explicitly signal absence, such as 'user not found'. The nullish coalescing operator (??) is preferred over || when 0 or empty string are valid values."

**Common follow-ups:**

| Question | Key points |
|---|---|
| Why does `typeof null` return `"object"`? | Historical bug from the first JavaScript implementation; type tags were used and null shared the object tag |
| How to check for null vs undefined? | `=== null`, `=== undefined`, or `== null` to catch both (one valid use of loose equality) |
| `??` vs `\|\|`? | `??` only treats `null`/`undefined` as nullish; `\|\|` treats all falsy values (`0`, `""`, `false`) as false |

**Difficulty:** Beginner

---

## Conceptual Questions

### Execution context

#### Description

An execution context is the environment where JavaScript code is evaluated and executed. It contains scope information, variable bindings, and the value of `this`.

| Type | Created when |
|---|---|
| Global execution context | Script first runs |
| Function execution context | A function is invoked |
| Eval execution context | Code runs inside `eval()` |

Each context goes through two phases:

| Phase | What happens |
|---|---|
| Creation | Variable and lexical environments are set up; `this` is bound; scope chain is created; `var` set to `undefined`, `let`/`const` left uninitialized |
| Execution | Code runs line by line; assignments happen; functions are called |

#### Examples

```javascript
let globalVar = 'global';

function outer() {
  let outerVar = 'outer';

  function inner() {
    let innerVar = 'inner';
    console.log(globalVar, outerVar, innerVar);
  }

  inner();
}

outer();

// Call stack progression:
// 1. Global context created (globalVar, outer)
// 2. outer() called -> outer context pushed
//    (outerVar, inner; scope chain -> global)
// 3. inner() called -> inner context pushed
//    (innerVar; scope chain -> outer -> global)
//    Logs: 'global outer inner'
// 4. inner() returns -> inner context popped
// 5. outer() returns -> outer context popped
```

#### Interview guidance

**How to explain it:** "An execution context is created each time a function is called and pushed onto the call stack. It holds variable bindings, the scope chain, and this. The scope chain is determined lexically -- by where code is written, not where it is called -- which is why closures work."

**Common follow-ups:**

| Question | Key points |
|---|---|
| Scope vs execution context? | Scope is accessibility of variables (lexical, compile-time); execution context is the runtime environment containing scope, variables, and `this` |
| Call stack and execution contexts? | The call stack manages contexts; overflow occurs with deep recursion |
| Variable Environment vs Lexical Environment? | Variable Environment holds `var` and function declarations; Lexical Environment holds `let`/`const` |

**Difficulty:** Intermediate

---

### Deep copy and shallow copy

#### Description

A shallow copy duplicates top-level properties. If a property references an object or array, only the reference is copied -- not the nested structure. A deep copy recursively duplicates all nested objects, producing a fully independent clone.

| Method | Type | Limitations |
|---|---|---|
| Spread (`{ ...obj }`) | Shallow | Nested references shared |
| `Object.assign({}, obj)` | Shallow | Nested references shared |
| `JSON.parse(JSON.stringify(obj))` | Deep | Loses functions, `undefined`, `Date`, `RegExp`; fails on circular refs |
| `structuredClone(obj)` | Deep | Best modern option; handles most types; does not clone functions |

#### Examples

```javascript
const original = { name: 'John', address: { city: 'NYC' } };

// Shallow copy
const shallow = { ...original };
shallow.address.city = 'LA'; // Affects original!

// Deep copy
const deep = structuredClone(original); // ✅ Modern best method
deep.address.city = 'Chicago';          // Original unaffected
```

#### Interview guidance

**How to explain it:** "A shallow copy clones top-level properties but shares nested object references. A deep copy recursively duplicates everything. structuredClone is the modern solution; JSON round-tripping works but loses functions, undefined, and special types."

**Common follow-ups:**

| Question | Key points |
|---|---|
| When is shallow copy sufficient? | When the object has no nested references or you only need to update top-level properties |
| Limitations of JSON round-trip? | Loses functions, `undefined`, `Symbol`, `Date` (becomes string), `RegExp`; fails on circular references |
| How does `structuredClone` handle circular references? | It handles them natively without extra configuration |

**Difficulty:** Intermediate

---

### async/await

#### Description

`async`/`await` is syntactic sugar over Promises. An `async` function always returns a Promise. `await` pauses execution of the function until the awaited Promise settles, making asynchronous code read like synchronous code.

#### Examples

```javascript
// Promise chain
fetchUser(1)
  .then(user => fetchPosts(user.id))
  .then(posts => displayPosts(posts))
  .catch(error => handleError(error));

// ✅ async/await equivalent
async function loadUserPosts(userId) {
  try {
    const user = await fetchUser(userId);
    const posts = await fetchPosts(user.id);
    displayPosts(posts);
  } catch (error) {
    handleError(error);
  }
}
```

```javascript
// Parallel operations with Promise.all
const [user, posts, comments] = await Promise.all([
  fetchUser(1),
  fetchPosts(1),
  fetchComments(1)
]); // All run concurrently
```

> **Warning:** Sequential `await` calls run one after another. Use `Promise.all()` when operations are independent to run them in parallel.

#### Interview guidance

**How to explain it:** "async/await makes asynchronous code look synchronous. The engine still uses Promises underneath. I always wrap await calls in try/catch and use Promise.all for independent parallel operations."

**Common follow-ups:**

| Question | Key points |
|---|---|
| Can you use `await` outside an `async` function? | Top-level await is supported in ES modules; not in CommonJS or regular scripts |
| Sequential vs parallel await? | Sequential: multiple `await` in sequence. Parallel: `Promise.all([...])` |
| Error handling? | `try/catch` inside async functions or `.catch()` on the returned Promise |

**Difficulty:** Intermediate

---

### ES6 modules vs CommonJS

#### Description

ES6 modules (ESM) are the standardized JavaScript module system. CommonJS (CJS) was Node.js's original module system.

| Feature | ES6 Modules | CommonJS |
|---|---|---|
| Syntax | `import` / `export` | `require()` / `module.exports` |
| Analysis | Static (compile-time) | Dynamic (runtime) |
| Tree-shaking | Supported | Not supported |
| Loading | Asynchronous | Synchronous |
| Default export | `export default` | `module.exports =` |

#### Examples

```javascript
// ES6 Modules
// utils.js
export const add = (a, b) => a + b;
export default class Calculator {}

// app.js
import Calculator, { add } from './utils.js';

// CommonJS
// utils.js
module.exports = { add: (a, b) => a + b };

// app.js
const { add } = require('./utils');
```

#### Interview guidance

**How to explain it:** "ESM uses import/export and is statically analyzable at compile time, enabling tree-shaking. CommonJS uses require/module.exports and resolves at runtime. Modern projects should prefer ESM."

**Common follow-ups:**

| Question | Key points |
|---|---|
| What is tree-shaking? | Dead-code elimination enabled by static analysis of import/export |
| Can you mix ESM and CJS? | Possible but requires configuration; `import()` can dynamically load CJS modules |
| Named vs default exports? | Named exports are explicit and tree-shakable; default exports are convenient but less discoverable |

**Difficulty:** Intermediate

---

### Array iteration methods

#### Description

| Method | Returns | Purpose |
|---|---|---|
| `forEach()` | `undefined` | Execute a side effect for each element |
| `map()` | New array | Transform each element |
| `filter()` | New array | Select elements passing a test |
| `reduce()` | Single value | Accumulate elements into one result |

#### Examples

```javascript
const numbers = [1, 2, 3, 4, 5];

// forEach - side effects only, returns undefined
numbers.forEach(n => console.log(n));

// map - transformation
const doubled = numbers.map(n => n * 2); // [2, 4, 6, 8, 10]

// filter - selection
const evens = numbers.filter(n => n % 2 === 0); // [2, 4]

// reduce - accumulation
const sum = numbers.reduce((acc, n) => acc + n, 0); // 15
```

> **Note:** Use `map()` for transformations, not `forEach()` with push. `reduce()` is powerful but can reduce readability -- use it when simpler methods do not fit. Chaining creates intermediate arrays.

#### Interview guidance

**How to explain it:** "forEach is for side effects; map transforms; filter selects; reduce accumulates. I choose based on intent: map when I need a new array of transformed values, filter when I need a subset, reduce when I need a single accumulated result."

**Common follow-ups:**

| Question | Key points |
|---|---|
| When to use `reduce` vs a `for` loop? | `reduce` for functional style and clarity; `for` loop for performance-critical paths |
| Can you chain these methods? | Yes, e.g. `arr.map(...).filter(...)`, but each creates an intermediate array |
| Difference between `map` and `forEach`? | `map` returns a new array; `forEach` returns `undefined` and is used purely for side effects |

**Difficulty:** Beginner

---

## Practical Coding Questions

### Debounce function

#### Description

A debounce function delays invoking a callback until a specified time has elapsed since the last call. Each new call resets the timer. Common use: search input handlers.

#### Examples

```javascript
function debounce(func, delay) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Usage
const debouncedSearch = debounce((query) => {
  console.log('Searching for:', query);
}, 300);

searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});
// Typing "hello" fires the search once, 300ms after the last keystroke
```

```javascript
// With cancel method
function debounceWithCancel(func, delay) {
  let timeoutId;

  const debounced = function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(
      () => func.apply(this, args), delay
    );
  };

  debounced.cancel = function () {
    clearTimeout(timeoutId);
  };

  return debounced;
}
```

| Metric | Value |
|---|---|
| Time complexity | O(1) per call |
| Space complexity | O(1) -- stores one timeout ID |

#### Interview guidance

**How to explain it:** "Debounce delays execution until the caller stops invoking for a given period. I use it for search inputs, window resize, and scroll handlers. It is important to preserve this context and arguments."

**Common follow-ups:**

| Question | Key points |
|---|---|
| Debounce vs throttle? | Debounce waits for inactivity; throttle limits calls to at most once per interval |
| How would you test it? | Use fake timers (jest.useFakeTimers) and advance time to verify call count |
| When would you add immediate execution? | When you want the first call to fire immediately then debounce subsequent calls |

**Difficulty:** Intermediate

---

### Flatten a nested array

#### Description

Write a function that takes an arbitrarily nested array and returns a flat version. Discuss trade-offs between recursive, iterative, and native approaches.

#### Examples

```javascript
// Recursive approach
function flattenRecursive(arr) {
  const result = [];
  for (const item of arr) {
    if (Array.isArray(item)) {
      result.push(...flattenRecursive(item));
    } else {
      result.push(item);
    }
  }
  return result;
}

// Using reduce
function flattenReduce(arr) {
  return arr.reduce((acc, item) =>
    acc.concat(Array.isArray(item)
      ? flattenReduce(item)
      : item), []);
}
```

```javascript
// Iterative with stack (avoids call-stack overflow)
function flattenIterative(arr) {
  const stack = [...arr];
  const result = [];
  while (stack.length) {
    const item = stack.pop();
    if (Array.isArray(item)) {
      stack.push(...item);
    } else {
      result.unshift(item);
    }
  }
  return result;
}

// Native (ES2019)
const flattened = [1, [2, [3]]].flat(Infinity);
```

| Approach | Time | Space | Notes |
|---|---|---|---|
| Recursive | O(n) | O(d) call stack | Clean but risks stack overflow |
| Iterative | O(n) | O(n) for stack | Safe for deep nesting |
| `Array.flat(Infinity)` | O(n) | Engine-managed | Simplest; mention you can implement it |

#### Interview guidance

**How to explain it:** "I would use Array.flat(Infinity) in production but can implement it recursively or iteratively. The recursive version is clean; the iterative version avoids stack overflow for deeply nested arrays. I always ask about depth limits before implementing."

**Common follow-ups:**

| Question | Key points |
|---|---|
| Why might recursion fail? | Stack overflow with very deep nesting |
| How does the native `flat` method work? | Accepts a depth argument; `Infinity` flattens all levels |
| Edge cases? | Empty arrays, mixed types, arrays containing `undefined` or `null` |

**Difficulty:** Intermediate

---

### Deep clone an object

#### Description

Implement a function that creates a complete, independent copy of an object including nested structures, handling special types and circular references.

#### Examples

```javascript
function deepClone(obj, hash = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (hash.has(obj)) return hash.get(obj); // circular ref

  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags);

  if (obj instanceof Map) {
    const cloned = new Map();
    hash.set(obj, cloned);
    obj.forEach((v, k) => cloned.set(k, deepClone(v, hash)));
    return cloned;
  }

  if (obj instanceof Set) {
    const cloned = new Set();
    hash.set(obj, cloned);
    obj.forEach(v => cloned.add(deepClone(v, hash)));
    return cloned;
  }

  if (Array.isArray(obj)) {
    const cloned = [];
    hash.set(obj, cloned);
    obj.forEach((item, i) => { cloned[i] = deepClone(item, hash); });
    return cloned;
  }

  const cloned = Object.create(Object.getPrototypeOf(obj));
  hash.set(obj, cloned);
  Reflect.ownKeys(obj).forEach(key => {
    cloned[key] = deepClone(obj[key], hash);
  });
  return cloned;
}
```

```javascript
// Verification
const original = {
  name: 'John',
  hobbies: ['reading'],
  address: { city: 'NYC' },
  date: new Date(),
  regex: /test/gi
};
original.self = original; // circular reference

const cloned = deepClone(original);
cloned.address.city = 'LA';
console.log(original.address.city); // 'NYC' - unchanged
console.log(cloned.self === cloned); // true - circular ref handled
```

| Metric | Value |
|---|---|
| Time complexity | O(n) where n is total property count |
| Space complexity | O(n) for the WeakMap and new object |

> **Note:** In production, prefer `structuredClone()` (ES2022). It handles most types and circular references natively but does not clone functions or preserve prototypes.

#### Interview guidance

**How to explain it:** "I use a WeakMap to track visited objects, which handles circular references and prevents infinite recursion. The function recurses through each property, handling Date, RegExp, Map, Set, and Array as special cases. In production I would use structuredClone."

**Common follow-ups:**

| Question | Key points |
|---|---|
| Why WeakMap? | Prevents memory leaks (weak references) and handles circular references |
| Does it clone functions? | Typically no; functions are shared references |
| structuredClone limitations? | Does not clone functions or preserve prototype chains |

**Difficulty:** Intermediate

---

### Throttle function

#### Description

A throttle function ensures a callback is invoked at most once per specified time interval. Unlike debounce, throttle guarantees regular execution during continuous activity.

| Aspect | Debounce | Throttle |
|---|---|---|
| Fires when | Activity stops for the delay period | At most once per interval during activity |
| Use case | Search input, form validation | Scroll, resize, mousemove |

#### Examples

```javascript
function throttle(func, limit) {
  let inThrottle;

  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limit);
    }
  };
}

// Usage
const throttledScroll = throttle(() => {
  console.log('Scroll position:', window.scrollY);
}, 1000);

window.addEventListener('scroll', throttledScroll);
```

```javascript
// With trailing execution
function throttleTrailing(func, limit) {
  let lastFunc;
  let lastRan;

  return function (...args) {
    if (!lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(this, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}
```

#### Interview guidance

**How to explain it:** "Throttle limits execution to at most once per interval, guaranteeing regular calls during sustained activity. Debounce waits for inactivity. I use throttle for scroll and resize handlers where periodic updates matter."

**Common follow-ups:**

| Question | Key points |
|---|---|
| Throttle vs debounce? | Throttle fires periodically; debounce fires once after inactivity |
| Leading vs trailing execution? | Leading fires on the first call; trailing fires after the interval ends |
| When to prefer requestAnimationFrame? | For visual updates, rAF syncs with the browser paint cycle (typically 60 fps) |

**Difficulty:** Intermediate

---

### Deep equality check

#### Description

Implement a function that recursively compares two values for structural equality, handling nested objects and arrays.

#### Examples

```javascript
function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;

  if (
    typeof obj1 !== 'object' || obj1 === null ||
    typeof obj2 !== 'object' || obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}

// Tests
deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }); // true
deepEqual({ a: 1 }, { a: 1, b: 2 });                       // false
deepEqual([1, 2, 3], [1, 2, 3]);                            // true
```

#### Interview guidance

**How to explain it:** "I compare references first for a fast path, then verify both operands are objects, compare key counts, and recursively check each property. For production I would also handle Date, RegExp, Map, Set, and circular references."

**Common follow-ups:**

| Question | Key points |
|---|---|
| How to handle circular references? | Use a WeakMap (or paired set) to track visited pairs |
| Time complexity? | O(n) where n is total properties across all nesting levels |
| How does this differ from `JSON.stringify` comparison? | JSON stringify fails with circular refs, is sensitive to key order, and ignores `undefined` |

**Difficulty:** Intermediate

---

## Real-World Scenarios

### Autocomplete implementation

#### Description

An autocomplete feature requires debouncing API calls, caching results, and cancelling stale requests to handle rapid typing.

#### Examples

```javascript
class Autocomplete {
  constructor(inputElement, fetchSuggestions) {
    this.input = inputElement;
    this.fetchSuggestions = fetchSuggestions;
    this.cache = new Map();
    this.currentRequest = null;
    this.init();
  }

  init() {
    this.input.addEventListener(
      'input',
      this.debounce(this.handleInput.bind(this), 300)
    );
  }

  debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(
        () => func.apply(this, args), delay
      );
    };
  }

  async handleInput(event) {
    const query = event.target.value.trim();
    if (!query) { this.clearSuggestions(); return; }

    if (this.cache.has(query)) {
      this.displaySuggestions(this.cache.get(query));
      return;
    }

    if (this.currentRequest) this.currentRequest.abort();
    const controller = new AbortController();
    this.currentRequest = controller;

    try {
      const results = await this.fetchSuggestions(
        query, controller.signal
      );
      this.cache.set(query, results);
      if (this.currentRequest === controller) {
        this.displaySuggestions(results);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Autocomplete error:', error);
      }
    }
  }

  displaySuggestions(results) { /* render to DOM */ }
  clearSuggestions() { /* clear DOM */ }
}
```

| Consideration | Technique |
|---|---|
| Reduce API calls | Debounce input events |
| Improve repeat queries | Cache results in a Map |
| Handle race conditions | AbortController to cancel stale requests |
| Accessibility | Keyboard navigation for suggestion list |

#### Interview guidance

**How to explain it:** "I combine debouncing, caching, and request cancellation via AbortController. Debouncing reduces unnecessary API calls, caching avoids redundant fetches, and aborting stale requests prevents displaying outdated results."

**Difficulty:** Intermediate

---

### Authentication and token management

#### Description

A single-page application typically uses short-lived access tokens with longer-lived refresh tokens. The access token is sent with API requests; the refresh token is used to obtain a new access token before expiry.

#### Examples

```javascript
class AuthService {
  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiryTime = null;
  }

  async login(username, password) {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    this.setTokens(data.accessToken, data.refreshToken);
    return data;
  }

  setTokens(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    const payload = JSON.parse(
      atob(accessToken.split('.')[1])
    );
    this.tokenExpiryTime = payload.exp * 1000;
    this.scheduleTokenRefresh();
  }

  scheduleTokenRefresh() {
    const refreshTime =
      this.tokenExpiryTime - Date.now() - 60000;
    setTimeout(() => this.refreshAccessToken(), refreshTime);
  }

  async refreshAccessToken() {
    try {
      const res = await fetch('/api/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refreshToken: this.refreshToken
        })
      });
      const data = await res.json();
      this.setTokens(data.accessToken, this.refreshToken);
    } catch {
      this.logout();
    }
  }

  async fetchWithAuth(url, options = {}) {
    if (Date.now() >= this.tokenExpiryTime - 60000) {
      await this.refreshAccessToken();
    }
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${this.accessToken}`
      }
    });
  }

  logout() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('refreshToken');
  }
}
```

> **Warning:** Store refresh tokens in httpOnly cookies when possible, not localStorage, to reduce XSS risk.

#### Interview guidance

**How to explain it:** "I use short-lived JWTs as access tokens sent via Authorization headers and schedule automatic refresh before expiry. The refresh token should be stored securely, ideally in an httpOnly cookie."

**Difficulty:** Intermediate

---

### Memory leak prevention

#### Description

Common memory leak sources in JavaScript and their solutions:

| Cause | Problem | Fix |
|---|---|---|
| Event listeners not removed | Handlers reference objects that cannot be garbage collected | Remove listeners in cleanup/destroy methods |
| Timers not cleared | `setInterval` runs indefinitely | Store the ID and call `clearInterval` |
| Closures holding references | Large data kept alive by inner function | Capture only the values you need |
| Detached DOM nodes | Removed elements still referenced in JS | Set references to `null` after removal |

#### Examples

```javascript
// ❌ Leak: event listener never removed
class Component {
  constructor() {
    this.handleClick = () => console.log('clicked');
    document.addEventListener('click', this.handleClick);
  }
}

// ✅ Fixed: cleanup method
class Component {
  constructor() {
    this.handleClick = () => console.log('clicked');
    document.addEventListener('click', this.handleClick);
  }
  destroy() {
    document.removeEventListener('click', this.handleClick);
  }
}
```

```javascript
// ❌ Leak: closure retains entire large array
function createHandler() {
  const largeData = new Array(1000000).fill('data');
  return function () {
    console.log(largeData[0]);
  };
}

// ✅ Fixed: capture only what is needed
function createHandler() {
  const largeData = new Array(1000000).fill('data');
  const needed = largeData[0];
  return function () {
    console.log(needed);
  };
}
```

#### Interview guidance

**How to explain it:** "Memory leaks occur when objects that are no longer needed remain reachable. The four main causes are unremoved event listeners, uncleared timers, closures capturing large data, and detached DOM nodes. I use Chrome DevTools heap snapshots to identify leaks."

**Difficulty:** Advanced

---

### Infinite scroll

#### Description

Infinite scroll loads additional content as the user approaches the bottom of the page. Intersection Observer is preferred over scroll event listeners for performance.

#### Examples

```javascript
class InfiniteScroll {
  constructor(container, fetchMore) {
    this.container = container;
    this.fetchMore = fetchMore;
    this.loading = false;
    this.page = 1;
    this.hasMore = true;

    this.sentinel = document.createElement('div');
    this.container.appendChild(this.sentinel);

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting
            && !this.loading
            && this.hasMore) {
          this.loadMore();
        }
      },
      { rootMargin: '200px', threshold: 0 }
    );
    this.observer.observe(this.sentinel);
    this.loadMore();
  }

  async loadMore() {
    if (this.loading || !this.hasMore) return;
    this.loading = true;

    try {
      const items = await this.fetchMore(this.page);
      if (items.length === 0) {
        this.hasMore = false;
      } else {
        this.renderItems(items);
        this.page++;
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  renderItems(items) {
    const fragment = document.createDocumentFragment();
    items.forEach(item => {
      fragment.appendChild(this.createItemElement(item));
    });
    this.container.insertBefore(fragment, this.sentinel);
  }

  destroy() {
    this.observer.disconnect();
    this.sentinel.remove();
  }
}
```

#### Interview guidance

**How to explain it:** "I use IntersectionObserver with a sentinel element near the bottom. When it becomes visible, the next page is fetched. This approach is more performant than listening to scroll events and avoids manual offset calculations."

**Difficulty:** Intermediate

---

### Event emitter (pub/sub) pattern

#### Description

An event emitter allows components to communicate through named events without direct coupling. Listeners subscribe to events and are notified when those events are emitted.

#### Examples

```javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(listener);
    return () => this.off(event, listener);
  }

  once(event, listener) {
    const wrapper = (...args) => {
      listener.apply(this, args);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }

  off(event, listenerToRemove) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(
      fn => fn !== listenerToRemove
    );
  }

  emit(event, ...args) {
    if (!this.events[event]) return;
    this.events[event].forEach(fn => fn.apply(this, args));
  }

  removeAllListeners(event) {
    if (event) delete this.events[event];
    else this.events = {};
  }
}

// Usage
const emitter = new EventEmitter();
const unsub = emitter.on('user:login', (user) => {
  console.log('User logged in:', user);
});

emitter.emit('user:login', { id: 1, name: 'John' });
unsub(); // Remove listener
```

#### Interview guidance

**How to explain it:** "An event emitter stores arrays of listener functions keyed by event name. on() registers a listener, emit() calls all listeners for that event, and off() removes a specific listener. The on() method returns an unsubscribe function for convenient cleanup."

**Difficulty:** Intermediate

---

## Advanced Questions

### Loop closure gotcha

#### Description

A classic interview question demonstrating how `var` and closures interact in loops.

```javascript
for (var i = 0; i < 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, 1000);
}
// Prints 5 five times
```

All callbacks share the same function-scoped `i`, which is `5` when the callbacks execute after the loop completes.

#### Examples

```javascript
// ✅ Fix 1: use let (block scope)
for (let i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 1000);
  // 0, 1, 2, 3, 4
}

// ✅ Fix 2: IIFE
for (var i = 0; i < 5; i++) {
  (function (j) {
    setTimeout(() => console.log(j), 1000);
  })(i);
}

// ✅ Fix 3: setTimeout third argument
for (var i = 0; i < 5; i++) {
  setTimeout((val) => console.log(val), 1000, i);
}
```

#### Interview guidance

**How to explain it:** "var is function-scoped so all callbacks close over the same variable. By the time the timeouts fire, the loop has finished and i is 5. Using let creates a new binding per iteration, and IIFE or setTimeout's extra argument capture the current value."

**Difficulty:** Intermediate

---

### Floating-point precision

#### Description

JavaScript uses IEEE 754 double-precision floating-point. Decimal fractions cannot be represented exactly in binary, leading to rounding errors.

```javascript
console.log(0.1 + 0.2);         // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3); // false
```

#### Examples

```javascript
// Epsilon comparison
Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON; // true

// toFixed and convert back
parseFloat((0.1 + 0.2).toFixed(10)) === 0.3; // true

// Integer arithmetic
(0.1 * 10 + 0.2 * 10) / 10 === 0.3; // true

// For financial calculations, use a library like big.js
```

#### Interview guidance

**How to explain it:** "IEEE 754 binary floating-point cannot represent all decimal fractions exactly. To compare, I use an epsilon check or integer arithmetic. For financial calculations I use a decimal library."

**Difficulty:** Intermediate

---

### Operator coercion

#### Description

Chained comparison operators do not work as in mathematical notation because each comparison returns a boolean that is then coerced to a number for the next comparison.

#### Examples

```javascript
console.log(1 < 2 < 3); // true
// (1 < 2) -> true
// true < 3 -> 1 < 3 -> true

console.log(3 > 2 > 1); // false
// (3 > 2) -> true
// true > 1 -> 1 > 1 -> false
```

> **Warning:** `true` coerces to `1` and `false` coerces to `0`. Do not chain comparison operators expecting mathematical behavior.

#### Interview guidance

**How to explain it:** "JavaScript evaluates chained comparisons left to right. Each comparison returns a boolean, which is coerced to 0 or 1 for the next comparison. 3 > 2 > 1 is actually (true) > 1, which is 1 > 1, which is false."

**Difficulty:** Intermediate

---

### Microtasks vs macrotasks

#### Description

The event loop processes two types of queued tasks with different priorities.

| Type | Examples | Priority |
|---|---|---|
| Microtasks | `Promise.then`, `queueMicrotask`, `MutationObserver` | High -- drain completely after each task |
| Macrotasks | `setTimeout`, `setInterval`, I/O, UI rendering | Low -- one per event loop cycle |

Execution order: synchronous code runs, then all microtasks drain, then one macrotask runs, then microtasks drain again, and the cycle repeats.

#### Examples

```javascript
console.log('1: Script start');

setTimeout(() => {
  console.log('2: setTimeout (macrotask)');
}, 0);

Promise.resolve().then(() => {
  console.log('3: Promise (microtask)');
});

console.log('4: Script end');

// Output:
// 1: Script start
// 4: Script end
// 3: Promise (microtask)
// 2: setTimeout (macrotask)
```

#### Interview guidance

**How to explain it:** "Microtasks always execute before macrotasks. After each macrotask, the engine drains the entire microtask queue before taking the next macrotask. Promises produce microtasks; setTimeout produces macrotasks."

**Difficulty:** Advanced

---

### Array method performance

#### Description

Different iteration approaches have different performance characteristics. The choice depends on whether readability or raw speed is the priority.

#### Examples

```javascript
const arr = Array(1000000).fill(1);

// for loop - fastest
let sum = 0;
for (let i = 0; i < arr.length; i++) {
  sum += arr[i];
}

// forEach - moderate overhead
let sum2 = 0;
arr.forEach(n => { sum2 += n; });

// reduce - most functional, slightly slower
const sum3 = arr.reduce((acc, n) => acc + n, 0);
```

```javascript
// ❌ Creates three intermediate arrays
const result = big
  .map(n => n * 2)
  .filter(n => n > 5)
  .map(n => n - 1);

// ✅ Single pass with reduce
const result2 = big.reduce((acc, n) => {
  const doubled = n * 2;
  if (doubled > 5) acc.push(doubled - 1);
  return acc;
}, []);
```

| Approach | Best for |
|---|---|
| `for` loop | Performance-critical hot paths |
| `map`/`filter`/`reduce` | Readability and maintainability |
| Single-pass `reduce` or `for` | Large datasets where intermediate arrays are costly |

#### Interview guidance

**How to explain it:** "For most code, readability with map/filter/reduce wins. For performance-critical paths with large data, a for loop or single-pass reduce avoids creating intermediate arrays. I profile before optimizing."

**Difficulty:** Advanced

---

## Behavioral Questions

> **Note:** Use the STAR format (Situation, Task, Action, Result) for behavioral answers. Each response below follows this structure.

### Debugging a complex issue

#### Description

Describe a systematic approach to debugging an intermittent production issue.

#### Examples

**Situation:** Users reported a shopping cart that randomly lost items. The bug was intermittent and hard to reproduce.

**Task:** Identify the root cause and fix it within 48 hours.

**Action:**
1. Added comprehensive logging to track cart state changes.
2. Discovered the issue occurred with multiple tabs open.
3. Found that localStorage was being overwritten by whichever tab saved last.
4. Implemented a storage event listener with timestamp-based merging.

```javascript
window.addEventListener('storage', (e) => {
  if (e.key === 'cart') {
    const localCart = JSON.parse(localStorage.getItem('cart'));
    const newCart = JSON.parse(e.newValue);
    const merged = mergeCartsByTimestamp(localCart, newCart);
    updateCartDisplay(merged);
  }
});
```

**Result:** Cart abandonment decreased by 15%. The multi-tab sync solution was documented and shared with the team.

#### Interview guidance

**How to explain it:** "I follow a systematic approach: reproduce, add logging, isolate the trigger, fix, and verify. In this case, the root cause was uncoordinated localStorage access across tabs, resolved with the storage event and timestamp merging."

**Difficulty:** Intermediate

---

### Adopting a new pattern

#### Description

Describe how you convince a team to adopt a new coding pattern or technology.

#### Examples

**Situation:** The codebase relied on callbacks, resulting in deeply nested, hard-to-maintain code.

**Task:** Get team buy-in to adopt async/await.

**Action:**
1. Refactored one complex module as a proof of concept.
2. Presented data: 40% less code, easier error handling, better stack traces.
3. Addressed browser support concerns with transpilation.
4. Proposed gradual adoption: new code uses async/await; old code is refactored incrementally.

```javascript
// Before: callback hell
fetchUser(userId, (err, user) => {
  if (err) return handleError(err);
  fetchPosts(user.id, (err, posts) => {
    if (err) return handleError(err);
    render(user, posts);
  });
});

// After: async/await
async function loadUserData(userId) {
  try {
    const user = await fetchUser(userId);
    const posts = await fetchPosts(user.id);
    render(user, posts);
  } catch (error) {
    handleError(error);
  }
}
```

**Result:** Async/await became the team standard. Code review times decreased and async-related bugs dropped by 30%.

#### Interview guidance

**How to explain it:** "I demonstrate value with a concrete proof of concept and data, address concerns about migration risk, and propose incremental adoption rather than a big-bang rewrite."

**Difficulty:** Intermediate

---

### Performance optimization

#### Description

Describe a real performance optimization with measurable results.

#### Examples

**Situation:** A data dashboard rendering 10,000+ table rows took 5-6 seconds to load.

**Task:** Reduce render time to under one second.

**Action:**
1. Profiled with Chrome DevTools; 80% of time was DOM manipulation.
2. Implemented virtual scrolling to render only visible rows.
3. Used DocumentFragment for batch insertions.
4. Memoized expensive calculations.

```javascript
class VirtualTable {
  constructor(data, rowHeight) {
    this.data = data;
    this.rowHeight = rowHeight;
    this.visibleRows =
      Math.ceil(window.innerHeight / rowHeight) + 5;
  }

  render(scrollTop) {
    const start = Math.floor(scrollTop / this.rowHeight);
    const end = start + this.visibleRows;

    const fragment = document.createDocumentFragment();
    for (let i = start; i < end && this.data[i]; i++) {
      fragment.appendChild(this.createRow(this.data[i]));
    }
    this.tbody.innerHTML = '';
    this.tbody.appendChild(fragment);
  }
}
```

**Result:**

| Metric | Before | After | Improvement |
|---|---|---|---|
| Initial render | 6 s | 0.3 s | 95% faster |
| Scroll FPS | 15 | 60 | 4x smoother |
| Memory | 500 MB | 50 MB | 90% reduction |

#### Interview guidance

**How to explain it:** "I profiled first to find the bottleneck, then applied virtual scrolling to avoid rendering off-screen rows. The key insight was that DOM manipulation -- not data processing -- was the bottleneck."

**Difficulty:** Advanced

---

### Learning from a mistake

#### Description

Describe a bug you introduced, what you learned, and how you prevent similar issues.

#### Examples

**Situation:** Implemented auto-save with `setInterval` on a multi-page form.

**Task:** Prevent users from losing work when navigating away.

**Mistake:** Did not clear the interval on route changes. After visiting 10 pages, 10 intervals were running simultaneously.

```javascript
// ❌ Bug: intervals stack on every page visit
setInterval(() => saveFormData(), 30000);
```

```javascript
// ✅ Fix: track interval and clean up
class FormAutoSave {
  start() {
    this.intervalId = setInterval(
      () => saveFormData(), 30000
    );
  }
  stop() {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }
}

// React example
useEffect(() => {
  const autoSave = new FormAutoSave();
  autoSave.start();
  return () => autoSave.stop(); // cleanup on unmount
}, []);
```

**Result:** Fixed the bug, added monitoring, and created team guidelines for cleanup patterns.

**Lesson:** Always clean up side effects -- timers, listeners, subscriptions. Modern React's useEffect cleanup function makes this explicit.

#### Interview guidance

**How to explain it:** "I introduced stacking intervals by not cleaning up on route changes. The fix was simple, but the lesson shaped my practice: I now treat every side effect as something that needs explicit cleanup."

**Difficulty:** Intermediate

---

### Testing experience

#### Description

Describe introducing testing practices to a team and the impact on quality.

#### Examples

**Situation:** A project with zero test coverage had frequent regressions.

**Task:** Introduce testing and reach 80% coverage for critical paths.

**Action:**
1. Started with high-value areas: authentication and payments.
2. Chose Jest for unit tests and Cypress for end-to-end.
3. Created helpers, fixtures, and clear examples.
4. Added tests to CI/CD as a merge requirement.

```javascript
describe('debounce', () => {
  jest.useFakeTimers();

  it('calls the function once after the delay', () => {
    const mockFn = jest.fn();
    const debounced = debounce(mockFn, 300);

    debounced();
    debounced();
    debounced();

    expect(mockFn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(300);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
```

**Result:** Production bugs decreased by 60%. Deployment confidence increased and the team moved to weekly releases.

**Testing principles:**
- Test behavior, not implementation.
- Unit tests for logic, integration tests for flows, E2E for critical paths.
- Mock external dependencies, but not excessively.

#### Interview guidance

**How to explain it:** "I prioritize tests by business value, starting with the most critical paths. I use the testing pyramid: many unit tests, fewer integration tests, and targeted E2E tests. Tests must provide confidence, not just coverage numbers."

**Difficulty:** Intermediate

---

## Quick Reference

### Short-answer questions

| Question | Answer |
|---|---|
| `undefined` vs not defined? | `undefined` is a value (declared but not assigned). "not defined" is a `ReferenceError` (variable does not exist). |
| What does `"use strict"` do? | Enables strict mode: prevents accidental globals, throws errors for unsafe actions, disables deprecated features. |
| Output of `typeof null`? | `"object"` -- a historical bug that cannot be fixed. |
| What is a polyfill? | Code that implements a feature for environments that do not natively support it. |
| `call()` vs `apply()`? | Both invoke a function with a specified `this`. `call` takes comma-separated args; `apply` takes an array. |
| What is event bubbling? | Events propagate from the target element up through ancestors. Stopped with `stopPropagation()`. |
| Purpose of `Promise.race()`? | Returns a promise that settles as soon as the first promise in the iterable settles. |
| What is a WeakMap? | Like Map but keys must be objects and are weakly referenced (eligible for garbage collection). |
| What does `Object.freeze()` do? | Makes an object immutable at the top level (shallow freeze). Properties cannot be added, deleted, or modified. |
| `localStorage` vs `sessionStorage`? | `localStorage` persists until explicitly cleared. `sessionStorage` clears when the tab or window closes. |

### Most commonly asked topics

| Rank | Topic | Difficulty |
|---|---|---|
| 1 | Closures | Intermediate |
| 2 | The `this` keyword | Intermediate |
| 3 | `==` vs `===` | Beginner |
| 4 | Promises | Intermediate |
| 5 | Event loop | Intermediate |
| 6 | `var` / `let` / `const` | Beginner |
| 7 | Hoisting | Beginner |
| 8 | Debounce implementation | Intermediate |
| 9 | Prototypal inheritance | Intermediate |
| 10 | async/await vs Promises | Intermediate |

### Experience-level expectations

| Level | Years | Key expectations |
|---|---|---|
| Junior | 0-2 | Basic syntax, common methods, working code with guidance |
| Mid-level | 2-5 | Deep closures/scope, Promises and async/await, debugging, performance basics |
| Senior | 5+ | Systems thinking, performance profiling, memory management, architectural trade-offs, mentoring |

### Company-type focus areas

| Company type | Focus |
|---|---|
| Large tech | Algorithm complexity, system design, deep fundamentals, framework-agnostic knowledge |
| Startups | Ship fast, full-stack capability, modern frameworks, practical problem-solving |
| Enterprise | Code maintainability, testing strategy, security awareness, legacy code experience |

---

## See also

- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript.info](https://javascript.info/)
- [You Don't Know JS (book series)](https://github.com/getify/You-Dont-Know-JS)
- [Eloquent JavaScript](https://eloquentjavascript.net/)
- [TypeScript Interview Guide](./typescript-interview-mastery-guide.md)
- [React Interview Guide](./react-interview-mastery-guide.md)
- [Design Patterns Guide](./design-patterns-interview-mastery-guide.md)
- [DSA Interview Guide](./dsa-interview-mastery-guide.md)
- [System Design Guide](./system-design-interview-mastery-guide.md)
