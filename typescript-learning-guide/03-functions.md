# Lesson 3: Functions in TypeScript

## 🎯 Learning Objectives
- Type function parameters and returns
- Use optional and default parameters
- Understand function overloading
- Work with rest parameters

---

## Function Type Annotations

```typescript
// Basic function
function add(a: number, b: number): number {
  return a + b;
}

// Arrow function
const multiply = (a: number, b: number): number => {
  return a * b;
};

// Concise arrow function
const divide = (a: number, b: number): number => a / b;
```

---

## Optional Parameters

```typescript
// Optional parameter with ?
function greet(name: string, greeting?: string): string {
  if (greeting) {
    return `${greeting}, ${name}!`;
  }
  return `Hello, ${name}!`;
}

console.log(greet("John"));              // "Hello, John!"
console.log(greet("John", "Welcome"));   // "Welcome, John!"
```

---

## Default Parameters

```typescript
function createUser(name: string, role: string = "user"): object {
  return { name, role };
}

console.log(createUser("John"));              // { name: "John", role: "user" }
console.log(createUser("Jane", "admin"));     // { name: "Jane", role: "admin" }
```

---

## Rest Parameters

```typescript
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}

console.log(sum(1, 2, 3));        // 6
console.log(sum(1, 2, 3, 4, 5));  // 15
```

---

## Function Types

```typescript
// Function type
let calculate: (a: number, b: number) => number;

calculate = (x, y) => x + y;
console.log(calculate(5, 3));  // 8

calculate = (x, y) => x * y;
console.log(calculate(5, 3));  // 15
```

---

## Void Return Type

```typescript
function logMessage(message: string): void {
  console.log(message);
  // No return value
}

logMessage("Hello");
```

---

## Never Return Type

```typescript
// Function that never returns
function throwError(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {
    // Never ends
  }
}
```

---

## Key Takeaways

1. **Type parameters and returns** explicitly
2. **Optional parameters** with `?`
3. **Default parameters** for fallback values
4. **Rest parameters** with `...`
5. **void** for no return
6. **never** for functions that don't return

**Next**: [04-objects-interfaces.md](04-objects-interfaces.md)
