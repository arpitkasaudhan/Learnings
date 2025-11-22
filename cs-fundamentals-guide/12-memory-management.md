# Lesson 12: Memory Management in JavaScript

## JavaScript Memory Model

JavaScript uses **automatic memory management** (garbage collection), but understanding how it works helps prevent memory leaks and optimize performance.

### Memory Lifecycle

```
1. Allocation  → Memory is allocated when variables/objects are created
2. Use         → Memory is used (read/write)
3. Release     → Memory is freed when no longer needed (garbage collection)
```

### Stack vs Heap

JavaScript uses two memory areas: Stack and Heap.

#### Stack Memory

**Stack** stores:
- Primitive values (numbers, strings, booleans, null, undefined)
- Function execution contexts
- Variable references

```javascript
// Stored in stack
let age = 30;              // Number: 30
let name = "John";         // Reference to string in heap
let isActive = true;       // Boolean: true
let nothing = null;        // null
let notDefined;            // undefined

// Stack frame for function call
function add(a, b) {       // Parameters stored in stack
  let result = a + b;      // Local variable in stack
  return result;
}
```

**Stack Characteristics**:
- **Fast** access (LIFO - Last In, First Out)
- **Fixed size** per variable
- **Automatic** cleanup (when function exits)
- **Limited size** (~1MB per call stack)

#### Heap Memory

**Heap** stores:
- Objects
- Arrays
- Functions
- Closures

```javascript
// Stored in heap, reference in stack
let user = {               // Object in heap
  name: "John",
  age: 30,
  address: {
    city: "New York"
  }
};

let numbers = [1, 2, 3, 4, 5];  // Array in heap

let greet = function() {        // Function in heap
  console.log("Hello");
};
```

**Heap Characteristics**:
- **Slower** access (dynamic allocation)
- **Variable size**
- **Manual cleanup** (garbage collection)
- **Large size** (limited by system memory)

### Stack vs Heap Example

```javascript
// Stack                           Heap
// -----                           ----
let age = 30;                   // age: 30
let name = "John";              // name → "John" (string object)

let user = {                    // user → Object {
  name: "John",                 //   name → "John"
  age: 30                       //   age: 30
};                              // }

let numbers = [1, 2, 3];        // numbers → Array [1, 2, 3]

// Copying primitives (stack)
let x = 10;
let y = x;        // y gets COPY of value
x = 20;
console.log(y);   // 10 (unchanged)

// Copying objects (heap)
let obj1 = { value: 10 };
let obj2 = obj1;  // obj2 gets REFERENCE to same object
obj1.value = 20;
console.log(obj2.value);  // 20 (same object!)
```

## Garbage Collection

**Garbage Collection (GC)** automatically frees memory that is no longer reachable.

### Reachability

Memory is kept if it's "reachable":

```javascript
// Reachable (won't be garbage collected)
let user = { name: "John" };    // Reachable from global variable

function greet() {
  let message = "Hello";        // Reachable while function executes
  console.log(message);
}

// Unreachable (will be garbage collected)
let obj = { data: "important" };
obj = null;  // Object is now unreachable → GC will collect it
```

**Roots** (always reachable):
- Global variables
- Currently executing function and its local variables
- Other functions in call stack
- DOM elements

### Mark-and-Sweep Algorithm

Most modern JavaScript engines use **Mark-and-Sweep**.

```
Phase 1: Mark
  1. Start from roots
  2. Mark all reachable objects
  3. Recursively mark objects referenced by marked objects

Phase 2: Sweep
  1. Scan heap
  2. Free memory of unmarked objects
```

**Example**:
```javascript
let obj1 = { name: "Object 1" };
let obj2 = { name: "Object 2", ref: obj1 };
let obj3 = { name: "Object 3" };

obj3 = null;  // Object 3 is unreachable

// Mark phase:
// - obj1: MARKED (referenced by obj2)
// - obj2: MARKED (referenced by variable)
// - obj3: NOT MARKED (unreachable)

// Sweep phase:
// - obj3 is freed
```

### Generational Garbage Collection

JavaScript engines use **generational GC** - objects are divided by age.

```
Young Generation (New objects):
- Most objects die young
- Frequent, fast GC
- Small memory area

Old Generation (Long-lived objects):
- Survived multiple GC cycles
- Infrequent, slower GC
- Larger memory area
```

**Process**:
```javascript
// New object → Young generation
let user = { name: "John" };

// After surviving several GCs → Promoted to old generation
// (e.g., global variables, long-lived objects)

// Benefits:
// - Fast GC for short-lived objects
// - Efficient memory usage
```

### V8 Garbage Collection

Chrome/Node.js use V8 engine with multiple GC strategies:

**1. Scavenge (Minor GC)**:
- Runs on young generation
- Very fast (~1ms)
- Happens frequently

**2. Mark-Sweep-Compact (Major GC)**:
- Runs on old generation
- Slower (~100ms+)
- Happens less frequently
- Compacts memory (removes fragmentation)

**3. Incremental Marking**:
- Breaks GC into small chunks
- Prevents long pauses
- Runs concurrently with JavaScript

## Memory Leaks

### What is a Memory Leak?

Memory that is **no longer needed** but **not released** (still reachable).

```javascript
// Leak: Memory grows over time but is not used
let leakedData = [];
setInterval(() => {
  leakedData.push(new Array(1000000));  // Adds 1M items every second
  // Never cleared → Memory keeps growing!
}, 1000);
```

### Common Memory Leak Patterns

#### 1. Forgotten Timers

```javascript
// BAD: Timer keeps running
function startPolling() {
  setInterval(() => {
    fetchData();  // Runs forever
  }, 1000);
}

startPolling();
// Timer never cleared → Memory leak

// GOOD: Clear timer when done
function startPolling() {
  const timerId = setInterval(() => {
    fetchData();
  }, 1000);

  // Return cleanup function
  return () => clearInterval(timerId);
}

const stopPolling = startPolling();
// Later: stopPolling();  // Clear timer
```

**React Example**:
```javascript
// BAD
function BadComponent() {
  useEffect(() => {
    setInterval(() => {
      console.log('Still running!');
    }, 1000);
    // No cleanup → Timer runs even after component unmounts
  }, []);

  return <div>Component</div>;
}

// GOOD
function GoodComponent() {
  useEffect(() => {
    const timerId = setInterval(() => {
      console.log('Running');
    }, 1000);

    // Cleanup function
    return () => clearInterval(timerId);
  }, []);

  return <div>Component</div>;
}
```

#### 2. Event Listeners

```javascript
// BAD: Event listeners not removed
function attachListener() {
  const button = document.getElementById('myButton');
  button.addEventListener('click', handleClick);
  // Listener never removed → Memory leak if element removed
}

// GOOD: Remove listeners
function attachListener() {
  const button = document.getElementById('myButton');

  function handleClick() {
    console.log('Clicked');
  }

  button.addEventListener('click', handleClick);

  // Return cleanup function
  return () => {
    button.removeEventListener('click', handleClick);
  };
}

const cleanup = attachListener();
// Later: cleanup();
```

**React Example**:
```javascript
// GOOD
function GoodComponent() {
  useEffect(() => {
    function handleResize() {
      console.log('Window resized');
    }

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div>Component</div>;
}
```

#### 3. Closures Retaining Large Objects

```javascript
// BAD: Closure holds reference to large object
function processData() {
  const largeData = new Array(1000000).fill('data');  // Large array

  return function() {
    // Only need length, but entire array is kept in memory
    console.log(largeData.length);
  };
}

const fn = processData();
// largeData is kept in memory because of closure

// GOOD: Only keep what's needed
function processData() {
  const largeData = new Array(1000000).fill('data');
  const length = largeData.length;  // Extract only needed value

  return function() {
    console.log(length);  // Only keeps number, not entire array
  };
}
```

#### 4. Detached DOM Nodes

```javascript
// BAD: DOM element removed but still referenced
let detachedDiv = document.getElementById('myDiv');
detachedDiv.remove();  // Removed from DOM
// But detachedDiv still references it → Memory leak

// GOOD: Clear reference
let div = document.getElementById('myDiv');
div.remove();
div = null;  // Clear reference

// BETTER: Don't store DOM references
function updateElement() {
  const div = document.getElementById('myDiv');
  div.textContent = 'Updated';
  // div goes out of scope → Can be garbage collected
}
```

**React Example**:
```javascript
// BAD
function BadComponent() {
  const divRef = useRef(null);

  useEffect(() => {
    // Storing DOM reference that might be removed
    const element = divRef.current;

    return () => {
      // element still referenced → Leak if component unmounts
      console.log(element);
    };
  }, []);

  return <div ref={divRef}>Content</div>;
}

// GOOD
function GoodComponent() {
  const divRef = useRef(null);

  useEffect(() => {
    const element = divRef.current;

    function handleClick() {
      console.log('Clicked');
    }

    element?.addEventListener('click', handleClick);

    return () => {
      element?.removeEventListener('click', handleClick);
      // No lingering reference
    };
  }, []);

  return <div ref={divRef}>Content</div>;
}
```

#### 5. Global Variables

```javascript
// BAD: Accidental global
function createUser() {
  // Forgot 'let/const' → Creates global variable
  user = { name: "John", data: new Array(1000000) };
}

createUser();
// user is global → Never garbage collected

// GOOD: Use strict mode + proper declarations
'use strict';

function createUser() {
  const user = { name: "John", data: new Array(1000000) };
  return user;
}

const user = createUser();
// user can be garbage collected when no longer referenced
```

#### 6. Caches Without Limits

```javascript
// BAD: Cache grows forever
const cache = {};

function getData(key) {
  if (cache[key]) {
    return cache[key];
  }

  const data = fetchData(key);
  cache[key] = data;  // Never cleared → Grows forever
  return data;
}

// GOOD: Use Map with size limit
const cache = new Map();
const MAX_CACHE_SIZE = 100;

function getData(key) {
  if (cache.has(key)) {
    return cache.get(key);
  }

  const data = fetchData(key);

  // Clear oldest entry if cache full
  if (cache.size >= MAX_CACHE_SIZE) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }

  cache.set(key, data);
  return data;
}

// BETTER: Use WeakMap (auto-cleared when key is GC'd)
const cache = new WeakMap();

function getData(obj) {
  if (cache.has(obj)) {
    return cache.get(obj);
  }

  const data = fetchData(obj);
  cache.set(obj, data);  // Auto-cleared when obj is GC'd
  return data;
}
```

#### 7. Circular References

```javascript
// Old browsers (IE) had issues with circular references
// Modern browsers handle this correctly with mark-and-sweep

// Circular reference (no leak in modern browsers)
let obj1 = {};
let obj2 = {};
obj1.ref = obj2;
obj2.ref = obj1;

obj1 = null;
obj2 = null;
// Both are garbage collected (no external references)

// But be careful with DOM + JS circular references in old browsers
// Modern browsers handle this fine
```

## Memory Profiling in Chrome DevTools

### 1. Performance Monitor

```
1. F12 → Open DevTools
2. Ctrl+Shift+P → "Show Performance Monitor"
3. Watch:
   - JS Heap Size (should be stable)
   - DOM Nodes (should not grow indefinitely)
   - Event Listeners (should not accumulate)
```

### 2. Memory Profiler

```
1. F12 → Memory Tab
2. Take Heap Snapshot
3. Perform action (e.g., open/close modal)
4. Take another snapshot
5. Compare:
   - Look for objects that should be gone but aren't
   - Check "Detached DOM tree" (memory leak!)
```

**Example Workflow**:
```
1. Take snapshot: "Baseline"
2. Open modal → Close modal
3. Take snapshot: "After close"
4. Compare "Baseline" vs "After close"
5. If heap size increased significantly:
   → Memory leak! Investigate which objects weren't freed
```

### 3. Allocation Timeline

```
1. Memory Tab → Allocation instrumentation on timeline
2. Click "Record"
3. Perform actions
4. Stop recording
5. Blue bars = allocations
   Gray bars = garbage collected
6. Look for blue bars that stay blue (not GC'd)
```

### 4. Finding Memory Leaks

**Look for**:
- **Detached DOM trees**: Elements removed from DOM but still in memory
- **Event listeners**: Too many or not cleaned up
- **Large arrays/objects**: Growing without bounds
- **Timers/intervals**: Still running after component unmount

**Example**:
```javascript
// Suspected leak in this code:
function MyComponent() {
  useEffect(() => {
    const data = [];
    const interval = setInterval(() => {
      data.push(new Array(10000));
      console.log('Data size:', data.length);
    }, 100);

    // PROBLEM: No cleanup!
    // Fix: return () => clearInterval(interval);
  }, []);
}

// How to detect:
// 1. Open Performance Monitor
// 2. Watch JS Heap Size
// 3. Render component
// 4. See heap growing continuously → LEAK!
```

## Best Practices to Prevent Memory Leaks

### 1. Clean Up Effects

```javascript
// Always clean up in useEffect
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  const listener = () => {};
  window.addEventListener('resize', listener);

  return () => {
    clearInterval(timer);
    window.removeEventListener('resize', listener);
  };
}, []);
```

### 2. Avoid Unnecessary Closures

```javascript
// BAD: Each click creates new closure
button.addEventListener('click', function() {
  const largeData = fetchLargeData();
  console.log(largeData);
});

// GOOD: Define function once
function handleClick() {
  const largeData = fetchLargeData();
  console.log(largeData);
}
button.addEventListener('click', handleClick);
```

### 3. Use WeakMap/WeakSet for Metadata

```javascript
// BAD: Regular Map prevents GC
const metadata = new Map();
let obj = { data: 'important' };
metadata.set(obj, { created: Date.now() });
obj = null;  // Object still in Map → Not GC'd

// GOOD: WeakMap allows GC
const metadata = new WeakMap();
let obj = { data: 'important' };
metadata.set(obj, { created: Date.now() });
obj = null;  // Object can be GC'd (WeakMap doesn't prevent it)
```

### 4. Limit Cache Size

```javascript
// LRU Cache implementation
class LRUCache {
  constructor(maxSize) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return null;

    // Move to end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key, value) {
    // Remove if exists (will re-add at end)
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Remove oldest if full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, value);
  }
}
```

### 5. Nullify Large Objects When Done

```javascript
// GOOD: Clear reference to large object
async function processLargeFile(file) {
  let data = await file.arrayBuffer();  // Large buffer

  // Process data...
  const result = processData(data);

  data = null;  // Clear reference (can be GC'd)

  return result;
}
```

### 6. Use Object Pools for Frequent Allocations

```javascript
// Object pool for game entities
class ObjectPool {
  constructor(createFn, maxSize = 100) {
    this.createFn = createFn;
    this.pool = [];
    this.maxSize = maxSize;
  }

  acquire() {
    return this.pool.pop() || this.createFn();
  }

  release(obj) {
    if (this.pool.length < this.maxSize) {
      // Reset object state
      obj.reset();
      this.pool.push(obj);
    }
  }
}

// Usage
const bulletPool = new ObjectPool(() => new Bullet(), 50);

// Instead of: new Bullet() every frame
// Use: bulletPool.acquire()
const bullet = bulletPool.acquire();
// ... use bullet
bulletPool.release(bullet);  // Reuse instead of GC
```

## Memory Optimization Tips

### 1. Lazy Loading

```javascript
// Load large modules only when needed
const modal = document.getElementById('modal');

modal.addEventListener('open', async () => {
  // Load chart library only when modal opens
  const Chart = await import('chart.js');
  renderChart(Chart);
});
```

### 2. Pagination/Virtualization

```javascript
// Instead of rendering 10,000 items:
function renderAllItems() {
  return items.map(item => <Item key={item.id} data={item} />);
}

// Render only visible items (virtual scrolling):
function VirtualList({ items }) {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 50 });

  return (
    <div onScroll={handleScroll}>
      {items.slice(visibleRange.start, visibleRange.end).map(item => (
        <Item key={item.id} data={item} />
      ))}
    </div>
  );
}
```

### 3. Debounce/Throttle Event Handlers

```javascript
// Prevents creating too many objects from frequent events
function handleSearch(query) {
  // Heavy operation
  const results = searchDatabase(query);
  renderResults(results);
}

// Debounce: Wait for user to stop typing
const debouncedSearch = debounce(handleSearch, 300);
input.addEventListener('input', (e) => debouncedSearch(e.target.value));

// Throttle: Run at most once per interval
const throttledScroll = throttle(handleScroll, 100);
window.addEventListener('scroll', throttledScroll);
```

## Key Takeaways

1. **Stack** stores primitives and references, **Heap** stores objects
2. **Garbage Collection** automatically frees unreachable memory
3. **Memory leaks** happen when memory is reachable but not used
4. **Common leaks**: Timers, event listeners, closures, detached DOM
5. **Chrome DevTools** help find and fix memory leaks
6. **Clean up** effects, listeners, and timers properly
7. **WeakMap/WeakSet** for metadata that shouldn't prevent GC

## Exercises

### Exercise 1: Find the Leak

Identify memory leaks in this code:
```javascript
function setupPage() {
  const data = [];

  setInterval(() => {
    data.push(new Array(10000));
  }, 100);

  const button = document.getElementById('btn');
  button.addEventListener('click', () => {
    console.log('Clicked', data.length);
  });
}

setupPage();
```

### Exercise 2: Fix the Component

Fix memory leaks:
```javascript
function MyComponent() {
  const [data, setData] = useState([]);

  useEffect(() => {
    setInterval(() => {
      setData(prev => [...prev, Date.now()]);
    }, 1000);
  }, []);

  return <div>{data.length}</div>;
}
```

## Next Steps

In [Lesson 13: Storage Best Practices](./13-storage-best-practices.md), we'll learn:
- When to use each storage type
- Security considerations
- Performance optimization
- Storage quotas

---

**Practice**: Use Chrome DevTools to profile memory usage in your application!
