# Lesson 11: Binary Search Trees (BST)

## What is a BST?

**Binary Search Tree**: Binary tree where:
- Left subtree < node
- Right subtree > node
- Both subtrees are also BSTs

```
        10
       /  \
      5    15
     / \     \
    3   7    20
```

---

## BST Operations

```javascript
class BSTNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BST {
  constructor() {
    this.root = null;
  }

  // Insert - O(log n) average, O(n) worst
  insert(value) {
    let newNode = new BSTNode(value);

    if (!this.root) {
      this.root = newNode;
      return this;
    }

    let current = this.root;

    while (true) {
      if (value < current.value) {
        if (!current.left) {
          current.left = newNode;
          return this;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          return this;
        }
        current = current.right;
      }
    }
  }

  // Search - O(log n) average
  search(value) {
    let current = this.root;

    while (current) {
      if (value === current.value) return true;
      if (value < current.value) current = current.left;
      else current = current.right;
    }

    return false;
  }

  // Find min value
  findMin(node = this.root) {
    while (node.left) {
      node = node.left;
    }
    return node.value;
  }

  // Find max value
  findMax(node = this.root) {
    while (node.right) {
      node = node.right;
    }
    return node.value;
  }

  // Delete node
  delete(value) {
    this.root = this.deleteNode(this.root, value);
  }

  deleteNode(node, value) {
    if (!node) return null;

    if (value < node.value) {
      node.left = this.deleteNode(node.left, value);
    } else if (value > node.value) {
      node.right = this.deleteNode(node.right, value);
    } else {
      // Node found
      // Case 1: No children
      if (!node.left && !node.right) return null;

      // Case 2: One child
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      // Case 3: Two children
      // Find min in right subtree
      let minRight = this.findMin(node.right);
      node.value = minRight;
      node.right = this.deleteNode(node.right, minRight);
    }

    return node;
  }
}

// Usage
let bst = new BST();
bst.insert(10);
bst.insert(5);
bst.insert(15);
bst.insert(3);
bst.insert(7);

console.log(bst.search(7));   // true
console.log(bst.search(20));  // false
```

---

## Validate BST

```javascript
function isValidBST(root, min = -Infinity, max = Infinity) {
  if (!root) return true;

  if (root.value <= min || root.value >= max) {
    return false;
  }

  return isValidBST(root.left, min, root.value) &&
         isValidBST(root.right, root.value, max);
}
```

---

## BST Traversal (Inorder = Sorted)

```javascript
function inorderTraversal(root) {
  let result = [];

  function traverse(node) {
    if (!node) return;

    traverse(node.left);
    result.push(node.value);
    traverse(node.right);
  }

  traverse(root);
  return result;  // Returns sorted array!
}

// [3, 5, 7, 10, 15, 20]
```

---

## Kth Smallest Element

```javascript
function kthSmallest(root, k) {
  let count = 0;
  let result = null;

  function inorder(node) {
    if (!node || result !== null) return;

    inorder(node.left);

    count++;
    if (count === k) {
      result = node.value;
      return;
    }

    inorder(node.right);
  }

  inorder(root);
  return result;
}
```

---

## Practice Problems

### Easy
1. Search in BST
2. Insert into BST
3. Delete node in BST
4. Minimum/Maximum value
5. Range sum of BST

### Medium
1. Validate BST
2. Kth smallest element
3. Lowest common ancestor in BST
4. Convert sorted array to BST
5. BST iterator

**Next Lesson**: [12-heaps-priority-queues.md](12-heaps-priority-queues.md)
