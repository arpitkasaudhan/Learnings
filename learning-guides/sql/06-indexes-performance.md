# SQL Indexes & Performance - Lesson 6

## 📖 What are Indexes?

**Index** = Database's table of contents. Like a book's index, it helps find data quickly without reading everything.

**Without Index:** Full table scan (slow!)
```
Finding "Maruti" in 1M rows: Check row 1, row 2, row 3... row 1,000,000 ❌ SLOW
```

**With Index:** Direct lookup (fast!)
```
Finding "Maruti" in index: Jump directly to Maruti rows ✅ FAST
```

## 🏗️ How Indexes Work

**B-Tree Index (Most Common):**
```
           [M]
          /   \
      [A-L]   [N-Z]
      /  \      /  \
   [A-F][G-L][N-S][T-Z]
```

Looking for "Maruti":
1. Start at root: "M" → Go right
2. Check "N-Z": "M" < "N" → Actually go left path
3. Find exact location: O(log n) time!

## 📊 Types of Indexes

### 1. Primary Key Index (Automatic)

```sql
CREATE TABLE users (
    user_id INT PRIMARY KEY,  -- Automatically indexed!
    name VARCHAR(100)
);
```

### 2. Unique Index

```sql
-- Ensures uniqueness + creates index
CREATE UNIQUE INDEX idx_phone ON users(phone);

-- Or during table creation
CREATE TABLE users (
    user_id INT PRIMARY KEY,
    phone VARCHAR(15) UNIQUE  -- Automatically creates unique index
);
```

### 3. Single Column Index

```sql
-- Index on frequently queried column
CREATE INDEX idx_brand ON cars(brand);

-- Now this is fast!
SELECT * FROM cars WHERE brand = 'Maruti';
```

### 4. Composite Index (Multiple Columns)

```sql
-- For queries with multiple WHERE conditions
CREATE INDEX idx_city_brand_price ON cars(city, brand, price);

-- These queries use the index:
WHERE city = 'Delhi'                                    -- ✅
WHERE city = 'Delhi' AND brand = 'Maruti'               -- ✅
WHERE city = 'Delhi' AND brand = 'Maruti' AND price > 500000  -- ✅

-- These DON'T use the index fully:
WHERE brand = 'Maruti'                                  -- ❌ Skips first column
WHERE price > 500000                                    -- ❌ Skips first columns
```

**Column Order Rule:** Most selective → Least selective

### 5. Covering Index

Index contains all columns needed by query (no table lookup!).

```sql
-- Query needs: city, brand, price
CREATE INDEX idx_city_brand_price ON cars(city, brand, price);

-- This query only uses the index (super fast!)
SELECT city, brand, price
FROM cars
WHERE city = 'Delhi';
```

### 6. Partial Index (PostgreSQL)

Index only specific rows.

```sql
-- Index only active cars (smaller index, faster!)
CREATE INDEX idx_active_cars ON cars(city, brand)
WHERE status = 'active';
```

### 7. Full-Text Index

For text search.

```sql
-- MySQL
CREATE FULLTEXT INDEX idx_description ON cars(title, description);

SELECT * FROM cars
WHERE MATCH(title, description) AGAINST ('Swift dealer Delhi');
```

## 🎯 When to Create Indexes

### Create Index When:

✅ **Columns in WHERE clause**
```sql
-- Frequently filtered by city
SELECT * FROM cars WHERE city = 'Delhi';
CREATE INDEX idx_city ON cars(city);
```

✅ **Columns in JOIN conditions**
```sql
-- dealer_id used in JOIN
SELECT * FROM cars c
JOIN dealers d ON c.dealer_id = d.dealer_id;

CREATE INDEX idx_dealer_id ON cars(dealer_id);
```

✅ **Columns in ORDER BY**
```sql
-- Sorted by created_at
SELECT * FROM cars ORDER BY created_at DESC LIMIT 20;
CREATE INDEX idx_created_at ON cars(created_at DESC);
```

✅ **Foreign keys**
```sql
-- Always index foreign keys!
ALTER TABLE cars
ADD CONSTRAINT fk_dealer
FOREIGN KEY (dealer_id) REFERENCES dealers(dealer_id);

CREATE INDEX idx_dealer_id ON cars(dealer_id);
```

### DON'T Create Index When:

❌ **Small tables (< 1000 rows)**
- Full scan is faster than index lookup

❌ **Frequently updated columns**
- Each UPDATE must update index

❌ **Low cardinality columns**
```sql
-- Bad: Only 2 values (Manual/Automatic)
CREATE INDEX idx_transmission ON cars(transmission);  -- ❌

-- Good: Many unique values
CREATE INDEX idx_registration_number ON cars(registration_number);  -- ✅
```

❌ **Too many indexes**
- Each index slows down INSERT/UPDATE
- Maximum useful: 5-7 per table

## 📈 Query Optimization

### 1. Use EXPLAIN

**Analyze query execution plan:**

```sql
EXPLAIN SELECT * FROM cars WHERE city = 'Delhi';
```

**Output:**
```
+----+-------------+-------+------+----------+------+-------+
| id | select_type | table | type | key      | rows | Extra |
+----+-------------+-------+------+----------+------+-------+
| 1  | SIMPLE      | cars  | ALL  | NULL     | 1000 |       |  ❌ BAD (Full scan)
+----+-------------+-------+------+----------+------+-------+

After creating index:
+----+-------------+-------+------+----------+------+-------+
| id | select_type | table | type | key      | rows | Extra |
+----+-------------+-------+------+----------+------+-------+
| 1  | SIMPLE      | cars  | ref  | idx_city | 100  |       |  ✅ GOOD (Index scan)
+----+-------------+-------+------+----------+------+-------+
```

**Key columns to check:**
- **type**: ALL (bad), index/ref/range (good)
- **rows**: Lower is better
- **key**: Which index used (NULL = no index)
- **Extra**: "Using index" = covering index (best!)

### 2. Avoid Functions on Indexed Columns

```sql
-- ❌ BAD: Index not used
SELECT * FROM users WHERE UPPER(name) = 'RAHUL';
SELECT * FROM cars WHERE YEAR(created_at) = 2024;

-- ✅ GOOD: Index used
SELECT * FROM users WHERE name = 'Rahul';
SELECT * FROM cars
WHERE created_at >= '2024-01-01'
  AND created_at < '2025-01-01';
```

### 3. Use Column Indexes (Not Expressions)

```sql
-- ❌ BAD
SELECT * FROM cars WHERE price * 1.1 > 500000;

-- ✅ GOOD
SELECT * FROM cars WHERE price > 500000 / 1.1;
```

### 4. Limit Results

```sql
-- ❌ BAD: Returns millions of rows
SELECT * FROM logs;

-- ✅ GOOD: Returns only what you need
SELECT * FROM logs ORDER BY created_at DESC LIMIT 100;
```

### 5. Use EXISTS Instead of IN for Subqueries

```sql
-- ❌ SLOWER: IN evaluates full subquery
SELECT * FROM users
WHERE user_id IN (
    SELECT customer_id FROM leads WHERE status = 'new'
);

-- ✅ FASTER: EXISTS stops at first match
SELECT * FROM users u
WHERE EXISTS (
    SELECT 1 FROM leads l
    WHERE l.customer_id = u.user_id AND l.status = 'new'
);
```

### 6. Index Column Order in Composite Indexes

```sql
-- Query: WHERE city = 'Delhi' AND brand = 'Maruti' AND price > 500000

-- Check selectivity (how many unique values)
SELECT COUNT(DISTINCT city) FROM cars;     -- 50 cities
SELECT COUNT(DISTINCT brand) FROM cars;    -- 20 brands
SELECT COUNT(DISTINCT price) FROM cars;    -- 5000 prices

-- Create index: Most selective first
CREATE INDEX idx_price_city_brand ON cars(price, city, brand);  -- ❌ Wrong!
CREATE INDEX idx_city_brand_price ON cars(city, brand, price);  -- ✅ Better!
```

**Rule:** Equality (=) before Range (>, <, BETWEEN)

### 7. Avoid Leading Wildcards

```sql
-- ❌ Can't use index
SELECT * FROM cars WHERE model LIKE '%Swift%';

-- ✅ Can use index
SELECT * FROM cars WHERE model LIKE 'Swift%';
```

## 🔍 Index Management

### View Indexes

```sql
-- MySQL
SHOW INDEX FROM cars;

-- PostgreSQL
SELECT * FROM pg_indexes WHERE tablename = 'cars';
```

### Drop Index

```sql
DROP INDEX idx_old_column ON cars;
```

### Analyze Index Usage

```sql
-- MySQL: Check index statistics
SELECT * FROM sys.schema_unused_indexes;

-- PostgreSQL
SELECT
    schemaname, tablename, indexname,
    idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
WHERE idx_scan = 0;  -- Never used!
```

## 🎯 VahanHelp Index Strategy

```sql
-- Users table
CREATE TABLE users (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,  -- Auto-indexed
    phone VARCHAR(15) UNIQUE NOT NULL,           -- Auto-indexed (unique)
    email VARCHAR(100),
    name VARCHAR(100),
    role ENUM('customer', 'dealer', 'admin'),
    is_active BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_role_active ON users(role, is_active);
CREATE INDEX idx_email ON users(email);

-- Dealers table
CREATE TABLE dealers (
    dealer_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNIQUE NOT NULL,
    business_name VARCHAR(200),
    city VARCHAR(100),
    is_verified BOOLEAN,
    rating DECIMAL(3,2)
);

CREATE INDEX idx_city_verified ON dealers(city, is_verified);
CREATE INDEX idx_rating ON dealers(rating DESC);

-- Cars table
CREATE TABLE cars (
    car_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    dealer_id BIGINT NOT NULL,
    brand VARCHAR(50),
    model VARCHAR(50),
    year INT,
    price DECIMAL(12,2),
    city VARCHAR(100),
    status ENUM('active', 'sold', 'inactive'),
    created_at TIMESTAMP,
    views INT DEFAULT 0
);

-- Strategic indexes
CREATE INDEX idx_dealer_status ON cars(dealer_id, status);
CREATE INDEX idx_search ON cars(city, brand, price, year) WHERE status = 'active';
CREATE INDEX idx_status_created ON cars(status, created_at DESC);
CREATE FULLTEXT INDEX idx_fulltext ON cars(brand, model, variant);

-- Leads table
CREATE TABLE leads (
    lead_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    car_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    dealer_id BIGINT NOT NULL,
    status ENUM('new', 'contacted', 'converted', 'lost'),
    created_at TIMESTAMP
);

CREATE INDEX idx_dealer_status_created ON leads(dealer_id, status, created_at DESC);
CREATE INDEX idx_customer ON leads(customer_id);
CREATE INDEX idx_car ON leads(car_id);
```

## 📊 Performance Monitoring

### Slow Query Log (MySQL)

```sql
-- Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;  -- Log queries > 1 second

-- View slow queries
SELECT * FROM mysql.slow_log ORDER BY query_time DESC LIMIT 10;
```

### Query Profiling

```sql
-- Enable profiling
SET profiling = 1;

-- Run query
SELECT * FROM cars WHERE city = 'Delhi';

-- View profile
SHOW PROFILES;
SHOW PROFILE FOR QUERY 1;
```

## 🏃 Practical Exercises

### Exercise 1: Optimize Search Query

```sql
-- Original slow query
SELECT * FROM cars
WHERE city = 'Delhi'
  AND brand IN ('Maruti', 'Honda')
  AND price BETWEEN 500000 AND 1000000
  AND year >= 2020
ORDER BY created_at DESC
LIMIT 20;

-- Solution:
-- 1. Create composite index
CREATE INDEX idx_search ON cars(city, brand, price, year, created_at DESC);

-- 2. Verify with EXPLAIN
EXPLAIN SELECT ...;
```

### Exercise 2: Find Missing Indexes

```sql
-- Find queries without indexes
SELECT
    table_schema,
    table_name,
    index_name
FROM information_schema.statistics
WHERE table_schema = 'vahanhelp'
  AND table_name = 'cars';

-- Find slow queries
SELECT query_time, sql_text
FROM mysql.slow_log
ORDER BY query_time DESC
LIMIT 10;
```

### Exercise 3: Index Maintenance

```sql
-- Rebuild fragmented indexes (MySQL)
OPTIMIZE TABLE cars;

-- Analyze table statistics
ANALYZE TABLE cars;

-- Update statistics (PostgreSQL)
VACUUM ANALYZE cars;
```

## ✅ Key Takeaways

1. **Indexes** = Speed up SELECT, slow down INSERT/UPDATE/DELETE
2. **Create indexes** on WHERE, JOIN, ORDER BY columns
3. **Composite indexes** follow left-to-right rule
4. **EXPLAIN** shows query execution plan
5. **Avoid functions** on indexed columns
6. **Monitor** slow queries and index usage
7. **Balance** - too few indexes (slow reads), too many (slow writes)

## 🚀 Next Lesson

In [Lesson 7: Transactions & ACID](./07-transactions-acid.md), we'll learn:
- ACID properties
- Transaction isolation levels
- Locks and concurrency
- Deadlocks
- Best practices

---

**Indexes are the #1 way to improve database performance! 🚀**
