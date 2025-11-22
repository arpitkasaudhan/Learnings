# Time & Space Complexity Reference Guide

Complete guide to analyzing algorithm complexity.

---

## Big O Notation

**Big O** describes the worst-case scenario - how runtime/space grows as input increases.

### Common Time Complexities (Best to Worst)

```
O(1)       < Constant
O(log n)   < Logarithmic
O(n)       < Linear
O(n log n) < Linearithmic
O(n²)      < Quadratic
O(n³)      < Cubic
O(2ⁿ)      < Exponential
O(n!)      < Factorial
```

---

## O(1) - Constant Time

**Performance**: Same time regardless of input size.

**Examples**:
```javascript
// Array access by index
arr[0]  // O(1)
arr[99] // O(1)

// Hash map lookup
map.get(key)  // O(1)

// Object property access
obj.name  // O(1)

// Mathematical operations
let sum = a + b;  // O(1)

// Stack/Queue operations
stack.push(item)    // O(1)
stack.pop()         // O(1)
queue.enqueue(item) // O(1)
queue.dequeue()     // O(1)
```

**Growth**:
```
Input Size | Operations
─────────────────────────
10         | 1
100        | 1
1,000      | 1
1,000,000  | 1
```

---

## O(log n) - Logarithmic Time

**Performance**: Doubles input, adds one operation.

**Examples**:
```javascript
// Binary search
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}  // O(log n)

// Balanced tree operations
bst.search(value)  // O(log n)
bst.insert(value)  // O(log n)
```

**Growth**:
```
Input Size | Operations (log₂ n)
──────────────────────────────────
10         | 3
100        | 7
1,000      | 10
1,000,000  | 20
```

---

## O(n) - Linear Time

**Performance**: Doubles input, doubles time.

**Examples**:
```javascript
// Single loop through array
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}  // O(n)

// Linear search
function linearSearch(arr, target) {
  for (let item of arr) {
    if (item === target) return true;
  }
  return false;
}  // O(n)

// Array methods
arr.forEach(callback)  // O(n)
arr.map(callback)      // O(n)
arr.filter(callback)   // O(n)
arr.reduce(callback)   // O(n)
arr.find(callback)     // O(n)

// String operations
str.indexOf(char)      // O(n)
str.includes(substr)   // O(n)
```

**Growth**:
```
Input Size | Operations
─────────────────────────
10         | 10
100        | 100
1,000      | 1,000
1,000,000  | 1,000,000
```

---

## O(n log n) - Linearithmic Time

**Performance**: Efficient sorting complexity.

**Examples**:
```javascript
// Merge sort
function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  let mid = Math.floor(arr.length / 2);
  let left = mergeSort(arr.slice(0, mid));
  let right = mergeSort(arr.slice(mid));

  return merge(left, right);
}  // O(n log n)

// Quick sort (average case)
arr.sort((a, b) => a - b)  // O(n log n)

// Heap sort
heapSort(arr)  // O(n log n)
```

**Growth**:
```
Input Size | Operations (n * log n)
───────────────────────────────────────
10         | 30
100        | 700
1,000      | 10,000
1,000,000  | 20,000,000
```

---

## O(n²) - Quadratic Time

**Performance**: Doubles input, quadruples time.

**Examples**:
```javascript
// Nested loops
for (let i = 0; i < arr.length; i++) {
  for (let j = 0; j < arr.length; j++) {
    console.log(arr[i], arr[j]);
  }
}  // O(n²)

// Bubble sort
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
}  // O(n²)

// Find all pairs
for (let i = 0; i < arr.length; i++) {
  for (let j = i + 1; j < arr.length; j++) {
    pairs.push([arr[i], arr[j]]);
  }
}  // O(n²)
```

**Growth**:
```
Input Size | Operations
─────────────────────────
10         | 100
100        | 10,000
1,000      | 1,000,000
10,000     | 100,000,000
```

---

## O(2ⁿ) - Exponential Time

**Performance**: Very slow! Each additional element doubles time.

**Examples**:
```javascript
// Recursive Fibonacci (without memoization)
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}  // O(2ⁿ)

// Generate all subsets (power set)
function subsets(arr) {
  let result = [];

  function generate(index, current) {
    if (index === arr.length) {
      result.push([...current]);
      return;
    }

    // Don't include
    generate(index + 1, current);

    // Include
    current.push(arr[index]);
    generate(index + 1, current);
    current.pop();
  }

  generate(0, []);
  return result;
}  // O(2ⁿ)
```

**Growth**:
```
Input Size | Operations
─────────────────────────
10         | 1,024
20         | 1,048,576
30         | 1,073,741,824
40         | Too large!
```

---

## O(n!) - Factorial Time

**Performance**: Extremely slow!

**Examples**:
```javascript
// Generate all permutations
function permute(arr) {
  let result = [];

  function backtrack(current, remaining) {
    if (remaining.length === 0) {
      result.push([...current]);
      return;
    }

    for (let i = 0; i < remaining.length; i++) {
      current.push(remaining[i]);
      backtrack(
        current,
        remaining.slice(0, i).concat(remaining.slice(i + 1))
      );
      current.pop();
    }
  }

  backtrack([], arr);
  return result;
}  // O(n!)

// Traveling salesman (brute force)
```

**Growth**:
```
Input Size | Operations
─────────────────────────
5          | 120
10         | 3,628,800
15         | Too large!
```

---

## Space Complexity

### O(1) - Constant Space

**Examples**:
```javascript
// Few variables
function sum(arr) {
  let total = 0;  // O(1) space
  for (let num of arr) {
    total += num;
  }
  return total;
}

// Swap in place
function reverseArray(arr) {
  let left = 0, right = arr.length - 1;  // O(1) space

  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }
}
```

### O(n) - Linear Space

**Examples**:
```javascript
// Create new array
function double(arr) {
  let result = [];  // O(n) space
  for (let num of arr) {
    result.push(num * 2);
  }
  return result;
}

// Hash map
let freq = {};  // O(n) space
for (let item of arr) {
  freq[item] = (freq[item] || 0) + 1;
}

// Recursion depth
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}  // O(n) space for call stack
```

### O(n²) - Quadratic Space

**Examples**:
```javascript
// 2D matrix
let matrix = Array(n).fill(0).map(() => Array(n).fill(0));  // O(n²) space

// Dynamic programming table
let dp = Array(m).fill(0).map(() => Array(n).fill(0));  // O(m*n) space
```

---

## Data Structure Complexities

### Array

```
Operation           | Time Complexity
───────────────────────────────────────
Access by index     | O(1)
Search              | O(n)
Insert at end       | O(1) amortized
Insert at beginning | O(n)
Insert at middle    | O(n)
Delete at end       | O(1)
Delete at beginning | O(n)
Delete at middle    | O(n)
```

### Hash Map / Object

```
Operation | Time (Average) | Time (Worst)
──────────────────────────────────────────
Insert    | O(1)           | O(n)
Delete    | O(1)           | O(n)
Search    | O(1)           | O(n)
```

### Linked List

```
Operation           | Singly | Doubly
─────────────────────────────────────
Access by index     | O(n)   | O(n)
Search              | O(n)   | O(n)
Insert at beginning | O(1)   | O(1)
Insert at end       | O(n)*  | O(1)**
Delete at beginning | O(1)   | O(1)
Delete at end       | O(n)   | O(1)**
```
*O(1) with tail pointer
**With tail pointer

### Binary Search Tree (BST)

```
Operation | Average    | Worst
─────────────────────────────────
Search    | O(log n)   | O(n)
Insert    | O(log n)   | O(n)
Delete    | O(log n)   | O(n)
```

### Heap

```
Operation      | Time Complexity
──────────────────────────────────
Insert         | O(log n)
Delete min/max | O(log n)
Get min/max    | O(1)
Heapify        | O(n)
```

### Graph (Adjacency List)

```
Operation     | Time Complexity
──────────────────────────────────
Add vertex    | O(1)
Add edge      | O(1)
Remove vertex | O(V + E)
Remove edge   | O(E)
BFS           | O(V + E)
DFS           | O(V + E)
```

---

## Sorting Algorithm Complexities

```
Algorithm       | Best       | Average    | Worst      | Space  | Stable
──────────────────────────────────────────────────────────────────────────
Bubble Sort     | O(n)       | O(n²)      | O(n²)      | O(1)   | Yes
Selection Sort  | O(n²)      | O(n²)      | O(n²)      | O(1)   | No
Insertion Sort  | O(n)       | O(n²)      | O(n²)      | O(1)   | Yes
Merge Sort      | O(n log n) | O(n log n) | O(n log n) | O(n)   | Yes
Quick Sort      | O(n log n) | O(n log n) | O(n²)      | O(log n)| No
Heap Sort       | O(n log n) | O(n log n) | O(n log n) | O(1)   | No
Counting Sort   | O(n+k)     | O(n+k)     | O(n+k)     | O(k)   | Yes
Radix Sort      | O(nk)      | O(nk)      | O(nk)      | O(n+k) | Yes
```

---

## Rules for Calculating Complexity

### Rule 1: Drop Constants

```javascript
// O(2n) → O(n)
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i] * 2);
}
// Total: 2n → O(n)
```

### Rule 2: Drop Non-Dominant Terms

```javascript
// O(n² + n) → O(n²)
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);  // O(n)
}
for (let i = 0; i < arr.length; i++) {
  for (let j = 0; j < arr.length; j++) {
    console.log(arr[i], arr[j]);  // O(n²)
  }
}
// Total: n² + n → O(n²)
```

### Rule 3: Different Inputs = Different Variables

```javascript
// O(a + b), NOT O(n)
function process(arr1, arr2) {
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
for (let item1 of arr1) {      // O(a)
  for (let item2 of arr2) {    // O(b)
    console.log(item1, item2);
  }
}
// Total: O(a * b)
```

---

## How to Analyze Your Code

1. **Identify** loops and recursion
2. **Count** how many times code executes
3. **Apply** the Big O rules
4. **Consider** best, average, and worst case
5. **Simplify** using the rules above

---

## Common JavaScript Operations

```javascript
// O(1)
arr[i]
obj.key
map.get(key)
set.has(value)
arr.push(item)
arr.pop()

// O(n)
arr.shift()          // Removes first, shifts all
arr.unshift(item)    // Adds to start, shifts all
arr.indexOf(item)
arr.includes(item)
arr.find(callback)
arr.filter(callback)
arr.map(callback)
arr.reduce(callback)
arr.slice()
arr.concat()
Object.keys(obj)
Object.values(obj)
JSON.stringify(obj)

// O(n log n)
arr.sort()

// O(n²)
arr.splice(i, count) // In a loop
```

---

## Interview Tips

✅ Always analyze **time AND space** complexity
✅ Consider **best, average, and worst** case
✅ **Optimize** when possible (but code clarity matters too)
✅ **Explain** your reasoning clearly
✅ Know **common data structure complexities**

---

## Quick Reference

```
Need O(1) access?           → Array, Hash Map
Need O(1) insert/delete?    → Hash Map, Linked List (at ends)
Need sorted data?           → BST, Sorted Array
Need min/max quickly?       → Heap
Need FIFO?                  → Queue
Need LIFO?                  → Stack
```

---

**Master complexity analysis and write efficient code! 🚀**
