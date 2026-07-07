#  TypeScript Interview Mastery Guide
## Your Complete Preparation Resource for Acing TypeScript Interviews

---

##  How to Use This Guide

This guide is designed to build your confidence and competence for TypeScript technical interviews. Here's how to get the most from it:

### Study Strategy
1. **Start with Foundational Questions** - Master TypeScript basics first (80% of interviews cover these)
2. **Practice typing real code** - Convert JavaScript projects to TypeScript
3. **Understand the "why"** - Know why TypeScript catches errors at compile-time
4. **Time yourself** - Aim to explain concepts in 2-3 minutes
5. **Build typed projects** - Apply concepts to solidify understanding

### Progressive Learning Path
- **Week 1**: Foundational Questions (Q1-10) + Basic Types
- **Week 2**: Advanced Types (Q11-15) + Generics
- **Week 3**: Practical Coding (Q16-20) + Type Guards
- **Week 4**: Advanced Patterns (Q26-30) + Real-World Scenarios
- **Final Review**: Company-specific focus + mock interviews

---

##  What Interviewers Look For in TypeScript Questions

### They're Evaluating:
1. **Type System Mastery** - Understanding primitive and complex types
2. **Generics** - Writing reusable, type-safe code
3. **Type Guards** - Runtime type checking
4. **Utility Types** - Partial, Pick, Omit, Record, etc.
5. **Advanced Patterns** - Conditional types, mapped types, template literals
6. **Practical Application** - How you use TypeScript in real projects

### Red Flags They're Watching For:
-  Using `any` everywhere (defeats TypeScript's purpose)
-  Not understanding the difference between types and interfaces
-  Can't explain when to use generics
-  No knowledge of utility types
-  Can't implement type guards
-  Not understanding TypeScript's structural typing

### Green Flags That Impress:
-  Explaining type inference clearly
-  Using discriminated unions effectively
-  Creating reusable generic utilities
-  Understanding variance (covariance, contravariance)
-  Proper error handling with typed errors
-  Knowledge of TypeScript compiler options

---

##  Tips for Answering Confidently

### The TYPE Framework for TypeScript Questions:
- **T**ype: State the type definition clearly first
- **Y**ield: Explain why this typing approach is beneficial
- **P**ractical: Provide real-world code example
- **E**dge: Mention edge cases or alternatives

### Example:
**Q: What are union types?**
- **Type**: "Union types allow a value to be one of several types, defined with the `|` operator."
- **Yield**: "They provide type safety while maintaining flexibility, especially for function parameters that accept multiple types."
- **Practical**: [Show code example with union]
- **Edge**: "For complex unions, use discriminated unions for better type narrowing."

### TypeScript-Specific Communication Tips:
- **Think in types**: "This parameter should be typed as..."
- **Discuss type safety**: "This prevents runtime errors by catching them at compile-time..."
- **Mention tooling**: "The IDE will autocomplete here because..."
- **Show inference**: "TypeScript can infer this type, but explicit is better for clarity..."

---

##  How to Handle "I Don't Know" Gracefully

### TypeScript-Specific Recovery Strategies:

#### 1. The Type Inference Response
> "I haven't used that specific utility type, but based on TypeScript's type transformation patterns, I'd expect it to [logical guess]. Let me verify the signature."

#### 2. The Practical Approach Response
> "I'm not familiar with that advanced type, but here's how I'd solve the problem with the types I know: [demonstrate solution]"

#### 3. The Compiler Response
> "I haven't encountered that error before, but I'd check the TypeScript compiler error message which usually provides excellent guidance, and consult the official docs."

#### 4. The Evolution Response
> "That might be a newer TypeScript feature. Which version introduced it? I'm most familiar with TypeScript 4.x features."

---

##  FOUNDATIONAL QUESTIONS (Q1-10)
###  Must-Know TypeScript Concepts Every Developer Should Explain

---

### **Q1: What is TypeScript? Why use it over JavaScript?**
**Difficulty**:  Junior | **Frequency**: 

####  Strong Answer:
"TypeScript is a strongly-typed superset of JavaScript that compiles to plain JavaScript. It adds optional static typing, interfaces, classes, and modern JavaScript features.

**Key Benefits:**
1. **Type Safety** - Catch errors at compile-time, not runtime
2. **Better IDE Support** - Autocompletion, refactoring, navigation
3. **Self-Documenting** - Types serve as inline documentation
4. **Scalability** - Easier to maintain large codebases
5. **Modern Features** - ES6+ features that compile to older JS
6. **Refactoring Confidence** - Safe to rename, move, modify code"

####  What to Say (Exact Phrasing):
```typescript
// JavaScript - No type safety
function add(a, b) {
  return a + b;
}

add(5, "10");  // "510" - Runtime bug!
add(5);        // NaN - Runtime bug!

// TypeScript - Compile-time safety
function add(a: number, b: number): number {
  return a + b;
}

add(5, "10");  //  Error: Argument of type 'string' not assignable to parameter of type 'number'
add(5);        //  Error: Expected 2 arguments, but got 1

// Real-world example
interface User {
  id: number;
  name: string;
  email: string;
  age?: number;  // Optional property
}

function getUser(id: number): User {
  // Return type enforced
  return {
    id: id,
    name: "Alice",
    email: "alice@example.com"
  };
}

const user = getUser(1);
console.log(user.name);      //  TypeScript knows 'name' exists
console.log(user.address);   //  Error: Property 'address' does not exist

// JavaScript equivalent - no safety
function getUserJS(id) {
  return {
    id: id,
    name: "Alice",
    email: "alice@example.com"
  };
}

const userJS = getUserJS(1);
console.log(userJS.address);  // undefined - Silent runtime bug!
```

####  Follow-up Discussion Points:
- "TypeScript is a development tool - it compiles away, leaving optimized JavaScript"
- "The type system is structural, not nominal - types match based on shape"
- "TypeScript supports gradual typing - you can adopt it incrementally"
- "Major companies (Microsoft, Google, Airbnb, Slack) use TypeScript for large-scale apps"

####  Weak Answer:
- "TypeScript is just JavaScript with types" (incomplete)
- "It makes code slower" (false - compiles to same JS)
- "You have to type everything" (false - type inference)
- Not mentioning tooling benefits

#### Common Interviewer Follow-ups:
1. **"What are the downsides of TypeScript?"**
   - "Learning curve for developers new to static typing. Initial setup and configuration. Longer compile times. Some JavaScript libraries lack good type definitions. More verbose code compared to JavaScript."

2. **"Can you mix JavaScript and TypeScript?"**
   - "Yes! TypeScript can gradually be adopted. JS files can coexist with TS files. You can use `allowJs` and `checkJs` compiler options to type-check JavaScript files. Type definition files (.d.ts) bridge TypeScript and JavaScript libraries."

3. **"How does TypeScript compilation work?"**
   - "TypeScript uses the `tsc` compiler to transform .ts files to .js files. It performs type checking, then transpiles to the target JavaScript version (ES5, ES6, etc.). The compiler strips away all type annotations, leaving vanilla JavaScript."

---

### **Q2: What's the difference between `type` and `interface`?**
**Difficulty**:  Junior | **Frequency**: 

####  Strong Answer:
"Both `type` and `interface` are used to define object shapes in TypeScript, but they have different capabilities and use cases.

**Interfaces:**
- Can be extended and merged (declaration merging)
- Better for object-oriented programming
- Better error messages
- Can only describe object shapes

**Types:**
- More flexible - can represent unions, intersections, primitives
- Cannot be reopened to add new properties
- Can use computed properties
- Better for functional programming patterns"

####  What to Say (Exact Phrasing):
```typescript
// ===== INTERFACES =====

// Basic interface
interface User {
  id: number;
  name: string;
  email: string;
}

// Extending interfaces
interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

// Declaration merging (interfaces can be reopened)
interface User {
  createdAt: Date;  // This merges with the first User interface
}

const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  createdAt: new Date()  //  Works due to declaration merging
};

// Multiple inheritance
interface Timestamp {
  createdAt: Date;
  updatedAt: Date;
}

interface Product extends User, Timestamp {
  price: number;
}

// ===== TYPE ALIASES =====

// Basic type
type UserType = {
  id: number;
  name: string;
  email: string;
};

// Union types (interfaces can't do this)
type Status = 'pending' | 'approved' | 'rejected';
type ID = string | number;

// Intersection types
type AdminType = UserType & {
  role: 'admin';
  permissions: string[];
};

// Complex types
type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

// Primitive types
type Count = number;
type Callback = () => void;

// Tuple types
type Point = [number, number];
type RGB = [red: number, green: number, blue: number];

// Mapped types
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// Conditional types
type NonNullable<T> = T extends null | undefined ? never : T;

//  Interfaces can't do this
// interface Status = 'pending' | 'approved';  // Error!

//  Types can't be reopened (no declaration merging)
type UserType = {
  createdAt: Date;  // Error: Duplicate identifier
};

// ===== WHEN TO USE WHICH =====

// Use INTERFACE for:
// 1. Object shapes that might be extended
interface Animal {
  name: string;
  age: number;
}

interface Dog extends Animal {
  breed: string;
  bark(): void;
}

// 2. Public APIs (declaration merging useful for augmentation)
interface Config {
  apiUrl: string;
}

// Later, consumers can extend
interface Config {
  timeout: number;
}

// 3. Object-oriented patterns
interface Repository<T> {
  find(id: number): Promise<T>;
  save(entity: T): Promise<void>;
}

class UserRepository implements Repository<User> {
  async find(id: number): Promise<User> {
    // Implementation
  }
  async save(entity: User): Promise<void> {
    // Implementation
  }
}

// Use TYPE for:
// 1. Union types
type Theme = 'light' | 'dark';
type Response = SuccessResponse | ErrorResponse;

// 2. Intersection types
type Employee = Person & Worker & {
  employeeId: string;
};

// 3. Mapped types
type Optional<T> = {
  [K in keyof T]?: T[K];
};

// 4. Conditional types
type Unwrap<T> = T extends Promise<infer U> ? U : T;

// 5. Tuple types
type Coordinate = [x: number, y: number, z: number];

// ===== PRACTICAL COMPARISON =====

// Both work for basic objects
interface PersonInterface {
  name: string;
  age: number;
}

type PersonType = {
  name: string;
  age: number;
};

// Both work for functions
interface Add {
  (a: number, b: number): number;
}

type AddType = (a: number, b: number) => number;

// Interfaces have better error messages
interface UserData {
  id: number;
  profile: {
    name: string;
    email: string;
  };
}

const userData: UserData = {
  id: 1,
  profile: {
    name: "Alice"
    // Error: Property 'email' is missing in type...
    // Clear indication of what's missing
  }
};
```

####  Follow-up Discussion Points:
- "**Rule of thumb**: Use `interface` for objects, use `type` for everything else"
- "**Performance**: Both have identical runtime performance (they're erased at compile-time)"
- "**Official recommendation**: TypeScript docs suggest preferring `interface` until you need `type` features"
- "**Declaration merging** is useful for extending third-party libraries"

####  Weak Answer:
- "They're the same thing" (false)
- "Always use interface" or "Always use type" (dogmatic)
- Not knowing declaration merging
- Not understanding union types

#### Common Interviewer Follow-ups:
1. **"Can you extend a type with an interface?"**
   - "Yes! Interfaces can extend types: `interface Admin extends UserType { role: string; }`. This works because TypeScript uses structural typing - it only cares about the shape."

2. **"What is declaration merging and when is it useful?"**
   - "Declaration merging allows you to define an interface multiple times, and TypeScript merges them into one. It's useful for augmenting third-party library types or splitting large interfaces across files. Only interfaces support this."

3. **"When would you choose type over interface?"**
   - "When I need union types, intersection types, mapped types, conditional types, or when aliasing primitives or tuples. For example: `type Status = 'active' | 'inactive'` or `type Point = [number, number]`."

---

### **Q3: Explain TypeScript's basic types**
**Difficulty**:  Junior | **Frequency**: 

####  Strong Answer:
"TypeScript has several built-in types: primitives (string, number, boolean), special types (any, unknown, never, void), object types (object, array, tuple), and advanced types (union, intersection, literal)."

####  What to Say (Exact Phrasing):
```typescript
// ===== PRIMITIVE TYPES =====

// String
let username: string = "Alice";
let message: string = `Hello, ${username}`;

// Number (integers, floats, hex, binary, octal)
let age: number = 25;
let price: number = 19.99;
let hex: number = 0xf00d;
let binary: number = 0b1010;

// Boolean
let isActive: boolean = true;
let hasAccess: boolean = false;

// ===== SPECIAL TYPES =====

// any - Disables type checking (avoid when possible)
let anything: any = "string";
anything = 42;           //  OK
anything = true;         //  OK
anything.foo.bar.baz;   //  No error (dangerous!)

// unknown - Type-safe version of any
let userInput: unknown = getUserInput();
// userInput.toUpperCase();  //  Error: Object is of type 'unknown'

// Must narrow type first
if (typeof userInput === "string") {
  userInput.toUpperCase();  //  OK
}

// void - No return value
function logMessage(msg: string): void {
  console.log(msg);
  // No return statement
}

// never - Never returns (throws or infinite loop)
function throwError(message: string): never {
  throw new Error(message);
  // Never reaches end
}

function infiniteLoop(): never {
  while (true) {}
}

// undefined and null
let notAssigned: undefined = undefined;
let empty: null = null;

// With strictNullChecks: false, can assign to any type
// With strictNullChecks: true, must explicitly allow
let name: string | null = null;  // Union type

// ===== ARRAY TYPES =====

// Array of numbers
let numbers: number[] = [1, 2, 3, 4, 5];
let alsoNumbers: Array<number> = [1, 2, 3];

// Array of strings
let names: string[] = ["Alice", "Bob", "Charlie"];

// Array of objects
interface User {
  id: number;
  name: string;
}

let users: User[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
];

// Mixed arrays (use union)
let mixed: (string | number)[] = [1, "two", 3, "four"];

// Readonly arrays
let immutable: readonly number[] = [1, 2, 3];
// immutable.push(4);  //  Error: Property 'push' does not exist

// ===== TUPLE TYPES =====

// Fixed-length array with specific types
let tuple: [string, number] = ["Alice", 25];
let point: [number, number] = [10, 20];

// Named tuple elements (TypeScript 4.0+)
let employee: [name: string, age: number, active: boolean] = ["Alice", 25, true];

// Optional tuple elements
let optional: [string, number?] = ["Alice"];
let withValue: [string, number?] = ["Bob", 30];

// Rest elements in tuples
let rest: [string, ...number[]] = ["Alice", 1, 2, 3, 4];

// ===== OBJECT TYPES =====

// Object type
let user: { name: string; age: number } = {
  name: "Alice",
  age: 25
};

// Optional properties
let optionalUser: { name: string; age?: number } = {
  name: "Bob"  // age is optional
};

// Readonly properties
let readonlyUser: { readonly id: number; name: string } = {
  id: 1,
  name: "Alice"
};
// readonlyUser.id = 2;  //  Error: Cannot assign to 'id'

// Index signatures
let dictionary: { [key: string]: number } = {
  apples: 5,
  oranges: 10,
  bananas: 7
};

// ===== ENUM TYPES =====

// Numeric enum
enum Direction {
  Up,      // 0
  Down,    // 1
  Left,    // 2
  Right    // 3
}

let dir: Direction = Direction.Up;
console.log(dir);  // 0

// String enum
enum Status {
  Pending = "PENDING",
  Approved = "APPROVED",
  Rejected = "REJECTED"
}

let status: Status = Status.Pending;
console.log(status);  // "PENDING"

// Const enum (no JavaScript output)
const enum LogLevel {
  Debug,
  Info,
  Error
}

let level = LogLevel.Debug;  // Inlined as 0 in JS

// ===== UNION TYPES =====

// Multiple possible types
type StringOrNumber = string | number;
let value: StringOrNumber = "hello";
value = 42;  //  Also OK

// Union with literals
type Status = "pending" | "approved" | "rejected";
let orderStatus: Status = "pending";
// orderStatus = "shipped";  //  Error: Not in union

// ===== INTERSECTION TYPES =====

// Combine multiple types
type Person = {
  name: string;
  age: number;
};

type Employee = {
  employeeId: string;
  department: string;
};

type Worker = Person & Employee;

let worker: Worker = {
  name: "Alice",
  age: 25,
  employeeId: "E123",
  department: "Engineering"
};

// ===== LITERAL TYPES =====

// String literals
let direction: "left" | "right" | "up" | "down" = "left";

// Number literals
let diceRoll: 1 | 2 | 3 | 4 | 5 | 6 = 3;

// Boolean literals (rarely used)
let alwaysTrue: true = true;

// Combined with types
type SuccessResponse = {
  success: true;
  data: any;
};

type ErrorResponse = {
  success: false;
  error: string;
};

type ApiResponse = SuccessResponse | ErrorResponse;

// ===== TYPE ASSERTIONS =====

// Angle bracket syntax
let someValue: unknown = "this is a string";
let strLength: number = (<string>someValue).length;

// as syntax (preferred, works in JSX)
let strLength2: number = (someValue as string).length;

// Non-null assertion
function getElement(id: string): HTMLElement | null {
  return document.getElementById(id);
}

let element = getElement("myId")!;  // Assert it's not null
element.innerHTML = "Hello";  // No null check needed (dangerous!)

// ===== FUNCTION TYPES =====

// Function with typed parameters and return
function add(a: number, b: number): number {
  return a + b;
}

// Optional parameters
function greet(name: string, greeting?: string): string {
  return `${greeting || "Hello"}, ${name}`;
}

// Default parameters
function multiply(a: number, b: number = 1): number {
  return a * b;
}

// Rest parameters
function sum(...numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0);
}

// Function type
type MathOperation = (a: number, b: number) => number;

const subtract: MathOperation = (a, b) => a - b;

// ===== COMPARISON: any vs unknown =====

// any - Opt out of type checking
let anyValue: any = "hello";
anyValue.toUpperCase();     //  No error
anyValue.foo.bar.baz;      //  No error (runtime crash!)
anyValue();                 //  No error

// unknown - Type-safe any
let unknownValue: unknown = "hello";
// unknownValue.toUpperCase();  //  Error

// Must narrow type
if (typeof unknownValue === "string") {
  unknownValue.toUpperCase();  //  OK
}

// Use unknown instead of any when:
// - Receiving data from external source
// - Don't know the type yet
// - Want to force type checking before use
```

####  Follow-up Discussion Points:
- "**Prefer `unknown` over `any`** - it's type-safe and forces you to check before use"
- "**`never` type** represents values that never occur - useful in exhaustive checks"
- "**`void` vs `undefined`** - void means 'ignored', undefined is an actual value"
- "**Strict mode** (`strictNullChecks`) prevents null/undefined bugs"

####  Weak Answer:
- Not knowing the difference between `any` and `unknown`
- Using `any` everywhere
- Not understanding `never` type
- Confusing `void` with `undefined`

#### Common Interviewer Follow-ups:
1. **"When would you use `never` type?"**
   - "Functions that throw errors, infinite loops, or in exhaustive type checks with switch statements. For example, after handling all cases in a discriminated union, the default case should be `never` to catch unhandled cases at compile-time."

2. **"What's the difference between `any` and `unknown`?"**
   - "`any` disables type checking completely - you can do anything. `unknown` is type-safe - you must narrow the type before using it. Use `unknown` when you don't know the type but want safety."

3. **"Explain `void` vs `undefined` as return types"**
   - "`void` means the return value is ignored (can be anything or nothing). `undefined` specifically means returning the value `undefined`. A function typed as `void` can return `undefined`, but not vice versa."

---

### **Q4: What are Generics in TypeScript?**
**Difficulty**:  Mid-Level | **Frequency**: 

####  Strong Answer:
"Generics allow you to create reusable components that work with multiple types while maintaining type safety. They're like 'type parameters' that you pass to functions, classes, or interfaces."

####  What to Say (Exact Phrasing):
```typescript
// ===== BASIC GENERICS =====

// Without generics - have to duplicate for each type
function identityString(arg: string): string {
  return arg;
}

function identityNumber(arg: number): number {
  return arg;
}

// With any - lose type safety
function identityAny(arg: any): any {
  return arg;  // Could return anything!
}

// With generics - reusable and type-safe
function identity<T>(arg: T): T {
  return arg;
}

// Usage - TypeScript infers the type
let output1 = identity("hello");  // T is string
let output2 = identity(42);       // T is number
let output3 = identity(true);     // T is boolean

// Explicit type argument
let output4 = identity<string>("hello");

// ===== GENERIC FUNCTIONS =====

// Generic function with array
function getFirst<T>(arr: T[]): T | undefined {
  return arr[0];
}

const firstNumber = getFirst([1, 2, 3]);     // number | undefined
const firstName = getFirst(["a", "b", "c"]); // string | undefined

// Multiple type parameters
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const stringNumber = pair("age", 25);           // [string, number]
const booleanString = pair(true, "confirmed");  // [boolean, string]

// Generic with constraints
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;  // OK because T has 'length'
}

getLength("hello");        //  OK - string has length
getLength([1, 2, 3]);      //  OK - array has length
getLength({ length: 10 }); //  OK - object has length
// getLength(42);          //  Error: number doesn't have length

// ===== GENERIC INTERFACES =====

interface Box<T> {
  value: T;
}

let stringBox: Box<string> = { value: "hello" };
let numberBox: Box<number> = { value: 42 };

// Generic interface with methods
interface Repository<T> {
  findById(id: number): Promise<T>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<void>;
  delete(id: number): Promise<void>;
}

interface User {
  id: number;
  name: string;
  email: string;
}

class UserRepository implements Repository<User> {
  async findById(id: number): Promise<User> {
    // Implementation
    return { id, name: "Alice", email: "alice@example.com" };
  }
  
  async findAll(): Promise<User[]> {
    // Implementation
    return [];
  }
  
  async save(entity: User): Promise<void> {
    // Implementation
  }
  
  async delete(id: number): Promise<void> {
    // Implementation
  }
}

// ===== GENERIC CLASSES =====

class Stack<T> {
  private items: T[] = [];
  
  push(item: T): void {
    this.items.push(item);
  }
  
  pop(): T | undefined {
    return this.items.pop();
  }
  
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }
  
  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
// numberStack.push("3");  //  Error: string not assignable to number

const stringStack = new Stack<string>();
stringStack.push("hello");
stringStack.push("world");

// ===== GENERIC CONSTRAINTS =====

// Constrain to specific types
function merge<T extends object, U extends object>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const merged = merge({ name: "Alice" }, { age: 25 });
// merged has type { name: string } & { age: number }

// merge({ name: "Alice" }, 25);  //  Error: 25 is not an object

// Using keyof with generics
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = { name: "Alice", age: 25, email: "alice@example.com" };

const name = getProperty(person, "name");    // string
const age = getProperty(person, "age");      // number
// const invalid = getProperty(person, "address");  //  Error: "address" not in keyof person

// ===== GENERIC UTILITY FUNCTIONS =====

// Map array to different type
function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}

const numbers = [1, 2, 3, 4, 5];
const strings = map(numbers, n => n.toString());  // string[]
const doubled = map(numbers, n => n * 2);         // number[]

// Filter with type guard
function filter<T>(arr: T[], predicate: (item: T) => boolean): T[] {
  return arr.filter(predicate);
}

const filtered = filter([1, 2, 3, 4, 5], n => n > 2);  // [3, 4, 5]

// Reduce with generic accumulator
function reduce<T, U>(
  arr: T[],
  fn: (acc: U, item: T) => U,
  initial: U
): U {
  return arr.reduce(fn, initial);
}

const sum = reduce([1, 2, 3], (acc, n) => acc + n, 0);  // number

// ===== REAL-WORLD EXAMPLES =====

// API Response wrapper
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

async function fetchUser(id: number): Promise<ApiResponse<User>> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// Result type (Either pattern)
type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return { success: false, error: "Division by zero" };
  }
  return { success: true, value: a / b };
}

const result = divide(10, 2);
if (result.success) {
  console.log(result.value);  // TypeScript knows 'value' exists
} else {
  console.log(result.error);  // TypeScript knows 'error' exists
}

// Promise wrapper
type AsyncData<T> = {
  loading: boolean;
  data: T | null;
  error: Error | null;
};

function useAsync<T>(promise: Promise<T>): AsyncData<T> {
  // Implementation
  return { loading: false, data: null, error: null };
}

// Event emitter
class EventEmitter<T> {
  private listeners: Array<(event: T) => void> = [];
  
  on(listener: (event: T) => void): void {
    this.listeners.push(listener);
  }
  
  emit(event: T): void {
    this.listeners.forEach(listener => listener(event));
  }
}

interface UserEvent {
  type: 'login' | 'logout';
  userId: number;
}

const emitter = new EventEmitter<UserEvent>();
emitter.on((event) => {
  console.log(event.type, event.userId);  // TypeScript knows the shape
});

// ===== DEFAULT GENERIC PARAMETERS =====

interface Response<T = any> {
  data: T;
  status: number;
}

// Can use without specifying T (defaults to any)
const response1: Response = { data: "anything", status: 200 };

// Or specify T
const response2: Response<User> = {
  data: { id: 1, name: "Alice", email: "alice@example.com" },
  status: 200
};

// ===== CONDITIONAL TYPES WITH GENERICS =====

type Unwrap<T> = T extends Promise<infer U> ? U : T;

type A = Unwrap<Promise<string>>;  // string
type B = Unwrap<string>;            // string

type Flatten<T> = T extends Array<infer U> ? U : T;

type C = Flatten<number[]>;  // number
type D = Flatten<number>;    // number
```

####  Follow-up Discussion Points:
- "**Generics preserve type information** - unlike `any`, you maintain full type safety"
- "**Type inference works with generics** - often don't need to specify type parameters"
- "**Constraints make generics more useful** - ensure T has certain properties"
- "**React heavily uses generics** - useState<T>, useReducer<S, A>, etc."

####  Weak Answer:
- "Generics are like variables for types" (too vague)
- Not knowing when to use constraints
- Can't explain why generics are better than `any`
- Not understanding type inference with generics

#### Common Interviewer Follow-ups:
1. **"What are generic constraints and why use them?"**
   - "Generic constraints limit what types can be used with a generic. For example, `<T extends { length: number }>` ensures T has a `length` property. This lets you safely access properties while maintaining reusability."

2. **"Explain the difference between `<T>` and `any`"**
   - "With `any`, you lose all type information and safety. With `<T>`, TypeScript tracks the specific type used, maintains type safety, and provides proper IDE autocomplete. `<T>` is type-safe reusability."

3. **"When would you use multiple type parameters?"**
   - "When functions work with multiple different types: `function pair<T, U>(a: T, b: U): [T, U]` or for maps/dictionaries: `Map<K, V>`. Each parameter represents a distinct type that needs tracking."

---

### **Q5: What are Type Guards in TypeScript?**
**Difficulty**:  Mid-Level | **Frequency**: 

####  Strong Answer:
"Type guards are runtime checks that narrow types within a conditional block. They allow TypeScript to understand that a value is a more specific type in certain code paths."

####  What to Say (Exact Phrasing):
```typescript
// ===== BUILT-IN TYPE GUARDS =====

// typeof type guard
function processValue(value: string | number) {
  if (typeof value === "string") {
    // TypeScript knows value is string here
    return value.toUpperCase();
  } else {
    // TypeScript knows value is number here
    return value.toFixed(2);
  }
}

// instanceof type guard
class Dog {
  bark() {
    console.log("Woof!");
  }
}

class Cat {
  meow() {
    console.log("Meow!");
  }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark();  // TypeScript knows it's Dog
  } else {
    animal.meow();  // TypeScript knows it's Cat
  }
}

// in operator type guard
interface Car {
  drive(): void;
}

interface Boat {
  sail(): void;
}

function operate(vehicle: Car | Boat) {
  if ("drive" in vehicle) {
    vehicle.drive();  // TypeScript knows it's Car
  } else {
    vehicle.sail();   // TypeScript knows it's Boat
  }
}

// ===== CUSTOM TYPE GUARDS =====

// User-defined type guard with 'is'
interface Fish {
  swim(): void;
}

interface Bird {
  fly(): void;
}

// Type predicate function
function isFish(animal: Fish | Bird): animal is Fish {
  return (animal as Fish).swim !== undefined;
}

function move(animal: Fish | Bird) {
  if (isFish(animal)) {
    animal.swim();  // TypeScript knows it's Fish
  } else {
    animal.fly();   // TypeScript knows it's Bird
  }
}

// More complex type guard
interface SuccessResponse {
  success: true;
  data: any;
}

interface ErrorResponse {
  success: false;
  error: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;

function isSuccessResponse(response: ApiResponse): response is SuccessResponse {
  return response.success === true;
}

function handleResponse(response: ApiResponse) {
  if (isSuccessResponse(response)) {
    console.log(response.data);  // TypeScript knows 'data' exists
  } else {
    console.error(response.error);  // TypeScript knows 'error' exists
  }
}

// ===== DISCRIMINATED UNIONS =====

// Tagged union (most powerful pattern)
interface Square {
  kind: "square";
  size: number;
}

interface Rectangle {
  kind: "rectangle";
  width: number;
  height: number;
}

interface Circle {
  kind: "circle";
  radius: number;
}

type Shape = Square | Rectangle | Circle;

function area(shape: Shape): number {
  switch (shape.kind) {
    case "square":
      // TypeScript knows it's Square
      return shape.size * shape.size;
    
    case "rectangle":
      // TypeScript knows it's Rectangle
      return shape.width * shape.height;
    
    case "circle":
      // TypeScript knows it's Circle
      return Math.PI * shape.radius ** 2;
    
    default:
      // Exhaustiveness check
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}

// Real-world example: Action types
type Action =
  | { type: "SET_USER"; payload: User }
  | { type: "CLEAR_USER" }
  | { type: "UPDATE_PROFILE"; payload: Partial<User> };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_USER":
      // TypeScript knows action.payload exists and is User
      return { ...state, user: action.payload };
    
    case "CLEAR_USER":
      // TypeScript knows there's no payload
      return { ...state, user: null };
    
    case "UPDATE_PROFILE":
      // TypeScript knows action.payload is Partial<User>
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null
      };
    
    default:
      const _exhaustive: never = action;
      return state;
  }
}

// ===== ASSERTION FUNCTIONS =====

// Assert function (throws if false)
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("Value must be a string");
  }
}

function processInput(input: unknown) {
  assertIsString(input);
  // After assertion, TypeScript knows input is string
  return input.toUpperCase();
}

// Non-null assertion function
function assertDefined<T>(value: T | null | undefined): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error("Value must be defined");
  }
}

function getUserName(user: User | null): string {
  assertDefined(user);
  // After assertion, TypeScript knows user is not null
  return user.name;
}

// ===== NARROWING WITH EQUALITY =====

function example(x: string | number, y: string | boolean) {
  if (x === y) {
    // TypeScript narrows both to string (the common type)
    x.toUpperCase();  // OK
    y.toUpperCase();  // OK
  }
}

// Truthiness narrowing
function printLength(str: string | null) {
  if (str) {
    // TypeScript knows str is string (not null)
    console.log(str.length);
  }
}

// ===== ARRAY TYPE GUARDS =====

function isStringArray(arr: unknown): arr is string[] {
  return Array.isArray(arr) && arr.every(item => typeof item === "string");
}

function processArray(arr: unknown) {
  if (isStringArray(arr)) {
    // TypeScript knows arr is string[]
    arr.forEach(str => console.log(str.toUpperCase()));
  }
}

// ===== PRACTICAL EXAMPLES =====

// Validate user input
interface ValidUser {
  name: string;
  email: string;
  age: number;
}

function isValidUser(obj: any): obj is ValidUser {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.name === "string" &&
    typeof obj.email === "string" &&
    typeof obj.age === "number"
  );
}

function registerUser(data: unknown) {
  if (isValidUser(data)) {
    // TypeScript knows data is ValidUser
    console.log(`Registering ${data.name}`);
  } else {
    throw new Error("Invalid user data");
  }
}

// API response validation
interface ApiSuccess<T> {
  ok: true;
  data: T;
}

interface ApiError {
  ok: false;
  error: string;
}

type ApiResult<T> = ApiSuccess<T> | ApiError;

function isApiSuccess<T>(result: ApiResult<T>): result is ApiSuccess<T> {
  return result.ok === true;
}

async function fetchData<T>(url: string): Promise<T> {
  const response: ApiResult<T> = await fetch(url).then(r => r.json());
  
  if (isApiSuccess(response)) {
    return response.data;  // TypeScript knows 'data' exists
  } else {
    throw new Error(response.error);  // TypeScript knows 'error' exists
  }
}

// Form field validation
type FormField = {
  value: string;
  error?: string;
};

function hasError(field: FormField): field is FormField & { error: string } {
  return field.error !== undefined;
}

function validateForm(fields: FormField[]) {
  const errors = fields.filter(hasError);
  // TypeScript knows each item in errors has defined 'error' property
  errors.forEach(field => console.log(field.error.toUpperCase()));
}
```

####  Follow-up Discussion Points:
- "**Discriminated unions** are the most elegant pattern - single field determines the type"
- "**Type guards enable exhaustive checking** - catch missing cases at compile-time"
- "**Use `unknown` instead of `any`** for inputs, then narrow with type guards"
- "**Assertion functions** are useful for input validation that throws errors"

####  Weak Answer:
- Not knowing built-in type guards (typeof, instanceof, in)
- Using type assertions instead of type guards
- Not understanding discriminated unions
- Can't write custom type guard functions

#### Common Interviewer Follow-ups:
1. **"What's the difference between type assertion and type guard?"**
   - "Type assertion (`as`) tells TypeScript 'trust me, I know the type' without runtime check. Type guards perform runtime checks and narrow types safely. Assertions can be wrong, guards are verified."

2. **"What is a discriminated union?"**
   - "A union of types that share a common literal property (the discriminant). By checking this property, TypeScript narrows to the specific type. Example: `{ type: 'success', data }` vs `{ type: 'error', message }`."

3. **"How do you create exhaustive type checking?"**
   - "In a switch with discriminated union, add a default case that assigns to `never`. If you miss a case, TypeScript errors because the unhandled type can't be assigned to `never`."

---

*[Continuing with Q6-Q10...]*

### **Q6: Explain utility types in TypeScript**
**Difficulty**:  Mid-Level | **Frequency**: 

####  Strong Answer:
"TypeScript provides built-in utility types that transform existing types. Common ones include Partial, Required, Readonly, Pick, Omit, Record, Exclude, Extract, and ReturnType."

####  What to Say (Exact Phrasing):
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  address: string;
}

// ===== Partial<T> - Makes all properties optional =====
type PartialUser = Partial<User>;
// Equivalent to:
// {
//   id?: number;
//   name?: string;
//   email?: string;
//   age?: number;
//   address?: string;
// }

// Use case: Update functions
function updateUser(id: number, updates: Partial<User>) {
  // Can update any subset of properties
  console.log("Updating user", id, updates);
}

updateUser(1, { name: "Alice" });  // OK
updateUser(2, { age: 26, email: "new@example.com" });  // OK

// ===== Required<T> - Makes all properties required =====
interface Config {
  apiUrl?: string;
  timeout?: number;
  retries?: number;
}

type RequiredConfig = Required<Config>;
// All properties are now required

function initApp(config: RequiredConfig) {
  // Must provide all properties
}

// ===== Readonly<T> - Makes all properties readonly =====
type ReadonlyUser = Readonly<User>;

const user: ReadonlyUser = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  age: 25,
  address: "123 Main St"
};

// user.name = "Bob";  //  Error: Cannot assign to 'name' because it is a read-only property

// ===== Pick<T, K> - Select specific properties =====
type UserPreview = Pick<User, "id" | "name">;
// Equivalent to:
// {
//   id: number;
//   name: string;
// }

function displayUserPreview(user: UserPreview) {
  console.log(`${user.id}: ${user.name}`);
}

// ===== Omit<T, K> - Remove specific properties =====
type UserWithoutId = Omit<User, "id">;
// Equivalent to:
// {
//   name: string;
//   email: string;
//   age: number;
//   address: string;
// }

type UserPublic = Omit<User, "email" | "address">;
// Only id, name, age remain

// ===== Record<K, T> - Create object type with specific keys and value type =====
type UserRoles = Record<string, "admin" | "user" | "guest">;

const roles: UserRoles = {
  "alice": "admin",
  "bob": "user",
  "charlie": "guest"
};

// Typed dictionary
type PageInfo = Record<"home" | "about" | "contact", { title: string; url: string }>;

const pages: PageInfo = {
  home: { title: "Home", url: "/" },
  about: { title: "About", url: "/about" },
  contact: { title: "Contact", url: "/contact" }
};

// ===== Exclude<T, U> - Remove types from union =====
type T1 = Exclude<"a" | "b" | "c", "a">;  // "b" | "c"
type T2 = Exclude<string | number | boolean, boolean>;  // string | number

// Practical example
type AllEvents = "click" | "scroll" | "mouseenter" | "mouseleave";
type MouseEvents = Exclude<AllEvents, "scroll">;  // "click" | "mouseenter" | "mouseleave"

// ===== Extract<T, U> - Keep only types that match =====
type T3 = Extract<"a" | "b" | "c", "a" | "f">;  // "a"
type T4 = Extract<string | number | boolean, boolean>;  // boolean

// ===== NonNullable<T> - Remove null and undefined =====
type T5 = NonNullable<string | number | null | undefined>;  // string | number

function getValue(): string | null {
  return Math.random() > 0.5 ? "value" : null;
}

type Value = NonNullable<ReturnType<typeof getValue>>;  // string

// ===== ReturnType<T> - Get return type of function =====
function getUser() {
  return {
    id: 1,
    name: "Alice",
    email: "alice@example.com"
  };
}

type UserReturn = ReturnType<typeof getUser>;
// Type is { id: number; name: string; email: string; }

// ===== Parameters<T> - Get parameters tuple of function =====
function createUser(name: string, age: number, email: string) {
  return { name, age, email };
}

type CreateUserParams = Parameters<typeof createUser>;
// Type is [name: string, age: number, email: string]

function callCreateUser(...args: CreateUserParams) {
  return createUser(...args);
}

// ===== Awaited<T> - Get the type that Promise resolves to =====
async function fetchUser(): Promise<User> {
  return { id: 1, name: "Alice", email: "alice@example.com", age: 25, address: "123 Main St" };
}

type FetchedUser = Awaited<ReturnType<typeof fetchUser>>;  // User

// ===== COMBINING UTILITY TYPES =====

// Partial Update with specific fields required
type UserUpdate = Partial<User> & Required<Pick<User, "id">>;

function updateUserAdvanced(user: UserUpdate) {
  // Must have id, everything else optional
}

updateUserAdvanced({ id: 1, name: "Alice" });  // OK
// updateUserAdvanced({ name: "Alice" });  //  Error: id is required

// Readonly subset
type ReadonlyUserPreview = Readonly<Pick<User, "id" | "name">>;

// Omit and make partial
type PartialUserWithoutId = Partial<Omit<User, "id">>;

// ===== CUSTOM UTILITY TYPES =====

// Deep Partial
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

interface Organization {
  name: string;
  owner: {
    id: number;
    name: string;
    contact: {
      email: string;
      phone: string;
    };
  };
}

type PartialOrg = DeepPartial<Organization>;
// All nested properties are optional

// Mutable (opposite of Readonly)
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

type MutableUser = Mutable<ReadonlyUser>;
// All properties are now mutable

// Nullable
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

type NullableUser = Nullable<User>;
// All properties can be their type or null

// ===== REAL-WORLD EXAMPLES =====

// API Response handling
interface ApiUser {
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt: string;
}

// Public user (omit sensitive data)
type PublicUser = Omit<ApiUser, "password">;

// User creation (omit generated fields)
type CreateUserInput = Omit<ApiUser, "id" | "createdAt">;

// User update (optional fields except id)
type UpdateUserInput = Partial<Omit<ApiUser, "id">> & Pick<ApiUser, "id">;

// Form state
interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

// Component props
interface ButtonProps {
  variant: "primary" | "secondary";
  size: "small" | "medium" | "large";
  onClick: () => void;
  disabled?: boolean;
}

// Extract only style props
type ButtonStyleProps = Pick<ButtonProps, "variant" | "size">;

// All props readonly
type ReadonlyButtonProps = Readonly<ButtonProps>;
```

####  Follow-up Discussion Points:
- "**Utility types are type transformations** - they create new types from existing ones"
- "**Combine utility types** for powerful patterns like `Partial<Omit<T, 'id'>>`"
- "**Use ReturnType and Parameters** to derive types from functions"
- "**Create custom utilities** for project-specific type transformations"

####  Weak Answer:
- Only knowing Partial and Readonly
- Not understanding when to use each utility
- Can't combine multiple utilities
- Not knowing how to create custom utilities

#### Common Interviewer Follow-ups:
1. **"What's the difference between Pick and Omit?"**
   - "`Pick` selects specific properties you want: `Pick<User, 'id' | 'name'>`. `Omit` removes properties you don't want: `Omit<User, 'password'>`. Pick is inclusive, Omit is exclusive."

2. **"How would you make a deep readonly type?"**
   - "Use mapped types with recursion: `type DeepReadonly<T> = { readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P] }`. This recursively applies readonly to nested objects."

3. **"When would you use Record vs an interface?"**
   - "`Record` is for dynamic keys with same value type: `Record<string, number>` is a dictionary. Interfaces are for fixed structure with specific properties. Use Record when keys are unknown at compile-time."

---

### **Q7: What is type inference in TypeScript?**
**Difficulty**:  Junior | **Frequency**: 

####  Strong Answer:
"Type inference is TypeScript's ability to automatically determine types without explicit annotations. The compiler analyzes code and infers the most specific type possible."

####  What to Say (Exact Phrasing):
```typescript
// ===== BASIC INFERENCE =====

// Variable inference
let name = "Alice";  // TypeScript infers: string
let age = 25;        // TypeScript infers: number
let active = true;   // TypeScript infers: boolean

// name = 42;  //  Error: Type 'number' not assignable to type 'string'

// Array inference
let numbers = [1, 2, 3];  // number[]
let mixed = [1, "two", 3];  // (string | number)[]

// Object inference
let user = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
};
// Inferred type:
// {
//   id: number;
//   name: string;
//   email: string;
// }

// ===== FUNCTION RETURN TYPE INFERENCE =====

function add(a: number, b: number) {
  return a + b;  // Return type inferred as number
}

function getUser(id: number) {
  return {
    id: id,
    name: "Alice",
    active: true
  };
  // Return type inferred as:
  // {
  //   id: number;
  //   name: string;
  //   active: boolean;
  // }
}

// ===== BEST COMMON TYPE INFERENCE =====

// When array has multiple types, TypeScript finds the best common type
let arr = [1, 2, null];  // (number | null)[]

class Animal { name: string }
class Dog extends Animal { bark() {} }
class Cat extends Animal { meow() {} }

let animals = [new Dog(), new Cat()];
// TypeScript infers: (Dog | Cat)[]
// Not Animal[] because that loses type information

// ===== CONTEXTUAL TYPING =====

// TypeScript uses context to infer types
window.addEventListener("click", (event) => {
  // 'event' is inferred as MouseEvent
  console.log(event.clientX, event.clientY);
});

["Alice", "Bob", "Charlie"].forEach((name) => {
  // 'name' is inferred as string
  console.log(name.toUpperCase());
});

// ===== GENERIC INFERENCE =====

function identity<T>(arg: T): T {
  return arg;
}

// TypeScript infers T based on argument
let output1 = identity("hello");  // T is string
let output2 = identity(42);       // T is number
let output3 = identity(true);     // T is boolean

function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}

// TypeScript infers both T and U
const strings = map([1, 2, 3], n => n.toString());
// T is number, U is string, result is string[]

// ===== LITERAL TYPE INFERENCE =====

// const creates literal types
const direction = "north";  // Type: "north" (not string)
let mutableDirection = "north";  // Type: string

// as const for literal inference
let config = {
  apiUrl: "https://api.example.com",
  timeout: 5000
} as const;
// Type:
// {
//   readonly apiUrl: "https://api.example.com";
//   readonly timeout: 5000;
// }

// Without as const
let mutableConfig = {
  apiUrl: "https://api.example.com",
  timeout: 5000
};
// Type:
// {
//   apiUrl: string;
//   timeout: number;
// }

// ===== WHEN TO ADD EXPLICIT TYPES =====

//  Explicit types for function parameters
function processUser(user: User) {  // Explicit
  // TypeScript can't infer parameter types
}

//  Explicit types for public API boundaries
export function createUser(data: CreateUserInput): User {
  // Explicit for API contract
}

//  Explicit when inference is wrong
let values: number[] = [];  // Without annotation, would be never[]
values.push(1);
values.push(2);

//  Don't add redundant explicit types
let name: string = "Alice";  // Redundant
let name = "Alice";  // Better - inferred

function add(a: number, b: number): number {  // Redundant return type
  return a + b;
}
function add(a: number, b: number) {  // Better - inferred
  return a + b;
}

// ===== TYPE WIDENING =====

// TypeScript widens types in certain contexts
let x = null;  // Widened to: any (in non-strict mode)
let y = undefined;  // Widened to: any (in non-strict mode)

// With strictNullChecks
let x = null;  // Type: null
let y = undefined;  // Type: undefined

// Prevent widening with const
const status = "active";  // Type: "active"
let mutableStatus = "active";  // Type: string

// ===== CONTROL FLOW ANALYSIS =====

function example(x: string | number) {
  if (typeof x === "string") {
    // TypeScript narrows x to string
    x.toUpperCase();
  } else {
    // TypeScript narrows x to number
    x.toFixed(2);
  }
}

// Union inference with control flow
function process(value: string | null) {
  if (value === null) {
    return "default";
  }
  // TypeScript knows value is string here
  return value.toUpperCase();
}

// ===== RETURN TYPE INFERENCE WITH UNIONS =====

function getValue(condition: boolean) {
  if (condition) {
    return "string value";
  } else {
    return 42;
  }
}
// Return type inferred as: string | number

// ===== DISCRIMINATED UNION INFERENCE =====

type Success = { type: "success"; data: string };
type Error = { type: "error"; message: string };
type Result = Success | Error;

function handleResult(result: Result) {
  if (result.type === "success") {
    // TypeScript infers result is Success
    console.log(result.data);
  } else {
    // TypeScript infers result is Error
    console.log(result.message);
  }
}

// ===== TUPLE INFERENCE =====

// Without const assertion
let pair = ["Alice", 25];  // (string | number)[]

// With const assertion
let tuple = ["Alice", 25] as const;  // readonly ["Alice", 25]

// Function returning tuple
function getCoordinates() {
  return [10, 20] as const;
}
// Return type: readonly [10, 20]

// ===== INFERENCE WITH GENERICS AND CONSTRAINTS =====

function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

const person = { name: "Alice", age: 25 };
const name = getProperty(person, "name");
// TypeScript infers:
// - T is { name: string; age: number }
// - K is "name"
// - Return type is string

const age = getProperty(person, "age");
// Return type inferred as number

// ===== INFERENCE PITFALLS =====

// Empty array inference
let emptyArray = [];  // never[] - can't infer
emptyArray.push(1);  //  Error

// Fix with explicit type
let numbers: number[] = [];
numbers.push(1);  //  OK

// Object with computed properties
const key = "dynamicKey";
let obj = {
  [key]: "value"
};
// Type: { [x: string]: string }
// Lost the specific key information
```

####  Follow-up Discussion Points:
- "**Type inference reduces boilerplate** while maintaining type safety"
- "**Use `as const` for literal types** - prevents widening"
- "**Explicit types for boundaries** - function parameters, public APIs"
- "**Control flow analysis** allows TypeScript to narrow types automatically"

####  Weak Answer:
- "TypeScript guesses the type" (imprecise)
- Not understanding when to add explicit types
- Not knowing about type widening
- Unaware of literal type inference with `as const`

#### Common Interviewer Follow-ups:
1. **"When should you add explicit type annotations?"**
   - "For function parameters (can't be inferred), public API boundaries (documentation and contract), when inference is wrong (empty arrays), and when it improves readability for complex types."

2. **"What is type widening?"**
   - "TypeScript sometimes widens specific types to more general ones. For example, `let x = 'hello'` infers type `string`, not literal `'hello'`. Use `const` or `as const` to prevent widening and preserve literal types."

3. **"How does control flow affect type inference?"**
   - "TypeScript analyzes if statements, typeof checks, and other conditions to narrow types. After checking `typeof x === 'string'`, TypeScript knows `x` is definitely a string in that block."

---

### **Q8: Explain `any`, `unknown`, and `never` types**
**Difficulty**:  Mid-Level | **Frequency**: 

####  Strong Answer:
"`any` disables type checking, `unknown` is a type-safe version of `any` requiring type narrowing, and `never` represents values that never occur."

####  What to Say (Exact Phrasing):
```typescript
// ===== ANY TYPE =====

let anything: any = "hello";
anything = 42;
anything = true;
anything = { foo: "bar" };

// No type checking - dangerous!
anything.toUpperCase();    // No error (runtime crash if not string)
anything.foo.bar.baz;     // No error (runtime crash)
anything();                // No error (runtime crash if not function)

// any propagates - infects other code
function processAny(value: any) {
  let result = value.toUpperCase();  // result is also any
  return result;
}

// When to use any (rarely):
// - Migrating from JavaScript incrementally
// - Genuinely dynamic data (but prefer unknown)
// - Quick prototyping (but fix before production)
// - When types are impossible to express

//  Anti-patterns
let config: any = JSON.parse(jsonString);  // Use unknown instead
function legacyAPI(): any { }  // Return specific type or unknown

// ===== UNKNOWN TYPE =====

let userInput: unknown = getUserInput();

//  Can't use directly
// userInput.toUpperCase();  // Error: Object is of type 'unknown'
// userInput.foo;            // Error
// userInput();              // Error

//  Must narrow type first
if (typeof userInput === "string") {
  userInput.toUpperCase();  // OK - narrowed to string
}

if (typeof userInput === "number") {
  userInput.toFixed(2);  // OK - narrowed to number
}

// Type guard with unknown
function isString(value: unknown): value is string {
  return typeof value === "string";
}

if (isString(userInput)) {
  userInput.toUpperCase();  // OK
}

// Safe JSON parsing
function safeJsonParse(json: string): unknown {
  return JSON.parse(json);  // Don't assume the type
}

const data = safeJsonParse('{"name": "Alice"}');
// Must validate before using
if (isValidUser(data)) {
  console.log(data.name);  // Safe
}

// Unknown with assertion
function processUnknown(value: unknown) {
  // After validation, can assert
  if (typeof value === "object" && value !== null && "name" in value) {
    const obj = value as { name: string };
    console.log(obj.name);
  }
}

// ===== NEVER TYPE =====

// Function that never returns
function throwError(message: string): never {
  throw new Error(message);
  // No return statement, never reaches end
}

function infiniteLoop(): never {
  while (true) {
    // Never exits
  }
}

// Exhaustive type checking
type Shape = "circle" | "square" | "triangle";

function getArea(shape: Shape): number {
  switch (shape) {
    case "circle":
      return Math.PI * 10 * 10;
    case "square":
      return 10 * 10;
    case "triangle":
      return (10 * 10) / 2;
    default:
      const _exhaustive: never = shape;
      throw new Error(`Unhandled shape: ${_exhaustive}`);
  }
}

// If we add a new shape and forget to handle it:
// type Shape = "circle" | "square" | "triangle" | "pentagon";
// TypeScript errors at the never assignment

// never in unions
type Result = string | never;  // Simplifies to: string
// never is removed from unions

// Filtering types with never
type NonNullable<T> = T extends null | undefined ? never : T;
type Result = NonNullable<string | null>;  // string

// Never from unreachable code
function example(value: string) {
  if (typeof value === "string") {
    return value.length;
  }
  // This line is never reached
  // value is inferred as never here
  return value;  // Type: never
}

// ===== COMPARISON =====

// any vs unknown
function compareAnyUnknown() {
  let anyValue: any = "hello";
  let unknownValue: unknown = "hello";
  
  // any - anything goes (unsafe)
  anyValue.toUpperCase();     //  No error
  anyValue.nonExistent();     //  No error (runtime crash!)
  
  // unknown - must narrow (safe)
  // unknownValue.toUpperCase();  //  Error
  if (typeof unknownValue === "string") {
    unknownValue.toUpperCase();  //  OK
  }
}

// ===== PRACTICAL EXAMPLES =====

// API Response with unknown
async function fetchData(url: string): Promise<unknown> {
  const response = await fetch(url);
  return response.json();  // Don't assume the shape
}

async function getUser(id: number): Promise<User> {
  const data = await fetchData(`/api/users/${id}`);
  
  // Validate before using
  if (isValidUser(data)) {
    return data;
  }
  
  throw new Error("Invalid user data");
}

// Error handling with never
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}

type Action =
  | { type: "increment" }
  | { type: "decrement" };

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case "increment":
      return state + 1;
    case "decrement":
      return state - 1;
    default:
      return assertNever(action);  // Compile error if missing case
  }
}

// Safe type casting with unknown
function safeCast<T>(value: unknown, validator: (val: unknown) => val is T): T {
  if (validator(value)) {
    return value;
  }
  throw new Error("Invalid type");
}

function isNumber(val: unknown): val is number {
  return typeof val === "number";
}

const num = safeCast(userInput, isNumber);  // number

// Unknown in generics
function parseJSON<T>(json: string, validator: (val: unknown) => val is T): T {
  const parsed: unknown = JSON.parse(json);
  if (validator(parsed)) {
    return parsed;
  }
  throw new Error("Invalid JSON shape");
}

interface User {
  name: string;
  age: number;
}

function isUser(val: unknown): val is User {
  return (
    typeof val === "object" &&
    val !== null &&
    "name" in val &&
    "age" in val &&
    typeof (val as any).name === "string" &&
    typeof (val as any).age === "number"
  );
}

const user = parseJSON('{"name":"Alice","age":25}', isUser);

// ===== DECISION MATRIX =====

/*
Use ANY when:
-  Never (almost) - defeats TypeScript's purpose
-  Migrating JS code incrementally
-  Quick prototyping (fix before production)

Use UNKNOWN when:
-  Accepting external input (JSON.parse, API responses)
-  Don't know the type but want safety
-  Need to validate before using

Use NEVER when:
-  Functions that never return (throw, infinite loop)
-  Exhaustive type checking
-  Filtering types in conditional types
-  Representing impossible states
*/
```

####  Follow-up Discussion Points:
- "**Prefer unknown over any** - it's type-safe and forces validation"
- "**never is useful for exhaustive checking** - catches missing switch cases"
- "**any is contagious** - it disables type checking for everything it touches"
- "**unknown requires type narrowing** - using typeof, instanceof, or custom type guards"

####  Weak Answer:
- Using `any` everywhere
- Not knowing the difference between `any` and `unknown`
- Not understanding `never` type
- Can't explain when to use each

#### Common Interviewer Follow-ups:
1. **"Why is `unknown` better than `any`?"**
   - "`any` disables all type checking - you can do anything without errors. `unknown` maintains type safety - you must narrow the type before using it. unknown catches errors at compile-time, any allows runtime crashes."

2. **"When would you use the `never` type?"**
   - "Functions that throw errors or have infinite loops (never return), exhaustive type checking in switch statements, filtering types with conditional types, and representing impossible states in your type system."

3. **"How do you narrow `unknown` types?"**
   - "Use typeof checks, instanceof checks, custom type guard functions with `is` keyword, or validate with a schema library like Zod or Yup. Always validate external data before casting from unknown."

---

### **Q9: What are mapped types?**
**Difficulty**:  Senior | **Frequency**: 

####  Strong Answer:
"Mapped types transform existing types by iterating over properties and creating new properties. They use the `in keyof` syntax to map over keys."

####  What to Say (Exact Phrasing):
```typescript
// ===== BASIC MAPPED TYPE =====

type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

interface User {
  name: string;
  age: number;
}

type ReadonlyUser = Readonly<User>;
// Result:
// {
//   readonly name: string;
//   readonly age: number;
// }

// ===== OPTIONAL MAPPED TYPE =====

type Partial<T> = {
  [P in keyof T]?: T[P];
};

type PartialUser = Partial<User>;
// Result:
// {
//   name?: string;
//   age?: number;
// }

// ===== REQUIRED MAPPED TYPE =====

type Required<T> = {
  [P in keyof T]-?: T[P];  // -? removes optional modifier
};

interface Config {
  apiUrl?: string;
  timeout?: number;
}

type RequiredConfig = Required<Config>;
// Result:
// {
//   apiUrl: string;
//   timeout: number;
// }

// ===== MUTABLE (REMOVE READONLY) =====

type Mutable<T> = {
  -readonly [P in keyof T]: T[P];  // -readonly removes readonly modifier
};

type ReadonlyPoint = {
  readonly x: number;
  readonly y: number;
};

type MutablePoint = Mutable<ReadonlyPoint>;
// Result:
// {
//   x: number;
//   y: number;
// }

// ===== TYPE TRANSFORMATIONS =====

// Convert all properties to string
type Stringify<T> = {
  [P in keyof T]: string;
};

type UserStrings = Stringify<User>;
// Result:
// {
//   name: string;
//   age: string;  // Changed from number
// }

// Wrap all properties in arrays
type Arrayify<T> = {
  [P in keyof T]: T[P][];
};

type UserArrays = Arrayify<User>;
// Result:
// {
//   name: string[];
//   age: number[];
// }

// Wrap all properties in Promises
type Promisify<T> = {
  [P in keyof T]: Promise<T[P]>;
};

type UserPromises = Promisify<User>;
// Result:
// {
//   name: Promise<string>;
//   age: Promise<number>;
// }

// ===== CONDITIONAL MAPPED TYPES =====

// Make only string properties optional
type PartialStrings<T> = {
  [P in keyof T]: T[P] extends string ? T[P] | undefined : T[P];
};

type MixedPartial = PartialStrings<User>;
// Result:
// {
//   name: string | undefined;  // string becomes optional
//   age: number;               // number stays required
// }

// Nullable specific types
type Nullable<T> = {
  [P in keyof T]: T[P] extends object ? T[P] : T[P] | null;
};

// ===== KEY REMAPPING =====

// Add prefix to all keys (TypeScript 4.1+)
type Getters<T> = {
  [P in keyof T as `get${Capitalize<string & P>}`]: () => T[P];
};

type UserGetters = Getters<User>;
// Result:
// {
//   getName: () => string;
//   getAge: () => number;
// }

// Add suffix to keys
type Setters<T> = {
  [P in keyof T as `set${Capitalize<string & P>}`]: (value: T[P]) => void;
};

type UserSetters = Setters<User>;
// Result:
// {
//   setName: (value: string) => void;
//   setAge: (value: number) => void;
// }

// Filter out specific keys
type OmitByType<T, ValueType> = {
  [P in keyof T as T[P] extends ValueType ? never : P]: T[P];
};

interface Mixed {
  name: string;
  age: number;
  active: boolean;
  count: number;
}

type NoNumbers = OmitByType<Mixed, number>;
// Result:
// {
//   name: string;
//   active: boolean;
// }

// ===== DEEP MAPPED TYPES =====

// Deep Readonly
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P];
};

interface Organization {
  name: string;
  address: {
    street: string;
    city: string;
    country: {
      name: string;
      code: string;
    };
  };
}

type ReadonlyOrg = DeepReadonly<Organization>;
// All nested properties become readonly

// Deep Partial
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};

type PartialOrg = DeepPartial<Organization>;
// All nested properties become optional

// ===== PRACTICAL EXAMPLES =====

// Form state with errors
type FormState<T> = {
  [P in keyof T]: {
    value: T[P];
    error: string | null;
    touched: boolean;
  };
};

interface LoginForm {
  email: string;
  password: string;
}

type LoginFormState = FormState<LoginForm>;
// Result:
// {
//   email: { value: string; error: string | null; touched: boolean };
//   password: { value: string; error: string | null; touched: boolean };
// }

// API Response wrapper
type ApiResponse<T> = {
  [P in keyof T]: {
    data: T[P];
    loading: boolean;
    error: Error | null;
  };
};

interface AppData {
  users: User[];
  posts: Post[];
}

type AppDataState = ApiResponse<AppData>;
// Each property wrapped with loading state

// Validation rules
type ValidationRules<T> = {
  [P in keyof T]?: Array<(value: T[P]) => string | null>;
};

type UserValidation = ValidationRules<User>;
// Result:
// {
//   name?: Array<(value: string) => string | null>;
//   age?: Array<(value: number) => string | null>;
// }

// Event handlers
type EventHandlers<T> = {
  [P in keyof T as `on${Capitalize<string & P>}Change`]: (value: T[P]) => void;
};

type UserHandlers = EventHandlers<User>;
// Result:
// {
//   onNameChange: (value: string) => void;
//   onAgeChange: (value: number) => void;
// }

// ===== COMBINED MAPPED TYPES =====

// Readonly + Partial
type ReadonlyPartial<T> = {
  readonly [P in keyof T]?: T[P];
};

// Required + Mutable
type RequiredMutable<T> = {
  -readonly [P in keyof T]-?: T[P];
};

// Conditional + Key remapping
type GettersForStrings<T> = {
  [P in keyof T as T[P] extends string ? `get${Capitalize<string & P>}` : never]: () => T[P];
};

type UserStringGetters = GettersForStrings<User>;
// Only creates getter for 'name' (string property)

// ===== ADVANCED PATTERNS =====

// Discriminated union from object
type UnionFromObject<T> = {
  [K in keyof T]: { type: K; payload: T[K] };
}[keyof T];

interface Actions {
  increment: number;
  decrement: number;
  reset: void;
}

type Action = UnionFromObject<Actions>;
// Result:
// | { type: 'increment'; payload: number }
// | { type: 'decrement'; payload: number }
// | { type: 'reset'; payload: void }

// Extract function types
type MethodKeys<T> = {
  [P in keyof T]: T[P] extends Function ? P : never;
}[keyof T];

interface UserService {
  name: string;
  getUser: () => User;
  updateUser: (user: User) => void;
  age: number;
  deleteUser: (id: number) => void;
}

type UserServiceMethods = MethodKeys<UserService>;
// Result: 'getUser' | 'updateUser' | 'deleteUser'

// Pick only functions
type FunctionsOnly<T> = {
  [P in keyof T as T[P] extends Function ? P : never]: T[P];
};

type UserServiceFunctions = FunctionsOnly<UserService>;
// Result:
// {
//   getUser: () => User;
//   updateUser: (user: User) => void;
//   deleteUser: (id: number) => void;
// }
```

####  Follow-up Discussion Points:
- "**Mapped types are type-level loops** - iterate over keys to transform types"
- "**Modifiers (+/-)** add or remove readonly and optional modifiers"
- "**Key remapping with `as`** allows renaming or filtering keys"
- "**Most utility types** (Partial, Readonly, Pick, etc.) are implemented with mapped types"

####  Weak Answer:
- Not understanding the `in keyof` syntax
- Can't create custom mapped types
- Not knowing about modifiers (-?, -readonly)
- Unaware of key remapping with `as`

#### Common Interviewer Follow-ups:
1. **"How do you create a Deep Partial type?"**
   - "Use recursion: `type DeepPartial<T> = { [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P] }`. Check if property is an object, recursively apply DeepPartial if yes, otherwise make optional."

2. **"What are the modifiers in mapped types?"**
   - "`+?` or `?` adds optional modifier (makes optional). `-?` removes optional modifier (makes required). `+readonly` or `readonly` adds readonly. `-readonly` removes readonly. These transform existing type properties."

3. **"How does key remapping work?"**
   - "With TypeScript 4.1+, use `as` in mapped types: `[P in keyof T as NewKey]`. Can add prefixes: `as \`get${P}\``, filter keys: `as T[P] extends string ? P : never`, or transform keys."

---

### **Q10: Explain conditional types**
**Difficulty**:  Senior | **Frequency**: 

####  Strong Answer:
"Conditional types select one of two possible types based on a condition expressed as a type relationship test. They use the syntax: `T extends U ? X : Y`."

####  What to Say (Exact Phrasing):
```typescript
// ===== BASIC CONDITIONAL TYPE =====

type IsString<T> = T extends string ? true : false;

type A = IsString<string>;   // true
type B = IsString<number>;   // false
type C = IsString<"hello">;  // true

// ===== CONDITIONAL TYPE WITH TYPE PARAMETER =====

type NonNullable<T> = T extends null | undefined ? never : T;

type D = NonNullable<string | null>;  // string
type E = NonNullable<number | undefined>;  // number
type F = NonNullable<string | null | undefined>;  // string

// ===== INFER KEYWORD =====

// Extract return type
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser() {
  return { name: "Alice", age: 25 };
}

type User = ReturnType<typeof getUser>;
// Result: { name: string; age: number }

// Extract parameter types
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

function createUser(name: string, age: number, email: string) {
  return { name, age, email };
}

type CreateUserParams = Parameters<typeof createUser>;
// Result: [name: string, age: number, email: string]

// Extract array element type
type ElementType<T> = T extends (infer E)[] ? E : T;

type G = ElementType<string[]>;  // string
type H = ElementType<number[]>;  // number
type I = ElementType<string>;    // string (not an array)

// Extract Promise resolved type
type Awaited<T> = T extends Promise<infer U> ? U : T;

type J = Awaited<Promise<string>>;  // string
type K = Awaited<Promise<number>>;  // number
type L = Awaited<string>;  // string (not a Promise)

// ===== NESTED CONDITIONAL TYPES =====

// Deep Awaited (handles nested Promises)
type DeepAwaited<T> =
  T extends Promise<infer U>
    ? DeepAwaited<U>
    : T;

type M = DeepAwaited<Promise<Promise<Promise<string>>>>;  // string

// Flatten array type
type Flatten<T> =
  T extends Array<infer U>
    ? U extends Array<any>
      ? Flatten<U>
      : U
    : T;

type N = Flatten<number[]>;      // number
type O = Flatten<number[][]>;    // number
type P = Flatten<number[][][]>;  // number

// ===== DISTRIBUTIVE CONDITIONAL TYPES =====

// When T is a union, conditional types distribute
type ToArray<T> = T extends any ? T[] : never;

type Q = ToArray<string | number>;
// Result: string[] | number[] (distributes)
// Not: (string | number)[]

// Exclude type
type Exclude<T, U> = T extends U ? never : T;

type R = Exclude<"a" | "b" | "c", "a">;  // "b" | "c"
type S = Exclude<string | number | boolean, boolean>;  // string | number

// Extract type
type Extract<T, U> = T extends U ? T : never;

type T = Extract<"a" | "b" | "c", "a" | "f">;  // "a"
type U = Extract<string | number | boolean, number | boolean>;  // number | boolean

// ===== NON-DISTRIBUTIVE CONDITIONAL TYPES =====

// Wrap in tuple to prevent distribution
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;

type V = ToArrayNonDist<string | number>;
// Result: (string | number)[] (doesn't distribute)

// ===== FUNCTION OVERLOAD EXTRACTION =====

// Get last overload
type LastOverload<T> =
  T extends {
    (...args: infer A1): infer R1;
    (...args: infer A2): infer R2;
    (...args: infer A3): infer R3;
  }
    ? (...args: A3) => R3
    : T extends {
        (...args: infer A1): infer R1;
        (...args: infer A2): infer R2;
      }
    ? (...args: A2) => R2
    : T extends (...args: infer A) => infer R
    ? (...args: A) => R
    : never;

// ===== PRACTICAL EXAMPLES =====

// API Response type based on success
type ApiResult<T, Success extends boolean> =
  Success extends true
    ? { success: true; data: T }
    : { success: false; error: string };

type SuccessResult = ApiResult<User, true>;
// { success: true; data: User }

type ErrorResult = ApiResult<User, false>;
// { success: false; error: string }

// Props based on variant
type ButtonProps<V extends "text" | "contained"> = {
  variant: V;
  onClick: () => void;
} & (V extends "contained"
  ? { color: string; elevation: number }
  : {});

const textButton: ButtonProps<"text"> = {
  variant: "text",
  onClick: () => {}
  // No color or elevation needed
};

const containedButton: ButtonProps<"contained"> = {
  variant: "contained",
  onClick: () => {},
  color: "blue",
  elevation: 2
  // Requires color and elevation
};

// Conditional return type
function process<T extends string | number>(
  value: T
): T extends string ? string[] : number[] {
  if (typeof value === "string") {
    return value.split("") as any;
  }
  return [value] as any;
}

const strings = process("hello");  // string[]
const numbers = process(42);       // number[]

// ===== ADVANCED PATTERNS =====

// Pick by value type
type PickByType<T, ValueType> = {
  [P in keyof T as T[P] extends ValueType ? P : never]: T[P];
};

interface MixedTypes {
  name: string;
  age: number;
  email: string;
  active: boolean;
  count: number;
}

type StringFields = PickByType<MixedTypes, string>;
// Result: { name: string; email: string }

type NumberFields = PickByType<MixedTypes, number>;
// Result: { age: number; count: number }

// Omit by value type
type OmitByType<T, ValueType> = {
  [P in keyof T as T[P] extends ValueType ? never : P]: T[P];
};

type NoStrings = OmitByType<MixedTypes, string>;
// Result: { age: number; active: boolean; count: number }

// Get readonly keys
type ReadonlyKeys<T> = {
  [P in keyof T]-?: (<F>() => F extends { [Q in P]: T[P] } ? 1 : 2) extends
    (<F>() => F extends { -readonly [Q in P]: T[P] } ? 1 : 2)
      ? never
      : P;
}[keyof T];

interface ReadonlyInterface {
  readonly id: number;
  name: string;
  readonly email: string;
}

type ReadonlyKeyNames = ReadonlyKeys<ReadonlyInterface>;
// Result: 'id' | 'email'

// Get optional keys
type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

interface OptionalInterface {
  name: string;
  age?: number;
  email: string;
  phone?: string;
}

type OptionalKeyNames = OptionalKeys<OptionalInterface>;
// Result: 'age' | 'phone'

// Merge types (later properties override earlier)
type Merge<A, B> = {
  [K in keyof A | keyof B]: K extends keyof B
    ? B[K]
    : K extends keyof A
    ? A[K]
    : never;
};

type BaseConfig = {
  apiUrl: string;
  timeout: number;
  debug: boolean;
};

type ExtendedConfig = {
  timeout: string;  // Override number with string
  retries: number;
};

type MergedConfig = Merge<BaseConfig, ExtendedConfig>;
// Result:
// {
//   apiUrl: string;
//   timeout: string;  // Overridden
//   debug: boolean;
//   retries: number;
// }

// ===== REAL-WORLD USE CASES =====

// Form field based on type
type FormField<T> =
  T extends string
    ? { type: "text"; value: string }
    : T extends number
    ? { type: "number"; value: number; min?: number; max?: number }
    : T extends boolean
    ? { type: "checkbox"; checked: boolean }
    : { type: "unknown"; value: any };

type NameField = FormField<string>;
// { type: "text"; value: string }

type AgeField = FormField<number>;
// { type: "number"; value: number; min?: number; max?: number }

// Database query result based on select
type QueryResult<T, Select extends keyof T> = Pick<T, Select>;

interface FullUser {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

type UserPreview = QueryResult<FullUser, "id" | "name">;
// { id: number; name: string }

// Event emitter with typed events
type EventMap = {
  click: MouseEvent;
  scroll: Event;
  keypress: KeyboardEvent;
};

type EventHandler<K extends keyof EventMap> =
  (event: EventMap[K]) => void;

function addEventListener<K extends keyof EventMap>(
  event: K,
  handler: EventHandler<K>
) {
  // Implementation
}

addEventListener("click", (e) => {
  // e is MouseEvent
  console.log(e.clientX, e.clientY);
});

addEventListener("keypress", (e) => {
  // e is KeyboardEvent
  console.log(e.key);
});
```

####  Follow-up Discussion Points:
- "**Conditional types enable type-level logic** - choose types based on conditions"
- "**`infer` keyword** extracts types from within other types"
- "**Distributive conditionals** automatically distribute over unions"
- "**Combine with mapped types** for powerful type transformations"

####  Weak Answer:
- Can't explain the `extends` condition
- Not understanding `infer` keyword
- Unaware of distributive conditional types
- Can't create practical conditional types

#### Common Interviewer Follow-ups:
1. **"What does the `infer` keyword do?"**
   - "`infer` declares a type variable within a conditional type that captures a portion of the matched type. For example, `T extends Promise<infer U>` matches promises and captures the resolved type as `U`."

2. **"What are distributive conditional types?"**
   - "When a conditional type is given a union type, it distributes over each member. `T extends U ? X : Y` with `T = A | B` becomes `(A extends U ? X : Y) | (B extends U ? X : Y)`. Wrap in brackets `[T]` to prevent distribution."

3. **"How would you extract array element types?"**
   - "Use conditional type with infer: `type ElementType<T> = T extends (infer E)[] ? E : T`. If T is an array, infer captures the element type. For nested arrays, make it recursive."

---

##  PRACTICAL CODING QUESTIONS (Q16-20)
### Type Real-World Scenarios

---

### **Q16: Create a type-safe event emitter**
**Difficulty**:  Senior | **Frequency**: 

####  Complete Implementation:
```typescript
// Type-safe Event Emitter
type EventMap = Record<string, any>;

type EventHandler<T = any> = (event: T) => void;

class TypedEventEmitter<Events extends EventMap> {
  private listeners: {
    [K in keyof Events]?: Array<EventHandler<Events[K]>>;
  } = {};
  
  on<K extends keyof Events>(
    event: K,
    handler: EventHandler<Events[K]>
  ): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(handler);
  }
  
  off<K extends keyof Events>(
    event: K,
    handler: EventHandler<Events[K]>
  ): void {
    const handlers = this.listeners[event];
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }
  
  emit<K extends keyof Events>(
    event: K,
    data: Events[K]
  ): void {
    const handlers = this.listeners[event];
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }
  
  once<K extends keyof Events>(
    event: K,
    handler: EventHandler<Events[K]>
  ): void {
    const onceHandler: EventHandler<Events[K]> = (data) => {
      handler(data);
      this.off(event, onceHandler);
    };
    this.on(event, onceHandler);
  }
}

// Usage
interface AppEvents {
  userLogin: { userId: number; timestamp: Date };
  userLogout: { userId: number };
  dataUpdate: { field: string; value: any };
}

const emitter = new TypedEventEmitter<AppEvents>();

//  Type-safe - TypeScript knows the event data shape
emitter.on("userLogin", (data) => {
  console.log(data.userId, data.timestamp);  // Autocomplete works!
});

emitter.emit("userLogin", {
  userId: 123,
  timestamp: new Date()
});

//  TypeScript errors
// emitter.emit("userLogin", { userId: "123" });  // Error: string not assignable to number
// emitter.emit("unknownEvent", {});  // Error: not in AppEvents
```

####  Key Points:
- "Generic `<Events extends EventMap>` makes it reusable for any event schema"
- "Type parameter `<K extends keyof Events>` ensures only valid event names"
- "`EventHandler<Events[K]>` automatically types the handler parameter"
- "TypeScript provides full autocomplete and type checking"

---

*Good luck with your TypeScript interviews! *

*Remember: Understanding the type system deeply is more valuable than memorizing syntax.*

### **Q17: Implement a type-safe API client with generics**
**Difficulty**:  Senior | **Frequency**: 

####  Complete Implementation:
```typescript
// API Client with full type safety
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, string | number>;
  body?: any;
}

type ApiEndpoint = {
  method: HttpMethod;
  path: string;
  request?: any;
  response: any;
};

type ApiSchema = Record<string, ApiEndpoint>;

class TypedApiClient<Schema extends ApiSchema> {
  constructor(private baseUrl: string) {}
  
  async request<K extends keyof Schema>(
    endpoint: K,
    ...[config]: Schema[K]["request"] extends undefined
      ? [RequestConfig?]
      : [RequestConfig & { body: Schema[K]["request"] }]
  ): Promise<Schema[K]["response"]> {
    const { method, path } = this.getEndpointConfig(endpoint);
    
    const url = new URL(path, this.baseUrl);
    
    // Add query parameters
    if (config?.params) {
      Object.entries(config.params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }
    
    const response = await fetch(url.toString(), {
      method,
      headers: {
        "Content-Type": "application/json",
        ...config?.headers
      },
      body: config?.body ? JSON.stringify(config.body) : undefined
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  private getEndpointConfig(endpoint: keyof Schema): ApiEndpoint {
    // In real implementation, this would come from schema definition
    return {} as ApiEndpoint;
  }
}

// Define your API schema
interface User {
  id: number;
  name: string;
  email: string;
}

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

interface UpdateUserInput {
  name?: string;
  email?: string;
}

type MyApiSchema = {
  getUser: {
    method: "GET";
    path: "/users/:id";
    response: User;
  };
  listUsers: {
    method: "GET";
    path: "/users";
    response: User[];
  };
  createUser: {
    method: "POST";
    path: "/users";
    request: CreateUserInput;
    response: User;
  };
  updateUser: {
    method: "PUT";
    path: "/users/:id";
    request: UpdateUserInput;
    response: User;
  };
  deleteUser: {
    method: "DELETE";
    path: "/users/:id";
    response: { success: boolean };
  };
};

// Usage
const api = new TypedApiClient<MyApiSchema>("https://api.example.com");

//  GET request - no body required
const user = await api.request("getUser");
// user is typed as User

//  POST request - body is required and typed
const newUser = await api.request("createUser", {
  body: {
    name: "Alice",
    email: "alice@example.com",
    password: "secret123"
  }
});
// newUser is typed as User

//  TypeScript errors
// await api.request("createUser", {});  // Error: body is required
// await api.request("createUser", {
//   body: { name: "Alice" }  // Error: email and password required
// });

//  PUT request with optional body fields
const updated = await api.request("updateUser", {
  body: { name: "Alice Updated" }  // Only updating name
});

//  Query parameters
const users = await api.request("listUsers", {
  params: { page: 1, limit: 10 }
});
// users is typed as User[]
```

####  Key Points:
- "Schema defines all endpoints with request/response types in one place"
- "Conditional types make body required only when endpoint needs it"
- "Full IntelliSense for endpoint names, request bodies, and responses"
- "Type-safe at compile time, preventing API contract violations"

---

### **Q18: Create a deep readonly type with recursion**
**Difficulty**: �� Senior | **Frequency**: 

####  Complete Implementation:
```typescript
// Deep Readonly Type
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepReadonly<T[P]>
    : T[P];
};

// Test interface with nested objects
interface Organization {
  name: string;
  founded: number;
  headquarters: {
    country: string;
    city: string;
    address: {
      street: string;
      zip: string;
    };
  };
  departments: {
    name: string;
    employees: number;
  }[];
  metadata: {
    tags: string[];
    settings: {
      public: boolean;
      verified: boolean;
    };
  };
}

type ReadonlyOrg = DeepReadonly<Organization>;

const org: ReadonlyOrg = {
  name: "TechCorp",
  founded: 2020,
  headquarters: {
    country: "USA",
    city: "San Francisco",
    address: {
      street: "123 Market St",
      zip: "94103"
    }
  },
  departments: [
    { name: "Engineering", employees: 50 },
    { name: "Sales", employees: 20 }
  ],
  metadata: {
    tags: ["tech", "startup"],
    settings: {
      public: true,
      verified: true
    }
  }
};

//  All of these produce errors:
// org.name = "NewName";  // Error: readonly
// org.headquarters.city = "NYC";  // Error: nested readonly
// org.headquarters.address.zip = "10001";  // Error: deeply nested readonly
// org.departments[0].employees = 51;  // Error: array elements readonly
// org.metadata.settings.public = false;  // Error: nested in object readonly

// ===== IMPROVED VERSION WITH ARRAY SUPPORT =====

type DeepReadonlyImproved<T> =
  T extends (infer R)[]
    ? ReadonlyArray<DeepReadonlyImproved<R>>
    : T extends Function
    ? T
    : T extends object
    ? { readonly [P in keyof T]: DeepReadonlyImproved<T[P]> }
    : T;

// Usage with arrays
type ReadonlyOrgImproved = DeepReadonlyImproved<Organization>;

// ===== PRACTICAL USE CASE =====

// Immutable state
interface AppState {
  user: {
    id: number;
    profile: {
      name: string;
      settings: {
        theme: "light" | "dark";
        notifications: boolean;
      };
    };
  };
  data: Array<{ id: number; value: string }>;
}

type ImmutableState = DeepReadonly<AppState>;

function reducer(state: ImmutableState, action: any): AppState {
  // Can't mutate state directly
  // state.user.profile.name = "New";  // Error!
  
  // Must return new state
  return {
    ...state,
    user: {
      ...state.user,
      profile: {
        ...state.user.profile,
        name: "New Name"
      }
    }
  };
}

// ===== DEEP MUTABLE (OPPOSITE) =====

type DeepMutable<T> = {
  -readonly [P in keyof T]: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepMutable<T[P]>
    : T[P];
};

type MutableOrg = DeepMutable<ReadonlyOrg>;
// All properties become mutable again
```

####  Key Points:
- "Recursion applies readonly to all nested levels"
- "Function check prevents breaking function types"
- "Array handling requires special case with `ReadonlyArray`"
- "Useful for immutable state management (Redux, Zustand)"

---

### **Q19: Build a type-safe form builder**
**Difficulty**:  Senior | **Frequency**: 

####  Complete Implementation:
```typescript
// Type-safe Form Builder

// Validation function type
type Validator<T> = (value: T) => string | null;

// Field configuration
type FieldConfig<T> = {
  defaultValue: T;
  validators?: Array<Validator<T>>;
  required?: boolean;
};

// Form schema - maps field names to their types
type FormSchema = Record<string, any>;

// Form configuration
type FormConfig<T extends FormSchema> = {
  [K in keyof T]: FieldConfig<T[K]>;
};

// Form field state
type FieldState<T> = {
  value: T;
  error: string | null;
  touched: boolean;
  dirty: boolean;
};

// Form state
type FormState<T extends FormSchema> = {
  [K in keyof T]: FieldState<T[K]>;
};

// Form values (just the values, not the full state)
type FormValues<T extends FormSchema> = {
  [K in keyof T]: T[K];
};

class TypeSafeForm<Schema extends FormSchema> {
  private state: FormState<Schema>;
  private config: FormConfig<Schema>;
  
  constructor(config: FormConfig<Schema>) {
    this.config = config;
    
    // Initialize state with default values
    this.state = Object.keys(config).reduce((acc, key) => {
      const fieldKey = key as keyof Schema;
      acc[fieldKey] = {
        value: config[fieldKey].defaultValue,
        error: null,
        touched: false,
        dirty: false
      };
      return acc;
    }, {} as FormState<Schema>);
  }
  
  // Get field value
  getValue<K extends keyof Schema>(field: K): Schema[K] {
    return this.state[field].value;
  }
  
  // Set field value
  setValue<K extends keyof Schema>(field: K, value: Schema[K]): void {
    this.state[field] = {
      ...this.state[field],
      value,
      dirty: true
    };
    
    // Validate on change
    this.validateField(field);
  }
  
  // Mark field as touched
  touch<K extends keyof Schema>(field: K): void {
    this.state[field].touched = true;
    this.validateField(field);
  }
  
  // Validate single field
  private validateField<K extends keyof Schema>(field: K): void {
    const fieldConfig = this.config[field];
    const value = this.state[field].value;
    
    // Check required
    if (fieldConfig.required && !value) {
      this.state[field].error = "This field is required";
      return;
    }
    
    // Run validators
    if (fieldConfig.validators) {
      for (const validator of fieldConfig.validators) {
        const error = validator(value);
        if (error) {
          this.state[field].error = error;
          return;
        }
      }
    }
    
    this.state[field].error = null;
  }
  
  // Validate all fields
  validate(): boolean {
    let isValid = true;
    
    for (const key in this.config) {
      const fieldKey = key as keyof Schema;
      this.validateField(fieldKey);
      if (this.state[fieldKey].error) {
        isValid = false;
      }
    }
    
    return isValid;
  }
  
  // Get field state
  getFieldState<K extends keyof Schema>(field: K): FieldState<Schema[K]> {
    return this.state[field];
  }
  
  // Get all values
  getValues(): FormValues<Schema> {
    return Object.keys(this.state).reduce((acc, key) => {
      const fieldKey = key as keyof Schema;
      acc[fieldKey] = this.state[fieldKey].value;
      return acc;
    }, {} as FormValues<Schema>);
  }
  
  // Reset form
  reset(): void {
    for (const key in this.config) {
      const fieldKey = key as keyof Schema;
      this.state[fieldKey] = {
        value: this.config[fieldKey].defaultValue,
        error: null,
        touched: false,
        dirty: false
      };
    }
  }
  
  // Check if form is valid
  isValid(): boolean {
    return Object.values(this.state).every(field => field.error === null);
  }
  
  // Check if form is dirty (any changes made)
  isDirty(): boolean {
    return Object.values(this.state).some(field => field.dirty);
  }
}

// ===== USAGE EXAMPLE =====

// Define form schema
interface UserForm {
  username: string;
  email: string;
  age: number;
  password: string;
  confirmPassword: string;
}

// Validators
const requiredValidator = <T>(value: T): string | null => {
  return value ? null : "This field is required";
};

const emailValidator = (value: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value) ? null : "Invalid email address";
};

const minLengthValidator = (min: number) => (value: string): string | null => {
  return value.length >= min ? null : `Must be at least ${min} characters`;
};

const minValueValidator = (min: number) => (value: number): string | null => {
  return value >= min ? null : `Must be at least ${min}`;
};

const maxValueValidator = (max: number) => (value: number): string | null => {
  return value <= max ? null : `Must be at most ${max}`;
};

// Create form
const form = new TypeSafeForm<UserForm>({
  username: {
    defaultValue: "",
    required: true,
    validators: [minLengthValidator(3)]
  },
  email: {
    defaultValue: "",
    required: true,
    validators: [emailValidator]
  },
  age: {
    defaultValue: 0,
    required: true,
    validators: [minValueValidator(18), maxValueValidator(120)]
  },
  password: {
    defaultValue: "",
    required: true,
    validators: [minLengthValidator(8)]
  },
  confirmPassword: {
    defaultValue: "",
    required: true
  }
});

//  Type-safe field access
form.setValue("username", "alice");  // OK
form.setValue("email", "alice@example.com");  // OK
form.setValue("age", 25);  // OK

//  TypeScript errors
// form.setValue("username", 123);  // Error: number not assignable to string
// form.setValue("age", "25");  // Error: string not assignable to number
// form.setValue("unknownField", "value");  // Error: field doesn't exist

// Get values with full type safety
const values = form.getValues();
console.log(values.username);  // string
console.log(values.age);  // number

// Validate
if (form.validate()) {
  console.log("Form is valid!", form.getValues());
} else {
  console.log("Form has errors");
  console.log(form.getFieldState("email").error);
}

// Check individual field
const usernameState = form.getFieldState("username");
if (usernameState.touched && usernameState.error) {
  console.log("Username error:", usernameState.error);
}

// ===== REACT INTEGRATION EXAMPLE =====
/*
function UserFormComponent() {
  const form = useRef(new TypeSafeForm<UserForm>({...config}));
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  
  const handleChange = (field: keyof UserForm, value: any) => {
    form.current.setValue(field, value);
    forceUpdate();
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.current.validate()) {
      const values = form.current.getValues();
      console.log("Submitting:", values);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={form.current.getValue("username")}
        onChange={(e) => handleChange("username", e.target.value)}
        onBlur={() => form.current.touch("username")}
      />
      {form.current.getFieldState("username").error && (
        <span>{form.current.getFieldState("username").error}</span>
      )}
      
      <button type="submit" disabled={!form.current.isValid()}>
        Submit
      </button>
    </form>
  );
}
*/
```

####  Key Points:
- "Generic `<Schema extends FormSchema>` makes it work with any form structure"
- "Type-safe field access - can't access non-existent fields"
- "Type-safe value setting - can't set wrong type"
- "Full IntelliSense support for field names and values"
- "Extensible validation system with typed validators"

---

### **Q20: Implement a type-safe state machine**
**Difficulty**:  Senior | **Frequency**: 

####  Complete Implementation:
```typescript
// Type-safe State Machine

// Define state and event types
type State = string;
type Event = string;

// Transition definition
type Transition<S extends State, E extends Event> = {
  from: S;
  event: E;
  to: S;
};

// State machine configuration
type StateMachineConfig<
  S extends State,
  E extends Event,
  T extends Transition<S, E>
> = {
  initial: S;
  transitions: T[];
};

// Extract valid events for a given state
type ValidEvents<
  S extends State,
  T extends Transition<any, any>
> = T extends Transition<S, infer E> ? E : never;

// Extract next state for a given state and event
type NextState<
  S extends State,
  E extends Event,
  T extends Transition<any, any>
> = T extends Transition<S, E> ? T["to"] : never;

class TypedStateMachine<
  S extends State,
  E extends Event,
  T extends Transition<S, E>
> {
  private currentState: S;
  private transitions: Map<string, S>;
  private listeners: Array<(state: S) => void> = [];
  
  constructor(config: StateMachineConfig<S, E, T>) {
    this.currentState = config.initial;
    this.transitions = new Map();
    
    // Build transition map
    config.transitions.forEach(transition => {
      const key = `${transition.from}:${transition.event}`;
      this.transitions.set(key, transition.to);
    });
  }
  
  // Get current state
  getState(): S {
    return this.currentState;
  }
  
  // Send event (transition)
  send(event: ValidEvents<S, T>): boolean {
    const key = `${this.currentState}:${event}`;
    const nextState = this.transitions.get(key);
    
    if (nextState) {
      this.currentState = nextState as S;
      this.notify();
      return true;
    }
    
    return false;
  }
  
  // Check if transition is valid
  can(event: ValidEvents<S, T>): boolean {
    const key = `${this.currentState}:${event}`;
    return this.transitions.has(key);
  }
  
  // Subscribe to state changes
  subscribe(listener: (state: S) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
  
  private notify(): void {
    this.listeners.forEach(listener => listener(this.currentState));
  }
}

// ===== EXAMPLE 1: Traffic Light =====

type TrafficLightState = "red" | "yellow" | "green";
type TrafficLightEvent = "TIMER" | "MANUAL_SWITCH";

type TrafficLightTransition =
  | Transition<"red", "TIMER">
  | Transition<"red", "MANUAL_SWITCH">
  | Transition<"yellow", "TIMER">
  | Transition<"green", "TIMER">
  | Transition<"green", "MANUAL_SWITCH">;

const trafficLight = new TypedStateMachine<
  TrafficLightState,
  TrafficLightEvent,
  TrafficLightTransition
>({
  initial: "red",
  transitions: [
    { from: "red", event: "TIMER", to: "green" },
    { from: "red", event: "MANUAL_SWITCH", to: "yellow" },
    { from: "green", event: "TIMER", to: "yellow" },
    { from: "green", event: "MANUAL_SWITCH", to: "red" },
    { from: "yellow", event: "TIMER", to: "red" }
  ]
});

//  Valid transitions
console.log(trafficLight.getState());  // "red"
trafficLight.send("TIMER");  // red -> green
console.log(trafficLight.getState());  // "green"

//  TypeScript prevents invalid events
// trafficLight.send("INVALID");  // Error: not a valid event

// Check before transitioning
if (trafficLight.can("TIMER")) {
  trafficLight.send("TIMER");  // green -> yellow
}

// ===== EXAMPLE 2: Order Status =====

type OrderState = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
type OrderEvent = "PROCESS" | "SHIP" | "DELIVER" | "CANCEL";

type OrderTransition =
  | Transition<"pending", "PROCESS">
  | Transition<"pending", "CANCEL">
  | Transition<"processing", "SHIP">
  | Transition<"processing", "CANCEL">
  | Transition<"shipped", "DELIVER">;

const orderMachine = new TypedStateMachine<
  OrderState,
  OrderEvent,
  OrderTransition
>({
  initial: "pending",
  transitions: [
    { from: "pending", event: "PROCESS", to: "processing" },
    { from: "pending", event: "CANCEL", to: "cancelled" },
    { from: "processing", event: "SHIP", to: "shipped" },
    { from: "processing", event: "CANCEL", to: "cancelled" },
    { from: "shipped", event: "DELIVER", to: "delivered" }
  ]
});

// Subscribe to state changes
const unsubscribe = orderMachine.subscribe((state) => {
  console.log("Order status changed to:", state);
});

// Order lifecycle
orderMachine.send("PROCESS");  // pending -> processing
orderMachine.send("SHIP");     // processing -> shipped
orderMachine.send("DELIVER");  // shipped -> delivered

unsubscribe();  // Stop listening

// ===== EXAMPLE 3: User Authentication =====

type AuthState = "loggedOut" | "loggingIn" | "loggedIn" | "error";
type AuthEvent = "LOGIN" | "SUCCESS" | "FAILURE" | "LOGOUT";

type AuthTransition =
  | Transition<"loggedOut", "LOGIN">
  | Transition<"loggingIn", "SUCCESS">
  | Transition<"loggingIn", "FAILURE">
  | Transition<"loggedIn", "LOGOUT">
  | Transition<"error", "LOGIN">;

const authMachine = new TypedStateMachine<
  AuthState,
  AuthEvent,
  AuthTransition
>({
  initial: "loggedOut",
  transitions: [
    { from: "loggedOut", event: "LOGIN", to: "loggingIn" },
    { from: "loggingIn", event: "SUCCESS", to: "loggedIn" },
    { from: "loggingIn", event: "FAILURE", to: "error" },
    { from: "loggedIn", event: "LOGOUT", to: "loggedOut" },
    { from: "error", event: "LOGIN", to: "loggingIn" }
  ]
});

async function login(username: string, password: string) {
  authMachine.send("LOGIN");
  
  try {
    // Simulate API call
    await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ username, password })
    });
    
    authMachine.send("SUCCESS");
  } catch (error) {
    authMachine.send("FAILURE");
  }
}

// ===== ENHANCED VERSION WITH GUARDS AND ACTIONS =====

type GuardFn<S extends State, E extends Event> = (
  from: S,
  event: E
) => boolean;

type ActionFn<S extends State, E extends Event> = (
  from: S,
  to: S,
  event: E
) => void;

type EnhancedTransition<S extends State, E extends Event> = {
  from: S;
  event: E;
  to: S;
  guard?: GuardFn<S, E>;
  action?: ActionFn<S, E>;
};

class EnhancedStateMachine<
  S extends State,
  E extends Event,
  T extends EnhancedTransition<S, E>
> {
  private currentState: S;
  private transitions: T[];
  
  constructor(config: { initial: S; transitions: T[] }) {
    this.currentState = config.initial;
    this.transitions = config.transitions;
  }
  
  send(event: E): boolean {
    const transition = this.transitions.find(
      t => t.from === this.currentState && t.event === event
    );
    
    if (!transition) return false;
    
    // Check guard
    if (transition.guard && !transition.guard(this.currentState as S, event)) {
      return false;
    }
    
    const previousState = this.currentState;
    this.currentState = transition.to as S;
    
    // Execute action
    if (transition.action) {
      transition.action(previousState as S, this.currentState, event);
    }
    
    return true;
  }
  
  getState(): S {
    return this.currentState;
  }
}

// Usage with guards and actions
const enhancedAuth = new EnhancedStateMachine({
  initial: "loggedOut" as AuthState,
  transitions: [
    {
      from: "loggedOut",
      event: "LOGIN",
      to: "loggingIn",
      action: (from, to, event) => {
        console.log("Starting login process...");
      }
    },
    {
      from: "loggingIn",
      event: "SUCCESS",
      to: "loggedIn",
      guard: (from, event) => {
        // Only allow if token exists
        return !!localStorage.getItem("token");
      },
      action: (from, to, event) => {
        console.log("Login successful!");
      }
    },
    {
      from: "loggedIn",
      event: "LOGOUT",
      to: "loggedOut",
      action: (from, to, event) => {
        localStorage.removeItem("token");
        console.log("Logged out");
      }
    }
  ]
});
```

####  Key Points:
- "Type system enforces valid state transitions at compile-time"
- "Can't send invalid events for current state"
- "Generic types make it reusable for any state machine"
- "Guards and actions add business logic to transitions"
- "Useful for complex UI flows, authentication, order processing"

---

##  REAL-WORLD SCENARIOS (Q21-25)
### Production-Level TypeScript Applications

---

### **Q21: How do you handle API responses with discriminated unions?**
**Difficulty**:  Mid-Level | **Frequency**: 

####  Strong Answer:
"Use discriminated unions to model different response states (success, error, loading) with a common discriminant property. This ensures exhaustive handling and type safety."

####  Complete Implementation:
```typescript
// ===== API RESPONSE TYPES =====

// Discriminated union for API responses
type ApiResponse<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: { message: string; code: string } };

// Usage example
interface User {
  id: number;
  name: string;
  email: string;
}

async function fetchUser(id: number): Promise<ApiResponse<User>> {
  try {
    const response = await fetch(`/api/users/${id}`);
    
    if (!response.ok) {
      return {
        status: "error",
        error: {
          message: "Failed to fetch user",
          code: "FETCH_ERROR"
        }
      };
    }
    
    const data = await response.json();
    return { status: "success", data };
  } catch (error) {
    return {
      status: "error",
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
        code: "NETWORK_ERROR"
      }
    };
  }
}

// Type-safe response handling
async function displayUser(id: number) {
  const response = await fetchUser(id);
  
  // TypeScript narrows the type based on status
  switch (response.status) {
    case "loading":
      console.log("Loading...");
      break;
    
    case "success":
      // TypeScript knows response.data exists
      console.log(`User: ${response.data.name} (${response.data.email})`);
      break;
    
    case "error":
      // TypeScript knows response.error exists
      console.error(`Error: ${response.error.message}`);
      break;
    
    default:
      // Exhaustiveness check
      const _exhaustive: never = response;
      return _exhaustive;
  }
}

// ===== ADVANCED PATTERN: RESULT TYPE =====

type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

// Helper functions
function Ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

function Err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

// Type-safe error handling
async function divide(a: number, b: number): Promise<Result<number, string>> {
  if (b === 0) {
    return Err("Division by zero");
  }
  return Ok(a / b);
}

// Usage
const result = await divide(10, 2);
if (result.ok) {
  console.log("Result:", result.value);  // TypeScript knows value exists
} else {
  console.error("Error:", result.error);  // TypeScript knows error exists
}

// ===== REACT HOOK EXAMPLE =====

function useApi<T>(url: string): ApiResponse<T> {
  const [response, setResponse] = useState<ApiResponse<T>>({ status: "loading" });
  
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => setResponse({ status: "success", data }))
      .catch(error => setResponse({
        status: "error",
        error: { message: error.message, code: "FETCH_ERROR" }
      }));
  }, [url]);
  
  return response;
}

// Component usage
function UserProfile({ userId }: { userId: number }) {
  const response = useApi<User>(`/api/users/${userId}`);
  
  switch (response.status) {
    case "loading":
      return <div>Loading...</div>;
    
    case "success":
      return (
        <div>
          <h1>{response.data.name}</h1>
          <p>{response.data.email}</p>
        </div>
      );
    
    case "error":
      return <div>Error: {response.error.message}</div>;
  }
}
```

####  Key Points:
- "**Discriminant property** (`status`, `ok`, `type`) enables type narrowing"
- "**Exhaustive checking** catches unhandled cases at compile-time"
- "**No need for type assertions** - TypeScript knows the shape in each branch"
- "**Prevents accessing wrong properties** - can't access `data` in error case"

---

*[Continuing to Q22-Q25 and final sections...]*

### **Q22: How do you type higher-order functions and function composition?**
**Difficulty**: �� Senior | **Frequency**: 

####  Complete Implementation:
```typescript
// ===== HIGHER-ORDER FUNCTIONS =====

// Function that takes a function and returns a function
function withLogging<T extends any[], R>(
  fn: (...args: T) => R
): (...args: T) => R {
  return (...args: T) => {
    console.log("Calling with args:", args);
    const result = fn(...args);
    console.log("Result:", result);
    return result;
  };
}

// Usage
const add = (a: number, b: number) => a + b;
const loggedAdd = withLogging(add);
loggedAdd(2, 3);  // Logs and returns 5

// Retry function
function withRetry<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  maxRetries: number = 3
): (...args: T) => Promise<R> {
  return async (...args: T) => {
    let lastError: Error | null = null;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error as Error;
        console.log(`Attempt ${i + 1} failed, retrying...`);
      }
    }
    
    throw lastError;
  };
}

// Memoization
function memoize<T extends any[], R>(
  fn: (...args: T) => R
): (...args: T) => R {
  const cache = new Map<string, R>();
  
  return (...args: T) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// ===== FUNCTION COMPOSITION =====

// Compose two functions
function compose<A, B, C>(
  f: (b: B) => C,
  g: (a: A) => B
): (a: A) => C {
  return (a: A) => f(g(a));
}

// Usage
const double = (x: number) => x * 2;
const increment = (x: number) => x + 1;
const doubleThenIncrement = compose(increment, double);
console.log(doubleThenIncrement(5));  // 11

// Compose multiple functions (right to left)
type Fn<T, R> = (arg: T) => R;

function pipe<A, B>(ab: Fn<A, B>): Fn<A, B>;
function pipe<A, B, C>(ab: Fn<A, B>, bc: Fn<B, C>): Fn<A, C>;
function pipe<A, B, C, D>(
  ab: Fn<A, B>,
  bc: Fn<B, C>,
  cd: Fn<C, D>
): Fn<A, D>;
function pipe<A, B, C, D, E>(
  ab: Fn<A, B>,
  bc: Fn<B, C>,
  cd: Fn<C, D>,
  de: Fn<D, E>
): Fn<A, E>;

function pipe(...fns: Array<Fn<any, any>>): Fn<any, any> {
  return (input: any) => fns.reduce((acc, fn) => fn(acc), input);
}

// Usage
const transform = pipe(
  (x: number) => x * 2,    // double
  (x: number) => x + 1,    // increment
  (x: number) => x.toString(),  // to string
  (x: string) => `Result: ${x}`  // format
);

console.log(transform(5));  // "Result: 11"

// ===== PRACTICAL EXAMPLES =====

// Debounce
function debounce<T extends any[]>(
  fn: (...args: T) => void,
  delay: number
): (...args: T) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return (...args: T) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

// Throttle
function throttle<T extends any[]>(
  fn: (...args: T) => void,
  limit: number
): (...args: T) => void {
  let inThrottle = false;
  
  return (...args: T) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Curry
function curry<A, B, R>(fn: (a: A, b: B) => R): (a: A) => (b: B) => R;
function curry<A, B, C, R>(
  fn: (a: A, b: B, c: C) => R
): (a: A) => (b: B) => (c: C) => R;

function curry(fn: (...args: any[]) => any): any {
  return function curried(...args: any[]): any {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return (...nextArgs: any[]) => curried(...args, ...nextArgs);
  };
}

// Usage
const add3 = (a: number, b: number, c: number) => a + b + c;
const curriedAdd = curry(add3);
console.log(curriedAdd(1)(2)(3));  // 6
console.log(curriedAdd(1, 2)(3));  // 6
```

####  Key Points:
- "**Generic parameters preserve types** through function transformations"
- "**Rest parameters `...T`** capture argument tuples"
- "**Function overloads** enable type-safe composition of multiple functions"
- "**Curry pattern** maintains type safety through partial application"

---

### **Q23: Type a Redux-like store with middleware support**
**Difficulty**:  Senior | **Frequency**: 

####  Complete Implementation:
```typescript
// Redux-like type-safe store

type Action = { type: string; [key: string]: any };
type Reducer<S, A extends Action> = (state: S, action: A) => S;
type Middleware<S, A extends Action> = (
  store: Store<S, A>
) => (next: Dispatch<A>) => Dispatch<A>;
type Dispatch<A extends Action> = (action: A) => void;
type Listener = () => void;

interface Store<S, A extends Action> {
  getState(): S;
  dispatch: Dispatch<A>;
  subscribe(listener: Listener): () => void;
}

function createStore<S, A extends Action>(
  reducer: Reducer<S, A>,
  initialState: S,
  middlewares: Middleware<S, A>[] = []
): Store<S, A> {
  let state = initialState;
  let listeners: Listener[] = [];
  
  const getState = (): S => state;
  
  const subscribe = (listener: Listener): (() => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  };
  
  const baseDispatch: Dispatch<A> = (action: A) => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  };
  
  // Apply middlewares
  let dispatch = baseDispatch;
  const store: Store<S, A> = { getState, dispatch, subscribe };
  
  middlewares.forEach(middleware => {
    const next = dispatch;
    dispatch = middleware(store)(next);
  });
  
  store.dispatch = dispatch;
  
  return store;
}

// ===== USAGE EXAMPLE =====

// State
interface AppState {
  count: number;
  user: { name: string; id: number } | null;
}

// Actions
type AppAction =
  | { type: "INCREMENT" }
  | { type: "DECREMENT" }
  | { type: "SET_USER"; payload: { name: string; id: number } }
  | { type: "CLEAR_USER" };

// Reducer
const reducer: Reducer<AppState, AppAction> = (state, action) => {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + 1 };
    
    case "DECREMENT":
      return { ...state, count: state.count - 1 };
    
    case "SET_USER":
      return { ...state, user: action.payload };
    
    case "CLEAR_USER":
      return { ...state, user: null };
    
    default:
      const _exhaustive: never = action;
      return state;
  }
};

// Middleware: Logger
const loggerMiddleware: Middleware<AppState, AppAction> = (store) => (next) => (action) => {
  console.log("Dispatching:", action);
  console.log("Previous state:", store.getState());
  next(action);
  console.log("Next state:", store.getState());
};

// Middleware: Async actions
const thunkMiddleware: Middleware<AppState, AppAction> = (store) => (next) => (action) => {
  if (typeof action === "function") {
    return (action as any)(store.dispatch, store.getState);
  }
  return next(action);
};

// Create store
const store = createStore<AppState, AppAction>(
  reducer,
  { count: 0, user: null },
  [loggerMiddleware, thunkMiddleware]
);

// Subscribe
store.subscribe(() => {
  console.log("State changed:", store.getState());
});

// Dispatch
store.dispatch({ type: "INCREMENT" });
store.dispatch({ type: "SET_USER", payload: { name: "Alice", id: 1 } });
```

---

##  ADVANCED & TRICKY QUESTIONS (Q26-30)

### **Q26: Explain template literal types**
**Difficulty**:  Senior | **Frequency**: 

```typescript
// Template literal types (TypeScript 4.1+)

// Basic template literals
type Greeting = `Hello, ${string}`;
const greet1: Greeting = "Hello, Alice";  // OK
const greet2: Greeting = "Hi, Bob";  // Error

// Combine literal types
type HTTPMethod = "GET" | "POST";
type Endpoint = "/users" | "/posts";
type APIRoute = `${HTTPMethod} ${Endpoint}`;
// Result: "GET /users" | "GET /posts" | "POST /users" | "POST /posts"

// CSS properties
type CSSProperty = "margin" | "padding";
type CSSDirection = "top" | "right" | "bottom" | "left";
type CSSProp = `${CSSProperty}-${CSSDirection}`;
// Result: "margin-top" | "margin-right" | ... (8 combinations)

// Event handlers
type EventName = "click" | "focus" | "blur";
type EventHandler = `on${Capitalize<EventName>}`;
// Result: "onClick" | "onFocus" | "onBlur"

// Practical: Type-safe CSS-in-JS
type CSSValue = string | number;
type CSS = {
  [K in `${CSSProperty}-${CSSDirection}`]?: CSSValue;
};

const styles: CSS = {
  "margin-top": 10,
  "padding-left": "20px"
  // Full autocomplete for all CSS properties!
};
```

---

##  BEHAVIORAL QUESTIONS (Q31-35)

### **Q31: Tell me about a time you caught a bug using TypeScript**

**STAR Format Answer:**

**Situation**: "Our React app had a critical bug where user permissions weren't properly checked before API calls, allowing unauthorized actions."

**Task**: "I needed to refactor the permission system to be type-safe and prevent this class of bugs."

**Action**: "I created a discriminated union for user roles (`'admin' | 'user' | 'guest'`), typed all API endpoints with required permission levels, and used conditional types to enforce permission checks at compile-time. I created a `withPermission` HOC that TypeScript would error on if used with incompatible role types."

**Result**: "TypeScript caught 12 similar permission bugs during compilation. The system became impossible to misuse - developers couldn't call restricted APIs without proper type checks. QA reported 40% fewer permission-related bugs in the next sprint."

---

##  QUICK FIRE ROUND (Q36-45)

**Q36**: What's the difference between `interface` and `type`?
**A**: "Interfaces can be extended and merged, types are more flexible (unions, intersections). Use interface for objects, type for everything else."

**Q37**: What is `keyof`?
**A**: "Creates a union of all property keys of a type. `keyof User` = `'id' | 'name' | 'email'`"

**Q38**: What is `typeof`?
**A**: "Gets the type of a value. `typeof myObject` extracts its type for reuse."

**Q39**: What is `infer`?
**A**: "Extracts types within conditional types. `T extends Promise<infer U>` captures the Promise's resolved type."

**Q40**: What are index signatures?
**A**: "`{ [key: string]: number }` allows any string key with number value. Dynamic object keys."

**Q41**: What is `Pick` utility?
**A**: "`Pick<T, K>` selects specific properties from T. Creates subset type."

**Q42**: What is `Omit` utility?
**A**: "`Omit<T, K>` removes specific properties from T. Opposite of Pick."

**Q43**: What is `Partial` utility?
**A**: "`Partial<T>` makes all properties optional. Useful for update functions."

**Q44**: What is type narrowing?
**A**: "TypeScript refining types based on checks. After `typeof x === 'string'`, x is narrowed to string."

**Q45**: What is `never` type?
**A**: "Represents values that never occur. Used in exhaustive checks and functions that never return."

---

##  SUCCESS TIPS & RESOURCES

###  Most Commonly Asked in Interviews
1.  **Generics** - Every TypeScript interview
2.  **Type vs Interface** - Always asked
3.  **Utility Types** - Partial, Pick, Omit, Record
4.  **Type Guards** - typeof, instanceof, custom
5.  **Conditional Types** - extends keyword
6.  **Mapped Types** - Type transformations
7.  **any vs unknown** - Type safety discussion
8.  **Template Literals** - Modern TypeScript feature
9.  **Discriminated Unions** - Type narrowing pattern
10.  **Function Overloads** - Advanced typing

---

###  Company-Specific Focus

#### FAANG Companies (Meta, Google, Amazon)
**Focus Areas:**
- **Advanced Types**: Conditional types, mapped types, template literals
- **Type System Internals**: How TypeScript compiler works
- **Performance**: Large-scale type performance considerations
- **Real-world Problems**: Type complex Redux/state management

**Common Questions:**
- "Design a type-safe state management system"
- "Implement a type-safe router with params"
- "Create a type-safe ORM query builder"
- "Type a complex React component library"

#### Startups & Mid-Size Companies
**Focus Areas:**
- **Practical TypeScript**: Real-world scenarios
- **Migration Experience**: JS to TS conversion
- **Developer Experience**: Making code easier to maintain
- **Integration**: TypeScript with existing tools

**Common Questions:**
- "How would you migrate a JS project to TypeScript?"
- "Type a REST API client"
- "Handle form validation with types"
- "Type complex business logic"

#### Enterprise Companies
**Focus Areas:**
- **Strictness**: tsconfig strict mode
- **Maintainability**: Long-term type safety
- **Team Standards**: Coding conventions
- **Testing**: Typing tests properly

**Common Questions:**
- "How do you enforce coding standards with TypeScript?"
- "Type legacy codebases"
- "Handle backward compatibility"
- "Document types for team"

---

###  Junior vs Senior Expectations

| Aspect | Junior (0-2 years) | Mid (2-5 years) | Senior (5+ years) |
|--------|-------------------|----------------|-------------------|
| **Basic Types** | Must know all primitive types |  Mastered |  Mastered |
| **Generics** | Understand concept, basic usage |  Write generic utilities |  Complex generic patterns |
| **Utility Types** | Know Partial, Pick, Omit |  Use all built-in utilities |  Create custom utilities |
| **Type Guards** | typeof, instanceof |  Custom type predicates |  Advanced narrowing patterns |
| **Mapped Types** | Understand concept |  Create basic mapped types |  Complex transformations |
| **Conditional Types** | Basic understanding |  Use infer keyword |  Nested conditionals, advanced patterns |
| **Real-world** | Type simple functions |  Type APIs, forms, state |  Architect type-safe systems |
| **Compiler** | Basic tsconfig |  Understand options |  Performance tuning, internals |

---

###  Interview Success Tips

#### Before the Interview
-  **Review TypeScript handbook** - Official docs are excellent
-  **Practice on TypeScript playground** - Test concepts interactively
-  **Convert a JS project to TS** - Hands-on experience
-  **Read popular library types** - React, Redux type definitions
-  **Understand your resume** - Be ready to explain your TS projects

#### During the Interview
-  **Think in types first** - "This should be typed as..."
-  **Explain type safety benefits** - "This prevents X error at compile-time"
-  **Show alternatives** - "Could use type or interface here, I prefer..."
-  **Mention trade-offs** - "Using `any` here loses safety but..."
-  **Test edge cases** - "This handles null/undefined because..."

#### Common Interviewer Follow-ups
- "Why did you choose this type over alternatives?"
- "How would you make this type more reusable?"
- "What happens if we add a new property?"
- "How does the compiler infer this?"
- "What's the runtime performance impact?"

#### Red Flags to Avoid
-  Using `any` everywhere without justification
-  Not understanding type inference
-  Can't explain when to use interface vs type
-  Don't know basic utility types
-  No experience with generics
-  Can't type async functions properly

---

###  Essential Resources

#### Official Documentation
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/handbook/
- **TypeScript Playground**: https://www.typescriptlang.org/play
- **Release Notes**: Stay updated with new features

#### Books
- **"Programming TypeScript" by Boris Cherny** - Comprehensive guide
- **"Effective TypeScript" by Dan Vanderkam** - Best practices
- **"TypeScript Quickly" by Yakov Fain** - Quick learning

#### Online Courses
- **Total TypeScript** by Matt Pocock - Advanced patterns
- **TypeScript Course** on Frontend Masters
- **Understanding TypeScript** on Udemy

#### Practice Platforms
- **Type Challenges**: https://github.com/type-challenges/type-challenges
- **LeetCode TypeScript problems**
- **CodeWars TypeScript katas**

#### Community Resources
- **TypeScript Discord** - Active community
- **r/typescript** - Reddit community
- **Stack Overflow** - TypeScript tag
- **Twitter**: Follow @typescript, @mattpocockuk

#### Follow These TypeScript Experts
- **Matt Pocock** - Advanced patterns
- **Dan Vanderkam** - Best practices
- **Josh Goldberg** - Type system internals
- **Marius Schulz** - Deep dives

---

##  Final Interview Checklist

### Day Before Interview
- [ ] Review your TypeScript projects
- [ ] Practice explaining types out loud
- [ ] Refresh on company's tech stack
- [ ] Prepare questions about their TypeScript usage
- [ ] Get good sleep

### 30 Minutes Before
- [ ] Review foundational concepts (Q1-10)
- [ ] Quick practice with generics
- [ ] Refresh utility types
- [ ] Review your STAR stories
- [ ] Deep breaths, stay confident

### During Interview
- [ ] Listen carefully to requirements
- [ ] Ask clarifying questions
- [ ] Type code from the start
- [ ] Explain type choices
- [ ] Handle unknowns gracefully
- [ ] Show enthusiasm for TypeScript

### After Interview
- [ ] Send thank-you email
- [ ] Reflect on what went well
- [ ] Note areas for improvement
- [ ] Follow up if promised

---

##  You're Ready!

You now have a comprehensive guide covering:
-  **Foundational TypeScript concepts** (Q1-10)
-  **Advanced type system features** (Q11-15)
-  **Practical coding implementations** (Q16-20)
-  **Real-world scenarios** (Q21-25)
-  **Advanced patterns** (Q26-30)
-  **Behavioral questions** (Q31-35)
-  **Quick fire answers** (Q36-45)
-  **Success strategies & resources**

### Remember:
-  **Type safety is about confidence** - Catch errors at compile-time
-  **TypeScript improves developer experience** - Better autocomplete, refactoring, documentation
-  **Think in types** - Design types first, implementation follows
-  **Keep learning** - TypeScript evolves rapidly with new features
-  **Help others** - Strong type systems benefit the whole team

### Final Advice:
> "The best TypeScript developers don't memorize syntax—they understand the type system deeply and apply it to solve real problems. Show your thinking process, explain trade-offs, and demonstrate how TypeScript makes codebases more maintainable."

**Good luck with your TypeScript interview! You've got this! **

---

*Questions? Issues? Open to feedback! Keep practicing and stay curious about types.*
