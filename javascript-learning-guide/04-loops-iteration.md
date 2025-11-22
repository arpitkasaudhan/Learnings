# Lesson 4: Loops and Iteration

## 🎯 Learning Objectives
- Master for loops
- Understand while and do...while loops
- Learn for...of and for...in loops
- Use break and continue
- Understand loop performance
- Apply loops to real problems

---

## Why Loops?

**Loops repeat code multiple times without writing it multiple times.**

```javascript
// ❌ Without loop (repetitive)
console.log("Car 1");
console.log("Car 2");
console.log("Car 3");
console.log("Car 4");
console.log("Car 5");

// ✅ With loop (clean)
for (let i = 1; i <= 5; i++) {
  console.log(`Car ${i}`);
}
```

---

## 1. for Loop

**Most common loop - use when you know how many times to loop.**

### Basic Syntax
```javascript
for (initialization; condition; increment) {
  // Code to repeat
}
```

### Examples

```javascript
// Count from 1 to 5
for (let i = 1; i <= 5; i++) {
  console.log(i);
}
// Output: 1 2 3 4 5

// Count from 0 to 4
for (let i = 0; i < 5; i++) {
  console.log(i);
}
// Output: 0 1 2 3 4

// Count backwards
for (let i = 5; i >= 1; i--) {
  console.log(i);
}
// Output: 5 4 3 2 1

// Count by 2
for (let i = 0; i <= 10; i += 2) {
  console.log(i);
}
// Output: 0 2 4 6 8 10
```

### Loop Through Arrays

```javascript
let cars = ["Honda City", "Maruti Swift", "Hyundai Creta"];

for (let i = 0; i < cars.length; i++) {
  console.log(cars[i]);
}
// Output:
// Honda City
// Maruti Swift
// Hyundai Creta

// With index
for (let i = 0; i < cars.length; i++) {
  console.log(`${i + 1}. ${cars[i]}`);
}
// Output:
// 1. Honda City
// 2. Maruti Swift
// 3. Hyundai Creta
```

---

## 2. while Loop

**Use when you don't know how many times to loop - continues while condition is true.**

### Basic Syntax
```javascript
while (condition) {
  // Code to repeat
}
```

### Examples

```javascript
// Count to 5
let i = 1;
while (i <= 5) {
  console.log(i);
  i++;
}

// User input example
let password = "";
while (password !== "correct") {
  password = prompt("Enter password:");
}
console.log("Access granted!");

// Read from API until no more pages
let page = 1;
let hasMore = true;
while (hasMore) {
  let data = await fetchPage(page);
  processData(data);
  hasMore = data.hasNextPage;
  page++;
}
```

**⚠️ Warning: Infinite loop if condition never becomes false!**

```javascript
// ❌ Infinite loop - never stops!
let i = 1;
while (i <= 5) {
  console.log(i);
  // Forgot to increment i!
}

// ✅ Correct
let i = 1;
while (i <= 5) {
  console.log(i);
  i++;  // Don't forget this!
}
```

---

## 3. do...while Loop

**Runs at least once, then checks condition.**

### Basic Syntax
```javascript
do {
  // Code runs at least once
} while (condition);
```

### Examples

```javascript
// Runs once even if condition is false
let i = 10;
do {
  console.log(i);
  i++;
} while (i < 5);
// Output: 10 (runs once despite condition being false)

// Useful for menus
let choice;
do {
  console.log("1. Login");
  console.log("2. Register");
  console.log("3. Exit");
  choice = prompt("Choose option:");
} while (choice !== "3");

// Retry logic
let success = false;
let attempts = 0;
do {
  success = tryConnectToDatabase();
  attempts++;
} while (!success && attempts < 3);
```

---

## 4. for...of Loop

**Iterate over array values - modern and clean!**

### Basic Syntax
```javascript
for (let item of array) {
  // Use item
}
```

### Examples

```javascript
let cars = ["Honda", "Maruti", "Hyundai"];

// With for...of (recommended)
for (let car of cars) {
  console.log(car);
}

// Equivalent to traditional for loop
for (let i = 0; i < cars.length; i++) {
  console.log(cars[i]);
}
```

**Real Examples:**

```javascript
// Process array of car listings
let listings = [
  { brand: "Honda", price: 500000 },
  { brand: "Maruti", price: 400000 },
  { brand: "Hyundai", price: 600000 }
];

for (let car of listings) {
  console.log(`${car.brand} - ₹${car.price}`);
}

// Loop through strings
let name = "Honda";
for (let char of name) {
  console.log(char);
}
// Output: H o n d a
```

---

## 5. for...in Loop

**Iterate over object properties.**

### Basic Syntax
```javascript
for (let key in object) {
  // Use key
}
```

### Examples

```javascript
let car = {
  brand: "Honda",
  model: "City",
  year: 2023,
  price: 1500000
};

// Get keys
for (let key in car) {
  console.log(key);
}
// Output: brand model year price

// Get keys and values
for (let key in car) {
  console.log(`${key}: ${car[key]}`);
}
// Output:
// brand: Honda
// model: City
// year: 2023
// price: 1500000
```

**⚠️ Note:** Don't use `for...in` for arrays - use `for...of` instead!

```javascript
let cars = ["Honda", "Maruti", "Hyundai"];

// ❌ Bad (gives index as string)
for (let index in cars) {
  console.log(index);  // "0" "1" "2" (strings!)
}

// ✅ Good
for (let car of cars) {
  console.log(car);  // "Honda" "Maruti" "Hyundai"
}
```

---

## 6. break Statement

**Exit loop early.**

```javascript
// Find first car under budget
let cars = [
  { brand: "BMW", price: 5000000 },
  { brand: "Honda", price: 1500000 },
  { brand: "Maruti", price: 800000 },
  { brand: "Hyundai", price: 1200000 }
];

let budget = 1000000;
let foundCar = null;

for (let car of cars) {
  if (car.price <= budget) {
    foundCar = car;
    break;  // Stop searching
  }
}

console.log(foundCar);  // { brand: "Maruti", price: 800000 }

// Find specific item
let numbers = [1, 2, 3, 4, 5, 6, 7, 8];
for (let num of numbers) {
  if (num === 5) {
    console.log("Found 5!");
    break;
  }
}
```

---

## 7. continue Statement

**Skip current iteration and continue with next.**

```javascript
// Print only even numbers
for (let i = 1; i <= 10; i++) {
  if (i % 2 !== 0) {
    continue;  // Skip odd numbers
  }
  console.log(i);
}
// Output: 2 4 6 8 10

// Process only active cars
let cars = [
  { brand: "Honda", isActive: true },
  { brand: "Maruti", isActive: false },
  { brand: "Hyundai", isActive: true }
];

for (let car of cars) {
  if (!car.isActive) {
    continue;  // Skip inactive
  }
  console.log(car.brand);
}
// Output: Honda Hyundai
```

---

## Nested Loops

**Loop inside another loop.**

```javascript
// Multiplication table
for (let i = 1; i <= 3; i++) {
  for (let j = 1; j <= 3; j++) {
    console.log(`${i} x ${j} = ${i * j}`);
  }
}

// 2D array (matrix)
let matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

for (let i = 0; i < matrix.length; i++) {
  for (let j = 0; j < matrix[i].length; j++) {
    console.log(matrix[i][j]);
  }
}
```

**Real Example:**

```javascript
// Generate all combinations of brands and models
let brands = ["Honda", "Maruti"];
let models = ["Sedan", "SUV", "Hatchback"];

for (let brand of brands) {
  for (let model of models) {
    console.log(`${brand} ${model}`);
  }
}
// Output:
// Honda Sedan
// Honda SUV
// Honda Hatchback
// Maruti Sedan
// Maruti SUV
// Maruti Hatchback
```

---

## forEach Method

**Array method for iteration - covered more in Lesson 6.**

```javascript
let cars = ["Honda", "Maruti", "Hyundai"];

// forEach with callback
cars.forEach(function(car) {
  console.log(car);
});

// With arrow function (modern)
cars.forEach(car => {
  console.log(car);
});

// With index
cars.forEach((car, index) => {
  console.log(`${index + 1}. ${car}`);
});
```

---

## Real-World Examples

### Example 1: Calculate Total Price

```javascript
let cartItems = [
  { name: "Item 1", price: 1000, quantity: 2 },
  { name: "Item 2", price: 500, quantity: 3 },
  { name: "Item 3", price: 2000, quantity: 1 }
];

let total = 0;
for (let item of cartItems) {
  total += item.price * item.quantity;
}

console.log(`Total: ₹${total}`);  // Total: ₹5500
```

### Example 2: Filter Array

```javascript
// Get cars within budget
let cars = [
  { brand: "Honda", price: 1500000 },
  { brand: "Maruti", price: 800000 },
  { brand: "BMW", price: 5000000 },
  { brand: "Hyundai", price: 1200000 }
];

let budget = 2000000;
let affordableCars = [];

for (let car of cars) {
  if (car.price <= budget) {
    affordableCars.push(car);
  }
}

console.log(affordableCars);
// [Honda, Maruti, Hyundai]
```

### Example 3: Find Item

```javascript
// Find car by ID
let cars = [
  { id: 1, brand: "Honda" },
  { id: 2, brand: "Maruti" },
  { id: 3, brand: "Hyundai" }
];

let searchId = 2;
let foundCar = null;

for (let car of cars) {
  if (car.id === searchId) {
    foundCar = car;
    break;
  }
}

console.log(foundCar);  // { id: 2, brand: "Maruti" }
```

### Example 4: Transform Array

```javascript
// Add discount to all prices
let products = [
  { name: "Product 1", price: 1000 },
  { name: "Product 2", price: 2000 },
  { name: "Product 3", price: 1500 }
];

let discountedProducts = [];

for (let product of products) {
  discountedProducts.push({
    name: product.name,
    originalPrice: product.price,
    discountedPrice: product.price * 0.9  // 10% off
  });
}

console.log(discountedProducts);
```

### Example 5: Count Occurrences

```javascript
// Count car brands
let cars = ["Honda", "Maruti", "Honda", "Hyundai", "Honda", "Maruti"];

let brandCount = {};

for (let car of cars) {
  if (brandCount[car]) {
    brandCount[car]++;
  } else {
    brandCount[car] = 1;
  }
}

console.log(brandCount);
// { Honda: 3, Maruti: 2, Hyundai: 1 }
```

---

## Loop Performance

### Best Practices

```javascript
let cars = ["Honda", "Maruti", "Hyundai"];

// ❌ Bad - recalculates length every iteration
for (let i = 0; i < cars.length; i++) {
  console.log(cars[i]);
}

// ✅ Good - cache length
let length = cars.length;
for (let i = 0; i < length; i++) {
  console.log(cars[i]);
}

// ✅ Best - use for...of (cleaner and fast)
for (let car of cars) {
  console.log(car);
}
```

### Avoid Unnecessary Work

```javascript
// ❌ Bad - expensive operation in loop
for (let i = 0; i < 1000; i++) {
  let result = complexCalculation();  // Calculated 1000 times!
  doSomething(result, i);
}

// ✅ Good - do once outside loop
let result = complexCalculation();  // Calculated once
for (let i = 0; i < 1000; i++) {
  doSomething(result, i);
}
```

---

## Practice Exercises

### Exercise 1: Sum Numbers
```javascript
// Calculate sum of numbers from 1 to 100
// Your code here:
```

<details>
<summary>Solution</summary>

```javascript
let sum = 0;
for (let i = 1; i <= 100; i++) {
  sum += i;
}
console.log(sum);  // 5050

// Or mathematical formula: n * (n + 1) / 2
console.log(100 * 101 / 2);  // 5050
```
</details>

### Exercise 2: Find Even Numbers
```javascript
// Print all even numbers from 1 to 20
// Your code here:
```

<details>
<summary>Solution</summary>

```javascript
// Method 1: Check if even
for (let i = 1; i <= 20; i++) {
  if (i % 2 === 0) {
    console.log(i);
  }
}

// Method 2: Increment by 2
for (let i = 2; i <= 20; i += 2) {
  console.log(i);
}
```
</details>

### Exercise 3: Reverse String
```javascript
// Reverse a string using loop
let str = "Honda";
// Your code here:
```

<details>
<summary>Solution</summary>

```javascript
let str = "Honda";
let reversed = "";

for (let i = str.length - 1; i >= 0; i--) {
  reversed += str[i];
}

console.log(reversed);  // "adnoH"

// Or with for...of
let reversed2 = "";
for (let char of str) {
  reversed2 = char + reversed2;
}
console.log(reversed2);  // "adnoH"
```
</details>

### Exercise 4: Filter Array
```javascript
// Get all cars with price less than 1000000
let cars = [
  { brand: "Honda", price: 1500000 },
  { brand: "Maruti", price: 800000 },
  { brand: "BMW", price: 5000000 },
  { brand: "Hyundai", price: 900000 }
];
// Your code here:
```

<details>
<summary>Solution</summary>

```javascript
let cars = [
  { brand: "Honda", price: 1500000 },
  { brand: "Maruti", price: 800000 },
  { brand: "BMW", price: 5000000 },
  { brand: "Hyundai", price: 900000 }
];

let budget = 1000000;
let affordableCars = [];

for (let car of cars) {
  if (car.price < budget) {
    affordableCars.push(car);
  }
}

console.log(affordableCars);
// [{ brand: "Maruti", price: 800000 }, { brand: "Hyundai", price: 900000 }]
```
</details>

---

## Common Mistakes

### Mistake 1: Off-by-One Error

```javascript
let arr = [1, 2, 3, 4, 5];

// ❌ Wrong - goes beyond array
for (let i = 0; i <= arr.length; i++) {
  console.log(arr[i]);  // Last one is undefined
}

// ✅ Correct
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}
```

### Mistake 2: Modifying Array While Looping

```javascript
let numbers = [1, 2, 3, 4, 5];

// ❌ Bad - modifying during iteration
for (let i = 0; i < numbers.length; i++) {
  numbers.splice(i, 1);  // Skips elements!
}

// ✅ Good - loop backwards when removing
for (let i = numbers.length - 1; i >= 0; i--) {
  numbers.splice(i, 1);
}
```

### Mistake 3: Forgetting to Update Counter

```javascript
// ❌ Infinite loop
let i = 0;
while (i < 10) {
  console.log(i);
  // Forgot: i++
}

// ✅ Correct
let i = 0;
while (i < 10) {
  console.log(i);
  i++;
}
```

---

## Loop Comparison

| Loop Type | Use When | Example |
|-----------|----------|---------|
| `for` | Know iteration count | Loop 10 times |
| `while` | Don't know count | Until user quits |
| `do...while` | Run at least once | Show menu first |
| `for...of` | Iterate array values | Process each car |
| `for...in` | Iterate object keys | Object properties |
| `forEach` | Array with callback | Clean array iteration |

---

## Key Takeaways

1. **for loop** - Most common, use when you know count
2. **while loop** - Use when condition-based
3. **do...while** - Runs at least once
4. **for...of** - Iterate array values (modern, recommended)
5. **for...in** - Iterate object properties
6. **break** - Exit loop early
7. **continue** - Skip iteration
8. **Avoid infinite loops** - Always update counter

---

## Next Lesson

**Next**: [05-functions.md](05-functions.md) - Already completed!

---

## Self-Check Questions

1. What's the difference between `for` and `while`?
2. When would you use `do...while` instead of `while`?
3. What's the difference between `for...of` and `for...in`?
4. What does `break` do?
5. What does `continue` do?
6. How do you avoid an infinite loop?

Ready for more? You've already learned functions! Check out arrays next! 🚀
