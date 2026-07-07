# TypeScript Interview Questions & Answers

> **PURPOSE**: Concise interview Q&A — short answers you can give in 60–90 seconds. Ideal for interview speed-rounds or quick revision before an interview.
>
> **This guide:** Quick-recap format. Best used *after* studying the mastery guide, as a fast final review.
>
> **Related guides:**
> - [ts-essentials-guide.md](./ts-essentials-guide.md) — Practical daily-use patterns (80/20 guide)
> - [typescript-interview-mastery-guide.md](./typescript-interview-mastery-guide.md) — Deep-dive mastery guide with difficulty ratings and follow-ups

---

##  Table of Contents

1. [Foundational Questions (Must Know)](#foundational-questions)
2. [Type System Questions (Core Understanding)](#type-system-questions)
3. [Practical Coding Questions](#practical-coding-questions)
4. [Advanced Conceptual Questions](#advanced-questions)
5. [Real-World Scenario Questions](#real-world-scenarios)
6. [Tricky/Gotcha Questions](#tricky-questions)
7. [Behavioral Questions](#behavioral-questions)

---

## Foundational Questions

### Q1: What is TypeScript and why use it over JavaScript?

** Strong Answer:**
"TypeScript is a statically-typed superset of JavaScript that compiles to plain JavaScript. I use it because it catches errors during development rather than at runtime, which saves time debugging. It provides excellent IDE support with autocomplete and refactoring, and makes code more maintainable through type safety and self-documenting code."

** Follow-up Discussion Points:**
- "Any valid JavaScript is valid TypeScript"
- Mention specific IDE features (IntelliSense, refactoring)
- Discuss how it helps in large codebases
- Talk about the compilation step

** Weak Answer:**
"It's JavaScript with types." (Too brief, shows no depth)

---

### Q2: Explain the difference between `interface` and `type`. When would you use each?

** Strong Answer:**
```typescript
// Interface - best for object shapes
interface User {
  id: string;
  name: string;
}

// Interfaces can be extended
interface Admin extends User {
  permissions: string[];
}

// Interfaces support declaration merging
interface User {
  email: string; // Adds to existing User interface
}

// Type - best for unions, intersections, primitives
type Status = "active" | "inactive" | "pending";
type ID = string | number;
type Point = [number, number];

// Type can use complex type operations
type ReadonlyUser = Readonly<User>;
```

** What to Say:**
"I use `interface` for object shapes because they're more extensible and support declaration merging, which is useful when working with third-party libraries. I use `type` for unions, intersections, and when I need more complex type operations like mapped types or conditional types."

**Common Follow-up:** "Can you extend a type?"
**Answer:** "Yes, using intersections: `type Admin = User & { permissions: string[] }`"

---

### Q3: What is type inference? Can you give examples?

** Strong Answer:**
```typescript
// TypeScript infers the type automatically
const name = "Alice";        // inferred as string
const age = 30;              // inferred as number
const isActive = true;       // inferred as boolean
const numbers = [1, 2, 3];   // inferred as number[]

// Return type inference
function add(a: number, b: number) {
  return a + b; // return type inferred as number
}

// Context-based inference
const button = document.querySelector("button");
// button is inferred as HTMLButtonElement | null

button?.addEventListener("click", (e) => {
  // e is inferred as MouseEvent
  console.log(e.clientX);
});
```

** What to Say:**
"Type inference is TypeScript's ability to automatically determine types without explicit annotations. This reduces verbosity while maintaining type safety. The compiler analyzes variable initialization, function return values, and context to infer the most accurate type."

** Pro Tip:** "I enable `noImplicitAny` in my tsconfig to ensure TypeScript infers types or requires explicit annotations, which helps catch errors early."

---

### Q4: Explain `any`, `unknown`, and `never`. When would you use each?

** Strong Answer:**
```typescript
// any - turns off type checking (use sparingly!)
let value: any = "hello";
value = 42;           // OK
value.nonExistent();  // No error, but will crash at runtime!

// unknown - type-safe version of any
let userInput: unknown;
userInput = "hello";
userInput = 42;

// Must check type before using
if (typeof userInput === "string") {
  console.log(userInput.toUpperCase()); // OK
}
// console.log(userInput.toUpperCase()); // ERROR without check

// never - represents values that never occur
function throwError(message: string): never {
  throw new Error(message);
  // Never returns normally
}

function infiniteLoop(): never {
  while (true) {
    // Runs forever
  }
}

// Useful in exhaustive checks
type Shape = "circle" | "square";

function getArea(shape: Shape) {
  switch (shape) {
    case "circle": return Math.PI;
    case "square": return 1;
    default:
      const exhaustive: never = shape; // Error if we missed a case
      throw new Error(`Unhandled shape: ${exhaustive}`);
  }
}
```

** What to Say:**
"I use `any` only when rapidly prototyping or integrating with untyped JavaScript, but I prefer `unknown` because it's type-safe—you must narrow the type before using it. `never` represents values that never occur, which is useful for exhaustive checking and functions that never return."

---

### Q5: What is structural typing (duck typing)?

** Strong Answer:**
```typescript
interface Point {
  x: number;
  y: number;
}

interface Coordinate {
  x: number;
  y: number;
}

let point: Point = { x: 10, y: 20 };
let coord: Coordinate = point; //  Works! Same structure

// This works even without declaring a type
function printPoint(p: Point) {
  console.log(`${p.x}, ${p.y}`);
}

// Can pass any object with x and y
printPoint({ x: 5, y: 10 });              // 
printPoint({ x: 5, y: 10, z: 15 });       //  Extra properties OK
```

** What to Say:**
"TypeScript uses structural typing, which means type compatibility is based on the structure (properties and their types) rather than the type name. If two types have the same shape, they're compatible. This is different from nominal typing in languages like Java where you must explicitly extend or implement."

**Real-world Example:** "This is why we can pass plain objects to functions expecting interfaces without creating class instances."

---

## Type System Questions

### Q6: What are Union and Intersection types?

** Strong Answer:**
```typescript
// UNION (OR) - value can be ONE of several types
type StringOrNumber = string | number;

function format(value: StringOrNumber) {
  if (typeof value === "string") {
    return value.toUpperCase();
  }
  return value.toFixed(2);
}

// Discriminated union (tagged union)
type Response = 
  | { status: "success"; data: string }
  | { status: "error"; error: string };

function handleResponse(response: Response) {
  if (response.status === "success") {
    console.log(response.data); // TypeScript knows it's success
  } else {
    console.error(response.error); // TypeScript knows it's error
  }
}

// INTERSECTION (AND) - combines multiple types
type Person = {
  name: string;
  age: number;
};

type Employee = {
  employeeId: string;
  department: string;
};

type Staff = Person & Employee; // Must have ALL properties

const staff: Staff = {
  name: "Alice",
  age: 30,
  employeeId: "E123",
  department: "Engineering"
};
```

** What to Say:**
"Union types use `|` for 'either/or' scenarios—a value can be one of several types. Intersection types use `&` to combine types—a value must satisfy all types. Unions are great for function parameters that accept multiple types, while intersections are useful for mixing behaviors or properties."

---

### Q7: Explain Type Guards and Type Narrowing

** Strong Answer:**
```typescript
// 1. typeof type guard (primitives)
function formatValue(value: string | number) {
  if (typeof value === "string") {
    return value.toUpperCase(); // TypeScript knows it's string
  }
  return value.toFixed(2); // TypeScript knows it's number
}

// 2. instanceof type guard (classes)
class Cat {
  meow() { console.log("Meow!"); }
}

class Dog {
  bark() { console.log("Woof!"); }
}

function makeSound(animal: Cat | Dog) {
  if (animal instanceof Cat) {
    animal.meow();
  } else {
    animal.bark();
  }
}

// 3. in operator (property checks)
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    animal.swim();
  } else {
    animal.fly();
  }
}

// 4. Custom type guard (most powerful!)
interface User {
  id: string;
  name: string;
  email: string;
}

// Type predicate: "obj is User"
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "name" in obj &&
    "email" in obj &&
    typeof (obj as User).id === "string" &&
    typeof (obj as User).name === "string" &&
    typeof (obj as User).email === "string"
  );
}

// Usage
function processData(data: unknown) {
  if (isUser(data)) {
    console.log(data.email); //  TypeScript knows it's User
  }
}
```

** What to Say:**
"Type guards help TypeScript narrow types at runtime. I use `typeof` for primitives, `instanceof` for classes, and `in` for property checks. For complex types, I create custom type guards using type predicates (`obj is Type`), which provide reusable, type-safe validation."

---

### Q8: What are Utility Types? Give practical examples.

** Strong Answer:**
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

// 1. Partial - make all properties optional
function updateUser(id: string, updates: Partial<User>) {
  // Can update any combination of fields
}
updateUser("123", { name: "Alice" }); //  Only name

// 2. Pick - select specific properties
type PublicUser = Pick<User, "id" | "name" | "email">;
// { id: string; name: string; email: string }

// 3. Omit - exclude specific properties
type UserWithoutPassword = Omit<User, "password">;
type CreateUserInput = Omit<User, "id" | "createdAt">;

// 4. Readonly - make immutable
const config: Readonly<User> = {
  id: "1",
  name: "Alice",
  email: "alice@example.com",
  password: "secret",
  createdAt: new Date()
};
// config.name = "Bob"; //  Error

// 5. Record - create object with specific keys
type Permissions = Record<"read" | "write" | "delete", boolean>;
const userPermissions: Permissions = {
  read: true,
  write: true,
  delete: false
};

// 6. ReturnType - extract function return type
function getUser() {
  return {
    id: "123",
    name: "Alice",
    email: "alice@example.com"
  };
}
type User = ReturnType<typeof getUser>;

// 7. Awaited - extract Promise resolved type
async function fetchUser() {
  return { id: "123", name: "Alice" };
}
type FetchedUser = Awaited<ReturnType<typeof fetchUser>>;

// 8. Required - make all properties required
interface Config {
  host?: string;
  port?: number;
}
function validateConfig(config: Required<Config>) {
  // All properties must be present
}
```

** What to Say:**
"Utility types help transform existing types without rewriting them. I frequently use `Partial` for update operations, `Pick` and `Omit` for API responses, `ReturnType` to derive types from functions, and `Record` for type-safe key-value objects. These make code more DRY and maintainable."

---

### Q9: What are Generics? Provide practical examples.

** Strong Answer:**
```typescript
// Without generics (not reusable)
function getFirstString(arr: string[]): string {
  return arr[0];
}
function getFirstNumber(arr: number[]): number {
  return arr[0];
}

// With generics (reusable!)
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

const firstString = getFirst(["a", "b", "c"]); // Type: string
const firstNumber = getFirst([1, 2, 3]);       // Type: number

// Generic interfaces
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface User {
  id: string;
  name: string;
}

const userResponse: ApiResponse<User> = {
  data: { id: "1", name: "Alice" },
  status: 200,
  message: "Success"
};

const usersResponse: ApiResponse<User[]> = {
  data: [
    { id: "1", name: "Alice" },
    { id: "2", name: "Bob" }
  ],
  status: 200,
  message: "Success"
};

// Generic constraints
interface HasId {
  id: string;
}

function findById<T extends HasId>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id);
}

// Generic with multiple type parameters
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const merged = merge({ name: "Alice" }, { age: 30 });
// Type: { name: string } & { age: number }
```

** What to Say:**
"Generics allow creating reusable components that work with multiple types while maintaining type safety. They're like function parameters but for types. I use them for API wrappers, data structures, and utility functions that need to work with different types without sacrificing type information."

**Real-world Example:** "In React, `useState<T>()` uses generics to maintain type safety for state values."

---

### Q10: What is `strictNullChecks` and why is it important?

** Strong Answer:**
```typescript
// Without strictNullChecks (dangerous!)
// tsconfig.json: "strictNullChecks": false

function greet(name: string) {
  return `Hello ${name.toUpperCase()}`; // Might crash!
}

const user: string = null; // No error!
greet(user); // Runtime error: Cannot read property 'toUpperCase' of null

// With strictNullChecks (safe!)
// tsconfig.json: "strictNullChecks": true

function greet(name: string) {
  return `Hello ${name.toUpperCase()}`;
}

// const user: string = null; //  Error: Type 'null' is not assignable to type 'string'

// Must be explicit about null/undefined
function greetSafe(name: string | null) {
  if (name === null) {
    return "Hello Guest";
  }
  return `Hello ${name.toUpperCase()}`; // Safe!
}

// Optional chaining
interface User {
  name: string;
  address?: {
    street: string;
    city: string;
  };
}

function getCity(user: User): string | undefined {
  return user.address?.city; // Safe navigation
}

// Nullish coalescing
function getDisplayName(name: string | null | undefined): string {
  return name ?? "Anonymous"; // Returns "Anonymous" if name is null/undefined
}
```

** What to Say:**
"With `strictNullChecks` enabled, `null` and `undefined` are not assignable to other types unless explicitly stated. This catches the most common runtime error: 'Cannot read property of null/undefined'. I always enable it because it forces proper null handling through optional chaining, nullish coalescing, or explicit checks."

** Pro Tip:** "This is one of the most valuable strict mode flags. It prevents billions of dollars in production bugs."

---

## Practical Coding Questions

### Q11: Write a type-safe function to fetch data from an API

** Strong Answer:**
```typescript
// Define result type (error handling pattern)
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

// Generic fetch function
async function fetchData<T>(url: string): Promise<Result<T>> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      return {
        success: false,
        error: new Error(`HTTP ${response.status}: ${response.statusText}`)
      };
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
interface User {
  id: string;
  name: string;
  email: string;
}

async function getUser(id: string) {
  const result = await fetchData<User>(`/api/users/${id}`);
  
  if (result.success) {
    console.log(result.data.name); //  TypeScript knows data exists
    return result.data;
  } else {
    console.error(result.error.message); //  TypeScript knows error exists
    return null;
  }
}
```

** What to Say:**
"I use the Result pattern for error handling because it makes success and error cases explicit in the type system. Instead of throwing errors or using try-catch everywhere, callers must check the success flag, which TypeScript uses to narrow the type. This makes error handling explicit and type-safe."

---

### Q12: How do you handle form data type-safely?

** Strong Answer:**
```typescript
// Define form data structure
interface SignupForm {
  email: string;
  password: string;
  confirmPassword: string;
  age: number;
  acceptTerms: boolean;
}

// Validation result type
type ValidationResult<T> = 
  | { valid: true; data: T }
  | { valid: false; errors: Record<keyof T, string> };

// Type-safe validator
function validateSignupForm(formData: SignupForm): ValidationResult<SignupForm> {
  const errors: Partial<Record<keyof SignupForm, string>> = {};
  
  if (!formData.email.includes("@")) {
    errors.email = "Invalid email format";
  }
  
  if (formData.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }
  
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords don't match";
  }
  
  if (formData.age < 18) {
    errors.age = "Must be 18 or older";
  }
  
  if (!formData.acceptTerms) {
    errors.acceptTerms = "You must accept the terms";
  }
  
  if (Object.keys(errors).length > 0) {
    return {
      valid: false,
      errors: errors as Record<keyof SignupForm, string>
    };
  }
  
  return { valid: true, data: formData };
}

// Usage with React
function SignupComponent() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const data: SignupForm = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
      age: parseInt(formData.get("age") as string, 10),
      acceptTerms: formData.get("acceptTerms") === "on"
    };
    
    const result = validateSignupForm(data);
    
    if (result.valid) {
      // Submit to API
      console.log("Valid data:", result.data);
    } else {
      // Show errors
      console.error("Validation errors:", result.errors);
    }
  };
  
  return <form onSubmit={handleSubmit}>{/* form fields */}</form>;
}
```

** What to Say:**
"I define interfaces for form data structure and use discriminated unions for validation results. This ensures type safety throughout the validation process and makes it impossible to access data without checking if validation passed. The type system guides error handling naturally."

---

### Q13: Create a type-safe state machine

** Strong Answer:**
```typescript
// Define states and events
type State = 
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: string }
  | { status: "error"; error: string };

type Event = 
  | { type: "FETCH" }
  | { type: "SUCCESS"; data: string }
  | { type: "ERROR"; error: string }
  | { type: "RESET" };

// State machine reducer
function stateMachine(state: State, event: Event): State {
  switch (state.status) {
    case "idle":
      if (event.type === "FETCH") {
        return { status: "loading" };
      }
      return state;
      
    case "loading":
      if (event.type === "SUCCESS") {
        return { status: "success", data: event.data };
      }
      if (event.type === "ERROR") {
        return { status: "error", error: event.error };
      }
      return state;
      
    case "success":
    case "error":
      if (event.type === "RESET") {
        return { status: "idle" };
      }
      if (event.type === "FETCH") {
        return { status: "loading" };
      }
      return state;
      
    default:
      const exhaustive: never = state; // Ensures all states handled
      return exhaustive;
  }
}

// Usage
let state: State = { status: "idle" };

state = stateMachine(state, { type: "FETCH" });
console.log(state); // { status: "loading" }

state = stateMachine(state, { type: "SUCCESS", data: "Hello!" });
console.log(state); // { status: "success", data: "Hello!" }

if (state.status === "success") {
  console.log(state.data); // TypeScript knows data exists
}
```

** What to Say:**
"I use discriminated unions for state machines because TypeScript can narrow types based on the discriminant property (`status` in this case). This ensures only valid state transitions happen and makes it impossible to access properties that don't exist in the current state. The `never` type in the default case ensures exhaustive checking."

---

## Advanced Questions

### Q14: What are Mapped Types? Provide examples.

** Strong Answer:**
```typescript
// Create variations of existing types

// Make all properties optional
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Make all properties readonly
type Readonly<T> = {
  [P in keyof T]: readonly T[P];
};

// Create new object type with specific keys and value type
type Record<K extends string | number | symbol, T> = {
  [P in K]: T;
};

// Practical example: API response transformer
interface User {
  id: number;
  name: string;
  email: string;
}

// Transform all properties to nullable
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

type NullableUser = Nullable<User>;
// { id: number | null; name: string | null; email: string | null }

// Transform property types
type StringifyProperties<T> = {
  [P in keyof T]: string;
};

type UserStrings = StringifyProperties<User>;
// { id: string; name: string; email: string }

// Practical: Form fields
type FormField<T> = {
  value: T;
  error: string | null;
  touched: boolean;
};

type FormState<T> = {
  [P in keyof T]: FormField<T[P]>;
};

type UserForm = FormState<User>;
// {
//   id: FormField<number>;
//   name: FormField<string>;
//   email: FormField<string>;
// }
```

** What to Say:**
"Mapped types transform existing types by iterating over their properties. I use them to create utility types like `Partial`, `Readonly`, or custom transformations. They're powerful for creating type-safe form states, API wrappers, or any scenario where I need to systematically transform an object type."

---

### Q15: Explain Conditional Types with examples

** Strong Answer:**
```typescript
// Basic conditional type syntax: T extends U ? X : Y

// Extract non-null types
type NonNullable<T> = T extends null | undefined ? never : T;

type Example1 = NonNullable<string | null>; // string
type Example2 = NonNullable<number | undefined>; // number

// Extract array element type
type ArrayElement<T> = T extends (infer E)[] ? E : T;

type Example3 = ArrayElement<string[]>; // string
type Example4 = ArrayElement<number>; // number

// Practical: API response unwrapper
type ApiResponse<T> = {
  data: T;
  error: string | null;
};

type UnwrapResponse<T> = T extends ApiResponse<infer U> ? U : T;

type User = { id: string; name: string };
type UserResponse = ApiResponse<User>;
type UnwrappedUser = UnwrapResponse<UserResponse>; // User

// Function return type extractor
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser() {
  return { id: "1", name: "Alice" };
}

type UserType = ReturnType<typeof getUser>; // { id: string; name: string }

// Practical: Flatten nested arrays
type Flatten<T> = T extends Array<infer U> ? Flatten<U> : T;

type Nested = string[][][];
type Flattened = Flatten<Nested>; // string
```

** What to Say:**
"Conditional types work like ternary operators for types. They're useful for creating generic utilities that behave differently based on the input type. I use them with `infer` to extract types from complex structures, like getting the element type of an array or the return type of a function."

---

### Q16: What are Template Literal Types?

** Strong Answer:**
```typescript
// Create types from string patterns
type EmailLocale = "en" | "es" | "fr";
type EmailType = "welcome" | "reset" | "notification";

// Combine strings to create all combinations
type EmailTemplate = `${EmailType}_${EmailLocale}`;
// "welcome_en" | "welcome_es" | "welcome_fr" | 
// "reset_en" | "reset_es" | "reset_fr" |
// "notification_en" | "notification_es" | "notification_fr"

// Practical: CSS properties
type CSSProperty = "margin" | "padding";
type CSSDirection = "top" | "bottom" | "left" | "right";

type CSSFullProperty = `${CSSProperty}${Capitalize<CSSDirection>}`;
// "marginTop" | "marginBottom" | "marginLeft" | "marginRight" |
// "paddingTop" | "paddingBottom" | "paddingLeft" | "paddingRight"

// Event handlers
type EventName = "click" | "change" | "input";
type EventHandler = `on${Capitalize<EventName>}`;
// "onClick" | "onChange" | "onInput"

// API endpoints
type Resource = "user" | "post" | "comment";
type Method = "get" | "create" | "update" | "delete";

type Endpoint = `/${Resource}/${Method}`;
// "/user/get" | "/user/create" | "/user/update" | "/user/delete" | ...

// Practical example: Type-safe routing
type Route = 
  | "/"
  | "/about"
  | "/users"
  | "/users/:id"
  | "/posts/:id/comments";

function navigate(route: Route) {
  // Type-safe navigation
}

navigate("/users"); // 
navigate("/invalid"); //  Error
```

** What to Say:**
"Template literal types let me create string types from patterns, similar to template literals in JavaScript. I use them for type-safe CSS properties, event handlers, API routes, and any scenario where strings follow a predictable pattern. They catch typos at compile time and provide excellent autocomplete."

---

## Real-World Scenarios

### Q17: How do you type a Redux store?

** Strong Answer:**
```typescript
// State interface
interface RootState {
  user: UserState;
  posts: PostsState;
}

interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

interface PostsState {
  items: Post[];
  loading: boolean;
  error: string | null;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
}

// Action types
type UserAction =
  | { type: "USER_FETCH_START" }
  | { type: "USER_FETCH_SUCCESS"; payload: User }
  | { type: "USER_FETCH_ERROR"; payload: string }
  | { type: "USER_LOGOUT" };

type PostsAction =
  | { type: "POSTS_FETCH_START" }
  | { type: "POSTS_FETCH_SUCCESS"; payload: Post[] }
  | { type: "POSTS_FETCH_ERROR"; payload: string };

type RootAction = UserAction | PostsAction;

// Reducer
function userReducer(
  state: UserState = { currentUser: null, loading: false, error: null },
  action: RootAction
): UserState {
  switch (action.type) {
    case "USER_FETCH_START":
      return { ...state, loading: true, error: null };
      
    case "USER_FETCH_SUCCESS":
      return { ...state, loading: false, currentUser: action.payload };
      
    case "USER_FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
      
    case "USER_LOGOUT":
      return { currentUser: null, loading: false, error: null };
      
    default:
      return state;
  }
}

// Type-safe hooks (Redux Toolkit style)
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    user: userReducer,
    // ... other reducers
  }
});

type AppDispatch = typeof store.dispatch;
type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Usage in component
function UserProfile() {
  const user = useAppSelector(state => state.user.currentUser); //  Typed!
  const dispatch = useAppDispatch();
  
  if (!user) return <div>Loading...</div>;
  
  return <div>{user.name}</div>;
}
```

** What to Say:**
"I define clear interfaces for state shape and use discriminated unions for actions. This ensures reducers handle all action types exhaustively. I export typed versions of `useSelector` and `useDispatch` hooks so the entire Redux integration is type-safe throughout the application."

---

### Q18: How do you handle environment variables type-safely?

** Strong Answer:**
```typescript
// Define required environment variables
interface Env {
  NODE_ENV: "development" | "production" | "test";
  API_URL: string;
  API_KEY: string;
  PORT: number;
  ENABLE_ANALYTICS: boolean;
}

// Validation and parsing
function getEnv(): Env {
  const nodeEnv = process.env.NODE_ENV;
  const apiUrl = process.env.API_URL;
  const apiKey = process.env.API_KEY;
  const port = process.env.PORT;
  const enableAnalytics = process.env.ENABLE_ANALYTICS;
  
  // Validate required variables
  if (!apiUrl || !apiKey || !port) {
    throw new Error(
      "Missing required environment variables. " +
      "Please check your .env file."
    );
  }
  
  // Validate NODE_ENV
  if (
    nodeEnv !== "development" &&
    nodeEnv !== "production" &&
    nodeEnv !== "test"
  ) {
    throw new Error(
      `Invalid NODE_ENV: ${nodeEnv}. ` +
      `Must be 'development', 'production', or 'test'.`
    );
  }
  
  return {
    NODE_ENV: nodeEnv,
    API_URL: apiUrl,
    API_KEY: apiKey,
    PORT: parseInt(port, 10),
    ENABLE_ANALYTICS: enableAnalytics === "true"
  };
}

// Export singleton
export const env = getEnv();

// Usage
console.log(env.API_URL); //  Type: string
console.log(env.PORT); //  Type: number
console.log(env.NODE_ENV); //  Type: "development" | "production" | "test"
```

** What to Say:**
"I create an interface defining all required environment variables with their correct types. Then I write a validation function that parses and type-checks them at application startup. This fails fast if configuration is wrong and provides type-safe access throughout the codebase. The singleton pattern ensures validation only happens once."

---

### Q19: How do you type Higher-Order Components (HOC) in React?

** Strong Answer:**
```typescript
import React, { ComponentType } from 'react';

// Props the HOC injects
interface InjectedProps {
  isAuthenticated: boolean;
  user: User | null;
}

// HOC function type
function withAuth<P extends InjectedProps>(
  Component: ComponentType<P>
): ComponentType<Omit<P, keyof InjectedProps>> {
  
  return function WithAuthComponent(props: Omit<P, keyof InjectedProps>) {
    const [user, setUser] = React.useState<User | null>(null);
    const isAuthenticated = user !== null;
    
    // Cast props to include injected props
    return (
      <Component 
        {...(props as P)}
        isAuthenticated={isAuthenticated}
        user={user}
      />
    );
  };
}

// Usage
interface ProfileProps extends InjectedProps {
  userId: string;
}

function ProfileComponent({ isAuthenticated, user, userId }: ProfileProps) {
  if (!isAuthenticated) return <div>Please log in</div>;
  return <div>Welcome {user.name}</div>;
}

// Wrap component
const Profile = withAuth(ProfileComponent);

// Use it (don't need to pass isAuthenticated or user!)
<Profile userId="123" />
```

** What to Say:**
"I use generic type parameters with extends constraints to ensure the wrapped component accepts the injected props. The returned component has those props omitted from its prop requirements using the Omit utility type. This makes the HOC fully type-safe—the wrapped component requires the injected props, but consumers don't need to pass them."

---

## Tricky Questions

### Q20: What's wrong with this code and how do you fix it?

```typescript
const obj = {};
obj.name = "Alice"; // Error: Property 'name' does not exist on type '{}'
```

** Strong Answer:**
"TypeScript infers `obj` as type `{}` (empty object) because it has no properties when initialized. TypeScript's structural typing means you can't add properties that don't exist in the type definition.

**Three solutions:**

```typescript
// Solution 1: Define the type upfront
interface Person {
  name: string;
}
const obj: Person = { name: "Alice" };

// Solution 2: Type assertion (less safe)
const obj = {} as { name: string };
obj.name = "Alice";

// Solution 3: Initialize with properties
const obj = { name: "Alice" }; // Type inferred as { name: string }

// Solution 4: Use Record for dynamic properties
const obj: Record<string, string> = {};
obj.name = "Alice";
obj.email = "alice@example.com";
```

I prefer Solution 1 because it's most type-safe. Solution 4 is good for truly dynamic objects."

---

### Q21: Why does this code compile?

```typescript
interface User {
  name: string;
  age: number;
}

const user: User = {
  name: "Alice",
  age: 30,
  email: "alice@example.com" // Extra property!
};
```

** Strong Answer:**
"This actually depends on the context! TypeScript has 'excess property checking' that only applies to object literals assigned directly to a variable. This code will ERROR because of excess property checking.

However, if you assign to a variable first, it works:

```typescript
const temp = {
  name: "Alice",
  age: 30,
  email: "alice@example.com"
};

const user: User = temp; //  Works! Structural typing
```

This is because TypeScript uses structural typing—`temp` has all required properties of `User` (name and age), so it's compatible. The extra `email` property doesn't matter.

To prevent extra properties in all cases:

```typescript
const user: User = {
  name: "Alice",
  age: 30
} as const; // Use only exact properties
```

Or use the `Exact` utility type (if available in your codebase)."

---

### Q22: What's the difference between `type` and `interface` for function types?

** Strong Answer:**
```typescript
// Both work for function types

// Interface
interface GreetFunction {
  (name: string): string;
}

// Type
type GreetFunction = (name: string) => string;

// Usage is identical
const greet: GreetFunction = (name) => `Hello ${name}`;
```

** What to Say:**
"For function types, `type` is more concise and readable with arrow syntax. `interface` uses call signature syntax which is more verbose. Both are functionally equivalent. I prefer `type` for function signatures because it looks more like JavaScript function syntax."

---

## Behavioral Questions

### Q23: Tell me about a time TypeScript caught a bug before production

** Strong Answer Framework:**
```
Situation: "In our React app, we had an API that returned user data..."

Task: "I needed to display user information in multiple components..."

Action: "I created a User interface with all required properties. TypeScript caught 
three issues:
1. API sometimes returned null for optional fields without marking them optional
2. One component was accessing a property that didn't exist in older API versions  
3. Date fields were strings, not Date objects

I fixed these by:
- Making optional fields explicit in the interface
- Adding proper type guards before accessing conditional properties
- Creating a parsing function to transform strings to Date objects"

Result: "This prevented three runtime errors that would have crashed the app for 
users. The type system made the issues obvious during development instead of 
discovering them in production logs."
```

---

### Q24: How do you convince a team to adopt TypeScript?

** Strong Answer:**
"I focus on practical benefits:

**Immediate Value:**
- Better IDE autocomplete and refactoring
- Catch errors before runtime
- Self-documenting code (types as documentation)

**Long-term Value:**
- Easier onboarding (types explain the codebase)
- Safer refactoring (confidence to change code)
- Reduced debugging time

**Migration Strategy:**
- Start with `allowJs: true` (gradual adoption)
- Convert files incrementally
- Begin with new code, migrate old code over time
- Focus on high-value areas first (API boundaries, state management)

I share concrete examples of bugs TypeScript would have prevented, and I offer to pair program with team members to demonstrate the workflow. Most importantly, I emphasize it's about making development easier, not adding ceremony."

---

## Quick Fire Round (Test Your Knowledge!)

### Q25-30: Answer in one sentence

**Q25: What is the `keyof` operator?**
 "It creates a union type of all property names in an object type."
```typescript
type User = { name: string; age: number };
type UserKeys = keyof User; // "name" | "age"
```

**Q26: What is `typeof` operator in TypeScript?**
 "It extracts the type of a value, useful for inferring types from variables or functions."
```typescript
const config = { api: "https://api.com", timeout: 5000 };
type Config = typeof config; // { api: string; timeout: number }
```

**Q27: Difference between `interface` extending and `type` intersection?**
 "Functionally similar, but interfaces show better error messages and support declaration merging."

**Q28: What is type assertion?**
 "Telling TypeScript to treat a value as a specific type using `as` or angle brackets, bypassing type checking."
```typescript
const value = someValue as string;
```

**Q29: What is a tuple?**
 "A fixed-length array where each element has a specific type."
```typescript
const point: [number, number] = [10, 20];
```

**Q30: What is the `in` operator?**
 "A type guard that checks if a property exists in an object."
```typescript
if ("name" in user) {
  console.log(user.name);
}
```

---

## Tips for Success 

### Before the Interview
1.  Review tsconfig.json options (especially strict flags)
2.  Practice explaining structural typing (it's unique to TypeScript)
3.  Be comfortable with utility types (Partial, Pick, Omit, Record)
4.  Know when to use `interface` vs `type`
5.  Understand type guards and narrowing

### During the Interview
1. **Think out loud** - Explain your reasoning
2. **Ask clarifying questions** - Don't make assumptions
3. **Start simple** - Get something working, then improve
4. **Admit gaps** - "I'm not sure, but here's how I'd find out..."
5. **Show real experience** - Mention actual projects

### Red Flags to Avoid
1.  "TypeScript is just JavaScript with types" (oversimplification)
2.  Using `any` everywhere
3.  Not knowing the difference between `any` and `unknown`
4.  Can't explain why strict mode is important
5.  Don't understand structural typing

---

## Common Follow-up Questions

### "Why is TypeScript better than PropTypes/Flow?"
 "TypeScript provides compile-time checking (vs runtime for PropTypes), has excellent IDE support, is maintained by Microsoft with huge community adoption, and can gradually be adopted in existing JavaScript codebases."

### "What are the downsides of TypeScript?"
 "There's a learning curve, compilation step adds build time, and initially it might feel slower to write code. However, these are offset by fewer bugs, better maintainability, and time saved debugging."

### "How do you handle third-party libraries without types?"
 "First check @types for community types. If unavailable, I create a minimal .d.ts file with `declare module 'library-name'` to suppress errors, then gradually add types as I use features. For frequently-used libraries, I might contribute types back to DefinitelyTyped."

---

## Final Confidence Boosters

**Remember:**
1. You don't need to know everything—interviews test problem-solving, not memorization
2. It's okay to say "I don't know, but here's how I'd figure it out"
3. Real-world experience matters more than textbook answers
4. Show enthusiasm for type safety and code quality
5. Relate answers back to actual projects you've worked on

**Practice Makes Perfect:**
- Code something in TypeScript every day
- Contribute to open-source TypeScript projects
- Pair program with others
- Read TypeScript release notes (shows you stay current)

---

## Resources for Continued Learning

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Deep Dive (Book)](https://basarat.gitbook.io/typescript/)
- [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)
- [TypeScript Playground](https://www.typescriptlang.org/play)

---

**You've got this! ** 

Focus on understanding concepts, not memorizing answers. The best interview answers come from real experience and genuine understanding. Good luck! 