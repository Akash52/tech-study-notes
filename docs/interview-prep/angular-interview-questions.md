# Angular Interview Questions and Answers

This reference covers Angular concepts from fundamentals to modern v17+ features, organized by topic and experience level. Each question includes a concise answer, code examples where applicable, and interview guidance.

| Prerequisite | Details |
| --- | --- |
| TypeScript | Classes, decorators, generics, interfaces |
| HTML / CSS | Templates, styling, DOM concepts |
| JavaScript ES6+ | Promises, async/await, modules, destructuring |
| RxJS | Observables, operators, subscriptions |

---

## Table of Contents

### Fundamentals (Level 1-2)

- [Architecture](#architecture)
- [Components](#components)
- [Services](#services)
- [Observables and RxJS](#observables-and-rxjs)
- [Pipes](#pipes)
- [Templates](#templates)
- [Structural Directives](#structural-directives)
- [TypeScript Integration](#typescript-integration)

### Architecture and Modules (Level 3)

- [NgModules](#ngmodules)
- [Routing](#routing)
- [Forms](#forms)

### Performance and Testing (Level 4)

- [Change Detection and Performance](#change-detection-and-performance)
- [Lifecycle Hooks](#lifecycle-hooks)
- [Testing](#testing)

### Modern Angular (Level 5 - v14 to v17+)

- [Standalone Components](#standalone-components-v14)
- [Dependency Injection and inject Function](#dependency-injection-and-inject-function)
- [Signals](#signals-v16)
- [Control Flow Syntax](#control-flow-syntax-v17)
- [Deferrable Views](#deferrable-views-v17)
- [Modern Utilities](#modern-utilities-v16)

---

## Architecture

Angular applications are built as a tree of components with services providing shared logic. This section covers high-level patterns for structuring Angular applications.

### State Management with NgRx

#### Description

NgRx provides reactive state management for Angular applications using the Redux pattern. It centralizes application state and makes state mutations predictable through actions and reducers.

#### Interview Guidance

- **How to explain it:** "NgRx implements the Redux pattern for Angular. It centralizes shared state into a single store, makes mutations explicit via actions and reducers, and uses RxJS selectors to derive and subscribe to state slices."
- **Common follow-ups:**

| Question | Key Points |
| --- | --- |
| When would you use NgRx over a simple service? | Multiple components sharing complex state; need for undo/redo; time-travel debugging |
| What are the core NgRx building blocks? | Store, Actions, Reducers, Selectors, Effects |
| What are downsides of NgRx? | Boilerplate overhead, learning curve, overkill for small apps |

- **Difficulty:** Intermediate

> **Note:** For a detailed discussion on the problems NgRx solves, see [Victor Savkin's talk on managing state](https://www.youtube.com/watch?v=brCGZ8Lk-HY&t=1245s).

### Smart/Container vs Presentational Components

#### Description

This pattern separates components into two categories based on responsibility. It was popularized by Dan Abramov and is a foundational concept in component architecture.

| Aspect | Smart / Container | Dumb / Presentational |
| --- | --- | --- |
| Concern | How things work | How things look |
| Data | Provides data to children | Receives data via `@Input` |
| Events | Calls actions / services | Emits events via `@Output` |
| State | Usually stateful | Usually stateless |
| Reusability | Low (app-specific) | High (generic) |

#### Interview Guidance

- **How to explain it:** "Smart components manage data and business logic. Presentational components receive data through inputs and emit events through outputs. This separation improves reusability, testability, and maintainability."
- **Common follow-ups:**

| Question | Key Points |
| --- | --- |
| How does this relate to single responsibility? | Each component has one reason to change |
| Where do HTTP calls belong? | In services, called from smart components |
| Can a presentational component have child components? | Yes, it can compose other presentational components |

- **Difficulty:** Beginner

---

## Components

Components are the primary building blocks of Angular applications. Each component controls a section of the screen called a view.

### Minimum Component Definition

#### Syntax

```typescript
import { Component } from '@angular/core';

@Component({
  template: '<p>Minimal component</p>' // template or templateUrl required
})
export class MinimalComponent {}
```

#### Description

A component requires only the `@Component` decorator with a `template` or `templateUrl`. The constructor, selector, and styles are all optional.

| Property | Required | Notes |
| --- | --- | --- |
| `template` or `templateUrl` | Yes | One of the two must be present |
| `selector` | No | Can be accessed via router by class name |
| `constructor` | No | Auto-generated if omitted |
| `styles` / `styleUrls` | No | Defaults to none |

#### Interview Guidance

- **How to explain it:** "The only required part of a component is the `@Component` decorator with either a `template` or `templateUrl`. Everything else, including the selector and constructor, is optional."
- **Difficulty:** Beginner

### Component vs Directive

#### Description

Angular has three kinds of directives:

| Directive Type | Decorator | Has Template | Example |
| --- | --- | --- | --- |
| Component | `@Component` | Yes | Custom elements with views |
| Structural directive | `@Directive` | No | `*ngIf`, `*ngFor` — adds/removes DOM elements |
| Attribute directive | `@Directive` | No | `ngStyle`, `ngClass` — changes appearance/behavior |

A component is technically a directive with a template.

#### Interview Guidance

- **How to explain it:** "A component is a directive with a template. Structural directives modify the DOM layout by adding or removing elements. Attribute directives change the appearance or behavior of existing elements."
- **Difficulty:** Beginner

### Component Communication

#### Description

Components communicate through three primary mechanisms:

| Method | Use Case | Mechanism |
| --- | --- | --- |
| Parent to child | Pass data down | `@Input()` decorator |
| Child to parent | Emit events up | `@Output()` with `EventEmitter` |
| Unrelated components | Shared state | Services with dependency injection |
| Global state | Complex state management | Store pattern (NgRx) |

#### Example

```typescript
// Parent component template
// ✅ Passing data down and listening to events
<app-child [data]="parentData" (notify)="onNotify($event)"></app-child>

// Child component
@Component({ selector: 'app-child', template: '...' })
export class ChildComponent {
  @Input() data: string;
  @Output() notify = new EventEmitter<string>();

  sendEvent() {
    this.notify.emit('Hello from child');
  }
}
```

#### Interview Guidance

- **How to explain it:** "Parent-child communication uses `@Input` and `@Output`. For unrelated components, a shared service or state management library like NgRx handles communication."
- **Common follow-ups:**

| Question | Key Points |
| --- | --- |
| What if two sibling components need to share data? | Use a shared service with a Subject or BehaviorSubject |
| When would you choose NgRx over a shared service? | When state is complex, shared by many components, or needs time-travel debugging |

- **Difficulty:** Beginner

### Two-Way Data Binding

#### Syntax

```html
<!-- Shorthand (banana-in-a-box syntax) -->
<component [(title)]="name"></component>

<!-- Expanded equivalent -->
<component [title]="name" (titleChange)="name = $event"></component>

<!-- Special case for form controls -->
<input [(ngModel)]="userName">
```

#### Description

Two-way data binding combines property binding `[]` and event binding `()` into a single notation `[()]`. The convention requires the output event name to be the input name plus `Change` (e.g., `title` / `titleChange`).

#### Interview Guidance

- **How to explain it:** "Two-way binding uses the `[()]` syntax, which combines property binding and event binding. For custom components, the output must follow the `propertyNameChange` naming convention."
- **Difficulty:** Beginner

### Error Message Component Pattern

#### Description

A common pattern for displaying error messages throughout an application:

1. Create an `ErrorService` injected wherever errors need to be emitted
2. Create a `ToastContainerComponent` that subscribes to the service and manages toast lifecycle
3. Create a presentational `ToastComponent` that receives data via `@Input` and renders the toast
4. Place `ToastContainerComponent` in `AppComponent`

This follows the smart/presentational pattern: the container manages logic, the toast handles display.

#### Interview Guidance

- **How to explain it:** "I would create an ErrorService as a singleton, a container component that subscribes to errors and manages lifecycle, and a presentational toast component. The container lives in AppComponent."
- **Difficulty:** Intermediate

### Lean Components

#### Description

A lean component delegates all non-display concerns (data fetching, business logic, validation) to services, models, or store effects. Its sole purpose is rendering data and capturing user interactions.

This follows the single responsibility principle: the component has one reason to change (how it displays data).

#### Interview Guidance

- **How to explain it:** "A lean component only handles display logic. It delegates data fetching, business logic, and validation to services, keeping the component focused and testable."
- **Difficulty:** Beginner

### ViewChild vs ContentChild

#### Description

| Decorator | Queries | Defined In |
| --- | --- | --- |
| `@ViewChild()` | Elements in the component's own template | The component's `template` / `templateUrl` |
| `@ContentChild()` | Elements projected via `<ng-content>` | The parent component's template |

#### Interview Guidance

- **How to explain it:** "`@ViewChild` queries elements from the component's own template. `@ContentChild` queries elements that are projected into the component through `ng-content`."
- **Difficulty:** Intermediate

### HostBinding and HostListener

#### Syntax

```typescript
@HostBinding('class.valid') isValid: boolean;
```

#### Description

`@HostBinding` binds a host element property or CSS class to a component field. When `isValid` is `true`, the `valid` CSS class is added to the host element; when `false`, it is removed.

#### Example

```html
<!-- Async pipe with else template -->
<div *ngIf="someObservableData | async as data; else loading">
  {{ data }}
</div>

<ng-template #loading>
  Loading Data...
</ng-template>
```

This subscribes to an observable using the async pipe, assigns the result to the template variable `data`, and displays it. While the observable has not emitted, the `#loading` template is shown.

#### Interview Guidance

- **How to explain it:** "`@HostBinding` lets you bind properties or CSS classes on the host element declaratively. It keeps DOM manipulation inside the component metadata rather than using manual DOM access."
- **Difficulty:** Intermediate

### Renderer2 vs Native DOM Methods

#### Description

Using `Renderer2` methods instead of native element methods provides:

| Benefit | Explanation |
| --- | --- |
| Platform abstraction | Works in browser, server-side rendering, and web workers |
| Security | Built-in sanitization |
| Testability | Easier to mock in unit tests |
| Future-proof | Decoupled from browser-specific APIs |

#### Interview Guidance

- **How to explain it:** "Renderer2 provides an abstraction layer over the DOM, making code portable across platforms like SSR and web workers. It also improves security through built-in sanitization."
- **Difficulty:** Intermediate

### NgZone Service

#### Description

`NgZone` lets you run code inside or outside Angular's change detection zone. Common use cases:

- Run heavy computations outside the zone to avoid triggering change detection
- Integrate third-party libraries that conflict with zone-based change detection
- Re-enter the zone to trigger updates after external async work

#### Interview Guidance

- **How to explain it:** "NgZone controls when Angular runs change detection. Running code outside the zone with `runOutsideAngular` prevents unnecessary checks, improving performance for heavy operations."
- **Difficulty:** Advanced

---

## Services

Services encapsulate reusable logic, data access, and cross-component communication. They are singletons by default when provided at the root level.

### Purpose and Use Cases

#### Description

Services promote the DRY (Don't Repeat Yourself) principle by centralizing shared logic.

| Use Case | Example |
| --- | --- |
| Data access | HTTP calls, local storage |
| Business logic | Calculations, validation |
| Cross-component communication | Shared state via Subjects |
| Third-party integration | Analytics, logging |

#### Interview Guidance

- **How to explain it:** "Services centralize reusable logic like data access, business rules, and cross-component communication. They follow DRY by providing a single source of truth for shared functionality."
- **Difficulty:** Beginner

### Service Injection

#### Description

Services can be provided at two levels:

| Scope | How | Instance Behavior |
| --- | --- | --- |
| Application-wide | `providedIn: 'root'` or root module `providers` | Single shared instance |
| Component-level | Component `providers` array | New instance per component |

To inject a service into another service, annotate the target with `@Injectable()`.

#### Example

```typescript
@Injectable()
export class MessageService {
  // ErrorService injected via constructor
  constructor(private errorService: ErrorService) {}
}
```

#### Interview Guidance

- **How to explain it:** "Services are injected through Angular's DI system. Application-level providers create a singleton, while component-level providers create an instance scoped to that component and its children."
- **Difficulty:** Beginner

### Why Not Instantiate Services Manually

#### Description

Creating a service with `new DataService()` is problematic:

```typescript
// ❌ Manual instantiation — avoid
let service = new DataService();
```

| Problem | Explanation |
| --- | --- |
| Tight coupling | Component must know constructor details; changes break all call sites |
| No caching / sharing | Each call creates a new instance; shared state is impossible |
| No substitution | Cannot swap implementations for testing, offline mode, or mocking |

Using Angular's DI system solves all three problems by delegating instantiation and lifecycle management to the framework.

#### Interview Guidance

- **How to explain it:** "Manual instantiation couples the component to the service implementation, prevents shared state, and makes testing difficult. Angular DI manages instance creation, sharing, and substitution."
- **Difficulty:** Beginner

---

## NgModules

NgModules organize an Angular application into cohesive blocks of functionality. They control compilation context, dependency injection scope, and lazy loading boundaries.

### Purpose of NgModule

#### Description

NgModules group related components, directives, pipes, and services so they can be imported together. Without modules, each component would need to independently import all of its dependencies.

#### Interview Guidance

- **How to explain it:** "NgModules organize components, directives, and services into logical units. They define the compilation context and dependency injection scope for a group of related features."
- **Difficulty:** Beginner

### When to Create a New NgModule

#### Description

Create a new module when:

- A feature represents a distinct area of the application (e.g., Admin, Dashboard, Orders)
- You want to lazy load a feature on demand
- You need to encapsulate a set of related components that can be imported as a unit

#### Interview Guidance

- **How to explain it:** "Create a new module for each discrete feature area. This enables lazy loading, encapsulation, and cleaner dependency management."
- **Difficulty:** Intermediate

### forRoot vs forChild

#### Description

Some modules (like `RouterModule`) provide both services and declarables. To prevent duplicate service instances in lazy-loaded modules, the `forRoot` / `forChild` pattern is used.

| Method | Called By | Provides |
| --- | --- | --- |
| `forRoot()` | Root module (`AppModule`) only | Directives + Services |
| `forChild()` | Feature modules | Directives only (reuses root services) |

#### Example

```typescript
@NgModule({
  declarations: [MyAwesomeComponent, MyCoolDirective],
  exports: [MyAwesomeComponent, MyCoolDirective]
})
export class MyAwesomeModule {
  static forRoot(): ModuleWithProviders<MyAwesomeModule> {
    return {
      ngModule: MyAwesomeModule,
      providers: [MyBrilliantService]
    };
  }
}
```

#### Interview Guidance

- **How to explain it:** "`forRoot` registers both directives and services and should only be called in the root module. `forChild` registers only directives, reusing the services already provided at the root level."
- **Common follow-ups:**

| Question | Key Points |
| --- | --- |
| Why not just put services in every module? | Lazy-loaded modules create child injectors, producing duplicate service instances |
| Which Angular module uses this pattern? | `RouterModule` is the canonical example |

- **Difficulty:** Intermediate

### providedIn Property

#### Description

`providedIn` specifies where a service should be registered. The most common value is `'root'`, which makes the service available application-wide. You can also scope a service to a specific module.

#### Example

```typescript
import { Injectable } from '@angular/core';
import { UserModule } from './user.module';

@Injectable({
  providedIn: UserModule // only available if UserModule is imported
})
export class UserService {}
```

> **Note:** See the [Angular providers guide](https://angular.io/guide/providers#providedin-and-ngmodules) for details.

#### Interview Guidance

- **How to explain it:** "`providedIn` declares where a service is registered at the decorator level. Using `'root'` creates an application-wide singleton. Scoping to a module restricts availability."
- **Difficulty:** Intermediate

### Shared Module

#### Description

A shared module contains components, directives, and pipes used across multiple feature modules. It re-exports them so importing modules get everything at once.

| Put in SharedModule | Do NOT put in SharedModule |
| --- | --- |
| Common UI components | Services (especially singletons) |
| Common pipes | Feature-specific components |
| Common directives | Components only used once |

> **Warning:** If a shared module provides a service and is imported by a lazy-loaded module, Angular creates a second service instance in the child injector. This leads to inconsistent state.

#### Interview Guidance

- **How to explain it:** "A shared module exports reusable components, directives, and pipes. Services should not be in shared modules because lazy-loaded imports would create duplicate instances."
- **Difficulty:** Intermediate

### Core Module for Singletons

#### Description

Create a `CoreModule` for singleton services that must have exactly one instance across the entire application. Import it only in `AppModule`.

This ensures that even lazy-loaded modules use the same service instance, because the root injector provides it.

#### Interview Guidance

- **How to explain it:** "A CoreModule provides singleton services and is imported only in AppModule. This guarantees a single instance, even when lazy-loaded modules are involved."
- **Difficulty:** Intermediate

### Exports in NgModule

#### Description

The `exports` array determines which declarations (components, directives, pipes) and modules are available to other modules that import this module. Items not in `exports` remain internal.

#### Interview Guidance

- **How to explain it:** "The `exports` array controls what is visible to importing modules. Anything not exported stays internal to the declaring module."
- **Difficulty:** Beginner

### SharedModule and Lazy-Loaded Modules

#### Description

When a lazy-loaded module imports a SharedModule that provides a service, Angular creates a child injector for the lazy module. The service registered in that child injector is a separate instance from the one in the root injector.

This means eagerly loaded components and lazy-loaded components receive different service instances, leading to state inconsistencies.

> **Note:** See the [Angular NgModule FAQ](https://angular.io/docs/ts/latest/cookbook/ngmodule-faq.html#!#q-what-to-export) for details.

#### Interview Guidance

- **How to explain it:** "Lazy-loaded modules get their own child injector. If a shared module provides a service, the lazy module creates a new instance instead of reusing the root one. This causes state bugs."
- **Difficulty:** Advanced

---

## Routing

The Angular Router maps URLs to components, manages navigation, and enables lazy loading of feature modules.

### RouterModule.forRoot vs forChild

#### Description

| Method | Purpose | Service Inclusion |
| --- | --- | --- |
| `RouterModule.forRoot(routes)` | Configures the router at the application root | Yes (Router, ActivatedRoute, etc.) |
| `RouterModule.forChild(routes)` | Registers additional routes in feature modules | No (reuses root Router service) |

Having multiple `Router` service instances would corrupt the global `Location` object, so only `forRoot` provides the service.

#### Interview Guidance

- **How to explain it:** "`forRoot` configures the router service and root routes in AppModule. `forChild` registers additional routes in feature modules without creating a second router instance."
- **Difficulty:** Intermediate

### loadChildren and Lazy Loading

#### Description

`loadChildren` tells the router to lazy-load a module bundle only when the user navigates to the corresponding path.

#### Syntax

```typescript
// Module-based lazy loading (Angular 9+)
{
  path: 'edit',
  loadChildren: () => import('./edit/edit.module').then(m => m.EditModule)
}

// Standalone component lazy loading (Angular 14+, preferred)
{
  path: 'edit',
  loadComponent: () => import('./edit/edit.component').then(m => m.EditComponent)
}
```

> **Warning:** The old string-based syntax (`'app/edit/edit.module#EditModule'`) was deprecated in Angular 9 and removed in Angular 17+. Always use dynamic imports.

Key behaviors:
- The module bundle is fetched only on first navigation to the route
- The router merges lazy module routes into the main configuration
- Subsequent navigations use the cached bundle

#### Interview Guidance

- **How to explain it:** "`loadChildren` uses dynamic imports to fetch a module bundle on demand. The bundle is loaded once on first navigation and cached for subsequent visits."
- **Common follow-ups:**

| Question | Key Points |
| --- | --- |
| What is `loadComponent`? | Lazy-loads a standalone component directly, without a module |
| How do you preload lazy modules? | Use `PreloadAllModules` or a custom `PreloadingStrategy` |

- **Difficulty:** Intermediate

### Routing Module Purpose

#### Description

A dedicated routing module separates routing configuration from feature logic.

| Benefit | Explanation |
| --- | --- |
| Separation of concerns | Routes live apart from feature declarations |
| Testability | Routing can be tested or replaced independently |
| Centralized guards/resolvers | Route-specific providers in one place |

The root routing module passes routes to `RouterModule.forRoot()` and re-exports `RouterModule`.

#### Interview Guidance

- **How to explain it:** "A routing module separates route configuration from feature logic. It centralizes guards, resolvers, and route definitions, making the feature module cleaner and easier to test."
- **Difficulty:** Beginner

### Lazy Loading Behavior

#### Description

A lazy-loaded module is fetched only when the user navigates to a route that references it via `loadChildren`. On first navigation:

1. The router fetches the module bundle over the network
2. The module's routes are merged into the router configuration
3. The requested route is activated

On subsequent navigations to the same lazy route, the cached module is used immediately.

> **Note:** Remove lazy-loaded modules from eager `imports` arrays. Including them in both places defeats the purpose of lazy loading.

#### Interview Guidance

- **How to explain it:** "Lazy modules are loaded on first navigation and cached afterward. They must not appear in eager imports, or the bundle will be included in the initial load."
- **Difficulty:** Intermediate

### RouterLink Usage

#### Description

A plain string `routerLink` navigates to a static path. To include dynamic segments, use the Link Parameters Array with property binding.

```html
<!-- ❌ Incorrect: treats "product.id" as a literal string -->
<div routerLink="product.id"></div>

<!-- ✅ Correct: uses Link Parameters Array -->
<div [routerLink]="['/product', product.id]"></div>
```

The second form works when the route configuration includes a parameterized path like `product/:id`.

#### Interview Guidance

- **How to explain it:** "For dynamic route parameters, use the Link Parameters Array syntax with property binding: `[routerLink]=\"['/product', product.id]\"`. A plain string `routerLink` is only for static paths."
- **Difficulty:** Beginner

### ActivatedRoute vs RouterState

#### Description

| Concept | Description |
| --- | --- |
| `ActivatedRoute` | Represents the route associated with a specific loaded component; provides access to route params, query params, data, and URL segments |
| `RouterState` | A tree of all `ActivatedRoute` objects representing the current state of the router |

After each successful navigation, the router builds a tree of `ActivatedRoute` objects. Access the current `RouterState` via `Router.routerState`.

#### Interview Guidance

- **How to explain it:** "`ActivatedRoute` represents one node in the route tree. `RouterState` is the entire tree of active routes after a navigation completes."
- **Difficulty:** Intermediate

---

## Observables and RxJS

RxJS Observables are the foundation of Angular's asynchronous programming model. They are used in HTTP, forms, routing, and event handling.

### Observable vs Promise

#### Description

| Feature | Observable | Promise |
| --- | --- | --- |
| Values | Emits multiple values over time | Resolves a single value |
| Execution | Lazy (nothing happens until subscribed) | Eager (executes immediately) |
| Cancellation | Cancellable via `unsubscribe()` | Not cancellable |
| Retry | Built-in operators (`retry`, `retryWhen`) | Requires wrapping the original call |
| Teardown | Can define cleanup logic | No built-in teardown |
| Operators | Rich operator library (map, filter, merge, etc.) | `.then()` / `.catch()` chaining |

#### Interview Guidance

- **How to explain it:** "Observables emit multiple values over time, are lazy, cancellable, and support retry. Promises resolve once, execute eagerly, and cannot be cancelled."
- **Difficulty:** Beginner

### scan vs reduce

#### Description

Both operators accumulate values, but they differ in when they emit:

| Operator | Emits | Output |
| --- | --- | --- |
| `scan` | After each source emission | Running accumulation |
| `reduce` | Once, when source completes | Final accumulated value |

#### Example

```typescript
import { from } from 'rxjs';
import { scan, reduce } from 'rxjs/operators';

const source$ = from([1, 2, 3, 4, 5, 6]);

source$.pipe(scan((acc, val) => acc + val, 0))
  .subscribe(x => console.log('scan:', x));
// scan: 1, 3, 6, 10, 15, 21

source$.pipe(reduce((acc, val) => acc + val, 0))
  .subscribe(x => console.log('reduce:', x));
// reduce: 21
```

#### Interview Guidance

- **How to explain it:** "`scan` emits the running total after each value. `reduce` emits only the final total once the source completes. `scan` is like a live accumulator; `reduce` is like `Array.reduce`."
- **Difficulty:** Intermediate

---

## Pipes

Pipes transform data in templates. Angular provides built-in pipes and supports custom pipes.

### Pure Pipes

#### Description

A pure pipe executes only when Angular detects a pure change to the input value (a new primitive value or a new object reference). Pure pipes are:

- Deterministic: same input always produces same output
- Side-effect free
- Efficient: Angular skips re-evaluation when inputs have not changed

#### Interview Guidance

- **How to explain it:** "A pure pipe only runs when its input reference changes. It is deterministic and side-effect free, making it efficient and easy to test."
- **Difficulty:** Beginner

### Async Pipe

#### Description

The `async` pipe subscribes to an Observable or Promise and returns the latest emitted value. Key behaviors:

- Marks the component for change detection on each new value
- Automatically unsubscribes when the component is destroyed, preventing memory leaks
- Returns `null` until the first value is emitted

#### Interview Guidance

- **How to explain it:** "The async pipe subscribes to an Observable or Promise in the template, returns the latest value, and automatically unsubscribes on component destruction."
- **Common follow-ups:**

| Question | Key Points |
| --- | --- |
| How does it prevent memory leaks? | It tracks the component lifecycle and unsubscribes on destroy |
| What if you use it multiple times on the same observable? | Each usage creates a separate subscription; use `as` syntax or `shareReplay` to avoid duplicates |

- **Difficulty:** Beginner

### Pure vs Impure Pipes

#### Comparison

| Aspect | Pure Pipe | Impure Pipe |
| --- | --- | --- |
| Execution trigger | Input reference changes | Every change detection cycle |
| Deterministic | Yes | Not guaranteed |
| Shareable | Yes, no side effects | No, internal state may leak |
| Performance | Efficient (skips unnecessary runs) | Can be expensive |
| Declaration | `pure: true` (default) | `pure: false` |

#### Interview Guidance

- **How to explain it:** "Pure pipes run only when the input reference changes and are deterministic. Impure pipes run on every change detection cycle and may have internal state, making them less predictable and performant."
- **Difficulty:** Intermediate

---

## Templates

Angular templates combine HTML with Angular-specific syntax for data binding, directives, and expressions.

### Template Variables

#### Description

Template variables reference DOM elements, components, or directives within a template. They are declared with the `#` symbol or the `ref-` prefix.

#### Example

```html
<input #myInput type="text">
<button (click)="logValue(myInput.value)">Log Value</button>
```

`#myInput` creates a reference to the `<input>` element, making its properties (like `.value`) available elsewhere in the template.

#### Interview Guidance

- **How to explain it:** "Template variables use the `#` syntax to create references to DOM elements or component instances within the template, allowing other elements to access their properties."
- **Difficulty:** Beginner

### Multiple Async Pipe Subscriptions

#### Description

Each `async` pipe usage creates a separate subscription. To avoid duplicate subscriptions on the same observable, use the `as` syntax:

```html
<!-- ✅ Single subscription, reusable variable -->
<div *ngIf="someObservableData | async as data">
  {{ data }}
</div>
```

This stores the resolved value in `data` and creates only one subscription.

#### Interview Guidance

- **How to explain it:** "Each async pipe creates its own subscription. Use the `as` syntax to subscribe once and reuse the value across the template."
- **Difficulty:** Intermediate

### Attributes vs Properties in Data Binding

#### Description

Angular data bindings work with DOM properties, not HTML attributes.

| Concept | Role | Example |
| --- | --- | --- |
| HTML attribute | Initializes the element | `<input value="initial">` |
| DOM property | Current runtime state | `inputElement.value` changes with user input |

After initialization, Angular interacts only with properties and events. The attribute's role ends at initialization.

> **Note:** See the [Angular template syntax guide](https://next.angular.io/guide/template-syntax#html-attribute-vs-dom-property) for details.

#### Interview Guidance

- **How to explain it:** "HTML attributes initialize elements; DOM properties represent current state. Angular data binding always works with DOM properties, not HTML attributes."
- **Difficulty:** Intermediate

### When to Omit Brackets in Bindings

#### Description

Omit brackets when all three conditions are met:

1. The target property accepts a string value
2. The string is a fixed value that can be baked into the template
3. The value never changes

> **Note:** See the [Angular template syntax guide](https://next.angular.io/guide/template-syntax#one-time-string-initialization) for details.

#### Interview Guidance

- **How to explain it:** "You can omit brackets for one-time string initialization: the property must accept a string, the value must be fixed, and it must never change at runtime."
- **Difficulty:** Beginner

---

## Structural Directives

Structural directives reshape the DOM by adding, removing, or manipulating elements. They are identified by the `*` prefix in templates.

### Identifying Structural Directives

#### Description

Structural directives are recognized by the asterisk (`*`) before the directive name.

```html
<p *ngIf="isVisible">Visible content</p>
<div *ngFor="let item of items">{{ item }}</div>
```

The `*` is syntactic sugar that Angular expands into an `<ng-template>` wrapper.

#### Interview Guidance

- **How to explain it:** "Structural directives are prefixed with `*` in templates. The asterisk is syntactic sugar for wrapping the element in an `ng-template`."
- **Difficulty:** Beginner

### Hiding vs Removing Elements

#### Description

When building custom structural directives, the choice between hiding (`display: none`) and removing (`*ngIf`) affects performance and behavior.

| Approach | Pros | Cons |
| --- | --- | --- |
| Hiding (CSS) | Fast toggle, preserves component state | Component keeps running, consuming resources |
| Removing (structural directive) | Frees resources, stops event listeners | Re-creation cost, state lost |

**Guideline:** Prefer removing elements unless preserving state or avoiding re-initialization cost is critical. Hidden components continue listening to events, running change detection, and holding memory.

#### Interview Guidance

- **How to explain it:** "Hiding keeps the component alive but wastes resources. Removing frees resources but loses state. Prefer removing unless re-initialization is expensive or state must persist."
- **Difficulty:** Intermediate

---

## TypeScript Integration

Angular is built on TypeScript. Understanding TypeScript features is essential for effective Angular development.

### Type Definitions

#### Description

Type definitions (`.d.ts` files) provide type information for JavaScript libraries that lack built-in types. They enable TypeScript's type checking, IntelliSense, and IDE features for external libraries.

#### Interview Guidance

- **How to explain it:** "Type definitions provide TypeScript type information for JavaScript libraries, enabling compile-time type checking and IDE support."
- **Difficulty:** Beginner

### Interface vs Class

#### Description

| Aspect | Interface | Class |
| --- | --- | --- |
| Purpose | Defines a contract / shape | Defines structure and implementation |
| Runtime existence | Erased at compile time | Exists at runtime |
| Instantiation | Cannot be instantiated | Can be instantiated with `new` |
| Methods | Signatures only | Full implementations |
| Use in Angular | Type checking, DI tokens (with `InjectionToken`) | Services, components, directives |

#### Interview Guidance

- **How to explain it:** "Interfaces define contracts and are erased at compile time. Classes define both structure and implementation and exist at runtime. Use interfaces for type checking, classes for instantiable objects."
- **Difficulty:** Beginner

### Generics

#### Description

TypeScript generics capture and reuse a type provided by the caller, maintaining type safety throughout a function, class, or interface.

#### Example

```typescript
function identity<T>(arg: T): T {
  return arg;
}

const result = identity<string>('hello'); // type is string
const inferred = identity(42);            // type is number (inferred)
```

> **Note:** See the [TypeScript Generics handbook](https://www.typescriptlang.org/docs/handbook/generics.html) for details.

#### Interview Guidance

- **How to explain it:** "Generics let you write reusable, type-safe code by capturing the type the caller provides. The type flows through the function, preserving safety without hardcoding a specific type."
- **Difficulty:** Beginner

---

## Change Detection and Performance

Change detection is the mechanism Angular uses to keep the DOM in sync with component data. Understanding it is critical for building performant applications.

### How Change Detection Works

#### Description

Angular's change detection cycle:

1. An asynchronous event occurs (user input, HTTP response, timer)
2. Zone.js intercepts the event and notifies Angular
3. Angular runs change detection from the root component downward
4. For each component, Angular compares current binding values with previous values
5. Changed values trigger DOM updates

#### Interview Guidance

- **How to explain it:** "Angular uses Zone.js to detect async events. After each event, it walks the component tree top-down, comparing binding values and updating the DOM where values changed."
- **Difficulty:** Intermediate

### Change Detection Strategies

#### Description

| Strategy | Behavior | When Checked |
| --- | --- | --- |
| `Default` | Checks every component on every cycle | Always |
| `OnPush` | Skips component unless triggered | Input reference changes, events from component/children, async pipe emission, manual `markForCheck()` |

#### Example

```typescript
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-user',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div>{{ user.name }}</div>`
})
export class UserComponent {
  @Input() user!: User;
}
```

#### Interview Guidance

- **How to explain it:** "The Default strategy checks every component on every cycle. OnPush only checks when inputs change by reference, events originate from the component, async pipe emits, or `markForCheck()` is called."
- **Common follow-ups:**

| Question | Key Points |
| --- | --- |
| When should you use OnPush? | Presentational components, components with immutable inputs, performance-critical views |
| What happens if you mutate an object in an OnPush component? | The change is not detected; you must create a new reference or call `markForCheck()` |

- **Difficulty:** Advanced

### Manual Change Detection

#### Description

`ChangeDetectorRef` provides methods to control change detection manually.

| Method | Effect |
| --- | --- |
| `detectChanges()` | Runs change detection for this component and children immediately |
| `markForCheck()` | Marks the component (and ancestors) to be checked in the next cycle |
| `detach()` | Removes the component from the change detection tree |
| `reattach()` | Re-adds the component to the change detection tree |

#### Example

```typescript
import { Component, ChangeDetectorRef } from '@angular/core';

@Component({ selector: 'app-manual', template: '...' })
export class ManualComponent {
  constructor(private cdr: ChangeDetectorRef) {}

  updateView() {
    this.cdr.detectChanges();  // immediate check
    this.cdr.markForCheck();   // schedule check for next cycle
  }
}
```

#### Interview Guidance

- **How to explain it:** "`ChangeDetectorRef` gives manual control. `detectChanges` runs immediately; `markForCheck` schedules for next cycle; `detach` removes from the tree entirely."
- **Difficulty:** Advanced

### Zone.js

#### Description

Zone.js is a library that monkey-patches asynchronous browser APIs (`setTimeout`, `addEventListener`, `Promise`, etc.) to create execution contexts called zones. Angular uses Zone.js to:

- Know when async operations complete
- Trigger change detection after those operations
- Track outstanding async tasks

In modern Angular with Signals, applications can run without Zone.js using `provideExperimentalZonelessChangeDetection()`.

#### Interview Guidance

- **How to explain it:** "Zone.js patches async APIs so Angular knows when to run change detection. With Signals, Angular can operate without Zone.js using fine-grained reactivity instead."
- **Difficulty:** Advanced

### trackBy in ngFor

#### Description

Without `trackBy`, Angular re-renders the entire list when the array reference changes. With `trackBy`, Angular identifies items by a unique key and only re-renders changed items.

#### Example

```html
<div *ngFor="let item of items; trackBy: trackByFn">
  {{ item.name }}
</div>
```

```typescript
trackByFn(index: number, item: Item): number {
  return item.id; // unique identifier
}
```

| Without trackBy | With trackBy |
| --- | --- |
| Re-renders all DOM elements | Re-renders only changed elements |
| Loses component state | Preserves component state |
| More DOM operations | Fewer DOM operations |

> **Note:** In the new control flow syntax (v17+), `track` is required in `@for` blocks.

#### Interview Guidance

- **How to explain it:** "`trackBy` provides a unique identifier so Angular can reuse existing DOM elements when the list changes, instead of re-rendering everything."
- **Difficulty:** Intermediate

### Performance Optimization Techniques

#### Description

| Technique | Implementation |
| --- | --- |
| OnPush change detection | `changeDetection: ChangeDetectionStrategy.OnPush` |
| Lazy loading | `loadChildren` / `loadComponent` in route config |
| Virtual scrolling | `<cdk-virtual-scroll-viewport>` from CDK |
| Pure pipes | `@Pipe({ pure: true })` (default) |
| Unsubscribe from Observables | `takeUntilDestroyed()`, manual `unsubscribe()`, or async pipe |
| trackBy | `*ngFor="...; trackBy: fn"` or `track` in `@for` |
| Route preloading | `preloadingStrategy: PreloadAllModules` |
| AOT compilation | Default since Angular 9; catches template errors early, smaller bundles |

#### Interview Guidance

- **How to explain it:** "Key optimizations include OnPush change detection, lazy loading routes, virtual scrolling for large lists, pure pipes, proper Observable cleanup, and AOT compilation."
- **Difficulty:** Intermediate

---

## Lifecycle Hooks

Angular calls lifecycle hook methods at specific moments in a component's creation, rendering, and destruction sequence.

### Hook Execution Order

#### Description

Hooks execute in this order on every component:

| Order | Hook | Trigger |
| --- | --- | --- |
| 1 | `constructor()` | Class instantiation (not a hook, but runs first) |
| 2 | `ngOnChanges()` | Input property changes (before `ngOnInit`) |
| 3 | `ngOnInit()` | After first `ngOnChanges` |
| 4 | `ngDoCheck()` | Every change detection run |
| 5 | `ngAfterContentInit()` | After projected content initialized |
| 6 | `ngAfterContentChecked()` | After every check of projected content |
| 7 | `ngAfterViewInit()` | After component views initialized |
| 8 | `ngAfterViewChecked()` | After every check of component views |
| 9 | `ngOnDestroy()` | Before component destruction |

#### Interview Guidance

- **How to explain it:** "Angular hooks run in a defined order: `ngOnChanges` first (for input changes), then `ngOnInit`, content hooks, view hooks, and finally `ngOnDestroy` for cleanup."
- **Difficulty:** Intermediate

### constructor vs ngOnInit

#### Description

| Aspect | `constructor()` | `ngOnInit()` |
| --- | --- | --- |
| Origin | TypeScript / JavaScript | Angular lifecycle hook |
| Timing | At class instantiation | After first `ngOnChanges` |
| Inputs available | No | Yes |
| Use for | Dependency injection | Initialization logic, API calls |

#### Example

```typescript
export class MyComponent implements OnInit {
  @Input() data!: string;

  constructor(private service: DataService) {
    console.log(this.data); // undefined
  }

  ngOnInit() {
    console.log(this.data); // available
    this.service.load(this.data);
  }
}
```

#### Interview Guidance

- **How to explain it:** "The constructor handles dependency injection and runs before Angular sets inputs. `ngOnInit` runs after inputs are bound and is the right place for initialization logic."
- **Difficulty:** Beginner

### ngOnChanges

#### Description

`ngOnChanges` is called when any `@Input` property value changes. It receives a `SimpleChanges` object mapping each changed input to its previous and current values.

#### Example

```typescript
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({ selector: 'app-user', template: '...' })
export class UserComponent implements OnChanges {
  @Input() userId!: string;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userId'] && !changes['userId'].firstChange) {
      this.loadUser(changes['userId'].currentValue);
    }
  }
}
```

#### Interview Guidance

- **How to explain it:** "`ngOnChanges` fires on every input change and provides both previous and current values through `SimpleChanges`. Use it to react to input changes, especially when comparing values."
- **Difficulty:** Intermediate

### ngOnDestroy

#### Description

`ngOnDestroy` is called just before Angular destroys a component. Use it for cleanup:

- Unsubscribe from Observables
- Detach event handlers
- Clear timers and intervals
- Release custom resources

#### Example

```typescript
export class DataComponent implements OnDestroy {
  private subscription: Subscription;
  private intervalId: ReturnType<typeof setInterval>;

  constructor(private dataService: DataService) {
    this.subscription = this.dataService.getData().subscribe();
    this.intervalId = setInterval(() => {}, 1000);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    clearInterval(this.intervalId);
  }
}
```

#### Interview Guidance

- **How to explain it:** "`ngOnDestroy` is the cleanup hook. Use it to unsubscribe from Observables, clear intervals, and release any resources the component acquired."
- **Difficulty:** Beginner

### ngAfterViewInit

#### Description

`ngAfterViewInit` is called once after Angular initializes the component's view and child views. Use it to:

- Access `@ViewChild` / `@ViewChildren` references
- Initialize DOM-dependent third-party libraries
- Perform measurements or layout calculations

#### Example

```typescript
export class ChartComponent implements AfterViewInit {
  @ViewChild('chartCanvas') canvas!: ElementRef;

  ngAfterViewInit() {
    // canvas is now available
    this.initializeChart(this.canvas.nativeElement);
  }
}
```

> **Warning:** Avoid changing data-bound properties in `ngAfterViewInit` synchronously. This causes an `ExpressionChangedAfterItHasBeenCheckedError` in development mode.

#### Interview Guidance

- **How to explain it:** "`ngAfterViewInit` fires after the view is fully initialized. It is the earliest hook where `@ViewChild` references are guaranteed to be available."
- **Difficulty:** Intermediate

---

## Forms

Angular provides two approaches to handling user input through forms, each with different trade-offs.

### Template-Driven vs Reactive Forms

#### Comparison

| Aspect | Template-Driven | Reactive |
| --- | --- | --- |
| Logic location | Template (directives) | Component (TypeScript) |
| Data binding | Two-way with `[(ngModel)]` | `FormControl` / `FormGroup` |
| Complexity | Simple forms | Complex forms |
| Validation | Directive-based | Function-based |
| Testability | Harder (depends on DOM) | Easier (pure TypeScript) |
| Data model | Mutable | Immutable |

#### Example

```typescript
// Reactive form
export class UserComponent {
  userForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.minLength(8))
  });

  onSubmit() {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
    }
  }
}
```

```html
<!-- Template-driven form -->
<form #form="ngForm" (ngSubmit)="onSubmit(form)">
  <input name="email" [(ngModel)]="user.email" required>
  <button type="submit">Submit</button>
</form>

<!-- Reactive form -->
<form [formGroup]="userForm" (ngSubmit)="onSubmit()">
  <input formControlName="email">
  <input formControlName="password" type="password">
  <button type="submit">Submit</button>
</form>
```

#### Interview Guidance

- **How to explain it:** "Template-driven forms use directives and two-way binding for simple scenarios. Reactive forms define form logic in TypeScript using FormControl/FormGroup, offering more control, testability, and immutability."
- **Difficulty:** Intermediate

### FormBuilder

#### Description

`FormBuilder` provides shorthand methods for creating `FormControl`, `FormGroup`, and `FormArray` instances.

#### Example

```typescript
// ❌ Without FormBuilder
userForm = new FormGroup({
  name: new FormControl(''),
  email: new FormControl('', [Validators.required])
});

// ✅ With FormBuilder
constructor(private fb: FormBuilder) {}

userForm = this.fb.group({
  name: [''],
  email: ['', Validators.required]
});
```

#### Interview Guidance

- **How to explain it:** "FormBuilder reduces boilerplate for creating reactive form controls. It provides a cleaner, more concise syntax for defining form structures."
- **Difficulty:** Beginner

### Form Control States

#### Description

| State | Meaning | Opposite |
| --- | --- | --- |
| `pristine` | Value has not been changed by the user | `dirty` |
| `dirty` | Value has been changed by the user | `pristine` |
| `touched` | Control has been focused and blurred | `untouched` |
| `untouched` | Control has not been visited | `touched` |
| `valid` | All validators pass | `invalid` |

#### Example

```html
<input formControlName="email">
<div *ngIf="userForm.get('email')?.invalid && userForm.get('email')?.touched">
  Email is required
</div>
```

#### Interview Guidance

- **How to explain it:** "`pristine`/`dirty` tracks value changes. `touched`/`untouched` tracks focus interaction. These states control when validation messages appear."
- **Difficulty:** Beginner

### Custom Validators

#### Description

Custom validators are functions that receive an `AbstractControl` and return a `ValidationErrors` object or `null`.

#### Example

```typescript
// Synchronous validator
function forbiddenNameValidator(forbidden: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return control.value === forbidden
      ? { forbiddenName: { value: control.value } }
      : null;
  };
}

// Async validator (e.g., check server-side availability)
function emailAvailableValidator(service: UserService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return service.checkEmail(control.value).pipe(
      map(available => available ? null : { emailTaken: true }),
      catchError(() => of(null))
    );
  };
}
```

```typescript
// Usage
this.userForm = this.fb.group({
  name: ['', [Validators.required, forbiddenNameValidator('admin')]],
  email: ['', [Validators.required], [emailAvailableValidator(this.userService)]]
});
```

> **Note:** Async validators are passed as the third argument to `FormControl`. They run only after all synchronous validators pass.

#### Interview Guidance

- **How to explain it:** "Custom validators are functions that take a control and return an error object or null. Async validators return an Observable and are useful for server-side checks."
- **Difficulty:** Intermediate

---

## Testing

Angular supports unit testing with Jasmine/Karma and end-to-end testing with tools like Cypress and Playwright.

### Types of Tests

#### Description

| Type | Scope | Tools | Speed |
| --- | --- | --- | --- |
| Unit | Individual components, services, pipes | Jasmine, Karma, Jest | Fast |
| Integration | Component interactions, module integration | TestBed | Medium |
| End-to-End (E2E) | Full user workflows | Cypress, Playwright | Slow |

#### Interview Guidance

- **How to explain it:** "Unit tests verify isolated units like services and pipes. Integration tests verify component interactions using TestBed. E2E tests verify full user workflows in a real browser."
- **Difficulty:** Beginner

### Testing Components with Dependencies

#### Description

Use `TestBed` to configure a testing module and provide mock dependencies.

#### Example

```typescript
describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    mockUserService = jasmine.createSpyObj('UserService', ['getUser']);

    TestBed.configureTestingModule({
      declarations: [UserComponent],
      providers: [{ provide: UserService, useValue: mockUserService }]
    });

    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
  });

  it('should load user on init', () => {
    const mockUser = { id: 1, name: 'John' };
    mockUserService.getUser.and.returnValue(of(mockUser));

    component.ngOnInit();

    expect(component.user).toEqual(mockUser);
    expect(mockUserService.getUser).toHaveBeenCalled();
  });
});
```

#### Interview Guidance

- **How to explain it:** "Use `TestBed.configureTestingModule` to set up a testing context. Replace real services with mocks or spies to isolate the component under test."
- **Difficulty:** Intermediate

### async vs fakeAsync

#### Description

| Utility | Execution | Time Control | Use Case |
| --- | --- | --- | --- |
| `waitForAsync` (formerly `async`) | Real async zone | No (`fixture.whenStable`) | Real async operations |
| `fakeAsync` | Fake async zone | Yes (`tick()`, `flush()`) | Controlled timing, debounce testing |

#### Example

```typescript
// waitForAsync
it('should load data', waitForAsync(() => {
  component.loadData();
  fixture.whenStable().then(() => {
    expect(component.data).toBeDefined();
  });
}));

// fakeAsync
it('should debounce input', fakeAsync(() => {
  component.searchTerm = 'test';
  tick(300); // advance time by 300ms
  expect(mockService.search).toHaveBeenCalledWith('test');
}));
```

#### Interview Guidance

- **How to explain it:** "`waitForAsync` runs in a real async zone and waits for stability. `fakeAsync` creates a fake zone where you control time with `tick()`, making it ideal for testing debounce, delays, and timers."
- **Difficulty:** Advanced

### Testing Observables

#### Example

```typescript
// Using done callback
it('should handle observable data', (done) => {
  mockService.getData.and.returnValue(of([{ id: 1, name: 'Test' }]));
  component.loadData();

  component.data$.subscribe(data => {
    expect(data).toEqual([{ id: 1, name: 'Test' }]);
    done(); // signal test completion
  });
});

// Using fakeAsync
it('should handle observable data', fakeAsync(() => {
  mockService.getData.and.returnValue(of([{ id: 1, name: 'Test' }]));
  component.loadData();
  tick();

  expect(component.data).toEqual([{ id: 1, name: 'Test' }]);
}));
```

#### Interview Guidance

- **How to explain it:** "Test Observables by subscribing and using `done` for async completion, or use `fakeAsync` with `tick()` for synchronous-style testing. Mock services to return `of()` for immediate values."
- **Difficulty:** Intermediate

### Testing Template Interactions

#### Example

```typescript
it('should update name on button click', () => {
  const button = fixture.nativeElement.querySelector('button');
  const input = fixture.nativeElement.querySelector('input');

  input.value = 'New Name';
  input.dispatchEvent(new Event('input'));
  button.click();
  fixture.detectChanges();

  expect(component.name).toBe('New Name');
  expect(fixture.nativeElement.textContent).toContain('New Name');
});
```

#### Interview Guidance

- **How to explain it:** "Query DOM elements with `querySelector`, dispatch events to simulate user interaction, call `detectChanges()` to sync the view, then assert on both component state and rendered output."
- **Difficulty:** Intermediate

---

## Standalone Components (v14+)

Standalone components are self-contained components that declare their own dependencies without requiring an NgModule.

### What Are Standalone Components

#### Description

Introduced in Angular 14 (stable in Angular 15), standalone components simplify the Angular mental model by removing the NgModule requirement for component declaration.

| Aspect | NgModule-Based | Standalone |
| --- | --- | --- |
| Declaration | In NgModule `declarations` | `standalone: true` in `@Component` |
| Dependencies | Module `imports` | Component `imports` |
| Boilerplate | Higher (module + component) | Lower (component only) |
| Portability | Tied to module | Self-contained |

#### Example

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, RouterModule], // declare dependencies here
  template: `<h1>User Component</h1>`
})
export class UserComponent {}
```

#### Interview Guidance

- **How to explain it:** "Standalone components declare their dependencies directly in the component metadata using `standalone: true` and an `imports` array. They eliminate the need for NgModules and reduce boilerplate."
- **Difficulty:** Intermediate

### Bootstrapping Standalone Applications

#### Syntax

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    importProvidersFrom(SomeModule) // bridge for NgModule-based libraries
  ]
});
```

#### Description

Instead of bootstrapping an NgModule, `bootstrapApplication` bootstraps a standalone component directly. Application-wide providers are supplied through the second argument.

#### Interview Guidance

- **How to explain it:** "`bootstrapApplication` replaces `platformBrowserDynamic().bootstrapModule()`. It boots a standalone component directly and accepts application-wide providers like `provideRouter` and `provideHttpClient`."
- **Difficulty:** Intermediate

### Mixing Standalone and NgModule Components

#### Description

Standalone and NgModule-based components can coexist, enabling gradual migration.

```typescript
// Using a standalone component inside an NgModule
@NgModule({
  imports: [StandaloneComponent] // import standalone directly
})
export class FeatureModule {}
```

```typescript
// Using an NgModule inside a standalone component
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule] // import NgModules
})
export class StandaloneComponent {}
```

#### Interview Guidance

- **How to explain it:** "Standalone and NgModule components can coexist. NgModules can import standalone components directly, and standalone components can import NgModules in their `imports` array."
- **Difficulty:** Intermediate

### Standalone vs NgModule Imports

#### Comparison

| Aspect | Standalone `imports` | NgModule `imports` |
| --- | --- | --- |
| Contains | Components, directives, pipes, and modules | Modules only |
| No `declarations` | Correct | Uses `declarations` for components/directives/pipes |
| No `exports` | Available to this component's template only | `exports` controls visibility to importers |

#### Interview Guidance

- **How to explain it:** "In standalone components, `imports` holds everything: components, directives, pipes, and modules. In NgModules, `imports` holds only modules, while `declarations` registers components."
- **Difficulty:** Beginner

---

## Dependency Injection and inject Function

Angular's DI system provides dependencies to components and services. The `inject()` function (v14+) offers an alternative to constructor-based injection.

### inject() Function

#### Syntax

```typescript
import { inject } from '@angular/core';

export class UserComponent {
  private http = inject(HttpClient);
  private userService = inject(UserService);
  private config = inject(AppConfig, { optional: true });
}
```

#### Description

The `inject()` function, introduced in Angular 14, enables dependency injection in field initializers, factory functions, and constructors.

| Feature | Constructor Injection | `inject()` Function |
| --- | --- | --- |
| Syntax | Constructor parameters | Field initializers or function calls |
| Optional deps | `@Optional()` decorator | `{ optional: true }` option |
| Functional patterns | Not supported | Works in factory functions |
| Boilerplate | Higher (parameter list) | Lower |

#### Interview Guidance

- **How to explain it:** "`inject()` is an alternative to constructor injection that works in field initializers and factory functions. It reduces boilerplate and enables functional patterns like functional guards and resolvers."
- **Common follow-ups:**

| Question | Key Points |
| --- | --- |
| Where can `inject()` be called? | Constructor, field initializer, factory function, or `runInInjectionContext()` |
| What happens if called in `ngOnInit`? | Error: not in an injection context |

- **Difficulty:** Intermediate

### Functional Guards

#### Description

Functional guards (Angular 15+) replace class-based guards with plain functions that use `inject()` for dependencies.

#### Example

```typescript
// ❌ Old way: class-based guard
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  canActivate(): boolean {
    return this.authService.isAuthenticated();
  }
}

// ✅ New way: functional guard
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  return authService.isAuthenticated();
};

// Route configuration
const routes: Routes = [
  { path: 'admin', canActivate: [authGuard], component: AdminComponent }
];
```

#### Interview Guidance

- **How to explain it:** "Functional guards are plain functions that use `inject()` for dependencies. They are simpler, more composable, and the recommended approach since Angular 15."
- **Difficulty:** Intermediate

### Provider Functions

#### Description

Provider functions like `provideRouter()` and `provideHttpClient()` configure services for standalone applications without NgModules.

```typescript
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations()
  ]
});
```

| Benefit | Explanation |
| --- | --- |
| Tree-shakeable | Unused features are removed at build time |
| Explicit | Clear declaration of which features are active |
| Configurable | Accepts feature flags and options |

#### Interview Guidance

- **How to explain it:** "Provider functions replace NgModule imports for configuring services. They are tree-shakeable, explicit, and designed for standalone applications."
- **Difficulty:** Intermediate

### Providing Services in Standalone Components

#### Description

| Scope | Approach |
| --- | --- |
| Component-level | `providers` array in `@Component` |
| Application-level | `bootstrapApplication` providers or `providedIn: 'root'` |

```typescript
// Component-scoped
@Component({
  standalone: true,
  providers: [UserService] // new instance per component
})
export class UserComponent {}

// Application-wide singleton
@Injectable({ providedIn: 'root' })
export class UserService {}
```

#### Interview Guidance

- **How to explain it:** "Services can be provided at the component level for isolated instances, or at the root level via `providedIn: 'root'` or `bootstrapApplication` providers for singletons."
- **Difficulty:** Beginner

---

## Signals (v16+)

Signals are a synchronous, fine-grained reactivity primitive for managing state in Angular applications.

### What Are Signals

#### Description

Signals provide a new way to handle reactivity without depending on Zone.js. They always have a current value, notify consumers on change, and integrate with Angular's rendering pipeline.

| Characteristic | Detail |
| --- | --- |
| Always has a value | No concept of "empty" like Observables |
| Synchronous reads | `signal()` returns the value immediately |
| Fine-grained updates | Only affected components re-render |
| Zone.js optional | Signals work without Zone.js |

#### Interview Guidance

- **How to explain it:** "Signals are a reactive primitive that always hold a value, update synchronously, and provide fine-grained change tracking. They can replace Zone.js-based change detection for better performance."
- **Difficulty:** Intermediate

### Creating and Using Signals

#### Example

```typescript
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `
    <div>Count: {{ count() }}</div>
    <div>Double: {{ doubleCount() }}</div>
    <button (click)="increment()">Increment</button>
  `
})
export class CounterComponent {
  count = signal(0);                                  // writable signal
  doubleCount = computed(() => this.count() * 2);     // derived signal

  increment() {
    this.count.update(value => value + 1); // update with function
    // or: this.count.set(5);              // set directly
  }
}
```

#### Interview Guidance

- **How to explain it:** "Create writable signals with `signal()`, derived values with `computed()`, and side effects with `effect()`. Read values by calling the signal as a function."
- **Difficulty:** Intermediate

### signal vs computed vs effect

#### Comparison

| Primitive | Read/Write | Behavior | Use Case |
| --- | --- | --- | --- |
| `signal()` | Read + Write | Writable, notifies on change | Component state |
| `computed()` | Read only | Derived, memoized, auto-tracks deps | Calculated values |
| `effect()` | Side effect | Runs when tracked signals change | Logging, sync to localStorage |

#### Example

```typescript
export class UserComponent {
  firstName = signal('John');
  lastName = signal('Doe');

  // Computed: auto-updates when firstName or lastName changes
  fullName = computed(() => `${this.firstName()} ${this.lastName()}`);

  constructor() {
    // Effect: runs side effect on signal changes
    effect(() => {
      console.log(`Name changed to: ${this.fullName()}`);
    });
  }
}
```

#### Interview Guidance

- **How to explain it:** "`signal()` holds writable state. `computed()` derives read-only values that memoize and auto-track dependencies. `effect()` runs side effects when any tracked signal changes."
- **Difficulty:** Intermediate

### Signals vs Traditional Change Detection

#### Comparison

| Aspect | Zone.js + Default CD | Signals |
| --- | --- | --- |
| Granularity | Full component tree | Individual bindings |
| Zone.js dependency | Required | Optional |
| Performance | Can cause unnecessary checks | Only affected views update |
| Manual control | `ChangeDetectorRef` needed | Automatic |
| Mental model | Component-level dirty checking | Data-level reactivity |

#### Interview Guidance

- **How to explain it:** "Signals provide fine-grained reactivity, updating only affected bindings instead of checking the entire component tree. They remove the need for Zone.js and manual change detection management."
- **Difficulty:** Advanced

### Signals and RxJS Interop

#### Description

Angular provides interop functions to convert between Signals and Observables.

```typescript
import { toSignal, toObservable } from '@angular/core/rxjs-interop';

export class DataComponent {
  private http = inject(HttpClient);

  // Observable to Signal
  users$ = this.http.get<User[]>('/api/users');
  users = toSignal(this.users$, { initialValue: [] });

  // Signal to Observable
  searchTerm = signal('');
  searchTerm$ = toObservable(this.searchTerm);
}
```

| Function | Direction | Notes |
| --- | --- | --- |
| `toSignal()` | Observable to Signal | Requires `initialValue` or becomes `Signal<T \| undefined>` |
| `toObservable()` | Signal to Observable | Emits on every signal change |

#### Interview Guidance

- **How to explain it:** "`toSignal` converts an Observable to a Signal, and `toObservable` does the reverse. This allows gradual migration and interop between RxJS and Signal-based code."
- **Difficulty:** Intermediate

---

## Control Flow Syntax (v17+)

Angular 17 introduced built-in control flow syntax that replaces structural directives with a more performant, type-safe alternative.

### Overview

#### Description

The new control flow blocks (`@if`, `@for`, `@switch`) are compiled directly into the rendering pipeline, eliminating the overhead of directive resolution.

| New Syntax | Replaces | Key Improvement |
| --- | --- | --- |
| `@if` | `*ngIf` | Native `else if` support |
| `@for` | `*ngFor` | Required `track`, built-in `@empty` |
| `@switch` | `ngSwitch` | Cleaner syntax, better type narrowing |

### @if

#### Example

```html
<!-- ❌ Old way -->
<div *ngIf="user; else loading">
  {{ user.name }}
</div>
<ng-template #loading>Loading...</ng-template>

<!-- ✅ New way -->
@if (user) {
  <div>{{ user.name }}</div>
} @else if (status === 'error') {
  <div>Error occurred</div>
} @else {
  <div>Loading...</div>
}
```

#### Interview Guidance

- **How to explain it:** "`@if` replaces `*ngIf` with native `else if` support, eliminating the need for `ng-template` references. It is compiled directly into the rendering pipeline for better performance."
- **Difficulty:** Beginner

### @for

#### Example

```html
<!-- ❌ Old way -->
<div *ngFor="let item of items; let i = index; trackBy: trackByFn">
  {{ i }}: {{ item.name }}
</div>

<!-- ✅ New way -->
@for (item of items; track item.id) {
  <div>{{ $index }}: {{ item.name }}</div>
} @empty {
  <div>No items found</div>
}
```

| Feature | Details |
| --- | --- |
| `track` | Required (enforces performance best practice) |
| `@empty` | Built-in block for empty collections |
| Context variables | `$index`, `$first`, `$last`, `$even`, `$odd`, `$count` |
| Type inference | Better than `*ngFor` |

#### Interview Guidance

- **How to explain it:** "`@for` replaces `*ngFor` with required `track` for better performance by default. It includes a built-in `@empty` block and provides context variables like `$index`, `$first`, and `$last`."
- **Difficulty:** Beginner

### @switch

#### Example

```html
<!-- ❌ Old way -->
<div [ngSwitch]="status">
  <div *ngSwitchCase="'active'">Active</div>
  <div *ngSwitchCase="'pending'">Pending</div>
  <div *ngSwitchDefault>Unknown</div>
</div>

<!-- ✅ New way -->
@switch (status) {
  @case ('active') { <div>Active</div> }
  @case ('pending') { <div>Pending</div> }
  @default { <div>Unknown</div> }
}
```

#### Interview Guidance

- **How to explain it:** "`@switch` replaces `ngSwitch` directives with a cleaner, more familiar syntax. Each case is a block rather than a directive, improving readability and type narrowing."
- **Difficulty:** Beginner

### Performance Benefits

#### Description

| Benefit | Explanation |
| --- | --- |
| Compiler-optimized | Built into the compiler, not resolved as directives at runtime |
| Smaller bundles | More tree-shakeable than directive-based equivalents |
| Required tracking | `@for` mandates `track`, preventing common performance mistakes |
| Better type narrowing | Compiler narrows types within blocks (e.g., non-null inside `@if`) |

#### Interview Guidance

- **How to explain it:** "The new control flow is compiled directly into the rendering pipeline, producing smaller bundles and faster runtime. Required `track` in `@for` prevents a common performance mistake."
- **Difficulty:** Intermediate

---

## Deferrable Views (v17+)

Deferrable views allow lazy loading of template sections, improving initial load performance by deferring heavy components until they are needed.

### Basic Usage

#### Syntax

```html
@defer {
  <large-component />
} @placeholder {
  <div>Content will appear here</div>
} @loading {
  <spinner />
} @error {
  <div>Failed to load</div>
}
```

#### Description

| Block | Purpose | Options |
| --- | --- | --- |
| `@defer` | The deferred content | Trigger conditions, prefetch |
| `@placeholder` | Shown before loading starts | `minimum` duration |
| `@loading` | Shown while loading | `minimum` duration, `after` delay |
| `@error` | Shown if loading fails | None |

### Trigger Conditions

#### Description

| Trigger | Loads When | Example |
| --- | --- | --- |
| `on viewport` | Element enters the viewport | `@defer (on viewport)` |
| `on idle` | Browser is idle | `@defer (on idle)` |
| `on interaction` | User interacts (click, keydown) | `@defer (on interaction)` |
| `on hover` | User hovers over trigger area | `@defer (on hover)` |
| `on timer(duration)` | After specified time | `@defer (on timer(5s))` |
| `on immediate` | Immediately after rendering | `@defer (on immediate)` |
| Custom reference | Interaction with a specific element | `@defer (on interaction(buttonRef))` |

#### Example

```html
<button #loadButton>Load Comments</button>

@defer (on interaction(loadButton)) {
  <comments-section />
} @placeholder {
  <div>Click the button to load comments</div>
}
```

#### Interview Guidance

- **How to explain it:** "`@defer` lazy-loads template sections with configurable triggers like viewport visibility, idle time, or user interaction. It includes placeholder, loading, and error states."
- **Common follow-ups:**

| Question | Key Points |
| --- | --- |
| How is this different from lazy loading routes? | `@defer` works at the template level within a component, not at the route level |
| What gets lazy loaded? | The component code, its dependencies, and templates |

- **Difficulty:** Intermediate

### Prefetching

#### Description

Prefetching separates when code is fetched from when it is displayed. The code can be downloaded ahead of time while the actual rendering waits for a different trigger.

```html
@defer (on viewport; prefetch on idle) {
  <calendar-component />
} @placeholder (minimum 500ms) {
  <div>Calendar will appear here</div>
} @loading (minimum 1s; after 100ms) {
  <skeleton-loader />
} @error {
  <div>Failed to load calendar</div>
}
```

| Prefetch Strategy | Behavior |
| --- | --- |
| `prefetch on idle` | Downloads when browser is idle |
| `prefetch on hover` | Downloads on hover |
| `prefetch on interaction` | Downloads on first interaction |
| `prefetch on immediate` | Downloads immediately |

#### Interview Guidance

- **How to explain it:** "Prefetching decouples download timing from render timing. You can prefetch on idle and render on viewport, so the code is ready before the user scrolls to it."
- **Difficulty:** Advanced

---

## Modern Utilities (v16+)

Angular 16+ introduced several utilities that simplify common patterns like cleanup, input validation, and type-safe outputs.

### DestroyRef

#### Description

`DestroyRef` provides a way to register cleanup callbacks that run when the injection context (component, directive, or service) is destroyed.

#### Example

```typescript
import { Component, DestroyRef, inject } from '@angular/core';
import { interval } from 'rxjs';

@Component({ selector: 'app-data', template: '...' })
export class DataComponent {
  private destroyRef = inject(DestroyRef);

  constructor() {
    const subscription = interval(1000).subscribe();
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
```

#### Interview Guidance

- **How to explain it:** "`DestroyRef` lets you register cleanup callbacks without implementing `ngOnDestroy`. It works in components, directives, and services through dependency injection."
- **Difficulty:** Intermediate

### takeUntilDestroyed

#### Description

An RxJS operator that automatically completes an Observable when the injection context is destroyed. It must be called in an injection context (constructor or field initializer).

#### Example

```typescript
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export class DataComponent {
  private http = inject(HttpClient);

  constructor() {
    this.http.get('/api/data')
      .pipe(takeUntilDestroyed()) // auto-unsubscribes on destroy
      .subscribe(data => console.log(data));
  }
}
```

#### Interview Guidance

- **How to explain it:** "`takeUntilDestroyed` replaces the manual takeUntil/destroy pattern. It automatically completes the Observable when the component is destroyed."
- **Difficulty:** Intermediate

### Required Inputs

#### Description

Angular 16+ allows marking inputs as required with compile-time enforcement.

```typescript
@Component({ selector: 'app-user-card', template: '...' })
export class UserCardComponent {
  @Input({ required: true }) userId!: string;  // must be provided
  @Input() displayName?: string;               // optional
}
```

| Benefit | Explanation |
| --- | --- |
| Compile-time checking | Template errors if input is missing |
| Type safety | No need for `undefined` in the type |
| Self-documenting | API contract is explicit |

#### Interview Guidance

- **How to explain it:** "Required inputs enforce at compile time that a parent must provide the input. This improves type safety and makes the component API self-documenting."
- **Difficulty:** Beginner

### Input Transform

#### Description

Angular 16+ supports transforming input values at assignment time using the `transform` option.

```typescript
import { Component, Input, booleanAttribute, numberAttribute } from '@angular/core';

@Component({ selector: 'app-custom', template: '...' })
export class CustomComponent {
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: numberAttribute }) count = 0;
  @Input({ transform: (v: string) => v.toUpperCase() }) label = '';
}
```

```html
<!-- disabled becomes boolean true, count becomes number 5, label becomes "HELLO" -->
<app-custom disabled="true" count="5" label="hello" />
```

#### Interview Guidance

- **How to explain it:** "Input transforms convert attribute strings into typed values at assignment time. Angular provides built-in transforms like `booleanAttribute` and `numberAttribute`, and you can write custom transforms."
- **Difficulty:** Intermediate

### output() Function

#### Description

Angular 17.3+ introduced the `output()` function as a type-safe alternative to the `@Output()` decorator.

```typescript
import { Component, output } from '@angular/core';

@Component({
  selector: 'app-button',
  template: '<button (click)="handleClick()">Click</button>'
})
export class ButtonComponent {
  clicked = output<string>(); // type-safe output

  handleClick() {
    this.clicked.emit('Button clicked');
  }
}
```

| Benefit | Explanation |
| --- | --- |
| Better type inference | No need for generic on `EventEmitter` |
| Consistent API | Mirrors `input()` function |
| No `EventEmitter` import | Uses Angular's own output type |

#### Interview Guidance

- **How to explain it:** "The `output()` function replaces `@Output()` with better type inference and a consistent API that mirrors the `input()` function."
- **Difficulty:** Intermediate

---

## See Also

- [Angular Documentation](https://angular.dev)
- [RxJS Documentation](https://rxjs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [JavaScript Interview Mastery Guide](./javascript-interview-mastery-guide.md)
- [TypeScript Interview Mastery Guide](./typescript-interview-mastery-guide.md)
- [Design Patterns Interview Mastery Guide](./design-patterns-interview-mastery-guide.md)
- [System Design Interview Mastery Guide](./system-design-interview-mastery-guide.md)
