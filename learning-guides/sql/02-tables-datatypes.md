# SQL Tables & Data Types - Lesson 2

## 📖 Understanding Data Types

Data types define what kind of data a column can hold. Choosing the right data type is crucial for:
- **Storage efficiency** - Save disk space
- **Performance** - Faster queries
- **Data integrity** - Prevent invalid data

## 🔢 Numeric Data Types

### Integers

```sql
-- Different integer sizes
TINYINT     -- -128 to 127 (1 byte)
SMALLINT    -- -32,768 to 32,767 (2 bytes)
MEDIUMINT   -- -8,388,608 to 8,388,607 (3 bytes) [MySQL]
INT         -- -2 billion to 2 billion (4 bytes)
BIGINT      -- Very large numbers (8 bytes)

-- Example
CREATE TABLE products (
    product_id BIGINT PRIMARY KEY,
    quantity SMALLINT,
    rating TINYINT
);
```

**Use Cases:**
- `TINYINT`: Age, ratings (1-5), boolean (0/1)
- `SMALLINT`: Quantity, year
- `INT`: IDs, counts
- `BIGINT`: Large IDs, phone numbers as numbers

### Decimal/Numeric (Exact)

```sql
-- For precise calculations (money, measurements)
DECIMAL(precision, scale)
NUMERIC(precision, scale)  -- Same as DECIMAL

-- precision = total digits
-- scale = digits after decimal

-- Example
CREATE TABLE financial (
    price DECIMAL(10, 2),     -- Max: 99999999.99
    tax DECIMAL(5, 2),        -- Max: 999.99
    weight DECIMAL(8, 3)      -- Max: 99999.999
);
```

**Use Cases:**
- Money (always use DECIMAL, not FLOAT!)
- Percentages
- Measurements requiring precision

### Floating Point (Approximate)

```sql
FLOAT       -- 4 bytes, ~7 decimal digits precision
DOUBLE      -- 8 bytes, ~15 decimal digits precision

-- Example
CREATE TABLE scientific_data (
    temperature FLOAT,
    coordinates DOUBLE
);
```

**⚠️ Warning:** Never use FLOAT/DOUBLE for money! They're approximate.

```sql
-- ❌ BAD: Will cause rounding errors
price FLOAT

-- ✅ GOOD: Exact calculations
price DECIMAL(10, 2)
```

## 📝 String Data Types

### Character Types

```sql
-- Fixed length (pads with spaces)
CHAR(n)         -- Exactly n characters

-- Variable length (saves space)
VARCHAR(n)      -- Up to n characters

-- Example
CREATE TABLE users (
    country_code CHAR(2),       -- Always 2: 'IN', 'US'
    name VARCHAR(100),          -- Up to 100 chars
    email VARCHAR(255)          -- Email addresses
);
```

**CHAR vs VARCHAR:**

```sql
-- CHAR(10)
'Hello'     → 'Hello     ' (10 bytes)
'Hi'        → 'Hi        ' (10 bytes)

-- VARCHAR(10)
'Hello'     → 'Hello' (5 bytes + overhead)
'Hi'        → 'Hi' (2 bytes + overhead)
```

**Use Cases:**
- `CHAR`: Fixed-length codes (country codes, status codes)
- `VARCHAR`: Names, emails, descriptions

### Text Types

```sql
TINYTEXT    -- Up to 255 chars
TEXT        -- Up to 65,535 chars (~64 KB)
MEDIUMTEXT  -- Up to 16 MB
LONGTEXT    -- Up to 4 GB

-- Example
CREATE TABLE articles (
    title VARCHAR(200),
    summary TEXT,
    content MEDIUMTEXT,
    author_bio TINYTEXT
);
```

**Use Cases:**
- `TEXT`: Comments, descriptions
- `MEDIUMTEXT`: Blog posts, articles
- `LONGTEXT`: Books, large documents

## 📅 Date and Time Types

```sql
DATE            -- 'YYYY-MM-DD'
TIME            -- 'HH:MM:SS'
DATETIME        -- 'YYYY-MM-DD HH:MM:SS'
TIMESTAMP       -- Unix timestamp (auto-updates)
YEAR            -- 'YYYY'

-- Example
CREATE TABLE events (
    event_id INT PRIMARY KEY,
    event_name VARCHAR(100),
    event_date DATE,
    start_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert examples
INSERT INTO events (event_id, event_name, event_date, start_time) VALUES
(1, 'Car Launch', '2024-12-01', '10:30:00');
```

**DATETIME vs TIMESTAMP:**

```sql
DATETIME    -- Stores what you give it (no timezone conversion)
TIMESTAMP   -- Stores UTC, converts based on timezone
```

**Use Cases:**
- `DATE`: Birthdays, deadlines
- `DATETIME`: Appointment times
- `TIMESTAMP`: Record creation/modification (auto-updates!)

## ✅ Boolean/Logical

```sql
-- MySQL uses TINYINT(1)
BOOLEAN     -- TRUE (1) or FALSE (0)
BOOL        -- Same as BOOLEAN

-- Example
CREATE TABLE users (
    user_id INT PRIMARY KEY,
    name VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    is_dealer BOOLEAN DEFAULT FALSE
);

-- Insert
INSERT INTO users (user_id, name, is_verified, is_dealer) VALUES
(1, 'Rahul', TRUE, FALSE),
(2, 'Dealer XYZ', TRUE, TRUE);

-- Query
SELECT * FROM users WHERE is_dealer = TRUE;
SELECT * FROM users WHERE is_verified;  -- Shorthand for = TRUE
```

## 🎨 Other Important Types

### ENUM (Enumeration)

```sql
-- Predefined list of values
CREATE TABLE cars (
    car_id INT PRIMARY KEY,
    brand VARCHAR(50),
    fuel_type ENUM('Petrol', 'Diesel', 'Electric', 'Hybrid'),
    transmission ENUM('Manual', 'Automatic')
);

INSERT INTO cars VALUES (1, 'Maruti Swift', 'Petrol', 'Manual');
-- INSERT INTO cars VALUES (2, 'Tesla', 'Gas', 'Auto'); -- ❌ Error!
```

### JSON (Modern databases)

```sql
-- Store JSON data (PostgreSQL, MySQL 5.7+)
CREATE TABLE user_preferences (
    user_id INT PRIMARY KEY,
    settings JSON
);

INSERT INTO user_preferences VALUES (
    1,
    '{"theme": "dark", "notifications": true, "language": "en"}'
);

-- Query JSON (PostgreSQL)
SELECT settings->>'theme' FROM user_preferences WHERE user_id = 1;
```

### Binary Data

```sql
BINARY(n)       -- Fixed-length binary
VARBINARY(n)    -- Variable-length binary
BLOB            -- Binary Large Object
MEDIUMBLOB
LONGBLOB

-- Example (usually avoid storing files in DB)
CREATE TABLE files (
    file_id INT PRIMARY KEY,
    file_name VARCHAR(255),
    file_data BLOB  -- Small files only!
);
```

**⚠️ Best Practice:** Store file paths, not files themselves!

```sql
-- ❌ BAD: Storing actual image
image_data BLOB

-- ✅ GOOD: Storing path/URL
image_url VARCHAR(500)  -- 'https://s3.../car123.jpg'
```

## 🔒 Constraints

Constraints enforce rules on data.

### NOT NULL

```sql
CREATE TABLE users (
    user_id INT PRIMARY KEY,
    phone VARCHAR(15) NOT NULL,     -- Must have value
    email VARCHAR(100)              -- Can be NULL
);

-- ✅ Works
INSERT INTO users VALUES (1, '9876543210', NULL);

-- ❌ Error: phone cannot be NULL
INSERT INTO users VALUES (2, NULL, 'test@example.com');
```

### UNIQUE

```sql
CREATE TABLE users (
    user_id INT PRIMARY KEY,
    phone VARCHAR(15) UNIQUE NOT NULL,  -- No duplicates
    email VARCHAR(100) UNIQUE           -- Can be NULL, but if set, must be unique
);

-- ✅ Works
INSERT INTO users VALUES (1, '9876543210', 'user1@example.com');

-- ❌ Error: Duplicate phone
INSERT INTO users VALUES (2, '9876543210', 'user2@example.com');
```

### PRIMARY KEY

```sql
-- Option 1: Inline
CREATE TABLE users (
    user_id INT PRIMARY KEY,
    name VARCHAR(100)
);

-- Option 2: At end of table
CREATE TABLE users (
    user_id INT,
    name VARCHAR(100),
    PRIMARY KEY (user_id)
);

-- Option 3: Composite primary key (multiple columns)
CREATE TABLE order_items (
    order_id INT,
    product_id INT,
    quantity INT,
    PRIMARY KEY (order_id, product_id)
);
```

**Rules:**
- Must be UNIQUE
- Cannot be NULL
- Only ONE primary key per table (but can be composite)

### FOREIGN KEY

```sql
-- Links tables together
CREATE TABLE dealers (
    dealer_id INT PRIMARY KEY,
    dealer_name VARCHAR(100)
);

CREATE TABLE cars (
    car_id INT PRIMARY KEY,
    brand VARCHAR(50),
    dealer_id INT,
    FOREIGN KEY (dealer_id) REFERENCES dealers(dealer_id)
);

-- ✅ Works (dealer 1 exists)
INSERT INTO dealers VALUES (1, 'AutoWorld');
INSERT INTO cars VALUES (1, 'Maruti', 1);

-- ❌ Error: dealer 999 doesn't exist
INSERT INTO cars VALUES (2, 'Honda', 999);
```

### CHECK

```sql
CREATE TABLE cars (
    car_id INT PRIMARY KEY,
    brand VARCHAR(50),
    year INT CHECK (year >= 1900 AND year <= 2100),
    price DECIMAL(10,2) CHECK (price > 0),
    kms_driven INT CHECK (kms_driven >= 0),
    rating TINYINT CHECK (rating BETWEEN 1 AND 5)
);

-- ❌ Error: Invalid year
INSERT INTO cars VALUES (1, 'Maruti', 1800, 500000, 10000, 4);

-- ❌ Error: Negative price
INSERT INTO cars VALUES (2, 'Honda', 2020, -100, 10000, 4);
```

### DEFAULT

```sql
CREATE TABLE users (
    user_id INT PRIMARY KEY,
    name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'customer',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Uses defaults
INSERT INTO users (user_id, name) VALUES (1, 'Rahul');
-- Results in: (1, 'Rahul', 'customer', TRUE, '2024-11-18 10:30:00')
```

### AUTO_INCREMENT

```sql
-- MySQL
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100)
);

-- PostgreSQL uses SERIAL
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100)
);

-- Insert without specifying ID
INSERT INTO users (name) VALUES ('Rahul');   -- Gets ID 1
INSERT INTO users (name) VALUES ('Priya');   -- Gets ID 2
INSERT INTO users (name) VALUES ('Amit');    -- Gets ID 3
```

## 🎯 Complete Example: VahanHelp Tables

```sql
-- Users table
CREATE TABLE users (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    phone VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    name VARCHAR(100),
    role ENUM('customer', 'dealer', 'admin') DEFAULT 'customer',
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Dealers table
CREATE TABLE dealers (
    dealer_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNIQUE NOT NULL,
    business_name VARCHAR(200) NOT NULL,
    gstin VARCHAR(15) UNIQUE,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
    total_ratings INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Cars table
CREATE TABLE cars (
    car_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    dealer_id BIGINT NOT NULL,

    -- Basic info
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    variant VARCHAR(100),
    year INT NOT NULL CHECK (year >= 1950 AND year <= 2100),

    -- Technical details
    fuel_type ENUM('Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid') NOT NULL,
    transmission ENUM('Manual', 'Automatic') NOT NULL,
    kms_driven INT CHECK (kms_driven >= 0),
    owner_number TINYINT CHECK (owner_number >= 1 AND owner_number <= 5),

    -- Pricing
    price DECIMAL(12,2) NOT NULL CHECK (price > 0),

    -- Location
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),

    -- Status
    status ENUM('draft', 'active', 'sold', 'inactive') DEFAULT 'draft',

    -- Metadata
    views_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (dealer_id) REFERENCES dealers(dealer_id) ON DELETE CASCADE,
    INDEX idx_brand_model (brand, model),
    INDEX idx_city (city),
    INDEX idx_price (price)
);
```

## 🏃 Practical Exercises

### Exercise 1: Design a Leads Table

Create a table to track customer leads:

```sql
CREATE TABLE leads (
    lead_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    car_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    dealer_id BIGINT NOT NULL,

    -- Customer info
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(15) NOT NULL,
    customer_email VARCHAR(100),

    -- Lead details
    status ENUM('new', 'contacted', 'negotiating', 'converted', 'lost') DEFAULT 'new',
    message TEXT,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (car_id) REFERENCES cars(car_id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES users(user_id),
    FOREIGN KEY (dealer_id) REFERENCES dealers(dealer_id),

    INDEX idx_dealer_status (dealer_id, status),
    INDEX idx_customer (customer_id)
);
```

### Exercise 2: Create an RC Verification Table

```sql
CREATE TABLE rc_verifications (
    verification_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,

    -- Vehicle details
    registration_number VARCHAR(20) UNIQUE NOT NULL,
    owner_name VARCHAR(100),
    vehicle_class VARCHAR(50),
    fuel_type VARCHAR(20),
    manufacturer VARCHAR(50),
    model VARCHAR(50),
    registration_date DATE,

    -- Verification
    is_verified BOOLEAN DEFAULT FALSE,
    verification_date TIMESTAMP,

    -- Save for later
    is_saved BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

### Exercise 3: Data Type Selection

Choose the correct data type for each field:

1. User's age: `TINYINT` (0-127)
2. Car price: `DECIMAL(12,2)` (exact money)
3. Phone number: `VARCHAR(15)` (not for calculations)
4. Is email verified: `BOOLEAN`
5. Product description: `TEXT`
6. Country code: `CHAR(2)` (always 2 chars)
7. Website URL: `VARCHAR(500)`
8. Temperature reading: `FLOAT` (approximate ok)
9. Rating (1-5): `TINYINT CHECK (rating BETWEEN 1 AND 5)` or `ENUM('1','2','3','4','5')`
10. Created timestamp: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`

## ✅ Key Takeaways

1. **Choose data types carefully** - impacts storage, performance, data integrity
2. **Use DECIMAL for money** - never FLOAT/DOUBLE
3. **VARCHAR for variable text** - saves space
4. **TIMESTAMP for auto-dates** - automatic tracking
5. **Constraints enforce rules** - prevent bad data
6. **AUTO_INCREMENT for IDs** - automatic unique values
7. **FOREIGN KEY links tables** - maintains relationships
8. **ENUM for fixed choices** - saves space, ensures validity

## 🚀 Next Lesson

In [Lesson 3: CRUD Operations](./03-crud-operations.md), we'll master:
- Advanced SELECT queries
- Complex WHERE conditions
- UPDATE multiple records
- DELETE with conditions
- INSERT from SELECT
- Best practices

## 📚 Quick Reference

```sql
-- Common Data Types
INT, BIGINT, DECIMAL(10,2), VARCHAR(255), TEXT
DATE, DATETIME, TIMESTAMP, BOOLEAN, ENUM

-- Common Constraints
NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY
CHECK, DEFAULT, AUTO_INCREMENT
```

---

**Master data types and your database will be efficient and reliable! 💪**
