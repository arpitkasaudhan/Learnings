# Lesson 6: Introduction to DBMS

## What is a Database?

A **database** is an organized collection of structured data stored electronically. It allows for efficient storage, retrieval, modification, and deletion of data.

### Examples of Databases in Daily Life

```
E-commerce:
- Product catalog
- User accounts
- Order history
- Shopping carts

Social Media:
- User profiles
- Posts and comments
- Friend connections
- Messages

Banking:
- Account information
- Transaction history
- Loan records
- Customer data

Healthcare:
- Patient records
- Appointment schedules
- Medical history
- Prescription data
```

## What is a DBMS?

**DBMS (Database Management System)** is software that:
- Stores data
- Manages data
- Provides interface to interact with data
- Ensures data security
- Maintains data integrity
- Handles concurrent access

### Popular DBMS Examples

```
Relational (SQL):
- MySQL
- PostgreSQL
- Oracle Database
- Microsoft SQL Server
- SQLite

NoSQL:
- MongoDB (Document)
- Redis (Key-Value)
- Cassandra (Column-Family)
- Neo4j (Graph)
```

## Why Use a DBMS?

### Without DBMS (File System)

```javascript
// Problems with file-based storage:

// 1. Data redundancy
users.txt:
John, john@example.com, NY
Jane, jane@example.com, LA

orders.txt:
John, john@example.com, Product1  // Duplicate data!
Jane, jane@example.com, Product2  // Duplicate data!

// 2. Data inconsistency
// Update email in users.txt but forget orders.txt
// Now data is inconsistent!

// 3. Difficult to query
// Want all users from NY? Need to parse entire file!

// 4. No concurrent access control
// Two people edit same file → data corruption

// 5. No security
// Anyone with file access can read/modify

// 6. No data integrity
// No rules to ensure valid data
```

### With DBMS

```sql
-- 1. No redundancy (normalization)
-- Users table
| id | name | email           | city |
|----|------|-----------------|------|
| 1  | John | john@example.com| NY   |
| 2  | Jane | jane@example.com| LA   |

-- Orders table (references user by ID only)
| id | user_id | product   |
|----|---------|-----------|
| 1  | 1       | Product1  |
| 2  | 2       | Product2  |

-- 2. Data consistency (referential integrity)
-- Can't add order for non-existent user
-- Update email once, reflected everywhere

-- 3. Easy queries
SELECT * FROM users WHERE city = 'NY';

-- 4. Concurrent access (transactions)
-- Multiple users can work simultaneously safely

-- 5. Security (permissions)
GRANT SELECT ON users TO analyst;
GRANT ALL ON users TO admin;

-- 6. Data integrity (constraints)
CREATE TABLE users (
  email VARCHAR(100) UNIQUE NOT NULL,
  age INT CHECK (age >= 0)
);
```

## Types of Databases

### 1. Relational Databases (SQL)

**Structure**: Data stored in **tables** (rows and columns)

**Example**:
```
Users Table:
┌────┬───────┬──────────────────┬─────┐
│ id │ name  │ email            │ age │
├────┼───────┼──────────────────┼─────┤
│ 1  │ John  │ john@example.com │ 30  │
│ 2  │ Jane  │ jane@example.com │ 25  │
│ 3  │ Bob   │ bob@example.com  │ 35  │
└────┴───────┴──────────────────┴─────┘

Posts Table:
┌────┬─────────┬───────────────┬────────────┐
│ id │ user_id │ title         │ created_at │
├────┼─────────┼───────────────┼────────────┤
│ 1  │ 1       │ First Post    │ 2025-01-01 │
│ 2  │ 1       │ Second Post   │ 2025-01-02 │
│ 3  │ 2       │ Jane's Post   │ 2025-01-03 │
└────┴─────────┴───────────────┴────────────┘
```

**Characteristics**:
- Fixed schema (structure defined beforehand)
- Relationships between tables (foreign keys)
- ACID properties (Atomicity, Consistency, Isolation, Durability)
- SQL query language
- Vertical scaling (add more power to server)

**When to Use**:
- Structured data
- Complex queries and relationships
- Financial transactions
- Data integrity is critical
- Need strong consistency

**Examples**: MySQL, PostgreSQL, Oracle, SQL Server

---

### 2. NoSQL Databases

#### 2a. Document Databases

**Structure**: Data stored as **documents** (JSON-like)

**Example (MongoDB)**:
```json
// Users collection
{
  "_id": "1",
  "name": "John",
  "email": "john@example.com",
  "age": 30,
  "address": {
    "street": "123 Main St",
    "city": "NY",
    "zip": "10001"
  },
  "posts": [
    {
      "title": "First Post",
      "content": "Hello world",
      "created_at": "2025-01-01"
    },
    {
      "title": "Second Post",
      "content": "Another post",
      "created_at": "2025-01-02"
    }
  ]
}
```

**Characteristics**:
- Flexible schema (can have different fields)
- Nested data (documents within documents)
- Horizontal scaling (add more servers)
- Fast reads and writes

**When to Use**:
- Flexible, evolving data structure
- Hierarchical data
- Content management
- Real-time applications
- Rapid development

**Examples**: MongoDB, CouchDB, Firebase

#### 2b. Key-Value Databases

**Structure**: Simple **key-value** pairs

**Example (Redis)**:
```
user:1:name       → "John"
user:1:email      → "john@example.com"
user:1:age        → 30
session:abc123    → { "userId": 1, "loggedIn": true }
cart:user:1       → [ { "productId": 1, "qty": 2 }, { "productId": 3, "qty": 1 } ]
```

**Characteristics**:
- Very simple structure
- Extremely fast (often in-memory)
- No queries (lookup by key only)
- Great for caching

**When to Use**:
- Caching
- Session storage
- Real-time analytics
- Leaderboards
- Rate limiting

**Examples**: Redis, Memcached, DynamoDB

#### 2c. Column-Family Databases

**Structure**: Data stored in **column families**

**Example (Cassandra)**:
```
Users Column Family:

Row Key: user1
├─ name: "John"
├─ email: "john@example.com"
└─ age: 30

Row Key: user2
├─ name: "Jane"
├─ email: "jane@example.com"
└─ age: 25
```

**Characteristics**:
- Optimized for reading columns
- Highly scalable
- Great for time-series data
- Fast writes

**When to Use**:
- Massive datasets
- Time-series data
- High write throughput
- Analytics

**Examples**: Cassandra, HBase, ScyllaDB

#### 2d. Graph Databases

**Structure**: **Nodes** (entities) and **Edges** (relationships)

**Example (Neo4j)**:
```
Nodes:
(John:User { name: "John", age: 30 })
(Jane:User { name: "Jane", age: 25 })
(Product1:Product { name: "Laptop" })

Relationships (Edges):
(John)-[:FRIENDS_WITH]->(Jane)
(John)-[:PURCHASED]->(Product1)
(Jane)-[:LIKES]->(Product1)
```

**Characteristics**:
- Relationships are first-class citizens
- Great for connected data
- Fast relationship queries
- Visual representation

**When to Use**:
- Social networks
- Recommendation engines
- Fraud detection
- Network analysis
- Knowledge graphs

**Examples**: Neo4j, Amazon Neptune, ArangoDB

## SQL vs NoSQL

| Feature | SQL (Relational) | NoSQL |
|---------|------------------|-------|
| **Schema** | Fixed, predefined | Flexible, dynamic |
| **Data Structure** | Tables (rows & columns) | Documents, Key-Value, etc. |
| **Relationships** | Foreign keys, JOINs | Embedded or references |
| **Scaling** | Vertical (bigger server) | Horizontal (more servers) |
| **Transactions** | ACID guaranteed | BASE (eventual consistency) |
| **Query Language** | SQL (standard) | Varies (MongoDB query, etc.) |
| **Use Case** | Structured, complex queries | Flexible, large scale |
| **Examples** | MySQL, PostgreSQL | MongoDB, Redis, Cassandra |

**SQL Strength**: Complex queries, relationships, transactions
**NoSQL Strength**: Scalability, flexibility, performance

## ACID Properties (SQL Databases)

### A - Atomicity
**All or nothing**: Transaction either completes fully or not at all

```sql
-- Transfer $100 from Account A to Account B
START TRANSACTION;
  UPDATE accounts SET balance = balance - 100 WHERE id = 'A';  -- Step 1
  UPDATE accounts SET balance = balance + 100 WHERE id = 'B';  -- Step 2
COMMIT;

-- If Step 2 fails, Step 1 is rolled back
-- You won't lose $100!
```

### C - Consistency
**Data must be valid**: Database goes from one valid state to another

```sql
-- Rule: Age must be positive
INSERT INTO users (name, age) VALUES ('John', -5);
-- ERROR: Constraint violation
-- Database stays consistent
```

### I - Isolation
**Transactions don't interfere**: Concurrent transactions are isolated

```sql
-- Transaction 1: Transfer $100
START TRANSACTION;
  UPDATE accounts SET balance = balance - 100 WHERE id = 'A';
  -- Transaction 2 can't see this change yet
COMMIT;
-- Now Transaction 2 can see the change
```

### D - Durability
**Changes are permanent**: Once committed, data survives crashes

```sql
COMMIT;  -- Data written to disk
-- Even if server crashes now, data is safe
```

## BASE Properties (NoSQL Databases)

### Basically Available
System guarantees availability (might not be latest data)

### Soft State
State may change over time (even without input)

### Eventual Consistency
System will eventually become consistent (given enough time)

```javascript
// MongoDB example
// Write to primary
db.users.insertOne({ name: "John" });

// Read from replica immediately
db.users.findOne({ name: "John" });
// Might not find it yet! (eventual consistency)

// Wait a bit, try again
// Now you find it! (consistency achieved)
```

## Common Database Operations (CRUD)

### SQL (MySQL/PostgreSQL)

```sql
-- CREATE (Insert)
INSERT INTO users (name, email, age)
VALUES ('John', 'john@example.com', 30);

-- READ (Select)
SELECT * FROM users WHERE age > 25;
SELECT name, email FROM users WHERE city = 'NY';

-- UPDATE
UPDATE users SET age = 31 WHERE id = 1;

-- DELETE
DELETE FROM users WHERE id = 1;
```

### NoSQL (MongoDB)

```javascript
// CREATE (Insert)
db.users.insertOne({
  name: "John",
  email: "john@example.com",
  age: 30
});

// READ (Find)
db.users.find({ age: { $gt: 25 } });
db.users.findOne({ email: "john@example.com" });

// UPDATE
db.users.updateOne(
  { _id: ObjectId("...") },
  { $set: { age: 31 } }
);

// DELETE
db.users.deleteOne({ _id: ObjectId("...") });
```

## Choosing the Right Database

### Use SQL When:
```
✓ Data is structured and relationships are important
✓ Complex queries with JOINs
✓ Financial transactions (need ACID)
✓ Data integrity is critical
✓ Schema is stable and well-defined
✓ Examples: Banking, E-commerce orders, Inventory
```

### Use NoSQL When:
```
✓ Rapid development with changing requirements
✓ Massive scale (millions of users)
✓ Flexible schema needed
✓ Hierarchical/nested data
✓ Real-time applications
✓ Examples: Social media, Analytics, IoT, Caching
```

### Use Both! (Polyglot Persistence)
```
Modern apps often use multiple databases:

- PostgreSQL: User accounts, orders (structured, transactional)
- MongoDB: Product catalog, user profiles (flexible schema)
- Redis: Session storage, caching (fast key-value)
- Elasticsearch: Search functionality (full-text search)
```

## Your VahanHelp Backend

Your project uses **MongoDB** (NoSQL document database):

```javascript
// From your backend/src/infrastructure/database/mongodb/models/

// User model
{
  _id: ObjectId("..."),
  phoneNumber: "+1234567890",
  name: "John Doe",
  email: "john@example.com",
  createdAt: ISODate("2025-01-01"),
  // Flexible schema - can add fields as needed
}

// Car model
{
  _id: ObjectId("..."),
  registrationNumber: "ABC123",
  make: "Toyota",
  model: "Camry",
  year: 2020,
  owner: ObjectId("..."), // Reference to User
  // Nested objects
  insurance: {
    provider: "State Farm",
    policyNumber: "POL123",
    expiryDate: ISODate("2026-01-01")
  }
}
```

**Why MongoDB for VahanHelp?**
- Flexible schema for different car types
- Nested documents for complex data (insurance, reports)
- Fast reads/writes for mobile app
- Easy to evolve as requirements change
- Good for real-time features

## Practical Exercises

### Exercise 1: Identify Database Type

For each scenario, choose SQL or NoSQL:

1. Banking system tracking transactions → **SQL** (need ACID)
2. Social media posts and comments → **NoSQL** (flexible, scalable)
3. E-commerce product catalog → **NoSQL** (flexible attributes)
4. Accounting system → **SQL** (structured, precise)
5. Real-time chat application → **NoSQL** (fast, scalable)

### Exercise 2: Design a Schema

Design a database for a blog:
- Users can write posts
- Posts can have comments
- Users can follow other users

**SQL Approach**:
```sql
users: id, name, email
posts: id, user_id, title, content
comments: id, post_id, user_id, text
follows: follower_id, following_id
```

**NoSQL Approach**:
```json
{
  "_id": "user1",
  "name": "John",
  "email": "john@example.com",
  "followers": ["user2", "user3"],
  "posts": [
    {
      "title": "My Post",
      "content": "...",
      "comments": [
        { "user": "user2", "text": "Great!" }
      ]
    }
  ]
}
```

## Key Takeaways

1. **DBMS** manages data efficiently and securely
2. **SQL databases** use tables, good for structured data
3. **NoSQL databases** have flexible schemas, good for scale
4. **ACID** (SQL) vs **BASE** (NoSQL) properties
5. **Choose based on needs**: structure, scale, consistency
6. **Modern apps** often use multiple database types

## Next Steps

In upcoming lessons, we'll dive deeper into:
- [Lesson 7: Relational Databases & SQL](./07-relational-databases.md)
- [Lesson 8: NoSQL Databases](./08-nosql-databases.md)
- [Lesson 9: Database Optimization](./09-database-optimization.md)
- [Lesson 10: Transactions & ACID](./10-transactions-acid.md)

---

**Practice**: Think about apps you use daily. What type of database do you think they use? Why?
