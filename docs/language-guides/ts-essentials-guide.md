# Essential TypeScript: Your Practical Guide to Type Safety

> **PURPOSE**: The 20% of TypeScript you use 80% of the time. Daily-use patterns, practical examples, zero fluff.
>
> **This guide:** Practical daily-use reference. Start here if you're new to TypeScript or want the essentials fast.
>
> **Related guides:**
> - [ts-interview-qa.md](./ts-interview-qa.md) — Fast-reference Q&A, interview speed-round format
> - [typescript-interview-mastery-guide.md](./typescript-interview-mastery-guide.md) — Deep-dive for interviews (97 topics, all levels)

---

## Table of Contents

1. [Core Concepts You Must Understand](#1-core-concepts-you-must-understand)
2. [TypeScript Configuration That Matters](#2-typescript-configuration-that-matters)
3. [Type Annotations: When and Where](#3-type-annotations-when-and-where)
4. [Essential Utility Types](#4-essential-utility-types)
5. [Type Guards & Narrowing](#5-type-guards--narrowing)
6. [Working with Functions](#6-working-with-functions)
7. [Handling Async Code](#7-handling-async-code)
8. [Common Patterns & Best Practices](#8-common-patterns--best-practices)
9. [Modern TypeScript: `satisfies`, `const` types, `infer`](#9-modern-typescript)
10. [Type Definitions & Libraries](#10-type-definitions--libraries)
11. [Common Mistakes to Avoid](#11-common-mistakes-to-avoid)

---

## 1. Core Concepts You Must Understand

### 1.1 Structural Typing (Not Nominal)

**This is THE most important concept to understand.**

TypeScript doesn't care about type names; it cares about the **shape** (properties and their types).

```typescript
//  Other languages (nominal typing)
// Two types with same properties but different names are incompatible

//  TypeScript (structural typing)
interface User {
  name: string;
  age: number;
}

interface Person {
  name: string;
  age: number;
}

let user: User = { name: "Alice", age: 30 };
let person: Person = user; //  Works! Same shape = compatible
```

**Practical Impact:**
```typescript
// This compiles because the object has all required properties
interface Course {
  name: string;
  lessonCount: number;
}

const course: Course = {
  name: "TypeScript",
  lessonCount: 20,
  instructor: "John" // Extra properties OK when directly assigned!
};

// But this doesn't work:
let temp = { name: "TypeScript", lessonCount: 20, instructor: "John" };
const course2: Course = temp; //  Error: extra property 'instructor'
```

### 1.2 Type Inference is Your Friend

TypeScript infers types automatically. Don't over-annotate!

```typescript
//  Too verbose
const name: string = "Alice";
const age: number = 30;
const scores: number[] = [90, 85, 95];

//  Let TypeScript infer
const name = "Alice";        // inferred as string
const age = 30;              // inferred as number
const scores = [90, 85, 95]; // inferred as number[]

//  Annotate where inference can't help
function greet(name: string) { // Must annotate parameters
  return `Hello ${name}`;      // Return type inferred as string
}
```

**Rule of Thumb**: Only add type annotations when:
- Function parameters (required)
- When type inference produces `any`
- When you want to be more restrictive than the inferred type
- For documentation purposes on complex types

### 1.3 The `any` Type: Handle with Care

`any` turns off type checking. It's not evil, but use it strategically.

```typescript
//  Overusing any
function process(data: any) {
  return data.value; // No safety!
}

//  Use `unknown` instead
function process(data: unknown) {
  if (typeof data === "object" && data !== null && "value" in data) {
    return (data as { value: string }).value;
  }
  throw new Error("Invalid data");
}

//  When any is acceptable
// - Interfacing with untyped JavaScript libraries
// - Rapid prototyping (temporarily)
// - Migration from JavaScript (incrementally)
```

---

## 2. TypeScript Configuration That Matters

Your `tsconfig.json` is critical. Here's the essential setup:

```json
{
  "compilerOptions": {
    //  MOST IMPORTANT - Turn these ON
    "strict": true,                    // Enables all strict checks
    "noImplicitAny": true,            // Force explicit types when can't infer
    "strictNullChecks": true,         // null/undefined are not in every type
    "strictFunctionTypes": true,      // Strict checking of function types
    
    //  Highly Recommended
    "noUnusedLocals": true,           // Catch unused variables
    "noUnusedParameters": true,       // Catch unused parameters
    "noImplicitReturns": true,        // All code paths must return
    "skipLibCheck": true,             // Skip type checking of .d.ts files
    
    //  Module System
    "module": "ESNext",               // Use modern modules
    "moduleResolution": "bundler",    // or "node" for Node.js
    "esModuleInterop": true,          // Better CommonJS/ES6 interop
    
    //  Output
    "target": "ES2020",               // Modern JavaScript output
    "outDir": "./dist",
    "rootDir": "./src",
    
    //  Type Checking Level
    "lib": ["ES2020", "DOM"],         // Include necessary type libraries
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Why `strict: true` matters:**
- Catches ~90% of potential runtime errors
- Forces good practices
- Makes refactoring safer

---

## 3. Type Annotations: When and Where

### 3.1 Interfaces vs Type Aliases

Both are similar, but here's when to use each:

```typescript
//  Use INTERFACE for object shapes
interface User {
  id: string;
  name: string;
  email: string;
}

// Why? Interfaces can be extended and merged
interface User {
  createdAt: Date; // Declaration merging
}

//  Use TYPE for unions, intersections, primitives
type Status = "pending" | "approved" | "rejected";
type ID = string | number;
type Callback = (data: string) => void;

//  Complex types
type ApiResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string };
```

### 3.2 Optional vs Required Properties

```typescript
interface Config {
  apiUrl: string;      // Required
  timeout?: number;    // Optional (can be undefined)
  retries?: number;    // Optional
}

// Using it
const config: Config = {
  apiUrl: "https://api.example.com"
  // timeout and retries are optional
};

// Accessing optional properties
function getTimeout(config: Config): number {
  return config.timeout ?? 5000; // Use nullish coalescing
}
```

### 3.3 Union Types (One of Several Types)

```typescript
// Variable can be string OR number
type StringOrNumber = string | number;

function format(value: string | number): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  }
  return value.toFixed(2);
}

// Discriminated unions (very powerful!)
type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

function handleResult<T>(result: Result<T>) {
  if (result.success) {
    console.log(result.data); // TypeScript knows it's T
  } else {
    console.error(result.error); // TypeScript knows it's string
  }
}
```

---

## 4. Essential Utility Types

TypeScript provides built-in utilities. Master these 8:

### 4.1 `Partial<T>` - Make all properties optional

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

// For updates where not all fields are required
function updateUser(id: string, updates: Partial<User>) {
  // updates can have any combination of properties
}

updateUser("123", { name: "Alice" }); //  Only update name
updateUser("123", { email: "alice@example.com" }); //  Only update email
```

### 4.2 `Required<T>` - Make all properties required

```typescript
interface Config {
  host?: string;
  port?: number;
  ssl?: boolean;
}

// Ensure all fields are present
function validateConfig(config: Required<Config>) {
  // All properties must be defined
}
```

### 4.3 `Pick<T, Keys>` - Select specific properties

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

// For API responses, don't expose password
type PublicUser = Pick<User, "id" | "name" | "email">;

const publicUser: PublicUser = {
  id: "123",
  name: "Alice",
  email: "alice@example.com"
  // password not needed!
};
```

### 4.4 `Omit<T, Keys>` - Exclude specific properties

```typescript
// Opposite of Pick
type UserWithoutPassword = Omit<User, "password">;

// For creating new users (omit id and createdAt)
type CreateUserInput = Omit<User, "id" | "createdAt">;
```

### 4.5 `Readonly<T>` - Make properties immutable

```typescript
interface Config {
  apiKey: string;
  apiUrl: string;
}

const config: Readonly<Config> = {
  apiKey: "secret",
  apiUrl: "https://api.example.com"
};

config.apiKey = "new-secret"; //  Error: Cannot assign to read-only property
```

### 4.6 `Record<Keys, Type>` - Create object with specific keys

```typescript
// Instead of index signatures
type UserRoles = Record<string, string[]>;

const permissions: UserRoles = {
  admin: ["read", "write", "delete"],
  user: ["read", "write"],
  guest: ["read"]
};

// Type-safe HTTP status messages
type HttpStatus = 200 | 400 | 401 | 404 | 500;
const statusMessages: Record<HttpStatus, string> = {
  200: "OK",
  400: "Bad Request",
  401: "Unauthorized",
  404: "Not Found",
  500: "Internal Server Error"
};
```

### 4.7 `ReturnType<T>` - Extract function return type

```typescript
function getUser() {
  return {
    id: "123",
    name: "Alice",
    email: "alice@example.com"
  };
}

// No need to define User interface separately!
type User = ReturnType<typeof getUser>;
// User = { id: string; name: string; email: string }

// Powerful for working with third-party libraries
import { getConfig } from "some-library";
type Config = ReturnType<typeof getConfig>;
```

### 4.8 `Awaited<T>` - Extract Promise resolved type

```typescript
async function fetchUser() {
  return {
    id: "123",
    name: "Alice"
  };
}

type User = Awaited<ReturnType<typeof fetchUser>>;
// User = { id: string; name: string }

// Works with nested promises too!
type NestedPromise = Promise<Promise<number>>;
type Resolved = Awaited<NestedPromise>; // number
```

---

## 5. Type Guards & Narrowing

Type guards help TypeScript understand what type a variable is at runtime.

### 5.1 `typeof` Type Guards (for primitives)

```typescript
function format(value: string | number): string {
  if (typeof value === "string") {
    // TypeScript knows value is string here
    return value.toUpperCase();
  }
  // TypeScript knows value is number here
  return value.toFixed(2);
}
```

### 5.2 `instanceof` Type Guards (for classes)

```typescript
class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

function handleError(error: Error | ApiError) {
  if (error instanceof ApiError) {
    console.log(`API Error ${error.statusCode}: ${error.message}`);
  } else {
    console.log(`Error: ${error.message}`);
  }
}
```

### 5.3 `in` Operator (for properties)

```typescript
interface Cat {
  meow(): void;
}

interface Dog {
  bark(): void;
}

function makeSound(animal: Cat | Dog) {
  if ("meow" in animal) {
    animal.meow(); // TypeScript knows it's Cat
  } else {
    animal.bark(); // TypeScript knows it's Dog
  }
}
```

### 5.4 Custom Type Guards (most powerful!)

```typescript
// Type predicate: "value is Type"
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isUser(obj: unknown): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "name" in obj &&
    "email" in obj
  );
}

// Use it
function processData(data: unknown) {
  if (isUser(data)) {
    console.log(data.name); //  TypeScript knows it's User
  }
}
```

### 5.5 Discriminated Unions (tagged unions)

```typescript
// Add a "type" field to distinguish
type Shape = 
  | { type: "circle"; radius: number }
  | { type: "square"; size: number }
  | { type: "rectangle"; width: number; height: number };

function getArea(shape: Shape): number {
  switch (shape.type) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.size ** 2;
    case "rectangle":
      return shape.width * shape.height;
  }
}
```

---

## 6. Working with Functions

### 6.1 Function Type Annotations

```typescript
//  Inline function
function add(a: number, b: number): number {
  return a + b;
}

//  Arrow function
const multiply = (a: number, b: number): number => a * b;

//  Function type alias
type MathOperation = (a: number, b: number) => number;

const divide: MathOperation = (a, b) => a / b;
```

### 6.2 Optional and Default Parameters

```typescript
// Optional parameters
function greet(name: string, greeting?: string): string {
  return `${greeting ?? "Hello"} ${name}`;
}

// Default parameters
function createUser(name: string, role: string = "user") {
  return { name, role };
}
```

### 6.3 Rest Parameters

```typescript
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}

sum(1, 2, 3, 4, 5); // 
```

### 6.4 Function Overloads (for complex cases)

```typescript
// Overload signatures
function format(value: string): string;
function format(value: number): string;
function format(value: boolean): string;

// Implementation signature
function format(value: string | number | boolean): string {
  return String(value);
}
```

---

## 7. Handling Async Code

### 7.1 Promises

```typescript
//  TypeScript infers Promise<User>
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json(); // Assumes API returns User
}

//  Handling errors
async function fetchUserSafe(id: string): Promise<User | null> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}
```

### 7.2 Better Error Handling Pattern

```typescript
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

async function fetchUser(id: string): Promise<Result<User>> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      return { success: false, error: new Error(`HTTP ${response.status}`) };
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error("Unknown error")
    };
  }
}

// Usage
const result = await fetchUser("123");
if (result.success) {
  console.log(result.data.name); //  TypeScript knows data exists
} else {
  console.error(result.error); //  TypeScript knows error exists
}
```

---

## 8. Common Patterns & Best Practices

### 8.1 Type-Safe Environment Variables

```typescript
interface Env {
  API_URL: string;
  API_KEY: string;
  PORT: number;
}

function getEnv(): Env {
  const apiUrl = process.env.API_URL;
  const apiKey = process.env.API_KEY;
  const port = process.env.PORT;

  if (!apiUrl || !apiKey || !port) {
    throw new Error("Missing required environment variables");
  }

  return {
    API_URL: apiUrl,
    API_KEY: apiKey,
    PORT: parseInt(port, 10)
  };
}

// Usage
const env = getEnv(); // Type-safe!
console.log(env.API_URL); // 
```

### 8.2 Type-Safe Event Handlers (React/DOM)

```typescript
// React
function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
  console.log(event.currentTarget.value);
}

// DOM
function handleInput(event: Event) {
  const target = event.target;
  if (target instanceof HTMLInputElement) {
    console.log(target.value);
  }
}
```

### 8.3 Const Assertions (immutable values)

```typescript
//  Regular array
const colors = ["red", "green", "blue"];
// type: string[]

//  Const assertion
const colors = ["red", "green", "blue"] as const;
// type: readonly ["red", "green", "blue"]

type Color = typeof colors[number]; // "red" | "green" | "blue"

//  Object const assertion
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000
} as const;
// All properties become readonly
```

### 8.4 Non-Null Assertion (use sparingly!)

```typescript
// When you're ABSOLUTELY SURE value is not null
const user = getUser();
console.log(user!.name); //  Bypasses null check

//  Better: use optional chaining
console.log(user?.name);

//  Or type guard
if (user) {
  console.log(user.name);
}
```

---

## 9. Modern TypeScript

### 9.1 The `satisfies` Operator (TS 4.9+)

`satisfies` validates that an expression matches a type **without widening** it. It's the best of both worlds: type checking + preserving the narrow inferred type.

```typescript
// Problem: 'as' loses type info, direct annotation widens
type Color = "red" | "green" | "blue";
type Palette = Record<string, Color | Color[]>;

//  Direct annotation — 'red' becomes Color, losing string methods
const palette: Palette = {
  red: "red",
  green: ["green", "green"],
  blue: "blue"
};
palette.red.toUpperCase(); //  Error: Color doesn't have toUpperCase

//  Using 'satisfies' — keeps the narrow type AND validates shape
const palette2 = {
  red: "red",
  green: ["green", "green"],
  blue: "blue"
} satisfies Palette;

palette2.red.toUpperCase(); //  Works! TypeScript knows it's still a string
palette2.green.map(c => c); //  Works! TypeScript knows it's an array
```

**When to use `satisfies`:**
- Config objects where you want both validation and type inference
- Enums-as-objects where you want the exact literal types preserved
- Any time you want "check but don't coerce"

```typescript
// Real-world: Route config with type safety
type Route = { path: string; component: string; exact?: boolean };

const routes = {
  home: { path: "/", component: "Home", exact: true },
  about: { path: "/about", component: "About" },
  blog: { path: "/blog", component: "Blog" }
} satisfies Record<string, Route>;

// TypeScript knows 'exact' is boolean (not boolean | undefined) for 'home'
routes.home.exact; //  boolean
routes.about.exact; //  boolean | undefined
```

---

### 9.2 Const Type Parameters (TS 5.0+)

Infer the narrowest possible type from function arguments without `as const`:

```typescript
// Without const — T is inferred as string[]
function getFirstItem<T>(arr: T[]): T {
  return arr[0];
}
const first = getFirstItem(["a", "b", "c"]);
// first: string (lost 'a' | 'b' | 'c' information)

// With const — T is inferred as readonly ["a", "b", "c"]
function getFirstItem<const T extends readonly unknown[]>(arr: T): T[0] {
  return arr[0];
}
const first2 = getFirstItem(["a", "b", "c"] as const);
// first2: "a"  (exact literal type preserved!)
```

---

### 9.3 Basic `infer` Usage

`infer` lets you extract types from generic patterns:

```typescript
// Extract the resolved type from a Promise
type Awaited<T> = T extends Promise<infer U> ? U : T;

type Result = Awaited<Promise<string>>; // string
type Direct = Awaited<number>; // number

// Extract function return type
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser() { return { id: 1, name: "Alice" }; }
type User = ReturnType<typeof getUser>; // { id: number; name: string }

// Extract first element of array
type First<T extends any[]> = T extends [infer F, ...any[]] ? F : never;
type FirstItem = First<[string, number, boolean]>; // string
```

---

## 10. Type Definitions & Libraries

### 9.1 The Type Definition Hierarchy (in order of preference)

1. **Built-in TypeScript types** (`lib` in tsconfig.json)
   ```json
   {
     "compilerOptions": {
       "lib": ["ES2020", "DOM"] // Promise, Array, etc.
     }
   }
   ```

2. **Library-bundled types** (package ships with `.d.ts` files)
   ```bash
   npm install axios  # Includes types automatically
   ```

3. **@types packages** (community-maintained types)
   ```bash
   npm install --save-dev @types/node
   npm install --save-dev @types/express
   npm install --save-dev @types/react
   ```

4. **No types available** (use `any` or create your own)

### 9.2 Using Libraries Without Types

```typescript
//  Import will work but type is 'any'
import someLib from "some-untyped-library";

//  Create minimal type definition
declare module "some-untyped-library" {
  export function doSomething(input: string): number;
}

//  Or declare as any explicitly
declare module "some-untyped-library";
```

### 9.3 Essential @types Packages

```bash
# Node.js development
npm install --save-dev @types/node

# Express
npm install --save-dev @types/express

# React (usually included)
npm install --save-dev @types/react @types/react-dom

# Jest
npm install --save-dev @types/jest
```

---

## 10. Common Mistakes to Avoid

###  Mistake 1: Over-annotating

```typescript
//  Don't do this
const name: string = "Alice";
const age: number = 30;
const isActive: boolean = true;

//  Let TypeScript infer
const name = "Alice";
const age = 30;
const isActive = true;
```

###  Mistake 2: Using `any` everywhere

```typescript
//  Don't do this
function process(data: any): any {
  return data.value;
}

//  Use proper types or `unknown`
function process(data: unknown): string {
  if (isValidData(data)) {
    return data.value;
  }
  throw new Error("Invalid data");
}
```

###  Mistake 3: Not enabling strict mode

```json
//  Don't do this
{
  "compilerOptions": {
    "strict": false
  }
}

//  Always enable strict mode
{
  "compilerOptions": {
    "strict": true
  }
}
```

###  Mistake 4: Ignoring null/undefined

```typescript
//  Don't do this
function getName(user: User): string {
  return user.name; // What if user is null?
}

//  Handle null/undefined
function getName(user: User | null): string {
  return user?.name ?? "Anonymous";
}
```

###  Mistake 5: Type assertions without validation

```typescript
//  Dangerous!
const data = await response.json() as User;

//  Validate first
const data = await response.json();
if (isUser(data)) {
  // Now safely use data as User
}
```

---

## Quick Reference: Most Used Types

```typescript
// Primitives
string, number, boolean, null, undefined, symbol, bigint

// Special Types
any        // Avoid!
unknown    // Safer than any
never      // Function never returns
void       // Function returns nothing useful

// Arrays
string[]
Array<string>
readonly string[]

// Objects
{ name: string; age: number }
Record<string, any>

// Functions
(a: number, b: number) => number
type Callback = (data: string) => void

// Unions & Intersections
string | number        // Union (OR)
User & Timestamps      // Intersection (AND)

// Utility Types (use these!)
Partial<T>
Required<T>
Readonly<T>
Pick<T, K>
Omit<T, K>
Record<K, T>
ReturnType<T>
Awaited<T>
```

---

## Your Action Plan

1. **Start Here:**
   - Enable `"strict": true` in tsconfig.json
   - Use type inference (don't over-annotate)
   - Learn structural typing

2. **Master These Next:**
   - Utility types: `Partial`, `Pick`, `Omit`, `Record`
   - Type guards: `typeof`, `in`, custom guards
   - Discriminated unions

3. **Advanced (When Ready):**
   - Generics
   - Conditional types
   - Mapped types

4. **Daily Workflow:**
   - Let TypeScript infer types
   - Annotate function parameters
   - Use utility types to transform existing types
   - Trust the compiler errors (they're usually right!)

---

## Resources

- [Official TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [DefinitelyTyped (@types)](https://github.com/DefinitelyTyped/DefinitelyTyped)

---

**Remember**: TypeScript is about making your code safer and more maintainable. If you're fighting the type system, you're probably doing something wrong. Trust the errors, fix the types, and enjoy the safety net! 