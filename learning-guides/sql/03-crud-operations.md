# SQL CRUD Operations - Lesson 3

## 📖 Mastering Data Manipulation

CRUD = **C**reate, **R**ead, **U**pdate, **D**elete - the four fundamental operations for any database.

## 📝 CREATE (INSERT)

### Basic Insert

```sql
-- Single row
INSERT INTO users (name, phone, email, role)
VALUES ('Rahul Kumar', '9876543210', 'rahul@example.com', 'customer');

-- Multiple rows
INSERT INTO users (name, phone, email, role) VALUES
('Priya Sharma', '9876543211', 'priya@example.com', 'customer'),
('Amit Patel', '9876543212', 'amit@example.com', 'dealer'),
('Sneha Gupta', '9876543213', 'sneha@example.com', 'customer');
```

### Insert with Default Values

```sql
-- Only specify required fields
INSERT INTO users (name, phone)
VALUES ('Vijay Singh', '9876543214');
-- Other fields use DEFAULT values

-- Explicitly use DEFAULT
INSERT INTO users (name, phone, role, created_at)
VALUES ('Anita Reddy', '9876543215', DEFAULT, DEFAULT);
```

### Insert from SELECT

```sql
-- Copy data from one table to another
INSERT INTO users_backup
SELECT * FROM users WHERE role = 'customer';

-- Insert specific fields
INSERT INTO active_users (name, phone)
SELECT name, phone FROM users WHERE is_active = TRUE;
```

### Insert and Return (PostgreSQL/MySQL 8.0+)

```sql
-- PostgreSQL
INSERT INTO users (name, phone)
VALUES ('Test User', '9999999999')
RETURNING user_id, created_at;

-- MySQL 8.0+
INSERT INTO users (name, phone)
VALUES ('Test User', '9999999999');
SELECT LAST_INSERT_ID();
```

## 🔍 READ (SELECT)

### Basic SELECT

```sql
-- All columns
SELECT * FROM users;

-- Specific columns
SELECT name, phone, email FROM users;

-- With aliases
SELECT
    name AS full_name,
    phone AS mobile_number,
    email AS email_address
FROM users;
```

### WHERE Clause

```sql
-- Single condition
SELECT * FROM users WHERE role = 'customer';

-- Multiple conditions (AND)
SELECT * FROM cars
WHERE brand = 'Maruti' AND year >= 2020;

-- Multiple conditions (OR)
SELECT * FROM cars
WHERE brand = 'Maruti' OR brand = 'Honda';

-- Combining AND/OR
SELECT * FROM cars
WHERE (brand = 'Maruti' OR brand = 'Honda')
  AND year >= 2020;

-- NOT
SELECT * FROM users WHERE NOT role = 'admin';
```

### Comparison Operators

```sql
-- Equal
SELECT * FROM cars WHERE price = 500000;

-- Not equal
SELECT * FROM cars WHERE brand != 'Maruti';
SELECT * FROM cars WHERE brand <> 'Maruti';  -- Same as !=

-- Greater than
SELECT * FROM cars WHERE price > 500000;

-- Greater than or equal
SELECT * FROM cars WHERE year >= 2020;

-- Less than
SELECT * FROM cars WHERE kms_driven < 50000;

-- Less than or equal
SELECT * FROM cars WHERE price <= 1000000;

-- Between
SELECT * FROM cars WHERE price BETWEEN 500000 AND 1000000;

-- In list
SELECT * FROM cars WHERE brand IN ('Maruti', 'Honda', 'Hyundai');

-- Not in list
SELECT * FROM cars WHERE fuel_type NOT IN ('Diesel', 'CNG');
```

### Pattern Matching (LIKE)

```sql
-- Starts with
SELECT * FROM users WHERE name LIKE 'Rahul%';

-- Ends with
SELECT * FROM users WHERE email LIKE '%@gmail.com';

-- Contains
SELECT * FROM cars WHERE model LIKE '%Swift%';

-- Exact length (5 characters)
SELECT * FROM cars WHERE brand LIKE '_____';  -- 5 underscores

-- Case insensitive (PostgreSQL)
SELECT * FROM users WHERE name ILIKE 'rahul%';
```

**Wildcards:**
- `%` = any number of characters
- `_` = exactly one character

### NULL Handling

```sql
-- Find NULL values
SELECT * FROM users WHERE email IS NULL;

-- Find non-NULL values
SELECT * FROM users WHERE email IS NOT NULL;

-- COALESCE (return first non-NULL)
SELECT
    name,
    COALESCE(email, 'No email provided') AS email
FROM users;

-- NULLIF (return NULL if equal)
SELECT NULLIF(kms_driven, 0) FROM cars;  -- NULL if 0
```

### Sorting (ORDER BY)

```sql
-- Ascending (default)
SELECT * FROM cars ORDER BY price;
SELECT * FROM cars ORDER BY price ASC;

-- Descending
SELECT * FROM cars ORDER BY price DESC;

-- Multiple columns
SELECT * FROM cars
ORDER BY brand ASC, price DESC;

-- Sort with NULL handling
SELECT * FROM users
ORDER BY email NULLS LAST;  -- PostgreSQL

-- Sort by expression
SELECT * FROM cars
ORDER BY (price / year) DESC;  -- Best value
```

### Limiting Results

```sql
-- Limit (MySQL, PostgreSQL)
SELECT * FROM cars ORDER BY price LIMIT 10;

-- Limit with offset (skip first 10)
SELECT * FROM cars ORDER BY price LIMIT 10 OFFSET 10;

-- Alternative syntax
SELECT * FROM cars ORDER BY price OFFSET 10 ROWS FETCH NEXT 10 ROWS ONLY;

-- Top (SQL Server)
SELECT TOP 10 * FROM cars ORDER BY price;
```

### Pagination

```sql
-- Page 1 (first 10 records)
SELECT * FROM cars ORDER BY created_at DESC LIMIT 10 OFFSET 0;

-- Page 2 (next 10 records)
SELECT * FROM cars ORDER BY created_at DESC LIMIT 10 OFFSET 10;

-- Page 3
SELECT * FROM cars ORDER BY created_at DESC LIMIT 10 OFFSET 20;

-- Generic pagination formula
-- OFFSET = (page_number - 1) * page_size
```

### DISTINCT

```sql
-- Unique brands
SELECT DISTINCT brand FROM cars;

-- Unique combinations
SELECT DISTINCT brand, fuel_type FROM cars;

-- Count unique
SELECT COUNT(DISTINCT brand) AS unique_brands FROM cars;
```

### Aggregate Functions

```sql
-- Count
SELECT COUNT(*) FROM cars;
SELECT COUNT(email) FROM users;  -- Excludes NULL
SELECT COUNT(*) FROM cars WHERE is_active = TRUE;

-- Sum
SELECT SUM(price) FROM cars;
SELECT SUM(kms_driven) FROM cars WHERE brand = 'Maruti';

-- Average
SELECT AVG(price) FROM cars;
SELECT AVG(year) FROM cars WHERE brand = 'Honda';

-- Min/Max
SELECT MIN(price) FROM cars;
SELECT MAX(year) FROM cars;

-- Multiple aggregates
SELECT
    COUNT(*) AS total_cars,
    AVG(price) AS avg_price,
    MIN(price) AS min_price,
    MAX(price) AS max_price,
    SUM(price) AS total_value
FROM cars
WHERE is_active = TRUE;
```

### GROUP BY

```sql
-- Count cars by brand
SELECT brand, COUNT(*) AS car_count
FROM cars
GROUP BY brand;

-- Average price by brand
SELECT brand, AVG(price) AS avg_price
FROM cars
GROUP BY brand
ORDER BY avg_price DESC;

-- Multiple columns
SELECT brand, fuel_type, COUNT(*) AS count
FROM cars
GROUP BY brand, fuel_type;

-- With HAVING (filter groups)
SELECT brand, COUNT(*) AS count
FROM cars
GROUP BY brand
HAVING COUNT(*) >= 5;  -- Only brands with 5+ cars

-- WHERE vs HAVING
SELECT brand, AVG(price) AS avg_price
FROM cars
WHERE year >= 2020  -- Filter before grouping
GROUP BY brand
HAVING AVG(price) > 800000  -- Filter after grouping
ORDER BY avg_price DESC;
```

## ✏️ UPDATE

### Basic Update

```sql
-- Update single field
UPDATE users
SET is_verified = TRUE
WHERE user_id = 1;

-- Update multiple fields
UPDATE users
SET
    name = 'Rahul Kumar Singh',
    email = 'rahul.singh@example.com',
    updated_at = CURRENT_TIMESTAMP
WHERE user_id = 1;
```

### Update with Conditions

```sql
-- Update all customers
UPDATE users
SET membership_level = 'silver'
WHERE role = 'customer';

-- Update based on multiple conditions
UPDATE cars
SET status = 'sold'
WHERE car_id = 123 AND dealer_id = 456;

-- Update with NULL check
UPDATE users
SET email = 'noemail@example.com'
WHERE email IS NULL;
```

### Update with Calculations

```sql
-- Increase price by 10%
UPDATE cars
SET price = price * 1.10
WHERE brand = 'Maruti';

-- Increment counter
UPDATE users
SET login_count = login_count + 1
WHERE user_id = 1;

-- Set based on condition (CASE)
UPDATE cars
SET discount = CASE
    WHEN year < 2018 THEN 0.20
    WHEN year < 2020 THEN 0.10
    ELSE 0.05
END;
```

### Update from Another Table

```sql
-- Update based on JOIN (PostgreSQL)
UPDATE users u
SET total_listings = (
    SELECT COUNT(*)
    FROM cars c
    WHERE c.dealer_id = u.user_id
)
WHERE role = 'dealer';

-- MySQL syntax
UPDATE users u
JOIN (
    SELECT dealer_id, COUNT(*) AS count
    FROM cars
    GROUP BY dealer_id
) c ON u.user_id = c.dealer_id
SET u.total_listings = c.count;
```

### Conditional Update

```sql
-- Only update if value is greater
UPDATE cars
SET highest_bid = 550000
WHERE car_id = 1 AND highest_bid < 550000;

-- Update if not already set
UPDATE users
SET first_login = CURRENT_TIMESTAMP
WHERE first_login IS NULL AND user_id = 1;
```

## 🗑️ DELETE

### Basic Delete

```sql
-- Delete specific record
DELETE FROM users WHERE user_id = 1;

-- Delete with multiple conditions
DELETE FROM cars
WHERE status = 'sold' AND sold_at < '2023-01-01';
```

### Delete All Records

```sql
-- Delete all (keeps table structure)
DELETE FROM temp_data;

-- Faster way to delete all
TRUNCATE TABLE temp_data;  -- Resets auto-increment

-- Drop table entirely
DROP TABLE temp_data;  -- Removes table
```

### Conditional Delete

```sql
-- Delete old records
DELETE FROM logs WHERE created_at < NOW() - INTERVAL '30 days';

-- Delete based on subquery
DELETE FROM users
WHERE user_id IN (
    SELECT user_id FROM banned_users
);

-- Delete with NOT EXISTS
DELETE FROM cars
WHERE NOT EXISTS (
    SELECT 1 FROM dealers WHERE dealer_id = cars.dealer_id
);
```

### Safe Delete Practices

```sql
-- Always use WHERE!
-- ❌ DANGEROUS: Deletes everything
DELETE FROM users;

-- ✅ SAFE: Specific condition
DELETE FROM users WHERE user_id = 1;

-- Test with SELECT first
SELECT * FROM users WHERE is_active = FALSE;
-- Then delete
DELETE FROM users WHERE is_active = FALSE;

-- Use transactions for important deletes
BEGIN;
DELETE FROM important_data WHERE condition = true;
-- Check result
SELECT COUNT(*) FROM important_data;
-- If wrong: ROLLBACK;
-- If correct: COMMIT;
```

## 🎯 Real-World Examples

### Example 1: Complete User Management

```sql
-- Create user
INSERT INTO users (name, phone, email, role)
VALUES ('Rahul Kumar', '9876543210', 'rahul@example.com', 'customer')
RETURNING user_id;

-- Read user
SELECT * FROM users WHERE phone = '9876543210';

-- Update user
UPDATE users
SET
    is_verified = TRUE,
    verified_at = CURRENT_TIMESTAMP
WHERE phone = '9876543210';

-- Soft delete (mark as inactive)
UPDATE users
SET
    is_active = FALSE,
    deleted_at = CURRENT_TIMESTAMP
WHERE user_id = 1;

-- Hard delete
DELETE FROM users WHERE user_id = 1;
```

### Example 2: Car Listing Management

```sql
-- Create listing
INSERT INTO cars (
    dealer_id, brand, model, year, price,
    kms_driven, fuel_type, transmission, city
) VALUES (
    1, 'Maruti', 'Swift', 2020, 550000,
    25000, 'Petrol', 'Manual', 'Delhi'
);

-- Search cars
SELECT
    car_id, brand, model, year, price,
    CONCAT(brand, ' ', model, ' ', year) AS full_name
FROM cars
WHERE
    city = 'Delhi'
    AND price BETWEEN 400000 AND 600000
    AND year >= 2018
    AND fuel_type = 'Petrol'
ORDER BY price ASC
LIMIT 20;

-- Update views
UPDATE cars
SET views_count = views_count + 1
WHERE car_id = 123;

-- Mark as sold
UPDATE cars
SET
    status = 'sold',
    sold_at = CURRENT_TIMESTAMP,
    sold_price = 540000
WHERE car_id = 123;

-- Get dealer statistics
SELECT
    dealer_id,
    COUNT(*) AS total_listings,
    COUNT(CASE WHEN status = 'active' THEN 1 END) AS active_listings,
    COUNT(CASE WHEN status = 'sold' THEN 1 END) AS sold_count,
    AVG(price) AS avg_price,
    SUM(CASE WHEN status = 'sold' THEN sold_price ELSE 0 END) AS total_sales
FROM cars
WHERE dealer_id = 1
GROUP BY dealer_id;
```

### Example 3: Search with Filters

```sql
-- Advanced search
SELECT
    c.*,
    d.business_name AS dealer_name,
    d.city AS dealer_city,
    (SELECT COUNT(*) FROM leads WHERE car_id = c.car_id) AS lead_count
FROM cars c
JOIN dealers d ON c.dealer_id = d.dealer_id
WHERE
    c.status = 'active'
    AND c.brand IN ('Maruti', 'Honda', 'Hyundai')
    AND c.price <= 1000000
    AND c.year >= 2019
    AND c.kms_driven <= 50000
    AND (c.city = 'Delhi' OR c.city = 'Mumbai')
ORDER BY
    CASE
        WHEN c.year >= 2022 THEN 1
        WHEN c.year >= 2020 THEN 2
        ELSE 3
    END,
    c.price ASC
LIMIT 50;
```

## 🏃 Practical Exercises

### Exercise 1: User Operations

```sql
-- 1. Insert 3 users
INSERT INTO users (name, phone, email, role) VALUES
('Amit Shah', '9111111111', 'amit@example.com', 'customer'),
('Priya Verma', '9222222222', 'priya@example.com', 'dealer'),
('Suresh Kumar', '9333333333', 'suresh@example.com', 'customer');

-- 2. Find all customers
SELECT * FROM users WHERE role = 'customer';

-- 3. Find users without email
SELECT * FROM users WHERE email IS NULL;

-- 4. Update a user's email
UPDATE users SET email = 'newmail@example.com' WHERE phone = '9111111111';

-- 5. Count users by role
SELECT role, COUNT(*) AS count FROM users GROUP BY role;

-- 6. Delete unverified users older than 30 days
DELETE FROM users
WHERE is_verified = FALSE
  AND created_at < NOW() - INTERVAL '30 days';
```

### Exercise 2: Car Search Queries

```sql
-- 1. Find cars under 8 lakhs
SELECT * FROM cars WHERE price < 800000;

-- 2. Find automatic cars in Delhi
SELECT * FROM cars WHERE transmission = 'Automatic' AND city = 'Delhi';

-- 3. Find cars between 2019-2022
SELECT * FROM cars WHERE year BETWEEN 2019 AND 2022;

-- 4. Find Maruti or Honda cars with less than 30k kms
SELECT * FROM cars
WHERE (brand = 'Maruti' OR brand = 'Honda')
  AND kms_driven < 30000;

-- 5. Average price by brand (only brands with 3+ cars)
SELECT brand, AVG(price) AS avg_price, COUNT(*) AS count
FROM cars
GROUP BY brand
HAVING COUNT(*) >= 3;

-- 6. Most expensive car of each brand
SELECT brand, MAX(price) AS max_price
FROM cars
GROUP BY brand;
```

## ✅ Key Takeaways

1. **SELECT**: Retrieve data with filters, sorting, grouping
2. **INSERT**: Add new records with default values
3. **UPDATE**: Modify existing records, use WHERE clause!
4. **DELETE**: Remove records carefully, always test with SELECT first
5. **WHERE**: Filter rows before grouping
6. **HAVING**: Filter groups after aggregation
7. **Aggregates**: COUNT, SUM, AVG, MIN, MAX
8. **GROUP BY**: Summarize data
9. **ORDER BY**: Sort results
10. **LIMIT/OFFSET**: Pagination

## 🚀 Next Lesson

In [Lesson 4: Joins & Relationships](./04-joins-relationships.md), we'll learn:
- INNER JOIN
- LEFT/RIGHT/FULL OUTER JOIN
- Foreign key relationships
- One-to-many, many-to-many
- Self joins
- Complex multi-table queries

---

**Practice these operations daily - they're the foundation of SQL! 💪**
