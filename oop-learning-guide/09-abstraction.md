# Lesson 09: Abstraction

## What is Abstraction?

**Abstraction**: Hide complex implementation, show only essentials.

**Benefits**:
- Simplicity
- Focus on "what" not "how"
- Reduce complexity

---

## Abstract Classes (TypeScript)

```typescript
abstract class Vehicle {
  constructor(public brand: string) {}

  // Abstract method - must be implemented by subclasses
  abstract start(): void;
  abstract stop(): void;

  // Concrete method - can be used as-is
  getInfo(): string {
    return `Vehicle: ${this.brand}`;
  }
}

class Car extends Vehicle {
  start(): void {
    console.log(`${this.brand} car started`);
  }

  stop(): void {
    console.log(`${this.brand} car stopped`);
  }
}

// let vehicle = new Vehicle("Honda");  // ❌ Error: Cannot instantiate abstract class
let car = new Car("Honda");  // ✅ Can instantiate concrete class
car.start();
```

---

## Interfaces (TypeScript)

```typescript
interface IVehicle {
  brand: string;
  model: string;
  start(): void;
  stop(): void;
}

class Car implements IVehicle {
  constructor(public brand: string, public model: string) {}

  start(): void {
    console.log("Car started");
  }

  stop(): void {
    console.log("Car stopped");
  }
}
```

---

## VahanHelp Example

```typescript
abstract class Listing {
  constructor(
    public id: string,
    public title: string,
    public price: number
  ) {}

  abstract calculateFees(): number;
  abstract isEligibleForPromotion(): boolean;

  getNetPrice(): number {
    return this.price - this.calculateFees();
  }
}

class CarListing extends Listing {
  constructor(
    id: string,
    title: string,
    price: number,
    public year: number,
    public mileage: number
  ) {
    super(id, title, price);
  }

  calculateFees(): number {
    return this.price * 0.05;  // 5% fee for cars
  }

  isEligibleForPromotion(): boolean {
    const age = new Date().getFullYear() - this.year;
    return age <= 3 && this.mileage < 50000;
  }
}

class BikeListing extends Listing {
  constructor(
    id: string,
    title: string,
    price: number,
    public engineCC: number
  ) {
    super(id, title, price);
  }

  calculateFees(): number {
    return this.price * 0.03;  // 3% fee for bikes
  }

  isEligibleForPromotion(): boolean {
    return this.engineCC >= 300;  // Bikes above 300cc eligible
  }
}
```

**Next Lesson**: [10-composition.md](10-composition.md)
