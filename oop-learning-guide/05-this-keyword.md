# Lesson 05: The `this` Keyword

## What is `this`?

**`this`**: Refers to the current object instance.

```javascript
class Car {
  constructor(brand, model) {
    this.brand = brand;  // this = current car object
    this.model = model;
  }

  getInfo() {
    return `${this.brand} ${this.model}`;  // this = current car
  }
}

let car = new Car("Honda", "City");
console.log(car.getInfo());  // this refers to 'car' object
```

---

## `this` in Different Contexts

### 1. In Methods
```javascript
class Car {
  constructor(brand) {
    this.brand = brand;
  }

  start() {
    console.log(`${this.brand} started`);  // this = car object
  }
}

let car = new Car("Honda");
car.start();  // Honda started
```

### 2. Arrow Functions (Lexical `this`)
```javascript
class Car {
  constructor(brand) {
    this.brand = brand;
  }

  startLater() {
    setTimeout(() => {
      console.log(`${this.brand} started`);  // this preserved
    }, 1000);
  }
}
```

### 3. Lost `this` Problem
```javascript
class Car {
  constructor(brand) {
    this.brand = brand;
  }

  start() {
    console.log(`${this.brand} started`);
  }
}

let car = new Car("Honda");
let startFn = car.start;
startFn();  // ❌ Error: this is undefined

// Fix with bind
let startFnFixed = car.start.bind(car);
startFnFixed();  // ✅ Honda started
```

---

## VahanHelp Example

```typescript
class CarListing {
  constructor(
    public brand: string,
    public price: number,
    private discountPercent: number = 0
  ) {}

  applyDiscount(percent: number) {
    this.discountPercent = percent;
    return this;  // Return this for method chaining
  }

  getPrice() {
    return this.price * (1 - this.discountPercent / 100);
  }

  getInfo() {
    return `${this.brand} - ₹${this.getPrice()}`;
  }
}

let car = new CarListing("Honda", 1500000);
car.applyDiscount(10);
console.log(car.getInfo());  // Honda - ₹1350000

// Method chaining
car.applyDiscount(15).getInfo();  // Returns this from applyDiscount
```

**Next Lesson**: [06-encapsulation.md](06-encapsulation.md)
