# SQL Transactions & ACID - Lesson 7

## 📖 What is a Transaction?

A **transaction** is a sequence of database operations that are treated as a single unit of work. Either ALL operations succeed, or ALL fail.

**Real-world analogy:** Bank transfer
```
Transfer $100 from Account A to Account B:
1. Deduct $100 from Account A
2. Add $100 to Account B

❌ What if step 2 fails? Money disappears!
✅ With transactions: Both steps succeed or both fail
```

## 🔤 ACID Properties

**ACID** ensures database reliability:

### A - Atomicity
All operations succeed or all fail (no partial completion).

```sql
BEGIN TRANSACTION;
    UPDATE accounts SET balance = balance - 100 WHERE account_id = 1;
    -- Power failure here!
    UPDATE accounts SET balance = balance + 100 WHERE account_id = 2;
COMMIT;

-- Result: Either both updates happen, or neither does
```

### C - Consistency
Database moves from one valid state to another.

```sql
-- Constraint: balance >= 0
BEGIN TRANSACTION;
    UPDATE accounts SET balance = balance - 100 WHERE account_id = 1;
    -- If balance becomes negative, transaction fails!
COMMIT;
```

### I - Isolation
Concurrent transactions don't interfere with each other.

```sql
-- User A and User B both try to buy the same car
-- Only one succeeds!
```

### D - Durability
Once committed, changes are permanent (even if system crashes).

```sql
COMMIT;  -- Changes written to disk, survive power failure
```

## 🔧 Transaction Commands

### Basic Syntax

```sql
-- Start transaction
BEGIN;  -- or START TRANSACTION;

    -- Your SQL statements
    UPDATE users SET balance = balance - 100 WHERE user_id = 1;
    INSERT INTO transactions VALUES (...);

-- Save changes
COMMIT;

-- Or undo changes
ROLLBACK;
```

### MySQL Example

```sql
START TRANSACTION;

-- Deduct from wallet
UPDATE wallets
SET balance = balance - 500
WHERE user_id = 123;

-- Create booking
INSERT INTO bookings (user_id, car_id, amount, status)
VALUES (123, 456, 500, 'confirmed');

-- Record transaction
INSERT INTO transactions (user_id, type, amount, reference)
VALUES (123, 'debit', 500, 'BOOKING_456');

-- If all succeeded
COMMIT;

-- If any failed
-- ROLLBACK;
```

### PostgreSQL Example

```sql
BEGIN;

-- Check balance first
SELECT balance FROM wallets WHERE user_id = 123 FOR UPDATE;
-- FOR UPDATE locks the row

-- If balance >= 500
UPDATE wallets SET balance = balance - 500 WHERE user_id = 123;
INSERT INTO bookings (...);

COMMIT;
```

## 🔒 Isolation Levels

Control how transactions see each other's changes.

### 1. READ UNCOMMITTED (Lowest isolation)

Can read uncommitted changes from other transactions.

```sql
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

-- Problem: Dirty reads
Transaction A:
    UPDATE cars SET price = 500000 WHERE car_id = 1;
    -- Not committed yet

Transaction B:
    SELECT price FROM cars WHERE car_id = 1;
    -- Sees 500000 (uncommitted!)

Transaction A:
    ROLLBACK;  -- Change undone

-- Transaction B saw data that never existed!
```

**Use case:** Rarely used, reports where accuracy isn't critical.

### 2. READ COMMITTED (Default in PostgreSQL)

Only read committed data.

```sql
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

Transaction A:
    UPDATE cars SET price = 500000 WHERE car_id = 1;
    -- Not committed yet

Transaction B:
    SELECT price FROM cars WHERE car_id = 1;
    -- Sees OLD price (400000)

Transaction A:
    COMMIT;

Transaction B:
    SELECT price FROM cars WHERE car_id = 1;
    -- Now sees NEW price (500000)
```

**Problem:** Non-repeatable reads (same query, different results).

### 3. REPEATABLE READ (Default in MySQL)

Same query always returns same result in a transaction.

```sql
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;

Transaction A:
BEGIN;
    SELECT price FROM cars WHERE car_id = 1;
    -- Returns 400000

Transaction B:
    UPDATE cars SET price = 500000 WHERE car_id = 1;
    COMMIT;

Transaction A:
    SELECT price FROM cars WHERE car_id = 1;
    -- Still returns 400000 (consistent view)
COMMIT;
```

**Problem:** Phantom reads (new rows appear).

### 4. SERIALIZABLE (Highest isolation)

Transactions execute as if they ran one at a time.

```sql
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

-- No concurrency issues, but slowest performance
```

**Summary:**

| Level | Dirty Read | Non-Repeatable Read | Phantom Read | Performance |
|-------|------------|---------------------|--------------|-------------|
| READ UNCOMMITTED | Yes | Yes | Yes | Fastest |
| READ COMMITTED | No | Yes | Yes | Fast |
| REPEATABLE READ | No | No | Yes | Slower |
| SERIALIZABLE | No | No | No | Slowest |

## 🔐 Locking

Prevent concurrent access issues.

### Row-Level Locks

```sql
-- SELECT FOR UPDATE (exclusive lock)
BEGIN;
    SELECT * FROM cars WHERE car_id = 1 FOR UPDATE;
    -- Other transactions can't modify this row
    UPDATE cars SET status = 'sold' WHERE car_id = 1;
COMMIT;

-- SELECT FOR SHARE (shared lock)
BEGIN;
    SELECT * FROM cars WHERE car_id = 1 FOR SHARE;
    -- Others can read but not modify
COMMIT;
```

### Table-Level Locks

```sql
-- Lock entire table
LOCK TABLES cars WRITE;
    -- Exclusive access
    UPDATE cars SET price = price * 1.1;
UNLOCK TABLES;

-- Read lock
LOCK TABLES cars READ;
    SELECT * FROM cars;
UNLOCK TABLES;
```

## ⚠️ Deadlocks

Two transactions wait for each other forever.

```sql
-- Transaction A
BEGIN;
    UPDATE cars SET price = 500000 WHERE car_id = 1;  -- Locks car 1
    -- Waiting...
    UPDATE cars SET price = 600000 WHERE car_id = 2;  -- Wants car 2
COMMIT;

-- Transaction B
BEGIN;
    UPDATE cars SET price = 700000 WHERE car_id = 2;  -- Locks car 2
    -- Waiting...
    UPDATE cars SET price = 800000 WHERE car_id = 1;  -- Wants car 1
COMMIT;

-- DEADLOCK! Both wait forever
```

**Solution:**
1. **Always lock in same order**
```sql
-- Both transactions lock car 1 first, then car 2
UPDATE cars SET ... WHERE car_id IN (1, 2) ORDER BY car_id;
```

2. **Use timeouts**
```sql
SET innodb_lock_wait_timeout = 5;  -- Wait max 5 seconds
```

3. **Keep transactions short**

## 🎯 Savepoints

Partial rollback within a transaction.

```sql
BEGIN;
    INSERT INTO users VALUES (1, 'Alice');

    SAVEPOINT sp1;
    INSERT INTO users VALUES (2, 'Bob');

    SAVEPOINT sp2;
    INSERT INTO users VALUES (3, 'Charlie');

    -- Oops, Charlie invalid
    ROLLBACK TO sp2;  -- Undo Charlie only

    -- Bob still inserted
COMMIT;

-- Result: Alice and Bob inserted, Charlie not
```

## 🏦 VahanHelp Transaction Examples

### Example 1: Car Purchase

```sql
BEGIN;

-- 1. Check if car is available
SELECT status FROM cars WHERE car_id = 456 FOR UPDATE;

-- If status = 'active':

-- 2. Mark car as sold
UPDATE cars
SET status = 'sold', sold_at = NOW()
WHERE car_id = 456;

-- 3. Create purchase record
INSERT INTO purchases (car_id, customer_id, amount, purchased_at)
VALUES (456, 123, 950000, NOW());

-- 4. Update dealer stats
UPDATE dealers
SET sold_count = sold_count + 1,
    total_revenue = total_revenue + 950000
WHERE dealer_id = (SELECT dealer_id FROM cars WHERE car_id = 456);

-- 5. Mark lead as converted
UPDATE leads
SET status = 'converted', converted_at = NOW()
WHERE car_id = 456 AND customer_id = 123;

COMMIT;
```

### Example 2: Wallet Payment

```sql
BEGIN;

-- 1. Check and lock wallet balance
SELECT balance FROM wallets
WHERE user_id = 123
FOR UPDATE;

-- If balance >= 500:

-- 2. Deduct amount
UPDATE wallets
SET balance = balance - 500,
    updated_at = NOW()
WHERE user_id = 123;

-- 3. Create transaction record
INSERT INTO wallet_transactions (
    user_id, type, amount, balance_after, reference
) VALUES (
    123, 'debit', 500,
    (SELECT balance FROM wallets WHERE user_id = 123),
    'RC_CHECK_789'
);

-- 4. Create service record
INSERT INTO rc_verifications (
    user_id, registration_number, amount_paid, status
) VALUES (
    123, 'DL01AB1234', 500, 'completed'
);

COMMIT;
```

### Example 3: Error Handling with Rollback

```javascript
// Node.js with MySQL
const connection = await pool.getConnection();

try {
    await connection.beginTransaction();

    // Step 1: Deduct from wallet
    const [result] = await connection.query(
        'UPDATE wallets SET balance = balance - ? WHERE user_id = ? AND balance >= ?',
        [amount, userId, amount]
    );

    if (result.affectedRows === 0) {
        throw new Error('Insufficient balance');
    }

    // Step 2: Create booking
    await connection.query(
        'INSERT INTO bookings (user_id, car_id, amount) VALUES (?, ?, ?)',
        [userId, carId, amount]
    );

    // Step 3: Send notification
    await sendNotification(userId, 'Booking confirmed');

    // All good - commit
    await connection.commit();
    return { success: true };

} catch (error) {
    // Something failed - rollback everything
    await connection.rollback();
    console.error('Transaction failed:', error);
    return { success: false, error: error.message };

} finally {
    connection.release();
}
```

## ✅ Best Practices

1. **Keep transactions short**
   - Don't include API calls, file operations
   - Only database operations

2. **Use appropriate isolation level**
   - READ COMMITTED for most cases
   - SERIALIZABLE only when necessary

3. **Handle errors properly**
   - Always ROLLBACK on error
   - Use try-catch blocks

4. **Avoid user input during transaction**
   ```sql
   -- ❌ BAD
   BEGIN;
       UPDATE cars SET status = 'sold';
       -- Wait for user confirmation... (locks held!)
   COMMIT;

   -- ✅ GOOD
   -- Get user confirmation first
   BEGIN;
       UPDATE cars SET status = 'sold';
   COMMIT;
   ```

5. **Lock in consistent order**
   - Prevents deadlocks

6. **Use FOR UPDATE selectively**
   - Only when you'll modify the row

7. **Monitor long-running transactions**
   ```sql
   -- MySQL: Find long transactions
   SELECT * FROM information_schema.processlist
   WHERE time > 60;
   ```

## 🏃 Practical Exercises

```sql
-- Exercise 1: Transfer money between wallets
BEGIN;
    -- Deduct from sender
    UPDATE wallets SET balance = balance - 1000
    WHERE user_id = 1 AND balance >= 1000;

    -- Add to receiver
    UPDATE wallets SET balance = balance + 1000
    WHERE user_id = 2;

    -- Log transaction
    INSERT INTO transactions (from_user, to_user, amount)
    VALUES (1, 2, 1000);
COMMIT;

-- Exercise 2: Concurrent car purchase (with locking)
BEGIN;
    -- Lock and check availability
    SELECT status FROM cars
    WHERE car_id = 123
    FOR UPDATE;

    -- If available, purchase
    UPDATE cars SET status = 'sold' WHERE car_id = 123;
    INSERT INTO purchases VALUES (...);
COMMIT;

-- Exercise 3: Bulk update with savepoint
BEGIN;
    UPDATE cars SET price = price * 1.1 WHERE brand = 'Maruti';
    SAVEPOINT after_maruti;

    UPDATE cars SET price = price * 1.1 WHERE brand = 'Honda';
    -- Oops, Honda increase was wrong
    ROLLBACK TO after_maruti;

    -- Maruti changes still there
COMMIT;
```

## ✅ Key Takeaways

1. **Transactions** ensure data consistency
2. **ACID** properties guarantee reliability
3. **Isolation levels** balance consistency vs performance
4. **Locks** prevent concurrent access issues
5. **Deadlocks** can be avoided with consistent lock order
6. **Keep transactions short** for better performance
7. **Always handle errors** with ROLLBACK

## 🚀 Next Lesson

In [Lesson 8: VahanHelp SQL Schema](./08-vahanhelp-sql-schema.md), we'll:
- Design complete SQL schema for VahanHelp
- Create all tables with relationships
- Add indexes and constraints
- Write migration scripts
- Implement stored procedures

---

**Master transactions to build reliable applications! 💪**
