# Lesson 6: Arrays

## 🎯 Learning Objectives
- Understand JavaScript arrays
- Create and manipulate arrays
- Use array methods
- Master array iteration
- Work with multi-dimensional arrays

---

## What are Arrays?

**Arrays store ordered collections of values.**

```javascript
// Single values
let car1 = "Honda City";
let car2 = "Maruti Swift";
let car3 = "Hyundai Creta";

// ✅ Better - array
let cars = ["Honda City", "Maruti Swift", "Hyundai Creta"];
```

---

## Creating Arrays

### Array Literal (Recommended)
```javascript
let fruits = ["Apple", "Banana", "Orange"];
let numbers = [1, 2, 3, 4, 5];
let mixed = [1, "Hello", true, null, { name: "John" }];
let empty = [];
```

### Array Constructor
```javascript
let arr = new Array(5);        // Array with 5 empty slots
let arr2 = new Array(1, 2, 3); // [1, 2, 3]
```

### From String
```javascript
let str = "Hello";
let chars = Array.from(str);  // ["H", "e", "l", "l", "o"]
```

---

## Accessing Array Elements

### Using Index (0-based)
```javascript
let cars = ["Honda", "Maruti", "Hyundai"];

console.log(cars[0]);  // "Honda" (first element)
console.log(cars[1]);  // "Maruti" (second element)
console.log(cars[2]);  // "Hyundai" (third element)
console.log(cars[3]);  // undefined (doesn't exist)

// Negative index (from end) - not standard JavaScript
// Use this instead:
console.log(cars[cars.length - 1]);  // "Hyundai" (last element)
```

### Length Property
```javascript
let cars = ["Honda", "Maruti", "Hyundai"];
console.log(cars.length);  // 3

// Get last element
let lastCar = cars[cars.length - 1];  // "Hyundai"
```

---

## Modifying Arrays

### Change Element
```javascript
let fruits = ["Apple", "Banana", "Orange"];
fruits[1] = "Mango";
console.log(fruits);  // ["Apple", "Mango", "Orange"]
```

### Add Element at End
```javascript
let cars = ["Honda", "Maruti"];
cars.push("Hyundai");
console.log(cars);  // ["Honda", "Maruti", "Hyundai"]

// Can add multiple
cars.push("BMW", "Audi");
console.log(cars);  // ["Honda", "Maruti", "Hyundai", "BMW", "Audi"]
```

### Remove Last Element
```javascript
let cars = ["Honda", "Maruti", "Hyundai"];
let removed = cars.pop();
console.log(removed);  // "Hyundai"
console.log(cars);     // ["Honda", "Maruti"]
```

### Add Element at Beginning
```javascript
let cars = ["Honda", "Maruti"];
cars.unshift("BMW");
console.log(cars);  // ["BMW", "Honda", "Maruti"]
```

### Remove First Element
```javascript
let cars = ["BMW", "Honda", "Maruti"];
let removed = cars.shift();
console.log(removed);  // "BMW"
console.log(cars);     // ["Honda", "Maruti"]
```

---

## Array Methods

### slice() - Extract Part
```javascript
let cars = ["Honda", "Maruti", "Hyundai", "BMW", "Audi"];

// Get elements from index 1 to 3 (3 not included)
let some = cars.slice(1, 3);
console.log(some);  // ["Maruti", "Hyundai"]

// Get from index 2 to end
let rest = cars.slice(2);
console.log(rest);  // ["Hyundai", "BMW", "Audi"]

// Original array unchanged
console.log(cars);  // ["Honda", "Maruti", "Hyundai", "BMW", "Audi"]
```

### splice() - Add/Remove Elements
```javascript
let cars = ["Honda", "Maruti", "Hyundai"];

// Remove 1 element at index 1
cars.splice(1, 1);
console.log(cars);  // ["Honda", "Hyundai"]

// Add elements at index 1
cars.splice(1, 0, "BMW", "Audi");
console.log(cars);  // ["Honda", "BMW", "Audi", "Hyundai"]

// Replace element at index 2
cars.splice(2, 1, "Tesla");
console.log(cars);  // ["Honda", "BMW", "Tesla", "Hyundai"]
```

### concat() - Join Arrays
```javascript
let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];
let combined = arr1.concat(arr2);
console.log(combined);  // [1, 2, 3, 4, 5, 6]

// With spread operator (modern)
let combined2 = [...arr1, ...arr2];
console.log(combined2);  // [1, 2, 3, 4, 5, 6]
```

### join() - Array to String
```javascript
let cars = ["Honda", "Maruti", "Hyundai"];

let str = cars.join();
console.log(str);  // "Honda,Maruti,Hyundai"

let str2 = cars.join(" - ");
console.log(str2);  // "Honda - Maruti - Hyundai"

let str3 = cars.join("");
console.log(str3);  // "HondaMarutiHyundai"
```

### reverse() - Reverse Array
```javascript
let numbers = [1, 2, 3, 4, 5];
numbers.reverse();
console.log(numbers);  // [5, 4, 3, 2, 1]

// ⚠️ Modifies original array!
```

### sort() - Sort Array
```javascript
let fruits = ["Banana", "Apple", "Orange", "Mango"];
fruits.sort();
console.log(fruits);  // ["Apple", "Banana", "Mango", "Orange"]

// Numbers need custom compare function
let numbers = [10, 5, 40, 25, 1000];
numbers.sort();
console.log(numbers);  // [10, 1000, 25, 40, 5] - WRONG!

// ✅ Correct way for numbers
numbers.sort((a, b) => a - b);
console.log(numbers);  // [5, 10, 25, 40, 1000]

// Descending order
numbers.sort((a, b) => b - a);
console.log(numbers);  // [1000, 40, 25, 10, 5]
```

---

## Array Iteration Methods

### forEach() - Execute Function for Each Element
```javascript
let cars = ["Honda", "Maruti", "Hyundai"];

cars.forEach(function(car) {
  console.log(car);
});

// With arrow function
cars.forEach(car => console.log(car));

// With index
cars.forEach((car, index) => {
  console.log(`${index}: ${car}`);
});
// Output:
// 0: Honda
// 1: Maruti
// 2: Hyundai
```

### map() - Transform Each Element
```javascript
let numbers = [1, 2, 3, 4, 5];

let doubled = numbers.map(n => n * 2);
console.log(doubled);  // [2, 4, 6, 8, 10]

// Real example
let cars = [
  { brand: "Honda", price: 1500000 },
  { brand: "Maruti", price: 800000 }
];

let prices = cars.map(car => car.price);
console.log(prices);  // [1500000, 800000]

let formatted = cars.map(car => ({
  brand: car.brand,
  priceFormatted: `₹${car.price.toLocaleString()}`
}));
console.log(formatted);
// [
//   { brand: "Honda", priceFormatted: "₹15,00,000" },
//   { brand: "Maruti", priceFormatted: "₹8,00,000" }
// ]
```

### filter() - Keep Elements That Match Condition
```javascript
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

let evens = numbers.filter(n => n % 2 === 0);
console.log(evens);  // [2, 4, 6, 8, 10]

// Real example
let cars = [
  { brand: "Honda", price: 1500000 },
  { brand: "Maruti", price: 800000 },
  { brand: "BMW", price: 5000000 },
  { brand: "Hyundai", price: 1200000 }
];

let affordableCars = cars.filter(car => car.price < 2000000);
console.log(affordableCars);
// [
//   { brand: "Honda", price: 1500000 },
//   { brand: "Maruti", price: 800000 },
//   { brand: "Hyundai", price: 1200000 }
// ]
```

### find() - Find First Match
```javascript
let cars = [
  { id: 1, brand: "Honda" },
  { id: 2, brand: "Maruti" },
  { id: 3, brand: "Hyundai" }
];

let car = cars.find(c => c.id === 2);
console.log(car);  // { id: 2, brand: "Maruti" }

let notFound = cars.find(c => c.id === 999);
console.log(notFound);  // undefined
```

### findIndex() - Find Index of First Match
```javascript
let cars = ["Honda", "Maruti", "Hyundai"];

let index = cars.findIndex(car => car === "Maruti");
console.log(index);  // 1

let notFound = cars.findIndex(car => car === "BMW");
console.log(notFound);  // -1
```

### some() - Check If Any Element Matches
```javascript
let numbers = [1, 2, 3, 4, 5];

let hasEven = numbers.some(n => n % 2 === 0);
console.log(hasEven);  // true

let hasLarge = numbers.some(n => n > 10);
console.log(hasLarge);  // false
```

### every() - Check If All Elements Match
```javascript
let numbers = [2, 4, 6, 8, 10];

let allEven = numbers.every(n => n % 2 === 0);
console.log(allEven);  // true

let allPositive = numbers.every(n => n > 0);
console.log(allPositive);  // true

let allLarge = numbers.every(n => n > 5);
console.log(allLarge);  // false
```

### reduce() - Reduce to Single Value
```javascript
let numbers = [1, 2, 3, 4, 5];

// Sum
let sum = numbers.reduce((total, num) => total + num, 0);
console.log(sum);  // 15

// Max value
let max = numbers.reduce((max, num) => Math.max(max, num), numbers[0]);
console.log(max);  // 5

// Real example: Total price
let cart = [
  { name: "Item 1", price: 1000, quantity: 2 },
  { name: "Item 2", price: 500, quantity: 3 },
  { name: "Item 3", price: 2000, quantity: 1 }
];

let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
console.log(total);  // 5500
```

---

## includes() and indexOf()

### includes() - Check If Array Contains Value
```javascript
let fruits = ["Apple", "Banana", "Orange"];

console.log(fruits.includes("Banana"));  // true
console.log(fruits.includes("Mango"));   // false

// Case sensitive
console.log(fruits.includes("banana"));  // false
```

### indexOf() - Get Index of Value
```javascript
let fruits = ["Apple", "Banana", "Orange", "Banana"];

console.log(fruits.indexOf("Banana"));   // 1 (first occurrence)
console.log(fruits.indexOf("Mango"));    // -1 (not found)

// Start search from index
console.log(fruits.indexOf("Banana", 2)); // 3 (search from index 2)
```

### lastIndexOf() - Get Last Index
```javascript
let fruits = ["Apple", "Banana", "Orange", "Banana"];
console.log(fruits.lastIndexOf("Banana"));  // 3
```

---

## Array Destructuring

```javascript
let cars = ["Honda", "Maruti", "Hyundai"];

// Extract values
let [first, second, third] = cars;
console.log(first);   // "Honda"
console.log(second);  // "Maruti"
console.log(third);   // "Hyundai"

// Skip elements
let [one, , three] = cars;
console.log(one);    // "Honda"
console.log(three);  // "Hyundai"

// Rest elements
let [head, ...rest] = cars;
console.log(head);  // "Honda"
console.log(rest);  // ["Maruti", "Hyundai"]

// Default values
let [a, b, c, d = "Default"] = cars;
console.log(d);  // "Default"
```

---

## Spread Operator with Arrays

### Copy Array
```javascript
let original = [1, 2, 3];
let copy = [...original];

copy.push(4);
console.log(original);  // [1, 2, 3] (unchanged)
console.log(copy);      // [1, 2, 3, 4]
```

### Combine Arrays
```javascript
let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];
let combined = [...arr1, ...arr2];
console.log(combined);  // [1, 2, 3, 4, 5, 6]

// Add elements while combining
let withExtra = [0, ...arr1, 3.5, ...arr2, 7];
console.log(withExtra);  // [0, 1, 2, 3, 3.5, 4, 5, 6, 7]
```

### Function Arguments
```javascript
function sum(a, b, c) {
  return a + b + c;
}

let numbers = [1, 2, 3];
console.log(sum(...numbers));  // 6
```

---

## Multi-dimensional Arrays

### 2D Arrays
```javascript
let matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

console.log(matrix[0]);     // [1, 2, 3]
console.log(matrix[0][0]);  // 1
console.log(matrix[1][2]);  // 6

// Real example: Table data
let carData = [
  ["Honda", "City", 1500000],
  ["Maruti", "Swift", 800000],
  ["Hyundai", "Creta", 1200000]
];

carData.forEach(([brand, model, price]) => {
  console.log(`${brand} ${model} - ₹${price}`);
});
```

### Accessing Nested Arrays
```javascript
let nested = [1, [2, 3], [4, [5, 6]]];

console.log(nested[0]);        // 1
console.log(nested[1][0]);     // 2
console.log(nested[2][1][0]);  // 5
```

---

## Array.from() and Array.of()

### Array.from()
```javascript
// From string
let str = "Hello";
let chars = Array.from(str);
console.log(chars);  // ["H", "e", "l", "l", "o"]

// From NodeList (DOM)
let divs = document.querySelectorAll('div');
let divArray = Array.from(divs);

// With mapping function
let numbers = Array.from([1, 2, 3], x => x * 2);
console.log(numbers);  // [2, 4, 6]

// Create range
let range = Array.from({ length: 5 }, (_, i) => i + 1);
console.log(range);  // [1, 2, 3, 4, 5]
```

### Array.of()
```javascript
// Create array from arguments
let arr = Array.of(1, 2, 3);
console.log(arr);  // [1, 2, 3]

// Difference from Array constructor
let a1 = Array(3);      // [empty × 3]
let a2 = Array.of(3);   // [3]
```

---

## Real-World Examples

### Example 1: Shopping Cart
```javascript
let cart = [
  { id: 1, name: "Laptop", price: 50000, quantity: 1 },
  { id: 2, name: "Mouse", price: 500, quantity: 2 },
  { id: 3, name: "Keyboard", price: 1500, quantity: 1 }
];

// Calculate total
let total = cart.reduce((sum, item) => {
  return sum + (item.price * item.quantity);
}, 0);
console.log(`Total: ₹${total}`);  // Total: ₹52500

// Get all product names
let productNames = cart.map(item => item.name);
console.log(productNames);  // ["Laptop", "Mouse", "Keyboard"]

// Find expensive items (> ₹1000)
let expensiveItems = cart.filter(item => item.price > 1000);
console.log(expensiveItems);
```

### Example 2: Car Filtering
```javascript
let cars = [
  { brand: "Honda", model: "City", year: 2023, price: 1500000, fuelType: "Petrol" },
  { brand: "Maruti", model: "Swift", year: 2022, price: 800000, fuelType: "Petrol" },
  { brand: "Hyundai", model: "Creta", year: 2023, price: 1200000, fuelType: "Diesel" },
  { brand: "BMW", model: "X5", year: 2023, price: 8000000, fuelType: "Petrol" }
];

// Filter by budget
let budget = 2000000;
let affordableCars = cars.filter(car => car.price <= budget);

// Filter by fuel type
let petrolCars = cars.filter(car => car.fuelType === "Petrol");

// Sort by price
let sortedByPrice = [...cars].sort((a, b) => a.price - b.price);

// Get average price
let avgPrice = cars.reduce((sum, car) => sum + car.price, 0) / cars.length;
console.log(`Average: ₹${avgPrice}`);
```

### Example 3: Remove Duplicates
```javascript
let numbers = [1, 2, 2, 3, 3, 3, 4, 5, 5];

// Method 1: Set
let unique1 = [...new Set(numbers)];
console.log(unique1);  // [1, 2, 3, 4, 5]

// Method 2: filter
let unique2 = numbers.filter((num, index) => {
  return numbers.indexOf(num) === index;
});
console.log(unique2);  // [1, 2, 3, 4, 5]
```

### Example 4: Flatten Array
```javascript
let nested = [1, [2, 3], [4, [5, 6]]];

// Flat one level
let flat1 = nested.flat();
console.log(flat1);  // [1, 2, 3, 4, [5, 6]]

// Flat all levels
let flatAll = nested.flat(Infinity);
console.log(flatAll);  // [1, 2, 3, 4, 5, 6]
```

---

## Common Mistakes

### Mistake 1: Modifying Array During Iteration
```javascript
let numbers = [1, 2, 3, 4, 5];

// ❌ Bad - modifying while iterating
for (let i = 0; i < numbers.length; i++) {
  numbers.splice(i, 1);  // Skips elements!
}

// ✅ Good - iterate backwards
for (let i = numbers.length - 1; i >= 0; i--) {
  numbers.splice(i, 1);
}

// ✅ Or use filter
numbers = numbers.filter(() => false);  // Remove all
```

### Mistake 2: Confusing map() and forEach()
```javascript
let numbers = [1, 2, 3];

// ❌ Bad - forEach doesn't return new array
let doubled = numbers.forEach(n => n * 2);
console.log(doubled);  // undefined

// ✅ Good - use map
let doubled2 = numbers.map(n => n * 2);
console.log(doubled2);  // [2, 4, 6]
```

### Mistake 3: Forgetting to Return in map()
```javascript
let numbers = [1, 2, 3];

// ❌ Bad - no return
let doubled = numbers.map(n => {
  n * 2;  // Missing return!
});
console.log(doubled);  // [undefined, undefined, undefined]

// ✅ Good
let doubled2 = numbers.map(n => {
  return n * 2;
});
// Or concise
let doubled3 = numbers.map(n => n * 2);
```

---

## Practice Exercises

### Exercise 1: Sum of Array
```javascript
// Calculate sum of [1, 2, 3, 4, 5]
// Your code here:
```

<details>
<summary>Solution</summary>

```javascript
let numbers = [1, 2, 3, 4, 5];

// Method 1: reduce
let sum1 = numbers.reduce((total, num) => total + num, 0);

// Method 2: loop
let sum2 = 0;
for (let num of numbers) {
  sum2 += num;
}

console.log(sum1);  // 15
console.log(sum2);  // 15
```
</details>

### Exercise 2: Filter and Map
```javascript
// Given array of numbers, filter evens and double them
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// Your code here:
```

<details>
<summary>Solution</summary>

```javascript
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

let result = numbers
  .filter(n => n % 2 === 0)
  .map(n => n * 2);

console.log(result);  // [4, 8, 12, 16, 20]
```
</details>

### Exercise 3: Group By Property
```javascript
// Group cars by fuel type
let cars = [
  { brand: "Honda", fuelType: "Petrol" },
  { brand: "Maruti", fuelType: "Diesel" },
  { brand: "Hyundai", fuelType: "Petrol" }
];
// Your code here:
```

<details>
<summary>Solution</summary>

```javascript
let cars = [
  { brand: "Honda", fuelType: "Petrol" },
  { brand: "Maruti", fuelType: "Diesel" },
  { brand: "Hyundai", fuelType: "Petrol" }
];

let grouped = cars.reduce((acc, car) => {
  if (!acc[car.fuelType]) {
    acc[car.fuelType] = [];
  }
  acc[car.fuelType].push(car);
  return acc;
}, {});

console.log(grouped);
// {
//   Petrol: [{ brand: "Honda", ... }, { brand: "Hyundai", ... }],
//   Diesel: [{ brand: "Maruti", ... }]
// }
```
</details>

---

## Key Takeaways

1. **Arrays** store ordered collections
2. **Index starts at 0** - first element is `arr[0]`
3. **length property** - number of elements
4. **push/pop** - add/remove from end
5. **unshift/shift** - add/remove from beginning
6. **map** - transform each element
7. **filter** - keep elements that match
8. **reduce** - reduce to single value
9. **forEach** - execute function for each
10. **Methods don't modify original** (except push, pop, splice, etc.)

---

## Method Cheatsheet

| Method | Purpose | Returns | Modifies Original |
|--------|---------|---------|-------------------|
| `push()` | Add to end | New length | ✅ Yes |
| `pop()` | Remove from end | Removed element | ✅ Yes |
| `unshift()` | Add to start | New length | ✅ Yes |
| `shift()` | Remove from start | Removed element | ✅ Yes |
| `slice()` | Extract portion | New array | ❌ No |
| `splice()` | Add/remove elements | Removed elements | ✅ Yes |
| `concat()` | Join arrays | New array | ❌ No |
| `map()` | Transform elements | New array | ❌ No |
| `filter()` | Keep matching | New array | ❌ No |
| `reduce()` | Reduce to value | Single value | ❌ No |
| `forEach()` | Execute function | undefined | ❌ No |
| `find()` | Find element | Element or undefined | ❌ No |
| `includes()` | Check if contains | Boolean | ❌ No |
| `sort()` | Sort array | Sorted array | ✅ Yes |
| `reverse()` | Reverse array | Reversed array | ✅ Yes |

---

## Next Lesson

**Next**: [07-objects.md](07-objects.md) - Learn about JavaScript objects

---

## Self-Check Questions

1. How do you add an element to the end of an array?
2. What's the difference between `map()` and `forEach()`?
3. How do you filter an array?
4. What does `reduce()` do?
5. How do you check if an array includes a value?
6. What's the difference between `slice()` and `splice()`?

Ready for objects? Let's go! 🚀
