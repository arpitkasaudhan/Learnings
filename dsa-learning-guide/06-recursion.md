# Lesson 06: Recursion

## What is Recursion?

**Recursion**: A function that calls itself.

**Analogy**: Russian nesting dolls - each doll contains a smaller version of itself.

### Structure of Recursive Function

```javascript
function recursiveFunction(input) {
  // Base case - when to stop
  if (conditionMet) {
    return baseValue;
  }

  // Recursive case - call itself with smaller input
  return recursiveFunction(smallerInput);
}
```

---

## Simple Examples

### Example 1: Countdown

```javascript
function countdown(n) {
  // Base case
  if (n <= 0) {
    console.log("Done!");
    return;
  }

  console.log(n);

  // Recursive case
  countdown(n - 1);
}

countdown(5);  // 5 4 3 2 1 Done!
```

### Example 2: Factorial

```javascript
function factorial(n) {
  // Base case
  if (n === 0 || n === 1) return 1;

  // Recursive case
  return n * factorial(n - 1);
}

console.log(factorial(5));  // 120 (5 * 4 * 3 * 2 * 1)
```

**Call Stack Visualization**:
```
factorial(5)
  = 5 * factorial(4)
      = 4 * factorial(3)
          = 3 * factorial(2)
              = 2 * factorial(1)
                  = 1
              = 2 * 1 = 2
          = 3 * 2 = 6
      = 4 * 6 = 24
  = 5 * 24 = 120
```

### Example 3: Fibonacci

```javascript
// Inefficient recursive version
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(6));  // 8
// 0, 1, 1, 2, 3, 5, 8, 13, 21...
```

**Time Complexity**: O(2^n) - Very slow!

**Optimized with Memoization**:
```javascript
function fibonacciMemo(n, memo = {}) {
  if (n <= 1) return n;
  if (memo[n]) return memo[n];

  memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);
  return memo[n];
}

console.log(fibonacciMemo(50));  // Fast!
```

**Time Complexity**: O(n)

---

## Recursion vs Iteration

```javascript
// Iterative
function sumIterative(n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

// Recursive
function sumRecursive(n) {
  if (n === 0) return 0;
  return n + sumRecursive(n - 1);
}

console.log(sumIterative(5));   // 15
console.log(sumRecursive(5));   // 15
```

**When to use recursion**:
- Problem naturally divides into smaller subproblems
- Trees, graphs, backtracking
- Code is cleaner and more readable

**When to use iteration**:
- Simple loops
- Performance critical
- Avoid stack overflow

---

## Common Recursive Patterns

### Pattern 1: Linear Recursion

```javascript
// Sum of array
function sumArray(arr, index = 0) {
  if (index >= arr.length) return 0;
  return arr[index] + sumArray(arr, index + 1);
}

// Reverse string
function reverseString(str) {
  if (str === "") return "";
  return reverseString(str.slice(1)) + str[0];
}

console.log(reverseString("hello"));  // "olleh"
```

### Pattern 2: Binary Recursion (Two Recursive Calls)

```javascript
// Fibonacci (each call makes 2 more calls)
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}
```

### Pattern 3: Divide and Conquer

```javascript
// Binary search (recursive)
function binarySearch(arr, target, left = 0, right = arr.length - 1) {
  if (left > right) return -1;

  let mid = Math.floor((left + right) / 2);

  if (arr[mid] === target) return mid;
  if (arr[mid] > target) return binarySearch(arr, target, left, mid - 1);
  return binarySearch(arr, target, mid + 1, right);
}

// Merge sort (recursive)
function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  let mid = Math.floor(arr.length / 2);
  let left = mergeSort(arr.slice(0, mid));
  let right = mergeSort(arr.slice(mid));

  return merge(left, right);
}
```

---

## Advanced Recursion Problems

### Power Function

```javascript
// Calculate x^n
function power(x, n) {
  if (n === 0) return 1;
  if (n === 1) return x;

  // Optimize: use x^n = (x^(n/2))^2
  let half = power(x, Math.floor(n / 2));

  if (n % 2 === 0) {
    return half * half;
  } else {
    return x * half * half;
  }
}

console.log(power(2, 10));  // 1024
```

**Time**: O(log n)

### Generate Permutations

```javascript
function permute(arr) {
  let result = [];

  function backtrack(current, remaining) {
    if (remaining.length === 0) {
      result.push([...current]);
      return;
    }

    for (let i = 0; i < remaining.length; i++) {
      current.push(remaining[i]);
      backtrack(current, remaining.slice(0, i).concat(remaining.slice(i + 1)));
      current.pop();
    }
  }

  backtrack([], arr);
  return result;
}

console.log(permute([1, 2, 3]));
// [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]
```

### Generate Subsets

```javascript
function subsets(arr) {
  let result = [];

  function backtrack(index, current) {
    result.push([...current]);

    for (let i = index; i < arr.length; i++) {
      current.push(arr[i]);
      backtrack(i + 1, current);
      current.pop();
    }
  }

  backtrack(0, []);
  return result;
}

console.log(subsets([1, 2, 3]));
// [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]
```

---

## Tail Recursion

**Tail recursion**: Recursive call is the last operation.

```javascript
// Not tail recursive
function factorial(n) {
  if (n === 1) return 1;
  return n * factorial(n - 1);  // Multiply after recursive call
}

// Tail recursive (can be optimized by compiler)
function factorialTail(n, accumulator = 1) {
  if (n === 1) return accumulator;
  return factorialTail(n - 1, n * accumulator);  // Nothing after recursive call
}
```

---

## VahanHelp Examples

### Nested Category Tree

```javascript
let categories = {
  name: "Vehicles",
  children: [
    {
      name: "Cars",
      children: [
        { name: "Sedan", children: [] },
        { name: "SUV", children: [] },
        { name: "Hatchback", children: [] }
      ]
    },
    {
      name: "Bikes",
      children: [
        { name: "Sports", children: [] },
        { name: "Cruiser", children: [] }
      ]
    }
  ]
};

// Count total categories
function countCategories(category) {
  let count = 1;  // Count current category

  for (let child of category.children) {
    count += countCategories(child);  // Add children counts
  }

  return count;
}

console.log(countCategories(categories));  // 8

// Find category by name
function findCategory(category, name) {
  if (category.name === name) return category;

  for (let child of category.children) {
    let found = findCategory(child, name);
    if (found) return found;
  }

  return null;
}

// Get all leaf categories
function getLeafCategories(category) {
  if (category.children.length === 0) {
    return [category.name];
  }

  let leaves = [];
  for (let child of category.children) {
    leaves.push(...getLeafCategories(child));
  }

  return leaves;
}

console.log(getLeafCategories(categories));
// ["Sedan", "SUV", "Hatchback", "Sports", "Cruiser"]
```

---

## Common Mistakes

### Mistake 1: No Base Case (Infinite Recursion)
```javascript
// ❌ Wrong - stack overflow!
function bad(n) {
  return bad(n - 1);  // Never stops!
}

// ✅ Correct
function good(n) {
  if (n <= 0) return;  // Base case
  return good(n - 1);
}
```

### Mistake 2: Not Making Progress Toward Base Case
```javascript
// ❌ Wrong
function bad(n) {
  if (n === 0) return 0;
  return bad(n);  // n never changes!
}

// ✅ Correct
function good(n) {
  if (n === 0) return 0;
  return good(n - 1);  // Moving toward base case
}
```

### Mistake 3: Inefficient Recursion
```javascript
// ❌ Inefficient - O(2^n)
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

// ✅ Optimized - O(n)
function fibMemo(n, memo = {}) {
  if (n <= 1) return n;
  if (memo[n]) return memo[n];
  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}
```

---

## Practice Problems

### Easy
1. Sum of digits
2. Count number of digits
3. Print 1 to N
4. Check if string is palindrome
5. GCD of two numbers

### Medium
1. Tower of Hanoi
2. Generate parentheses
3. Word search in grid
4. Path sum in tree
5. Decode ways

### Hard
1. N-Queens problem
2. Sudoku solver
3. Expression evaluation
4. Generate all valid IP addresses
5. Wildcard matching

---

## Key Takeaways

✅ **Base case** is crucial - prevents infinite recursion
✅ **Progress** toward base case in every call
✅ **Memoization** optimizes repeated calculations
✅ **Stack overflow** risk with deep recursion
✅ **Space complexity**: O(n) for call stack
✅ **Trees and graphs** are naturally recursive
✅ **Tail recursion** can be optimized

---

## What's Next?

Now that you understand recursion, let's learn **linked lists**!

**Next Lesson**: [07-linked-lists.md](07-linked-lists.md)

---

**Remember**: Recursion is powerful but use wisely!

**Keep recursing! 🚀**
