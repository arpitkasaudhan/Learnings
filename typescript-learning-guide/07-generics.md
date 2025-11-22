# Lesson 7: Generics

## 🎯 Learning Objectives
- Understand generics
- Create generic functions
- Use generic interfaces and classes
- Apply constraints to generics

---

## Why Generics?

```typescript
// Without generics - need multiple functions
function getFirstNumber(arr: number[]): number {
  return arr[0];
}

function getFirstString(arr: string[]): string {
  return arr[0];
}

// ✅ With generics - one function for all types
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

let firstNumber = getFirst([1, 2, 3]);      // T is number
let firstString = getFirst(["a", "b", "c"]); // T is string
```

---

## Generic Functions

```typescript
function identity<T>(value: T): T {
  return value;
}

let num = identity<number>(42);        // Explicit
let str = identity("Hello");            // Inferred

function swap<T, U>(a: T, b: U): [U, T] {
  return [b, a];
}

let swapped = swap("Hello", 42);  // [42, "Hello"]
```

---

## Generic Interfaces

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

// Use with different types
let carResponse: ApiResponse<Car> = {
  success: true,
  data: { brand: "Honda", model: "City" },
  message: "Car fetched"
};

let userResponse: ApiResponse<User> = {
  success: true,
  data: { name: "John", email: "john@example.com" },
  message: "User fetched"
};
```

---

## Generic Classes

```typescript
class Box<T> {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  getValue(): T {
    return this.value;
  }

  setValue(value: T): void {
    this.value = value;
  }
}

let numberBox = new Box<number>(42);
let stringBox = new Box<string>("Hello");
```

---

## Generic Constraints

```typescript
// Constraint: T must have length property
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(item: T): void {
  console.log(item.length);
}

logLength("Hello");      // ✅ String has length
logLength([1, 2, 3]);    // ✅ Array has length
logLength(42);           // ❌ Error! Number doesn't have length
```

---

## Real Example from VahanHelp

```typescript
// Generic repository
class Repository<T> {
  constructor(private model: Model<T>) {}

  async findAll(): Promise<T[]> {
    return await this.model.find();
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

  async create(data: T): Promise<T> {
    return await this.model.create(data);
  }
}

// Use with different models
const carRepository = new Repository<ICar>(CarModel);
const userRepository = new Repository<IUser>(UserModel);
```

---

## Key Takeaways

1. **Generics** create reusable components
2. **Type parameters** with `<T>`
3. **Multiple type parameters** with `<T, U>`
4. **Constraints** with `extends`
5. **Generic interfaces and classes**

**Next**: [08-enums-literals.md](08-enums-literals.md)
