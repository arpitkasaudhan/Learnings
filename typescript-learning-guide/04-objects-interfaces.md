# Lesson 4: Objects and Interfaces

## 🎯 Learning Objectives
- Define object types
- Create interfaces
- Use optional and readonly properties
- Extend interfaces

---

## Object Type Annotations

```typescript
// Inline type
let car: { brand: string; model: string; year: number } = {
  brand: "Honda",
  model: "City",
  year: 2023
};

// Optional properties
let user: {
  name: string;
  email?: string;  // Optional
} = {
  name: "John"
};
```

---

## Interfaces

```typescript
// Define interface
interface Car {
  brand: string;
  model: string;
  year: number;
  price: number;
}

// Use interface
let car: Car = {
  brand: "Honda",
  model: "City",
  year: 2023,
  price: 1500000
};

// Function with interface
function displayCar(car: Car): string {
  return `${car.brand} ${car.model} (${car.year})`;
}
```

---

## Optional Properties

```typescript
interface User {
  name: string;
  email: string;
  phone?: string;      // Optional
  avatar?: string;     // Optional
}

let user1: User = {
  name: "John",
  email: "john@example.com"
};

let user2: User = {
  name: "Jane",
  email: "jane@example.com",
  phone: "+919876543210"
};
```

---

## Readonly Properties

```typescript
interface Car {
  readonly id: string;  // Cannot be changed
  brand: string;
  model: string;
}

let car: Car = {
  id: "car123",
  brand: "Honda",
  model: "City"
};

car.brand = "Maruti";  // ✅ OK
car.id = "car456";     // ❌ Error! Cannot assign to readonly property
```

---

## Extending Interfaces

```typescript
interface Vehicle {
  brand: string;
  year: number;
}

interface Car extends Vehicle {
  model: string;
  doors: number;
}

let car: Car = {
  brand: "Honda",
  year: 2023,
  model: "City",
  doors: 4
};
```

---

## Index Signatures

```typescript
// Object with dynamic keys
interface StringMap {
  [key: string]: string;
}

let translations: StringMap = {
  hello: "नमस्ते",
  goodbye: "अलविदा",
  thanks: "धन्यवाद"
};
```

---

## Real Example from VahanHelp

```typescript
interface ICarListing {
  readonly _id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  kmsDriven: number;
  fuelType: string;
  transmission: string;
  images: string[];
  sellerId: string;
  location: {
    city: string;
    state: string;
  };
  isActive: boolean;
  createdAt: Date;
}

interface IUser {
  readonly _id: string;
  phone: string;
  email?: string;
  name?: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
}
```

---

## Key Takeaways

1. **Interfaces** define object shapes
2. **Optional properties** with `?`
3. **Readonly properties** with `readonly`
4. **Extend interfaces** to compose types
5. **Index signatures** for dynamic keys

**Next**: [05-classes-oop.md](05-classes-oop.md)
