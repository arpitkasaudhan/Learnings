# Lesson 07: Linked Lists

## What is a Linked List?

A **linked list** is a linear data structure where elements are stored in nodes, and each node points to the next node.

**Array vs Linked List**:
```
Array:     [10][20][30][40]  (Contiguous memory)

Linked List:
[10|•]-->[20|•]-->[30|•]-->[40|null]
(Nodes scattered in memory, connected by pointers)
```

---

## Types of Linked Lists

### 1. Singly Linked List
Each node points to next node.

```javascript
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  // Insert at beginning - O(1)
  insertAtBeginning(data) {
    let newNode = new Node(data);
    newNode.next = this.head;
    this.head = newNode;
    this.size++;
  }

  // Insert at end - O(n)
  insertAtEnd(data) {
    let newNode = new Node(data);

    if (!this.head) {
      this.head = newNode;
      this.size++;
      return;
    }

    let current = this.head;
    while (current.next) {
      current = current.next;
    }

    current.next = newNode;
    this.size++;
  }

  // Delete node - O(n)
  delete(data) {
    if (!this.head) return;

    if (this.head.data === data) {
      this.head = this.head.next;
      this.size--;
      return;
    }

    let current = this.head;
    while (current.next) {
      if (current.next.data === data) {
        current.next = current.next.next;
        this.size--;
        return;
      }
      current = current.next;
    }
  }

  // Search - O(n)
  search(data) {
    let current = this.head;
    while (current) {
      if (current.data === data) return true;
      current = current.next;
    }
    return false;
  }

  // Print list
  print() {
    let current = this.head;
    let result = [];

    while (current) {
      result.push(current.data);
      current = current.next;
    }

    console.log(result.join(' -> '));
  }
}

// Usage
let list = new LinkedList();
list.insertAtEnd(10);
list.insertAtEnd(20);
list.insertAtEnd(30);
list.print();  // 10 -> 20 -> 30
```

### 2. Doubly Linked List
Each node has pointers to both next and previous nodes.

```javascript
class DoublyNode {
  constructor(data) {
    this.data = data;
    this.next = null;
    this.prev = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  // Insert at beginning - O(1)
  insertAtBeginning(data) {
    let newNode = new DoublyNode(data);

    if (!this.head) {
      this.head = this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }

    this.size++;
  }

  // Insert at end - O(1) due to tail pointer!
  insertAtEnd(data) {
    let newNode = new DoublyNode(data);

    if (!this.tail) {
      this.head = this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }

    this.size++;
  }

  // Delete node - O(n)
  delete(data) {
    let current = this.head;

    while (current) {
      if (current.data === data) {
        if (current.prev) {
          current.prev.next = current.next;
        } else {
          this.head = current.next;
        }

        if (current.next) {
          current.next.prev = current.prev;
        } else {
          this.tail = current.prev;
        }

        this.size--;
        return;
      }

      current = current.next;
    }
  }
}
```

### 3. Circular Linked List
Last node points back to first node.

```javascript
class CircularLinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  insertAtEnd(data) {
    let newNode = new Node(data);

    if (!this.head) {
      this.head = newNode;
      newNode.next = this.head;  // Point to itself
    } else {
      let current = this.head;

      while (current.next !== this.head) {
        current = current.next;
      }

      current.next = newNode;
      newNode.next = this.head;
    }

    this.size++;
  }
}
```

---

## Time Complexity Comparison

```
Operation          | Array | Singly LL | Doubly LL
───────────────────────────────────────────────────
Access by index    | O(1)  | O(n)      | O(n)
Search             | O(n)  | O(n)      | O(n)
Insert at start    | O(n)  | O(1)      | O(1)
Insert at end      | O(1)  | O(n)      | O(1)*
Delete at start    | O(n)  | O(1)      | O(1)
Delete at end      | O(1)  | O(n)      | O(1)*
```
*With tail pointer

---

## Common Linked List Problems

### Problem 1: Reverse Linked List

```javascript
function reverseList(head) {
  let prev = null;
  let current = head;

  while (current) {
    let next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }

  return prev;  // New head
}

// Recursive version
function reverseListRecursive(head) {
  if (!head || !head.next) return head;

  let newHead = reverseListRecursive(head.next);
  head.next.next = head;
  head.next = null;

  return newHead;
}
```

### Problem 2: Detect Cycle (Floyd's Algorithm)

```javascript
function hasCycle(head) {
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;

    if (slow === fast) {
      return true;  // Cycle detected
    }
  }

  return false;
}
```

### Problem 3: Find Middle Element

```javascript
function findMiddle(head) {
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  return slow;  // Middle node
}
```

### Problem 4: Merge Two Sorted Lists

```javascript
function mergeSortedLists(l1, l2) {
  let dummy = new Node(0);
  let current = dummy;

  while (l1 && l2) {
    if (l1.data < l2.data) {
      current.next = l1;
      l1 = l1.next;
    } else {
      current.next = l2;
      l2 = l2.next;
    }
    current = current.next;
  }

  current.next = l1 || l2;
  return dummy.next;
}
```

### Problem 5: Remove Nth Node from End

```javascript
function removeNthFromEnd(head, n) {
  let dummy = new Node(0);
  dummy.next = head;

  let fast = dummy;
  let slow = dummy;

  // Move fast n+1 steps ahead
  for (let i = 0; i <= n; i++) {
    fast = fast.next;
  }

  // Move both until fast reaches end
  while (fast) {
    slow = slow.next;
    fast = fast.next;
  }

  // Remove node
  slow.next = slow.next.next;

  return dummy.next;
}
```

---

## Practice Problems

### Easy
1. Delete a node from linked list
2. Find length of linked list
3. Check if linked list is palindrome
4. Remove duplicates from sorted list
5. Intersection of two linked lists

### Medium
1. Add two numbers represented as linked lists
2. Flatten a multilevel linked list
3. Copy list with random pointer
4. Sort linked list
5. Reorder list

### Hard
1. Reverse nodes in k-group
2. Merge k sorted lists
3. LRU cache implementation
4. Clone a complex linked list
5. Find loop starting point

---

## Key Takeaways

✅ **Linked lists**: Dynamic size, efficient insertion/deletion
✅ **O(1)** insertion/deletion at beginning
✅ **O(n)** access by index (unlike arrays)
✅ **Two pointers**: Fast/slow for cycle detection, middle finding
✅ **Dummy node**: Simplifies edge cases
✅ **Space efficient**: No pre-allocation needed

**Next Lesson**: [08-stacks-queues.md](08-stacks-queues.md)
