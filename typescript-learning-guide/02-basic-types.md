# Lesson 2: Basic Types in TypeScript

## 🎯 Learning Objectives
By the end of this lesson, you will understand:
- All basic types in TypeScript
- How to declare typed variables
- Type inference
- The `any` type and when to avoid it
- Array and tuple types

---

## Why Types Matter

Types tell TypeScript what kind of data a variable can hold. This prevents mistakes:

```typescript
let age: number = 25;
age = "twenty-five"; // ❌ Error! Can't put string in number variable
```

Think of types as labels on boxes: You can't put shoes in a box labeled "books"!

---

## Primitive Types

### 1. String

Represents text data.

```typescript
// Explicit type annotation
let firstName: string = "John";
let lastName: string = 'Doe'; // Single or double quotes work
let message: string = `Hello, ${firstName}`; // Template literals work too

// Example from our codebase
let phone: string = "+919876543210";
let email: string = "user@example.com";
```

**Common String Operations:**
```typescript
let text: string = "TypeScript";
let length: number = text.length;        // 10
let upper: string = text.toUpperCase();  // "TYPESCRIPT"
let lower: string = text.toLowerCase();  // "typescript"
```

**Real Example from Our Code:**
```typescript
// From src/infrastructure/database/mongodb/models/User.model.ts
phone: { type: String, required: true, unique: true }
email: { type: String, sparse: true }
```

---

### 2. Number

Represents all numbers (integers and decimals).

```typescript
let age: number = 25;
let price: number = 19.99;
let temperature: number = -5;
let billion: number = 1e9;  // Scientific notation
let hex: number = 0xff;     // Hexadecimal

// Example from our codebase
let port: number = 8080;
let year: number = 2024;
let kmsDriven: number = 15000;
```

**Important**: TypeScript doesn't have separate types for int, float, double like other languages. Everything is `number`.

```typescript
let count: number = 10;      // Integer
let average: number = 10.5;  // Decimal
// Both are type 'number'
```

**Real Example from Our Code:**
```typescript
// From src/domain/entities/Car.ts
interface ICarListing {
  year: number;
  price: number;
  kmsDriven: number;
}
```

---

### 3. Boolean

Represents true or false.

```typescript
let isActive: boolean = true;
let isVerified: boolean = false;

// Example from our codebase
let isAuthenticated: boolean = false;
let hasPermission: boolean = true;
```

**Common Boolean Use Cases:**
```typescript
// Checking conditions
let isAdult: boolean = age >= 18;
let hasDiscount: boolean = price > 1000;

// Flags
let isLoading: boolean = false;
let isLoggedIn: boolean = true;
```

**Real Example from Our Code:**
```typescript
// From src/infrastructure/database/mongodb/models/User.model.ts
interface IUser {
  isVerified: boolean;
  isActive: boolean;
}
```

---

### 4. Null and Undefined

Special types for empty/missing values.

```typescript
let nothing: null = null;
let notAssigned: undefined = undefined;

// More common usage - optional values
let middleName: string | null = null;  // Can be string OR null
let age: number | undefined;           // Can be number OR undefined
```

**Difference between null and undefined:**
- `undefined`: Variable declared but not assigned
- `null`: Intentionally empty value

```typescript
let x: number | undefined;      // Declared but not assigned
console.log(x); // undefined

let y: string | null = null;    // Explicitly set to null
console.log(y); // null
```

**Real Example from Our Code:**
```typescript
// From src/domain/services/car.service.ts
async getCarById(carId: string, userId?: string) {
  // userId can be undefined
}
```

---

## Type Inference

TypeScript can figure out types automatically! You don't always need to write `: type`.

```typescript
// Type inference - TypeScript figures out the type
let name = "John";        // TypeScript knows it's string
let age = 25;             // TypeScript knows it's number
let isActive = true;      // TypeScript knows it's boolean

// Same as:
let name: string = "John";
let age: number = 25;
let isActive: boolean = true;
```

**When to use explicit types:**
```typescript
// When declaring without initialization
let age: number;          // Need to specify type
age = 25;

// When you want to be explicit
let price: number = 19.99; // Clear intention

// When type inference might be wrong
let id: string | number = "123"; // Can be string OR number
```

**Best Practice from Our Codebase:**
```typescript
// From src/config/environment.ts
// Explicit types for clarity
export const config = {
  port: parseInt(process.env.PORT || '8080', 10) as number,
  nodeEnv: process.env.NODE_ENV as string,
};
```

---

## Array Types

Two ways to declare array types:

### Method 1: Type[] Syntax
```typescript
let numbers: number[] = [1, 2, 3, 4, 5];
let names: string[] = ["Alice", "Bob", "Charlie"];
let flags: boolean[] = [true, false, true];
```

### Method 2: Array<Type> Syntax
```typescript
let numbers: Array<number> = [1, 2, 3, 4, 5];
let names: Array<string> = ["Alice", "Bob", "Charlie"];
```

**Both are equivalent!** Use whichever you prefer. `Type[]` is more common.

### Array Operations
```typescript
let fruits: string[] = ["apple", "banana"];

fruits.push("orange");     // ✅ OK
fruits.push(123);          // ❌ Error! Must be string

let first: string = fruits[0];
let count: number = fruits.length;
```

**Real Example from Our Code:**
```typescript
// From src/domain/entities/Car.ts
interface ICarListing {
  images: string[];        // Array of image URLs
  tags?: string[];         // Optional array of tags
}

// From src/config/constants.ts
const ALLOWED_IMAGE_TYPES: string[] = ['image/jpeg', 'image/png', 'image/webp'];
```

---

## Tuple Types

Tuples are arrays with fixed length and types for each position.

```typescript
// Regular array - any length, same type
let scores: number[] = [10, 20, 30, 40];

// Tuple - fixed length, specific types for each position
let person: [string, number] = ["John", 25];
//          [name,   age]

// Must match exactly
let user: [string, number, boolean] = ["Alice", 30, true];
//        [name,   age,    active]
```

**Accessing Tuple Elements:**
```typescript
let person: [string, number] = ["John", 25];

let name: string = person[0];  // "John"
let age: number = person[1];   // 25

person[0] = "Jane";  // ✅ OK - still a string
person[1] = "30";    // ❌ Error - must be number
```

**Real-World Use Case:**
```typescript
// Coordinate system
let point: [number, number] = [10, 20]; // [x, y]

// RGB color
let color: [number, number, number] = [255, 0, 128]; // [r, g, b]

// Key-value pair
let setting: [string, boolean] = ["darkMode", true];
```

**From Our Codebase Concept:**
```typescript
// Returning multiple values (common pattern)
function getPagination(page: number, limit: number): [number, number] {
  const skip = (page - 1) * limit;
  return [skip, limit]; // Return as tuple
}

const [skip, limit] = getPagination(2, 10);
// skip = 10, limit = 10
```

---

## The `any` Type

`any` disables type checking. **Avoid it whenever possible!**

```typescript
let something: any = "hello";
something = 123;           // ✅ No error
something = true;          // ✅ No error
something.foo.bar.baz;     // ✅ No error (but will crash at runtime!)
```

**Why `any` is dangerous:**
```typescript
function calculateDiscount(price: any, discount: any) {
  return price * discount;
}

calculateDiscount(100, 0.1);     // 10 - works
calculateDiscount("100", "0.1"); // "1000.1" - WRONG! But no error
```

**When `any` is acceptable:**
```typescript
// 1. Working with external libraries without types
let externalData: any = someLibrary.getData();

// 2. Migrating JavaScript to TypeScript gradually
// (temporary, will be fixed later)
```

**Better Alternative: `unknown`**
```typescript
let userInput: unknown = getUserInput();

// Must check type before using
if (typeof userInput === "string") {
  console.log(userInput.toUpperCase()); // ✅ Safe
}
```

**From Our Codebase:**
```typescript
// We avoid 'any' and use proper types
// From src/utils/errors.ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
  }
}
```

---

## Object Types

Basic object type annotations:

```typescript
// Inline type annotation
let user: { name: string; age: number } = {
  name: "John",
  age: 25
};

// Object must match exactly
let product: { name: string; price: number } = {
  name: "Phone",
  price: 999
};

product.name = "Laptop";  // ✅ OK
product.category = "Tech"; // ❌ Error - property doesn't exist
```

**Optional Properties:**
```typescript
let user: {
  name: string;
  age: number;
  email?: string;  // Optional (notice the ?)
} = {
  name: "John",
  age: 25
  // email is optional, can be omitted
};
```

**Note**: We'll learn better ways to define object types (interfaces) in Lesson 4!

---

## Type Aliases

Give a name to a type for reusability:

```typescript
// Instead of repeating the type
let user1: { name: string; age: number } = { name: "John", age: 25 };
let user2: { name: string; age: number } = { name: "Jane", age: 30 };

// Create a type alias
type User = { name: string; age: number };

let user1: User = { name: "John", age: 25 };
let user2: User = { name: "Jane", age: 30 };
```

**More Examples:**
```typescript
type ID = string | number;
type Status = "pending" | "active" | "inactive";
type Coordinate = [number, number];

let userId: ID = "abc123";
let orderId: ID = 12345;
let userStatus: Status = "active";
let location: Coordinate = [40.7, -74.0];
```

---

## Practical Examples from Our Codebase

### Example 1: User Model Types
```typescript
// From src/domain/entities/User.ts (simplified)
interface IUser {
  phone: string;              // Phone number
  email?: string;             // Optional email
  name?: string;              // Optional name
  role: string;               // User role
  avatar?: string;            // Optional avatar URL
  isVerified: boolean;        // Verification status
  isActive: boolean;          // Active status
  refreshToken?: string;      // Optional refresh token
}
```

### Example 2: Car Listing Types
```typescript
// From src/domain/entities/Car.ts (simplified)
interface ICarListing {
  brand: string;              // Car brand
  model: string;              // Car model
  year: number;               // Manufacturing year
  price: number;              // Price in rupees
  kmsDriven: number;          // Kilometers driven
  fuelType: string;           // Fuel type
  transmission: string;       // Transmission type
  images: string[];           // Array of image URLs
  isActive: boolean;          // Listing active?
}
```

### Example 3: Configuration Types
```typescript
// From src/config/environment.ts (simplified)
interface Config {
  port: number;               // Server port
  nodeEnv: string;            // Environment (dev/prod)
  jwt: {
    secret: string;           // JWT secret
    accessExpiration: string; // Token expiry time
  };
  database: {
    uri: string;              // MongoDB connection string
  };
}
```

---

## Common Mistakes to Avoid

### Mistake 1: Wrong type
```typescript
let age: string = 25;  // ❌ Error - 25 is a number, not string
let age: number = 25;  // ✅ Correct
```

### Mistake 2: Missing property
```typescript
let user: { name: string; age: number } = {
  name: "John"
  // ❌ Error - missing 'age' property
};
```

### Mistake 3: Extra property
```typescript
let user: { name: string } = {
  name: "John",
  age: 25  // ❌ Error - 'age' doesn't exist in type
};
```

### Mistake 4: Using `any` unnecessarily
```typescript
let price: any = "100";  // ❌ Bad - use proper type
let price: number = 100; // ✅ Good
```

---

## Type Annotation vs Type Inference Summary

```typescript
// TYPE INFERENCE (TypeScript figures it out)
let name = "John";              // string
let age = 25;                   // number
let isActive = true;            // boolean
let numbers = [1, 2, 3];        // number[]

// TYPE ANNOTATION (You tell TypeScript)
let name: string = "John";
let age: number = 25;
let isActive: boolean = true;
let numbers: number[] = [1, 2, 3];
```

**Best Practice**: Use inference when obvious, annotations when you need to be explicit.

---

## Practice Exercises

### Exercise 1: Fix the Types
```typescript
// Fix the type errors
let userName: number = "Alice";
let age: string = 25;
let isStudent: number = true;
let scores: string[] = [90, 85, 95];
```

<details>
<summary>Click to see answer</summary>

```typescript
let userName: string = "Alice";     // Change number to string
let age: number = 25;               // Change string to number
let isStudent: boolean = true;      // Change number to boolean
let scores: number[] = [90, 85, 95]; // Change string[] to number[]
```
</details>

### Exercise 2: Create User Type
```typescript
// Create a variable for a user with:
// - name (string)
// - age (number)
// - email (optional string)
// - hobbies (array of strings)

// Your code here:
```

<details>
<summary>Click to see answer</summary>

```typescript
let user: {
  name: string;
  age: number;
  email?: string;
  hobbies: string[];
} = {
  name: "Alice",
  age: 25,
  hobbies: ["reading", "coding", "gaming"]
  // email is optional, can be omitted
};

// Or using type alias:
type User = {
  name: string;
  age: number;
  email?: string;
  hobbies: string[];
};

let user: User = {
  name: "Alice",
  age: 25,
  hobbies: ["reading", "coding", "gaming"]
};
```
</details>

### Exercise 3: Arrays and Tuples
```typescript
// 1. Create an array of numbers
// 2. Create an array of strings
// 3. Create a tuple for [name, age, isStudent]

// Your code here:
```

<details>
<summary>Click to see answer</summary>

```typescript
// 1. Array of numbers
let scores: number[] = [90, 85, 95, 88];

// 2. Array of strings
let names: string[] = ["Alice", "Bob", "Charlie"];

// 3. Tuple
let student: [string, number, boolean] = ["Alice", 20, true];
```
</details>

---

## Key Takeaways

1. **Basic types**: `string`, `number`, `boolean`, `null`, `undefined`
2. **Arrays**: `type[]` or `Array<type>`
3. **Tuples**: Fixed-length arrays with specific types
4. **Type inference**: TypeScript can figure out types automatically
5. **Avoid `any`**: It disables type checking
6. **Optional properties**: Use `?` for optional values

---

## Next Steps

You now know all basic types! Next, you'll learn how to use these types with functions.

**Next Lesson**: [03-functions.md](03-functions.md) - Learn about functions and type annotations

---

## Self-Check Questions

Before moving on, make sure you can answer:

1. What are the three primitive types in TypeScript?
2. How do you declare an array of numbers?
3. What's the difference between `null` and `undefined`?
4. What is a tuple and how is it different from an array?
5. Why should you avoid using `any`?
6. What is type inference?

If you can answer these, you're ready for functions! 🚀
