# Lesson 14: SOLID Principles

## S - Single Responsibility Principle

**One class, one responsibility.**

```typescript
// ❌ Bad
class User {
  saveToDatabase() {}
  sendEmail() {}
  generateReport() {}
}

// ✅ Good
class User {
  save() {}
}

class EmailService {
  send() {}
}

class ReportGenerator {
  generate() {}
}
```

---

## O - Open/Closed Principle

**Open for extension, closed for modification.**

```typescript
abstract class Shape {
  abstract area(): number;
}

class Circle extends Shape {
  constructor(private radius: number) { super(); }
  area(): number { return Math.PI * this.radius ** 2; }
}

class Square extends Shape {
  constructor(private side: number) { super(); }
  area(): number { return this.side ** 2; }
}
```

---

## L - Liskov Substitution Principle

**Subtypes must be substitutable for base types.**

```typescript
class Bird {
  fly() { console.log("Flying"); }
}

class Sparrow extends Bird {}  // ✅ Can fly

// ❌ Bad - Penguin cannot fly
class Penguin extends Bird {
  fly() { throw new Error("Cannot fly"); }
}

// ✅ Good - Better hierarchy
abstract class Bird {}

class FlyingBird extends Bird {
  fly() { console.log("Flying"); }
}

class Sparrow extends FlyingBird {}
class Penguin extends Bird {}  // Doesn't have fly()
```

---

## I - Interface Segregation Principle

**Many specific interfaces better than one general.**

```typescript
// ❌ Bad
interface Vehicle {
  drive(): void;
  fly(): void;
  sail(): void;
}

// ✅ Good
interface IDriveable {
  drive(): void;
}

interface IFlyable {
  fly(): void;
}

class Car implements IDriveable {
  drive() { console.log("Driving"); }
}

class Plane implements IDriveable, IFlyable {
  drive() { console.log("Taxiing"); }
  fly() { console.log("Flying"); }
}
```

---

## D - Dependency Inversion Principle

**Depend on abstractions, not concretions.**

```typescript
// ❌ Bad
class MySQLDatabase {
  save(data: any) {}
}

class UserService {
  private db = new MySQLDatabase();  // Tight coupling
}

// ✅ Good
interface IDatabase {
  save(data: any): void;
}

class MySQLDatabase implements IDatabase {
  save(data: any) {}
}

class MongoDatabase implements IDatabase {
  save(data: any) {}
}

class UserService {
  constructor(private db: IDatabase) {}  // Loose coupling
}

let service = new UserService(new MySQLDatabase());
```

**Next Lesson**: [15-best-practices.md](15-best-practices.md)
