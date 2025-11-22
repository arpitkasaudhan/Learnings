# SQL Joins & Relationships - Lesson 4

## 📖 Introduction to Joins

**Joins** combine rows from two or more tables based on related columns. This is the power of relational databases!

**Why Joins?**
- Avoid data duplication
- Maintain data integrity
- Query related data efficiently
- Normalize database structure

## 🔗 Types of Relationships

### 1. One-to-Many (Most Common)

One dealer has many cars.

```sql
-- Dealers table (ONE)
CREATE TABLE dealers (
    dealer_id INT PRIMARY KEY AUTO_INCREMENT,
    business_name VARCHAR(200) NOT NULL,
    city VARCHAR(100)
);

-- Cars table (MANY)
CREATE TABLE cars (
    car_id INT PRIMARY KEY AUTO_INCREMENT,
    dealer_id INT NOT NULL,
    brand VARCHAR(50),
    model VARCHAR(50),
    price DECIMAL(10,2),
    FOREIGN KEY (dealer_id) REFERENCES dealers(dealer_id)
);

-- Insert data
INSERT INTO dealers (business_name, city) VALUES
('AutoWorld', 'Delhi'),
('Car Junction', 'Mumbai');

INSERT INTO cars (dealer_id, brand, model, price) VALUES
(1, 'Maruti', 'Swift', 550000),
(1, 'Honda', 'City', 1200000),
(2, 'Hyundai', 'Creta', 1500000);
```

### 2. One-to-One

One user has one dealer profile.

```sql
-- Users table
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    phone VARCHAR(15) UNIQUE NOT NULL,
    name VARCHAR(100)
);

-- Dealer profiles (ONE-to-ONE with users)
CREATE TABLE dealer_profiles (
    dealer_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,  -- UNIQUE ensures one-to-one
    business_name VARCHAR(200),
    gstin VARCHAR(15),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

### 3. Many-to-Many

Many users save many cars (saved_cars).

```sql
-- Users table
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100)
);

-- Cars table
CREATE TABLE cars (
    car_id INT PRIMARY KEY AUTO_INCREMENT,
    brand VARCHAR(50)
);

-- Junction table (bridges the many-to-many)
CREATE TABLE saved_cars (
    user_id INT,
    car_id INT,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, car_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (car_id) REFERENCES cars(car_id)
);

-- User 1 saves car 1 and 2
INSERT INTO saved_cars (user_id, car_id) VALUES (1, 1), (1, 2);

-- User 2 saves car 1
INSERT INTO saved_cars (user_id, car_id) VALUES (2, 1);
```

## 🔄 JOIN Types

### 1. INNER JOIN (Most Common)

Returns only matching rows from both tables.

```sql
-- Find all cars with their dealer info
SELECT
    c.brand,
    c.model,
    c.price,
    d.business_name,
    d.city
FROM cars c
INNER JOIN dealers d ON c.dealer_id = d.dealer_id;
```

**Result:**
```
brand   | model | price   | business_name | city
--------|-------|---------|---------------|-------
Maruti  | Swift | 550000  | AutoWorld     | Delhi
Honda   | City  | 1200000 | AutoWorld     | Delhi
Hyundai | Creta | 1500000 | Car Junction  | Mumbai
```

**Visual Representation:**
```
Cars Table          Dealers Table
┌──────┬────────┐   ┌──────┬────────────┐
│ id=1 │ dlr=1  │───│ id=1 │ AutoWorld  │
│ id=2 │ dlr=1  │───│ id=1 │ AutoWorld  │
│ id=3 │ dlr=2  │───│ id=2 │ Car Junc   │
└──────┴────────┘   └──────┴────────────┘

INNER JOIN returns: All 3 cars with dealer info
```

### 2. LEFT JOIN (LEFT OUTER JOIN)

Returns ALL rows from left table, matching rows from right (or NULL).

```sql
-- Find all dealers and their cars (even dealers with no cars)
SELECT
    d.business_name,
    d.city,
    c.brand,
    c.model
FROM dealers d
LEFT JOIN cars c ON d.dealer_id = c.dealer_id
ORDER BY d.business_name;
```

**Result:**
```
business_name | city    | brand   | model
--------------|---------|---------|-------
AutoWorld     | Delhi   | Maruti  | Swift
AutoWorld     | Delhi   | Honda   | City
Car Junction  | Mumbai  | Hyundai | Creta
New Dealer    | Pune    | NULL    | NULL   ← No cars yet!
```

**Visual:**
```
Dealers (LEFT)      Cars (RIGHT)
┌──────┬────────┐   ┌──────┬────────┐
│ id=1 │ Auto   │───│ id=1 │ dlr=1  │
│ id=2 │ CarJun │───│ id=3 │ dlr=2  │
│ id=3 │ NewDlr │   (no match)
└──────┴────────┘   └──────┴────────┘

LEFT JOIN returns: All dealers, even those without cars
```

### 3. RIGHT JOIN (RIGHT OUTER JOIN)

Returns ALL rows from right table, matching rows from left (or NULL).

```sql
-- Find all cars and their dealers (even orphaned cars)
SELECT
    d.business_name,
    c.brand,
    c.model
FROM dealers d
RIGHT JOIN cars c ON d.dealer_id = c.dealer_id;
```

**Rarely used** - same as LEFT JOIN with tables reversed.

### 4. FULL OUTER JOIN

Returns ALL rows from both tables (NULL where no match).

```sql
-- PostgreSQL only (MySQL doesn't support FULL OUTER JOIN)
SELECT
    d.business_name,
    c.brand,
    c.model
FROM dealers d
FULL OUTER JOIN cars c ON d.dealer_id = c.dealer_id;
```

**MySQL Alternative:**
```sql
-- Combine LEFT and RIGHT with UNION
SELECT d.business_name, c.brand
FROM dealers d
LEFT JOIN cars c ON d.dealer_id = c.dealer_id

UNION

SELECT d.business_name, c.brand
FROM dealers d
RIGHT JOIN cars c ON d.dealer_id = c.dealer_id;
```

### 5. CROSS JOIN (Cartesian Product)

Every row from table 1 with every row from table 2.

```sql
-- All possible combinations of fuel types and transmission
SELECT
    f.fuel_type,
    t.transmission_type
FROM
    (SELECT 'Petrol' AS fuel_type UNION SELECT 'Diesel' UNION SELECT 'Electric') f
CROSS JOIN
    (SELECT 'Manual' AS transmission_type UNION SELECT 'Automatic') t;
```

**Result:**
```
fuel_type | transmission_type
----------|------------------
Petrol    | Manual
Petrol    | Automatic
Diesel    | Manual
Diesel    | Automatic
Electric  | Manual
Electric  | Automatic
```

**Use case:** Generating combinations, date ranges, etc.

## 💡 JOIN Syntax Variations

### Explicit JOIN (Recommended)

```sql
SELECT *
FROM cars c
INNER JOIN dealers d ON c.dealer_id = d.dealer_id;
```

### Implicit JOIN (Old style, avoid)

```sql
SELECT *
FROM cars c, dealers d
WHERE c.dealer_id = d.dealer_id;
```

**Why explicit is better:**
- More readable
- Clearer intent
- Prevents accidental cross joins
- Standard across databases

## 🔗 Multiple Joins

Join more than 2 tables!

```sql
-- Get car with dealer and user info
SELECT
    u.name AS customer_name,
    c.brand,
    c.model,
    c.price,
    d.business_name AS dealer_name,
    d.city AS dealer_city
FROM cars c
INNER JOIN dealers d ON c.dealer_id = d.dealer_id
INNER JOIN users u ON d.user_id = u.user_id
WHERE c.price > 500000;
```

### VahanHelp Example: Leads with Full Context

```sql
-- Get lead with car, dealer, and customer info
SELECT
    l.lead_id,
    l.status,
    l.created_at,
    -- Customer info
    cust.name AS customer_name,
    cust.phone AS customer_phone,
    -- Car info
    car.brand,
    car.model,
    car.year,
    car.price,
    -- Dealer info
    d.business_name AS dealer_name,
    d.city AS dealer_city,
    -- User who owns dealer
    u.name AS dealer_owner
FROM leads l
INNER JOIN users cust ON l.customer_id = cust.user_id
INNER JOIN cars car ON l.car_id = car.car_id
INNER JOIN dealers d ON car.dealer_id = d.dealer_id
INNER JOIN users u ON d.user_id = u.user_id
WHERE l.status = 'new'
ORDER BY l.created_at DESC;
```

## 🎯 Self Joins

Join a table to itself!

**Use case:** Organizational hierarchy, referrals.

```sql
-- Referral system
CREATE TABLE users (
    user_id INT PRIMARY KEY,
    name VARCHAR(100),
    referred_by INT,  -- Another user_id
    FOREIGN KEY (referred_by) REFERENCES users(user_id)
);

INSERT INTO users VALUES
(1, 'Alice', NULL),     -- Original user
(2, 'Bob', 1),          -- Referred by Alice
(3, 'Charlie', 1),      -- Referred by Alice
(4, 'David', 2);        -- Referred by Bob

-- Find who referred each user
SELECT
    u.name AS user_name,
    r.name AS referred_by_name
FROM users u
LEFT JOIN users r ON u.referred_by = r.user_id;
```

**Result:**
```
user_name | referred_by_name
----------|------------------
Alice     | NULL
Bob       | Alice
Charlie   | Alice
David     | Bob
```

## 📊 Aggregate Functions with Joins

Combine JOINs with GROUP BY!

```sql
-- Count cars per dealer
SELECT
    d.business_name,
    COUNT(c.car_id) AS total_cars,
    AVG(c.price) AS avg_price,
    MIN(c.price) AS cheapest,
    MAX(c.price) AS most_expensive
FROM dealers d
LEFT JOIN cars c ON d.dealer_id = c.dealer_id
GROUP BY d.dealer_id, d.business_name
ORDER BY total_cars DESC;
```

**Result:**
```
business_name | total_cars | avg_price | cheapest | most_expensive
--------------|------------|-----------|----------|---------------
AutoWorld     | 15         | 875000    | 450000   | 1500000
Car Junction  | 8          | 950000    | 500000   | 1800000
New Dealer    | 0          | NULL      | NULL     | NULL
```

### HAVING with Joins

```sql
-- Dealers with more than 10 cars
SELECT
    d.business_name,
    COUNT(c.car_id) AS total_cars
FROM dealers d
LEFT JOIN cars c ON d.dealer_id = c.dealer_id
GROUP BY d.dealer_id, d.business_name
HAVING COUNT(c.car_id) > 10;
```

## 🔍 Subqueries vs Joins

Sometimes you can choose between subquery or join.

### Using Subquery

```sql
-- Find cars from dealers in Delhi
SELECT *
FROM cars
WHERE dealer_id IN (
    SELECT dealer_id
    FROM dealers
    WHERE city = 'Delhi'
);
```

### Using JOIN (Often Faster)

```sql
-- Same result, often more efficient
SELECT c.*
FROM cars c
INNER JOIN dealers d ON c.dealer_id = d.dealer_id
WHERE d.city = 'Delhi';
```

**When to use what:**
- **JOIN**: When you need data from multiple tables
- **Subquery**: When you only need filtered IDs, or complex logic

## 🏃 Practical Exercises

### Exercise 1: VahanHelp Schema

Create the following tables:

```sql
-- Users
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    phone VARCHAR(15),
    role ENUM('customer', 'dealer', 'admin') DEFAULT 'customer'
);

-- Dealers
CREATE TABLE dealers (
    dealer_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    business_name VARCHAR(200),
    city VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Cars
CREATE TABLE cars (
    car_id INT PRIMARY KEY AUTO_INCREMENT,
    dealer_id INT NOT NULL,
    brand VARCHAR(50),
    model VARCHAR(50),
    year INT,
    price DECIMAL(10,2),
    status ENUM('active', 'sold', 'inactive') DEFAULT 'active',
    FOREIGN KEY (dealer_id) REFERENCES dealers(dealer_id)
);

-- Leads
CREATE TABLE leads (
    lead_id INT PRIMARY KEY AUTO_INCREMENT,
    car_id INT NOT NULL,
    customer_id INT NOT NULL,
    message TEXT,
    status ENUM('new', 'contacted', 'converted', 'lost') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (car_id) REFERENCES cars(car_id),
    FOREIGN KEY (customer_id) REFERENCES users(user_id)
);

-- Saved Cars (Many-to-Many)
CREATE TABLE saved_cars (
    user_id INT,
    car_id INT,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, car_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (car_id) REFERENCES cars(car_id)
);
```

### Exercise 2: Query Practice

```sql
-- 1. Find all cars with dealer business name
SELECT c.brand, c.model, c.price, d.business_name
FROM cars c
INNER JOIN dealers d ON c.dealer_id = d.dealer_id;

-- 2. Find all active cars with dealer and owner info
SELECT
    c.brand, c.model, c.year, c.price,
    d.business_name,
    u.name AS owner_name, u.phone
FROM cars c
INNER JOIN dealers d ON c.dealer_id = d.dealer_id
INNER JOIN users u ON d.user_id = u.user_id
WHERE c.status = 'active';

-- 3. Count leads per dealer
SELECT
    d.business_name,
    COUNT(l.lead_id) AS total_leads
FROM dealers d
LEFT JOIN cars c ON d.dealer_id = c.dealer_id
LEFT JOIN leads l ON c.car_id = l.car_id
GROUP BY d.dealer_id, d.business_name;

-- 4. Find customers who saved specific car
SELECT
    u.name,
    u.phone,
    sc.saved_at
FROM saved_cars sc
INNER JOIN users u ON sc.user_id = u.user_id
WHERE sc.car_id = 1;

-- 5. Find all new leads with full details
SELECT
    l.lead_id,
    l.message,
    l.created_at,
    -- Customer
    cust.name AS customer_name,
    cust.phone AS customer_phone,
    -- Car
    c.brand, c.model, c.price,
    -- Dealer
    d.business_name
FROM leads l
INNER JOIN users cust ON l.customer_id = cust.user_id
INNER JOIN cars c ON l.car_id = c.car_id
INNER JOIN dealers d ON c.dealer_id = d.dealer_id
WHERE l.status = 'new'
ORDER BY l.created_at DESC;

-- 6. Dealers with no cars (using LEFT JOIN)
SELECT d.business_name, d.city
FROM dealers d
LEFT JOIN cars c ON d.dealer_id = c.dealer_id
WHERE c.car_id IS NULL;

-- 7. Most saved cars
SELECT
    c.brand, c.model,
    COUNT(sc.user_id) AS save_count
FROM cars c
LEFT JOIN saved_cars sc ON c.car_id = sc.car_id
GROUP BY c.car_id, c.brand, c.model
ORDER BY save_count DESC
LIMIT 10;

-- 8. Customers with most saved cars
SELECT
    u.name,
    COUNT(sc.car_id) AS saved_count
FROM users u
INNER JOIN saved_cars sc ON u.user_id = sc.user_id
GROUP BY u.user_id, u.name
HAVING COUNT(sc.car_id) >= 3;
```

### Exercise 3: Complex Queries

```sql
-- 1. Dealer dashboard stats
SELECT
    d.dealer_id,
    d.business_name,
    COUNT(DISTINCT c.car_id) AS total_listings,
    COUNT(DISTINCT CASE WHEN c.status = 'active' THEN c.car_id END) AS active_listings,
    COUNT(DISTINCT CASE WHEN c.status = 'sold' THEN c.car_id END) AS sold_cars,
    COUNT(DISTINCT l.lead_id) AS total_leads,
    COUNT(DISTINCT CASE WHEN l.status = 'new' THEN l.lead_id END) AS new_leads
FROM dealers d
LEFT JOIN cars c ON d.dealer_id = c.dealer_id
LEFT JOIN leads l ON c.car_id = l.car_id
WHERE d.dealer_id = 1
GROUP BY d.dealer_id, d.business_name;

-- 2. Popular cars (most viewed, most saved, most leads)
SELECT
    c.car_id,
    c.brand,
    c.model,
    c.price,
    COUNT(DISTINCT sc.user_id) AS save_count,
    COUNT(DISTINCT l.lead_id) AS lead_count,
    d.business_name
FROM cars c
LEFT JOIN saved_cars sc ON c.car_id = sc.car_id
LEFT JOIN leads l ON c.car_id = l.car_id
INNER JOIN dealers d ON c.dealer_id = d.dealer_id
WHERE c.status = 'active'
GROUP BY c.car_id, c.brand, c.model, c.price, d.business_name
ORDER BY save_count DESC, lead_count DESC
LIMIT 20;

-- 3. Conversion rate per dealer
SELECT
    d.business_name,
    COUNT(DISTINCT l.lead_id) AS total_leads,
    COUNT(DISTINCT CASE WHEN l.status = 'converted' THEN l.lead_id END) AS converted,
    ROUND(
        COUNT(DISTINCT CASE WHEN l.status = 'converted' THEN l.lead_id END) * 100.0 /
        NULLIF(COUNT(DISTINCT l.lead_id), 0),
        2
    ) AS conversion_rate
FROM dealers d
LEFT JOIN cars c ON d.dealer_id = c.dealer_id
LEFT JOIN leads l ON c.car_id = l.car_id
GROUP BY d.dealer_id, d.business_name
HAVING COUNT(DISTINCT l.lead_id) > 0
ORDER BY conversion_rate DESC;
```

## ⚠️ Common Mistakes

### 1. Forgetting JOIN Condition

```sql
-- ❌ BAD: Cartesian product (every dealer with every car!)
SELECT *
FROM dealers d, cars c;

-- ✅ GOOD: Specify relationship
SELECT *
FROM dealers d
INNER JOIN cars c ON d.dealer_id = c.dealer_id;
```

### 2. Wrong JOIN Type

```sql
-- ❌ BAD: INNER JOIN excludes dealers without cars
SELECT d.business_name, COUNT(c.car_id)
FROM dealers d
INNER JOIN cars c ON d.dealer_id = c.dealer_id
GROUP BY d.business_name;

-- ✅ GOOD: LEFT JOIN includes all dealers
SELECT d.business_name, COUNT(c.car_id)
FROM dealers d
LEFT JOIN cars c ON d.dealer_id = c.dealer_id
GROUP BY d.business_name;
```

### 3. Ambiguous Column Names

```sql
-- ❌ BAD: Which table's 'name'?
SELECT name
FROM users u
JOIN dealers d ON u.user_id = d.user_id;

-- ✅ GOOD: Always use table alias
SELECT u.name AS user_name, d.business_name
FROM users u
JOIN dealers d ON u.user_id = d.user_id;
```

## ✅ Key Takeaways

1. **INNER JOIN** - Only matching rows from both tables
2. **LEFT JOIN** - All rows from left table + matches from right
3. **RIGHT JOIN** - All rows from right table + matches from left
4. **Multiple JOINs** - Chain JOINs to combine many tables
5. **Self JOIN** - Join table to itself for hierarchies
6. **Aliases** - Use `AS` to make queries readable
7. **Foreign Keys** - Enforce relationships at database level
8. **Performance** - Index foreign key columns!

## 🚀 Next Lesson

In [Lesson 5: Advanced Queries](./05-advanced-queries.md), we'll master:
- Subqueries (nested SELECT)
- Common Table Expressions (CTEs)
- Window Functions
- UNION and Set Operations
- Complex analytical queries

---

**Joins are the heart of relational databases - master them! 💪**
