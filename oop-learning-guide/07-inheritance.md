# Lesson 07: Inheritance

## What is Inheritance?

**Inheritance**: Create new classes based on existing classes.

**Benefits**:
- Code reuse
- Establish relationships
- Extend functionality

---

## Basic Inheritance

```typescript
// Parent class (Base class)
class Vehicle {
  constructor(public brand: string, public model: string) {}

  start() {
    console.log(`${this.brand} started`);
  }

  stop() {
    console.log(`${this.brand} stopped`);
  }
}

// Child class (Derived class)
class Car extends Vehicle {
  constructor(brand: string, model: string, public seats: number) {
    super(brand, model);  // Call parent constructor
  }

  honk() {
    console.log("Beep beep!");
  }
}

let car = new Car("Honda", "City", 5);
car.start();  // Inherited from Vehicle
car.honk();   // Car's own method
```

---

## Method Overriding

```typescript
class Vehicle {
  start() {
    console.log("Vehicle started");
  }
}

class Car extends Vehicle {
  start() {  // Override parent method
    super.start();  // Call parent method
    console.log("Car engine started");
  }
}

let car = new Car();
car.start();
// Output:
// Vehicle started
// Car engine started
```

---

## VahanHelp Example

```typescript
// Base class
class Vehicle {
  constructor(
    public id: string,
    public brand: string,
    public model: string,
    public year: number,
    public price: number
  ) {}

  getInfo(): string {
    return `${this.brand} ${this.model} (${this.year})`;
  }

  calculateDepreciation(): number {
    const age = new Date().getFullYear() - this.year;
    return this.price * (1 - age * 0.1);
  }
}

// Car class
class Car extends Vehicle {
  constructor(
    id: string,
    brand: string,
    model: string,
    year: number,
    price: number,
    public fuelType: string,
    public seats: number
  ) {
    super(id, brand, model, year, price);
  }

  getInfo(): string {
    return `${super.getInfo()} - ${this.fuelType}, ${this.seats} seats`;
  }
}

// Bike class
class Bike extends Vehicle {
  constructor(
    id: string,
    brand: string,
    model: string,
    year: number,
    price: number,
    public engineCC: number
  ) {
    super(id, brand, model, year, price);
  }

  getInfo(): string {
    return `${super.getInfo()} - ${this.engineCC}cc`;
  }
}

// Usage
let car = new Car("C001", "Honda", "City", 2023, 1500000, "Petrol", 5);
let bike = new Bike("B001", "Royal Enfield", "Classic 350", 2023, 200000, 350);

console.log(car.getInfo());
// Honda City (2023) - Petrol, 5 seats

console.log(bike.getInfo());
// Royal Enfield Classic 350 (2023) - 350cc
```

---

## Multi-level Inheritance

```typescript
class Vehicle {
  start() {
    console.log("Vehicle started");
  }
}

class MotorVehicle extends Vehicle {
  refuel() {
    console.log("Refueling");
  }
}

class Car extends MotorVehicle {
  honk() {
    console.log("Beep!");
  }
}

let car = new Car();
car.start();  // From Vehicle
car.refuel(); // From MotorVehicle
car.honk();   // From Car
```

**Next Lesson**: [08-polymorphism.md](08-polymorphism.md)
