# Lesson 05: Databases - SQL vs NoSQL

## Database Fundamentals

**Database** = Organized collection of data that can be easily accessed, managed, and updated.

**Two main types**:
1. **SQL** (Relational) - PostgreSQL, MySQL, Oracle
2. **NoSQL** (Non-relational) - MongoDB, Cassandra, DynamoDB

---

## SQL Databases (Relational)

### What is SQL?

**SQL** = Structured Query Language
**Relational DB** = Data stored in tables with relationships

**Example - VahanHelp Users Table**:
```
+----+------------------+----------+------------+
| id | email            | name     | created_at |
+----+------------------+----------+------------+
| 1  | john@email.com   | John Doe | 2024-01-15 |
| 2  | jane@email.com   | Jane     | 2024-01-16 |
+----+------------------+----------+------------+
```

**Quotes Table**:
```
+---------+---------+---------+----------+--------+
| id      | user_id | car_make| car_model| amount |
+---------+---------+---------+----------+--------+
| 101     | 1       | Honda   | Civic    | 15000  |
| 102     | 1       | Toyota  | Camry    | 18000  |
| 103     | 2       | BMW     | X5       | 25000  |
+---------+---------+---------+----------+--------+
```

**Relationship**: user_id in Quotes references id in Users

---

### ACID Properties

**A**tomicity: All or nothing
```sql
-- Either both succeed or both fail
BEGIN TRANSACTION;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

**C**onsistency: Data always valid
```sql
-- Balance can't be negative
CHECK (balance >= 0)
```

**I**solation: Transactions don't interfere
```sql
-- Two users can't book same car simultaneously
SELECT * FROM cars WHERE id = 1 FOR UPDATE;
```

**D**urability: Committed data survives crashes
- Data written to disk
- Write-ahead logging (WAL)

---

### When to Use SQL

✅ **Use SQL when**:
- Need ACID transactions (payments, banking)
- Complex queries with JOINs
- Data has clear relationships
- Data integrity is critical
- Structured, predictable schema

**VahanHelp Use Cases**:
- User accounts (need integrity)
- Insurance quotes (need transactions)
- Payments (need ACID)
- Policies (need relationships)

---

### SQL Schema Design

**VahanHelp Schema**:

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Quotes table
CREATE TABLE quotes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  car_make VARCHAR(100) NOT NULL,
  car_model VARCHAR(100) NOT NULL,
  car_year INTEGER NOT NULL,
  coverage_type VARCHAR(50),
  amount DECIMAL(10, 2),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),

  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at),
  INDEX idx_status (status)
);

-- Policies table
CREATE TABLE policies (
  id SERIAL PRIMARY KEY,
  quote_id INTEGER REFERENCES quotes(id),
  user_id INTEGER REFERENCES users(id),
  policy_number VARCHAR(50) UNIQUE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  premium DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

### SQL Query Examples

**Simple SELECT**:
```sql
-- Get all quotes for a user
SELECT * FROM quotes WHERE user_id = 1;
```

**JOIN**:
```sql
-- Get user with their quotes
SELECT u.name, q.car_make, q.car_model, q.amount
FROM users u
JOIN quotes q ON u.id = q.user_id
WHERE u.id = 1;
```

**Aggregation**:
```sql
-- Average quote amount per car make
SELECT car_make, AVG(amount) as avg_amount
FROM quotes
GROUP BY car_make
ORDER BY avg_amount DESC;
```

**Complex Query**:
```sql
-- Users with quotes but no policies
SELECT u.id, u.email, COUNT(q.id) as quote_count
FROM users u
JOIN quotes q ON u.id = q.user_id
LEFT JOIN policies p ON u.id = p.user_id
WHERE p.id IS NULL
GROUP BY u.id, u.email
HAVING COUNT(q.id) > 0;
```

---

## NoSQL Databases

### What is NoSQL?

**NoSQL** = "Not Only SQL"
**Types**:
1. Document (MongoDB, CouchDB)
2. Key-Value (Redis, DynamoDB)
3. Column-family (Cassandra, HBase)
4. Graph (Neo4j, ArangoDB)

---

### 1. Document Databases (MongoDB)

**Data stored as documents** (JSON-like):

```javascript
// User document
{
  "_id": ObjectId("60f1a2b3c4d5e6f7g8h9i0j1"),
  "email": "john@email.com",
  "name": "John Doe",
  "quotes": [
    {
      "carMake": "Honda",
      "carModel": "Civic",
      "amount": 15000,
      "createdAt": "2024-01-15"
    },
    {
      "carMake": "Toyota",
      "carModel": "Camry",
      "amount": 18000,
      "createdAt": "2024-01-16"
    }
  ],
  "preferences": {
    "coverageType": "comprehensive",
    "notifications": true
  }
}
```

**MongoDB Query**:
```javascript
// Find users with Honda quotes
db.users.find({
  "quotes.carMake": "Honda"
});

// Add new quote
db.users.updateOne(
  { email: "john@email.com" },
  { $push: { quotes: newQuote } }
);
```

**Pros**:
- ✅ Flexible schema
- ✅ Easy to scale horizontally
- ✅ Fast for simple queries
- ✅ Natural for JSON APIs

**Cons**:
- ❌ No ACID across documents
- ❌ No JOINs (denormalization needed)
- ❌ Data duplication

---

### 2. Key-Value Stores (Redis, DynamoDB)

**Simple key → value mapping**:

```javascript
// Redis example
SET user:1:session "abc123"
GET user:1:session  // Returns: "abc123"

SET quote:101:amount 15000
EXPIRE quote:101:amount 3600  // Expires in 1 hour

// Store object as JSON
SET user:1 '{"name":"John","email":"john@email.com"}'
GET user:1
```

**Use Cases**:
- Session storage
- Caching
- Rate limiting
- Real-time leaderboards

---

### 3. Column-Family (Cassandra)

**Data stored in column families**:

```
RowKey: user:1
  email: john@email.com
  name: John Doe

RowKey: user:2
  email: jane@email.com
  name: Jane
  location: New York
```

**Use Cases**:
- Time-series data
- High write throughput
- Distributed systems

---

### 4. Graph Databases (Neo4j)

**Data stored as nodes and relationships**:

```
(User:John) -[:CREATED]-> (Quote:101)
(Quote:101) -[:FOR_CAR]-> (Car:Honda Civic)
(User:John) -[:FRIEND]-> (User:Jane)
```

**Use Cases**:
- Social networks
- Recommendation engines
- Fraud detection

---

## SQL vs NoSQL Comparison

| Feature | SQL | NoSQL |
|---------|-----|-------|
| **Schema** | Fixed, predefined | Flexible, dynamic |
| **Scaling** | Vertical (bigger server) | Horizontal (more servers) |
| **ACID** | ✅ Yes | ❌ Eventually consistent |
| **Joins** | ✅ Native support | ❌ Application-level |
| **Data Integrity** | ✅ Strong | ❌ Weak |
| **Query Language** | SQL (standard) | Custom per DB |
| **Speed** | Fast for complex queries | Fast for simple queries |
| **Use Case** | Structured, relational | Flexible, high-scale |

---

## When to Use What?

### Use SQL (PostgreSQL, MySQL) when:

✅ **Need ACID transactions**
```
Example: Payment processing, banking
- Transfer money: deduct from A, add to B (both must succeed)
```

✅ **Complex relationships**
```
Example: E-commerce
- Users → Orders → OrderItems → Products
- Multiple JOINs needed
```

✅ **Data integrity critical**
```
Example: Insurance policies
- Policy must have valid user
- Premium must be > 0
```

✅ **Structured, predictable data**
```
Example: Employee management
- All employees have: id, name, email, department
```

---

### Use NoSQL when:

✅ **Flexible schema**
```
Example: User profiles
- Different users have different attributes
- Frequent schema changes
```

✅ **High write throughput**
```
Example: Logging, analytics
- Millions of writes per second
- Eventual consistency OK
```

✅ **Horizontal scaling needed**
```
Example: Social media posts
- Billions of records
- Need to distribute across servers
```

✅ **Simple queries, no JOINs**
```
Example: Session storage
- key → value lookups only
```

---

## VahanHelp Database Design

### Option 1: SQL Only (Recommended)

```
PostgreSQL:
  - users
  - quotes
  - policies
  - payments

Redis (cache):
  - Session storage
  - Rate limiting
  - Hot quotes
```

**Pros**:
- ✅ ACID for payments
- ✅ Data integrity
- ✅ Easy to query

**Cons**:
- ❌ Harder to scale (but OK for < 1M users)

---

### Option 2: Hybrid (Future)

```
PostgreSQL:
  - users
  - payments
  - policies

MongoDB:
  - quotes (flexible schema)
  - car details
  - search data

Redis:
  - Cache
  - Sessions
```

**Pros**:
- ✅ Best of both worlds
- ✅ Easy to scale

**Cons**:
- ❌ More complexity
- ❌ Data consistency challenges

---

## Database Scaling Strategies

### 1. **Indexing**

Speed up queries with indexes:

```sql
-- Without index: Full table scan (slow)
SELECT * FROM quotes WHERE user_id = 1;

-- With index: Direct lookup (fast)
CREATE INDEX idx_user_id ON quotes(user_id);
```

**Trade-off**:
- ✅ Faster reads
- ❌ Slower writes (index must be updated)

---

### 2. **Replication**

**Primary-Replica** setup:

```
┌─────────┐
│ Primary │ (writes)
└────┬────┘
     │
  ┌──┴──┐
┌─▼───┐ ┌▼────┐
│Rep 1│ │Rep 2│ (reads)
└─────┘ └─────┘
```

**Benefits**:
- ✅ High availability
- ✅ Read scaling
- ✅ Backup

**Code**:
```javascript
// Write to primary
await primaryDB.query('INSERT INTO quotes ...');

// Read from replica
await replicaDB.query('SELECT * FROM quotes WHERE user_id = 1');
```

---

### 3. **Sharding**

Split data across multiple databases:

```
Users 1-1M    → Shard 1
Users 1M-2M   → Shard 2
Users 2M-3M   → Shard 3
```

**Sharding Strategies**:

**Hash-based**:
```javascript
const shardId = hash(userId) % numShards;
```

**Range-based**:
```javascript
if (userId < 1000000) shard = 1;
else if (userId < 2000000) shard = 2;
```

**Geography-based**:
```javascript
if (user.country === 'US') shard = 'us-db';
else if (user.country === 'India') shard = 'india-db';
```

---

### 4. **Caching**

Store frequently accessed data in memory:

```javascript
// Check cache first
const quote = await redis.get(`quote:${id}`);
if (quote) return JSON.parse(quote);

// Cache miss → Query database
const quote = await db.query('SELECT * FROM quotes WHERE id = ?', [id]);

// Store in cache (1 hour TTL)
await redis.setex(`quote:${id}`, 3600, JSON.stringify(quote));

return quote;
```

---

## Common Database Patterns

### 1. **Soft Delete**

Don't actually delete, mark as deleted:

```sql
ALTER TABLE quotes ADD COLUMN deleted_at TIMESTAMP;

-- Instead of DELETE
UPDATE quotes SET deleted_at = NOW() WHERE id = 1;

-- Query only active records
SELECT * FROM quotes WHERE deleted_at IS NULL;
```

---

### 2. **Optimistic Locking**

Prevent race conditions:

```sql
ALTER TABLE quotes ADD COLUMN version INTEGER DEFAULT 0;

-- Update with version check
UPDATE quotes
SET amount = 20000, version = version + 1
WHERE id = 1 AND version = 5;

-- If 0 rows affected → Conflict (someone else updated)
```

---

### 3. **Denormalization**

Trade storage for speed:

**Normalized** (slow - requires JOIN):
```sql
SELECT u.name, COUNT(q.id) as quote_count
FROM users u
JOIN quotes q ON u.id = q.user_id
GROUP BY u.id;
```

**Denormalized** (fast - no JOIN):
```sql
ALTER TABLE users ADD COLUMN quote_count INTEGER DEFAULT 0;

-- Update count when quote created
UPDATE users SET quote_count = quote_count + 1 WHERE id = 1;

-- Fast query
SELECT name, quote_count FROM users;
```

---

## Practice Exercise

**Design database schema for a Twitter-like app**

**Requirements**:
- Users can post tweets (280 chars)
- Users can follow other users
- Users can like tweets
- Show timeline (tweets from followed users)

**Your Task**:
1. Choose SQL or NoSQL (or both)
2. Design schema
3. Write key queries

### Sample Answer (SQL)

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tweets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  content VARCHAR(280),
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_user_created (user_id, created_at)
);

CREATE TABLE follows (
  follower_id INTEGER REFERENCES users(id),
  following_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id)
);

CREATE TABLE likes (
  user_id INTEGER REFERENCES users(id),
  tweet_id INTEGER REFERENCES tweets(id),
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, tweet_id)
);

-- Timeline query
SELECT t.*, u.username
FROM tweets t
JOIN follows f ON t.user_id = f.following_id
JOIN users u ON t.user_id = u.id
WHERE f.follower_id = 1
ORDER BY t.created_at DESC
LIMIT 50;
```

---

## Summary

**SQL**:
- ✅ ACID, JOINs, data integrity
- ❌ Harder to scale horizontally
- **Use for**: Structured data, transactions

**NoSQL**:
- ✅ Flexible schema, horizontal scaling
- ❌ No ACID, no JOINs
- **Use for**: Flexible data, high scale

**VahanHelp Decision**: PostgreSQL (SQL) for core data + Redis (NoSQL) for caching

**Key Takeaway**: Choose based on requirements, not hype!

---

**Next Lesson**: [06-api-design.md](06-api-design.md)

Learn how to design clean, scalable APIs!
