# Lesson 5: Functions in JavaScript

## 🎯 Learning Objectives
- Understand what functions are
- Learn different ways to create functions
- Master arrow functions
- Understand parameters and return values
- Learn callback functions

---

## What are Functions?

Functions are reusable blocks of code.

```javascript
// Define function
function greet(name) {
  console.log("Hello, " + name + "!");
}

// Use function
greet("Alice");  // Hello, Alice!
greet("Bob");    // Hello, Bob!
```

---

## Function Declaration

```javascript
function add(a, b) {
  return a + b;
}

const sum = add(5, 10);
console.log(sum);  // 15
```

---

## Function Expression

```javascript
const multiply = function(a, b) {
  return a * b;
};

console.log(multiply(5, 10));  // 50
```

---

## Arrow Functions (Modern)

```javascript
// Traditional
const add = function(a, b) {
  return a + b;
};

// Arrow function
const add = (a, b) => {
  return a + b;
};

// Short arrow function (implicit return)
const add = (a, b) => a + b;

// Single parameter (no parentheses)
const double = x => x * 2;

// No parameters
const greet = () => console.log("Hello!");
```

---

## Parameters and Arguments

```javascript
// Default parameters
function greet(name = "Guest") {
  console.log("Hello, " + name);
}

greet();         // Hello, Guest
greet("Alice");  // Hello, Alice

// Rest parameters
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

sum(1, 2, 3);     // 6
sum(1, 2, 3, 4, 5);  // 15
```

---

## Return Values

```javascript
// Function returns a value
function calculateTotal(price, quantity) {
  return price * quantity;
}

const total = calculateTotal(100, 5);
console.log(total);  // 500

// No return = undefined
function noReturn() {
  console.log("Hello");
}

const result = noReturn();  // undefined
```

---

## Callback Functions

```javascript
// Function as argument
function processUser(name, callback) {
  console.log("Processing: " + name);
  callback(name);
}

// Pass function as callback
processUser("Alice", function(name) {
  console.log("Done processing: " + name);
});

// With arrow function
processUser("Bob", (name) => {
  console.log("Done: " + name);
});
```

---

## Real Examples from Your Backend

### Controller Method

```javascript
async function sendOTP(req, res, next) {
  try {
    const { phone } = req.body;
    const result = await AuthService.sendOTP(phone);
    
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
}
```

### Service Method

```javascript
async function calculateTotal(price, quantity) {
  const total = price * quantity;
  return total;
}
```

### Array Methods with Callbacks

```javascript
const numbers = [1, 2, 3, 4, 5];

// map
const doubled = numbers.map(num => num * 2);

// filter
const evens = numbers.filter(num => num % 2 === 0);

// reduce
const sum = numbers.reduce((total, num) => total + num, 0);
```

---

## Practice Exercises

### Exercise 1: Create Calculator
Create functions for add, subtract, multiply, divide.

<details>
<summary>Solution</summary>

```javascript
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

console.log(add(10, 5));       // 15
console.log(subtract(10, 5));  // 5
console.log(multiply(10, 5));  // 50
console.log(divide(10, 5));    // 2
```
</details>

---

## Key Takeaways

1. **Functions are reusable code blocks**
2. **Arrow functions are modern** and concise
3. **Functions can take parameters** and return values
4. **Callbacks are functions** passed as arguments
5. **Use const for function expressions**

**Next Lesson**: [06-arrays.md](06-arrays.md)
