# Lesson 7: Relational Databases & SQL

## Introduction to Relational Databases

A **Relational Database** organizes data into **tables** (also called relations) with rows and columns. Tables can be related to each other through **keys**, allowing complex data relationships.

### Key Concepts

```
Database Hierarchy:
├── Database (e.g., "ecommerce_db")
│   ├── Tables (e.g., "users", "products", "orders")
│   │   ├── Rows (Records/Tuples)
│   │   └── Columns (Attributes/Fields)
│   └── Relationships (Foreign Keys)
```

### Example Database Structure

```
Users Table:
┌────┬───────┬──────────────────┬─────┬────────────┐
│ id │ name  │ email            │ age │ city       │
├────┼───────┼──────────────────┼─────┼────────────┤
│ 1  │ John  │ john@example.com │ 30  │ New York   │
│ 2  │ Jane  │ jane@example.com │ 25  │ Los Angeles│
│ 3  │ Bob   │ bob@example.com  │ 35  │ Chicago    │
└────┴───────┴──────────────────┴─────┴────────────┘

Products Table:
┌────┬─────────┬────────┬───────┐
│ id │ name    │ price  │ stock │
├────┼─────────┼────────┼───────┤
│ 1  │ Laptop  │ 999.99 │ 50    │
│ 2  │ Mouse   │ 25.99  │ 200   │
│ 3  │ Keyboard│ 75.99  │ 150   │
└────┴─────────┴────────┴───────┘

Orders Table:
┌────┬─────────┬────────────┬────────────┬────────┐
│ id │ user_id │ product_id │ quantity   │ total  │
├────┼─────────┼────────────┼────────────┼────────┤
│ 1  │ 1       │ 1          │ 1          │ 999.99 │
│ 2  │ 1       │ 2          │ 2          │ 51.98  │
│ 3  │ 2       │ 3          │ 1          │ 75.99  │
└────┴─────────┴────────────┴────────────┴────────┘
```

## Primary Keys and Foreign Keys

### Primary Key

A **Primary Key** uniquely identifies each row in a table.

```sql
-- Creating table with primary key
CREATE TABLE users (
  id INT PRIMARY KEY,        -- Primary key
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE
);

-- Or using AUTO_INCREMENT
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,  -- Auto-incrementing primary key
  name VARCHAR(100),
  email VARCHAR(100)
);
```

**Primary Key Rules**:
- Must be unique
- Cannot be NULL
- Each table should have one primary key
- Usually an integer (for performance)

### Foreign Key

A **Foreign Key** creates a relationship between tables by referencing a primary key in another table.

```sql
-- Orders table with foreign key
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  product_id INT,
  quantity INT,
  FOREIGN KEY (user_id) REFERENCES users(id),      -- Foreign key to users
  FOREIGN KEY (product_id) REFERENCES products(id) -- Foreign key to products
);
```

**Foreign Key Benefits**:
- Maintains referential integrity
- Prevents orphaned records
- Enforces data consistency

**Example of Referential Integrity**:
```sql
-- This will FAIL if user with id=999 doesn't exist
INSERT INTO orders (user_id, product_id, quantity)
VALUES (999, 1, 1);
-- Error: Cannot add or update a child row

-- This will FAIL if there are orders for this user
DELETE FROM users WHERE id = 1;
-- Error: Cannot delete or update a parent row
```

## SQL Basics - CRUD Operations

### CREATE (INSERT)

```sql
-- Insert single row
INSERT INTO users (name, email, age, city)
VALUES ('John Doe', 'john@example.com', 30, 'New York');

-- Insert multiple rows
INSERT INTO users (name, email, age, city) VALUES
  ('Jane Smith', 'jane@example.com', 25, 'Los Angeles'),
  ('Bob Johnson', 'bob@example.com', 35, 'Chicago'),
  ('Alice Brown', 'alice@example.com', 28, 'Houston');

-- Insert with specific columns (others will be NULL or default)
INSERT INTO users (name, email)
VALUES ('Mike Wilson', 'mike@example.com');
```

### READ (SELECT)

```sql
-- Select all columns
SELECT * FROM users;

-- Select specific columns
SELECT name, email FROM users;

-- WHERE clause (filtering)
SELECT * FROM users WHERE age > 25;
SELECT * FROM users WHERE city = 'New York';
SELECT * FROM users WHERE age >= 25 AND city = 'New York';
SELECT * FROM users WHERE city = 'New York' OR city = 'Los Angeles';

-- LIKE (pattern matching)
SELECT * FROM users WHERE name LIKE 'J%';      -- Starts with J
SELECT * FROM users WHERE email LIKE '%@gmail.com';  -- Gmail users
SELECT * FROM users WHERE name LIKE '%son%';   -- Contains 'son'

-- IN clause
SELECT * FROM users WHERE city IN ('New York', 'Los Angeles', 'Chicago');

-- BETWEEN
SELECT * FROM users WHERE age BETWEEN 25 AND 35;

-- IS NULL / IS NOT NULL
SELECT * FROM users WHERE city IS NULL;
SELECT * FROM users WHERE city IS NOT NULL;

-- ORDER BY (sorting)
SELECT * FROM users ORDER BY age ASC;   -- Ascending (default)
SELECT * FROM users ORDER BY age DESC;  -- Descending
SELECT * FROM users ORDER BY city, age; -- Multiple columns

-- LIMIT (pagination)
SELECT * FROM users LIMIT 10;           -- First 10 rows
SELECT * FROM users LIMIT 10 OFFSET 20; -- Rows 21-30 (skip 20)

-- DISTINCT (unique values)
SELECT DISTINCT city FROM users;        -- List of unique cities
```

### UPDATE

```sql
-- Update single row
UPDATE users
SET age = 31
WHERE id = 1;

-- Update multiple columns
UPDATE users
SET age = 26, city = 'San Francisco'
WHERE id = 2;

-- Update multiple rows
UPDATE users
SET city = 'Remote'
WHERE city IS NULL;

-- Update with calculation
UPDATE products
SET price = price * 1.1  -- 10% price increase
WHERE category = 'Electronics';

-- ⚠️ WARNING: Without WHERE, updates ALL rows!
UPDATE users SET city = 'Unknown';  -- Updates EVERY user!
```

### DELETE

```sql
-- Delete specific row
DELETE FROM users WHERE id = 1;

-- Delete multiple rows
DELETE FROM users WHERE age < 18;

-- Delete all rows matching condition
DELETE FROM users WHERE city = 'Chicago';

-- ⚠️ WARNING: Without WHERE, deletes ALL rows!
DELETE FROM users;  -- Deletes EVERYTHING!

-- Safe delete: Use transactions
START TRANSACTION;
DELETE FROM users WHERE age < 18;
-- Check if correct...
ROLLBACK;  -- Undo if wrong
-- or
COMMIT;    -- Confirm if correct
```

## JOINs - Combining Tables

### INNER JOIN

Returns rows that have matching values in both tables.

```sql
-- Get orders with user information
SELECT
  orders.id,
  users.name,
  users.email,
  orders.quantity,
  orders.total
FROM orders
INNER JOIN users ON orders.user_id = users.id;

-- Result:
┌────┬───────┬──────────────────┬──────────┬────────┐
│ id │ name  │ email            │ quantity │ total  │
├────┼───────┼──────────────────┼──────────┼────────┤
│ 1  │ John  │ john@example.com │ 1        │ 999.99 │
│ 2  │ John  │ john@example.com │ 2        │ 51.98  │
│ 3  │ Jane  │ jane@example.com │ 1        │ 75.99  │
└────┴───────┴──────────────────┴──────────┴────────┘

-- Multiple JOINs
SELECT
  orders.id,
  users.name AS customer,
  products.name AS product,
  orders.quantity,
  orders.total
FROM orders
INNER JOIN users ON orders.user_id = users.id
INNER JOIN products ON orders.product_id = products.id;

-- Result:
┌────┬──────────┬──────────┬──────────┬────────┐
│ id │ customer │ product  │ quantity │ total  │
├────┼──────────┼──────────┼──────────┼────────┤
│ 1  │ John     │ Laptop   │ 1        │ 999.99 │
│ 2  │ John     │ Mouse    │ 2        │ 51.98  │
│ 3  │ Jane     │ Keyboard │ 1        │ 75.99  │
└────┴──────────┴──────────┴──────────┴────────┘
```

### LEFT JOIN (LEFT OUTER JOIN)

Returns all rows from the left table, and matching rows from the right table (NULL if no match).

```sql
-- Get all users and their orders (including users with no orders)
SELECT
  users.name,
  users.email,
  orders.id AS order_id,
  orders.total
FROM users
LEFT JOIN orders ON users.user_id = orders.user_id;

-- Result:
┌───────┬──────────────────┬──────────┬────────┐
│ name  │ email            │ order_id │ total  │
├───────┼──────────────────┼──────────┼────────┤
│ John  │ john@example.com │ 1        │ 999.99 │
│ John  │ john@example.com │ 2        │ 51.98  │
│ Jane  │ jane@example.com │ 3        │ 75.99  │
│ Bob   │ bob@example.com  │ NULL     │ NULL   │  ← No orders
└───────┴──────────────────┴──────────┴────────┘

-- Find users with no orders
SELECT users.name, users.email
FROM users
LEFT JOIN orders ON users.id = orders.user_id
WHERE orders.id IS NULL;
```

### RIGHT JOIN (RIGHT OUTER JOIN)

Returns all rows from the right table, and matching rows from the left table (NULL if no match).

```sql
-- Get all orders and user info (including orders with deleted users)
SELECT
  orders.id,
  orders.total,
  users.name,
  users.email
FROM users
RIGHT JOIN orders ON users.id = orders.user_id;

-- Note: LEFT JOIN is more commonly used than RIGHT JOIN
-- This is equivalent to swapping tables:
SELECT * FROM orders LEFT JOIN users ON orders.user_id = users.id;
```

### FULL OUTER JOIN

Returns all rows from both tables, with NULL where there's no match.

```sql
-- MySQL doesn't support FULL OUTER JOIN directly
-- But can be simulated with UNION:
SELECT * FROM users LEFT JOIN orders ON users.id = orders.user_id
UNION
SELECT * FROM users RIGHT JOIN orders ON users.id = orders.user_id;

-- PostgreSQL supports FULL OUTER JOIN:
SELECT * FROM users
FULL OUTER JOIN orders ON users.id = orders.user_id;
```

### SELF JOIN

Join a table with itself.

```sql
-- Example: Employee table with manager_id
CREATE TABLE employees (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  manager_id INT
);

-- Find employees and their managers
SELECT
  e.name AS employee,
  m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;
```

## Aggregate Functions & GROUP BY

### Common Aggregate Functions

```sql
-- COUNT - Count rows
SELECT COUNT(*) FROM users;                    -- Total users
SELECT COUNT(*) FROM users WHERE age > 25;     -- Users over 25
SELECT COUNT(DISTINCT city) FROM users;        -- Unique cities

-- SUM - Sum of values
SELECT SUM(total) FROM orders;                 -- Total revenue
SELECT SUM(quantity) FROM orders WHERE user_id = 1;  -- Total items ordered by user 1

-- AVG - Average
SELECT AVG(age) FROM users;                    -- Average age
SELECT AVG(price) FROM products;               -- Average price

-- MIN/MAX - Minimum/Maximum
SELECT MIN(price) FROM products;               -- Cheapest product
SELECT MAX(price) FROM products;               -- Most expensive
SELECT MIN(age) FROM users;                    -- Youngest user
SELECT MAX(age) FROM users;                    -- Oldest user
```

### GROUP BY

Group rows that have the same values in specified columns.

```sql
-- Count users per city
SELECT city, COUNT(*) AS user_count
FROM users
GROUP BY city;

-- Result:
┌─────────────┬────────────┐
│ city        │ user_count │
├─────────────┼────────────┤
│ New York    │ 5          │
│ Los Angeles │ 3          │
│ Chicago     │ 2          │
└─────────────┴────────────┘

-- Total orders per user
SELECT
  user_id,
  COUNT(*) AS order_count,
  SUM(total) AS total_spent
FROM orders
GROUP BY user_id;

-- Average price per category
SELECT
  category,
  AVG(price) AS avg_price,
  COUNT(*) AS product_count
FROM products
GROUP BY category;

-- Orders per user with user details
SELECT
  users.name,
  users.email,
  COUNT(orders.id) AS order_count,
  SUM(orders.total) AS total_spent
FROM users
LEFT JOIN orders ON users.id = orders.user_id
GROUP BY users.id, users.name, users.email;
```

### HAVING

Filter groups (use after GROUP BY, like WHERE for groups).

```sql
-- Cities with more than 2 users
SELECT city, COUNT(*) AS user_count
FROM users
GROUP BY city
HAVING COUNT(*) > 2;

-- Users who spent more than $100
SELECT
  user_id,
  SUM(total) AS total_spent
FROM orders
GROUP BY user_id
HAVING SUM(total) > 100;

-- Categories with average price > $500
SELECT
  category,
  AVG(price) AS avg_price
FROM products
GROUP BY category
HAVING AVG(price) > 500;

-- WHERE vs HAVING:
SELECT
  category,
  AVG(price) AS avg_price
FROM products
WHERE stock > 0           -- WHERE filters rows BEFORE grouping
GROUP BY category
HAVING AVG(price) > 100;  -- HAVING filters groups AFTER aggregation
```

## Subqueries

A query inside another query.

### Subquery in WHERE

```sql
-- Users who have placed orders
SELECT * FROM users
WHERE id IN (SELECT DISTINCT user_id FROM orders);

-- Users who never ordered
SELECT * FROM users
WHERE id NOT IN (SELECT DISTINCT user_id FROM orders);

-- Products more expensive than average
SELECT * FROM products
WHERE price > (SELECT AVG(price) FROM products);

-- Users from cities with more than 5 users
SELECT * FROM users
WHERE city IN (
  SELECT city FROM users
  GROUP BY city
  HAVING COUNT(*) > 5
);
```

### Subquery in SELECT

```sql
-- User with order count
SELECT
  id,
  name,
  email,
  (SELECT COUNT(*) FROM orders WHERE orders.user_id = users.id) AS order_count
FROM users;
```

### Subquery in FROM

```sql
-- Average order value per user
SELECT
  user_id,
  AVG(total) AS avg_order_value
FROM (
  SELECT user_id, SUM(total) AS total
  FROM orders
  GROUP BY user_id
) AS user_totals
GROUP BY user_id;
```

### EXISTS

```sql
-- Users who have placed orders
SELECT * FROM users u
WHERE EXISTS (
  SELECT 1 FROM orders o WHERE o.user_id = u.id
);

-- Users who haven't placed orders
SELECT * FROM users u
WHERE NOT EXISTS (
  SELECT 1 FROM orders o WHERE o.user_id = u.id
);
```

## Views

Virtual tables based on SQL queries.

```sql
-- Create view
CREATE VIEW user_order_summary AS
SELECT
  users.id,
  users.name,
  users.email,
  COUNT(orders.id) AS order_count,
  COALESCE(SUM(orders.total), 0) AS total_spent
FROM users
LEFT JOIN orders ON users.id = orders.user_id
GROUP BY users.id, users.name, users.email;

-- Use view like a table
SELECT * FROM user_order_summary;
SELECT * FROM user_order_summary WHERE order_count > 5;
SELECT * FROM user_order_summary ORDER BY total_spent DESC LIMIT 10;

-- Update view
CREATE OR REPLACE VIEW user_order_summary AS
SELECT ...;

-- Drop view
DROP VIEW user_order_summary;
```

**View Benefits**:
- Simplify complex queries
- Security (hide sensitive columns)
- Consistency (same query logic everywhere)
- Abstraction (changes to underlying tables don't affect view users)

## Advanced SQL Techniques

### String Functions

```sql
-- CONCAT - Combine strings
SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM users;

-- UPPER/LOWER - Change case
SELECT UPPER(name), LOWER(email) FROM users;

-- SUBSTRING - Extract part of string
SELECT SUBSTRING(email, 1, POSITION('@' IN email) - 1) AS username FROM users;

-- LENGTH - String length
SELECT name, LENGTH(name) AS name_length FROM users;

-- TRIM - Remove whitespace
SELECT TRIM(name) FROM users;
```

### Date Functions

```sql
-- Current date/time
SELECT NOW();                    -- Current datetime
SELECT CURDATE();                -- Current date
SELECT CURTIME();                -- Current time

-- Date parts
SELECT YEAR(created_at) FROM orders;
SELECT MONTH(created_at) FROM orders;
SELECT DAY(created_at) FROM orders;

-- Date arithmetic
SELECT DATE_ADD(NOW(), INTERVAL 7 DAY);   -- 7 days from now
SELECT DATE_SUB(NOW(), INTERVAL 1 MONTH); -- 1 month ago

-- Format dates
SELECT DATE_FORMAT(created_at, '%Y-%m-%d') FROM orders;
SELECT DATE_FORMAT(created_at, '%M %d, %Y') FROM orders;

-- Orders from last 30 days
SELECT * FROM orders
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY);
```

### CASE (Conditional Logic)

```sql
-- Simple CASE
SELECT
  name,
  age,
  CASE
    WHEN age < 18 THEN 'Minor'
    WHEN age >= 18 AND age < 65 THEN 'Adult'
    ELSE 'Senior'
  END AS age_group
FROM users;

-- Price categories
SELECT
  name,
  price,
  CASE
    WHEN price < 50 THEN 'Budget'
    WHEN price < 200 THEN 'Mid-range'
    ELSE 'Premium'
  END AS price_category
FROM products;

-- In aggregations
SELECT
  COUNT(CASE WHEN age < 18 THEN 1 END) AS minors,
  COUNT(CASE WHEN age >= 18 THEN 1 END) AS adults
FROM users;
```

### COALESCE (Handle NULL)

```sql
-- Return first non-NULL value
SELECT
  name,
  COALESCE(phone, email, 'No contact info') AS contact
FROM users;

-- Default values
SELECT
  name,
  COALESCE(discount, 0) AS discount
FROM products;
```

## Practical Examples

### E-commerce Analytics

```sql
-- Top 10 customers by total spending
SELECT
  users.name,
  users.email,
  COUNT(orders.id) AS order_count,
  SUM(orders.total) AS total_spent
FROM users
INNER JOIN orders ON users.id = orders.user_id
GROUP BY users.id, users.name, users.email
ORDER BY total_spent DESC
LIMIT 10;

-- Monthly revenue
SELECT
  YEAR(created_at) AS year,
  MONTH(created_at) AS month,
  SUM(total) AS revenue,
  COUNT(*) AS order_count
FROM orders
GROUP BY YEAR(created_at), MONTH(created_at)
ORDER BY year DESC, month DESC;

-- Product popularity
SELECT
  products.name,
  COUNT(orders.id) AS times_ordered,
  SUM(orders.quantity) AS total_quantity
FROM products
LEFT JOIN orders ON products.id = orders.product_id
GROUP BY products.id, products.name
ORDER BY times_ordered DESC;

-- Customer retention (repeat customers)
SELECT
  user_id,
  COUNT(*) AS order_count
FROM orders
GROUP BY user_id
HAVING COUNT(*) > 1;
```

## Key Takeaways

1. **RDBMS** organize data in tables with relationships
2. **Primary keys** uniquely identify rows
3. **Foreign keys** create relationships between tables
4. **CRUD**: INSERT, SELECT, UPDATE, DELETE
5. **JOINs** combine data from multiple tables
6. **GROUP BY** aggregates data
7. **Subqueries** enable complex queries
8. **Views** simplify and secure data access

## Exercises

### Exercise 1: Basic Queries

Given this schema:
```sql
students: id, name, age, grade
courses: id, name, credits
enrollments: student_id, course_id, grade
```

Write queries to:
1. Get all students older than 20
2. Find students in grade 'A'
3. Count total students
4. List all courses with more than 3 credits

### Exercise 2: JOINs

1. Get all students with their enrolled courses
2. Find students not enrolled in any course
3. List courses with number of enrolled students

### Exercise 3: Advanced

1. Find students with GPA > 3.5 (A=4, B=3, C=2, D=1)
2. Get top 5 most popular courses
3. Calculate average credits per student

## Next Steps

In [Lesson 8: NoSQL Databases](./08-nosql-databases.md), we'll explore:
- MongoDB document databases
- Redis for caching
- When to use NoSQL vs SQL

---

**Practice**: Create a simple database for a library system with books, authors, and borrowers!
