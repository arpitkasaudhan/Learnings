# Concurrency Models: Deep Dive

## What is Concurrency?

**Concurrency** = Dealing with multiple things at once (not necessarily at the SAME instant)

**Parallelism** = Doing multiple things at the SAME instant (requires multiple CPU cores)

```
Concurrency (Single Core CPU):
Time ──────────────────────────────────►
CPU:  [Task A][Task B][Task A][Task C][Task B]
      Rapidly switching between tasks

Parallelism (Multi-Core CPU):
Time ──────────────────────────────────►
Core 1: [Task A────────────────────────]
Core 2: [Task B────────────────────────]
Core 3: [Task C────────────────────────]
        Actually running simultaneously
```

## Node.js Event Loop (Detailed Explanation)

This is the most important concept for modern web development!

### The Event Loop Architecture

```
   ┌───────────────────────────┐
┌─>│           timers          │  setTimeout/setInterval callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │  I/O callbacks deferred to next loop
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │  Internal use only
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┘      └───────────────┘
│  │           check           │  setImmediate() callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │  socket.on('close', ...)
   └───────────────────────────┘
```

### Phase-by-Phase Breakdown

#### 1. Timers Phase
```javascript
setTimeout(() => {
  console.log('Timer executed!');
}, 100);

// Internally:
// - Event loop checks: "Has 100ms passed?"
// - If yes: execute callback
// - If no: skip to next phase
```

#### 2. Poll Phase (MOST IMPORTANT)
This is where most I/O happens!

```javascript
const fs = require('fs');

// Reading a file
fs.readFile('/data.txt', (err, data) => {
  console.log('File read!'); // This callback executes in poll phase
});

// Database query
db.query('SELECT * FROM users', (err, results) => {
  console.log('Query done!'); // This callback executes in poll phase
});
```

**What happens:**
```
1. Your code calls fs.readFile()
2. Node.js asks the OS to read the file
3. Node.js continues to next line (doesn't wait!)
4. OS reads file in background
5. OS notifies Node.js: "File ready!"
6. Event loop enters poll phase
7. Event loop executes the callback
```

#### 3. Check Phase
```javascript
setImmediate(() => {
  console.log('Immediate!');
});

// Executes in the check phase
// Runs after poll phase completes
```

### Real Example: Event Loop in Action

```javascript
console.log('1: Start');

setTimeout(() => {
  console.log('2: setTimeout');
}, 0);

setImmediate(() => {
  console.log('3: setImmediate');
});

fs.readFile('/file.txt', () => {
  console.log('4: File read');

  setTimeout(() => {
    console.log('5: setTimeout inside file read');
  }, 0);

  setImmediate(() => {
    console.log('6: setImmediate inside file read');
  });
});

console.log('7: End');
```

**Output (typical):**
```
1: Start
7: End
2: setTimeout
3: setImmediate
4: File read
6: setImmediate inside file read
5: setTimeout inside file read
```

**Why this order?**

```
Iteration 1:
┌────────────────────────────────────────┐
│ 1. Execute main script (sync code)    │
│    console.log('1: Start')             │
│    console.log('7: End')               │
│                                        │
│ 2. Timers phase                        │
│    setTimeout callback queued          │
│    console.log('2: setTimeout')        │
│                                        │
│ 3. Poll phase                          │
│    Waiting for file read...            │
│                                        │
│ 4. Check phase                         │
│    console.log('3: setImmediate')      │
└────────────────────────────────────────┘

Iteration 2 (file read completed):
┌────────────────────────────────────────┐
│ 1. Poll phase                          │
│    File ready! Execute callback        │
│    console.log('4: File read')         │
│    Schedule new setTimeout             │
│    Schedule new setImmediate           │
│                                        │
│ 2. Check phase (runs immediately)      │
│    console.log('6: setImmediate...')   │
└────────────────────────────────────────┘

Iteration 3:
┌────────────────────────────────────────┐
│ 1. Timers phase                        │
│    console.log('5: setTimeout...')     │
└────────────────────────────────────────┘
```

### How Node.js Handles 10,000 Concurrent Requests

```javascript
const express = require('express');
const app = express();

app.get('/user/:id', async (req, res) => {
  // Let's say 10,000 users hit this endpoint at once
  const user = await db.findById(req.params.id); // Takes 50ms
  res.json(user);
});
```

**Timeline:**

```
0ms:  Request 1 arrives → Start DB query 1 → Event loop continues
1ms:  Request 2 arrives → Start DB query 2 → Event loop continues
2ms:  Request 3 arrives → Start DB query 3 → Event loop continues
...
9999ms: Request 10000 arrives → Start DB query 10000

// Event loop is NOT blocked!
// All 10,000 queries are running in parallel (in the database)

50ms: DB query 1 completes → Send response 1
51ms: DB query 2 completes → Send response 2
52ms: DB query 3 completes → Send response 3
...
```

**Why it works:**
```javascript
// When you do this:
const user = await db.findById(req.params.id);

// Node.js actually does this:
db.findById(req.params.id).then(user => {
  // This callback is queued for later
  res.json(user);
});
// Returns immediately! Event loop continues!
```

## Multi-Threaded Model (Java/Tomcat)

### Thread Pool Architecture

```java
// Java servlet container
ThreadPoolExecutor threadPool = new ThreadPoolExecutor(
    10,     // core pool size
    100,    // maximum pool size
    60,     // keep-alive time
    TimeUnit.SECONDS,
    new LinkedBlockingQueue<Runnable>()
);

// When request arrives:
threadPool.execute(() -> {
    handleRequest(request, response);
});
```

**How it handles requests:**

```
Main Thread (accepts connections)
│
├─► Thread 1 ──► Request A ──► DB query (blocks thread) ──► Response A
│
├─► Thread 2 ──► Request B ──► DB query (blocks thread) ──► Response B
│
├─► Thread 3 ──► Request C ──► File I/O (blocks thread) ──► Response C
│
└─► Thread 4 ──► (idle, waiting for request)
```

### Blocking vs Non-Blocking

```java
// Thread 1 executing this:
public void handleRequest(Request req, Response res) {
    // This BLOCKS Thread 1 for 50ms
    User user = database.findById(req.getParam("id")); // 50ms
    // Thread 1 is WAITING, doing nothing, can't handle other requests

    res.json(user);
}

// If 100 requests come in, you need 100 threads!
```

Compare to Node.js:
```javascript
async function handleRequest(req, res) {
    // This does NOT block!
    const user = await database.findById(req.params.id); // 50ms
    // The SINGLE thread handles other requests during this wait

    res.json(user);
}

// 100 requests? Still just 1 thread!
```

### Thread Context Switching

**Cost of threads:**

```
Each thread needs:
- Stack memory: ~1 MB
- Thread control block
- CPU registers

Context switch (switching between threads):
- Save current thread state
- Load new thread state
- Takes ~1-10 microseconds

1000 requests = 1000 threads = 1 GB RAM just for stacks!
Plus context switching overhead
```

## Hybrid Models

### Nginx (Event-Driven + Multi-Process)

```
Master Process
│
├─► Worker Process 1 (Event Loop) ──► 10,000 connections
├─► Worker Process 2 (Event Loop) ──► 10,000 connections
├─► Worker Process 3 (Event Loop) ──► 10,000 connections
└─► Worker Process 4 (Event Loop) ──► 10,000 connections

Total: 4 processes handling 40,000 concurrent connections!
```

**Why multiple processes?**
- Utilize multiple CPU cores
- Isolation (crash in one process doesn't affect others)
- Each process runs its own event loop

### Node.js with Worker Threads

```javascript
const { Worker } = require('worker_threads');

app.get('/heavy-computation', (req, res) => {
  // CPU-intensive task would block event loop
  // Solution: offload to worker thread

  const worker = new Worker('./compute.js', {
    workerData: req.body
  });

  worker.on('message', (result) => {
    res.json({ result });
  });

  // Main event loop continues handling other requests!
});
```

**Architecture:**

```
Main Thread (Event Loop)
│
├─► Handles Request A ──► Creates Worker 1 ──► CPU task
│                         (main thread continues!)
│
├─► Handles Request B ──► Creates Worker 2 ──► CPU task
│
└─► Handles Request C ──► Database query (I/O)

Worker Thread Pool:
├─► Worker 1: Computing... (separate thread)
└─► Worker 2: Computing... (separate thread)
```

## Process vs Thread vs Async I/O Comparison

### Scenario: 1000 Concurrent Requests (50ms DB query each)

#### Multi-Process (Apache MPM Prefork)
```
Processes: 1000
Memory: 1000 * 10 MB = 10 GB
CPU time: Minimal (mostly waiting for I/O)
Latency: 50ms average
Throughput: ~20,000 req/sec
```

#### Multi-Threaded (Java Tomcat)
```
Threads: 1000
Memory: 1000 * 1 MB = 1 GB
CPU time: Context switching overhead
Latency: 50ms average
Throughput: ~50,000 req/sec
```

#### Event Loop (Node.js)
```
Threads: 1 (plus libuv thread pool: 4 threads)
Memory: ~100 MB
CPU time: Minimal
Latency: 50ms average
Throughput: ~100,000 req/sec
```

**Why is Node.js faster?**
- No context switching
- Less memory = better CPU cache utilization
- All 1000 DB queries run in parallel (at the database)

### When Multi-Threading Wins

```javascript
// CPU-intensive task
function hashPassword(password) {
  // This takes 100ms of pure CPU time
  return bcrypt.hashSync(password, 10);
}

app.post('/register', (req, res) => {
  const hash = hashPassword(req.body.password); // BLOCKS EVENT LOOP!
  // All other requests are stuck waiting!
});
```

**In multi-threaded server:**
```java
public void register(Request req, Response res) {
    String hash = BCrypt.hashpw(req.getPassword(), BCrypt.gensalt(10));
    // This blocks ONLY this thread
    // Other threads continue processing other requests
}
```

**Solution in Node.js:**
```javascript
app.post('/register', async (req, res) => {
  // Offload to worker thread
  const hash = await bcrypt.hash(req.body.password, 10);
  // Event loop is free during computation
});
```

## Visualizing Concurrency

### Multi-Threaded (4 threads, 4 requests)

```
Time →
Thread 1: [────Request A────] → idle
Thread 2: [────Request B────] → idle
Thread 3: [────Request C────] → idle
Thread 4: [────Request D────] → idle

Request E arrives → needs to wait or create new thread
```

### Event Loop (1 thread, 4 requests)

```
Time →
Thread:   [A][B][C][D][wait...][A-complete][B-complete][C-complete][D-complete]

All requests started immediately!
Waiting for I/O happens outside the thread
```

## Real-World Performance

### Node.js Cluster Mode

```javascript
const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  // Fork workers (one per CPU core)
  const numCPUs = os.cpus().length;

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  // Workers share the same port
  const app = express();
  app.listen(3000);
}
```

**Architecture:**
```
Master Process
│
├─► Worker 1 (Event Loop) on Core 1
├─► Worker 2 (Event Loop) on Core 2
├─► Worker 3 (Event Loop) on Core 3
└─► Worker 4 (Event Loop) on Core 4

OS distributes incoming connections across workers
Best of both worlds: Event loop + multi-core utilization!
```

## Summary

| Model | Threads | Memory | I/O Tasks | CPU Tasks | Best For |
|-------|---------|--------|-----------|-----------|----------|
| **Multi-Process** | Many processes | High (GB) | Good | Good | Isolation needed |
| **Multi-Threaded** | Many threads | Medium (MB) | Good | Excellent | CPU-intensive |
| **Event Loop** | 1 thread | Low (MB) | Excellent | Poor | I/O-intensive |
| **Hybrid** | Few + Event Loop | Low-Medium | Excellent | Excellent | Production |

**Key Takeaways:**
1. **Event loop** = Single thread handles many requests via non-blocking I/O
2. **Multi-threading** = Each request gets its own thread
3. **I/O-bound** = Event loop wins (databases, files, network)
4. **CPU-bound** = Multi-threading wins (encryption, compression, math)
5. **Real world** = Hybrid (Node.js cluster, Nginx workers)

**Next:** [Handling Concurrent Updates](./04-handling-concurrent-updates.md) - The most critical part: race conditions!
