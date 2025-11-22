# Lesson 12: Heaps & Priority Queues

## What is a Heap?

**Heap**: Complete binary tree with heap property.

**Types**:
- **Min Heap**: Parent ≤ children
- **Max Heap**: Parent ≥ children

```
Max Heap:
      50
     /  \
    30   20
   / \   /
  15 10 8

Min Heap:
       8
     /  \
    10   20
   / \   /
  15 30 50
```

---

## Heap Implementation (Min Heap)

```javascript
class MinHeap {
  constructor() {
    this.heap = [];
  }

  getParentIndex(i) {
    return Math.floor((i - 1) / 2);
  }

  getLeftChildIndex(i) {
    return 2 * i + 1;
  }

  getRightChildIndex(i) {
    return 2 * i + 2;
  }

  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  // Insert - O(log n)
  insert(value) {
    this.heap.push(value);
    this.heapifyUp(this.heap.length - 1);
  }

  heapifyUp(index) {
    let parentIndex = this.getParentIndex(index);

    if (parentIndex >= 0 && this.heap[index] < this.heap[parentIndex]) {
      this.swap(index, parentIndex);
      this.heapifyUp(parentIndex);
    }
  }

  // Extract min - O(log n)
  extractMin() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    let min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown(0);

    return min;
  }

  heapifyDown(index) {
    let smallest = index;
    let left = this.getLeftChildIndex(index);
    let right = this.getRightChildIndex(index);

    if (left < this.heap.length && this.heap[left] < this.heap[smallest]) {
      smallest = left;
    }

    if (right < this.heap.length && this.heap[right] < this.heap[smallest]) {
      smallest = right;
    }

    if (smallest !== index) {
      this.swap(index, smallest);
      this.heapifyDown(smallest);
    }
  }

  // Peek min - O(1)
  peek() {
    return this.heap[0];
  }

  size() {
    return this.heap.length;
  }
}
```

---

## Priority Queue

```javascript
class PriorityQueue {
  constructor() {
    this.heap = new MinHeap();
  }

  enqueue(value, priority) {
    this.heap.insert({ value, priority });
  }

  dequeue() {
    return this.heap.extractMin();
  }

  isEmpty() {
    return this.heap.size() === 0;
  }
}

// Usage
let pq = new PriorityQueue();
pq.enqueue("Task 1", 3);
pq.enqueue("Task 2", 1);  // Highest priority
pq.enqueue("Task 3", 2);

console.log(pq.dequeue());  // Task 2 (priority 1)
```

---

## Top K Problems

### Top K Frequent Elements
```javascript
function topKFrequent(nums, k) {
  let freq = {};
  for (let num of nums) {
    freq[num] = (freq[num] || 0) + 1;
  }

  let heap = new MinHeap();

  for (let [num, count] of Object.entries(freq)) {
    heap.insert({ num, count });
    if (heap.size() > k) {
      heap.extractMin();
    }
  }

  return heap.heap.map(item => item.num);
}
```

---

## VahanHelp Example: Car Recommendations

```javascript
class CarRecommendationSystem {
  constructor() {
    this.heap = new MinHeap();
  }

  addCar(car, score) {
    this.heap.insert({ car, score });
  }

  getTopK(k) {
    let recommendations = [];

    for (let i = 0; i < k && this.heap.size() > 0; i++) {
      recommendations.push(this.heap.extractMin().car);
    }

    return recommendations;
  }
}
```

---

## Practice Problems

### Easy
1. Kth largest element
2. Last stone weight
3. Merge K sorted lists
4. Find median from data stream

**Next Lesson**: [13-graphs-basics.md](13-graphs-basics.md)
