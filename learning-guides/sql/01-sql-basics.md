# SQL Basics - Lesson 1

## 📖 Introduction

**SQL (Structured Query Language)** is a standard language for managing and manipulating relational databases.

### What is a Relational Database?

A relational database stores data in **tables** (also called relations) that are connected through **relationships**.

**Think of it like Excel spreadsheets that can talk to each other!**

### Key Concepts

1. **Database**: A container that holds all your tables
2. **Table**: A collection of related data (like a spreadsheet)
3. **Row (Record)**: A single entry in a table
4. **Column (Field)**: A specific attribute of data
5. **Primary Key**: A unique identifier for each row
6. **Foreign Key**: A reference to another table's primary key

## 🎯 Why Use SQL?

- ✅ **Data Integrity**: Ensures data accuracy and consistency
- ✅ **ACID Properties**: Reliable transactions
- ✅ **Complex Queries**: Join multiple tables easily
- ✅ **Mature Ecosystem**: Decades of development
- ✅ **Standard Language**: Works across different databases

## 🗄️ Popular SQL Databases

1. **PostgreSQL** - Open-source, feature-rich, great for complex applications
2. **MySQL** - Popular, fast, widely used in web applications
3. **SQLite** - Lightweight, serverless, great for mobile/embedded
4. **Microsoft SQL Server** - Enterprise-grade, Windows-focused
5. **Oracle Database** - Enterprise-level, powerful features

## 📊 Basic SQL Syntax

### 1. Creating a Database

```sql
-- Create a new database
CREATE DATABASE vahanhelp;

-- Use the database
USE vahanhelp;

-- Or in PostgreSQL
\c vahanhelp;
```

### 2. Your First Table

```sql
-- Create a simple users table
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Let's break this down:**
- `CREATE TABLE users` - Creates a table named "users"
- `id INT PRIMARY KEY` - Integer column that uniquely identifies each user
- `name VARCHAR(100)` - Variable character field, max 100 characters
- `phone VARCHAR(15)` - Phone number as text
- `created_at TIMESTAMP` - Date and time, defaults to now

### 3. Inserting Data

```sql
-- Add a single user
INSERT INTO users (id, name, phone)
VALUES (1, 'Rahul Kumar', '9876543210');

-- Add multiple users
INSERT INTO users (id, name, phone) VALUES
(2, 'Priya Sharma', '9876543211'),
(3, 'Amit Patel', '9876543212'),
(4, 'Sneha Gupta', '9876543213');
```

### 4. Reading Data (SELECT)

```sql
-- Get all users
SELECT * FROM users;

-- Get specific columns
SELECT name, phone FROM users;

-- Get users with a condition
SELECT * FROM users WHERE name = 'Rahul Kumar';

-- Get users ordered by name
SELECT * FROM users ORDER BY name;

-- Get only 2 users
SELECT * FROM users LIMIT 2;
```

### 5. Updating Data

```sql
-- Update a user's name
UPDATE users
SET name = 'Rahul Kumar Singh'
WHERE id = 1;

-- Update multiple fields
UPDATE users
SET name = 'Priya Sharma Jain', phone = '9999999999'
WHERE id = 2;
```

### 6. Deleting Data

```sql
-- Delete a specific user
DELETE FROM users WHERE id = 4;

-- Delete all users (be careful!)
DELETE FROM users;

-- Drop the entire table
DROP TABLE users;
```

## 🔍 SQL Command Categories

### DDL (Data Definition Language)
Defines database structure:
- `CREATE` - Create database objects
- `ALTER` - Modify database objects
- `DROP` - Delete database objects
- `TRUNCATE` - Remove all records from table

### DML (Data Manipulation Language)
Manipulates data:
- `SELECT` - Query data
- `INSERT` - Add new records
- `UPDATE` - Modify existing records
- `DELETE` - Remove records

### DCL (Data Control Language)
Controls access:
- `GRANT` - Give permissions
- `REVOKE` - Remove permissions

### TCL (Transaction Control Language)
Manages transactions:
- `COMMIT` - Save changes
- `ROLLBACK` - Undo changes
- `SAVEPOINT` - Set a point to rollback to

## 💡 Important SQL Rules

1. **SQL is NOT case-sensitive** (but convention uses UPPERCASE for keywords)
   ```sql
   SELECT * FROM users;  -- ✅ Good practice
   select * from users;  -- ✅ Works, but not conventional
   ```

2. **Semicolons end statements**
   ```sql
   SELECT * FROM users;
   ```

3. **Strings use single quotes**
   ```sql
   WHERE name = 'Rahul'  -- ✅ Correct
   WHERE name = "Rahul"  -- ❌ Might not work in all databases
   ```

4. **Comments**
   ```sql
   -- This is a single-line comment

   /*
      This is a
      multi-line comment
   */
   ```

## 🏃 Practical Exercise

### Exercise 1: Create a Cars Table

Create a table to store car information:

```sql
CREATE TABLE cars (
    id INT PRIMARY KEY,
    brand VARCHAR(50),
    model VARCHAR(50),
    year INT,
    price DECIMAL(10, 2),
    city VARCHAR(50)
);
```

### Exercise 2: Insert Sample Data

```sql
INSERT INTO cars (id, brand, model, year, price, city) VALUES
(1, 'Maruti', 'Swift', 2020, 550000, 'Delhi'),
(2, 'Hyundai', 'Creta', 2021, 1200000, 'Mumbai'),
(3, 'Tata', 'Nexon', 2022, 900000, 'Bangalore'),
(4, 'Honda', 'City', 2019, 800000, 'Pune'),
(5, 'Mahindra', 'XUV700', 2023, 1500000, 'Delhi');
```

### Exercise 3: Query the Data

```sql
-- 1. Get all cars
SELECT * FROM cars;

-- 2. Get only brand and model
SELECT brand, model FROM cars;

-- 3. Get cars in Delhi
SELECT * FROM cars WHERE city = 'Delhi';

-- 4. Get cars priced under 1000000
SELECT * FROM cars WHERE price < 1000000;

-- 5. Get cars manufactured after 2020
SELECT * FROM cars WHERE year > 2020;

-- 6. Get cars ordered by price (cheapest first)
SELECT * FROM cars ORDER BY price ASC;

-- 7. Get the most expensive car
SELECT * FROM cars ORDER BY price DESC LIMIT 1;
```

### Exercise 4: Update Data

```sql
-- Update the price of Swift
UPDATE cars SET price = 575000 WHERE id = 1;

-- Move Nexon to a different city
UPDATE cars SET city = 'Hyderabad' WHERE brand = 'Tata' AND model = 'Nexon';
```

### Exercise 5: Delete Data

```sql
-- Delete cars older than 2019
DELETE FROM cars WHERE year < 2019;
```

## 🎯 Challenge

Create a complete database for a simple phone book:

1. Create a `contacts` table with: id, name, phone, email, city
2. Insert at least 5 contacts
3. Query all contacts from a specific city
4. Update a contact's email
5. Delete a contact
6. List all contacts ordered by name

## 📝 Solution to Challenge

```sql
-- Step 1: Create table
CREATE TABLE contacts (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(100),
    city VARCHAR(50)
);

-- Step 2: Insert contacts
INSERT INTO contacts (id, name, phone, email, city) VALUES
(1, 'Rajesh Kumar', '9876543210', 'rajesh@example.com', 'Delhi'),
(2, 'Sita Patel', '9876543211', 'sita@example.com', 'Mumbai'),
(3, 'Vijay Singh', '9876543212', 'vijay@example.com', 'Delhi'),
(4, 'Anita Sharma', '9876543213', 'anita@example.com', 'Bangalore'),
(5, 'Suresh Reddy', '9876543214', 'suresh@example.com', 'Hyderabad');

-- Step 3: Query contacts from Delhi
SELECT * FROM contacts WHERE city = 'Delhi';

-- Step 4: Update email
UPDATE contacts SET email = 'rajesh.kumar@newmail.com' WHERE id = 1;

-- Step 5: Delete a contact
DELETE FROM contacts WHERE id = 5;

-- Step 6: List all ordered by name
SELECT * FROM contacts ORDER BY name;
```

## ✅ Key Takeaways

1. SQL is a standard language for relational databases
2. Data is organized in tables with rows and columns
3. Four main operations: CREATE, READ (SELECT), UPDATE, DELETE (CRUD)
4. Always specify a WHERE clause when updating/deleting to avoid accidents
5. Use PRIMARY KEY to uniquely identify records

## 🚀 Next Lesson

In [Lesson 2: Tables & Data Types](./02-tables-datatypes.md), we'll dive deeper into:
- Different data types in SQL
- Constraints (NOT NULL, UNIQUE, CHECK, etc.)
- Auto-increment fields
- Default values
- Best practices for table design

## 📚 Additional Resources

- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [MySQL Tutorial](https://www.mysqltutorial.org/)
- [SQL Fiddle](http://sqlfiddle.com/) - Practice SQL online

---

**Practice makes perfect! Try creating different tables and querying them. 🎯**
