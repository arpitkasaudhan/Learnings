# Lesson 9: Database Optimization

## Introduction to Database Optimization

Database optimization is the process of improving database performance through:
- **Indexing** - Speed up queries
- **Query optimization** - Write efficient queries
- **Normalization** - Reduce data redundancy
- **Denormalization** - Improve read performance
- **Caching** - Reduce database load

## Indexing

### What is an Index?

An **index** is a data structure that improves the speed of data retrieval operations. Think of it like a book's index.

```
Without Index:
Query: Find user with email "john@example.com"
Database: Scan ALL rows (1 million rows) → SLOW

With Index on email:
Database: Use index to jump directly to row → FAST
```

### How Indexes Work

```
Table (without index):
Row 1: { id: 1, email: "alice@example.com", name: "Alice" }
Row 2: { id: 2, email: "bob@example.com", name: "Bob" }
Row 3: { id: 3, email: "charlie@example.com", name: "Charlie" }
...
Row 1M: { id: 1000000, email: "zoe@example.com", name: "Zoe" }

Full table scan: Check EVERY row until found

Index (B-tree on email):
├── alice@example.com → Row 1
├── bob@example.com → Row 2
├── charlie@example.com → Row 3
├── ...
└── zoe@example.com → Row 1M

Index lookup: Jump directly to row (like a book index)
```

### Types of Indexes

#### 1. B-Tree Index (Default)

Most common index type. Balanced tree structure.

```sql
-- Create B-tree index
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_price ON products(price);

-- Good for:
-- - Equality: WHERE email = 'john@example.com'
-- - Range: WHERE price BETWEEN 100 AND 200
-- - Sorting: ORDER BY price
-- - Prefix matching: WHERE name LIKE 'John%'
```

**B-Tree Structure**:
```
         [50, 100]
        /    |     \
    [25]  [75]   [125, 150]
   /  \    /  \     /   |    \
 [10] [40] [60] [90] [110] [140] [170]
```

**Performance**:
- Search: O(log n)
- Insert: O(log n)
- Delete: O(log n)

#### 2. Hash Index

Uses hash function for exact matches.

```sql
-- Create hash index (PostgreSQL)
CREATE INDEX idx_users_id_hash ON users USING HASH (id);

-- Good for:
-- - Exact matches: WHERE id = 123
-- - Very fast for equality

-- Not good for:
-- - Range queries: WHERE id > 100
-- - Sorting: ORDER BY id
-- - Pattern matching: LIKE queries
```

**Hash Structure**:
```
Hash Function: email → hash value → bucket

"john@example.com" → hash → 12345 → Bucket 5 → Row 42
"jane@example.com" → hash → 67890 → Bucket 3 → Row 15
```

#### 3. Composite Index (Multi-Column)

Index on multiple columns.

```sql
-- Create composite index
CREATE INDEX idx_users_city_age ON users(city, age);

-- Good for queries on:
-- - Both columns: WHERE city = 'New York' AND age = 30
-- - First column: WHERE city = 'New York'
-- - First column with second: WHERE city = 'New York' AND age > 25

-- NOT good for:
-- - Second column alone: WHERE age = 30 (won't use index efficiently)

-- Order matters!
CREATE INDEX idx_users_age_city ON users(age, city);  -- Different!
```

**Composite Index Rule (Leftmost Prefix)**:
```sql
-- Index: (city, age, gender)

✓ WHERE city = 'NY'
✓ WHERE city = 'NY' AND age = 30
✓ WHERE city = 'NY' AND age = 30 AND gender = 'M'
✓ WHERE city = 'NY' AND age > 25

✗ WHERE age = 30  (skips first column)
✗ WHERE gender = 'M'  (skips first columns)
✗ WHERE age = 30 AND gender = 'M'
```

#### 4. Unique Index

Enforces uniqueness and improves performance.

```sql
-- Create unique index
CREATE UNIQUE INDEX idx_users_email_unique ON users(email);

-- Now duplicate emails will be rejected
INSERT INTO users (email) VALUES ('john@example.com');  -- OK
INSERT INTO users (email) VALUES ('john@example.com');  -- ERROR!

-- Primary key automatically has unique index
CREATE TABLE users (
  id INT PRIMARY KEY  -- Automatically creates unique index on id
);
```

#### 5. Full-Text Index

For text search.

```sql
-- MySQL
CREATE FULLTEXT INDEX idx_posts_content ON posts(title, content);

-- Search
SELECT * FROM posts
WHERE MATCH(title, content) AGAINST ('database optimization');

-- PostgreSQL
CREATE INDEX idx_posts_search ON posts USING GIN(to_tsvector('english', content));

-- Search
SELECT * FROM posts
WHERE to_tsvector('english', content) @@ to_tsquery('database & optimization');
```

#### 6. Partial Index

Index only a subset of rows.

```sql
-- PostgreSQL: Index only active users
CREATE INDEX idx_active_users ON users(email)
WHERE active = true;

-- Much smaller index, faster for queries on active users
SELECT * FROM users WHERE active = true AND email = 'john@example.com';
```

### Creating Indexes

```sql
-- Basic index
CREATE INDEX idx_name ON table_name(column_name);

-- Composite index
CREATE INDEX idx_name ON table_name(column1, column2);

-- Unique index
CREATE UNIQUE INDEX idx_name ON table_name(column_name);

-- Index with specific name
CREATE INDEX idx_users_email ON users(email);

-- View indexes
SHOW INDEX FROM users;           -- MySQL
\d users                         -- PostgreSQL

-- Drop index
DROP INDEX idx_name;
```

### When to Create Indexes

**Create indexes on**:
```sql
✓ Primary keys (automatic)
✓ Foreign keys
✓ Columns in WHERE clauses
✓ Columns in JOIN conditions
✓ Columns in ORDER BY
✓ Columns in GROUP BY
✓ Frequently searched columns

Examples:
CREATE INDEX idx_users_email ON users(email);        -- Frequent login lookups
CREATE INDEX idx_orders_user_id ON orders(user_id);  -- Foreign key
CREATE INDEX idx_products_category ON products(category);  -- Filtering
CREATE INDEX idx_posts_created_at ON posts(created_at);    -- Sorting by date
```

**Don't create indexes on**:
```sql
✗ Small tables (< 1000 rows)
✗ Columns with few unique values (gender, boolean)
✗ Columns rarely used in queries
✗ Columns frequently updated (slows writes)
✗ Too many indexes on one table (slows INSERT/UPDATE/DELETE)
```

### Index Trade-offs

**Benefits**:
- Faster SELECT queries
- Faster sorting and grouping
- Improved JOIN performance

**Costs**:
- Slower INSERT/UPDATE/DELETE (must update index)
- More storage space (index takes disk space)
- Memory usage (indexes loaded in RAM)

**Example**:
```sql
-- Without index: Fast writes, slow reads
INSERT INTO users (...) VALUES (...);  -- 1ms
SELECT * FROM users WHERE email = '...';  -- 500ms (full scan)

-- With index: Slower writes, fast reads
INSERT INTO users (...) VALUES (...);  -- 5ms (update index)
SELECT * FROM users WHERE email = '...';  -- 1ms (index lookup)
```

## Query Optimization

### Analyzing Query Performance

#### EXPLAIN - See Query Execution Plan

```sql
-- MySQL/PostgreSQL
EXPLAIN SELECT * FROM users WHERE age > 25;

-- Sample output:
+----+-------------+-------+------+---------------+------+---------+------+------+-------------+
| id | select_type | table | type | possible_keys | key  | key_len | ref  | rows | Extra       |
+----+-------------+-------+------+---------------+------+---------+------+------+-------------+
|  1 | SIMPLE      | users | ALL  | NULL          | NULL | NULL    | NULL | 1000 | Using where |
+----+-------------+-------+------+---------------+------+---------+------+------+-------------+

-- type: ALL = full table scan (BAD!)
-- rows: 1000 = scanning 1000 rows (too many!)

-- After adding index on age:
EXPLAIN SELECT * FROM users WHERE age > 25;

+----+-------------+-------+-------+---------------+---------+---------+------+------+-------------+
| id | select_type | table | type  | possible_keys | key     | key_len | ref  | rows | Extra       |
+----+-------------+-------+-------+---------------+---------+---------+------+------+-------------+
|  1 | SIMPLE      | users | range | idx_users_age | idx_age | 4       | NULL | 250  | Using where |
+----+-------------+-------+-------+---------------+---------+---------+------+------+-------------+

-- type: range = using index (GOOD!)
-- rows: 250 = scanning only 250 rows (much better!)
```

**EXPLAIN Access Types (from best to worst)**:
```
✓ const: Single row lookup (PRIMARY KEY)
✓ eq_ref: Unique index lookup (JOIN with PRIMARY/UNIQUE KEY)
✓ ref: Non-unique index lookup
✓ range: Index range scan
✓ index: Full index scan
✗ ALL: Full table scan (AVOID!)
```

#### EXPLAIN ANALYZE - Show Actual Execution

```sql
-- PostgreSQL: Shows actual execution time
EXPLAIN ANALYZE SELECT * FROM users WHERE age > 25;

-- Output includes:
-- Planning Time: 0.123 ms
-- Execution Time: 45.678 ms
```

### Query Optimization Techniques

#### 1. Use Indexes Effectively

```sql
-- Bad: Function on indexed column (can't use index)
SELECT * FROM users WHERE YEAR(created_at) = 2025;

-- Good: Rewrite to use index
SELECT * FROM users
WHERE created_at >= '2025-01-01' AND created_at < '2026-01-01';

-- Bad: Leading wildcard (can't use index)
SELECT * FROM users WHERE email LIKE '%gmail.com';

-- Good: Trailing wildcard (can use index)
SELECT * FROM users WHERE email LIKE 'john%';
```

#### 2. Avoid SELECT *

```sql
-- Bad: Fetches all columns (more data, slower)
SELECT * FROM users WHERE id = 1;

-- Good: Select only needed columns
SELECT id, name, email FROM users WHERE id = 1;
```

#### 3. Use LIMIT for Pagination

```sql
-- Bad: Fetches all rows then limits in application
SELECT * FROM products ORDER BY price;  -- Application: take first 10

-- Good: Limit in database
SELECT * FROM products ORDER BY price LIMIT 10;

-- Pagination
SELECT * FROM products ORDER BY price LIMIT 10 OFFSET 20;  -- Page 3
```

#### 4. Optimize JOINs

```sql
-- Bad: Cartesian product (no join condition)
SELECT * FROM users, orders;  -- users × orders rows!

-- Good: Proper JOIN
SELECT * FROM users
INNER JOIN orders ON users.id = orders.user_id;

-- Index foreign keys for faster JOINs
CREATE INDEX idx_orders_user_id ON orders(user_id);
```

#### 5. Use EXISTS Instead of COUNT

```sql
-- Bad: Counts all rows just to check if any exist
SELECT COUNT(*) FROM orders WHERE user_id = 1;  -- In app: if (count > 0)

-- Good: Stops at first match
SELECT EXISTS(SELECT 1 FROM orders WHERE user_id = 1);
```

#### 6. Batch Operations

```sql
-- Bad: Multiple inserts
INSERT INTO users (name) VALUES ('User1');
INSERT INTO users (name) VALUES ('User2');
INSERT INTO users (name) VALUES ('User3');

-- Good: Batch insert
INSERT INTO users (name) VALUES ('User1'), ('User2'), ('User3');
```

#### 7. Avoid Subqueries in SELECT

```sql
-- Bad: Subquery runs for each row
SELECT
  u.name,
  (SELECT COUNT(*) FROM orders WHERE user_id = u.id) AS order_count
FROM users u;

-- Good: Use JOIN
SELECT
  u.name,
  COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name;
```

#### 8. Use Covering Index

```sql
-- Query needs: id, email, name
CREATE INDEX idx_users_cover ON users(email, name);

-- This query only needs data from index (no table lookup!)
SELECT email, name FROM users WHERE email = 'john@example.com';
```

## Database Normalization

### What is Normalization?

**Normalization** is the process of organizing data to reduce redundancy and improve data integrity.

### Unnormalized Data (Bad)

```
Orders Table:
┌────┬─────────────┬──────────────────┬───────────┬────────┬──────────┬───────┐
│ id │ customer    │ email            │ product   │ price  │ quantity │ total │
├────┼─────────────┼──────────────────┼───────────┼────────┼──────────┼───────┤
│ 1  │ John Doe    │ john@example.com │ Laptop    │ 999.99 │ 1        │ 999.99│
│ 2  │ John Doe    │ john@example.com │ Mouse     │ 25.99  │ 2        │ 51.98 │
│ 3  │ Jane Smith  │ jane@example.com │ Keyboard  │ 75.99  │ 1        │ 75.99 │
└────┴─────────────┴──────────────────┴───────────┴────────┴──────────┴───────┘

Problems:
- Duplicate customer data (John's name/email repeated)
- If John changes email, must update multiple rows
- Data inconsistency risk
- Wasted storage
```

### First Normal Form (1NF)

**Rule**: Each column contains atomic (indivisible) values, no repeating groups.

```sql
-- Violates 1NF: Multiple values in one column
CREATE TABLE users (
  id INT,
  name VARCHAR(100),
  phones VARCHAR(200)  -- "123-456-7890, 098-765-4321" ❌
);

-- 1NF Compliant: Atomic values
CREATE TABLE users (
  id INT,
  name VARCHAR(100),
  phone VARCHAR(20)
);

-- Or separate table for multiple phones:
CREATE TABLE phones (
  user_id INT,
  phone VARCHAR(20)
);
```

### Second Normal Form (2NF)

**Rule**: Must be in 1NF AND all non-key columns depend on the entire primary key.

```sql
-- Violates 2NF: Partial dependency
CREATE TABLE order_items (
  order_id INT,
  product_id INT,
  product_name VARCHAR(100),  -- Depends only on product_id, not full key ❌
  quantity INT,
  PRIMARY KEY (order_id, product_id)
);

-- 2NF Compliant: Remove partial dependencies
CREATE TABLE order_items (
  order_id INT,
  product_id INT,
  quantity INT,
  PRIMARY KEY (order_id, product_id)
);

CREATE TABLE products (
  id INT PRIMARY KEY,
  name VARCHAR(100)  -- Now depends on full key
);
```

### Third Normal Form (3NF)

**Rule**: Must be in 2NF AND no transitive dependencies (non-key columns depend only on primary key).

```sql
-- Violates 3NF: Transitive dependency
CREATE TABLE employees (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  department_id INT,
  department_name VARCHAR(100)  -- Depends on department_id, not id ❌
);

-- 3NF Compliant: Remove transitive dependencies
CREATE TABLE employees (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  department_id INT
);

CREATE TABLE departments (
  id INT PRIMARY KEY,
  name VARCHAR(100)
);
```

### Boyce-Codd Normal Form (BCNF)

**Rule**: Stronger version of 3NF. Every determinant must be a candidate key.

```sql
-- Example: Student-Course-Instructor
-- Rule: Each course has one instructor
-- Instructor can teach multiple courses

-- Violates BCNF
CREATE TABLE enrollments (
  student_id INT,
  course_id INT,
  instructor_id INT,  -- Depends on course_id ❌
  PRIMARY KEY (student_id, course_id)
);

-- BCNF Compliant
CREATE TABLE enrollments (
  student_id INT,
  course_id INT,
  PRIMARY KEY (student_id, course_id)
);

CREATE TABLE course_instructors (
  course_id INT PRIMARY KEY,
  instructor_id INT
);
```

### Normalization Example

**Unnormalized**:
```
┌────┬──────┬──────────────────┬─────────┬────────┐
│ id │ name │ email            │ orders  │ total  │
├────┼──────┼──────────────────┼─────────┼────────┤
│ 1  │ John │ john@example.com │ 001,002 │ 150.00 │
└────┴──────┴──────────────────┴─────────┴────────┘
```

**Normalized (3NF)**:
```
Users:
┌────┬──────┬──────────────────┐
│ id │ name │ email            │
├────┼──────┼──────────────────┤
│ 1  │ John │ john@example.com │
└────┴──────┴──────────────────┘

Orders:
┌────┬─────────┬────────┐
│ id │ user_id │ total  │
├────┼─────────┼────────┤
│ 1  │ 1       │ 100.00 │
│ 2  │ 1       │ 50.00  │
└────┴─────────┴────────┘
```

### Denormalization

Sometimes we intentionally violate normalization for performance.

```sql
-- Normalized (requires JOIN)
SELECT users.name, COUNT(orders.id)
FROM users
LEFT JOIN orders ON users.id = orders.user_id
GROUP BY users.id;

-- Denormalized (faster, no JOIN)
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  order_count INT  -- Redundant, but fast! ✓
);

-- Update order_count when orders change
-- Trade-off: Storage + update complexity for read speed
```

**When to Denormalize**:
- Read-heavy applications
- Queries are too slow with JOINs
- Calculated fields used frequently
- Reporting/analytics tables

## Performance Tuning

### Connection Pooling

```javascript
// Bad: Create connection for each query
async function getUser(id) {
  const connection = await mysql.createConnection(config);
  const user = await connection.query('SELECT * FROM users WHERE id = ?', [id]);
  await connection.end();
  return user;
}

// Good: Use connection pool
const pool = mysql.createPool(config);

async function getUser(id) {
  const connection = await pool.getConnection();
  try {
    const user = await connection.query('SELECT * FROM users WHERE id = ?', [id]);
    return user;
  } finally {
    connection.release();  // Return to pool
  }
}
```

### Prepared Statements

```javascript
// Bad: String concatenation (SQL injection risk + slower)
const query = `SELECT * FROM users WHERE email = '${email}'`;

// Good: Prepared statement (safe + cached + faster)
const query = 'SELECT * FROM users WHERE email = ?';
const result = await connection.execute(query, [email]);
```

### Caching

```javascript
// Add Redis caching layer
async function getUser(id) {
  // Try cache first
  const cached = await redis.get(`user:${id}`);
  if (cached) return JSON.parse(cached);

  // Cache miss - query database
  const user = await db.query('SELECT * FROM users WHERE id = ?', [id]);

  // Store in cache (1 hour TTL)
  await redis.setex(`user:${id}`, 3600, JSON.stringify(user));

  return user;
}
```

### Database Configuration

```sql
-- Increase buffer pool (MySQL)
innodb_buffer_pool_size = 2G  -- 70-80% of RAM

-- Query cache (if applicable)
query_cache_size = 64M

-- Connection limits
max_connections = 200

-- Slow query log (find slow queries)
slow_query_log = 1
long_query_time = 2  -- Log queries > 2 seconds
```

### Monitoring

```sql
-- Find slow queries (MySQL)
SELECT * FROM mysql.slow_log
ORDER BY query_time DESC
LIMIT 10;

-- Active queries (PostgreSQL)
SELECT pid, query, state, query_start
FROM pg_stat_activity
WHERE state = 'active';

-- Kill long-running query
KILL QUERY <pid>;
```

## Key Takeaways

1. **Indexes** speed up reads but slow writes
2. **EXPLAIN** reveals query execution plans
3. **Normalization** reduces redundancy
4. **Denormalization** can improve performance
5. **Monitor** and optimize continuously
6. **Balance** between normalization and performance

## Exercises

### Exercise 1: Index Design

Design indexes for this schema:
```sql
users: id, email, name, city, created_at
orders: id, user_id, total, status, created_at
```

Optimize for:
1. Login: `WHERE email = ?`
2. User orders: `WHERE user_id = ?`
3. Recent orders: `ORDER BY created_at DESC`
4. City statistics: `GROUP BY city`

### Exercise 2: Query Optimization

Optimize this query:
```sql
SELECT *
FROM users
WHERE YEAR(created_at) = 2025
  AND status IN ('active', 'premium')
ORDER BY name;
```

### Exercise 3: Normalization

Normalize this table to 3NF:
```
students: id, name, course1, course2, instructor1, instructor2
```

## Next Steps

In [Lesson 10: Transactions & ACID](./10-transactions-acid.md), we'll learn:
- ACID properties in detail
- Transaction isolation levels
- Locking mechanisms
- Deadlock prevention

---

**Practice**: Analyze your application's slow queries and add appropriate indexes!
