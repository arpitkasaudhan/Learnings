# Lesson 5: Classes and OOP

## 🎯 Learning Objectives
- Create TypeScript classes
- Use access modifiers
- Implement interfaces
- Understand inheritance

---

## Basic Class

```typescript
class Car {
  brand: string;
  model: string;
  year: number;

  constructor(brand: string, model: string, year: number) {
    this.brand = brand;
    this.model = model;
    this.year = year;
  }

  getInfo(): string {
    return `${this.brand} ${this.model} (${this.year})`;
  }
}

const car = new Car("Honda", "City", 2023);
console.log(car.getInfo());  // "Honda City (2023)"
```

---

## Access Modifiers

```typescript
class User {
  public name: string;           // Accessible anywhere (default)
  private password: string;      // Only within class
  protected role: string;        // Within class and subclasses

  constructor(name: string, password: string, role: string) {
    this.name = name;
    this.password = password;
    this.role = role;
  }

  public getName(): string {
    return this.name;
  }

  private hashPassword(): string {
    return `hashed_${this.password}`;
  }
}

const user = new User("John", "secret", "user");
console.log(user.name);      // ✅ OK
console.log(user.password);  // ❌ Error! Private property
```

---

## Constructor Shorthand

```typescript
// Long way
class Car {
  brand: string;
  model: string;

  constructor(brand: string, model: string) {
    this.brand = brand;
    this.model = model;
  }
}

// ✅ Shorthand (TypeScript magic!)
class Car {
  constructor(
    public brand: string,
    public model: string,
    private readonly id: string
  ) {}
}
```

---

## Implementing Interfaces

```typescript
interface Vehicle {
  brand: string;
  year: number;
  getInfo(): string;
}

class Car implements Vehicle {
  constructor(
    public brand: string,
    public year: number,
    public model: string
  ) {}

  getInfo(): string {
    return `${this.brand} ${this.model} (${this.year})`;
  }
}
```

---

## Inheritance

```typescript
class Vehicle {
  constructor(public brand: string, public year: number) {}

  getAge(): number {
    return new Date().getFullYear() - this.year;
  }
}

class Car extends Vehicle {
  constructor(brand: string, year: number, public model: string) {
    super(brand, year);  // Call parent constructor
  }

  getInfo(): string {
    return `${this.brand} ${this.model}`;
  }
}

const car = new Car("Honda", 2023, "City");
console.log(car.getInfo());  // "Honda City"
console.log(car.getAge());   // 2 (inherited method)
```

---

## Abstract Classes

```typescript
abstract class Shape {
  abstract getArea(): number;  // Must be implemented by subclasses

  display(): void {
    console.log(`Area: ${this.getArea()}`);
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  getArea(): number {
    return Math.PI * this.radius * this.radius;
  }
}

const circle = new Circle(5);
circle.display();  // "Area: 78.53..."
```

---

## Static Members

```typescript
class MathUtils {
  static PI = 3.14159;

  static calculateCircleArea(radius: number): number {
    return this.PI * radius * radius;
  }
}

// Use without creating instance
console.log(MathUtils.PI);                      // 3.14159
console.log(MathUtils.calculateCircleArea(5));  // 78.5397...
```

---

## Real Example from VahanHelp

```typescript
export class CarService {
  constructor(private carModel: Model<ICar>) {}

  async getAll(filters: ICarFilters = {}): Promise<ICar[]> {
    return await this.carModel.find(filters);
  }

  async getById(id: string): Promise<ICar | null> {
    return await this.carModel.findById(id);
  }

  async create(data: ICarInput): Promise<ICar> {
    return await this.carModel.create(data);
  }

  async update(id: string, data: Partial<ICarInput>): Promise<ICar | null> {
    return await this.carModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<ICar | null> {
    return await this.carModel.findByIdAndDelete(id);
  }
}
```

---

## Key Takeaways

1. **Classes** create objects with behavior
2. **Access modifiers**: public, private, protected
3. **Constructor shorthand** for properties
4. **implements** for interfaces
5. **extends** for inheritance
6. **abstract** for base classes
7. **static** for class-level members

**Next**: [06-type-assertions-guards.md](06-type-assertions-guards.md)
