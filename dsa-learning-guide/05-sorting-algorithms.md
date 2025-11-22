# Lesson 05: Sorting Algorithms

## Why Sorting Matters

Sorting is one of the most important algorithmic concepts. Applications:
- **Search**: Binary search requires sorted data
- **Databases**: ORDER BY uses sorting
- **E-commerce**: Sort products by price, rating
- **VahanHelp**: Sort cars by price, year, mileage

---

## Bubble Sort

### Concept
Repeatedly swap adjacent elements if they're in wrong order.

**Analogy**: Bubbles rise to the top.

```javascript
function bubbleSort(arr) {
  let n = arr.length;

  for (let i = 0; i < n; i++) {
    let swapped = false;

    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }

    // If no swaps, array is sorted
    if (!swapped) break;
  }

  return arr;
}

console.log(bubbleSort([64, 34, 25, 12, 22, 11, 90]));
// [11, 12, 22, 25, 34, 64, 90]
```

**Time Complexity**: O(n²)
**Space Complexity**: O(1)
**Stable**: Yes

**When to use**: Small arrays, nearly sorted data

---

## Selection Sort

### Concept
Find minimum element, swap with first. Repeat for remaining elements.

```javascript
function selectionSort(arr) {
  let n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;

    // Find minimum in remaining array
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    // Swap
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }

  return arr;
}

console.log(selectionSort([64, 25, 12, 22, 11]));
// [11, 12, 22, 25, 64]
```

**Time Complexity**: O(n²)
**Space Complexity**: O(1)
**Stable**: No

---

## Insertion Sort

### Concept
Build sorted array one element at a time, inserting each element in correct position.

**Analogy**: Sorting playing cards in your hand.

```javascript
function insertionSort(arr) {
  let n = arr.length;

  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;

    // Move elements greater than key one position ahead
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }

    arr[j + 1] = key;
  }

  return arr;
}

console.log(insertionSort([12, 11, 13, 5, 6]));
// [5, 6, 11, 12, 13]
```

**Time Complexity**: O(n²) worst case, O(n) best case
**Space Complexity**: O(1)
**Stable**: Yes

**When to use**: Small arrays, nearly sorted data, online sorting

---

## Merge Sort

### Concept
Divide array in half, recursively sort, then merge.

**Divide and Conquer!**

```javascript
function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  // Divide
  let mid = Math.floor(arr.length / 2);
  let left = mergeSort(arr.slice(0, mid));
  let right = mergeSort(arr.slice(mid));

  // Conquer (merge)
  return merge(left, right);
}

function merge(left, right) {
  let result = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  return result.concat(left.slice(i)).concat(right.slice(j));
}

console.log(mergeSort([38, 27, 43, 3, 9, 82, 10]));
// [3, 9, 10, 27, 38, 43, 82]
```

**Time Complexity**: O(n log n)
**Space Complexity**: O(n)
**Stable**: Yes

**When to use**: Large datasets, need stable sort, linked lists

**Visualization**:
```
[38, 27, 43, 3, 9, 82, 10]
       /              \
[38, 27, 43, 3]   [9, 82, 10]
    /      \         /     \
[38, 27] [43, 3]  [9, 82] [10]
 /   \    /  \     /   \    |
[38][27][43][3]  [9] [82] [10]
 \   /    \  /     \   /    |
[27,38] [3,43]   [9,82] [10]
    \      /         \     /
[3,27,38,43]     [9,10,82]
       \              /
[3, 9, 10, 27, 38, 43, 82]
```

---

## Quick Sort

### Concept
Pick pivot, partition array, recursively sort partitions.

```javascript
function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    let pi = partition(arr, low, high);

    quickSort(arr, low, pi - 1);   // Sort left
    quickSort(arr, pi + 1, high);  // Sort right
  }

  return arr;
}

function partition(arr, low, high) {
  let pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

console.log(quickSort([10, 7, 8, 9, 1, 5]));
// [1, 5, 7, 8, 9, 10]
```

**Time Complexity**: O(n log n) average, O(n²) worst case
**Space Complexity**: O(log n)
**Stable**: No

**When to use**: In-place sorting, average case performance matters

---

## Counting Sort

### Concept
Count occurrences, reconstruct array.

**Only for integers in known range!**

```javascript
function countingSort(arr) {
  let max = Math.max(...arr);
  let min = Math.min(...arr);
  let range = max - min + 1;

  let count = new Array(range).fill(0);
  let output = new Array(arr.length);

  // Count occurrences
  for (let num of arr) {
    count[num - min]++;
  }

  // Cumulative count
  for (let i = 1; i < range; i++) {
    count[i] += count[i - 1];
  }

  // Build output
  for (let i = arr.length - 1; i >= 0; i--) {
    let num = arr[i];
    output[count[num - min] - 1] = num;
    count[num - min]--;
  }

  return output;
}

console.log(countingSort([4, 2, 2, 8, 3, 3, 1]));
// [1, 2, 2, 3, 3, 4, 8]
```

**Time Complexity**: O(n + k) where k is range
**Space Complexity**: O(k)
**Stable**: Yes

**When to use**: Small range of integers

---

## Sorting Comparison

```
Algorithm       | Time (Best) | Time (Avg) | Time (Worst) | Space  | Stable
─────────────────────────────────────────────────────────────────────────────
Bubble Sort     | O(n)        | O(n²)      | O(n²)        | O(1)   | Yes
Selection Sort  | O(n²)       | O(n²)      | O(n²)        | O(1)   | No
Insertion Sort  | O(n)        | O(n²)      | O(n²)        | O(1)   | Yes
Merge Sort      | O(n log n)  | O(n log n) | O(n log n)   | O(n)   | Yes
Quick Sort      | O(n log n)  | O(n log n) | O(n²)        | O(log n)| No
Counting Sort   | O(n+k)      | O(n+k)     | O(n+k)       | O(k)   | Yes
JavaScript sort | -           | O(n log n) | O(n log n)   | -      | Yes*
```

*V8 engine uses TimSort (hybrid of Merge and Insertion)

---

## VahanHelp Real-World Examples

### Sort Cars by Multiple Criteria

```javascript
function sortCars(cars, criteria) {
  return cars.sort((a, b) => {
    for (let criterion of criteria) {
      let order = criterion.order === 'desc' ? -1 : 1;
      let field = criterion.field;

      if (a[field] < b[field]) return -1 * order;
      if (a[field] > b[field]) return 1 * order;
    }
    return 0;
  });
}

let cars = [
  { brand: "Honda", price: 1500000, year: 2020 },
  { brand: "BMW", price: 5000000, year: 2022 },
  { brand: "Maruti", price: 800000, year: 2019 }
];

// Sort by price ascending, then year descending
let sorted = sortCars(cars, [
  { field: 'price', order: 'asc' },
  { field: 'year', order: 'desc' }
]);
```

### Top K Cars (Quick Select)

```javascript
function topKCheapestCars(cars, k) {
  // Using JavaScript's built-in sort
  return cars
    .sort((a, b) => a.price - b.price)
    .slice(0, k);
}

// More efficient: Quick Select (O(n) average)
function quickSelect(arr, k, compareFn) {
  if (k > arr.length) return arr;

  function partition(low, high) {
    let pivot = arr[high];
    let i = low;

    for (let j = low; j < high; j++) {
      if (compareFn(arr[j], pivot) < 0) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        i++;
      }
    }

    [arr[i], arr[high]] = [arr[high], arr[i]];
    return i;
  }

  function select(low, high, k) {
    if (low === high) return;

    let pi = partition(low, high);

    if (pi === k) return;
    else if (pi < k) select(pi + 1, high, k);
    else select(low, pi - 1, k);
  }

  select(0, arr.length - 1, k - 1);
  return arr.slice(0, k);
}
```

---

## Custom Comparator

```javascript
// Sort by custom logic
cars.sort((a, b) => {
  // Primary: Price ascending
  if (a.price !== b.price) {
    return a.price - b.price;
  }

  // Secondary: Year descending
  if (a.year !== b.year) {
    return b.year - a.year;
  }

  // Tertiary: Brand alphabetically
  return a.brand.localeCompare(b.brand);
});
```

---

## Practice Problems

### Easy
1. Sort array of 0s, 1s, and 2s (Dutch National Flag)
2. Sort array by frequency
3. Merge two sorted arrays
4. Check if array is sorted
5. Find kth smallest element

### Medium
1. Sort colors (3-way partitioning)
2. Pancake sorting
3. Wiggle sort
4. Custom sort string
5. Largest number from array

### Hard
1. Count of smaller numbers after self
2. Reverse pairs
3. Count inversions
4. Range addition
5. Maximum gap

---

## Key Takeaways

✅ **O(n²) sorts**: Bubble, Selection, Insertion - simple but slow
✅ **O(n log n) sorts**: Merge, Quick - efficient for large data
✅ **Merge sort**: Stable, predictable, needs extra space
✅ **Quick sort**: Fast average case, in-place, not stable
✅ **JavaScript sort**: Use for most cases, provide comparator
✅ **Stable sort**: Maintains relative order of equal elements
✅ **In-place**: Uses O(1) extra space

---

## What's Next?

Now that you can sort, let's master **recursion**!

**Next Lesson**: [06-recursion.md](06-recursion.md)

---

**Remember**: Use JavaScript's built-in sort for most cases!

**Keep sorting! 🚀**
