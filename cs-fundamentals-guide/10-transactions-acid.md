# Lesson 10: Transactions & ACID Properties

## What is a Transaction?

A **transaction** is a sequence of database operations that are treated as a single unit of work. Either **ALL operations succeed** or **ALL are rolled back**.

```sql
-- Example: Bank transfer
START TRANSACTION;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;  -- Withdraw
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;  -- Deposit
COMMIT;

-- If either operation fails, both are rolled back
-- Money is never lost or duplicated!
```

### Real-World Analogy

```
ATM Withdrawal:
1. Check balance
2. Dispense cash
3. Update balance

What if power goes out after dispensing cash but before updating balance?
→ Transaction ensures: ALL steps complete or NONE do
```

## ACID Properties

ACID is the set of properties that guarantee reliable transaction processing.

### A - Atomicity

**All or Nothing**: Transaction either completes fully or not at all.

```sql
-- Transfer $100 from Alice to Bob
START TRANSACTION;

  UPDATE accounts
  SET balance = balance - 100
  WHERE user = 'Alice';
  -- Balance: Alice = $900

  -- ⚠️ Error occurs here (e.g., network issue, constraint violation)
  UPDATE accounts
  SET balance = balance + 100
  WHERE user = 'Bob';

ROLLBACK;  -- Automatic rollback on error
-- Result: Alice still has $1000 (first update is undone)
```

**JavaScript Example**:
```javascript
async function transferMoney(fromUserId, toUserId, amount) {
  const session = await db.startSession();

  try {
    await session.startTransaction();

    // Withdraw from sender
    const result1 = await Account.updateOne(
      { userId: fromUserId, balance: { $gte: amount } },
      { $inc: { balance: -amount } },
      { session }
    );

    if (result1.modifiedCount === 0) {
      throw new Error('Insufficient balance');
    }

    // Deposit to receiver
    await Account.updateOne(
      { userId: toUserId },
      { $inc: { balance: amount } },
      { session }
    );

    // Both succeeded - commit
    await session.commitTransaction();
    console.log('Transfer successful!');

  } catch (error) {
    // Error - rollback both operations
    await session.abortTransaction();
    console.log('Transfer failed, rolled back');
    throw error;

  } finally {
    session.endSession();
  }
}
```

### C - Consistency

**Valid State**: Database goes from one valid state to another. All rules/constraints are maintained.

```sql
-- Rule: Balance cannot be negative
CREATE TABLE accounts (
  id INT PRIMARY KEY,
  user VARCHAR(100),
  balance DECIMAL(10, 2) CHECK (balance >= 0)
);

-- This transaction will be REJECTED
START TRANSACTION;
  UPDATE accounts SET balance = balance - 1000
  WHERE user = 'Alice' AND balance = 100;
  -- ERROR: CHECK constraint violated
ROLLBACK;

-- Database remains consistent (Alice still has $100)
```

**Examples of Consistency Rules**:
```sql
-- 1. Referential integrity
-- Can't create order for non-existent user
INSERT INTO orders (user_id, total)
VALUES (999, 100);  -- ERROR if user 999 doesn't exist

-- 2. Unique constraints
-- Can't have duplicate emails
INSERT INTO users (email) VALUES ('john@example.com');  -- OK
INSERT INTO users (email) VALUES ('john@example.com');  -- ERROR

-- 3. Data type constraints
INSERT INTO users (age) VALUES ('twenty');  -- ERROR (age is INT)

-- 4. Custom constraints
CREATE TABLE products (
  id INT PRIMARY KEY,
  price DECIMAL(10, 2),
  discount_price DECIMAL(10, 2),
  CHECK (discount_price <= price)  -- Discount can't exceed price
);
```

### I - Isolation

**No Interference**: Concurrent transactions don't interfere with each other.

```sql
-- Without isolation:
-- Transaction 1                  Transaction 2
START TRANSACTION;                START TRANSACTION;
SELECT balance FROM accounts
WHERE user = 'Alice';
-- Returns: 1000

                                  UPDATE accounts
                                  SET balance = balance - 100
                                  WHERE user = 'Alice';
                                  COMMIT;

SELECT balance FROM accounts
WHERE user = 'Alice';
-- Returns: 900 (different value in same transaction!) ❌

-- With isolation:
-- Transaction sees consistent snapshot
```

**Isolation Levels** (more details below):
- Read Uncommitted (weakest)
- Read Committed
- Repeatable Read
- Serializable (strongest)

### D - Durability

**Permanent**: Once committed, changes survive system crashes.

```sql
START TRANSACTION;
  INSERT INTO users (name, email) VALUES ('John', 'john@example.com');
COMMIT;
-- Data is written to disk

-- Even if server crashes NOW, data is safe!
-- After restart, John's record still exists
```

**How Databases Ensure Durability**:
```
1. Write-Ahead Logging (WAL)
   - Write to log file BEFORE modifying data
   - Log is flushed to disk before COMMIT returns

2. Checkpoints
   - Periodically write dirty pages to disk
   - Ensures log doesn't grow forever

3. Redundancy
   - Replication to multiple servers
   - RAID storage
```

## Transaction Commands

### SQL Transaction Commands

```sql
-- Start transaction
START TRANSACTION;
-- or
BEGIN;

-- Commit (save changes)
COMMIT;

-- Rollback (undo changes)
ROLLBACK;

-- Savepoint (partial rollback)
START TRANSACTION;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  SAVEPOINT withdraw;

  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
  -- Oops, wrong account!

  ROLLBACK TO SAVEPOINT withdraw;  -- Undo only second update
  UPDATE accounts SET balance = balance + 100 WHERE id = 3;  -- Correct account
COMMIT;
```

### Auto-commit Mode

```sql
-- By default, each statement is auto-committed
UPDATE users SET name = 'John' WHERE id = 1;  -- Auto-committed

-- Disable auto-commit for explicit transactions
SET autocommit = 0;

UPDATE users SET name = 'Jane' WHERE id = 2;  -- Not committed yet
UPDATE users SET age = 25 WHERE id = 2;       -- Not committed yet
COMMIT;  -- Now both are committed

-- Re-enable auto-commit
SET autocommit = 1;
```

## Isolation Levels

Isolation levels control how transactions interact with each other.

### Read Uncommitted (Level 0)

**Dirty Reads Allowed**: Can read uncommitted changes from other transactions.

```sql
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

-- Transaction 1                      Transaction 2
START TRANSACTION;
UPDATE accounts
SET balance = 1000000
WHERE user = 'Alice';
-- Not committed yet!
                                      START TRANSACTION;
                                      SELECT balance FROM accounts
                                      WHERE user = 'Alice';
                                      -- Sees 1000000 (uncommitted!) ❌
ROLLBACK;  -- Oops, mistake!
                                      -- Now Alice's balance is wrong in Tx2!
                                      COMMIT;
```

**Problems**:
- **Dirty Reads**: Reading uncommitted data
- Data may be rolled back
- Rarely used

### Read Committed (Level 1)

**Only Committed Data**: Can only read committed changes.

```sql
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- Transaction 1                      Transaction 2
START TRANSACTION;
UPDATE accounts
SET balance = 1000000
WHERE user = 'Alice';
                                      START TRANSACTION;
                                      SELECT balance FROM accounts
                                      WHERE user = 'Alice';
                                      -- Sees OLD value (committed) ✓
COMMIT;
                                      SELECT balance FROM accounts
                                      WHERE user = 'Alice';
                                      -- Now sees 1000000 (committed)
                                      COMMIT;
```

**Problems**:
- **Non-repeatable Reads**: Same query returns different results
- **Phantom Reads**: New rows appear

**Good For**:
- Most applications (default in PostgreSQL, Oracle)

### Repeatable Read (Level 2)

**Consistent Snapshot**: Same query returns same results within transaction.

```sql
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;

-- Transaction 1                      Transaction 2
START TRANSACTION;                    START TRANSACTION;
SELECT balance FROM accounts
WHERE user = 'Alice';
-- Returns: 1000

                                      UPDATE accounts
                                      SET balance = 2000
                                      WHERE user = 'Alice';
                                      COMMIT;

SELECT balance FROM accounts
WHERE user = 'Alice';
-- Still returns: 1000 (snapshot!) ✓
COMMIT;

-- Next transaction will see 2000
```

**Problems**:
- **Phantom Reads** (in some databases)

**Good For**:
- Reports requiring consistency
- Default in MySQL InnoDB

### Serializable (Level 3)

**Strongest Isolation**: Transactions execute as if serial (one after another).

```sql
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

-- Prevents all concurrency issues
-- But slowest (locks more aggressively)

-- Transaction 1                      Transaction 2
START TRANSACTION;
SELECT SUM(balance)
FROM accounts;
-- Returns: 10000

                                      START TRANSACTION;
                                      INSERT INTO accounts
                                      VALUES (3, 'Charlie', 500);
                                      -- WAITS for Transaction 1 to complete

SELECT SUM(balance)
FROM accounts;
-- Still 10000 (no phantom reads) ✓
COMMIT;
                                      -- Now Transaction 2 can proceed
                                      COMMIT;
```

**Good For**:
- Financial systems
- Critical data integrity
- When correctness > performance

### Isolation Levels Comparison

| Isolation Level | Dirty Read | Non-Repeatable Read | Phantom Read | Performance |
|----------------|------------|---------------------|--------------|-------------|
| Read Uncommitted | ✗ Possible | ✗ Possible | ✗ Possible | ⚡⚡⚡⚡ Fastest |
| Read Committed | ✓ Prevented | ✗ Possible | ✗ Possible | ⚡⚡⚡ Fast |
| Repeatable Read | ✓ Prevented | ✓ Prevented | ✗ Possible | ⚡⚡ Moderate |
| Serializable | ✓ Prevented | ✓ Prevented | ✓ Prevented | ⚡ Slowest |

### Isolation Phenomena

**1. Dirty Read**:
```
Tx1: UPDATE balance = 1000
Tx2: SELECT balance → sees 1000 (uncommitted!)
Tx1: ROLLBACK
Tx2: Now has invalid data
```

**2. Non-Repeatable Read**:
```
Tx1: SELECT balance → 1000
Tx2: UPDATE balance = 2000 and COMMIT
Tx1: SELECT balance → 2000 (different value!)
```

**3. Phantom Read**:
```
Tx1: SELECT COUNT(*) FROM users WHERE age > 25 → 10
Tx2: INSERT user with age 30 and COMMIT
Tx1: SELECT COUNT(*) FROM users WHERE age > 25 → 11 (phantom row!)
```

## Locking Mechanisms

### Pessimistic Locking

**Lock BEFORE reading**: Prevents others from modifying.

```sql
-- Shared lock (S-lock): Others can read, not write
SELECT * FROM accounts
WHERE user = 'Alice'
FOR SHARE;  -- or LOCK IN SHARE MODE

-- Exclusive lock (X-lock): Others can't read or write
SELECT * FROM accounts
WHERE user = 'Alice'
FOR UPDATE;

-- Example: Prevent concurrent updates
START TRANSACTION;
  -- Lock row
  SELECT balance FROM accounts
  WHERE user = 'Alice'
  FOR UPDATE;

  -- Other transactions trying to update will WAIT

  -- Safe to update
  UPDATE accounts SET balance = balance - 100
  WHERE user = 'Alice';
COMMIT;  -- Release lock
```

**JavaScript Example**:
```javascript
async function updateInventory(productId, quantity) {
  const session = await db.startSession();

  try {
    await session.startTransaction();

    // Lock product row
    const product = await Product.findById(productId)
      .session(session)
      .exec();

    // Check stock
    if (product.stock < quantity) {
      throw new Error('Insufficient stock');
    }

    // Update stock
    product.stock -= quantity;
    await product.save({ session });

    await session.commitTransaction();

  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
```

### Optimistic Locking

**Don't lock**: Check before writing if data changed.

```sql
-- Add version column
CREATE TABLE products (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  price DECIMAL(10, 2),
  stock INT,
  version INT DEFAULT 0
);

-- Read with version
SELECT id, name, price, stock, version
FROM products
WHERE id = 1;
-- Returns: { id: 1, name: 'Laptop', price: 999, stock: 50, version: 5 }

-- Update with version check
UPDATE products
SET
  price = 899,
  stock = 49,
  version = version + 1
WHERE id = 1 AND version = 5;  -- Only update if version hasn't changed

-- If version changed (concurrent update), affected_rows = 0
-- Application should retry or fail
```

**JavaScript Example (Mongoose)**:
```javascript
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number
});

// Enable optimistic locking
productSchema.plugin(require('mongoose-version'));

async function updatePrice(productId, newPrice) {
  let retries = 3;

  while (retries > 0) {
    try {
      const product = await Product.findById(productId);
      product.price = newPrice;
      await product.save();  // Throws error if version changed
      return;

    } catch (error) {
      if (error.name === 'VersionError') {
        retries--;
        if (retries === 0) throw new Error('Update failed after retries');
        // Retry
      } else {
        throw error;
      }
    }
  }
}
```

### Pessimistic vs Optimistic Locking

| Feature | Pessimistic | Optimistic |
|---------|-------------|------------|
| **When to lock** | Before read | Before write |
| **Conflicts** | Prevented | Detected |
| **Concurrency** | Low (locks block) | High (no locks) |
| **Best for** | High conflict rate | Low conflict rate |
| **Example** | Bank transfer | Shopping cart |

## Deadlocks

### What is a Deadlock?

**Deadlock**: Two or more transactions waiting for each other to release locks.

```sql
-- Transaction 1                      Transaction 2
START TRANSACTION;                    START TRANSACTION;

UPDATE accounts                       UPDATE accounts
SET balance = balance - 100           SET balance = balance - 50
WHERE id = 1;                         WHERE id = 2;
-- Locks row 1                        -- Locks row 2

                                      UPDATE accounts
                                      SET balance = balance + 100
                                      WHERE id = 1;
                                      -- WAITS for row 1 lock

UPDATE accounts
SET balance = balance + 50
WHERE id = 2;
-- WAITS for row 2 lock

-- DEADLOCK! Both waiting for each other
```

### Deadlock Detection

Databases automatically detect and resolve deadlocks:

```sql
-- MySQL error message:
-- ERROR 1213 (40001): Deadlock found when trying to get lock;
-- try restarting transaction

-- Database picks a victim and rolls it back
-- Other transaction can proceed
```

### Preventing Deadlocks

**1. Lock in Same Order**:
```sql
-- Bad: Different lock order → deadlock risk
-- Tx1: Lock A, then B
-- Tx2: Lock B, then A

-- Good: Same lock order → no deadlock
-- Tx1: Lock A, then B
-- Tx2: Lock A, then B (waits for Tx1 to finish)

-- Example: Always lock accounts in ID order
START TRANSACTION;
  UPDATE accounts SET ... WHERE id = 1;  -- Lower ID first
  UPDATE accounts SET ... WHERE id = 2;
COMMIT;
```

**2. Use Timeouts**:
```sql
-- Set lock wait timeout
SET innodb_lock_wait_timeout = 5;  -- 5 seconds

-- Transaction will fail if can't get lock in 5 seconds
-- Application can retry
```

**3. Keep Transactions Short**:
```javascript
// Bad: Long transaction
START TRANSACTION;
  SELECT ...
  // ... complex business logic (10 seconds)
  // ... external API call (5 seconds)
  UPDATE ...
COMMIT;

// Good: Short transaction
SELECT ...
// ... complex logic OUTSIDE transaction
// ... API call OUTSIDE transaction
START TRANSACTION;
  UPDATE ...
COMMIT;
```

**4. Use Appropriate Isolation Level**:
```sql
-- Lower isolation = fewer locks = less deadlock risk
-- But weaker consistency guarantees
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
```

## Distributed Transactions

### Two-Phase Commit (2PC)

For transactions spanning multiple databases.

```
Phase 1: Prepare
  Coordinator → DB1: Can you commit?
  Coordinator → DB2: Can you commit?
  DB1 → Coordinator: Yes
  DB2 → Coordinator: Yes

Phase 2: Commit
  Coordinator → DB1: Commit!
  Coordinator → DB2: Commit!

If any DB says "No" in Phase 1:
  Coordinator → All DBs: Rollback!
```

**Example** (Pseudocode):
```javascript
async function distributedTransaction() {
  const tx1 = await db1.beginTransaction();
  const tx2 = await db2.beginTransaction();

  try {
    // Phase 1: Prepare
    await tx1.execute('UPDATE ...');
    await tx2.execute('UPDATE ...');

    // Check if both are ready
    const ready1 = await tx1.prepare();
    const ready2 = await tx2.prepare();

    if (ready1 && ready2) {
      // Phase 2: Commit
      await tx1.commit();
      await tx2.commit();
    } else {
      // Phase 2: Rollback
      await tx1.rollback();
      await tx2.rollback();
    }

  } catch (error) {
    await tx1.rollback();
    await tx2.rollback();
  }
}
```

### Saga Pattern

Alternative to 2PC for microservices.

```javascript
// Instead of locking all services,
// execute step-by-step with compensating actions

async function orderSaga(orderId) {
  try {
    // Step 1: Reserve inventory
    await inventoryService.reserve(orderId);

    try {
      // Step 2: Charge payment
      await paymentService.charge(orderId);

      try {
        // Step 3: Create shipment
        await shipmentService.create(orderId);

        // Success!
        return { status: 'success' };

      } catch (error) {
        // Compensate: Refund payment
        await paymentService.refund(orderId);
        throw error;
      }

    } catch (error) {
      // Compensate: Release inventory
      await inventoryService.release(orderId);
      throw error;
    }

  } catch (error) {
    return { status: 'failed', error };
  }
}
```

## Practical Examples

### Bank Transfer with Transactions

```javascript
async function transferMoney(fromAccountId, toAccountId, amount) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Lock and check sender balance
    const [sender] = await connection.query(
      'SELECT balance FROM accounts WHERE id = ? FOR UPDATE',
      [fromAccountId]
    );

    if (sender.balance < amount) {
      throw new Error('Insufficient funds');
    }

    // Withdraw from sender
    await connection.query(
      'UPDATE accounts SET balance = balance - ? WHERE id = ?',
      [amount, fromAccountId]
    );

    // Deposit to receiver
    await connection.query(
      'UPDATE accounts SET balance = balance + ? WHERE id = ?',
      [amount, toAccountId]
    );

    // Record transaction
    await connection.query(
      'INSERT INTO transactions (from_id, to_id, amount) VALUES (?, ?, ?)',
      [fromAccountId, toAccountId, amount]
    );

    await connection.commit();
    console.log('Transfer successful');

  } catch (error) {
    await connection.rollback();
    console.error('Transfer failed:', error.message);
    throw error;

  } finally {
    connection.release();
  }
}
```

### E-commerce Order with Stock Management

```javascript
async function createOrder(userId, items) {
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    // Check and update stock for all items
    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      product.stock -= item.quantity;
      await product.save({ session });
    }

    // Calculate total
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create order
    const order = new Order({
      userId,
      items,
      total,
      status: 'pending'
    });
    await order.save({ session });

    await session.commitTransaction();
    return order;

  } catch (error) {
    await session.abortTransaction();
    throw error;

  } finally {
    session.endSession();
  }
}
```

## Key Takeaways

1. **Transactions** ensure ACID properties
2. **Atomicity**: All or nothing
3. **Consistency**: Valid state always
4. **Isolation**: Concurrent transactions don't interfere
5. **Durability**: Changes survive crashes
6. **Isolation levels** balance consistency vs performance
7. **Locking** prevents conflicts (pessimistic) or detects them (optimistic)
8. **Deadlocks** can occur with improper lock ordering

## Exercises

### Exercise 1: Transaction Design

Design transactions for:
1. Booking a hotel room (check availability, create booking, send confirmation)
2. Transferring inventory between warehouses
3. Processing a refund (update order status, credit account, update inventory)

### Exercise 2: Deadlock Prevention

Fix this code to prevent deadlocks:
```javascript
// User A sends $10 to User B
// User B sends $20 to User A (simultaneously)
```

### Exercise 3: Isolation Levels

Choose appropriate isolation level for:
1. Banking transactions
2. Social media post likes counter
3. Inventory management
4. Analytics dashboard

## Next Steps

In [Lesson 12: Memory Management](./12-memory-management.md), we'll learn:
- JavaScript memory model
- Garbage collection
- Memory leaks
- Performance profiling

---

**Practice**: Implement a transaction for a real-world scenario in your application!
