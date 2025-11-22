# Lesson 9: Advanced Types

## 🎯 Learning Objectives
- Intersection types
- Type narrowing
- Mapped types
- Utility types

---

## Intersection Types

```typescript
// Combine multiple types
type Person = {
  name: string;
  age: number;
};

type Employee = {
  employeeId: string;
  department: string;
};

type EmployeePerson = Person & Employee;

let employee: EmployeePerson = {
  name: "John",
  age: 30,
  employeeId: "E001",
  department: "Engineering"
};
```

---

## Utility Types

### Partial<T>
```typescript
interface Car {
  brand: string;
  model: string;
  year: number;
}

// All properties optional
function updateCar(id: string, updates: Partial<Car>) {
  // Can pass any subset of Car properties
}

updateCar("car123", { brand: "Honda" });  // ✅ OK
updateCar("car123", { brand: "Honda", year: 2024 });  // ✅ OK
```

### Required<T>
```typescript
interface User {
  name?: string;
  email?: string;
}

// All properties required
type RequiredUser = Required<User>;

let user: RequiredUser = {
  name: "John",   // Must provide
  email: "john@example.com"  // Must provide
};
```

### Pick<T, K>
```typescript
interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
}

// Pick specific properties
type CarPreview = Pick<Car, "id" | "brand" | "model">;

let preview: CarPreview = {
  id: "car123",
  brand: "Honda",
  model: "City"
};
```

### Omit<T, K>
```typescript
// Omit specific properties
type CarWithoutPrice = Omit<Car, "price">;

let car: CarWithoutPrice = {
  id: "car123",
  brand: "Honda",
  model: "City",
  year: 2023
  // No price property
};
```

### Record<K, T>
```typescript
// Create object type with specific keys and values
type CarMap = Record<string, Car>;

let cars: CarMap = {
  car1: { id: "1", brand: "Honda", model: "City", year: 2023, price: 1500000 },
  car2: { id: "2", brand: "Maruti", model: "Swift", year: 2023, price: 800000 }
};
```

---

## Mapped Types

```typescript
// Transform all properties
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Optional<T> = {
  [P in keyof T]?: T[P];
};

interface Car {
  brand: string;
  model: string;
}

type ReadonlyCar = Readonly<Car>;
// { readonly brand: string; readonly model: string; }

type OptionalCar = Optional<Car>;
// { brand?: string; model?: string; }
```

---

## Real Example from VahanHelp

```typescript
// API input type (omit generated fields)
export type ICarInput = Omit<ICar, '_id' | 'createdAt' | 'updatedAt'>;

// Update type (all fields optional)
export type ICarUpdate = Partial<ICarInput>;

// API response type (pick only public fields)
export type ICarPublic = Pick<ICar, 
  'brand' | 'model' | 'year' | 'price' | 'images'
>;

// Service method
async update(id: string, data: ICarUpdate): Promise<ICar> {
  return await this.model.findByIdAndUpdate(id, data);
}
```

---

## Key Takeaways

1. **Intersection (&)** combines types
2. **Partial** makes all optional
3. **Required** makes all required
4. **Pick** selects properties
5. **Omit** removes properties
6. **Record** creates mapped type

**Next**: [10-decorators.md](10-decorators.md)
