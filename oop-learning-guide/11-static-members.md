# Lesson 11: Static Members

## What are Static Members?

**Static**: Belong to the class, not instances. Shared across all objects.

---

## Static Properties and Methods

```typescript
class Car {
  static totalCars = 0;  // Shared by all cars

  constructor(public brand: string) {
    Car.totalCars++;  // Access via class name
  }

  static getTotalCars(): number {
    return Car.totalCars;
  }
}

let car1 = new Car("Honda");
let car2 = new Car("Maruti");

console.log(Car.getTotalCars());  // 2
console.log(Car.totalCars);       // 2
```

---

## VahanHelp Example

```typescript
class CarListing {
  private static nextId = 1;
  private static totalListings = 0;
  private static listingsByStatus: Map<string, number> = new Map();

  public id: string;

  constructor(public brand: string, public price: number, public status: string = 'active') {
    this.id = `CAR-${CarListing.nextId++}`;
    CarListing.totalListings++;
    CarListing.incrementStatusCount(status);
  }

  private static incrementStatusCount(status: string): void {
    const current = CarListing.listingsByStatus.get(status) || 0;
    CarListing.listingsByStatus.set(status, current + 1);
  }

  static getTotalListings(): number {
    return CarListing.totalListings;
  }

  static getListingsByStatus(status: string): number {
    return CarListing.listingsByStatus.get(status) || 0;
  }

  static getStats(): object {
    return {
      total: CarListing.totalListings,
      byStatus: Object.fromEntries(CarListing.listingsByStatus)
    };
  }
}

// Usage
let car1 = new CarListing("Honda", 1500000, "active");
let car2 = new CarListing("Maruti", 800000, "active");
let car3 = new CarListing("BMW", 5000000, "sold");

console.log(CarListing.getTotalListings());           // 3
console.log(CarListing.getListingsByStatus("active")); // 2
console.log(CarListing.getStats());
```

**Next Lesson**: [12-getters-setters.md](12-getters-setters.md)
