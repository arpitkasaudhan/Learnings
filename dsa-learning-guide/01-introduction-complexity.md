# Lesson 01: Introduction to DSA & Complexity Analysis

## What is Data Structures & Algorithms?

### Data Structures
**Data structures** are ways to organize and store data in your computer so you can use it efficiently.

Think of it like organizing your closet:
- **Array**: Clothes arranged in a line
- **Stack**: Pile of folded clothes (last in, first out)
- **Tree**: Hierarchical organization (categories → subcategories)
- **Hash Map**: Labeled drawers for quick access

### Algorithms
**Algorithms** are step-by-step procedures to solve problems or perform tasks.

Like recipes:
1. Take input (ingredients)
2. Process (cooking steps)
3. Produce output (final dish)

### Why Learn DSA?

**1. Write Efficient Code**
```javascript
// Inefficient: O(n²)
function findDuplicates(arr) {
  let duplicates = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j] && !duplicates.includes(arr[i])) {
        duplicates.push(arr[i]);
      }
    }
  }
  return duplicates;
}

// Efficient: O(n)
function findDuplicatesOptimized(arr) {
  let seen = new Set();
  let duplicates = new Set();

  for (let num of arr) {
    if (seen.has(num)) {
      duplicates.add(num);
    }
    seen.add(num);
  }

  return Array.from(duplicates);
}
```

**2. Crack Coding Interviews**
- Google, Amazon, Microsoft all ask DSA questions
- LeetCode, HackerRank are based on DSA

**3. Build Better Applications**
- VahanHelp: Fast car search, efficient filtering
- Database queries: Indexing uses B-trees
- Google Maps: Shortest path uses graph algorithms

---

## Time Complexity (Big O Notation)

### What is Big O?

**Big O notation** describes how the runtime of an algorithm grows as the input size increases.

It answers: **"How slow does this get with more data?"**

### Common Time Complexities

#### O(1) - Constant Time
**Runtime doesn't change with input size.**

```javascript
// Always takes the same time, regardless of array size
function getFirstCar(cars) {
  return cars[0];  // O(1)
}

// Hash map lookup
let carPrices = { honda: 1500000, maruti: 800000 };
console.log(carPrices['honda']);  // O(1)
```

**Real-world**:
- Array access by index
- Hash map lookup
- Getting object property

---

#### O(log n) - Logarithmic Time
**Runtime grows slowly, even with large input.**

```javascript
// Binary search in sorted array
function binarySearch(sortedCars, targetPrice) {
  let left = 0;
  let right = sortedCars.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);

    if (sortedCars[mid].price === targetPrice) {
      return mid;
    } else if (sortedCars[mid].price < targetPrice) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}
```

**Example**: Finding in 1,000,000 items takes only ~20 steps!

**Real-world**:
- Binary search
- Balanced tree operations
- Finding element in sorted data

---

#### O(n) - Linear Time
**Runtime grows proportionally with input size.**

```javascript
// Find car by brand
function findCarByBrand(cars, brand) {
  for (let car of cars) {  // O(n)
    if (car.brand === brand) {
      return car;
    }
  }
  return null;
}

// Calculate total price
function getTotalPrice(cars) {
  let total = 0;
  for (let car of cars) {  // O(n)
    total += car.price;
  }
  return total;
}
```

**Real-world**:
- Looping through array
- Array methods: forEach, map, filter, find
- Linear search

---

#### O(n log n) - Linearithmic Time
**Good for sorting algorithms.**

```javascript
// Merge sort, Quick sort
let cars = [
  { brand: "BMW", price: 5000000 },
  { brand: "Maruti", price: 800000 },
  { brand: "Honda", price: 1500000 }
];

// JavaScript's sort uses O(n log n)
cars.sort((a, b) => a.price - b.price);  // O(n log n)
```

**Real-world**:
- Efficient sorting (Merge sort, Quick sort)
- Building sorted data structures

---

#### O(n²) - Quadratic Time
**Runtime grows very fast. Avoid when possible!**

```javascript
// Find all pairs of cars
function findAllPairs(cars) {
  let pairs = [];

  for (let i = 0; i < cars.length; i++) {         // O(n)
    for (let j = i + 1; j < cars.length; j++) {   // O(n)
      pairs.push([cars[i], cars[j]]);
    }
  }

  return pairs;  // O(n²)
}

// Bubble sort (inefficient)
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {          // O(n)
    for (let j = 0; j < arr.length - 1; j++) {    // O(n)
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;  // O(n²)
}
```

**Real-world**:
- Nested loops
- Inefficient sorting (Bubble, Selection, Insertion)
- Comparing all pairs

---

#### O(2ⁿ) - Exponential Time
**Runtime doubles with each additional element. Very slow!**

```javascript
// Recursive Fibonacci (inefficient)
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);  // O(2ⁿ)
}

// For n = 10: ~1024 operations
// For n = 20: ~1,048,576 operations
// For n = 30: ~1,073,741,824 operations!
```

**Real-world**:
- Recursive algorithms without memoization
- Brute force solutions
- Trying all combinations

---

### Big O Comparison

```
Input Size (n)
┌────────┬─────────┬──────────┬──────────┬──────────┬──────────┐
│   n    │  O(1)   │ O(log n) │   O(n)   │ O(n²)    │  O(2ⁿ)   │
├────────┼─────────┼──────────┼──────────┼──────────┼──────────┤
│   10   │    1    │    3     │    10    │   100    │  1,024   │
│  100   │    1    │    7     │   100    │ 10,000   │   huge!  │
│ 1,000  │    1    │   10     │  1,000   │1,000,000 │ enormous!│
│10,000  │    1    │   13     │ 10,000   │100M      │ infinite │
└────────┴─────────┴──────────┴──────────┴──────────┴──────────┘

Best to Worst:
O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!)
```

---

## Space Complexity

**Space complexity** measures how much memory an algorithm uses.

### O(1) - Constant Space
```javascript
// Only uses a few variables
function sum(arr) {
  let total = 0;  // O(1) space
  for (let num of arr) {
    total += num;
  }
  return total;
}
```

### O(n) - Linear Space
```javascript
// Creates new array
function double(arr) {
  let result = [];  // O(n) space
  for (let num of arr) {
    result.push(num * 2);
  }
  return result;
}
```

### O(n²) - Quadratic Space
```javascript
// Creates 2D array
function create2DArray(n) {
  let matrix = [];
  for (let i = 0; i < n; i++) {
    matrix[i] = [];
    for (let j = 0; j < n; j++) {
      matrix[i][j] = 0;
    }
  }
  return matrix;  // O(n²) space
}
```

---

## How to Calculate Big O

### Rule 1: Drop Constants
```javascript
// O(2n) → O(n)
function example1(arr) {
  for (let i = 0; i < arr.length; i++) {  // n operations
    console.log(arr[i]);
  }
  for (let i = 0; i < arr.length; i++) {  // n operations
    console.log(arr[i] * 2);
  }
}
// Total: 2n operations → O(n)
```

### Rule 2: Drop Non-Dominant Terms
```javascript
// O(n² + n) → O(n²)
function example2(arr) {
  for (let i = 0; i < arr.length; i++) {        // O(n)
    console.log(arr[i]);
  }

  for (let i = 0; i < arr.length; i++) {        // O(n²)
    for (let j = 0; j < arr.length; j++) {
      console.log(arr[i], arr[j]);
    }
  }
}
// Total: n + n² → O(n²) (n² dominates)
```

### Rule 3: Different Inputs = Different Variables
```javascript
// O(a + b), NOT O(n)
function example3(arr1, arr2) {
  for (let item of arr1) {  // O(a)
    console.log(item);
  }
  for (let item of arr2) {  // O(b)
    console.log(item);
  }
}
// Total: O(a + b)
```

### Rule 4: Nested Loops = Multiplication
```javascript
// O(a * b)
function example4(arr1, arr2) {
  for (let item1 of arr1) {       // O(a)
    for (let item2 of arr2) {     // O(b)
      console.log(item1, item2);
    }
  }
}
// Total: O(a * b)
```

---

## Real-World Examples from VahanHelp

### Example 1: Find Car by ID
```javascript
// Inefficient: O(n)
function findCarById_Slow(cars, id) {
  for (let car of cars) {
    if (car.id === id) {
      return car;
    }
  }
  return null;
}

// Efficient: O(1) with hash map
let carsById = {};
cars.forEach(car => {
  carsById[car.id] = car;
});

function findCarById_Fast(id) {
  return carsById[id];  // O(1)
}
```

### Example 2: Filter Cars by Price Range
```javascript
// O(n) - optimal for unsorted data
function filterByPriceRange(cars, minPrice, maxPrice) {
  return cars.filter(car =>
    car.price >= minPrice && car.price <= maxPrice
  );
}
// Must check every car: O(n)
```

### Example 3: Get Top N Cheapest Cars
```javascript
// Inefficient: O(n log n)
function getTopNCheapest_Slow(cars, n) {
  let sorted = cars.sort((a, b) => a.price - b.price);
  return sorted.slice(0, n);
}

// Efficient: O(n log k) using min-heap
// (We'll learn heaps in Lesson 12)
```

---

## Practice Problems

### Problem 1: Analyze Time Complexity
```javascript
function mystery(arr) {
  let count = 0;

  for (let i = 0; i < arr.length; i++) {
    count++;
  }

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      count++;
    }
  }

  return count;
}
```
**Answer**: O(n²) - First loop is O(n), second is O(n²), n² dominates.

---

### Problem 2: Which is More Efficient?
```javascript
// Option A
function optionA(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return true;
    }
  }
  return false;
}

// Option B
function optionB(arr, target) {
  let set = new Set(arr);
  return set.has(target);
}
```

**Answer**:
- Option A: O(n) time, O(1) space
- Option B: O(n) time, O(n) space
- If searching once: Option A
- If searching multiple times: Option B (after creating Set once)

---

### Problem 3: Optimize This Code
```javascript
// Inefficient: O(n²)
function hasDuplicate(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        return true;
      }
    }
  }
  return false;
}

// How to make it O(n)?
```

**Solution**:
```javascript
// Optimized: O(n)
function hasDuplicateOptimized(arr) {
  let seen = new Set();

  for (let num of arr) {
    if (seen.has(num)) {
      return true;
    }
    seen.add(num);
  }

  return false;
}
```

---

## Common Mistakes

### Mistake 1: Assuming Built-in Methods are Free
```javascript
// This is NOT O(n)!
function example(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr.includes(arr[i]);  // includes() is O(n)
  }
}
// Total: O(n²) because includes() runs inside loop
```

### Mistake 2: Confusing Best/Average/Worst Case
```javascript
function findElement(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}
```
- **Best case**: O(1) - element is first
- **Average case**: O(n/2) → O(n)
- **Worst case**: O(n) - element is last or not found

**We usually analyze worst case!**

### Mistake 3: Not Considering Space Complexity
```javascript
// O(n) time, O(n) space
function reverse(arr) {
  return arr.slice().reverse();  // Creates copy
}

// O(n) time, O(1) space
function reverseInPlace(arr) {
  let left = 0, right = arr.length - 1;
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }
  return arr;
}
```

---

## Quick Reference

### Time Complexity Cheatsheet
```
Operation                  | Array  | Hash Map | Binary Tree
─────────────────────────────────────────────────────────────
Access by index/key        | O(1)   | O(1)     | O(log n)
Search                     | O(n)   | O(1)     | O(log n)
Insert at end             | O(1)   | O(1)     | O(log n)
Insert at beginning       | O(n)   | O(1)     | O(log n)
Delete                    | O(n)   | O(1)     | O(log n)
```

### Algorithm Complexity
```
Algorithm                  | Time        | Space
──────────────────────────────────────────────────
Linear search             | O(n)        | O(1)
Binary search             | O(log n)    | O(1)
Bubble sort              | O(n²)       | O(1)
Merge sort               | O(n log n)  | O(n)
Quick sort (average)     | O(n log n)  | O(log n)
Hash table lookup        | O(1)        | O(n)
BFS/DFS                  | O(V + E)    | O(V)
```

---

## When to Use What?

### Need Fast Lookup?
→ Use **Hash Map** (O(1))

### Need Sorted Data?
→ Use **Binary Search Tree** (O(log n)) or sort array first

### Need Fast Insert/Delete at Beginning?
→ Use **Linked List** (O(1))

### Need Fast Access by Index?
→ Use **Array** (O(1))

### Need to Find Shortest Path?
→ Use **Graph Algorithm** (BFS, Dijkstra)

---

## Self-Check Questions

1. What is the Big O of a nested loop with 3 levels?
   - **Answer**: O(n³)

2. Why is O(log n) better than O(n)?
   - **Answer**: log n grows much slower than n

3. What's the time complexity of `arr.push()`?
   - **Answer**: O(1) amortized

4. What's the space complexity of recursion?
   - **Answer**: O(n) for call stack

5. Is O(2n) the same as O(n)?
   - **Answer**: Yes, we drop constants

---

## Key Takeaways

✅ **Big O** measures how runtime grows with input size
✅ **O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)**
✅ **Drop constants** and non-dominant terms
✅ **Space complexity** is as important as time complexity
✅ **Most built-in methods** have hidden complexity
✅ **Hash maps** provide O(1) lookup
✅ **Sorting** is usually O(n log n)
✅ **Nested loops** are usually O(n²)

---

## What's Next?

Now that you understand complexity, let's learn about the most important data structure:

**Next Lesson**: [02-arrays.md](02-arrays.md) - Master arrays and common patterns!

---

**Remember**: Understanding Big O will help you write faster, more efficient code. It's the foundation of all DSA!

**Practice daily and you'll master it! 🚀**
