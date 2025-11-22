# OOP Quick Reference Cheatsheet

## The Four Pillars

### 1. Encapsulation 🔒
**Hide data, provide controlled access**

```typescript
class User {
  private password: string;

  constructor(password: string) {
    this.password = this.hash(password);
  }

  private hash(password: string): string {
    return `hashed_${password}`;
  }

  validatePassword(password: string): boolean {
    return this.hash(password) === this.password;
  }
}
```

### 2. Inheritance 👨‍👦
**Create new classes from existing ones**

```typescript
class Vehicle {
  constructor(public brand: string) {}
  start() { console.log("Started"); }
}

class Car extends Vehicle {
  constructor(brand: string, public model: string) {
    super(brand);
  }
}
```

### 3. Polymorphism 🎭
**Same interface, different behavior**

```typescript
abstract class Animal {
  abstract speak(): void;
}

class Dog extends Animal {
  speak() { console.log("Bark"); }
}

class Cat extends Animal {
  speak() { console.log("Meow"); }
}
```

### 4. Abstraction 🎨
**Hide complexity, show essentials**

```typescript
abstract class PaymentMethod {
  abstract process(amount: number): void;
}

class CreditCard extends PaymentMethod {
  process(amount: number) {
    console.log(`Processing ₹${amount}`);
  }
}
```

---

## Access Modifiers

```typescript
class Example {
  public publicProp;      // Accessible everywhere
  private privateProp;    // Only inside class
  protected protectedProp; // Inside class + subclasses
}
```

---

## SOLID Principles

**S** - Single Responsibility (one job)
**O** - Open/Closed (extend, don't modify)
**L** - Liskov Substitution (subtypes substitutable)
**I** - Interface Segregation (specific interfaces)
**D** - Dependency Inversion (depend on abstractions)

---

## Design Patterns

### Singleton
```typescript
class Database {
  private static instance: Database;
  static getInstance() {
    if (!this.instance) this.instance = new Database();
    return this.instance;
  }
}
```

### Factory
```typescript
class VehicleFactory {
  static create(type: string) {
    return type === 'car' ? new Car() : new Bike();
  }
}
```

### Observer
```typescript
class Subject {
  private observers: Function[] = [];
  subscribe(fn: Function) { this.observers.push(fn); }
  notify(data: any) { this.observers.forEach(fn => fn(data)); }
}
```

---

## Composition vs Inheritance

**Inheritance**: Is-A relationship
```typescript
class Car extends Vehicle {}  // Car IS-A Vehicle
```

**Composition**: Has-A relationship
```typescript
class Car {
  constructor(private engine: Engine) {}  // Car HAS-A Engine
}
```

**Prefer composition over inheritance!**

---

## Quick Syntax

### Class
```typescript
class Car {
  constructor(public brand: string, private price: number) {}

  getPrice(): number {
    return this.price;
  }
}
```

### Abstract Class
```typescript
abstract class Vehicle {
  abstract start(): void;
  stop() { console.log("Stopped"); }
}
```

### Interface
```typescript
interface IVehicle {
  brand: string;
  start(): void;
}

class Car implements IVehicle {
  constructor(public brand: string) {}
  start() {}
}
```

### Static
```typescript
class Math {
  static PI = 3.14;
  static square(n: number) { return n * n; }
}

console.log(Math.PI);
console.log(Math.square(5));
```

### Getters/Setters
```typescript
class Product {
  private _price: number;

  get price() { return this._price; }
  set price(value: number) {
    if (value < 0) throw new Error();
    this._price = value;
  }
}
```

---

**Use this cheatsheet for quick reference! 🚀**
