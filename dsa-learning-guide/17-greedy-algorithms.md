# Lesson 17: Greedy Algorithms

## What is Greedy?

**Greedy**: Make locally optimal choice at each step, hoping to find global optimum.

**When to use**:
- Problem has greedy choice property
- Optimal substructure

---

## Classic Greedy Problems

### 1. Activity Selection

```javascript
function activitySelection(start, finish) {
  let activities = start.map((s, i) => ({ start: s, finish: finish[i] }));
  activities.sort((a, b) => a.finish - b.finish);

  let selected = [activities[0]];
  let lastFinish = activities[0].finish;

  for (let i = 1; i < activities.length; i++) {
    if (activities[i].start >= lastFinish) {
      selected.push(activities[i]);
      lastFinish = activities[i].finish;
    }
  }

  return selected;
}
```

---

### 2. Jump Game

```javascript
function canJump(nums) {
  let maxReach = 0;

  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
  }

  return true;
}

console.log(canJump([2, 3, 1, 1, 4]));  // true
console.log(canJump([3, 2, 1, 0, 4]));  // false
```

---

### 3. Coin Change (Greedy - works for certain coin systems)

```javascript
function coinChangeGreedy(coins, amount) {
  coins.sort((a, b) => b - a);
  let count = 0;

  for (let coin of coins) {
    while (amount >= coin) {
      amount -= coin;
      count++;
    }
  }

  return amount === 0 ? count : -1;
}
```

---

## Practice Problems

### Easy
1. Assign cookies
2. Lemonade change
3. Best time to buy and sell stock II
4. Remove K digits

### Medium
1. Jump game II
2. Partition labels
3. Gas station
4. Task scheduler

**Next Lesson**: [18-backtracking.md](18-backtracking.md)
