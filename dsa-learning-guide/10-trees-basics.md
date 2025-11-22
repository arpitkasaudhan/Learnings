# Lesson 10: Trees Basics

## What is a Tree?

A **tree** is a hierarchical data structure with nodes connected by edges.

**Terminology**:
- **Root**: Top node
- **Parent/Child**: Node relationships
- **Leaf**: Node with no children
- **Height**: Longest path from root to leaf
- **Depth**: Distance from root to node

```
        10
       /  \
      5    15
     / \     \
    3   7    20
```

---

## Binary Tree

Each node has at most 2 children.

```javascript
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

// Create tree
let root = new TreeNode(10);
root.left = new TreeNode(5);
root.right = new TreeNode(15);
root.left.left = new TreeNode(3);
root.left.right = new TreeNode(7);
```

---

## Tree Traversals

### 1. Inorder (Left, Root, Right)
```javascript
function inorder(root, result = []) {
  if (!root) return result;

  inorder(root.left, result);
  result.push(root.value);
  inorder(root.right, result);

  return result;
}

// Output: [3, 5, 7, 10, 15, 20]
```

### 2. Preorder (Root, Left, Right)
```javascript
function preorder(root, result = []) {
  if (!root) return result;

  result.push(root.value);
  preorder(root.left, result);
  preorder(root.right, result);

  return result;
}

// Output: [10, 5, 3, 7, 15, 20]
```

### 3. Postorder (Left, Right, Root)
```javascript
function postorder(root, result = []) {
  if (!root) return result;

  postorder(root.left, result);
  postorder(root.right, result);
  result.push(root.value);

  return result;
}

// Output: [3, 7, 5, 20, 15, 10]
```

### 4. Level Order (BFS)
```javascript
function levelOrder(root) {
  if (!root) return [];

  let result = [];
  let queue = [root];

  while (queue.length > 0) {
    let level = [];
    let levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      let node = queue.shift();
      level.push(node.value);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(level);
  }

  return result;
}

// Output: [[10], [5, 15], [3, 7, 20]]
```

---

## Common Tree Problems

### Problem 1: Maximum Depth
```javascript
function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
```

### Problem 2: Minimum Depth
```javascript
function minDepth(root) {
  if (!root) return 0;
  if (!root.left) return 1 + minDepth(root.right);
  if (!root.right) return 1 + minDepth(root.left);
  return 1 + Math.min(minDepth(root.left), minDepth(root.right));
}
```

### Problem 3: Check if Same Tree
```javascript
function isSameTree(p, q) {
  if (!p && !q) return true;
  if (!p || !q) return false;
  if (p.value !== q.value) return false;

  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}
```

### Problem 4: Check if Symmetric
```javascript
function isSymmetric(root) {
  function isMirror(left, right) {
    if (!left && !right) return true;
    if (!left || !right) return false;

    return left.value === right.value &&
           isMirror(left.left, right.right) &&
           isMirror(left.right, right.left);
  }

  return isMirror(root.left, root.right);
}
```

---

## VahanHelp Example: Category Tree

```javascript
class CategoryTree {
  constructor(name) {
    this.name = name;
    this.children = [];
  }

  addChild(category) {
    this.children.push(category);
  }

  // Find category
  find(name) {
    if (this.name === name) return this;

    for (let child of this.children) {
      let found = child.find(name);
      if (found) return found;
    }

    return null;
  }

  // Count all categories
  count() {
    let total = 1;
    for (let child of this.children) {
      total += child.count();
    }
    return total;
  }
}

// Build category tree
let vehicles = new CategoryTree("Vehicles");
let cars = new CategoryTree("Cars");
let bikes = new CategoryTree("Bikes");

cars.addChild(new CategoryTree("Sedan"));
cars.addChild(new CategoryTree("SUV"));

vehicles.addChild(cars);
vehicles.addChild(bikes);
```

---

## Practice Problems

### Easy
1. Invert binary tree
2. Count nodes
3. Sum of all nodes
4. Diameter of tree
5. Path sum

### Medium
1. Binary tree right side view
2. Lowest common ancestor
3. Validate BST
4. Flatten tree to linked list
5. Construct tree from traversals

---

## Key Takeaways

✅ **Tree**: Hierarchical structure
✅ **Binary tree**: Max 2 children per node
✅ **Traversals**: Inorder, Preorder, Postorder, Level order
✅ **Recursion**: Natural fit for trees

**Next Lesson**: [11-binary-search-trees.md](11-binary-search-trees.md)
