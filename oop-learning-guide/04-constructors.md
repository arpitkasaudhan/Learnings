# Lesson 04: Constructors

## What is a Constructor?

**Constructor**: Special method called when creating new object. Initializes properties.

```typescript
class Car {
  brand: string;
  model: string;
  price: number;

  // Constructor
  constructor(brand: string, model: string, price: number) {
    this.brand = brand;
    this.model = model;
    this.price = price;
    console.log(`New car created: ${brand} ${model}`);
  }
}

let car = new Car("Honda", "City", 1500000);
// Output: New car created: Honda City
```

---

## Constructor Features

### 1. Initialization
```typescript
class User {
  constructor(
    public name: string,
    public email: string,
    public createdAt: Date = new Date()
  ) {
    console.log(`User ${name} registered at ${createdAt}`);
  }
}
```

### 2. Default Values
```typescript
class CarListing {
  constructor(
    public brand: string,
    public model: string,
    public price: number,
    public status: string = 'active',
    public views: number = 0
  ) {}
}

let car = new CarListing("Honda", "City", 1500000);
console.log(car.status);  // active
console.log(car.views);   // 0
```

### 3. Validation
```typescript
class Car {
  constructor(public brand: string, public price: number) {
    if (price < 0) {
      throw new Error('Price cannot be negative');
    }
    if (!brand || brand.trim() === '') {
      throw new Error('Brand is required');
    }
  }
}
```

---

## Constructor Overloading (TypeScript)

```typescript
class Car {
  constructor(public brand: string, public model?: string, public year?: number) {}

  static createFromObject(data: any): Car {
    return new Car(data.brand, data.model, data.year);
  }
}

// Different ways to create
let car1 = new Car("Honda");
let car2 = new Car("Honda", "City");
let car3 = new Car("Honda", "City", 2023);
let car4 = Car.createFromObject({ brand: "BMW", model: "X5", year: 2022 });
```

---

## VahanHelp Example

```typescript
class CarListing {
  public id: string;
  public createdAt: Date;
  public status: string;

  constructor(
    id: string,
    public brand: string,
    public model: string,
    public price: number,
    public sellerId: string
  ) {
    // Validate
    if (price <= 0) throw new Error('Invalid price');
    if (!sellerId) throw new Error('Seller ID required');

    // Initialize
    this.id = id || this.generateId();
    this.createdAt = new Date();
    this.status = 'pending_approval';

    console.log(`Listing ${this.id} created`);
  }

  private generateId(): string {
    return `CAR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

let listing = new CarListing(null, "Honda", "City", 1500000, "USER123");
```

**Next Lesson**: [05-this-keyword.md](05-this-keyword.md)
