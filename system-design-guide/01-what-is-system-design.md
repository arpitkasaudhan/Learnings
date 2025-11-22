# Lesson 01: What is System Design?

## What is System Design?

**System Design** = The process of defining the architecture, components, modules, interfaces, and data for a system to satisfy specified requirements.

**In simple terms**: How to build software that works at scale.

---

## Why Learn System Design?

### 1. **Build Better Systems**
- Design systems that handle millions of users
- Make smart technology choices
- Avoid common pitfalls

### 2. **Ace Interviews**
- FAANG companies ask system design questions
- Senior+ roles require system design skills
- 45-60 minute system design rounds

### 3. **Think Like an Architect**
- See the big picture
- Understand trade-offs
- Make data-driven decisions

---

## What System Design is NOT

❌ **Not** about coding algorithms
❌ **Not** about specific frameworks
❌ **Not** about memorizing solutions
❌ **Not** about one "right" answer

✅ **IS** about trade-offs and decisions
✅ **IS** about scalability and reliability
✅ **IS** about communication and problem-solving
✅ **IS** about multiple valid solutions

---

## Real-World Example: VahanHelp

### Problem Statement
"Design a car insurance comparison platform where users can get quotes from multiple insurance providers."

### Bad Approach 🔴
```
Interviewer: Design VahanHelp.
You: Okay, I'll use Node.js, MongoDB, and React.
     *Starts coding immediately*
```

### Good Approach 🟢
```
You: Great! Let me clarify a few things first:

1. What features do we need?
   - User registration/login?
   - Save quotes for later?
   - Compare multiple quotes?
   - Payment processing?

2. What scale are we targeting?
   - How many users?
   - How many quotes per day?
   - Geographic regions?

3. What are the non-functional requirements?
   - Latency requirements?
   - Availability needs (99.9%? 99.99%)?
   - Budget constraints?

Interviewer: 100K users, 10K quotes/day, 99.9% availability.

You: Perfect! Let me start with a high-level architecture...
     *Draws diagram on whiteboard*
```

---

## System Design Fundamentals

### 1. **Scalability**
Ability to handle increased load.

**Vertical Scaling**: Bigger server (more CPU, RAM)
- ✅ Simple
- ❌ Limited (max specs)
- ❌ Single point of failure

**Horizontal Scaling**: More servers
- ✅ Unlimited growth
- ✅ High availability
- ❌ More complex

**VahanHelp Example**:
```
Vertical: t2.micro → t2.large (4x resources)
Horizontal: 1 server → 10 servers (10x capacity)
```

---

### 2. **Reliability**
System works correctly even when things fail.

**Techniques**:
- Redundancy (multiple servers)
- Backups (database snapshots)
- Failover (automatic switch to backup)

**VahanHelp Example**:
```
❌ Single database → Crashes = complete downtime
✅ Primary + Replica → Primary fails, replica takes over
```

---

### 3. **Availability**
Percentage of time system is operational.

**Availability Levels**:
- 99% = 3.65 days downtime/year
- 99.9% = 8.76 hours downtime/year
- 99.99% = 52.56 minutes downtime/year
- 99.999% = 5.26 minutes downtime/year

**VahanHelp Target**: 99.9% (8 hours downtime/year)

---

### 4. **Latency**
Time to complete a single request.

**Acceptable Latency**:
- Database query: < 100ms
- API response: < 200ms
- Page load: < 1s

**VahanHelp Example**:
```
User submits car details → API processes → Returns quotes
Target: < 500ms end-to-end
```

---

### 5. **Throughput**
Number of requests handled per second (QPS - Queries Per Second).

**VahanHelp Calculation**:
```
10,000 quotes/day
= 10,000 / 86,400 seconds
= ~0.12 QPS average
= ~1 QPS peak (assuming 10x spike)
```

---

## System Design Components

### 1. **Client (Frontend)**
- Web browser (React, Vue)
- Mobile app (React Native, Flutter)
- API client (Postman, curl)

### 2. **Load Balancer**
- Distributes traffic across servers
- Examples: AWS ALB, Nginx

### 3. **Application Servers**
- Business logic
- Examples: Node.js, Python, Java

### 4. **Database**
- Stores data
- SQL: PostgreSQL, MySQL
- NoSQL: MongoDB, DynamoDB

### 5. **Cache**
- Fast temporary storage
- Examples: Redis, Memcached

### 6. **Message Queue**
- Async communication
- Examples: RabbitMQ, AWS SQS

### 7. **CDN**
- Content delivery network
- Examples: CloudFront, Cloudflare

### 8. **Object Storage**
- File storage
- Examples: AWS S3, Google Cloud Storage

---

## Simple Architecture Example

```
┌──────────┐
│  User    │
│ (Browser)│
└────┬─────┘
     │ HTTPS
┌────▼──────┐
│   Server  │ (Node.js + Express)
│  - API    │
│  - Logic  │
└────┬──────┘
     │
┌────▼──────┐
│ Database  │ (PostgreSQL)
│  - Users  │
│  - Quotes │
└───────────┘
```

**This works for**: 0-1,000 users

---

## Scaled Architecture Example

```
┌───────────┐
│   Users   │
└─────┬─────┘
      │
┌─────▼──────┐
│    CDN     │ (CloudFront)
└─────┬──────┘
      │
┌─────▼──────┐
│Load Balancer│ (ALB)
└─────┬──────┘
      │
   ┌──┴──┐
┌──▼──┐ ┌▼────┐
│API 1│ │API 2│ (Node.js)
└──┬──┘ └┬────┘
   │     │
   └──┬──┘
      │
┌─────▼──────┐
│   Cache    │ (Redis)
└─────┬──────┘
      │
┌─────▼──────┐
│  Database  │ (PostgreSQL + Read Replica)
└────────────┘
```

**This works for**: 1,000-100,000 users

---

## The System Design Interview Process

### 1. **Clarify Requirements** (5 min)
Ask questions about:
- Features (what to build)
- Scale (how many users)
- Performance (latency, throughput)

### 2. **Estimate** (5 min)
Calculate:
- QPS (queries per second)
- Storage (GB/TB)
- Bandwidth (MB/s)

### 3. **High-Level Design** (15 min)
Draw architecture:
- Components
- Data flow
- Connections

### 4. **Deep Dive** (15 min)
Discuss:
- Database schema
- API design
- Algorithms
- Trade-offs

### 5. **Wrap Up** (5 min)
Cover:
- Bottlenecks
- Edge cases
- Future improvements

---

## Common Trade-offs

### SQL vs NoSQL
**SQL** (PostgreSQL):
- ✅ ACID transactions
- ✅ Relations (joins)
- ✅ Data integrity
- ❌ Harder to scale horizontally

**NoSQL** (MongoDB):
- ✅ Flexible schema
- ✅ Easy horizontal scaling
- ✅ Fast for simple queries
- ❌ No ACID across documents

**VahanHelp Decision**: PostgreSQL
- Need ACID for payments
- Relations (users → quotes → policies)
- Data integrity critical for insurance

---

### Monolith vs Microservices
**Monolith**:
- ✅ Simple to develop
- ✅ Easy to test
- ✅ Low latency (in-process calls)
- ❌ Hard to scale specific features
- ❌ Tight coupling

**Microservices**:
- ✅ Independent scaling
- ✅ Technology flexibility
- ✅ Fault isolation
- ❌ Complex deployment
- ❌ Network latency

**VahanHelp Decision**: Start with Monolith, migrate to Microservices at 100K+ users

---

### Sync vs Async
**Synchronous**:
- ✅ Simple
- ✅ Immediate response
- ❌ Blocks thread
- ❌ Slower for long tasks

**Asynchronous**:
- ✅ Non-blocking
- ✅ Better for long tasks
- ❌ More complex
- ❌ Eventual consistency

**VahanHelp Example**:
- Sync: Get quote (need immediate response)
- Async: Send email (can be delayed)

---

## Key Metrics to Track

### 1. **Response Time**
- p50: 50% of requests < X ms
- p95: 95% of requests < X ms
- p99: 99% of requests < X ms

**VahanHelp Target**:
- p50: < 100ms
- p95: < 500ms
- p99: < 1000ms

### 2. **Throughput (QPS)**
Number of requests per second

**VahanHelp**:
- Current: ~1 QPS
- Target: ~100 QPS

### 3. **Error Rate**
Percentage of failed requests

**VahanHelp Target**: < 0.1% (999 success out of 1000)

### 4. **Availability**
Uptime percentage

**VahanHelp Target**: 99.9% (8 hours downtime/year)

---

## Practice Exercise

**Design a simple blogging platform**

**Requirements**:
- Users can create, read, update, delete posts
- 10,000 users
- 100 posts per day
- 1,000 reads per day

**Questions to ask**:
1. Do we need user authentication?
2. Can users comment on posts?
3. Do we need search?
4. What about images in posts?
5. Any analytics requirements?

**Start with**:
1. Draw a simple client-server-database architecture
2. Choose database (SQL or NoSQL)
3. Estimate storage (100 posts/day × 1 KB = 100 KB/day)
4. Consider caching for popular posts

---

## Summary

**System Design** is about:
✅ Understanding requirements
✅ Making trade-offs
✅ Designing for scale
✅ Thinking about failures
✅ Communicating effectively

**Not** about:
❌ Perfect solutions
❌ Memorizing architectures
❌ Coding implementation
❌ Using the latest tech

**Key Takeaway**: There's no single right answer. It's all about trade-offs!

---

**Next Lesson**: [02-requirements-gathering.md](02-requirements-gathering.md)

Learn how to ask the right questions and gather requirements effectively!
