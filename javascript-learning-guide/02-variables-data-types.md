# Lesson 2: Variables and Data Types

## 🎯 Learning Objectives
- Understand let, const, and var
- Learn all JavaScript data types
- Know when to use each variable type
- Understand type coercion
- Use typeof operator

---

## Variables: Storing Data

Variables are like boxes that store values.

```javascript
// Create a box called 'name' and put "Alice" in it
let name = "Alice";

// Create a box called 'age' and put 25 in it
let age = 25;

// Use the values
console.log(name);  // Alice
console.log(age);   // 25
```

---

## Three Ways to Declare Variables

### 1. let (Modern, Recommended)

```javascript
let name = "Alice";
name = "Bob";  // Can change
console.log(name);  // Bob

let age = 25;
age = 26;  // Can change
console.log(age);  // 26
```

**Use let when:**
- Value will change
- Variable is local to a block

### 2. const (Modern, Recommended)

```javascript
const PI = 3.14159;
PI = 3.14;  // ❌ Error! Cannot change const

const name = "Alice";
name = "Bob";  // ❌ Error! Cannot reassign
```

**Use const when:**
- Value won't change
- Want to prevent accidental changes
- **Default choice** - use const unless you need let

**Objects and arrays with const:**
```javascript
const user = { name: "Alice" };
user.name = "Bob";  // ✅ OK! Can modify properties
user = { name: "Charlie" };  // ❌ Error! Cannot reassign

const numbers = [1, 2, 3];
numbers.push(4);  // ✅ OK! Can modify array
numbers = [5, 6, 7];  // ❌ Error! Cannot reassign
```

### 3. var (Old, Avoid)

```javascript
var name = "Alice";  // Old way
// Use let or const instead!
```

**Problems with var:**
- Function-scoped, not block-scoped
- Can be redeclared
- Hoisting issues

**Don't use var in modern JavaScript!**

---

## Data Types in JavaScript

### Primitive Types

### 1. String (Text)

```javascript
let name = "Alice";
let greeting = 'Hello';
let message = `Hello, ${name}`;  // Template literal

// String operations
let text = "JavaScript";
console.log(text.length);        // 10
console.log(text.toUpperCase()); // JAVASCRIPT
console.log(text.toLowerCase()); // javascript
console.log(text[0]);            // J
```

**Examples from your backend:**
```javascript
const phone = "+919876543210";
const email = "user@example.com";
const role = "customer";
```

### 2. Number (Integers and Decimals)

```javascript
let age = 25;           // Integer
let price = 19.99;      // Decimal
let negative = -10;     // Negative
let billion = 1e9;      // Scientific notation

// Math operations
let sum = 10 + 5;       // 15
let diff = 10 - 5;      // 5
let product = 10 * 5;   // 50
let quotient = 10 / 5;  // 2
let remainder = 10 % 3; // 1 (modulo)
let power = 2 ** 3;     // 8 (exponentiation)
```

**Special numbers:**
```javascript
let inf = Infinity;
let negInf = -Infinity;
let notNum = NaN;  // Not a Number

// Check for NaN
isNaN(NaN);      // true
isNaN("hello");  // true
isNaN(42);       // false
```

**Examples from your backend:**
```javascript
const port = 8080;
const year = 2024;
const price = 1200000;
const kmsDriven = 15000;
```

### 3. Boolean (True/False)

```javascript
let isActive = true;
let isVerified = false;

// Boolean from comparisons
let isAdult = age >= 18;
let hasEmail = email !== "";
let isValid = true && false;  // false
```

**Examples from your backend:**
```javascript
const isActive = true;
const isVerified = false;
const hasPermission = user.role === 'dealer';
```

### 4. Undefined

```javascript
let x;
console.log(x);  // undefined

let user = { name: "Alice" };
console.log(user.age);  // undefined (property doesn't exist)
```

### 5. Null

```javascript
let nothing = null;  // Intentionally empty

// Difference: undefined vs null
let x;              // undefined (declared but not assigned)
let y = null;       // null (explicitly set to empty)
```

### 6. Symbol (Unique identifiers)

```javascript
let id1 = Symbol("id");
let id2 = Symbol("id");
console.log(id1 === id2);  // false (always unique)
```

### 7. BigInt (Very large numbers)

```javascript
let bigNumber = 9007199254740991n;
let anotherBig = BigInt(9007199254740991);
```

---

## Object Type

### Object (Collection of properties)

```javascript
let user = {
  name: "Alice",
  age: 25,
  email: "alice@example.com"
};

// Access properties
console.log(user.name);    // Alice
console.log(user["age"]);  // 25

// Modify
user.age = 26;
user.city = "Mumbai";

// Example from your backend
const carListing = {
  brand: "Honda",
  model: "City",
  year: 2022,
  price: 1200000,
  location: {
    city: "Mumbai",
    state: "Maharashtra"
  }
};
```

### Array (Ordered list)

```javascript
let numbers = [1, 2, 3, 4, 5];
let names = ["Alice", "Bob", "Charlie"];
let mixed = [1, "hello", true, null];

// Access elements
console.log(numbers[0]);  // 1
console.log(names[1]);    // Bob

// Modify
numbers[0] = 10;
numbers.push(6);  // Add to end

// Example from your backend
const images = ["image1.jpg", "image2.jpg", "image3.jpg"];
const tags = ["sedan", "automatic", "petrol"];
```

---

## Checking Data Types

### typeof Operator

```javascript
console.log(typeof "hello");      // string
console.log(typeof 42);           // number
console.log(typeof true);         // boolean
console.log(typeof undefined);    // undefined
console.log(typeof null);         // object (JavaScript quirk!)
console.log(typeof {});           // object
console.log(typeof []);           // object (arrays are objects!)
console.log(typeof function(){}); // function
```

### Better Array Check

```javascript
Array.isArray([]);     // true
Array.isArray({});     // false
Array.isArray("text"); // false
```

---

## Type Conversion

### Implicit Conversion (Coercion)

```javascript
// String + Number = String
console.log("5" + 2);      // "52" (string concatenation)
console.log(5 + "2");      // "52"

// String - Number = Number
console.log("5" - 2);      // 3 (math operation)
console.log("10" * "2");   // 20
console.log("10" / "2");   // 5

// Boolean to Number
console.log(true + 1);     // 2
console.log(false + 1);    // 1
```

### Explicit Conversion

```javascript
// To String
String(123);               // "123"
(123).toString();          // "123"

// To Number
Number("123");             // 123
parseInt("123");           // 123
parseFloat("123.45");      // 123.45
+"123";                    // 123 (unary plus)

// To Boolean
Boolean(1);                // true
Boolean(0);                // false
Boolean("");               // false
Boolean("hello");          // true
!!value;                   // Boolean conversion
```

---

## Variable Naming Rules

### Valid Names

```javascript
let userName = "Alice";          // ✅ camelCase (recommended)
let user_name = "Bob";           // ✅ snake_case
let $price = 100;                // ✅ $ is allowed
let _private = "secret";         // ✅ _ is allowed
let age2 = 25;                   // ✅ numbers allowed (not at start)
```

### Invalid Names

```javascript
let 2age = 25;                   // ❌ Can't start with number
let user-name = "Alice";         // ❌ Hyphens not allowed
let class = "A";                 // ❌ Reserved keyword
let function = () => {};         // ❌ Reserved keyword
```

### Naming Conventions

```javascript
// Variables and functions: camelCase
let firstName = "Alice";
function calculateTotal() {}

// Constants: UPPER_SNAKE_CASE
const MAX_SIZE = 100;
const API_URL = "https://api.example.com";

// Classes: PascalCase
class UserService {}
class CarController {}
```

---

## Real Examples from Your Backend

### User Data

```javascript
const user = {
  phone: "+919876543210",
  email: "user@example.com",
  name: "John Doe",
  role: "customer",
  isVerified: true,
  isActive: true
};
```

### Car Listing

```javascript
const car = {
  brand: "Honda",
  model: "City",
  year: 2022,
  price: 1200000,
  kmsDriven: 15000,
  fuelType: "Petrol",
  transmission: "Automatic",
  images: ["img1.jpg", "img2.jpg"],
  location: {
    city: "Mumbai",
    state: "Maharashtra"
  }
};
```

### Configuration

```javascript
const config = {
  port: 8080,
  nodeEnv: "development",
  apiVersion: "v1",
  jwt: {
    secret: "your-secret-key",
    expiration: "15m"
  }
};
```

---

## Practice Exercises

### Exercise 1: Variable Declaration
Create variables for:
- Your name (string)
- Your age (number)
- Are you a student? (boolean)

<details>
<summary>Solution</summary>

```javascript
const name = "Alice";
const age = 25;
const isStudent = true;

console.log(name, age, isStudent);
```
</details>

### Exercise 2: Object Creation
Create an object representing a car with brand, model, year, and price.

<details>
<summary>Solution</summary>

```javascript
const car = {
  brand: "Honda",
  model: "City",
  year: 2022,
  price: 1200000
};

console.log(car);
```
</details>

---

## Key Takeaways

1. **Use const by default**, let when needed
2. **Avoid var** - it's old
3. **7 primitive types** + Object type
4. **typeof checks data type**
5. **JavaScript converts types automatically** (coercion)
6. **camelCase for variables**, UPPER_CASE for constants

**Next Lesson**: [03-operators-conditions.md](03-operators-conditions.md)

Ready? Let's go! 🚀
