# Lesson 02: Classes & Objects

## What is a Class?

**Class**: Blueprint or template for creating objects.

**Analogy**: House blueprint → Class, Actual house → Object

```javascript
// Class (blueprint)
class Car {
  constructor(brand, model) {
    this.brand = brand;
    this.model = model;
  }
}

// Objects (instances)
let car1 = new Car("Honda", "City");
let car2 = new Car("Maruti", "Swift");
```

---

## Creating Classes

### JavaScript
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

  getPrice() {
    return `₹${this.price.toLocaleString()}`;
  }
}
```

### TypeScript
```typescript
class Car {
  brand: string;
  model: string;
  price: number;

  constructor(brand: string, model: string, price: number) {
    this.brand = brand;
    this.model = model;
    this.price = price;
  }

  getInfo(): string {
    return `${this.brand} ${this.model}`;
  }

  getPrice(): string {
    return `₹${this.price.toLocaleString()}`;
  }
}
```

### TypeScript Shorthand
```typescript
class Car {
  constructor(
    public brand: string,
    public model: string,
    public price: number
  ) {}

  getInfo(): string {
    return `${this.brand} ${this.model}`;
  }
}
```

---

## Creating Objects

```javascript
// Create new instance
let car = new Car("Honda", "City", 1500000);

// Access properties
console.log(car.brand);    // Honda
console.log(car.model);    // City
console.log(car.price);    // 1500000

// Call methods
console.log(car.getInfo());  // Honda City
console.log(car.getPrice()); // ₹15,00,000

// Multiple objects
let car1 = new Car("Honda", "City", 1500000);
let car2 = new Car("Maruti", "Swift", 800000);
let car3 = new Car("BMW", "X5", 5000000);
```

---

## VahanHelp Example

```typescript
class CarListing {
  constructor(
    public id: string,
    public brand: string,
    public model: string,
    public year: number,
    public price: number,
    public sellerId: string,
    public location: string
  ) {}

  getInfo(): string {
    return `${this.brand} ${this.model} (${this.year})`;
  }

  getFullDescription(): string {
    return `
      ${this.getInfo()}
      Price: ₹${this.price.toLocaleString()}
      Location: ${this.location}
    `;
  }

  applyDiscount(percent: number): number {
    return this.price * (1 - percent / 100);
  }

  isNewCar(): boolean {
    return new Date().getFullYear() - this.year === 0;
  }
}

// Usage
let listing = new CarListing(
  "L001",
  "Honda",
  "City",
  2023,
  1500000,
  "U001",
  "Mumbai"
);

console.log(listing.getInfo());
console.log(listing.getFullDescription());
console.log(listing.applyDiscount(10));  // 1350000
console.log(listing.isNewCar());         // true
```

---

## Practice

Create these classes for VahanHelp:

1. **User class** (id, name, email, phone)
2. **Seller class** (extends User, add ratings, totalSales)
3. **Buyer class** (extends User, add savedListings)

**Next Lesson**: [03-properties-methods.md](03-properties-methods.md)
