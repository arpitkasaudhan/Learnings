# Lesson 04: Searching Algorithms

## Introduction to Searching

Searching is one of the most fundamental operations in computer science. Every time you:
- Search for a car on VahanHelp
- Find a contact in your phone
- Look up a word in dictionary
- Google searches the web

You're using a searching algorithm!

---

## Linear Search

### Concept
Check every element one by one until you find the target.

```javascript
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;  // Found! Return index
    }
  }
  return -1;  // Not found
}

let cars = ["Honda", "Maruti", "BMW", "Audi"];
console.log(linearSearch(cars, "BMW"));    // 2
console.log(linearSearch(cars, "Tesla"));  // -1
```

**Time Complexity**: O(n)
**Space Complexity**: O(1)

**When to use**:
- Small arrays
- Unsorted data
- Need to search only once

**VahanHelp Example**:
```javascript
function findCarById(cars, id) {
  for (let car of cars) {
    if (car.id === id) {
      return car;
    }
  }
  return null;
}
```

---

## Binary Search

### Concept
Divide and conquer! Works only on **sorted arrays**.

**Analogy**: Finding a word in a dictionary
1. Open middle page
2. If word is before middle → search left half
3. If word is after middle → search right half
4. Repeat until found

```javascript
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid;  // Found!
    } else if (arr[mid] < target) {
      left = mid + 1;  // Search right half
    } else {
      right = mid - 1;  // Search left half
    }
  }

  return -1;  // Not found
}

let prices = [500000, 800000, 1500000, 2000000, 5000000];
console.log(binarySearch(prices, 1500000));  // 2
console.log(binarySearch(prices, 1000000));  // -1
```

**Time Complexity**: O(log n)
**Space Complexity**: O(1)

**Visualization**:
```
Array: [5, 8, 15, 20, 50]  Target: 20

Step 1: left=0, right=4, mid=2
  [5, 8, 15, 20, 50]
         ↑
  15 < 20 → search right

Step 2: left=3, right=4, mid=3
  [5, 8, 15, 20, 50]
             ↑
  20 === 20 → Found! Return 3
```

### Binary Search (Recursive)
```javascript
function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
  if (left > right) return -1;

  let mid = Math.floor((left + right) / 2);

  if (arr[mid] === target) {
    return mid;
  } else if (arr[mid] < target) {
    return binarySearchRecursive(arr, target, mid + 1, right);
  } else {
    return binarySearchRecursive(arr, target, left, mid - 1);
  }
}
```

**Space Complexity**: O(log n) due to recursion call stack

---

## Binary Search Variations

### Find First Occurrence
```javascript
function findFirstOccurrence(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  let result = -1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      result = mid;
      right = mid - 1;  // Continue searching left
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return result;
}

let arr = [1, 2, 2, 2, 3, 4, 5];
console.log(findFirstOccurrence(arr, 2));  // 1
```

### Find Last Occurrence
```javascript
function findLastOccurrence(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  let result = -1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      result = mid;
      left = mid + 1;  // Continue searching right
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return result;
}

console.log(findLastOccurrence(arr, 2));  // 3
```

### Count Occurrences
```javascript
function countOccurrences(arr, target) {
  let first = findFirstOccurrence(arr, target);
  if (first === -1) return 0;

  let last = findLastOccurrence(arr, target);
  return last - first + 1;
}

console.log(countOccurrences([1, 2, 2, 2, 3, 4], 2));  // 3
```

---

## Search in Rotated Sorted Array

**Problem**: Array was sorted, then rotated at some pivot.
```
Original: [1, 2, 3, 4, 5, 6, 7]
Rotated:  [4, 5, 6, 7, 1, 2, 3]
```

```javascript
function searchRotated(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) return mid;

    // Left half is sorted
    if (arr[left] <= arr[mid]) {
      if (target >= arr[left] && target < arr[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    // Right half is sorted
    else {
      if (target > arr[mid] && target <= arr[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }

  return -1;
}

console.log(searchRotated([4, 5, 6, 7, 0, 1, 2], 0));  // 4
```

---

## Finding Peak Element

**Peak**: Element greater than its neighbors.

```javascript
function findPeakElement(arr) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    let mid = Math.floor((left + right) / 2);

    if (arr[mid] > arr[mid + 1]) {
      right = mid;  // Peak is in left half (including mid)
    } else {
      left = mid + 1;  // Peak is in right half
    }
  }

  return left;
}

console.log(findPeakElement([1, 2, 3, 1]));       // 2
console.log(findPeakElement([1, 2, 1, 3, 5, 6, 4])); // 5
```

---

## Square Root (Binary Search Application)

```javascript
function sqrt(x) {
  if (x < 2) return x;

  let left = 1;
  let right = Math.floor(x / 2);

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    let square = mid * mid;

    if (square === x) {
      return mid;
    } else if (square < x) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return right;  // Floor of square root
}

console.log(sqrt(16));  // 4
console.log(sqrt(8));   // 2
```

---

## VahanHelp Real-World Examples

### Search Cars by Price Range
```javascript
function findCarsInPriceRange(sortedCars, minPrice, maxPrice) {
  // Find first car >= minPrice
  let startIdx = findFirstGreaterOrEqual(sortedCars, minPrice);
  if (startIdx === -1) return [];

  // Find last car <= maxPrice
  let endIdx = findLastLessOrEqual(sortedCars, maxPrice);
  if (endIdx === -1) return [];

  return sortedCars.slice(startIdx, endIdx + 1);
}

function findFirstGreaterOrEqual(cars, price) {
  let left = 0;
  let right = cars.length - 1;
  let result = -1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);

    if (cars[mid].price >= price) {
      result = mid;
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return result;
}

function findLastLessOrEqual(cars, price) {
  let left = 0;
  let right = cars.length - 1;
  let result = -1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);

    if (cars[mid].price <= price) {
      result = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return result;
}
```

### Auto-complete Search
```javascript
function autocomplete(sortedWords, prefix) {
  let start = findFirstWithPrefix(sortedWords, prefix);
  if (start === -1) return [];

  let results = [];
  for (let i = start; i < sortedWords.length; i++) {
    if (sortedWords[i].startsWith(prefix)) {
      results.push(sortedWords[i]);
    } else {
      break;
    }
  }

  return results;
}

function findFirstWithPrefix(words, prefix) {
  let left = 0;
  let right = words.length - 1;
  let result = -1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);

    if (words[mid] >= prefix) {
      if (words[mid].startsWith(prefix)) {
        result = mid;
      }
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return result;
}

let brands = ["Audi", "BMW", "Honda", "Hyundai", "Maruti", "Toyota"];
console.log(autocomplete(brands, "H"));  // ["Honda", "Hyundai"]
```

---

## Jump Search

**Concept**: Jump ahead by fixed steps, then linear search.

```javascript
function jumpSearch(arr, target) {
  let n = arr.length;
  let step = Math.floor(Math.sqrt(n));
  let prev = 0;

  // Find block where element may be present
  while (arr[Math.min(step, n) - 1] < target) {
    prev = step;
    step += Math.floor(Math.sqrt(n));
    if (prev >= n) return -1;
  }

  // Linear search in block
  while (arr[prev] < target) {
    prev++;
    if (prev === Math.min(step, n)) return -1;
  }

  if (arr[prev] === target) return prev;
  return -1;
}
```

**Time Complexity**: O(√n)
**Space Complexity**: O(1)

**When to use**: When jumping back is costly (like tape storage)

---

## Interpolation Search

**Concept**: Binary search but smarter mid calculation.

```javascript
function interpolationSearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right && target >= arr[left] && target <= arr[right]) {
    if (left === right) {
      if (arr[left] === target) return left;
      return -1;
    }

    // Better mid calculation
    let pos = left + Math.floor(
      ((right - left) / (arr[right] - arr[left])) * (target - arr[left])
    );

    if (arr[pos] === target) {
      return pos;
    }

    if (arr[pos] < target) {
      left = pos + 1;
    } else {
      right = pos - 1;
    }
  }

  return -1;
}
```

**Time Complexity**: O(log log n) for uniformly distributed data, O(n) worst case
**Space Complexity**: O(1)

---

## Comparison of Searching Algorithms

```
Algorithm       | Time (Avg) | Time (Worst) | Space | Requires Sorted
─────────────────────────────────────────────────────────────────────
Linear Search   | O(n)       | O(n)         | O(1)  | No
Binary Search   | O(log n)   | O(log n)     | O(1)  | Yes
Jump Search     | O(√n)      | O(√n)        | O(1)  | Yes
Interpolation   | O(log log n)| O(n)        | O(1)  | Yes (uniform)
```

---

## Common Mistakes

### Mistake 1: Off-by-One Errors
```javascript
// ❌ Wrong
while (left < right) {  // Should be <=

// ✅ Correct
while (left <= right) {
```

### Mistake 2: Integer Overflow
```javascript
// ❌ Can overflow for large values
let mid = (left + right) / 2;

// ✅ Correct
let mid = left + Math.floor((right - left) / 2);
```

### Mistake 3: Using Binary Search on Unsorted Data
```javascript
// ❌ Wrong - gives incorrect results
let arr = [5, 2, 8, 1, 9];
binarySearch(arr, 8);  // May not find it!

// ✅ Correct - sort first
arr.sort((a, b) => a - b);
binarySearch(arr, 8);
```

---

## Practice Problems

### Easy
1. Find element in sorted array
2. Find first and last position of element
3. Search insert position
4. Find peak element
5. Check if array is sorted

### Medium
1. Search in rotated sorted array
2. Find minimum in rotated sorted array
3. Search in 2D matrix
4. Find square root
5. Find first bad version

### Hard
1. Median of two sorted arrays
2. Find K-th smallest element
3. Aggressive cows problem
4. Allocate minimum pages
5. Find in mountain array

---

## Key Takeaways

✅ **Linear search**: O(n), works on any data
✅ **Binary search**: O(log n), requires sorted data
✅ **Always check** if data is sorted before binary search
✅ **Template pattern**: left, right, mid, adjust boundaries
✅ **Variations**: first/last occurrence, rotated array, peak
✅ **Real-world**: Price range search, autocomplete
✅ **Watch for**: off-by-one errors, integer overflow

---

## What's Next?

Now that you can search efficiently, let's learn to **sort** data!

**Next Lesson**: [05-sorting-algorithms.md](05-sorting-algorithms.md)

---

**Remember**: Binary search is your best friend for sorted data!

**Keep practicing! 🚀**
