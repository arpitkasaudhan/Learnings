# Lesson 02: Arrays - The Most Important Data Structure

## Why Arrays are So Important

Arrays are the **most commonly used data structure** in programming. Understanding arrays deeply will solve 40% of all coding interview problems!

**In VahanHelp**:
- Car listings: `cars = [car1, car2, car3, ...]`
- Search results: `results = [...]`
- User favorites: `favorites = [carId1, carId2, ...]`
- Pagination: Slicing arrays for pages

---

## Array Basics

### What is an Array?

An array is a collection of elements stored in **contiguous memory locations**.

```javascript
// Creating arrays
let cars = ["Honda", "Maruti", "BMW"];
let prices = [1500000, 800000, 5000000];
let mixed = [1, "text", true, {key: "value"}];
let empty = [];

// Array of objects (most common in real apps)
let carListings = [
  { id: 1, brand: "Honda", price: 1500000 },
  { id: 2, brand: "Maruti", price: 800000 },
  { id: 3, brand: "BMW", price: 5000000 }
];
```

### Time Complexity of Array Operations

```
Operation                     | Time Complexity
─────────────────────────────────────────────────
Access by index (arr[i])      | O(1)
Search by value              | O(n)
Insert at end (push)         | O(1) amortized
Insert at beginning (unshift)| O(n)
Insert at middle             | O(n)
Delete at end (pop)          | O(1)
Delete at beginning (shift)  | O(n)
Delete at middle             | O(n)
```

### Why is Access O(1)?

Arrays are stored in continuous memory:
```
Index:  0    1    2    3
Value: [10] [20] [30] [40]
Addr: 1000 1004 1008 1012

To access arr[2]:
  Address = BaseAddress + (index * size)
  Address = 1000 + (2 * 4) = 1008

  → Direct memory access = O(1)
```

---

## Common Array Patterns

### Pattern 1: Two Pointers

**Use**: When you need to scan array from both ends.

```javascript
// Check if array is palindrome
function isPalindrome(arr) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    if (arr[left] !== arr[right]) {
      return false;
    }
    left++;
    right--;
  }

  return true;
}

console.log(isPalindrome([1, 2, 3, 2, 1]));  // true
console.log(isPalindrome([1, 2, 3, 4, 5]));  // false
```

**Real-world - VahanHelp**:
```javascript
// Find pairs of cars that match budget
function findCarPairsInBudget(cars, budget) {
  // Sort by price first
  let sorted = cars.sort((a, b) => a.price - b.price);
  let left = 0;
  let right = sorted.length - 1;
  let pairs = [];

  while (left < right) {
    let sum = sorted[left].price + sorted[right].price;

    if (sum === budget) {
      pairs.push([sorted[left], sorted[right]]);
      left++;
      right--;
    } else if (sum < budget) {
      left++;
    } else {
      right--;
    }
  }

  return pairs;
}
```

**Time**: O(n log n) for sorting + O(n) for two pointers = O(n log n)
**Space**: O(1) if we don't count the output

---

### Pattern 2: Sliding Window

**Use**: When you need to find a subarray/substring with specific properties.

```javascript
// Find maximum sum of k consecutive elements
function maxSumSubarray(arr, k) {
  if (arr.length < k) return null;

  // Calculate sum of first window
  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }

  let maxSum = windowSum;

  // Slide the window
  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}

console.log(maxSumSubarray([1, 4, 2, 10, 23, 3, 1, 0, 20], 4));  // 39
```

**Real-world - VahanHelp**:
```javascript
// Find best consecutive days for car sales
function bestSalesPeriod(dailySales, days) {
  let windowSum = 0;

  for (let i = 0; i < days; i++) {
    windowSum += dailySales[i];
  }

  let maxSales = windowSum;
  let bestStartDay = 0;

  for (let i = days; i < dailySales.length; i++) {
    windowSum = windowSum - dailySales[i - days] + dailySales[i];
    if (windowSum > maxSales) {
      maxSales = windowSum;
      bestStartDay = i - days + 1;
    }
  }

  return { startDay: bestStartDay, totalSales: maxSales };
}
```

**Time**: O(n)
**Space**: O(1)

---

### Pattern 3: Fast & Slow Pointers (Floyd's Algorithm)

**Use**: Detect cycles, find middle element.

```javascript
// Find middle element
function findMiddle(arr) {
  let slow = 0;
  let fast = 0;

  while (fast < arr.length - 1) {
    slow++;
    fast += 2;
  }

  return arr[slow];
}

// Remove duplicates in-place from sorted array
function removeDuplicates(arr) {
  if (arr.length === 0) return 0;

  let slow = 0;

  for (let fast = 1; fast < arr.length; fast++) {
    if (arr[fast] !== arr[slow]) {
      slow++;
      arr[slow] = arr[fast];
    }
  }

  return slow + 1;  // New length
}

let arr = [1, 1, 2, 2, 3, 4, 4, 5];
let newLength = removeDuplicates(arr);
console.log(arr.slice(0, newLength));  // [1, 2, 3, 4, 5]
```

**Time**: O(n)
**Space**: O(1)

---

### Pattern 4: Prefix Sum

**Use**: Calculate sum of subarrays efficiently.

```javascript
// Build prefix sum array
function buildPrefixSum(arr) {
  let prefix = [arr[0]];

  for (let i = 1; i < arr.length; i++) {
    prefix[i] = prefix[i - 1] + arr[i];
  }

  return prefix;
}

// Get sum of subarray from index i to j in O(1)
function rangeSum(prefix, i, j) {
  if (i === 0) return prefix[j];
  return prefix[j] - prefix[i - 1];
}

let arr = [1, 2, 3, 4, 5];
let prefix = buildPrefixSum(arr);

console.log(rangeSum(prefix, 0, 2));  // 6 (1+2+3)
console.log(rangeSum(prefix, 2, 4));  // 12 (3+4+5)
```

**Real-world - VahanHelp**:
```javascript
// Calculate cumulative car sales over time
function cumulativeSales(sales) {
  let cumulative = [sales[0]];

  for (let i = 1; i < sales.length; i++) {
    cumulative[i] = cumulative[i - 1] + sales[i];
  }

  return cumulative;
}

// Get sales between month i and month j
function salesInRange(cumulative, startMonth, endMonth) {
  if (startMonth === 0) return cumulative[endMonth];
  return cumulative[endMonth] - cumulative[startMonth - 1];
}
```

**Time**:
- Build prefix sum: O(n)
- Range query: O(1)

**Space**: O(n)

---

### Pattern 5: Kadane's Algorithm (Maximum Subarray Sum)

**Use**: Find contiguous subarray with maximum sum.

```javascript
function maxSubarraySum(arr) {
  let maxSoFar = arr[0];
  let maxEndingHere = arr[0];

  for (let i = 1; i < arr.length; i++) {
    maxEndingHere = Math.max(arr[i], maxEndingHere + arr[i]);
    maxSoFar = Math.max(maxSoFar, maxEndingHere);
  }

  return maxSoFar;
}

console.log(maxSubarraySum([-2, 1, -3, 4, -1, 2, 1, -5, 4]));  // 6
// Subarray: [4, -1, 2, 1]
```

**Real-world - VahanHelp**:
```javascript
// Find best period for maximum profit (profit can be negative)
function maxProfitPeriod(dailyProfits) {
  let maxProfit = dailyProfits[0];
  let currentSum = dailyProfits[0];
  let start = 0, end = 0, tempStart = 0;

  for (let i = 1; i < dailyProfits.length; i++) {
    if (dailyProfits[i] > currentSum + dailyProfits[i]) {
      currentSum = dailyProfits[i];
      tempStart = i;
    } else {
      currentSum += dailyProfits[i];
    }

    if (currentSum > maxProfit) {
      maxProfit = currentSum;
      start = tempStart;
      end = i;
    }
  }

  return { maxProfit, start, end };
}
```

**Time**: O(n)
**Space**: O(1)

---

## Common Array Problems

### Problem 1: Reverse Array In-Place

```javascript
// O(n) time, O(1) space
function reverseArray(arr) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    // Swap
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }

  return arr;
}

console.log(reverseArray([1, 2, 3, 4, 5]));  // [5, 4, 3, 2, 1]
```

---

### Problem 2: Rotate Array by K Positions

```javascript
function rotateArray(arr, k) {
  k = k % arr.length;  // Handle k > arr.length

  // Helper function to reverse portion of array
  function reverse(start, end) {
    while (start < end) {
      [arr[start], arr[end]] = [arr[end], arr[start]];
      start++;
      end--;
    }
  }

  // Reverse entire array
  reverse(0, arr.length - 1);

  // Reverse first k elements
  reverse(0, k - 1);

  // Reverse remaining elements
  reverse(k, arr.length - 1);

  return arr;
}

console.log(rotateArray([1, 2, 3, 4, 5], 2));  // [4, 5, 1, 2, 3]
```

**Time**: O(n)
**Space**: O(1)

---

### Problem 3: Find Missing Number (1 to N)

```javascript
// Array contains numbers 1 to N with one missing
function findMissingNumber(arr, n) {
  // Method 1: Using sum formula
  let expectedSum = (n * (n + 1)) / 2;
  let actualSum = arr.reduce((sum, num) => sum + num, 0);
  return expectedSum - actualSum;
}

console.log(findMissingNumber([1, 2, 4, 5, 6], 6));  // 3

// Method 2: Using XOR (more efficient)
function findMissingNumberXOR(arr, n) {
  let xor1 = 0, xor2 = 0;

  for (let i = 0; i < arr.length; i++) {
    xor1 ^= arr[i];
  }

  for (let i = 1; i <= n; i++) {
    xor2 ^= i;
  }

  return xor1 ^ xor2;
}
```

**Time**: O(n)
**Space**: O(1)

---

### Problem 4: Move All Zeros to End

```javascript
function moveZerosToEnd(arr) {
  let nonZeroIndex = 0;

  // Move all non-zero elements to front
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== 0) {
      arr[nonZeroIndex] = arr[i];
      nonZeroIndex++;
    }
  }

  // Fill remaining with zeros
  while (nonZeroIndex < arr.length) {
    arr[nonZeroIndex] = 0;
    nonZeroIndex++;
  }

  return arr;
}

console.log(moveZerosToEnd([0, 1, 0, 3, 12]));  // [1, 3, 12, 0, 0]
```

**Time**: O(n)
**Space**: O(1)

---

### Problem 5: Find Duplicates

```javascript
// Method 1: Using Set - O(n) time, O(n) space
function findDuplicates(arr) {
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

// Method 2: For array with values 1 to N - O(n) time, O(1) space
function findDuplicatesInPlace(arr) {
  let duplicates = [];

  for (let i = 0; i < arr.length; i++) {
    let index = Math.abs(arr[i]) - 1;

    if (arr[index] < 0) {
      duplicates.push(Math.abs(arr[i]));
    } else {
      arr[index] = -arr[index];
    }
  }

  return duplicates;
}

console.log(findDuplicates([1, 2, 3, 1, 2, 4]));  // [1, 2]
```

---

### Problem 6: Merge Two Sorted Arrays

```javascript
function mergeSortedArrays(arr1, arr2) {
  let merged = [];
  let i = 0, j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] < arr2[j]) {
      merged.push(arr1[i]);
      i++;
    } else {
      merged.push(arr2[j]);
      j++;
    }
  }

  // Add remaining elements
  while (i < arr1.length) {
    merged.push(arr1[i]);
    i++;
  }

  while (j < arr2.length) {
    merged.push(arr2[j]);
    j++;
  }

  return merged;
}

console.log(mergeSortedArrays([1, 3, 5], [2, 4, 6]));  // [1, 2, 3, 4, 5, 6]
```

**Time**: O(n + m)
**Space**: O(n + m)

---

## VahanHelp Real-World Examples

### Example 1: Paginate Car Listings

```javascript
function paginateCarListings(allCars, page, pageSize) {
  let start = (page - 1) * pageSize;
  let end = start + pageSize;

  return {
    cars: allCars.slice(start, end),
    totalPages: Math.ceil(allCars.length / pageSize),
    currentPage: page,
    totalCars: allCars.length
  };
}

let cars = Array(100).fill(null).map((_, i) => ({ id: i, brand: `Car ${i}` }));
let page1 = paginateCarListings(cars, 1, 10);
console.log(page1);
// { cars: [...10 cars...], totalPages: 10, currentPage: 1, totalCars: 100 }
```

---

### Example 2: Filter and Sort Cars

```javascript
function filterAndSortCars(cars, filters) {
  let filtered = cars;

  // Filter by price range
  if (filters.minPrice || filters.maxPrice) {
    filtered = filtered.filter(car => {
      let matchMin = !filters.minPrice || car.price >= filters.minPrice;
      let matchMax = !filters.maxPrice || car.price <= filters.maxPrice;
      return matchMin && matchMax;
    });
  }

  // Filter by brand
  if (filters.brands && filters.brands.length > 0) {
    filtered = filtered.filter(car =>
      filters.brands.includes(car.brand)
    );
  }

  // Filter by year
  if (filters.minYear) {
    filtered = filtered.filter(car => car.year >= filters.minYear);
  }

  // Sort
  if (filters.sortBy === 'price_asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (filters.sortBy === 'price_desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (filters.sortBy === 'year_desc') {
    filtered.sort((a, b) => b.year - a.year);
  }

  return filtered;
}

let cars = [
  { id: 1, brand: "Honda", price: 1500000, year: 2020 },
  { id: 2, brand: "Maruti", price: 800000, year: 2019 },
  { id: 3, brand: "BMW", price: 5000000, year: 2022 }
];

let result = filterAndSortCars(cars, {
  minPrice: 1000000,
  maxPrice: 2000000,
  sortBy: 'price_asc'
});
```

---

### Example 3: Group Cars by Brand

```javascript
function groupCarsByBrand(cars) {
  return cars.reduce((grouped, car) => {
    if (!grouped[car.brand]) {
      grouped[car.brand] = [];
    }
    grouped[car.brand].push(car);
    return grouped;
  }, {});
}

let cars = [
  { id: 1, brand: "Honda", model: "City" },
  { id: 2, brand: "Honda", model: "Civic" },
  { id: 3, brand: "Maruti", model: "Swift" }
];

console.log(groupCarsByBrand(cars));
// {
//   Honda: [{ id: 1, ... }, { id: 2, ... }],
//   Maruti: [{ id: 3, ... }]
// }
```

---

### Example 4: Find Top N Searched Cars

```javascript
function topNSearchedCars(searchHistory, n) {
  // Count frequency
  let frequency = {};

  for (let carId of searchHistory) {
    frequency[carId] = (frequency[carId] || 0) + 1;
  }

  // Convert to array and sort
  let sorted = Object.entries(frequency)
    .map(([carId, count]) => ({ carId, count }))
    .sort((a, b) => b.count - a.count);

  return sorted.slice(0, n);
}

let searchHistory = [1, 2, 1, 3, 2, 1, 4, 2, 1];
console.log(topNSearchedCars(searchHistory, 3));
// [{ carId: "1", count: 4 }, { carId: "2", count: 3 }, { carId: "3", count: 1 }]
```

---

## Common Mistakes

### Mistake 1: Modifying Array While Iterating
```javascript
// ❌ Wrong - skips elements
let arr = [1, 2, 3, 4, 5];
for (let i = 0; i < arr.length; i++) {
  if (arr[i] % 2 === 0) {
    arr.splice(i, 1);  // Modifies array during iteration
  }
}

// ✅ Correct - iterate backwards
let arr = [1, 2, 3, 4, 5];
for (let i = arr.length - 1; i >= 0; i--) {
  if (arr[i] % 2 === 0) {
    arr.splice(i, 1);
  }
}

// ✅ Better - use filter
let arr = [1, 2, 3, 4, 5];
arr = arr.filter(num => num % 2 !== 0);
```

### Mistake 2: Not Considering Empty Arrays
```javascript
// ❌ Wrong - crashes on empty array
function getFirst(arr) {
  return arr[0];
}

// ✅ Correct
function getFirst(arr) {
  return arr.length > 0 ? arr[0] : null;
}
```

### Mistake 3: Mutating When You Shouldn't
```javascript
// ❌ Wrong - mutates original
function sortCars(cars) {
  return cars.sort((a, b) => a.price - b.price);
}

// ✅ Correct - creates copy
function sortCars(cars) {
  return [...cars].sort((a, b) => a.price - b.price);
}
```

---

## Practice Problems

### Easy
1. Find the second largest element in array
2. Check if array is sorted
3. Remove duplicates from sorted array
4. Find the intersection of two arrays
5. Rotate array left by one position

### Medium
1. Find the "Kth" largest element
2. Merge overlapping intervals
3. Find all pairs with given sum
4. Rearrange array in alternating positive & negative
5. Find the longest consecutive sequence

### Hard
1. Trapping rain water problem
2. Maximum product subarray
3. Median of two sorted arrays
4. Longest substring without repeating characters
5. Minimum window substring

---

## Quick Reference

### Essential Array Methods
```javascript
// Add/Remove
arr.push(item)        // Add to end - O(1)
arr.pop()             // Remove from end - O(1)
arr.unshift(item)     // Add to start - O(n)
arr.shift()           // Remove from start - O(n)
arr.splice(i, n)      // Remove n items at index i - O(n)

// Search
arr.indexOf(item)     // Find index - O(n)
arr.includes(item)    // Check existence - O(n)
arr.find(callback)    // Find first match - O(n)
arr.findIndex(cb)     // Find index of first match - O(n)

// Transform
arr.map(callback)     // Transform each element - O(n)
arr.filter(callback)  // Keep matching elements - O(n)
arr.reduce(callback)  // Reduce to single value - O(n)

// Iterate
arr.forEach(callback) // Loop through - O(n)

// Other
arr.slice(start, end) // Extract portion - O(n)
arr.concat(arr2)      // Merge arrays - O(n+m)
arr.join(separator)   // Convert to string - O(n)
arr.reverse()         // Reverse in place - O(n)
arr.sort(compareFn)   // Sort in place - O(n log n)
```

---

## Key Takeaways

✅ Arrays are **O(1)** for access, **O(n)** for search
✅ **Two pointers** pattern for sorted arrays
✅ **Sliding window** for subarray problems
✅ **Prefix sum** for range queries
✅ **Kadane's algorithm** for maximum subarray
✅ Always check for **empty arrays**
✅ Be careful when **modifying while iterating**
✅ **Array methods** (map, filter, reduce) create new arrays
✅ **Space-time tradeoff**: hash map for O(1) lookup

---

## What's Next?

Now that you've mastered arrays, let's learn about string manipulation!

**Next Lesson**: [03-strings.md](03-strings.md) - String patterns and problems

---

**Remember**: Master arrays and you'll solve 40% of coding problems!

**Practice daily! 🚀**
