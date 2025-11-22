# Lesson 14: Advanced Graphs

## Shortest Path Algorithms

### Dijkstra's Algorithm
```javascript
function dijkstra(graph, start) {
  let distances = {};
  let visited = new Set();
  let pq = new PriorityQueue();

  // Initialize distances
  for (let node in graph) {
    distances[node] = Infinity;
  }
  distances[start] = 0;
  pq.enqueue(start, 0);

  while (!pq.isEmpty()) {
    let { value: current } = pq.dequeue();

    if (visited.has(current)) continue;
    visited.add(current);

    for (let neighbor of graph[current]) {
      let newDist = distances[current] + neighbor.weight;

      if (newDist < distances[neighbor.node]) {
        distances[neighbor.node] = newDist;
        pq.enqueue(neighbor.node, newDist);
      }
    }
  }

  return distances;
}
```

---

## Topological Sort

```javascript
function topologicalSort(graph) {
  let visited = new Set();
  let stack = [];

  function dfs(node) {
    visited.add(node);

    for (let neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      }
    }

    stack.push(node);
  }

  for (let node in graph) {
    if (!visited.has(node)) {
      dfs(node);
    }
  }

  return stack.reverse();
}
```

---

## Detect Cycle

```javascript
function hasCycle(graph) {
  let visited = new Set();
  let recStack = new Set();

  function dfs(node) {
    visited.add(node);
    recStack.add(node);

    for (let neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (recStack.has(neighbor)) {
        return true;  // Cycle found
      }
    }

    recStack.delete(node);
    return false;
  }

  for (let node in graph) {
    if (!visited.has(node)) {
      if (dfs(node)) return true;
    }
  }

  return false;
}
```

---

**Next Lesson**: [15-dynamic-programming-basics.md](15-dynamic-programming-basics.md)
