# Lesson 12: Getters & Setters

## What are Getters and Setters?

**Getters**: Access private properties
**Setters**: Modify private properties with validation

---

## TypeScript Getters & Setters

```typescript
class Car {
  private _price: number;

  constructor(public brand: string, price: number) {
    this._price = price;
  }

  get price(): number {
    return this._price;
  }

  set price(value: number) {
    if (value < 0) {
      throw new Error('Price cannot be negative');
    }
    this._price = value;
  }
}

let car = new Car("Honda", 1500000);
console.log(car.price);  // 1500000 (using getter)
car.price = 1600000;     // (using setter)
// car.price = -100;     // ❌ Error
```

---

## VahanHelp Example

```typescript
class CarListing {
  private _price: number;
  private _views: number = 0;

  constructor(
    public brand: string,
    price: number
  ) {
    this._price = price;
  }

  get price(): number {
    return this._price;
  }

  set price(value: number) {
    if (value < 0) throw new Error('Invalid price');
    if (value < 10000) throw new Error('Price too low');
    this._price = value;
  }

  get views(): number {
    return this._views;
  }

  incrementViews(): void {
    this._views++;
  }

  get discountedPrice(): number {
    // Computed property
    if (this._views > 100) {
      return this._price * 0.9;  // 10% discount
    }
    return this._price;
  }
}
```

**Next Lesson**: [13-design-patterns.md](13-design-patterns.md)
