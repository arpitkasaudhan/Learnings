# Lesson 04: Client-Server Architecture

## What is Client-Server Model?

**Client-Server** = The foundation of all web applications.

- **Client**: Requests data (browser, mobile app)
- **Server**: Provides data (backend API)

```
┌──────────┐           ┌──────────┐
│  Client  │ ────────> │  Server  │
│ (Browser)│  Request  │ (Node.js)│
│          │ <──────── │          │
└──────────┘  Response └──────────┘
```

---

## Evolution of Web Architecture

### 1. **Static Websites** (1990s)

```
┌──────────┐
│  Client  │
│ (Browser)│
└────┬─────┘
     │ HTTP
┌────▼─────┐
│Web Server│ (Apache, Nginx)
│   HTML   │
│   CSS    │
│   JS     │
└──────────┘
```

**Characteristics**:
- Same content for all users
- No database
- No personalization

**Example**: Company landing page

---

### 2. **Dynamic Websites** (2000s)

```
┌──────────┐
│  Client  │
└────┬─────┘
     │
┌────▼─────┐
│Web Server│ (PHP, Ruby, Python)
└────┬─────┘
     │
┌────▼─────┐
│ Database │ (MySQL)
└──────────┘
```

**Characteristics**:
- Server generates HTML
- Database-driven
- Personalized content

**Example**: WordPress blog

---

### 3. **Single Page Applications (SPA)** (2010s)

```
┌──────────┐
│  Client  │ (React, Vue, Angular)
│   - UI   │
│ - Logic  │
│ - State  │
└────┬─────┘
     │ REST API
┌────▼─────┐
│API Server│ (Node.js, Express)
│  - JSON  │
└────┬─────┘
     │
┌────▼─────┐
│ Database │
└──────────┘
```

**Characteristics**:
- Client renders UI
- Server provides JSON
- Better UX (faster navigation)

**Example**: Gmail, Facebook, VahanHelp

---

### 4. **Modern Full-Stack** (2020s)

```
┌─────────────┐
│   Client    │ (Next.js, React)
│ - SSR/SSG   │
│ - Hydration │
└──────┬──────┘
       │ GraphQL/REST
┌──────▼──────┐
│  API Layer  │ (Node.js, GraphQL)
└──────┬──────┘
       │
   ┌───┴───┐
┌──▼──┐ ┌──▼───┐
│  DB │ │Cache │
└─────┘ └──────┘
```

**Characteristics**:
- Hybrid rendering (SSR + CSR)
- GraphQL for flexible queries
- Better SEO and performance

**Example**: Next.js apps, Vercel

---

## Client Types

### 1. **Web Browser**

**Technology**: HTML, CSS, JavaScript
**Frameworks**: React, Vue, Angular

```javascript
// React example
function QuoteForm() {
  const [quote, setQuote] = useState(null);

  const handleSubmit = async (carData) => {
    const response = await fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carData)
    });
    const data = await response.json();
    setQuote(data);
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

**Pros**:
- ✅ No installation
- ✅ Cross-platform
- ✅ Easy updates

**Cons**:
- ❌ Limited device access
- ❌ Requires internet

---

### 2. **Mobile App**

**Technology**: React Native, Flutter, Swift, Kotlin

```javascript
// React Native example
const QuoteScreen = () => {
  const [quote, setQuote] = useState(null);

  const fetchQuote = async () => {
    const response = await fetch('https://api.vahanhelp.com/quotes');
    const data = await response.json();
    setQuote(data);
  };

  return (
    <View>
      <Button title="Get Quote" onPress={fetchQuote} />
      {quote && <QuoteCard quote={quote} />}
    </View>
  );
};
```

**Pros**:
- ✅ Better UX
- ✅ Device features (camera, GPS)
- ✅ Offline support

**Cons**:
- ❌ App store approval
- ❌ Multiple platforms

---

### 3. **Desktop App**

**Technology**: Electron, Tauri

**Pros**:
- ✅ Full system access
- ✅ Offline first

**Cons**:
- ❌ Separate builds per OS
- ❌ Large download size

---

### 4. **CLI / API Clients**

**Technology**: curl, Postman, custom scripts

```bash
# API client example
curl -X POST https://api.vahanhelp.com/quotes \
  -H "Content-Type: application/json" \
  -d '{"make":"Honda","model":"Civic","year":2020}'
```

**Use Case**: Automation, testing, integrations

---

## Server Types

### 1. **Monolith**

**Single application** with all features.

```
┌────────────────────────┐
│     Monolith Server    │
│  ┌──────────────────┐  │
│  │  Auth Module     │  │
│  ├──────────────────┤  │
│  │  Quotes Module   │  │
│  ├──────────────────┤  │
│  │  Users Module    │  │
│  ├──────────────────┤  │
│  │  Payment Module  │  │
│  └──────────────────┘  │
└────────────────────────┘
```

**VahanHelp Monolith**:
```
src/
├── routes/
│   ├── auth.js
│   ├── quotes.js
│   ├── users.js
│   └── payments.js
├── models/
│   ├── User.js
│   └── Quote.js
└── server.js
```

**Pros**:
- ✅ Simple to develop
- ✅ Easy to test
- ✅ Single deployment

**Cons**:
- ❌ Hard to scale specific features
- ❌ Tight coupling
- ❌ Single point of failure

---

### 2. **Microservices**

**Multiple independent services**.

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│Auth Service │  │Quote Service│  │User Service │
│  Port 3001  │  │  Port 3002  │  │  Port 3003  │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                │                │
       └────────────────┼────────────────┘
                        │
                  ┌─────▼──────┐
                  │API Gateway │
                  └────────────┘
```

**Pros**:
- ✅ Independent scaling
- ✅ Technology flexibility
- ✅ Fault isolation

**Cons**:
- ❌ Complex deployment
- ❌ Network latency
- ❌ Distributed tracing needed

---

### 3. **Serverless**

**Functions as a Service** (FaaS).

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│createQuote()│  │getQuote()   │  │listQuotes() │
│   Lambda    │  │   Lambda    │  │   Lambda    │
└─────────────┘  └─────────────┘  └─────────────┘
```

**AWS Lambda Example**:
```javascript
exports.handler = async (event) => {
  const quote = await createQuote(JSON.parse(event.body));
  return {
    statusCode: 200,
    body: JSON.stringify(quote)
  };
};
```

**Pros**:
- ✅ Auto-scaling
- ✅ Pay per request
- ✅ No server management

**Cons**:
- ❌ Cold starts
- ❌ Timeout limits (15 min)
- ❌ Vendor lock-in

---

## Communication Patterns

### 1. **Request-Response (Synchronous)**

Client waits for server response.

```
Client: "Get me quote #123"
  ↓
Server: *Processes request*
  ↓
Server: "Here is quote #123"
  ↓
Client: *Displays quote*
```

**Use Case**: Most API calls (GET, POST, PUT, DELETE)

---

### 2. **Polling (Client-initiated)**

Client repeatedly asks for updates.

```javascript
// Bad: Polling every second
setInterval(async () => {
  const quote = await fetch('/api/quotes/123');
  updateUI(quote);
}, 1000);
```

**Pros**: Simple
**Cons**: Wastes resources, high latency

---

### 3. **Long Polling**

Server holds request until update available.

```javascript
async function longPoll() {
  const response = await fetch('/api/quotes/123/updates');
  updateUI(response);
  longPoll(); // Continue polling
}
```

**Pros**: Lower latency than polling
**Cons**: Ties up server connection

---

### 4. **WebSockets (Bidirectional)**

Persistent connection for real-time updates.

```javascript
// Client
const ws = new WebSocket('ws://api.vahanhelp.com/quotes');

ws.on('message', (quote) => {
  updateUI(quote);
});

ws.send(JSON.stringify({ action: 'subscribe', quoteId: 123 }));

// Server
wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    const { quoteId } = JSON.parse(data);
    // Send updates when quote changes
  });
});
```

**Use Case**: Chat, notifications, live updates

---

### 5. **Server-Sent Events (SSE)**

Server pushes updates to client.

```javascript
// Client
const eventSource = new EventSource('/api/quotes/123/stream');

eventSource.onmessage = (event) => {
  const quote = JSON.parse(event.data);
  updateUI(quote);
};

// Server
app.get('/api/quotes/:id/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');

  const interval = setInterval(() => {
    const quote = getQuote(req.params.id);
    res.write(`data: ${JSON.stringify(quote)}\n\n`);
  }, 5000);

  req.on('close', () => clearInterval(interval));
});
```

**Use Case**: Live dashboards, stock prices

---

## Load Balancing

**Distribute traffic** across multiple servers.

```
┌──────────┐
│  Client  │
└────┬─────┘
     │
┌────▼─────────┐
│Load Balancer │
└────┬─────────┘
     │
  ┌──┴──┬──┐
┌─▼─┐ ┌─▼─┐ ┌──▼──┐
│S1 │ │S2 │ │ S3  │
└───┘ └───┘ └─────┘
```

### Load Balancing Algorithms

**1. Round Robin**:
```
Request 1 → Server 1
Request 2 → Server 2
Request 3 → Server 3
Request 4 → Server 1 (repeat)
```

**2. Least Connections**:
```
Server 1: 5 connections
Server 2: 3 connections  ← Send here
Server 3: 7 connections
```

**3. IP Hash**:
```
hash(client_ip) % num_servers = server_index
```
Same client always goes to same server (sticky sessions).

---

## VahanHelp Architecture Evolution

### Phase 1: MVP (0-1K users)

```
┌──────────┐
│  React   │
└────┬─────┘
     │
┌────▼─────┐
│ Node.js  │ (Single server, t2.micro)
└────┬─────┘
     │
┌────▼─────┐
│PostgreSQL│
└──────────┘
```

**Cost**: $10/month
**Capacity**: ~100 QPS

---

### Phase 2: Growth (1K-10K users)

```
┌──────────┐
│  React   │
└────┬─────┘
     │
┌────▼────┐
│   ALB   │
└────┬────┘
     │
  ┌──┴──┐
┌─▼─┐ ┌─▼─┐
│S1 │ │S2 │ (Auto Scaling)
└─┬─┘ └─┬─┘
  │     │
  └──┬──┘
┌────▼─────┐
│PostgreSQL│ (Primary + Replica)
│  + Redis │
└──────────┘
```

**Cost**: $100/month
**Capacity**: ~1,000 QPS

---

### Phase 3: Scale (10K-100K users)

```
┌──────────┐
│CloudFront│ (CDN)
└────┬─────┘
     │
┌────▼────┐
│   ALB   │
└────┬────┘
     │
  ┌──┴────┬────┐
┌─▼─┐ ┌──▼─┐ ┌─▼──┐
│S1 │ │ S2 │ │ S3 │... (10 servers)
└─┬─┘ └──┬─┘ └─┬──┘
  │      │     │
  └───┬──┴─────┘
      │
  ┌───┴──┬────────┐
┌─▼────┐ ┌▼─────┐ ┌▼────┐
│ Postgres│ │Redis │ │ SQS │
│(Sharded)│ │      │ │     │
└─────────┘ └──────┘ └─────┘
```

**Cost**: $500/month
**Capacity**: ~10,000 QPS

---

## Practice Exercise

**Design a simple blog system**

**Requirements**:
- Users can create posts
- Users can read posts
- 1,000 DAU
- 100 posts/day

**Your Task**:
1. Draw client-server architecture
2. Choose communication pattern
3. Estimate: QPS, storage, servers needed

---

## Summary

**Client-Server Model**:
- Client requests, server responds
- Many client types (web, mobile, desktop, CLI)
- Many server types (monolith, microservices, serverless)

**Communication Patterns**:
- Request-Response (most common)
- WebSockets (real-time)
- SSE (server push)

**Key Decisions**:
- Monolith vs Microservices
- Sync vs Async
- Stateful vs Stateless

---

**Next Lesson**: [05-databases-sql-nosql.md](05-databases-sql-nosql.md)

Learn how to choose the right database!
