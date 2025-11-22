# Lesson 01: Introduction to Object-Oriented Programming

## What is OOP?

**Object-Oriented Programming (OOP)** is a programming paradigm based on the concept of "objects" that contain:
- **Data** (properties/attributes)
- **Behavior** (methods/functions)

**Analogy**: Think of a car:
- **Data**: Brand, model, color, price
- **Behavior**: Start, stop, accelerate, brake

---

## Why Use OOP?

### 1. **Real-World Modeling**
Objects in code mirror real-world entities.

```javascript
// Car in real world → Car object in code
let car = {
  brand: "Honda",
  model: "City",
  price: 1500000,

  start() {
    console.log("Car started");
  }
};
```

### 2. **Code Reusability**
Write once, use many times.

```javascript
class Car {
  constructor(brand, model) {
    this.brand = brand;
    this.model = model;
  }

  getInfo() {
    return `${this.brand} ${this.model}`;
  }
}

let car1 = new Car("Honda", "City");
let car2 = new Car("Maruti", "Swift");
let car3 = new Car("BMW", "X5");
```

### 3. **Maintainability**
Changes in one place, affect everywhere needed.

### 4. **Security (Encapsulation)**
Hide sensitive data, expose only what's needed.

### 5. **Scalability**
Easy to add new features without breaking existing code.

---

## Programming Paradigms

### Procedural Programming
```javascript
let carBrand = "Honda";
let carModel = "City";
let carPrice = 1500000;

function getCarInfo(brand, model) {
  return `${brand} ${model}`;
}

console.log(getCarInfo(carBrand, carModel));
```

**Issues**:
- Data and functions are separate
- Hard to manage as code grows
- No data protection

### Object-Oriented Programming
```javascript
class Car {
  constructor(brand, model, price) {
    this.brand = brand;
    this.model = model;
    this.price = price;
  }

  getInfo() {
    return `${this.brand} ${this.model}`;
  }
}

let car = new Car("Honda", "City", 1500000);
console.log(car.getInfo());
```

**Benefits**:
- Data and behavior bundled together
- Better organization
- Easier to maintain and extend

---

## Core OOP Concepts (The Four Pillars)

### 1. **Encapsulation** 🔒
Bundle data and methods together, hide internal details.

```javascript
class BankAccount {
  #balance = 0;  // Private

  deposit(amount) {
    if (amount > 0) this.#balance += amount;
  }

  getBalance() {
    return this.#balance;
  }
}

let account = new BankAccount();
account.deposit(1000);
console.log(account.getBalance());  // 1000
// console.log(account.#balance);   // ❌ Error: Private field
```

### 2. **Inheritance** 👨‍👦
Create new classes based on existing ones.

```javascript
class Vehicle {
  constructor(brand) {
    this.brand = brand;
  }

  start() {
    console.log(`${this.brand} started`);
  }
}

class Car extends Vehicle {
  constructor(brand, model) {
    super(brand);
    this.model = model;
  }
}

let car = new Car("Honda", "City");
car.start();  // Honda started
```

### 3. **Polymorphism** 🎭
Same method, different behavior.

```javascript
class Animal {
  speak() {
    console.log("Animal makes a sound");
  }
}

class Dog extends Animal {
  speak() {
    console.log("Dog barks");
  }
}

class Cat extends Animal {
  speak() {
    console.log("Cat meows");
  }
}

let animals = [new Dog(), new Cat()];
animals.forEach(animal => animal.speak());
// Dog barks
// Cat meows
```

### 4. **Abstraction** 🎨
Hide complexity, show only essentials.

```typescript
abstract class PaymentProcessor {
  abstract processPayment(amount: number): void;
}

class CreditCard extends PaymentProcessor {
  processPayment(amount: number): void {
    console.log(`Processing credit card: ₹${amount}`);
  }
}

class UPI extends PaymentProcessor {
  processPayment(amount: number): void {
    console.log(`Processing UPI: ₹${amount}`);
  }
}
```

---

## OOP in JavaScript

JavaScript supports OOP through:

### 1. **Object Literals**
```javascript
let car = {
  brand: "Honda",
  model: "City",
  getInfo() {
    return `${this.brand} ${this.model}`;
  }
};
```

### 2. **Constructor Functions**
```javascript
function Car(brand, model) {
  this.brand = brand;
  this.model = model;
}

Car.prototype.getInfo = function() {
  return `${this.brand} ${this.model}`;
};

let car = new Car("Honda", "City");
```

### 3. **ES6 Classes**
```javascript
class Car {
  constructor(brand, model) {
    this.brand = brand;
    this.model = model;
  }

  getInfo() {
    return `${this.brand} ${this.model}`;
  }
}

let car = new Car("Honda", "City");
```

---

## OOP in TypeScript

TypeScript adds type safety and advanced OOP features:

```typescript
class Car {
  private mileage: number = 0;

  constructor(
    public brand: string,
    public model: string,
    private price: number
  ) {}

  getInfo(): string {
    return `${this.brand} ${this.model}`;
  }

  getPrice(): number {
    return this.price;
  }
}

let car = new Car("Honda", "City", 1500000);
console.log(car.brand);     // ✅ Public
console.log(car.getPrice()); // ✅ Via method
// console.log(car.price);   // ❌ Error: Private
```

---

## VahanHelp Real-World Example

### Before OOP (Procedural)
```javascript
let car1Brand = "Honda";
let car1Model = "City";
let car1Price = 1500000;
let car1Owner = "John";

let car2Brand = "Maruti";
let car2Model = "Swift";
let car2Price = 800000;
let car2Owner = "Jane";

function getCarInfo(brand, model) {
  return `${brand} ${model}`;
}

function calculateDiscount(price, percent) {
  return price * (1 - percent / 100);
}
```

**Problems**:
- Too many variables
- Hard to manage
- No relationship between data

### After OOP
```javascript
class Car {
  constructor(brand, model, price, owner) {
    this.brand = brand;
    this.model = model;
    this.price = price;
    this.owner = owner;
  }

  getInfo() {
    return `${this.brand} ${this.model}`;
  }

  calculateDiscount(percent) {
    return this.price * (1 - percent / 100);
  }

  getOwnerInfo() {
    return `Owner: ${this.owner}`;
  }
}

let car1 = new Car("Honda", "City", 1500000, "John");
let car2 = new Car("Maruti", "Swift", 800000, "Jane");

console.log(car1.getInfo());           // Honda City
console.log(car1.calculateDiscount(10)); // 1350000
console.log(car1.getOwnerInfo());      // Owner: John
```

**Benefits**:
- All car data in one place
- Methods operate on their own data
- Easy to create multiple cars
- Clear, maintainable code

---

## When to Use OOP?

**Use OOP when**:
- Building complex applications
- Need code reusability
- Multiple developers working together
- Need to model real-world entities
- Long-term maintainability matters

**Maybe don't use OOP for**:
- Simple scripts
- One-time utilities
- Very small projects

---

## Key Takeaways

✅ **OOP** = Objects with data + behavior
✅ **Four Pillars**: Encapsulation, Inheritance, Polymorphism, Abstraction
✅ **Benefits**: Reusability, maintainability, security, scalability
✅ **JavaScript**: Object literals, constructor functions, ES6 classes
✅ **TypeScript**: Enhanced OOP with types and access modifiers

---

## What's Next?

Now that you understand what OOP is, let's learn how to create classes and objects!

**Next Lesson**: [02-classes-objects.md](02-classes-objects.md)

---

**Remember**: OOP is about thinking in objects, not just syntax!

**Let's build! 🚀**
