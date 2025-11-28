# Server Architecture Fundamentals

## How Servers Work: The Basics

### What is a Server?

A server is a program that:
1. **Listens** on a network port (e.g., port 80 for HTTP, 443 for HTTPS)
2. **Accepts** incoming connections from clients
3. **Processes** requests
4. **Sends** responses back

```javascript
// Simplified Node.js server
const http = require('http');

const server = http.createServer((request, response) => {
  // This function is called for EACH incoming request
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Hello World');
});

server.listen(3000); // Listen on port 3000
console.log('Server listening on port 3000');
```

### The Network Stack

When a user makes a request, it goes through multiple layers:

```
┌─────────────────────────────────────┐
│   User clicks button in browser     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Browser sends HTTP request        │
│   GET /api/users HTTP/1.1           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   TCP/IP Network Layer              │
│   (Breaks into packets, routing)    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Internet (routers, switches)      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Server's Network Interface        │
│   (Receives packets)                │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Operating System                  │
│   (TCP stack reassembles packets)   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Server Application                │
│   (Your Node.js/Express app)        │
└─────────────────────────────────────┘
```

## How Servers Handle Multiple Requests

This is the **CRITICAL** question: How can ONE server handle MANY users at the same time?

There are three main approaches:

### 1. Multi-Process Model

**Used by:** Apache (older configurations), PHP-FPM

```
Main Server Process
│
├─── Worker Process 1 ─── Handles Request from User A
├─── Worker Process 2 ─── Handles Request from User B
├─── Worker Process 3 ─── Handles Request from User C
└─── Worker Process 4 ─── Idle (waiting for requests)
```

**How it works:**
1. Main process listens on port 80
2. When a request arrives, it spawns (creates) a new process or assigns it to an existing worker process
3. Each process has its own memory space
4. Process handles one request at a time, then becomes available for the next

**Pros:**
- Simple to understand
- Crash in one process doesn't affect others (isolation)

**Cons:**
- Heavy on memory (each process = separate memory)
- Slow to create new processes
- Limited by how many processes OS can handle

### 2. Multi-Threaded Model

**Used by:** Java/Tomcat, Apache Tomcat, ASP.NET

```
Server Process
│
├─── Thread 1 ─── Handles Request from User A
├─── Thread 2 ─── Handles Request from User B
├─── Thread 3 ─── Handles Request from User C
└─── Thread 4 ─── Idle
```

**How it works:**
1. Single process with multiple threads
2. Each incoming request is assigned to a thread
3. Threads share the same memory space
4. Thread pool manages available threads

```java
// Java example (conceptual)
ExecutorService threadPool = Executors.newFixedThreadPool(100);

serverSocket.accept() { // When request arrives
  threadPool.submit(() -> {
    handleRequest(request); // This runs in a separate thread
  });
}
```

**Pros:**
- Lighter than processes (threads share memory)
- Faster to create than processes
- Can handle thousands of concurrent connections

**Cons:**
- Threads still consume memory
- Context switching overhead (CPU switching between threads)
- Shared memory can lead to race conditions (more on this later)

### 3. Event Loop / Async I/O Model

**Used by:** Node.js, Nginx, Go (goroutines)

This is the most interesting and modern approach!

```
Single Thread
│
Event Loop (continuously running)
│
├─── Request A arrives ──┐
├─── Start DB query for A (non-blocking) ──┐
├─── Request B arrives ──┐                  │
├─── Start file read for B (non-blocking) ──┼──┐
├─── DB query for A completes <─────────────┘  │
├─── Send response to A                        │
├─── File read for B completes <───────────────┘
└─── Send response to B
```

**How Node.js Event Loop Works:**

```javascript
// Node.js example
const express = require('express');
const app = express();

app.get('/user/:id', async (req, res) => {
  // This function is called when request arrives

  // Start database query (non-blocking!)
  const user = await db.findUser(req.params.id);
  // While waiting for DB, Node.js handles OTHER requests!

  res.json(user);
});

app.listen(3000);
```

**The Magic: Non-Blocking I/O**

```javascript
// BLOCKING (bad - freezes entire server)
const data = fs.readFileSync('/large-file.txt'); // Server WAITS here
console.log(data);

// NON-BLOCKING (good - server continues working)
fs.readFile('/large-file.txt', (err, data) => {
  // This callback runs when file is ready
  console.log(data);
});
// Server immediately continues to handle other requests!
```

**Event Loop Internals:**

```
┌───────────────────────────┐
│   Incoming HTTP Request   │
└───────────┬───────────────┘
            │
            ▼
┌───────────────────────────┐
│   Call Request Handler    │
│   (your route function)   │
└───────────┬───────────────┘
            │
            ▼
   Does it need I/O?
   (DB, File, Network)
            │
            ├─── YES ────────────────┐
            │                        │
            │                        ▼
            │              ┌──────────────────┐
            │              │ Delegate to OS   │
            │              │ (kernel handles  │
            │              │  actual I/O)     │
            │              └────────┬─────────┘
            │                       │
            │         ┌─────────────┘
            │         │
            ▼         ▼
    ┌──────────────────────────┐
    │   Event Loop continues   │
    │   Handles OTHER requests │
    └──────────┬───────────────┘
               │
               ▼
    ┌──────────────────────────┐
    │   I/O completes          │
    │   OS notifies Node.js    │
    └──────────┬───────────────┘
               │
               ▼
    ┌──────────────────────────┐
    │   Run callback           │
    │   Send response          │
    └──────────────────────────┘
```

**Pros:**
- Extremely efficient for I/O-heavy operations
- Single thread = no context switching overhead
- Can handle tens of thousands of concurrent connections
- Low memory footprint

**Cons:**
- CPU-intensive tasks block the entire server
- More complex programming model (callbacks, promises, async/await)

## Real-World Example: 1000 Concurrent Requests

Let's see how each model handles 1000 users hitting the server simultaneously:

### Multi-Process (Apache)
```
- Creates/uses 1000 processes
- Memory usage: ~1000 * 10MB = 10GB
- Each process handles one request
- OS manages scheduling
```

### Multi-Threaded (Java)
```
- Creates/uses 1000 threads
- Memory usage: ~1000 * 1MB = 1GB
- Each thread handles one request
- Less memory than processes
```

### Event Loop (Node.js)
```
- Single thread
- Memory usage: ~100MB
- All 1000 requests share the same thread
- I/O operations delegated to OS
- Blazing fast for I/O-bound operations
```

## CPU-Bound vs I/O-Bound Operations

Understanding this is KEY to server performance:

### I/O-Bound (Database, Files, Network)
```javascript
app.get('/users', async (req, res) => {
  const users = await db.query('SELECT * FROM users'); // I/O-bound
  res.json(users);
  // Most time is spent WAITING for database
  // Node.js is PERFECT for this
});
```

### CPU-Bound (Heavy computation)
```javascript
app.get('/calculate', (req, res) => {
  let result = 0;
  for (let i = 0; i < 10000000000; i++) { // CPU-bound
    result += Math.sqrt(i);
  }
  res.json({ result });
  // This BLOCKS Node.js event loop!
  // Other requests have to WAIT
  // Multi-threaded servers are BETTER for this
});
```

**Solution for CPU-bound in Node.js:**
```javascript
const { Worker } = require('worker_threads');

app.get('/calculate', (req, res) => {
  const worker = new Worker('./heavy-calculation.js');
  worker.on('message', (result) => {
    res.json({ result });
  });
  // Main thread continues handling other requests!
});
```

## Operating System's Role

The OS is doing a LOT of work behind the scenes:

1. **TCP Connection Management**
   - OS maintains TCP connection state
   - Handles packet acknowledgments, retransmission
   - Server just reads from a "socket"

2. **File Descriptor Table**
   ```
   Every network connection = file descriptor
   Process 1234 file descriptors:
   - fd 0: stdin
   - fd 1: stdout
   - fd 2: stderr
   - fd 3: socket (connection from User A)
   - fd 4: socket (connection from User B)
   - fd 5: file handle (database connection)
   ```

3. **epoll/kqueue (Linux/Mac)**
   - OS efficiently monitors thousands of file descriptors
   - Notifies server when data is ready
   - This is what makes Node.js/Nginx so efficient!

```c
// Low-level OS call (Node.js uses this internally)
epoll_wait(epfd, events, MAX_EVENTS, timeout);
// Returns when ANY of the monitored sockets have data
// Server then processes those specific requests
```

## Summary

- **Multi-process:** Separate process per request (heavy, isolated)
- **Multi-threaded:** Separate thread per request (lighter, shared memory)
- **Event loop:** Single thread, non-blocking I/O (lightest, efficient for I/O)

Most modern servers use a **hybrid approach**:
- Nginx: Event loop for handling connections, worker processes for parallelism
- Node.js: Event loop with worker threads for CPU-intensive tasks
- Java: Thread pools (not unlimited threads)

**Next:** [Request Lifecycle](./02-request-lifecycle.md) - Let's follow a single request from start to finish!
