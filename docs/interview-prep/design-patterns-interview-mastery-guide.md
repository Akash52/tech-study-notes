# Design Patterns Interview Mastery Guide

This guide covers the 23 Gang of Four (GoF) design patterns plus modern JavaScript/TypeScript patterns. Each pattern includes syntax, descriptions, real-world code examples, comparisons, and interview guidance. The patterns are grouped into Creational, Structural, and Behavioral categories.

| Prerequisites | Description |
|---------------|-------------|
| Object-Oriented Programming | Classes, interfaces, inheritance, polymorphism |
| JavaScript / TypeScript | ES6+ syntax, modules, Promises, generics |
| SOLID Principles | Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion |

## Table of contents

1. [Foundational Patterns (Q1-10)](#foundational-patterns-q1-10) — Creational and Structural basics
2. [Behavioral Patterns (Q11-15)](#behavioral-patterns-q11-15) — Communication between objects
3. [Modern JavaScript/TypeScript Patterns (Q16-20)](#modern-javascripttypescript-patterns-q16-20) — Modules, Mixins, Decorators
4. [Real-World Implementations (Q21-25)](#real-world-implementations-q21-25) — Framework patterns, State management
5. [Advanced and Anti-Patterns (Q26-30)](#advanced-and-anti-patterns-q26-30) — Architectural patterns, What to avoid
6. [Behavioral Questions (Q31-35)](#behavioral-questions-q31-35) — Pattern selection, Refactoring stories
7. [Quick Fire Round (Q36-45)](#quick-fire-round-q36-45) — Rapid pattern recognition
8. [Interview Success Tips](#interview-success-tips) — Pattern selection matrix, Common scenarios
9. [See also](#see-also) — Books, courses, practice

## Study strategy

| Level | Focus areas | Study time | Key takeaway |
|-------|-------------|------------|--------------|
| Junior (0-2 yrs) | Q1-Q10, Q16-Q20 | 4 weeks | Understand Singleton, Factory, Observer, Module |
| Mid-Level (2-5 yrs) | All Q1-Q30 | 6 weeks | Know when to apply each pattern and trade-offs |
| Senior (5+ yrs) | All + Anti-patterns | 3 weeks review | Pattern combinations, architectural decisions |

### Preparation timeline

| Week | Topics |
|------|--------|
| 1 | Creational Patterns (Singleton, Factory, Builder, Prototype) |
| 2 | Structural Patterns (Decorator, Adapter, Proxy, Facade) |
| 3 | Behavioral Patterns (Observer, Strategy, Command, State) |
| 4 | Modern Patterns (Module, Mixin, Dependency Injection) |
| 5-6 | Real implementations + Mock interviews |

### SOLID principles foundation

| Principle | Meaning |
|-----------|---------|
| **S**ingle Responsibility | One class, one reason to change |
| **O**pen/Closed | Open for extension, closed for modification |
| **L**iskov Substitution | Subtypes must be substitutable for base types |
| **I**nterface Segregation | Many specific interfaces over one general |
| **D**ependency Inversion | Depend on abstractions, not concretions |

---

## Foundational Patterns (Q1-10)

### Q1: Singleton Pattern

The Singleton pattern ensures a class has only one instance and provides a global access point to that instance. It is commonly used for database connections, configuration managers, logging services, and other shared resources.

#### Syntax

| Element | Description |
|---------|-------------|
| Private constructor | Prevents direct instantiation with `new` |
| Static instance field | Holds the single instance |
| Static `getInstance()` method | Returns or creates the instance |
| Lazy initialization | Instance created on first access, not at load time |

#### Description

Singleton restricts instantiation of a class to a single object. All subsequent calls to the constructor or `getInstance()` return the same reference. This is useful when exactly one object is needed to coordinate actions across the system.

> **Note:** In JavaScript, the module system itself is a natural singleton — every `import` of a module returns the same cached reference.

> **Warning:** Singletons can make unit testing difficult because they carry global state and are hard to mock. Prefer dependency injection for testable code.

#### Examples

**Classic Singleton (JavaScript):**

```javascript
class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    this.connection = null;
    this.config = {};
    Database.instance = this;
  }

  connect(connectionString) {
    if (!this.connection) {
      this.connection = `Connected to ${connectionString}`;
    }
    return this.connection;
  }

  query(sql) {
    if (!this.connection) {
      throw new Error('Not connected');
    }
    return `Executing: ${sql}`;
  }
}

const db1 = new Database();
const db2 = new Database();
console.log(db1 === db2); // ✅ true — same instance
```

**Module pattern Singleton (JavaScript):**

```javascript
const ConfigManager = (() => {
  let instance;

  function createInstance() {
    return {
      config: {},
      set(key, value) { this.config[key] = value; },
      get(key) { return this.config[key]; },
      getAll() { return { ...this.config }; }
    };
  }

  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();

const config1 = ConfigManager.getInstance();
const config2 = ConfigManager.getInstance();
config1.set('apiUrl', 'https://api.example.com');
console.log(config2.get('apiUrl')); // ✅ 'https://api.example.com'
```

**TypeScript Singleton (type-safe):**

```typescript
class Logger {
  private static instance: Logger;
  private logs: string[] = [];

  private constructor() {} // Private prevents direct instantiation

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public log(message: string): void {
    const timestamp = new Date().toISOString();
    this.logs.push(`[${timestamp}] ${message}`);
  }

  public getLogs(): string[] {
    return [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
  }
}

const logger1 = Logger.getInstance();
const logger2 = Logger.getInstance();
console.log(logger1 === logger2); // ✅ true
```

**Lazy initialization with cache (TypeScript):**

```typescript
class CacheManager {
  private static instance: CacheManager;
  private cache: Map<string, any>;

  private constructor() {
    this.cache = new Map();
  }

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  public set(key: string, value: any, ttl?: number): void {
    this.cache.set(key, {
      value,
      expiry: ttl ? Date.now() + ttl : null
    });
  }

  public get(key: string): any {
    const item = this.cache.get(key);
    if (!item) return null;
    if (item.expiry && Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  public clear(): void {
    this.cache.clear();
  }
}
```

#### Comparison

| Use case | Suitable | Reason |
|----------|----------|--------|
| Database connections | Yes | Expensive to create, should be shared |
| Configuration managers | Yes | Single source of truth |
| Logging services | Yes | Centralized log management |
| Thread pools | Yes | Limited resource management |
| Multiple configs needed | No | Each consumer needs its own instance |
| Testing with different setups | No | Global state makes mocking hard |

#### Interview guidance

**How to explain it:**

> "Singleton ensures a class has only one instance and provides a global access point. It is useful for database connections, configuration managers, and logging services — resources that should be shared across the application."

**Common follow-ups:**

| Question | Key points |
|----------|------------|
| What are drawbacks of Singleton? | Hard to test/mock, violates Single Responsibility (manages own lifecycle + business logic), creates hidden dependencies via global state, issues in concurrent environments without synchronization |
| How do you handle Singleton in a multi-threaded environment? | Double-checked locking, lazy holder idiom, or language-specific thread-safe initialization (Java enum singleton, C++ Meyer's Singleton). JavaScript is single-threaded but async initialization still needs care |
| Singleton vs module-level instance? | In JavaScript, module exports are cached and act as natural singletons. Prefer module-scoped instances over class-based singletons when possible |

**Difficulty:** Beginner

---

### Q2: Factory Pattern

The Factory pattern provides an interface for creating objects without specifying the exact class. It delegates instantiation logic to a factory method or class. There are three main variations: Simple Factory, Factory Method, and Abstract Factory.

#### Syntax

| Variation | Mechanism | Creates |
|-----------|-----------|---------|
| Simple Factory | Static method with switch/map | Single product type |
| Factory Method | Subclass overrides creation method | One product per factory subclass |
| Abstract Factory | Factory interface with multiple methods | Family of related products |

#### Description

Factory patterns centralize object creation logic so that client code depends on abstractions rather than concrete classes. This makes it easy to add new types without modifying existing code (Open/Closed principle).

- **Simple Factory** uses a single class with a method that returns different types based on input.
- **Factory Method** defines an interface for creation but lets subclasses decide which class to instantiate.
- **Abstract Factory** produces families of related objects without specifying their concrete classes.

#### Examples

**Simple Factory:**

```javascript
class Car {
  constructor(options) {
    this.doors = options.doors || 4;
    this.state = options.state || 'new';
    this.color = options.color || 'silver';
  }
}

class Truck {
  constructor(options) {
    this.doors = options.doors || 2;
    this.state = options.state || 'used';
    this.wheelSize = options.wheelSize || 'large';
  }
}

class VehicleFactory {
  createVehicle(type, options) {
    switch (type) {
      case 'car': return new Car(options);
      case 'truck': return new Truck(options);
      default: throw new Error(`Unknown type: ${type}`);
    }
  }
}

const factory = new VehicleFactory();
const car = factory.createVehicle('car', { color: 'blue' });
const truck = factory.createVehicle('truck', { wheelSize: 'medium' });
```

**Factory Method (TypeScript):**

```typescript
interface Button {
  render(): void;
  onClick(callback: () => void): void;
}

abstract class Dialog {
  abstract createButton(): Button;

  render(): void {
    const button = this.createButton();
    button.onClick(() => console.log('Button clicked!'));
    button.render();
  }
}

class WindowsButton implements Button {
  render(): void { console.log('Rendering Windows button'); }
  onClick(callback: () => void): void { callback(); }
}

class WebButton implements Button {
  render(): void { console.log('Rendering HTML button'); }
  onClick(callback: () => void): void { callback(); }
}

class WindowsDialog extends Dialog {
  createButton(): Button { return new WindowsButton(); }
}

class WebDialog extends Dialog {
  createButton(): Button { return new WebButton(); }
}
```

**Abstract Factory (TypeScript):**

```typescript
interface GUIFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
}

interface Checkbox {
  render(): void;
}

class WindowsFactory implements GUIFactory {
  createButton(): Button { return new WindowsButton(); }
  createCheckbox(): Checkbox { return new WindowsCheckbox(); }
}

class MacFactory implements GUIFactory {
  createButton(): Button { return new MacButton(); }
  createCheckbox(): Checkbox { return new MacCheckbox(); }
}

// Client depends only on interfaces
class Application {
  private button: Button;
  private checkbox: Checkbox;

  constructor(factory: GUIFactory) {
    this.button = factory.createButton();
    this.checkbox = factory.createCheckbox();
  }

  render(): void {
    this.button.render();
    this.checkbox.render();
  }
}
```

**Real-world example — Payment processing:**

```typescript
interface PaymentMethod {
  processPayment(amount: number): Promise<boolean>;
  refund(transactionId: string): Promise<boolean>;
}

class CreditCardPayment implements PaymentMethod {
  async processPayment(amount: number) {
    console.log(`Credit card: $${amount}`);
    return true;
  }
  async refund(transactionId: string) { return true; }
}

class PayPalPayment implements PaymentMethod {
  async processPayment(amount: number) {
    console.log(`PayPal: $${amount}`);
    return true;
  }
  async refund(transactionId: string) { return true; }
}

class PaymentFactory {
  static create(type: string): PaymentMethod {
    const methods: Record<string, () => PaymentMethod> = {
      credit_card: () => new CreditCardPayment(),
      paypal: () => new PayPalPayment(),
    };
    const factory = methods[type];
    if (!factory) throw new Error(`Unsupported: ${type}`);
    return factory();
  }
}
```

#### Comparison

| Aspect | Simple Factory | Factory Method | Abstract Factory |
|--------|----------------|----------------|------------------|
| Complexity | Low | Medium | High |
| Flexibility | Low | Medium | High |
| Use case | Single product type | Product hierarchy | Product families |
| GoF pattern | No | Yes | Yes |

| Use case | Suitable | Reason |
|----------|----------|--------|
| Complex object creation | Yes | Multiple steps, validation needed |
| Type decided at runtime | Yes | Decouples creation from usage |
| Extending with new types | Yes | No changes to existing code |
| Simple `new MyClass()` | No | Adds unnecessary indirection |

#### Interview guidance

**How to explain it:**

> "Factory pattern provides an interface for creating objects without specifying their exact class. It delegates instantiation to factory methods or classes, making it easy to extend with new types without modifying existing code."

**Common follow-ups:**

| Question | Key points |
|----------|------------|
| Difference between Factory Method and Abstract Factory? | Factory Method uses inheritance — subclasses decide which class to instantiate. Abstract Factory uses composition — one factory creates a family of related objects. Factory Method produces one product; Abstract Factory produces multiple related products |
| When is a factory overkill? | When direct construction (`new MyClass()`) is simple and there is only one implementation. Factories add value when creation is complex or types vary |

**Difficulty:** Beginner

---

### Q3: Builder Pattern

The Builder pattern separates the construction of a complex object from its representation. It allows step-by-step creation and produces different representations using the same construction process. It is useful when objects have many optional parameters.

#### Syntax

| Element | Description |
|---------|-------------|
| **Builder** | Defines step-by-step construction methods, returns `this` for chaining |
| **Director** (optional) | Encapsulates common construction sequences |
| **Product** | The complex object being built |
| `build()` method | Finalizes and returns the constructed object |

#### Description

Builder eliminates the "telescoping constructor" anti-pattern where constructors take many parameters that are hard to read. Each setter method on the builder returns `this`, enabling fluent method chaining. An optional Director class can encapsulate predefined construction sequences.

> **Note:** In JavaScript, the object parameter pattern (`new User({ name, age, email })`) can replace simple builders. Use Builder when construction involves validation, ordering, or multiple steps.

#### Examples

**Classic Builder with method chaining (JavaScript):**

```javascript
class Pizza {
  constructor() {
    this.size = '';
    this.cheese = false;
    this.pepperoni = false;
    this.mushrooms = false;
    this.sauce = '';
  }

  describe() {
    const toppings = [];
    if (this.cheese) toppings.push('cheese');
    if (this.pepperoni) toppings.push('pepperoni');
    if (this.mushrooms) toppings.push('mushrooms');
    return `${this.size} pizza with ${this.sauce}, ${toppings.join(', ')}`;
  }
}

class PizzaBuilder {
  constructor() { this.pizza = new Pizza(); }
  setSize(size) { this.pizza.size = size; return this; }
  setSauce(sauce) { this.pizza.sauce = sauce; return this; }
  addCheese() { this.pizza.cheese = true; return this; }
  addPepperoni() { this.pizza.pepperoni = true; return this; }
  addMushrooms() { this.pizza.mushrooms = true; return this; }
  build() { return this.pizza; }
}

const pizza = new PizzaBuilder()
  .setSize('large')
  .setSauce('tomato')
  .addCheese()
  .addPepperoni()
  .build();
```

**Builder with Director (TypeScript):**

```typescript
interface ComputerBuilder {
  setCPU(cpu: string): this;
  setRAM(ram: string): this;
  setStorage(storage: string): this;
  setGPU(gpu: string): this;
  setCooling(cooling: string): this;
  build(): Computer;
}

class Computer {
  constructor(
    public cpu: string,
    public ram: string,
    public storage: string,
    public gpu?: string,
    public cooling?: string
  ) {}
}

class GamingComputerBuilder implements ComputerBuilder {
  private cpu!: string;
  private ram!: string;
  private storage!: string;
  private gpu?: string;
  private cooling?: string;

  setCPU(cpu: string) { this.cpu = cpu; return this; }
  setRAM(ram: string) { this.ram = ram; return this; }
  setStorage(s: string) { this.storage = s; return this; }
  setGPU(gpu: string) { this.gpu = gpu; return this; }
  setCooling(c: string) { this.cooling = c; return this; }

  build(): Computer {
    return new Computer(
      this.cpu, this.ram, this.storage, this.gpu, this.cooling
    );
  }
}

// Director encapsulates standard configurations
class ComputerDirector {
  buildGamingPC(builder: ComputerBuilder): Computer {
    return builder
      .setCPU('Intel i9-13900K')
      .setRAM('32GB DDR5')
      .setStorage('2TB NVMe SSD')
      .setGPU('RTX 4090')
      .setCooling('Liquid Cooling')
      .build();
  }

  buildOfficePC(builder: ComputerBuilder): Computer {
    return builder
      .setCPU('Intel i5-13400')
      .setRAM('16GB DDR4')
      .setStorage('512GB SSD')
      .build();
  }
}
```

**URL Builder (TypeScript):**

```typescript
class URLBuilder {
  private protocol = 'https';
  private domain = '';
  private path = '';
  private queryParams: Map<string, string> = new Map();
  private hash = '';

  setDomain(d: string) { this.domain = d; return this; }
  setPath(p: string) {
    this.path = p.startsWith('/') ? p : `/${p}`;
    return this;
  }
  addQueryParam(key: string, value: string) {
    this.queryParams.set(key, value);
    return this;
  }
  setHash(h: string) {
    this.hash = h.startsWith('#') ? h.slice(1) : h;
    return this;
  }

  build(): string {
    if (!this.domain) throw new Error('Domain is required');
    let url = `${this.protocol}://${this.domain}${this.path}`;
    if (this.queryParams.size > 0) {
      const params = Array.from(this.queryParams.entries())
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&');
      url += `?${params}`;
    }
    if (this.hash) url += `#${this.hash}`;
    return url;
  }
}

const url = new URLBuilder()
  .setDomain('api.example.com')
  .setPath('/users/123')
  .addQueryParam('include', 'posts')
  .addQueryParam('limit', '10')
  .build();
// ✅ "https://api.example.com/users/123?include=posts&limit=10"
```

**SQL Query Builder (TypeScript):**

```typescript
class QueryBuilder {
  private table = '';
  private selectFields: string[] = ['*'];
  private whereConditions: string[] = [];
  private orderByField = '';
  private orderDirection: 'ASC' | 'DESC' = 'ASC';
  private limitValue: number | null = null;

  from(table: string) { this.table = table; return this; }
  select(...fields: string[]) { this.selectFields = fields; return this; }
  where(condition: string) { this.whereConditions.push(condition); return this; }
  orderBy(field: string, dir: 'ASC' | 'DESC' = 'ASC') {
    this.orderByField = field;
    this.orderDirection = dir;
    return this;
  }
  limit(n: number) { this.limitValue = n; return this; }

  build(): string {
    if (!this.table) throw new Error('Table name is required');
    let q = `SELECT ${this.selectFields.join(', ')} FROM ${this.table}`;
    if (this.whereConditions.length > 0)
      q += ` WHERE ${this.whereConditions.join(' AND ')}`;
    if (this.orderByField)
      q += ` ORDER BY ${this.orderByField} ${this.orderDirection}`;
    if (this.limitValue !== null) q += ` LIMIT ${this.limitValue}`;
    return q;
  }
}

const query = new QueryBuilder()
  .select('id', 'name', 'email')
  .from('users')
  .where('age > 18')
  .where('status = "active"')
  .orderBy('created_at', 'DESC')
  .limit(10)
  .build();
// ✅ SELECT id, name, email FROM users WHERE age > 18
//    AND status = "active" ORDER BY created_at DESC LIMIT 10
```

#### Comparison

| Use case | Suitable | Reason |
|----------|----------|--------|
| Many constructor parameters (>4) | Yes | Avoids telescoping constructor anti-pattern |
| Multi-step construction | Yes | Enforces order and validation |
| Immutable objects | Yes | Build once, then freeze |
| Different representations | Yes | Same process, different products |
| Simple objects with few params | No | Unnecessary complexity |

#### Interview guidance

**How to explain it:**

> "Builder separates the construction of a complex object from its representation. It allows step-by-step creation with method chaining and supports different representations using the same construction process."

**Common follow-ups:**

| Question | Key points |
|----------|------------|
| Builder vs constructor with optional parameters? | Builders provide better readability via chaining, enforce construction order/validation, and support immutability. Optional parameters are simpler but become unreadable with many params |
| When to use a Director? | When predefined construction sequences exist (e.g., "Gaming PC", "Office PC") that clients frequently request. Without a Director, clients build custom configurations directly |

**Difficulty:** Intermediate

---

### Q4: Prototype Pattern

The Prototype pattern creates new objects by cloning an existing prototype instance rather than constructing from scratch. JavaScript has built-in prototypal inheritance through `Object.create()`. This pattern is useful when object creation is expensive or complex.

#### Syntax

| Element | Description |
|---------|-------------|
| Prototype | Object that serves as a template for cloning |
| `clone()` method | Returns a copy of the prototype |
| Prototype Registry (optional) | Stores and retrieves named prototypes |
| Shallow vs Deep clone | Shallow copies references; deep copies nested structures |

#### Description

Instead of calling a constructor, new objects are produced by copying an existing object. This avoids expensive initialization when objects share most of their state. JavaScript natively supports this through its prototype chain and `Object.create()`.

> **Warning:** Shallow copies share references to nested objects. Modifying a nested property on the clone also modifies the original. Use deep cloning (`structuredClone()`, `JSON.parse(JSON.stringify())`, or libraries) for objects with nested state.

#### Examples

**JavaScript prototypal inheritance (built-in):**

```javascript
const carPrototype = {
  init(make, model, year) {
    this.make = make;
    this.model = model;
    this.year = year;
  },
  getInfo() {
    return `${this.year} ${this.make} ${this.model}`;
  }
};

const car1 = Object.create(carPrototype);
car1.init('Toyota', 'Camry', 2023);

const car2 = Object.create(carPrototype);
car2.init('Honda', 'Accord', 2023);

console.log(car1.getInfo()); // ✅ "2023 Toyota Camry"
```

**Explicit clone method:**

```javascript
class Circle {
  constructor(x, y, color, radius) {
    this.type = 'circle';
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = radius;
  }

  clone() {
    return new Circle(this.x, this.y, this.color, this.radius);
  }

  draw() {
    console.log(`Drawing ${this.color} circle at (${this.x}, ${this.y})`);
  }
}

const circle1 = new Circle(10, 20, 'red', 5);
const circle2 = circle1.clone();
circle2.x = 50;
console.log(circle1.x); // ✅ 10 — original unchanged
console.log(circle2.x); // ✅ 50
```

**Shallow vs deep clone:**

```javascript
// ❌ Shallow copy — nested references shared
const obj1 = { nested: { value: 1 } };
const shallow = { ...obj1 };
shallow.nested.value = 2;
console.log(obj1.nested.value); // 2 — modified original!

// ✅ Deep copy — independent nested objects
const deep = JSON.parse(JSON.stringify(obj1));
deep.nested.value = 3;
console.log(obj1.nested.value); // 2 — unchanged

// ✅ Modern deep copy (no limitations with functions/dates)
const modern = structuredClone(obj1);
```

> **Note:** `JSON.parse(JSON.stringify())` cannot handle functions, `Date` objects, `undefined`, or circular references. Use `structuredClone()` or a library like lodash `cloneDeep()` for complex objects.

**Prototype Registry (TypeScript):**

```typescript
interface Cloneable<T> {
  clone(): T;
}

class DocumentTemplate implements Cloneable<DocumentTemplate> {
  constructor(
    public title: string,
    public content: string,
    public styles: Record<string, any>,
    public metadata: Record<string, any>
  ) {}

  clone(): DocumentTemplate {
    return new DocumentTemplate(
      this.title,
      this.content,
      { ...this.styles },
      { ...this.metadata }
    );
  }
}

class TemplateManager {
  private templates = new Map<string, DocumentTemplate>();

  addTemplate(name: string, template: DocumentTemplate): void {
    this.templates.set(name, template);
  }

  createDocument(name: string, title: string, content: string) {
    const template = this.templates.get(name);
    if (!template) throw new Error(`Template "${name}" not found`);
    const doc = template.clone();
    doc.title = title;
    doc.content = content;
    return doc;
  }
}
```

#### Comparison

| Use case | Suitable | Reason |
|----------|----------|--------|
| Expensive object creation | Yes | Cloning avoids re-running costly initialization |
| Many similar object variations | Yes | Clone and modify a few fields |
| Runtime object types unknown | Yes | Clone without knowing the concrete class |
| Cloning is as expensive as constructing | No | No benefit over `new` |

#### Interview guidance

**How to explain it:**

> "Prototype creates new objects by cloning an existing instance rather than constructing from scratch. JavaScript supports this natively through `Object.create()` and the prototype chain."

**Common follow-ups:**

| Question | Key points |
|----------|------------|
| Shallow copy vs deep copy? | Shallow copies references to nested objects (mutations affect original). Deep copy creates independent nested objects. Use `structuredClone()` or `lodash.cloneDeep()` for deep copies |
| How does JavaScript prototypal inheritance relate? | JavaScript uses prototypes natively for inheritance. The GoF Prototype pattern is about explicit cloning for object creation. In JS, `Object.create()` or the spread operator are idiomatic alternatives to explicit `clone()` methods |

**Difficulty:** Beginner

---

### Q5: Adapter Pattern

The Adapter pattern converts the interface of a class into another interface that clients expect. It allows classes with incompatible interfaces to work together by acting as a wrapper between them.

#### Syntax

| Element | Description |
|---------|-------------|
| Target interface | The interface the client expects |
| Adaptee | The existing class with an incompatible interface |
| Adapter | Wraps the Adaptee and implements the Target interface |
| Client | Works only with the Target interface |

#### Description

Adapter is a structural pattern that bridges two incompatible interfaces. It wraps an existing class and translates calls from the expected interface into calls the wrapped class understands. This is commonly used when integrating legacy code, third-party libraries, or multiple implementations behind a unified interface.

#### Examples

**Classic Adapter (TypeScript):**

```typescript
// Adaptee — old system with incompatible interface
class OldPrinter {
  printOldFormat(text: string): void {
    console.log(`OLD FORMAT: ${text.toUpperCase()}`);
  }
}

// Target interface
interface ModernPrinter {
  print(text: string): void;
  printColor(text: string, color: string): void;
}

// Adapter wraps Adaptee, implements Target
class PrinterAdapter implements ModernPrinter {
  constructor(private oldPrinter: OldPrinter) {}

  print(text: string): void {
    this.oldPrinter.printOldFormat(text);
  }

  printColor(text: string, color: string): void {
    this.oldPrinter.printOldFormat(`[${color}] ${text}`);
  }
}

function clientCode(printer: ModernPrinter): void {
  printer.print('Hello World');
}

const adapter = new PrinterAdapter(new OldPrinter());
clientCode(adapter); // ✅ Works transparently
```

**API Adapter — payment gateways:**

```typescript
interface PaymentGateway {
  processPayment(amount: number, method: string): Promise<PaymentResult>;
}

interface PaymentResult {
  success: boolean;
  transactionId: string;
  amount: number;
}

// Stripe has its own interface
class StripeAPI {
  makePayment(amount: number, currency: string, cardToken: string) {
    return Promise.resolve({
      success: true,
      transaction_id: 'stripe_' + Math.random().toString(36).slice(2),
      amount_cents: amount * 100,
    });
  }
}

class StripeAdapter implements PaymentGateway {
  constructor(private stripe: StripeAPI) {}

  async processPayment(amount: number, method: string): Promise<PaymentResult> {
    const result = await this.stripe.makePayment(amount, 'USD', method);
    return {
      success: result.success,
      transactionId: result.transaction_id,  // Adapt field name
      amount: result.amount_cents / 100,     // Adapt unit
    };
  }
}

// PayPal has a different interface
class PayPalAPI {
  charge(dollars: number, account: string) {
    return Promise.resolve({
      status: 'completed',
      id: 'pp_' + Math.random().toString(36).slice(2),
      total: dollars,
    });
  }
}

class PayPalAdapter implements PaymentGateway {
  constructor(private paypal: PayPalAPI) {}

  async processPayment(amount: number, method: string): Promise<PaymentResult> {
    const result = await this.paypal.charge(amount, method);
    return {
      success: result.status === 'completed',
      transactionId: result.id,
      amount: result.total,
    };
  }
}

// Client code works with any PaymentGateway
async function checkout(gateway: PaymentGateway, amount: number) {
  const result = await gateway.processPayment(amount, 'token');
  console.log(`Payment ${result.success ? 'successful' : 'failed'}`);
}
```

**Database Adapter:**

```typescript
interface Database {
  connect(): Promise<void>;
  query(sql: string): Promise<any[]>;
  disconnect(): Promise<void>;
}

class MySQLDatabase {
  async mysqlConnect(host: string, user: string) {
    console.log(`MySQL connected to ${host}`);
  }
  async mysqlQuery(query: string) { return []; }
  async mysqlClose() { console.log('MySQL disconnected'); }
}

class MySQLAdapter implements Database {
  constructor(private mysql: MySQLDatabase) {}
  async connect() { await this.mysql.mysqlConnect('localhost', 'root'); }
  async query(sql: string) { return this.mysql.mysqlQuery(sql); }
  async disconnect() { await this.mysql.mysqlClose(); }
}

class MongoDatabase {
  async mongoConnect(uri: string) {
    console.log(`MongoDB connected to ${uri}`);
  }
  async mongoFind(collection: string, filter: any) { return []; }
  async mongoDisconnect() { console.log('MongoDB disconnected'); }
}

class MongoAdapter implements Database {
  constructor(private mongo: MongoDatabase) {}
  async connect() {
    await this.mongo.mongoConnect('mongodb://localhost:27017');
  }
  async query(sql: string) {
    // Simplified: extract table name from SQL
    const collection = sql.match(/FROM (\w+)/)?.[1] || 'default';
    return this.mongo.mongoFind(collection, {});
  }
  async disconnect() { await this.mongo.mongoDisconnect(); }
}

// Swap databases without changing application code
class App {
  constructor(private db: Database) {}
  async run() {
    await this.db.connect();
    await this.db.query('SELECT * FROM users');
    await this.db.disconnect();
  }
}
```

#### Comparison

| Use case | Suitable | Reason |
|----------|----------|--------|
| Legacy code integration | Yes | Makes old code work with new systems |
| Third-party library wrapping | Yes | Standardizes incompatible APIs |
| Multiple implementations | Yes | Unifies interfaces (payment gateways, databases) |
| Can modify the source | No | Refactor the interface directly instead |

| Pattern | Purpose |
|---------|---------|
| Adapter | Converts one interface to another (compatibility) |
| Facade | Simplifies a complex subsystem (simplification) |
| Decorator | Adds behavior to an object (enhancement) |

#### Interview guidance

**How to explain it:**

> "Adapter converts the interface of an existing class into another interface that clients expect. It acts as a wrapper that translates calls, allowing incompatible interfaces to work together."

**Common follow-ups:**

| Question | Key points |
|----------|------------|
| Adapter vs Facade? | Adapter converts one interface to match another. Facade simplifies a complex subsystem with a new, simpler interface. Adapter works with existing interfaces; Facade defines a new one |
| Object Adapter vs Class Adapter? | Object Adapter uses composition (wraps adaptee). Class Adapter uses multiple inheritance (extends adaptee). JavaScript/TypeScript only supports Object Adapter since they lack multiple inheritance |

**Difficulty:** Beginner

---

### Q6: Decorator Pattern

The Decorator pattern attaches additional responsibilities to an object dynamically. It provides a flexible alternative to subclassing for extending functionality. Decorators wrap the original object and add new behavior while maintaining the same interface.

#### Syntax

| Element | Description |
|---------|-------------|
| Component interface | Defines the common interface |
| Concrete Component | The base object being decorated |
| Base Decorator | Wraps a Component and delegates to it |
| Concrete Decorators | Add specific behavior before/after delegation |

#### Description

Decorators are stacked (composed) around a base object. Each decorator implements the same interface, so the client cannot tell whether it is working with the base object or a decorated version. This supports the Open/Closed principle — you can add behavior without modifying existing classes.

> **Warning:** Decorator order matters. Stacking decorators in different orders can produce different results. Document expected ordering when it is significant.

#### Examples

**Classic Decorator — coffee shop:**

```typescript
interface Coffee {
  cost(): number;
  description(): string;
}

class SimpleCoffee implements Coffee {
  cost() { return 2; }
  description() { return 'Simple coffee'; }
}

abstract class CoffeeDecorator implements Coffee {
  constructor(protected coffee: Coffee) {}
  abstract cost(): number;
  abstract description(): string;
}

class MilkDecorator extends CoffeeDecorator {
  cost() { return this.coffee.cost() + 0.5; }
  description() { return this.coffee.description() + ', milk'; }
}

class SugarDecorator extends CoffeeDecorator {
  cost() { return this.coffee.cost() + 0.2; }
  description() { return this.coffee.description() + ', sugar'; }
}

class WhippedCreamDecorator extends CoffeeDecorator {
  cost() { return this.coffee.cost() + 0.7; }
  description() { return this.coffee.description() + ', whipped cream'; }
}

// Stack decorators
let coffee: Coffee = new SimpleCoffee();
coffee = new MilkDecorator(coffee);
coffee = new SugarDecorator(coffee);
coffee = new WhippedCreamDecorator(coffee);
console.log(`${coffee.description()}: $${coffee.cost()}`);
// ✅ "Simple coffee, milk, sugar, whipped cream: $3.4"
```

**Function composition (decorator-like middleware):**

```typescript
type Middleware = (next: Function) => Function;

const logger: Middleware = (next) => (...args: any[]) => {
  console.log('Logging:', args);
  return next(...args);
};

const timer: Middleware = (next) => (...args: any[]) => {
  const start = Date.now();
  const result = next(...args);
  console.log(`Execution time: ${Date.now() - start}ms`);
  return result;
};

const errorHandler: Middleware = (next) => (...args: any[]) => {
  try { return next(...args); }
  catch (error) { console.error('Error:', error); throw error; }
};

function compose(...middlewares: Middleware[]) {
  return (fn: Function) =>
    middlewares.reduceRight((acc, mw) => mw(acc), fn);
}

const add = (x: number, y: number) => x + y;
const decorated = compose(logger, timer, errorHandler)(add);
decorated(5, 3);
```

**HTTP client with stacked decorators:**

```typescript
interface HttpClient {
  get(url: string): Promise<any>;
  post(url: string, data: any): Promise<any>;
}

class BasicHttpClient implements HttpClient {
  async get(url: string) { return (await fetch(url)).json(); }
  async post(url: string, data: any) {
    return (await fetch(url, {
      method: 'POST', body: JSON.stringify(data)
    })).json();
  }
}

class AuthHttpClient implements HttpClient {
  constructor(private client: HttpClient, private token: string) {}
  async get(url: string) {
    return this.client.get(`${url}?token=${this.token}`);
  }
  async post(url: string, data: any) {
    return this.client.post(url, { ...data, token: this.token });
  }
}

class LoggingHttpClient implements HttpClient {
  constructor(private client: HttpClient) {}
  async get(url: string) {
    console.log(`GET ${url}`);
    return this.client.get(url);
  }
  async post(url: string, data: any) {
    console.log(`POST ${url}`, data);
    return this.client.post(url, data);
  }
}

class CachingHttpClient implements HttpClient {
  private cache = new Map<string, any>();
  constructor(private client: HttpClient, private ttl = 5000) {}

  async get(url: string) {
    if (this.cache.has(url)) return this.cache.get(url);
    const result = await this.client.get(url);
    this.cache.set(url, result);
    setTimeout(() => this.cache.delete(url), this.ttl);
    return result;
  }
  async post(url: string, data: any) {
    return this.client.post(url, data); // No caching for POST
  }
}

// ✅ Stack decorators transparently
let client: HttpClient = new BasicHttpClient();
client = new AuthHttpClient(client, 'secret_token');
client = new LoggingHttpClient(client);
client = new CachingHttpClient(client, 10000);
```

**React Higher-Order Components (decorator pattern):**

```typescript
function withLoading<P extends { data: any }>(
  Component: React.ComponentType<P>
): React.ComponentType<P & { isLoading: boolean }> {
  return (props) => {
    if (props.isLoading) return <div>Loading...</div>;
    return <Component {...props} />;
  };
}

function withErrorBoundary<P>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return class extends React.Component<P, { hasError: boolean }> {
    state = { hasError: false };
    componentDidCatch() { this.setState({ hasError: true }); }
    render() {
      if (this.state.hasError) return <div>Something went wrong</div>;
      return <Component {...this.props} />;
    }
  };
}

const EnhancedList = withErrorBoundary(withLoading(UserList));
```

#### Comparison

| Use case | Suitable | Reason |
|----------|----------|--------|
| Add responsibilities dynamically | Yes | Runtime behavior addition |
| Avoid subclass explosion | Yes | Combine features via stacking instead of inheritance |
| Open/Closed principle | Yes | Extend without modifying |
| Simple inheritance suffices | No | Decorator adds unnecessary wrapping |

| Pattern | Purpose |
|---------|---------|
| Decorator | Adds new behavior (enhancement) |
| Proxy | Controls access to an object (access control) |
| Adapter | Converts one interface to match another (compatibility) |

#### Interview guidance

**How to explain it:**

> "Decorator attaches additional responsibilities to an object dynamically by wrapping it. It provides a flexible alternative to subclassing — you can stack multiple decorators to compose complex behavior while keeping the same interface."

**Common follow-ups:**

| Question | Key points |
|----------|------------|
| Decorator vs Proxy? | Decorator adds functionality (enhancement). Proxy controls access (access control, lazy loading). Both wrap objects but with different intent |
| TypeScript decorators vs GoF Decorator? | TypeScript decorators are compile-time metaprogramming annotations (`@LogClass`). GoF Decorator wraps objects at runtime. Similar concept, different implementation level |
| Can decorator order matter? | Yes. Stacking LoggingDecorator then CachingDecorator logs cache hits. Reversing the order logs only network requests. Document expected order |

**Difficulty:** Intermediate

---

### Q7: Proxy Pattern

The Proxy pattern provides a surrogate or placeholder for another object to control access to it. Common proxy types include Virtual (lazy loading), Protection (access control), Remote (network calls), and Smart (logging, reference counting).

#### Syntax

| Element | Description |
|---------|-------------|
| Subject interface | Common interface for Real Subject and Proxy |
| Real Subject | The actual object performing the work |
| Proxy | Controls access to the Real Subject, same interface |

| Proxy type | Purpose | Example |
|------------|---------|---------|
| Virtual | Lazy loading | Defer expensive image loading |
| Protection | Access control | User permission checks |
| Remote | Network access | RPC, web service calls |
| Smart | Additional logic | Logging, caching, reference counting |

#### Description

A Proxy holds a reference to the Real Subject and intercepts calls to it. The client interacts with the Proxy through the same interface as the Real Subject, unaware that a proxy is involved. JavaScript provides a built-in `Proxy` object for creating proxies at the language level.

#### Examples

**Virtual Proxy — lazy loading:**

```typescript
interface Image {
  display(): void;
}

class RealImage implements Image {
  constructor(private filename: string) {
    this.loadFromDisk(); // Expensive operation
  }
  private loadFromDisk(): void {
    console.log(`Loading ${this.filename} from disk...`);
  }
  display(): void {
    console.log(`Displaying ${this.filename}`);
  }
}

class ImageProxy implements Image {
  private realImage: RealImage | null = null;
  constructor(private filename: string) {}

  display(): void {
    if (!this.realImage) {
      this.realImage = new RealImage(this.filename); // Load on first use
    }
    this.realImage.display();
  }
}

const image = new ImageProxy('photo.jpg');
// ✅ Image not loaded yet
image.display(); // Loads, then displays
image.display(); // Already loaded — just displays
```

**Protection Proxy — access control:**

```typescript
interface BankAccount {
  deposit(amount: number): void;
  withdraw(amount: number): void;
  getBalance(): number;
}

class RealBankAccount implements BankAccount {
  private balance = 0;
  deposit(amount: number) {
    this.balance += amount;
    console.log(`Deposited $${amount}. Balance: $${this.balance}`);
  }
  withdraw(amount: number) {
    if (amount <= this.balance) {
      this.balance -= amount;
      console.log(`Withdrew $${amount}. Balance: $${this.balance}`);
    } else console.log('Insufficient funds');
  }
  getBalance() { return this.balance; }
}

class BankAccountProxy implements BankAccount {
  private account = new RealBankAccount();
  constructor(private permissions: string[]) {}

  private hasPermission(action: string): boolean {
    return this.permissions.includes(action);
  }
  deposit(amount: number) {
    if (!this.hasPermission('deposit'))
      return console.log('Access denied: deposit');
    this.account.deposit(amount);
  }
  withdraw(amount: number) {
    if (!this.hasPermission('withdraw'))
      return console.log('Access denied: withdraw');
    this.account.withdraw(amount);
  }
  getBalance() {
    if (!this.hasPermission('view_balance')) return -1;
    return this.account.getBalance();
  }
}

const admin = new BankAccountProxy(['deposit', 'withdraw', 'view_balance']);
admin.deposit(1000);  // ✅ Success

const guest = new BankAccountProxy(['view_balance']);
guest.deposit(100);   // ❌ Access denied
```

**Caching Proxy:**

```typescript
interface DataService {
  fetchData(id: string): Promise<any>;
}

class RealDataService implements DataService {
  async fetchData(id: string) {
    console.log(`Fetching ${id} from database...`);
    await new Promise(r => setTimeout(r, 1000)); // Simulate delay
    return { id, data: `Data for ${id}` };
  }
}

class CachingProxy implements DataService {
  private cache = new Map<string, any>();
  private service = new RealDataService();

  async fetchData(id: string) {
    if (this.cache.has(id)) {
      console.log(`Cache hit for ${id}`);
      return this.cache.get(id);
    }
    const data = await this.service.fetchData(id);
    this.cache.set(id, data);
    return data;
  }
}
```

**ES6 Proxy (built-in):**

```javascript
const person = { name: 'John', age: 30 };

const proxy = new Proxy(person, {
  get(target, prop) {
    console.log(`Getting ${String(prop)}`);
    return target[prop];
  },
  set(target, prop, value) {
    if (prop === 'age' && typeof value !== 'number') {
      throw new TypeError('Age must be a number');
    }
    target[prop] = value;
    return true;
  }
});

proxy.name;      // ✅ Logs "Getting name", returns "John"
proxy.age = 31;  // ✅ Valid
proxy.age = 'x'; // ❌ TypeError: Age must be a number
```

**Rate-limiting Proxy:**

```typescript
class APIClient {
  async makeRequest(endpoint: string) {
    console.log(`Request to ${endpoint}`);
    return { data: 'Response' };
  }
}

class RateLimitingProxy {
  private client = new APIClient();
  private requests = 0;
  private resetTime: number;

  constructor(private maxRequests: number, private windowMs: number) {
    this.resetTime = Date.now() + windowMs;
  }

  async makeRequest(endpoint: string) {
    if (Date.now() > this.resetTime) {
      this.requests = 0;
      this.resetTime = Date.now() + this.windowMs;
    }
    if (this.requests >= this.maxRequests) {
      throw new Error('Rate limit exceeded');
    }
    this.requests++;
    return this.client.makeRequest(endpoint);
  }
}
```

**Generic logging Proxy:**

```typescript
function createLoggingProxy<T extends object>(target: T, name: string): T {
  return new Proxy(target, {
    get(obj, prop: string) {
      const value = (obj as any)[prop];
      if (typeof value === 'function') {
        return function (...args: any[]) {
          console.log(`[${name}] ${prop}(`, args, ')');
          const result = value.apply(obj, args);
          console.log(`[${name}] ${prop} =>`, result);
          return result;
        };
      }
      return value;
    }
  });
}

const calc = { add: (a: number, b: number) => a + b };
const logged = createLoggingProxy(calc, 'Calc');
logged.add(2, 3); // ✅ Logs call and return value
```

#### Comparison

| Use case | Suitable | Reason |
|----------|----------|--------|
| Lazy loading | Yes | Defer expensive initialization |
| Access control | Yes | Restrict operations by permission |
| Caching | Yes | Store and reuse expensive results |
| Logging / monitoring | Yes | Intercept and record access |
| Direct access is sufficient | No | Proxy adds unnecessary indirection |

#### Interview guidance

**How to explain it:**

> "Proxy provides a surrogate object that controls access to another object. It uses the same interface as the real object, so the client is unaware of the proxy. Common uses include lazy loading, access control, caching, and logging."

**Common follow-ups:**

| Question | Key points |
|----------|------------|
| Virtual Proxy vs Lazy Initialization? | Virtual Proxy is a design pattern that uses lazy initialization as an implementation technique. The Proxy provides the same interface as the real object, hiding the deferred loading from the client |
| Proxy vs Decorator? | Proxy controls access to an object. Decorator adds behavior to an object. Both wrap objects but differ in intent |
| ES6 Proxy use cases? | Validation, property access interception, reactive data binding (Vue.js), operator overloading, default property values |

**Difficulty:** Intermediate

---

### Q8: Facade Pattern

The Facade pattern provides a simplified, unified interface to a complex subsystem. It hides the complexity of multiple interacting classes behind a single, easy-to-use API.

#### Syntax

| Element | Description |
|---------|-------------|
| Facade | Single class with simple methods that orchestrate the subsystem |
| Subsystem classes | Complex internal classes that do the real work |
| Client | Interacts only with the Facade |

#### Description

Facade does not add new functionality — it simplifies access to existing functionality. The subsystem classes remain accessible directly if needed, but most clients only use the Facade. This promotes loose coupling between clients and subsystems.

> **Note:** Facade is one of the most commonly used patterns in real-world applications. API clients, ORMs, and SDK wrappers are all facades.

#### Examples

**Home theater system:**

```typescript
class DVDPlayer {
  on() { console.log('DVD Player on'); }
  play(movie: string) { console.log(`Playing "${movie}"`); }
  stop() { console.log('DVD stopped'); }
  off() { console.log('DVD Player off'); }
}

class Projector {
  on() { console.log('Projector on'); }
  wideScreenMode() { console.log('Wide screen mode'); }
  off() { console.log('Projector off'); }
}

class SoundSystem {
  on() { console.log('Sound system on'); }
  setVolume(level: number) { console.log(`Volume: ${level}`); }
  setSurroundSound() { console.log('Surround sound enabled'); }
  off() { console.log('Sound system off'); }
}

class Lights {
  dim(level: number) { console.log(`Lights dimmed to ${level}%`); }
  on() { console.log('Lights on'); }
}

// Facade — one method replaces many subsystem calls
class HomeTheaterFacade {
  constructor(
    private dvd: DVDPlayer,
    private projector: Projector,
    private sound: SoundSystem,
    private lights: Lights
  ) {}

  watchMovie(movie: string): void {
    this.lights.dim(10);
    this.projector.on();
    this.projector.wideScreenMode();
    this.sound.on();
    this.sound.setSurroundSound();
    this.sound.setVolume(15);
    this.dvd.on();
    this.dvd.play(movie);
  }

  endMovie(): void {
    this.dvd.stop();
    this.dvd.off();
    this.sound.off();
    this.projector.off();
    this.lights.on();
  }
}

// ✅ Client uses one simple call
const theater = new HomeTheaterFacade(
  new DVDPlayer(), new Projector(), new SoundSystem(), new Lights()
);
theater.watchMovie('Inception');
theater.endMovie();
```

**Payment processing Facade:**

```typescript
class PaymentValidator {
  validateCard(cardNumber: string) { return cardNumber.length === 16; }
  validateAmount(amount: number) { return amount > 0 && amount < 10000; }
}

class FraudDetection {
  check(userId: string, amount: number) { return amount < 5000; }
}

class PaymentGateway {
  charge(amount: number, card: string) {
    return Promise.resolve('txn_' + Math.random().toString(36).slice(2));
  }
}

class NotificationService {
  sendEmail(userId: string, msg: string) {
    console.log(`Email to ${userId}: ${msg}`);
  }
}

class TransactionLogger {
  log(transaction: any) { console.log('Logged:', transaction); }
}

// Facade — one method orchestrates five subsystems
class PaymentFacade {
  private validator = new PaymentValidator();
  private fraud = new FraudDetection();
  private gateway = new PaymentGateway();
  private notify = new NotificationService();
  private logger = new TransactionLogger();

  async processPayment(userId: string, amount: number, card: string) {
    if (!this.validator.validateCard(card))
      return { success: false, error: 'Invalid card' };
    if (!this.validator.validateAmount(amount))
      return { success: false, error: 'Invalid amount' };
    if (!this.fraud.check(userId, amount))
      return { success: false, error: 'Flagged as fraud' };

    const txnId = await this.gateway.charge(amount, card);
    this.logger.log({ userId, amount, txnId });
    this.notify.sendEmail(userId, `Payment of $${amount} successful`);
    return { success: true, transactionId: txnId };
  }
}

// ✅ Client uses one call
const payment = new PaymentFacade();
await payment.processPayment('user123', 100, '1234567890123456');
```

**Database Facade (simplified ORM):**

```typescript
class ConnectionPool {
  getConnection() { return {}; }
  releaseConnection(conn: any) {}
}

class QueryExecutor {
  async execute(query: string, params: any[]) { return []; }
}

class TransactionManager {
  async begin() {}
  async commit() {}
  async rollback() {}
}

// Facade hides connection pooling, transactions, mapping
class Database {
  private pool = new ConnectionPool();
  private executor = new QueryExecutor();
  private txn = new TransactionManager();

  async find<T>(table: string, id: number): Promise<T | null> {
    const conn = this.pool.getConnection();
    try {
      const rows = await this.executor.execute(
        `SELECT * FROM ${table} WHERE id = ?`, [id]
      );
      return (rows[0] as T) || null;
    } finally {
      this.pool.releaseConnection(conn);
    }
  }

  async save(table: string, data: any): Promise<void> {
    const conn = this.pool.getConnection();
    try {
      await this.txn.begin();
      // insert/update logic
      await this.txn.commit();
    } catch (error) {
      await this.txn.rollback();
      throw error;
    } finally {
      this.pool.releaseConnection(conn);
    }
  }
}

// ✅ Simple
const db = new Database();
const user = await db.find('users', 123);
```

#### Comparison

| Use case | Suitable | Reason |
|----------|----------|--------|
| Complex subsystem with many classes | Yes | Simplifies client interaction |
| Multi-step common workflow | Yes | Encapsulates repeated sequences |
| Third-party library wrapping | Yes | Provides stable, simple interface |
| Already simple system | No | Adds unnecessary indirection |

| Pattern | Purpose |
|---------|---------|
| Facade | Simplifies a complex subsystem (many to one) |
| Adapter | Converts one interface to another (compatibility) |
| Mediator | Coordinates communication between objects |

#### Interview guidance

**How to explain it:**

> "Facade provides a simplified unified interface to a complex subsystem. It does not add new functionality — it makes existing functionality easier to use by hiding complexity behind a single API."

**Common follow-ups:**

| Question | Key points |
|----------|------------|
| Facade vs Adapter? | Facade simplifies (many classes to one simple interface). Adapter converts (one incompatible interface to another). Facade creates a new simpler interface; Adapter makes existing interfaces work together |
| Does Facade violate Single Responsibility? | It can, if the Facade does too much. A well-designed Facade delegates all work to subsystem classes and only orchestrates the workflow. Split large Facades into domain-specific ones |

**Difficulty:** Beginner

---

### Q9: Composite Pattern

The Composite pattern composes objects into tree structures to represent part-whole hierarchies. It lets clients treat individual objects (leaves) and compositions (composites) uniformly through a shared interface.

#### Syntax

| Element | Description |
|---------|-------------|
| Component | Common interface for leaves and composites |
| Leaf | End object with no children |
| Composite | Object that contains children (leaves or other composites) |
| `add()` / `remove()` | Methods on Composite to manage children |

#### Description

Composite enables recursive composition. A Composite node delegates operations to its children, which may be leaves or other composites. This is the same pattern used in file systems (files and folders), UI component trees, and organizational hierarchies.

> **Note:** The key insight is uniform treatment — the client calls the same method on both a leaf and a composite. The composite recursively aggregates results from its children.

#### Examples

**File system:**

```typescript
interface FileSystemComponent {
  getName(): string;
  getSize(): number;
  print(indent?: string): void;
}

class File implements FileSystemComponent {
  constructor(private name: string, private size: number) {}
  getName() { return this.name; }
  getSize() { return this.size; }
  print(indent = '') {
    console.log(`${indent}${this.name} (${this.size} KB)`);
  }
}

class Folder implements FileSystemComponent {
  private children: FileSystemComponent[] = [];
  constructor(private name: string) {}

  add(component: FileSystemComponent) { this.children.push(component); }
  remove(component: FileSystemComponent) {
    const i = this.children.indexOf(component);
    if (i !== -1) this.children.splice(i, 1);
  }

  getName() { return this.name; }
  getSize() {
    // Recursively sums all children
    return this.children.reduce((sum, c) => sum + c.getSize(), 0);
  }
  print(indent = '') {
    console.log(`${indent}${this.name}/ (${this.getSize()} KB)`);
    this.children.forEach(c => c.print(indent + '  '));
  }
}

const root = new Folder('root');
const docs = new Folder('documents');
docs.add(new File('resume.pdf', 250));
docs.add(new File('cover-letter.doc', 150));
root.add(docs);
root.add(new File('system.log', 50));
root.print();
// ✅ root/ (450 KB)
//      documents/ (400 KB)
//        resume.pdf (250 KB)
//        cover-letter.doc (150 KB)
//      system.log (50 KB)
```

**Organization structure:**

```typescript
interface Employee {
  getName(): string;
  getSalary(): number;
  print(indent?: string): void;
}

class Developer implements Employee {
  constructor(private name: string, private salary: number) {}
  getName() { return this.name; }
  getSalary() { return this.salary; }
  print(indent = '') {
    console.log(`${indent}${this.name} (Developer) - $${this.salary}`);
  }
}

class Manager implements Employee {
  private team: Employee[] = [];
  constructor(private name: string, private salary: number) {}

  addTeamMember(employee: Employee) { this.team.push(employee); }
  getName() { return this.name; }
  getSalary() {
    // Total includes own salary + all reports
    return this.salary + this.team.reduce((s, e) => s + e.getSalary(), 0);
  }
  print(indent = '') {
    console.log(`${indent}${this.name} (Manager) - $${this.salary}`);
    console.log(`${indent}  Team budget: $${this.getSalary()}`);
    this.team.forEach(m => m.print(indent + '  '));
  }
}

const cto = new Manager('Alice', 150000);
const lead = new Manager('Bob', 120000);
lead.addTeamMember(new Developer('Charlie', 90000));
lead.addTeamMember(new Developer('Diana', 85000));
cto.addTeamMember(lead);
cto.print();
```

**UI component tree:**

```typescript
interface UIComponent {
  render(): string;
}

class Button implements UIComponent {
  constructor(private text: string) {}
  render() { return `<button>${this.text}</button>`; }
}

class Input implements UIComponent {
  constructor(private type: string, private placeholder: string) {}
  render() {
    return `<input type="${this.type}" placeholder="${this.placeholder}" />`;
  }
}

class Container implements UIComponent {
  private children: UIComponent[] = [];
  constructor(private tag = 'div') {}

  add(component: UIComponent) { this.children.push(component); }

  render(): string {
    const inner = this.children.map(c => c.render()).join('\n  ');
    return `<${this.tag}>\n  ${inner}\n</${this.tag}>`;
  }
}

const form = new Container('form');
form.add(new Input('text', 'Enter name'));
form.add(new Input('email', 'Enter email'));

const buttons = new Container('div');
buttons.add(new Button('Submit'));
buttons.add(new Button('Cancel'));
form.add(buttons);

console.log(form.render());
```

**Menu system:**

```typescript
interface MenuComponent {
  execute(): void;
  print(indent?: string): void;
}

class MenuItem implements MenuComponent {
  constructor(private name: string, private action: () => void) {}
  execute() { this.action(); }
  print(indent = '') { console.log(`${indent}- ${this.name}`); }
}

class Menu implements MenuComponent {
  private items: MenuComponent[] = [];
  constructor(private name: string) {}

  add(item: MenuComponent) { this.items.push(item); }
  execute() { console.log(`Opening menu: ${this.name}`); }
  print(indent = '') {
    console.log(`${indent}${this.name}`);
    this.items.forEach(i => i.print(indent + '  '));
  }
}

const mainMenu = new Menu('Main');
const fileMenu = new Menu('File');
fileMenu.add(new MenuItem('New', () => console.log('New file')));
fileMenu.add(new MenuItem('Open', () => console.log('Open file')));
mainMenu.add(fileMenu);
mainMenu.print();
```

#### Comparison

| Use case | Suitable | Reason |
|----------|----------|--------|
| Part-whole hierarchies | Yes | Trees: file system, UI, org chart |
| Uniform treatment of items | Yes | Client calls same method on leaf and composite |
| Recursive structures | Yes | Composites contain other composites |
| Fundamentally different objects | No | Cannot share a meaningful interface |

#### Interview guidance

**How to explain it:**

> "Composite composes objects into tree structures to represent part-whole hierarchies. Clients treat individual objects and compositions uniformly through a shared interface."

**Common follow-ups:**

| Question | Key points |
|----------|------------|
| How to handle leaf-specific methods? | Three approaches: (1) Add to component interface but throw in Composite (GoF approach). (2) Type check before calling (less type-safe). (3) Separate interfaces for Leaf and Composite (most type-safe but loses uniformity). It is a trade-off between type safety and uniform treatment |
| Real-world examples? | File systems (`File`/`Folder`), React component tree, DOM nodes, organizational charts, menu systems, mathematical expression trees |

**Difficulty:** Intermediate

---

### Q10: Observer Pattern

The Observer pattern defines a one-to-many dependency between objects. When one object (the Subject) changes state, all its dependents (Observers) are notified and updated automatically. It implements a publish-subscribe mechanism.

#### Syntax

| Element | Description |
|---------|-------------|
| Subject (Publisher) | Maintains a list of observers, sends notifications |
| Observer (Subscriber) | Defines an `update()` method called on state change |
| `attach()` / `subscribe()` | Registers an observer |
| `detach()` / `unsubscribe()` | Removes an observer |
| `notify()` | Iterates observers and calls `update()` |

#### Description

Observer decouples the subject from its dependents. The subject does not need to know the concrete classes of its observers — only that they implement the `update()` interface. This pattern is the foundation of event systems, data binding, and reactive programming.

> **Warning:** Observers that are not detached can cause memory leaks because the subject holds references that prevent garbage collection. Always provide and use an unsubscribe mechanism. In React, use `useEffect` cleanup; in Angular, unsubscribe from Observables.

#### Examples

**Classic Observer:**

```typescript
interface Observer {
  update(data: any): void;
}

interface Subject {
  attach(observer: Observer): void;
  detach(observer: Observer): void;
  notify(): void;
}

class NewsAgency implements Subject {
  private observers: Observer[] = [];
  private news = '';

  attach(observer: Observer) {
    if (!this.observers.includes(observer))
      this.observers.push(observer);
  }

  detach(observer: Observer) {
    const i = this.observers.indexOf(observer);
    if (i !== -1) this.observers.splice(i, 1);
  }

  notify() {
    this.observers.forEach(o => o.update(this.news));
  }

  setNews(news: string) {
    this.news = news;
    this.notify(); // Automatically notifies all observers
  }
}

class NewsChannel implements Observer {
  constructor(private name: string) {}
  update(news: string) {
    console.log(`${this.name} received: ${news}`);
  }
}

const agency = new NewsAgency();
const cnn = new NewsChannel('CNN');
const bbc = new NewsChannel('BBC');
agency.attach(cnn);
agency.attach(bbc);

agency.setNews('Major event!');
// ✅ CNN received: Major event!
// ✅ BBC received: Major event!

agency.detach(bbc);
agency.setNews('Economy update');
// ✅ Only CNN receives this
```

**Event Emitter (Node.js style):**

```typescript
type EventHandler = (...args: any[]) => void;

class EventEmitter {
  private events = new Map<string, EventHandler[]>();

  on(event: string, handler: EventHandler) {
    if (!this.events.has(event)) this.events.set(event, []);
    this.events.get(event)!.push(handler);
  }

  off(event: string, handler: EventHandler) {
    const handlers = this.events.get(event);
    if (!handlers) return;
    const i = handlers.indexOf(handler);
    if (i !== -1) handlers.splice(i, 1);
  }

  emit(event: string, ...args: any[]) {
    this.events.get(event)?.forEach(h => h(...args));
  }

  once(event: string, handler: EventHandler) {
    const wrapper = (...args: any[]) => {
      handler(...args);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }
}

const emitter = new EventEmitter();
emitter.on('login', (name) => console.log(`Welcome ${name}!`));
emitter.once('firstVisit', (name) => console.log(`Tutorial for ${name}`));

emitter.emit('login', 'Alice');
emitter.emit('firstVisit', 'Alice');
emitter.emit('firstVisit', 'Alice'); // ✅ No output — once handler removed
```

**Stock market tracker:**

```typescript
interface StockObserver {
  update(stock: string, price: number): void;
}

class StockMarket {
  private observers: StockObserver[] = [];
  private prices = new Map<string, number>();

  subscribe(observer: StockObserver) { this.observers.push(observer); }
  unsubscribe(observer: StockObserver) {
    const i = this.observers.indexOf(observer);
    if (i !== -1) this.observers.splice(i, 1);
  }

  setPrice(symbol: string, price: number) {
    const old = this.prices.get(symbol);
    this.prices.set(symbol, price);
    // Notify only on significant change (>1%)
    if (!old || Math.abs(price - old) / old > 0.01) {
      this.observers.forEach(o => o.update(symbol, price));
    }
  }
}

class PriceAlert implements StockObserver {
  constructor(private symbol: string, private target: number) {}
  update(stock: string, price: number) {
    if (stock === this.symbol && price >= this.target) {
      console.log(`ALERT: ${stock} reached $${price}!`);
    }
  }
}

class PortfolioTracker implements StockObserver {
  private holdings = new Map<string, number>();
  addHolding(symbol: string, shares: number) {
    this.holdings.set(symbol, shares);
  }
  update(stock: string, price: number) {
    const shares = this.holdings.get(stock);
    if (shares) {
      console.log(`${stock}: ${shares} shares = $${(shares * price).toFixed(2)}`);
    }
  }
}
```

**Reactive state management (Redux-like):**

```typescript
type Subscriber<T> = (state: T) => void;

class Store<T> {
  private state: T;
  private subscribers: Subscriber<T>[] = [];

  constructor(initialState: T) { this.state = initialState; }

  getState(): T { return this.state; }

  setState(partial: Partial<T>) {
    this.state = { ...this.state, ...partial };
    this.subscribers.forEach(s => s(this.state));
  }

  subscribe(subscriber: Subscriber<T>): () => void {
    this.subscribers.push(subscriber);
    subscriber(this.state); // Initial notification
    // Return unsubscribe function
    return () => {
      const i = this.subscribers.indexOf(subscriber);
      if (i !== -1) this.subscribers.splice(i, 1);
    };
  }
}

interface AppState { user: string | null; count: number; }

const store = new Store<AppState>({ user: null, count: 0 });
const unsub = store.subscribe(state => console.log('State:', state));

store.setState({ user: 'Alice' });
store.setState({ count: 1 });
unsub(); // ✅ Stop listening
store.setState({ count: 2 }); // No output
```

#### Comparison

| Use case | Suitable | Reason |
|----------|----------|--------|
| One-to-many notifications | Yes | Multiple objects need updates |
| Loose coupling | Yes | Subject does not know concrete observers |
| Event systems / UI events | Yes | DOM events, custom events |
| Data binding / reactivity | Yes | React, Vue, spreadsheets |
| Update order matters | Caution | Observer order is not guaranteed |
| Performance-critical with many observers | Caution | Notification overhead scales linearly |

| Mechanism | Coupling | Flexibility |
|-----------|----------|-------------|
| Observer | Medium — subject holds observer references | Direct notification |
| Pub/Sub | Low — event channel decouples both sides | Topic filtering, async support |
| Reactive Streams | Low — declarative operators | Composable, backpressure support |

#### Interview guidance

**How to explain it:**

> "Observer defines a one-to-many dependency so that when one object changes state, all dependents are notified automatically. It decouples the subject from its observers through a shared interface."

**Common follow-ups:**

| Question | Key points |
|----------|------------|
| Observer vs Pub/Sub? | Observer: subject maintains observer references directly (tighter coupling). Pub/Sub: an event channel decouples publishers and subscribers (looser coupling, topic filtering). Pub/Sub is more flexible; Observer is simpler |
| Memory leak concerns? | Observers prevent garbage collection if not detached. Solutions: (1) provide unsubscribe/detach. (2) Use weak references (`WeakRef`). (3) Automatic cleanup on component unmount (React `useEffect` cleanup, Angular `ngOnDestroy`). Always clean up observers |
| Where is Observer used in frameworks? | React `useState`/`useEffect`, Angular `Observable`/`Subject`, Vue reactivity system, Node.js `EventEmitter`, DOM `addEventListener` |

**Difficulty:** Intermediate

---

## See also

- [JavaScript Interview Mastery Guide](./javascript-interview-mastery-guide.md) — JavaScript fundamentals including prototypal inheritance, closures, and async patterns
- [TypeScript Interview Mastery Guide](./typescript-interview-mastery-guide.md) — TypeScript type system, generics, and advanced types
- [React Interview Mastery Guide](./react-interview-mastery-guide.md) — React patterns including HOCs, render props, and hooks
- [System Design Interview Mastery Guide](./system-design-interview-mastery-guide.md) — System-level patterns and architecture
- [DSA Interview Mastery Guide](./dsa-interview-mastery-guide.md) — Data structures and algorithms
