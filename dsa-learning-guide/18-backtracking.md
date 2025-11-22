# Lesson 18: Backtracking

## What is Backtracking?

**Backtracking**: Try all possibilities, backtrack when invalid.

**Pattern**:
1. Choose
2. Explore
3. Unchoose (backtrack)

---

## Classic Backtracking Problems

### 1. Generate All Subsets

```javascript
function subsets(nums) {
  let result = [];

  function backtrack(index, current) {
    result.push([...current]);

    for (let i = index; i < nums.length; i++) {
      current.push(nums[i]);
      backtrack(i + 1, current);
      current.pop();  // Backtrack
    }
  }

  backtrack(0, []);
  return result;
}

console.log(subsets([1, 2, 3]));
// [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]
```

---

### 2. Generate All Permutations

```javascript
function permute(nums) {
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

  backtrack([], nums);
  return result;
}

console.log(permute([1, 2, 3]));
```

---

### 3. N-Queens

```javascript
function solveNQueens(n) {
  let result = [];
  let board = Array(n).fill(0).map(() => Array(n).fill('.'));

  function isSafe(row, col) {
    // Check column
    for (let i = 0; i < row; i++) {
      if (board[i][col] === 'Q') return false;
    }

    // Check diagonal
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 'Q') return false;
    }

    for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
      if (board[i][j] === 'Q') return false;
    }

    return true;
  }

  function backtrack(row) {
    if (row === n) {
      result.push(board.map(r => r.join('')));
      return;
    }

    for (let col = 0; col < n; col++) {
      if (isSafe(row, col)) {
        board[row][col] = 'Q';
        backtrack(row + 1);
        board[row][col] = '.';
      }
    }
  }

  backtrack(0);
  return result;
}
```

---

## Practice Problems

### Easy
1. Letter combinations of phone number
2. Combination sum
3. Palindrome partitioning

### Medium
1. Generate parentheses
2. Subsets II
3. Permutations II
4. Word search

### Hard
1. N-Queens
2. Sudoku solver
3. Regular expression matching
4. Wildcard matching

**Next Lesson**: [19-advanced-techniques.md](19-advanced-techniques.md)
