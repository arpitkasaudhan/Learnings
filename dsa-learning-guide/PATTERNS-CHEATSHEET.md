# DSA Patterns Cheatsheet

Quick reference for recognizing and solving common DSA patterns.

---

## 1. Two Pointers 👆👆

**When to use**:
- Sorted array
- Palindrome check
- Pair/triplet sum
- Merging arrays

**Template**:
```javascript
let left = 0, right = arr.length - 1;
while (left < right) {
  if (condition) {
    left++;
  } else {
    right--;
  }
}
```

**Problems**:
- Two Sum (sorted)
- Valid Palindrome
- Container With Most Water
- 3Sum

---

## 2. Sliding Window 🪟

**When to use**:
- Subarray/substring
- "Maximum/minimum of size k"
- "Longest/shortest substring with..."

**Fixed Size Window**:
```javascript
let sum = 0;
for (let i = 0; i < k; i++) sum += arr[i];
let maxSum = sum;

for (let i = k; i < arr.length; i++) {
  sum = sum - arr[i - k] + arr[i];
  maxSum = Math.max(maxSum, sum);
}
```

**Variable Size Window**:
```javascript
let left = 0, maxLen = 0;
for (let right = 0; right < arr.length; right++) {
  // Expand window
  while (/* invalid condition */) {
    // Shrink window
    left++;
  }
  maxLen = Math.max(maxLen, right - left + 1);
}
```

**Problems**:
- Maximum Sum Subarray of Size K
- Longest Substring Without Repeating Characters
- Minimum Window Substring
- Fruits Into Baskets

---

## 3. Fast & Slow Pointers 🐇🐢

**When to use**:
- Linked list cycle
- Find middle
- Detect patterns

**Template**:
```javascript
let slow = head, fast = head;
while (fast && fast.next) {
  slow = slow.next;
  fast = fast.next.next;

  if (slow === fast) return true;  // Cycle detected
}
```

**Problems**:
- Linked List Cycle
- Find Middle of Linked List
- Happy Number
- Palindrome Linked List

---

## 4. Binary Search 🔍

**When to use**:
- Sorted data
- Search space can be divided
- "Find first/last occurrence"

**Classic Template**:
```javascript
let left = 0, right = arr.length - 1;
while (left <= right) {
  let mid = Math.floor((left + right) / 2);

  if (arr[mid] === target) return mid;
  if (arr[mid] < target) left = mid + 1;
  else right = mid - 1;
}
```

**Find First Occurrence**:
```javascript
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
```

**Problems**:
- Binary Search
- Search in Rotated Sorted Array
- Find First and Last Position
- Search Insert Position

---

## 5. BFS (Level Order) 🌊

**When to use**:
- Tree level order
- Shortest path (unweighted graph)
- "Minimum steps" problems

**Template**:
```javascript
let queue = [start];
let visited = new Set([start]);

while (queue.length > 0) {
  let levelSize = queue.length;

  for (let i = 0; i < levelSize; i++) {
    let node = queue.shift();

    for (let neighbor of getNeighbors(node)) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}
```

**Problems**:
- Binary Tree Level Order Traversal
- Word Ladder
- Rotting Oranges
- Shortest Path in Binary Matrix

---

## 6. DFS (Backtracking) 🌳

**When to use**:
- Generate all combinations/permutations
- Subset problems
- Path finding
- Solve puzzles (Sudoku, N-Queens)

**Template**:
```javascript
function backtrack(current, remaining) {
  // Base case
  if (/* goal reached */) {
    result.push([...current]);
    return;
  }

  for (let choice of choices) {
    // Choose
    current.push(choice);

    // Explore
    backtrack(/* updated state */);

    // Unchoose (backtrack)
    current.pop();
  }
}
```

**Problems**:
- Subsets
- Permutations
- Combination Sum
- N-Queens
- Sudoku Solver

---

## 7. Dynamic Programming 💎

**When to use**:
- Overlapping subproblems
- Optimal substructure
- "Maximum/minimum", "Count ways"

**1D DP Template**:
```javascript
let dp = Array(n + 1).fill(0);
dp[0] = initialValue;

for (let i = 1; i <= n; i++) {
  dp[i] = /* calculate from previous states */;
}
```

**2D DP Template**:
```javascript
let dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));

for (let i = 1; i <= m; i++) {
  for (let j = 1; j <= n; j++) {
    dp[i][j] = /* calculate */;
  }
}
```

**Problems**:
- Fibonacci
- Climbing Stairs
- Coin Change
- Longest Common Subsequence
- 0/1 Knapsack

---

## 8. Hash Map 🗺️

**When to use**:
- Need O(1) lookup
- Frequency counting
- Grouping/categorizing

**Frequency Counter**:
```javascript
let freq = {};
for (let item of items) {
  freq[item] = (freq[item] || 0) + 1;
}
```

**Grouping**:
```javascript
let groups = new Map();
for (let item of items) {
  let key = getKey(item);
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(item);
}
```

**Problems**:
- Two Sum
- Group Anagrams
- Top K Frequent Elements
- Longest Substring Without Repeating

---

## 9. Greedy 💰

**When to use**:
- Locally optimal choice leads to global optimum
- Activity selection
- Huffman coding

**Template**:
```javascript
items.sort(/* by greedy criterion */);

for (let item of items) {
  if (/* can take item */) {
    // Take it
  }
}
```

**Problems**:
- Activity Selection
- Jump Game
- Gas Station
- Task Scheduler

---

## 10. Modified Binary Search 🔎

**When to use**:
- Rotated sorted array
- Find peak element
- Search in 2D matrix

**Problems**:
- Search in Rotated Sorted Array
- Find Peak Element
- Find Minimum in Rotated Sorted Array

---

## 11. Top K Elements 🔝

**When to use**:
- K largest/smallest elements
- K most frequent

**Using Min Heap**:
```javascript
let heap = new MinHeap();

for (let item of items) {
  heap.insert(item);
  if (heap.size() > k) {
    heap.extractMin();
  }
}
```

**Problems**:
- Kth Largest Element
- Top K Frequent Elements
- K Closest Points

---

## 12. Merge Intervals ⏱️

**When to use**:
- Overlapping intervals
- Schedule conflicts

**Template**:
```javascript
intervals.sort((a, b) => a[0] - b[0]);
let merged = [intervals[0]];

for (let i = 1; i < intervals.length; i++) {
  let last = merged[merged.length - 1];

  if (intervals[i][0] <= last[1]) {
    // Overlap - merge
    last[1] = Math.max(last[1], intervals[i][1]);
  } else {
    // No overlap - add new interval
    merged.push(intervals[i]);
  }
}
```

**Problems**:
- Merge Intervals
- Insert Interval
- Meeting Rooms

---

## 13. Cyclic Sort 🔄

**When to use**:
- Array contains numbers in range [1, n]
- Find missing/duplicate numbers

**Template**:
```javascript
let i = 0;
while (i < arr.length) {
  let correctIndex = arr[i] - 1;

  if (arr[i] !== arr[correctIndex]) {
    // Swap to correct position
    [arr[i], arr[correctIndex]] = [arr[correctIndex], arr[i]];
  } else {
    i++;
  }
}
```

**Problems**:
- Find Missing Number
- Find All Duplicates
- Find Corrupt Pair

---

## 14. Monotonic Stack 📚

**When to use**:
- Next greater/smaller element
- Previous greater/smaller element

**Template**:
```javascript
let stack = [];
let result = Array(arr.length).fill(-1);

for (let i = 0; i < arr.length; i++) {
  while (stack.length > 0 && arr[i] > arr[stack[stack.length - 1]]) {
    let index = stack.pop();
    result[index] = arr[i];
  }
  stack.push(i);
}
```

**Problems**:
- Next Greater Element
- Daily Temperatures
- Largest Rectangle in Histogram

---

## 15. Bit Manipulation 🔢

**When to use**:
- XOR properties
- Check power of 2
- Count set bits

**Common Operations**:
```javascript
// Check if bit is set
(n & (1 << i)) !== 0

// Set bit
n | (1 << i)

// Clear bit
n & ~(1 << i)

// Toggle bit
n ^ (1 << i)

// Power of 2
n > 0 && (n & (n - 1)) === 0

// Count set bits
function countBits(n) {
  let count = 0;
  while (n > 0) {
    count += n & 1;
    n >>= 1;
  }
  return count;
}
```

**Problems**:
- Single Number
- Number of 1 Bits
- Power of Two
- Missing Number

---

## Pattern Recognition Guide

**Keywords → Pattern**:

| Keywords | Pattern |
|----------|---------|
| Sorted array, pair sum | Two Pointers |
| Substring, subarray, window | Sliding Window |
| Linked list cycle | Fast & Slow |
| Sorted, search | Binary Search |
| Tree level, shortest path | BFS |
| All combinations, permutations | Backtracking/DFS |
| Max/min, count ways | DP |
| O(1) lookup, frequency | Hash Map |
| Optimal choice, greedy | Greedy |
| Top K, K largest | Heap/Priority Queue |
| Overlapping intervals | Merge Intervals |
| Array [1...n], missing | Cyclic Sort |
| Next greater/smaller | Monotonic Stack |

---

## Problem-Solving Steps

1. **Understand** - Read problem carefully
2. **Recognize** - Identify the pattern
3. **Plan** - Choose data structure & algorithm
4. **Code** - Implement solution
5. **Test** - Verify with examples
6. **Optimize** - Improve time/space complexity

---

## Time Complexity Quick Reference

```
O(1)       - Hash map lookup
O(log n)   - Binary search
O(n)       - Single loop
O(n log n) - Sorting, merge sort
O(n²)      - Nested loops
O(2ⁿ)      - Recursion (fibonacci)
O(n!)      - Permutations
```

---

**Use this cheatsheet during practice and interviews!**

**Master the patterns, master the problems! 🚀**
