# Request Lifecycle: From Click to Response

## Complete Journey of an HTTP Request

Let's trace exactly what happens when a user clicks a button that makes an API call.

### The Complete Flow

```
User clicks "Get Users" button
         │
         ▼
┌─────────────────────────────────────────────┐
│  1. Browser JavaScript executes             │
│     fetch('https://api.example.com/users')  │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  2. DNS Resolution                          │
│     api.example.com → 192.168.1.100         │
│     (Browser cache → OS cache → DNS server) │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  3. TCP Connection Establishment            │
│     Three-way handshake (SYN, SYN-ACK, ACK) │
│     Browser ←→ Server                       │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  4. TLS Handshake (if HTTPS)                │
│     Certificate exchange, encryption setup  │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  5. Send HTTP Request                       │
│     GET /users HTTP/1.1                     │
│     Host: api.example.com                   │
│     Authorization: Bearer xyz...            │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  6. Server Receives Request                 │
│     (Next section: Server-side processing)  │
└─────────────────────────────────────────────┘
```

## Deep Dive: Server-Side Processing

This is where the magic happens! Let's see what the server does in extreme detail.

### Step 6: Request Arrives at Server

```
Network Interface Card (NIC)
         │
         ▼
┌─────────────────────────────────────┐
│  Operating System Kernel            │
│  - Receives TCP packets             │
│  - Reassembles them                 │
│  - Notifies server application      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Server Application                 │
│  (Node.js, Nginx, Apache, etc.)     │
└─────────────────────────────────────┘
```

**In Node.js (libuv layer):**

```
┌─────────────────────────────────────┐
│  OS says: "Data ready on socket 5"  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  libuv (Node's I/O library)         │
│  - Detects readable socket          │
│  - Reads data from socket           │
│  - Pushes event to event loop       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Node.js Event Loop                 │
│  - Picks up the event               │
│  - Calls request handler            │
└─────────────────────────────────────┘
```

### Step 7: HTTP Parser

```javascript
// Raw bytes received from socket:
"GET /users HTTP/1.1\r\nHost: api.example.com\r\nAuthorization: Bearer xyz\r\n\r\n"

// HTTP parser converts this to an object:
{
  method: 'GET',
  url: '/users',
  headers: {
    host: 'api.example.com',
    authorization: 'Bearer xyz'
  },
  httpVersion: '1.1'
}
```

**Node.js uses `http-parser` (C library):**
```javascript
// Simplified internal flow
const parser = new HTTPParser();

parser.on('headers-complete', (info) => {
  request.method = info.method;
  request.url = info.url;
  request.headers = info.headers;
});

parser.execute(bufferFromSocket);
```

### Step 8: Routing

The server needs to find which function should handle this request.

```javascript
// Express.js internal routing (simplified)
class Router {
  constructor() {
    this.routes = [];
  }

  get(path, handler) {
    this.routes.push({
      method: 'GET',
      path: path,
      handler: handler
    });
  }

  handle(request, response) {
    // Find matching route
    for (let route of this.routes) {
      if (route.method === request.method &&
          this.matchPath(route.path, request.url)) {

        // Found matching route!
        return route.handler(request, response);
      }
    }
    // No route found
    response.statusCode = 404;
    response.end('Not Found');
  }

  matchPath(routePath, requestUrl) {
    // Handle patterns like '/users/:id'
    // Convert to regex and match
    // ...
  }
}

// Your application code:
app.get('/users', getUsersHandler);
app.get('/users/:id', getUserByIdHandler);

// When request arrives:
router.handle(request, response);
```

### Step 9: Middleware Chain

Before reaching your handler, the request goes through middleware:

```javascript
// Middleware are functions that run in sequence
const middlewares = [
  corsMiddleware,
  authenticationMiddleware,
  loggingMiddleware,
  yourRouteHandler
];

function runMiddlewares(req, res, middlewares, index = 0) {
  if (index >= middlewares.length) return;

  const currentMiddleware = middlewares[index];

  // Each middleware gets a 'next' function
  currentMiddleware(req, res, () => {
    // 'next' was called, move to next middleware
    runMiddlewares(req, res, middlewares, index + 1);
  });
}

// Example middleware:
function authenticationMiddleware(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({ error: 'No token' });
    return; // Don't call next() - stop the chain
  }

  // Verify token (might be async)
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    req.user = decoded; // Attach user to request
    next(); // Continue to next middleware
  });
}
```

**Complete middleware flow:**

```
Request arrives
      │
      ▼
┌──────────────────────┐
│  CORS Middleware     │
│  (adds headers)      │
└──────┬───────────────┘
       │ next()
       ▼
┌──────────────────────┐
│  Auth Middleware     │
│  (verifies token)    │
└──────┬───────────────┘
       │ next()
       ▼
┌──────────────────────┐
│  Logging Middleware  │
│  (logs request)      │
└──────┬───────────────┘
       │ next()
       ▼
┌──────────────────────┐
│  Your Route Handler  │
│  (business logic)    │
└──────────────────────┘
```

### Step 10: Your Route Handler Executes

```javascript
app.get('/users', async (req, res) => {
  console.log('Handler called!');

  // Database query (I/O operation)
  const users = await db.query('SELECT * FROM users');

  // Send response
  res.json(users);
});
```

**What happens during `await db.query()`:**

```
┌─────────────────────────────────────┐
│  Your handler: await db.query()     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Database driver initiates query    │
│  - Sends SQL over TCP to DB server  │
│  - Returns a Promise                │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Handler is PAUSED (async/await)    │
│  Event loop CONTINUES                │
│  - Processes OTHER requests         │
│  - Handles timers, I/O, etc.        │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Database sends results back        │
│  OS notifies Node.js: data ready    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Event loop resumes your handler    │
│  - users = [results]                │
│  - Continues to res.json(users)     │
└─────────────────────────────────────┘
```

### Step 11: Response Generation

```javascript
res.json(users);

// Internally, Express does:
res.setHeader('Content-Type', 'application/json');
res.send(JSON.stringify(users));

// Which calls Node's http module:
response.writeHead(200, {
  'Content-Type': 'application/json',
  'Content-Length': jsonString.length
});
response.write(jsonString);
response.end();
```

**HTTP Response Format:**

```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 123
Date: Mon, 18 Nov 2025 10:30:00 GMT

[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}]
```

### Step 12: Send Response to Client

```
┌─────────────────────────────────────┐
│  response.end() called              │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Node.js writes to socket           │
│  - Passes data to OS                │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  OS TCP stack                       │
│  - Breaks into packets              │
│  - Sends over network               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Browser receives packets           │
│  - Reassembles response             │
│  - Parses JSON                      │
│  - Updates UI                       │
└─────────────────────────────────────┘
```

## Timeline: Real Numbers

Let's add real-world timings:

```
Event                           Time        Cumulative
─────────────────────────────────────────────────────────
User clicks button              0 ms        0 ms
DNS lookup                      5 ms        5 ms
TCP handshake                   20 ms       25 ms
TLS handshake                   40 ms       65 ms
Request sent                    1 ms        66 ms
─────────────────────────────────────────────────────────
Server receives request         0 ms        66 ms
HTTP parsing                    0.1 ms      66.1 ms
Routing                         0.05 ms     66.15 ms
Middleware chain                2 ms        68.15 ms
Route handler starts            0 ms        68.15 ms
Database query                  50 ms       118.15 ms
JSON serialization              2 ms        120.15 ms
Send response                   1 ms        121.15 ms
─────────────────────────────────────────────────────────
Response travels back           20 ms       141.15 ms
Browser parses JSON             1 ms        142.15 ms
UI updates                      5 ms        147.15 ms
─────────────────────────────────────────────────────────
Total: ~150ms
```

**Breakdown:**
- Network: ~85ms (DNS + TCP + TLS + round trips)
- Server processing: ~55ms (mostly database query)
- Client processing: ~6ms

## Multiple Concurrent Requests

Now let's see what happens when **1000 users** hit the server at the same time:

### Request A, B, C Timeline (Node.js Event Loop)

```
Time    Request A           Request B           Request C           Event Loop
────────────────────────────────────────────────────────────────────────────────
0ms     Arrives             -                   -                   Process A
1ms     Routing done        Arrives             -                   Process B
2ms     Auth middleware     Routing done        Arrives             Process C
3ms     Start DB query      Auth middleware     Routing done        Wait...
4ms     [waiting for DB]    Start DB query      Auth middleware
5ms     [waiting for DB]    [waiting for DB]    Start DB query
        ...                 ...                 ...                 Handle other
50ms    DB returns          [waiting for DB]    [waiting for DB]    Process A
51ms    Send response A     DB returns          [waiting for DB]    Process B
52ms    -                   Send response B     [waiting for DB]
53ms    -                   -                   DB returns          Process C
54ms    -                   -                   Send response C
```

**Key Insight:** Node.js handled all 3 requests with ONE thread because the expensive operations (DB queries) were NON-BLOCKING.

### Same Scenario in Multi-Threaded Server

```
Time    Thread 1 (Req A)    Thread 2 (Req B)    Thread 3 (Req C)
────────────────────────────────────────────────────────────────
0ms     Arrives, start      -                   -
1ms     DB query (WAIT)     Arrives, start      -
2ms     DB query (WAIT)     DB query (WAIT)     Arrives, start
3ms     DB query (WAIT)     DB query (WAIT)     DB query (WAIT)
...     ...                 ...                 ...
50ms    DB returns          DB returns          DB returns
51ms    Send response       Send response       Send response
```

Both models work! But:
- **Node.js:** 1 thread, low memory, great for I/O
- **Multi-threaded:** 3 threads, more memory, works for CPU-intensive tasks too

## What Happens to Request State?

**Critical Question:** How does the server keep track of which response goes to which user?

### Answer: Request/Response Objects

```javascript
function handleRequest(request, response) {
  // Each request gets its OWN request and response objects
  // These objects are tied to the specific TCP connection

  console.log(request.connectionId); // Unique identifier

  // When you write to 'response', it goes to the CORRECT client
  response.write('Hello');
}
```

**Under the hood:**

```javascript
// Simplified Node.js internals
class HTTPServer {
  constructor() {
    this.connections = new Map(); // Track all connections
  }

  handleNewConnection(socket) {
    const connectionId = this.generateId();

    // Create request/response objects for THIS connection
    const request = new IncomingMessage(socket);
    const response = new ServerResponse(request);

    // Store connection
    this.connections.set(connectionId, {
      socket,
      request,
      response
    });

    // When socket receives data
    socket.on('data', (data) => {
      // Parse HTTP request
      this.parseRequest(data, request);

      // Call your handler
      this.requestListener(request, response);
    });

    // When response.end() is called
    response.on('finish', () => {
      // Write to THIS specific socket
      socket.write(response.getData());

      // Clean up
      this.connections.delete(connectionId);
      socket.end();
    });
  }
}
```

**Key Points:**
1. Each TCP connection = unique socket = unique file descriptor
2. Request/Response objects are created per connection
3. When you write to `response`, it writes to the correct socket
4. OS ensures data goes to the right client (TCP connection tracking)

## Summary

A request goes through:
1. **Network layer** (DNS, TCP, TLS)
2. **OS** (receives packets, notifies server)
3. **HTTP parser** (converts bytes to HTTP object)
4. **Router** (finds matching route)
5. **Middleware chain** (auth, logging, etc.)
6. **Your handler** (business logic)
7. **Response generation** (JSON, HTML, etc.)
8. **Send back** (OS, network, client)

The server can handle multiple requests because:
- **Multi-process/thread:** Each request in separate execution context
- **Event loop:** Single thread with non-blocking I/O, interleaving request processing

Each request has its own `request` and `response` objects tied to a specific TCP connection, so responses never get mixed up!

**Next:** [Concurrency Models](./03-concurrency-models.md) - Deep dive into event loops, threads, and processes!
