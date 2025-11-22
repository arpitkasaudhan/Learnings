# Lesson 16: Dynamic Programming Advanced

## 2D DP Problems

### 1. Longest Common Subsequence

```javascript
function longestCommonSubsequence(text1, text2) {
  let m = text1.length, n = text2.length;
  let dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[m][n];
}

console.log(longestCommonSubsequence("abcde", "ace"));  // 3
```

---

### 2. Edit Distance

```javascript
function minDistance(word1, word2) {
  let m = word1.length, n = word2.length;
  let dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],     // Delete
          dp[i][j - 1],     // Insert
          dp[i - 1][j - 1]  // Replace
        );
      }
    }
  }

  return dp[m][n];
}
```

---

### 3. 0/1 Knapsack

```javascript
function knapsack(weights, values, capacity) {
  let n = weights.length;
  let dp = Array(n + 1).fill(0).map(() => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w],  // Don't take
          values[i - 1] + dp[i - 1][w - weights[i - 1]]  // Take
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  return dp[n][capacity];
}
```

---

## Practice Problems

### Medium
1. Unique paths II
2. Triangle minimum path sum
3. Maximum subarray
4. Best time to buy and sell stock III

### Hard
1. Regular expression matching
2. Wildcard matching
3. Interleaving string
4. Burst balloons

**Next Lesson**: [17-greedy-algorithms.md](17-greedy-algorithms.md)
