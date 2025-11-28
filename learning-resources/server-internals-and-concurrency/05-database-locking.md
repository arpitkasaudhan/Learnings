# Database Transactions and Locking

## ACID Properties

Before diving into locking, understand what makes database transactions reliable:

### A - Atomicity
**All or nothing** - Either all operations succeed, or none do.

```javascript
// Transfer $100 from Alice to Bob
BEGIN TRANSACTION;

UPDATE accounts SET balance = balance - 100 WHERE name = 'Alice';
// ❌ Power failure here!
UPDATE accounts SET balance = balance + 100 WHERE name = 'Bob';

COMMIT;

// Result: Transaction ROLLBACK
// Alice keeps $100, Bob doesn't get anything
// No money lost! ✓
```

### C - Consistency
**Database rules are never violated**

```sql
-- Rule: balance must be >= 0
CHECK (balance >= 0)

BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 1000 WHERE name = 'Alice'; -- Balance = -500
-- ❌ Violates constraint!
COMMIT; -- This will FAIL

-- Database remains consistent ✓
```

### I - Isolation
**Concurrent transactions don't interfere with each other**

```
Transaction A and Transaction B run concurrently
But each one "thinks" it's running alone
Results are the same as if they ran sequentially
```

### D - Durability
**Once committed, data survives crashes**

```javascript
BEGIN TRANSACTION;
UPDATE accounts SET balance = 1000;
COMMIT; // ← At this point, data is GUARANTEED to be saved

// Even if server crashes 1ms later, data persists! ✓
```

## Isolation Levels

**The key to understanding concurrent database access!**

### Level 0: Read Uncommitted (Lowest Isolation)

**Allows:** Reading uncommitted data from other transactions

```
Transaction A                    Transaction B
───────────────────────────────────────────────────────────
BEGIN;
UPDATE accounts
SET balance = 2000
WHERE id = 1;
                                 BEGIN;
                                 SELECT balance
                                 FROM accounts
                                 WHERE id = 1;
                                 -- Reads: 2000 ❗(uncommitted!)

ROLLBACK;                        -- This is a "dirty read"
-- balance is back to 1000!
                                 -- But Transaction B saw 2000!
```

**Problem: Dirty Reads**
- Reading data that might be rolled back
- Almost never used in production

### Level 1: Read Committed (Default in most DBs)

**Prevents:** Dirty reads
**Allows:** Non-repeatable reads

```
Transaction A                    Transaction B
───────────────────────────────────────────────────────────
BEGIN;
SELECT balance
FROM accounts
WHERE id = 1;
-- Reads: 1000
                                 BEGIN;
                                 UPDATE accounts
                                 SET balance = 2000
                                 WHERE id = 1;
                                 COMMIT;

SELECT balance
FROM accounts
WHERE id = 1;
-- Reads: 2000 ❗(changed!)

COMMIT;
```

**Problem: Non-Repeatable Reads**
- Same query, different results within same transaction
- Okay for most applications

### Level 2: Repeatable Read

**Prevents:** Dirty reads, non-repeatable reads
**Allows:** Phantom reads

```
Transaction A                    Transaction B
───────────────────────────────────────────────────────────
BEGIN;
SELECT * FROM accounts
WHERE balance > 1000;
-- Returns: 3 rows
                                 BEGIN;
                                 INSERT INTO accounts
                                 VALUES (4, 'David', 5000);
                                 COMMIT;

SELECT * FROM accounts
WHERE balance > 1000;
-- Returns: 4 rows ❗(phantom row!)

COMMIT;
```

**Problem: Phantom Reads**
- New rows appear (or disappear) between reads
- Acceptable for most use cases

### Level 3: Serializable (Highest Isolation)

**Prevents:** All concurrency issues
**Cost:** Lowest concurrency (most locking)

```
Transaction A                    Transaction B
───────────────────────────────────────────────────────────
BEGIN;
SELECT * FROM accounts
WHERE balance > 1000;
-- ✓ Locks the range!
                                 BEGIN;
                                 INSERT INTO accounts
                                 VALUES (4, 'David', 5000);
                                 -- ⏸️ BLOCKS! Waiting for A...

COMMIT;
-- ✓ Lock released
                                 -- ✓ Now can proceed
                                 COMMIT;
```

**Effect:** Transactions execute as if they were serialized (one after another)

### Comparison Table

| Isolation Level | Dirty Reads | Non-Repeatable | Phantom Reads | Performance |
|-----------------|-------------|----------------|---------------|-------------|
| Read Uncommitted | ❌ Allowed | ❌ Allowed | ❌ Allowed | 🚀 Fastest |
| Read Committed | ✓ Prevented | ❌ Allowed | ❌ Allowed | ⚡ Fast |
| Repeatable Read | ✓ Prevented | ✓ Prevented | ❌ Allowed | 🐌 Slower |
| Serializable | ✓ Prevented | ✓ Prevented | ✓ Prevented | 🐢 Slowest |

### Setting Isolation Level

```javascript
// PostgreSQL
await db.query('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ');

// MySQL
await db.query('SET TRANSACTION ISOLATION LEVEL SERIALIZABLE');

// Or per transaction:
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
```

## Locking Mechanisms

### Shared Lock (S-Lock / Read Lock)

**Purpose:** Allow multiple reads, block writes

```
Transaction A                    Transaction B                    Transaction C
─────────────────────────────────────────────────────────────────────────────────
BEGIN;
SELECT * FROM accounts
WHERE id = 1 LOCK IN SHARE MODE;
-- ✓ Acquires S-Lock
                                 BEGIN;
                                 SELECT * FROM accounts
                                 WHERE id = 1 LOCK IN SHARE MODE;
                                 -- ✓ Acquires S-Lock (allowed!)
                                                                  BEGIN;
                                                                  UPDATE accounts
                                                                  SET balance = 2000
                                                                  WHERE id = 1;
                                                                  -- ⏸️ BLOCKS!
COMMIT;
-- ✓ Releases S-Lock
                                 COMMIT;
                                 -- ✓ Releases S-Lock
                                                                  -- ✓ Now can proceed
```

**Rule:** Multiple readers, OR one writer

### Exclusive Lock (X-Lock / Write Lock)

**Purpose:** Block both reads and writes

```
Transaction A                    Transaction B
───────────────────────────────────────────────────────────
BEGIN;
SELECT * FROM accounts
WHERE id = 1 FOR UPDATE;
-- ✓ Acquires X-Lock
                                 BEGIN;
                                 SELECT * FROM accounts
                                 WHERE id = 1;
                                 -- ⏸️ BLOCKS! (if using FOR UPDATE)

                                 UPDATE accounts
                                 SET balance = 2000
                                 WHERE id = 1;
                                 -- ⏸️ BLOCKS!

COMMIT;
-- ✓ Releases X-Lock
                                 -- ✓ Now can proceed
```

### Row-Level vs Table-Level Locks

**Row-Level Lock:**
```sql
BEGIN;
SELECT * FROM accounts WHERE id = 1 FOR UPDATE;
-- Locks ONLY row with id = 1
```

**Table-Level Lock:**
```sql
BEGIN;
LOCK TABLE accounts IN EXCLUSIVE MODE;
-- Locks ENTIRE table
```

**Example:**

```
Table: accounts
┌────┬──────────┬─────────┐
│ id │   name   │ balance │
├────┼──────────┼─────────┤
│ 1  │  Alice   │  $1000  │ ← Transaction A locks this row
│ 2  │  Bob     │  $2000  │ ← Transaction B can lock this row
│ 3  │  Charlie │  $3000  │ ← Transaction C can lock this row
└────┴──────────┴─────────┘

With row-level locking, all 3 transactions can proceed!

With table-level locking:
- Transaction A locks entire table
- Transactions B and C must WAIT
```

### Intent Locks

**Purpose:** Efficiently detect conflicts between row and table locks

```
Lock Hierarchy:
Table
├─ Page
│  ├─ Row 1
│  ├─ Row 2
│  └─ Row 3
└─ Page
   ├─ Row 4
   └─ Row 5

Intent Locks:
- IS (Intent Shared): Want to acquire S-Lock on some rows
- IX (Intent Exclusive): Want to acquire X-Lock on some rows
```

**How it works:**

```
Transaction A:
SELECT * FROM accounts WHERE id = 1 FOR UPDATE;

Database internally:
1. Acquire IX lock on table (intent to lock rows)
2. Acquire X lock on row 1

Transaction B:
LOCK TABLE accounts IN SHARE MODE;

Database checks:
- Table has IX lock? YES
- Conflict with table-level S lock? YES
- Transaction B must WAIT ⏸️
```

## Deadlocks

**The nightmare scenario!**

### What is a Deadlock?

```
Transaction A                    Transaction B
───────────────────────────────────────────────────────────
BEGIN;
UPDATE accounts
SET balance = 1100
WHERE id = 1;
-- ✓ Locks row 1
                                 BEGIN;
                                 UPDATE accounts
                                 SET balance = 2100
                                 WHERE id = 2;
                                 -- ✓ Locks row 2

UPDATE accounts
SET balance = 2100
WHERE id = 2;
-- ⏸️ Waiting for row 2...
                                 UPDATE accounts
                                 SET balance = 1100
                                 WHERE id = 1;
                                 -- ⏸️ Waiting for row 1...

💀 DEADLOCK!
A waits for B, B waits for A
```

### Deadlock Detection and Resolution

Databases automatically detect deadlocks:

```
┌─────────────────────────────────────┐
│   Database Deadlock Detector        │
│   (runs periodically)               │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│   Builds "wait-for" graph           │
│                                     │
│   Transaction A → Transaction B     │
│   Transaction B → Transaction A     │
│                                     │
│   ❗Cycle detected = Deadlock!      │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│   Pick a victim (usually newest)    │
│   ROLLBACK Transaction B            │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│   Transaction A can now proceed     │
│   Transaction B gets error:         │
│   "ER_LOCK_DEADLOCK"                │
└─────────────────────────────────────┘
```

### Handling Deadlocks in Code

```javascript
async function transferMoney(fromId, toId, amount) {
  const maxRetries = 3;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      await db.query('BEGIN');

      // Always lock in same order to prevent deadlock!
      const ids = [fromId, toId].sort();

      await db.query(
        'SELECT * FROM accounts WHERE id IN (?, ?) FOR UPDATE',
        ids
      );

      await db.query(
        'UPDATE accounts SET balance = balance - ? WHERE id = ?',
        [amount, fromId]
      );

      await db.query(
        'UPDATE accounts SET balance = balance + ? WHERE id = ?',
        [amount, toId]
      );

      await db.query('COMMIT');
      return; // Success!

    } catch (error) {
      await db.query('ROLLBACK');

      if (error.code === 'ER_LOCK_DEADLOCK') {
        console.log(`Deadlock detected, retry ${attempt + 1}`);
        await sleep(Math.random() * 100); // Random backoff
        continue; // Retry
      }

      throw error; // Other error
    }
  }

  throw new Error('Failed after retries');
}
```

### Preventing Deadlocks

**1. Lock in consistent order**

```javascript
// BAD: Can cause deadlock
async function transfer(fromId, toId, amount) {
  await lockRow(fromId);  // A locks 1, B locks 2
  await lockRow(toId);    // A wants 2, B wants 1 → DEADLOCK!
}

// GOOD: Always lock in same order
async function transfer(fromId, toId, amount) {
  const [first, second] = [fromId, toId].sort();
  await lockRow(first);   // Both lock 1 first
  await lockRow(second);  // Then both lock 2 → No deadlock!
}
```

**2. Keep transactions short**

```javascript
// BAD: Long transaction
BEGIN;
SELECT ... FOR UPDATE;
// Do lots of business logic (10 seconds)
UPDATE ...;
COMMIT;

// GOOD: Short transaction
// Do business logic first
const result = calculateStuff(); // Outside transaction

BEGIN;
SELECT ... FOR UPDATE;
UPDATE ... SET value = result;
COMMIT; // Quick!
```

**3. Use lower isolation levels**

```javascript
// May not need SERIALIZABLE
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
// Less locking = fewer deadlocks
```

## Multi-Version Concurrency Control (MVCC)

**Modern approach used by PostgreSQL, MySQL InnoDB**

### How it Works

Instead of locking, keep multiple versions of each row!

```
accounts table (logical view):
┌────┬──────────┬─────────┐
│ id │   name   │ balance │
├────┼──────────┼─────────┤
│ 1  │  Alice   │  $1000  │
└────┴──────────┴─────────┘

accounts table (physical storage):
┌────┬─────────┬─────────┬──────────┐
│ id │ balance │ xmin    │ xmax     │
├────┼─────────┼─────────┼──────────┤
│ 1  │  $500   │ txn_1   │ txn_3    │ ← Old version
│ 1  │  $1000  │ txn_3   │ NULL     │ ← Current version
└────┴─────────┴─────────┴──────────┘

xmin = transaction that created this version
xmax = transaction that deleted/updated this version
```

### Concurrent Transactions with MVCC

```
Time   Transaction A (txn_1)        Transaction B (txn_2)
──────────────────────────────────────────────────────────────────
0ms    BEGIN; (snapshot at time 0)
1ms    SELECT balance FROM accounts
       WHERE id = 1;
       -- Reads: $1000 (current version)
2ms                                  BEGIN; (snapshot at time 2)
3ms                                  UPDATE accounts
                                     SET balance = $2000
                                     WHERE id = 1;
                                     -- Creates NEW version!
4ms    SELECT balance FROM accounts
       WHERE id = 1;
       -- Still reads: $1000 ✓
       -- (reads version visible at time 0)
5ms                                  COMMIT;
6ms    SELECT balance FROM accounts
       WHERE id = 1;
       -- Still reads: $1000 ✓
       -- (consistent snapshot!)
7ms    COMMIT;
```

**Benefits:**
- Readers don't block writers
- Writers don't block readers
- High concurrency!

**Tradeoff:**
- More storage (multiple versions)
- Needs VACUUM to clean up old versions

## Practical Patterns

### Pattern 1: Select For Update

```javascript
// Pessimistic locking
BEGIN;
const account = await db.query(
  'SELECT * FROM accounts WHERE id = ? FOR UPDATE',
  [accountId]
);
// Row is locked, safe to modify
await db.query('UPDATE accounts SET balance = ?', [newBalance]);
COMMIT;
```

**When to use:** High contention, must guarantee no conflicts

### Pattern 2: Optimistic Locking with Version

```javascript
// Read without lock
const account = await db.query(
  'SELECT balance, version FROM accounts WHERE id = ?',
  [accountId]
);

// Try to update
const result = await db.query(
  'UPDATE accounts SET balance = ?, version = version + 1 WHERE id = ? AND version = ?',
  [newBalance, accountId, account.version]
);

if (result.affectedRows === 0) {
  throw new Error('Conflict, retry');
}
```

**When to use:** Low contention, better concurrency

### Pattern 3: Compare-And-Swap

```javascript
// Try to update only if current value matches
const result = await db.query(
  'UPDATE accounts SET balance = ? WHERE id = ? AND balance = ?',
  [newBalance, accountId, expectedBalance]
);

if (result.affectedRows === 0) {
  throw new Error('Value changed, retry');
}
```

**When to use:** Simple atomic updates

### Pattern 4: Saga Pattern (Long Transactions)

For operations spanning multiple services:

```javascript
async function bookTrip(userId) {
  // Instead of one big transaction:
  // BEGIN;
  //   bookFlight();
  //   bookHotel();
  //   bookCar();
  // COMMIT;

  // Use compensating transactions:

  const flightId = await bookFlight(userId);
  try {
    const hotelId = await bookHotel(userId);
    try {
      const carId = await bookCar(userId);
      return { flightId, hotelId, carId };
    } catch (error) {
      await cancelHotel(hotelId); // Compensate
      throw error;
    }
  } catch (error) {
    await cancelFlight(flightId); // Compensate
    throw error;
  }
}
```

## Summary

**Key Concepts:**
- **ACID:** Atomicity, Consistency, Isolation, Durability
- **Isolation Levels:** Read Uncommitted < Read Committed < Repeatable Read < Serializable
- **Locks:** Shared (read) vs Exclusive (write)
- **Granularity:** Row-level vs Table-level
- **Deadlocks:** Detect and retry, or prevent with consistent ordering
- **MVCC:** Modern approach with high concurrency

**Best Practices:**
1. Use appropriate isolation level (usually Read Committed)
2. Keep transactions short
3. Lock in consistent order
4. Handle deadlock errors with retries
5. Use row-level locks when possible
6. Consider optimistic locking for low contention

**Next:** [Practical Examples](./06-practical-examples.md) - Real code you can run!
