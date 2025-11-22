# Lesson 13: Design Patterns

## What are Design Patterns?

**Design Patterns**: Proven solutions to common programming problems.

---

## Creational Patterns

### 1. Singleton
```typescript
class Database {
  private static instance: Database;

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

let db1 = Database.getInstance();
let db2 = Database.getInstance();
console.log(db1 === db2);  // true (same instance)
```

### 2. Factory
```typescript
class VehicleFactory {
  static createVehicle(type: string) {
    switch (type) {
      case 'car':
        return new Car();
      case 'bike':
        return new Bike();
      default:
        throw new Error('Unknown type');
    }
  }
}

let vehicle = VehicleFactory.createVehicle('car');
```

---

## Structural Patterns

### 1. Decorator
```typescript
class Car {
  cost(): number {
    return 1000000;
  }
}

class CarWithGPS extends Car {
  cost(): number {
    return super.cost() + 50000;
  }
}

class CarWithSunroof extends Car {
  cost(): number {
    return super.cost() + 100000;
  }
}
```

---

## Behavioral Patterns

### 1. Observer
```typescript
class CarListing {
  private observers: Function[] = [];

  subscribe(fn: Function) {
    this.observers.push(fn);
  }

  notify(event: string) {
    this.observers.forEach(fn => fn(event));
  }

  updatePrice(newPrice: number) {
    this.notify(`Price updated to ${newPrice}`);
  }
}
```

**Next Lesson**: [14-solid-principles.md](14-solid-principles.md)
