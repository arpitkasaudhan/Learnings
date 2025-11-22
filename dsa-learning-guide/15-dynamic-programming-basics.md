# Lesson 15: Dynamic Programming Basics

## What is Dynamic Programming?

**DP**: Solve problems by breaking them into overlapping subproblems. Store results to avoid recomputation.

**When to use DP**:
- Overlapping subproblems
- Optimal substructure

**Approaches**:
1. **Memoization** (Top-Down): Recursion + caching
2. **Tabulation** (Bottom-Up): Iterative + table

---

## Classic DP Problems

### 1. Fibonacci

```javascript
// Naive recursion - O(2^n)
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

// Memoization - O(n)
function fibMemo(n, memo = {}) {
  if (n <= 1) return n;
  if (memo[n]) return memo[n];

  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}

// Tabulation - O(n)
function fibTab(n) {
  if (n <= 1) return n;

  let dp = [0, 1];

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
}

// Space optimized - O(1)
function fibOptimized(n) {
  if (n <= 1) return n;

  let prev = 0, curr = 1;

  for (let i = 2; i <= n; i++) {
    [prev, curr] = [curr, prev + curr];
  }

  return curr;
}
```

---

### 2. Climbing Stairs

**Problem**: How many ways to climb n stairs if you can take 1 or 2 steps?

```javascript
function climbStairs(n) {
  if (n <= 2) return n;

  let dp = [0, 1, 2];

  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
}

console.log(climbStairs(5));  // 8
```

---

### 3. Coin Change

**Problem**: Min coins to make amount.

```javascript
function coinChange(coins, amount) {
  let dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= amount; i++) {
    for (let coin of coins) {
      if (i >= coin) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}

console.log(coinChange([1, 2, 5], 11));  // 3 (5 + 5 + 1)
```

---

### 4. Longest Increasing Subsequence

```javascript
function lengthOfLIS(nums) {
  let dp = new Array(nums.length).fill(1);

  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }

  return Math.max(...dp);
}

console.log(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]));  // 4
```

---

### 5. House Robber

```javascript
function rob(nums) {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];

  let dp = [nums[0], Math.max(nums[0], nums[1])];

  for (let i = 2; i < nums.length; i++) {
    dp[i] = Math.max(dp[i - 1], nums[i] + dp[i - 2]);
  }

  return dp[nums.length - 1];
}

console.log(rob([2, 7, 9, 3, 1]));  // 12
```

---

## DP Pattern Recognition

**1D DP**: Single parameter (n, i)
- Fibonacci, climbing stairs, house robber

**2D DP**: Two parameters (i, j)
- Grid problems, longest common subsequence

**State**: What information do we need to store?
**Transition**: How do we calculate new state?

---

## Practice Problems

### Easy
1. Min cost climbing stairs
2. N-th tribonacci number
3. Divisor game
4. Best time to buy and sell stock

### Medium
1. Unique paths
2. Word break
3. Decode ways
4. Partition equal subset sum

**Next Lesson**: [16-dynamic-programming-advanced.md](16-dynamic-programming-advanced.md)
