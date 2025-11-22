# Lesson 03: Properties & Methods

## Properties (Instance Variables)

Properties store data for each object instance.

```typescript
class Car {
  // Properties
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;

  constructor(brand: string, model: string, year: number, price: number) {
    this.brand = brand;
    this.model = model;
    this.year = year;
    this.price = price;
    this.mileage = 0;
  }
}
```

---

## Methods (Instance Functions)

Methods define behavior for objects.

```typescript
class Car {
  constructor(public brand: string, public model: string, private mileage: number = 0) {}

  // Method
  drive(distance: number): void {
    this.mileage += distance;
    console.log(`Drove ${distance}km. Total: ${this.mileage}km`);
  }

  getMileage(): number {
    return this.mileage;
  }

  getInfo(): string {
    return `${this.brand} ${this.model} - ${this.mileage}km`;
  }
}

let car = new Car("Honda", "City");
car.drive(100);        // Drove 100km. Total: 100km
car.drive(50);         // Drove 50km. Total: 150km
console.log(car.getInfo());  // Honda City - 150km
```

---

## VahanHelp Example

```typescript
class CarListing {
  private views: number = 0;
  private savedBy: string[] = [];

  constructor(
    public id: string,
    public brand: string,
    public model: string,
    public price: number
  ) {}

  // Methods
  incrementViews(): void {
    this.views++;
  }

  getViews(): number {
    return this.views;
  }

  saveByUser(userId: string): void {
    if (!this.savedBy.includes(userId)) {
      this.savedBy.push(userId);
    }
  }

  isSavedBy(userId: string): boolean {
    return this.savedBy.includes(userId);
  }

  getSaveCount(): number {
    return this.savedBy.length;
  }
}
```

**Next Lesson**: [04-constructors.md](04-constructors.md)
