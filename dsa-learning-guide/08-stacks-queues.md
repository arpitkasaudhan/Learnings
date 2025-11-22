# Lesson 08: Stacks & Queues

## Stack - LIFO (Last In First Out)

**Analogy**: Stack of plates - add/remove from top only.

### Implementation

```javascript
class Stack {
  constructor() {
    this.items = [];
  }

  push(element) {
    this.items.push(element);
  }

  pop() {
    if (this.isEmpty()) return null;
    return this.items.pop();
  }

  peek() {
    if (this.isEmpty()) return null;
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  clear() {
    this.items = [];
  }
}

// Usage
let stack = new Stack();
stack.push(10);
stack.push(20);
stack.push(30);
console.log(stack.pop());   // 30
console.log(stack.peek());  // 20
```

**Time Complexity**: All operations O(1)

### Stack Applications

**1. Undo/Redo Operations**
```javascript
class TextEditor {
  constructor() {
    this.undoStack = new Stack();
    this.redoStack = new Stack();
    this.currentText = "";
  }

  type(text) {
    this.undoStack.push(this.currentText);
    this.currentText += text;
    this.redoStack.clear();
  }

  undo() {
    if (!this.undoStack.isEmpty()) {
      this.redoStack.push(this.currentText);
      this.currentText = this.undoStack.pop();
    }
  }

  redo() {
    if (!this.redoStack.isEmpty()) {
      this.undoStack.push(this.currentText);
      this.currentText = this.redoStack.pop();
    }
  }
}
```

**2. Valid Parentheses**
```javascript
function isValidParentheses(s) {
  let stack = [];
  let pairs = { '(': ')', '{': '}', '[': ']' };

  for (let char of s) {
    if (char in pairs) {
      stack.push(char);
    } else {
      let last = stack.pop();
      if (pairs[last] !== char) return false;
    }
  }

  return stack.length === 0;
}

console.log(isValidParentheses("()[]{}"));  // true
console.log(isValidParentheses("([)]"));    // false
```

**3. Evaluate Postfix Expression**
```javascript
function evaluatePostfix(expression) {
  let stack = [];
  let tokens = expression.split(' ');

  for (let token of tokens) {
    if (!isNaN(token)) {
      stack.push(Number(token));
    } else {
      let b = stack.pop();
      let a = stack.pop();

      switch(token) {
        case '+': stack.push(a + b); break;
        case '-': stack.push(a - b); break;
        case '*': stack.push(a * b); break;
        case '/': stack.push(a / b); break;
      }
    }
  }

  return stack.pop();
}

console.log(evaluatePostfix("2 3 + 4 *"));  // 20
```

---

## Queue - FIFO (First In First Out)

**Analogy**: Queue at ticket counter - first person served first.

### Implementation

```javascript
class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(element) {
    this.items.push(element);
  }

  dequeue() {
    if (this.isEmpty()) return null;
    return this.items.shift();
  }

  front() {
    if (this.isEmpty()) return null;
    return this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }
}

// Usage
let queue = new Queue();
queue.enqueue(10);
queue.enqueue(20);
queue.enqueue(30);
console.log(queue.dequeue());  // 10
console.log(queue.front());    // 20
```

**Note**: `shift()` is O(n). For better performance, use circular queue or linked list.

### Efficient Queue (Using Linked List)

```javascript
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class QueueLinkedList {
  constructor() {
    this.front = null;
    this.rear = null;
    this.size = 0;
  }

  enqueue(data) {
    let newNode = new Node(data);

    if (this.rear === null) {
      this.front = this.rear = newNode;
    } else {
      this.rear.next = newNode;
      this.rear = newNode;
    }

    this.size++;
  }

  dequeue() {
    if (this.front === null) return null;

    let data = this.front.data;
    this.front = this.front.next;

    if (this.front === null) {
      this.rear = null;
    }

    this.size--;
    return data;
  }
}
```

**Time Complexity**: All operations O(1)

---

## Deque (Double-Ended Queue)

Can insert/remove from both ends.

```javascript
class Deque {
  constructor() {
    this.items = [];
  }

  addFront(element) {
    this.items.unshift(element);
  }

  addRear(element) {
    this.items.push(element);
  }

  removeFront() {
    return this.items.shift();
  }

  removeRear() {
    return this.items.pop();
  }

  getFront() {
    return this.items[0];
  }

  getRear() {
    return this.items[this.items.length - 1];
  }
}
```

---

## VahanHelp Real-World Examples

### Request Queue

```javascript
class RequestQueue {
  constructor() {
    this.queue = new Queue();
  }

  addRequest(carId, userId) {
    this.queue.enqueue({ carId, userId, timestamp: Date.now() });
  }

  processRequest() {
    return this.queue.dequeue();
  }
}
```

### Browser History (Stack)

```javascript
class BrowserHistory {
  constructor() {
    this.backStack = new Stack();
    this.forwardStack = new Stack();
    this.current = null;
  }

  visit(url) {
    if (this.current) {
      this.backStack.push(this.current);
    }
    this.current = url;
    this.forwardStack.clear();
  }

  back() {
    if (!this.backStack.isEmpty()) {
      this.forwardStack.push(this.current);
      this.current = this.backStack.pop();
    }
  }

  forward() {
    if (!this.forwardStack.isEmpty()) {
      this.backStack.push(this.current);
      this.current = this.forwardStack.pop();
    }
  }
}
```

---

## Practice Problems

### Easy
1. Implement stack using queues
2. Implement queue using stacks
3. Min stack
4. Next greater element
5. Baseball game

### Medium
1. Sliding window maximum
2. Daily temperatures
3. Decode string
4. Asteroid collision
5. Design circular queue

---

## Key Takeaways

✅ **Stack**: LIFO, push/pop from same end
✅ **Queue**: FIFO, enqueue/dequeue from opposite ends
✅ **Applications**: Undo/redo, parentheses matching, BFS
✅ **Linked list** implementation for O(1) queue operations

**Next Lesson**: [09-hashing.md](09-hashing.md)
