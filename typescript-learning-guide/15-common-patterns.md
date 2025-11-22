# Lesson 15: Common Patterns

## 🎯 Learning Objectives
- Learn production patterns
- Structure TypeScript projects
- Use common idioms
- Build maintainable code

---

## Repository Pattern

```typescript
interface IRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(data: T): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

class Repository<T> implements IRepository<T> {
  constructor(private model: Model<T>) {}

  async findAll(): Promise<T[]> {
    return await this.model.find();
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

  // ... other methods
}
```

---

## Service Layer Pattern

```typescript
export class CarService {
  constructor(private repository: IRepository<ICar>) {}

  async getAllCars(filters: ICarFilters): Promise<ICar[]> {
    // Business logic
    const cars = await this.repository.findAll();
    return this.filterCars(cars, filters);
  }

  private filterCars(cars: ICar[], filters: ICarFilters): ICar[] {
    // Filter logic
    return cars;
  }
}
```

---

## Dependency Injection

```typescript
// Define interfaces
interface ILogger {
  log(message: string): void;
}

interface IDatabase {
  connect(): Promise<void>;
}

// Implement classes
class ConsoleLogger implements ILogger {
  log(message: string): void {
    console.log(message);
  }
}

// Inject dependencies
class UserService {
  constructor(
    private logger: ILogger,
    private database: IDatabase
  ) {}

  async getUsers(): Promise<User[]> {
    this.logger.log("Fetching users...");
    // ...
  }
}

// Use
const logger = new ConsoleLogger();
const database = new MongoDB();
const service = new UserService(logger, database);
```

---

## Error Handling Pattern

```typescript
// Custom error types
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(404, message);
  }
}

// Use in services
async getCarById(id: string): Promise<ICar> {
  if (!isValidObjectId(id)) {
    throw new ValidationError("Invalid car ID");
  }

  const car = await this.repository.findById(id);

  if (!car) {
    throw new NotFoundError("Car not found");
  }

  return car;
}
```

---

## 🎉 Congratulations!

You've completed the TypeScript learning guide!

### What You've Learned:
- ✅ TypeScript fundamentals
- ✅ Types and interfaces
- ✅ Classes and OOP
- ✅ Generics
- ✅ Advanced types
- ✅ Decorators
- ✅ Best practices
- ✅ Production patterns

### Next Steps:
1. Build TypeScript projects
2. Learn backend frameworks (NestJS)
3. Master advanced patterns
4. Contribute to TypeScript projects

**Happy Coding with TypeScript! 🚀**
