# Design Patterns Reference Guide

## Creational Patterns

### 1. Singleton
**One instance only**

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
console.log(db1 === db2);  // true
```

### 2. Factory
**Create objects without specifying exact class**

```typescript
interface Vehicle {
  drive(): void;
}

class Car implements Vehicle {
  drive() { console.log("Car driving"); }
}

class Bike implements Vehicle {
  drive() { console.log("Bike driving"); }
}

class VehicleFactory {
  static create(type: string): Vehicle {
    switch (type) {
      case 'car': return new Car();
      case 'bike': return new Bike();
      default: throw new Error('Unknown type');
    }
  }
}

let vehicle = VehicleFactory.create('car');
vehicle.drive();
```

### 3. Builder
**Construct complex objects step by step**

```typescript
class Car {
  constructor(
    public brand?: string,
    public model?: string,
    public color?: string,
    public gps?: boolean
  ) {}
}

class CarBuilder {
  private car = new Car();

  setBrand(brand: string) {
    this.car.brand = brand;
    return this;
  }

  setModel(model: string) {
    this.car.model = model;
    return this;
  }

  setColor(color: string) {
    this.car.color = color;
    return this;
  }

  addGPS() {
    this.car.gps = true;
    return this;
  }

  build(): Car {
    return this.car;
  }
}

let car = new CarBuilder()
  .setBrand("Honda")
  .setModel("City")
  .setColor("White")
  .addGPS()
  .build();
```

---

## Structural Patterns

### 1. Decorator
**Add behavior dynamically**

```typescript
interface Car {
  cost(): number;
  description(): string;
}

class BasicCar implements Car {
  cost() { return 1000000; }
  description() { return "Basic Car"; }
}

class GPSDecorator implements Car {
  constructor(private car: Car) {}

  cost() { return this.car.cost() + 50000; }
  description() { return this.car.description() + " + GPS"; }
}

class SunroofDecorator implements Car {
  constructor(private car: Car) {}

  cost() { return this.car.cost() + 100000; }
  description() { return this.car.description() + " + Sunroof"; }
}

let car = new BasicCar();
car = new GPSDecorator(car);
car = new SunroofDecorator(car);

console.log(car.description());  // Basic Car + GPS + Sunroof
console.log(car.cost());         // 1150000
```

### 2. Adapter
**Convert interface to expected interface**

```typescript
interface IModernPayment {
  processPayment(amount: number): void;
}

class LegacyPayment {
  makePayment(amount: number) {
    console.log(`Legacy payment: ${amount}`);
  }
}

class PaymentAdapter implements IModernPayment {
  constructor(private legacyPayment: LegacyPayment) {}

  processPayment(amount: number) {
    this.legacyPayment.makePayment(amount);
  }
}

let legacy = new LegacyPayment();
let adapter = new PaymentAdapter(legacy);
adapter.processPayment(1000);  // Uses legacy system
```

### 3. Facade
**Simplified interface to complex system**

```typescript
class Engine {
  start() { console.log("Engine started"); }
}

class FuelSystem {
  pump() { console.log("Fuel pumped"); }
}

class ElectricalSystem {
  on() { console.log("Electrical on"); }
}

// Facade
class CarFacade {
  private engine = new Engine();
  private fuel = new FuelSystem();
  private electrical = new ElectricalSystem();

  startCar() {
    this.electrical.on();
    this.fuel.pump();
    this.engine.start();
    console.log("Car started!");
  }
}

let car = new CarFacade();
car.startCar();  // Simplified interface
```

---

## Behavioral Patterns

### 1. Observer
**Subscribe to events**

```typescript
type Observer = (data: any) => void;

class Subject {
  private observers: Observer[] = [];

  subscribe(observer: Observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer: Observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notify(data: any) {
    this.observers.forEach(observer => observer(data));
  }
}

class CarListing extends Subject {
  updatePrice(newPrice: number) {
    console.log(`Price updated to ${newPrice}`);
    this.notify({ event: 'priceUpdate', price: newPrice });
  }
}

let listing = new CarListing();
listing.subscribe(data => console.log("Observer 1:", data));
listing.subscribe(data => console.log("Observer 2:", data));

listing.updatePrice(1500000);
```

### 2. Strategy
**Swap algorithms at runtime**

```typescript
interface PaymentStrategy {
  pay(amount: number): void;
}

class CreditCardStrategy implements PaymentStrategy {
  pay(amount: number) {
    console.log(`Paid ${amount} with credit card`);
  }
}

class UPIStrategy implements PaymentStrategy {
  pay(amount: number) {
    console.log(`Paid ${amount} with UPI`);
  }
}

class PaymentContext {
  constructor(private strategy: PaymentStrategy) {}

  setStrategy(strategy: PaymentStrategy) {
    this.strategy = strategy;
  }

  executePayment(amount: number) {
    this.strategy.pay(amount);
  }
}

let payment = new PaymentContext(new CreditCardStrategy());
payment.executePayment(1000);

payment.setStrategy(new UPIStrategy());
payment.executePayment(1000);
```

### 3. Command
**Encapsulate requests as objects**

```typescript
interface Command {
  execute(): void;
  undo(): void;
}

class Light {
  on() { console.log("Light on"); }
  off() { console.log("Light off"); }
}

class LightOnCommand implements Command {
  constructor(private light: Light) {}

  execute() {
    this.light.on();
  }

  undo() {
    this.light.off();
  }
}

class RemoteControl {
  private history: Command[] = [];

  execute(command: Command) {
    command.execute();
    this.history.push(command);
  }

  undo() {
    const command = this.history.pop();
    if (command) command.undo();
  }
}

let light = new Light();
let lightOn = new LightOnCommand(light);
let remote = new RemoteControl();

remote.execute(lightOn);  // Light on
remote.undo();            // Light off
```

---

## When to Use Which Pattern

| Pattern | Use When |
|---------|----------|
| Singleton | Need exactly one instance |
| Factory | Creating objects based on conditions |
| Builder | Complex object construction |
| Decorator | Add features dynamically |
| Adapter | Convert incompatible interfaces |
| Facade | Simplify complex systems |
| Observer | Event-driven architecture |
| Strategy | Switch algorithms at runtime |
| Command | Queue/undo operations |

---

**Master these patterns for professional code! 🚀**
