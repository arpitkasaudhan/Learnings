# Lesson 13: Graphs Basics

## What is a Graph?

**Graph**: Nodes (vertices) connected by edges.

**Types**:
- **Directed**: Edges have direction (A → B)
- **Undirected**: Edges are bidirectional (A — B)
- **Weighted**: Edges have weights
- **Unweighted**: All edges equal

---

## Graph Representation

### 1. Adjacency List (Most Common)
```javascript
let graph = {
  'A': ['B', 'C'],
  'B': ['A', 'D'],
  'C': ['A', 'D'],
  'D': ['B', 'C']
};
```

### 2. Adjacency Matrix
```javascript
let matrix = [
  [0, 1, 1, 0],  // A
  [1, 0, 0, 1],  // B
  [1, 0, 0, 1],  // C
  [0, 1, 1, 0]   // D
];
```

---

## Graph Traversals

### 1. BFS (Breadth-First Search)
```javascript
function bfs(graph, start) {
  let visited = new Set();
  let queue = [start];
  let result = [];

  visited.add(start);

  while (queue.length > 0) {
    let node = queue.shift();
    result.push(node);

    for (let neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return result;
}

console.log(bfs(graph, 'A'));  // ['A', 'B', 'C', 'D']
```

**Time**: O(V + E)
**Space**: O(V)

### 2. DFS (Depth-First Search)
```javascript
function dfs(graph, start, visited = new Set(), result = []) {
  visited.add(start);
  result.push(start);

  for (let neighbor of graph[start]) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited, result);
    }
  }

  return result;
}

console.log(dfs(graph, 'A'));  // ['A', 'B', 'D', 'C']
```

---

## Common Graph Problems

### Problem 1: Number of Islands
```javascript
function numIslands(grid) {
  let count = 0;

  function dfs(i, j) {
    if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length || grid[i][j] === '0') {
      return;
    }

    grid[i][j] = '0';  // Mark as visited

    dfs(i + 1, j);
    dfs(i - 1, j);
    dfs(i, j + 1);
    dfs(i, j - 1);
  }

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === '1') {
        count++;
        dfs(i, j);
      }
    }
  }

  return count;
}
```

### Problem 2: Has Path
```javascript
function hasPath(graph, start, end, visited = new Set()) {
  if (start === end) return true;
  if (visited.has(start)) return false;

  visited.add(start);

  for (let neighbor of graph[start]) {
    if (hasPath(graph, neighbor, end, visited)) {
      return true;
    }
  }

  return false;
}
```

---

## VahanHelp Example: Location Graph

```javascript
class LocationGraph {
  constructor() {
    this.graph = {};
  }

  addLocation(location) {
    if (!this.graph[location]) {
      this.graph[location] = [];
    }
  }

  addConnection(loc1, loc2, distance) {
    this.graph[loc1].push({ location: loc2, distance });
    this.graph[loc2].push({ location: loc1, distance });
  }

  findNearbyLocations(location, maxDistance) {
    let queue = [{ location, distance: 0 }];
    let visited = new Set();
    let nearby = [];

    while (queue.length > 0) {
      let { location: current, distance } = queue.shift();

      if (visited.has(current)) continue;
      visited.add(current);

      if (distance <= maxDistance && current !== location) {
        nearby.push({ location: current, distance });
      }

      for (let neighbor of this.graph[current]) {
        if (!visited.has(neighbor.location)) {
          queue.push({
            location: neighbor.location,
            distance: distance + neighbor.distance
          });
        }
      }
    }

    return nearby;
  }
}
```

---

## Practice Problems

### Easy
1. Find if path exists
2. Clone graph
3. All paths from source to target
4. Number of provinces

### Medium
1. Course schedule
2. Number of islands
3. Surrounded regions
4. Pacific Atlantic water flow

**Next Lesson**: [14-advanced-graphs.md](14-advanced-graphs.md)
