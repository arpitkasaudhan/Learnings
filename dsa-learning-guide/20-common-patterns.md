# Lesson 20: Common Patterns & Problem-Solving Guide

## Pattern Recognition Cheatsheet

### 1. Two Pointers Pattern

**When to use**:
- Sorted array problems
- Palindrome problems
- Pair sum problems

**Problems**:
- Two Sum (sorted)
- Remove duplicates
- Container with most water
- Valid palindrome

**Template**:
```javascript
let left = 0, right = arr.length - 1;
while (left < right) {
  // Process
  if (condition) left++;
  else right--;
}
```

---

### 2. Sliding Window Pattern

**When to use**:
- Subarray/substring problems
- "Maximum/minimum subarray of size k"
- "Longest substring with..."

**Problems**:
- Maximum sum subarray
- Longest substring without repeating
- Minimum window substring

**Template**:
```javascript
let left = 0;
for (let right = 0; right < arr.length; right++) {
  // Expand window
  while (/* window invalid */) {
    // Shrink window
    left++;
  }
  // Update result
}
```

---

### 3. Fast & Slow Pointers

**When to use**:
- Linked list cycle detection
- Finding middle element
- Detecting loops

**Problems**:
- Linked list cycle
- Find middle of linked list
- Happy number

**Template**:
```javascript
let slow = head, fast = head;
while (fast && fast.next) {
  slow = slow.next;
  fast = fast.next.next;
  if (slow === fast) return true;
}
```

---

### 4. Binary Search Pattern

**When to use**:
- Sorted data
- "Find first/last occurrence"
- Search in rotated array

**Problems**:
- Binary search
- Search insert position
- Find peak element

**Template**:
```javascript
let left = 0, right = arr.length - 1;
while (left <= right) {
  let mid = Math.floor((left + right) / 2);
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) left = mid + 1;
  else right = mid - 1;
}
```

---

### 5. BFS Pattern (Level-Order Traversal)

**When to use**:
- Tree level-order traversal
- Graph shortest path
- "Minimum steps" problems

**Problems**:
- Binary tree level order
- Word ladder
- Rotting oranges

**Template**:
```javascript
let queue = [start];
let visited = new Set([start]);

while (queue.length > 0) {
  let node = queue.shift();

  for (let neighbor of getNeighbors(node)) {
    if (!visited.has(neighbor)) {
      visited.add(neighbor);
      queue.push(neighbor);
    }
  }
}
```

---

### 6. DFS Pattern (Backtracking)

**When to use**:
- Generate all combinations/permutations
- Subset problems
- Path finding

**Problems**:
- Subsets
- Permutations
- N-Queens

**Template**:
```javascript
function backtrack(current, remaining) {
  if (/* base case */) {
    result.push([...current]);
    return;
  }

  for (let choice of choices) {
    current.push(choice);  // Choose
    backtrack(/* updated state */);  // Explore
    current.pop();  // Unchoose
  }
}
```

---

### 7. Dynamic Programming Pattern

**When to use**:
- Overlapping subproblems
- Optimal substructure
- "Maximum/minimum", "Count ways"

**Problems**:
- Fibonacci
- Coin change
- Longest increasing subsequence

**Template**:
```javascript
let dp = Array(n + 1).fill(baseValue);
dp[0] = initialValue;

for (let i = 1; i <= n; i++) {
  for (let j = 0; j < i; j++) {
    dp[i] = /* recurrence relation */;
  }
}
```

---

### 8. Hash Map Pattern

**When to use**:
- Need O(1) lookup
- Frequency counting
- Grouping

**Problems**:
- Two sum
- Group anagrams
- Top K frequent elements

**Template**:
```javascript
let map = new Map();

for (let item of items) {
  map.set(item, (map.get(item) || 0) + 1);
}
```

---

## Problem-Solving Approach

### Step 1: Understand the Problem
- Read carefully
- Identify input/output
- Ask clarifying questions
- Consider edge cases

### Step 2: Choose a Pattern
- Recognize the pattern from above
- Think about similar problems
- Consider time/space constraints

### Step 3: Plan the Solution
- Pseudocode
- Identify data structures
- Consider edge cases

### Step 4: Code
- Start with brute force
- Optimize if needed
- Test with examples

### Step 5: Analyze Complexity
- Time complexity
- Space complexity
- Can we do better?

---

## Interview Tips

✅ **Clarify** the problem first
✅ **Think out loud** - explain your approach
✅ **Start with brute force**, then optimize
✅ **Test with examples** - especially edge cases
✅ **Analyze complexity** - time and space
✅ **Ask for hints** if stuck
✅ **Write clean code** - clear variable names
✅ **Handle edge cases** - empty input, single element

---

## Common Edge Cases

- **Empty input**: `arr = []`, `str = ""`
- **Single element**: `arr = [1]`
- **All same elements**: `arr = [1, 1, 1]`
- **Negative numbers**: `arr = [-1, -2, -3]`
- **Large numbers**: Integer overflow
- **Duplicates**: How to handle?
- **Null/undefined**: Check before access

---

## Time Complexity Quick Reference

```
O(1)       - Hash map lookup, array access
O(log n)   - Binary search, balanced tree
O(n)       - Linear search, single loop
O(n log n) - Efficient sorting, merge sort
O(n²)      - Nested loops, bubble sort
O(2ⁿ)      - Recursive fibonacci, subsets
O(n!)      - Permutations, TSP
```

---

## Space Complexity Quick Reference

```
O(1)   - Few variables, in-place algorithm
O(n)   - Hash map, recursion depth n
O(n²)  - 2D matrix
```

---

## Final Checklist

Before submitting solution:

- [ ] Handles all edge cases
- [ ] Correct time complexity
- [ ] Correct space complexity
- [ ] Clean, readable code
- [ ] Tested with examples
- [ ] Handles invalid input
- [ ] Variable names are clear

---

## You've Completed DSA!

🎉 **Congratulations!** You've mastered:
- 20 comprehensive DSA lessons
- All major data structures
- All major algorithms
- Common patterns and techniques
- Problem-solving strategies

---

## What's Next?

**Practice**:
- LeetCode: 100+ problems
- HackerRank: Complete tracks
- Daily coding: 1-2 problems

**Apply**:
- Use in VahanHelp backend
- Optimize existing code
- Build new features

**Prepare**:
- Mock interviews
- System design
- Behavioral questions

---

## When to Delete This Guide

Delete when you can:
- ✅ Recognize patterns instantly
- ✅ Solve medium problems in 20-30 min
- ✅ Explain time/space complexity
- ✅ Choose optimal data structure
- ✅ Optimize brute force solutions
- ✅ Pass coding interviews

**Timeline**: 6-12 months of consistent practice

---

**Remember**: Practice makes perfect. Code daily, stay consistent!

**You've got this! 🚀**
