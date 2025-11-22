# Lesson 11: Classes

## 🎯 Learning Objectives
- Understand ES6 classes
- Create classes and instances
- Use constructors and methods
- Learn inheritance basics

---

## What are Classes?

**Classes are blueprints for creating objects.**

```javascript
// Without class
function Car(brand, model, year) {
  this.brand = brand;
  this.model = model;
  this.year = year;
}

Car.prototype.getInfo = function() {
  return `${this.brand} ${this.model} (${this.year})`;
};

// ✅ With class (ES6)
class Car {
  constructor(brand, model, year) {
    this.brand = brand;
    this.model = model;
    this.year = year;
  }

  getInfo() {
    return `${this.brand} ${this.model} (${this.year})`;
  }
}

// Create instance
const car = new Car("Honda", "City", 2023);
console.log(car.getInfo());  // "Honda City (2023)"
```

---

## Constructor

```javascript
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
    this.createdAt = new Date();
  }

  greet() {
    return `Hello, I'm ${this.name}`;
  }
}

const user = new User("John", "john@example.com");
console.log(user.greet());  // "Hello, I'm John"
```

---

## Inheritance

```javascript
// Parent class
class Vehicle {
  constructor(brand, year) {
    this.brand = brand;
    this.year = year;
  }

  getAge() {
    return new Date().getFullYear() - this.year;
  }
}

// Child class extends parent
class Car extends Vehicle {
  constructor(brand, year, model) {
    super(brand, year);  // Call parent constructor
    this.model = model;
  }

  getInfo() {
    return `${this.brand} ${this.model} (${this.year})`;
  }
}

const car = new Car("Honda", 2023, "City");
console.log(car.getInfo());  // "Honda City (2023)"
console.log(car.getAge());   // 2 (inherited method)
```

---

## Real Example from Backend

```javascript
class CarService {
  constructor(carModel) {
    this.carModel = carModel;
  }

  async getAll(filters = {}) {
    return await this.carModel.find(filters);
  }

  async getById(id) {
    const car = await this.carModel.findById(id);
    if (!car) throw new Error('Car not found');
    return car;
  }

  async create(data) {
    return await this.carModel.create(data);
  }

  async update(id, data) {
    return await this.carModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await this.carModel.findByIdAndDelete(id);
  }
}

const carService = new CarService(CarModel);
```

---

## Static Methods

```javascript
class MathUtils {
  static add(a, b) {
    return a + b;
  }

  static multiply(a, b) {
    return a * b;
  }
}

// Call on class, not instance
console.log(MathUtils.add(2, 3));      // 5
console.log(MathUtils.multiply(4, 5)); // 20
```

---

## Key Takeaways

1. **Classes** are blueprints for objects
2. **constructor** initializes properties
3. **Methods** define behavior
4. **extends** for inheritance
5. **super** calls parent constructor
6. **static** methods belong to class

**Next**: [12-error-handling.md](12-error-handling.md)
