# Handling Concurrent Updates: Race Conditions and Solutions

## The Core Problem

**Question:** What happens when two users try to update the same data at the same time?

**Answer:** Without proper handling, you get **DATA CORRUPTION**!

## Real-World Example: Bank Account Transfer

### The Scenario

```
Database: accounts table
┌────┬──────────┬─────────┐
│ id │   name   │ balance │
├────┼──────────┼─────────┤
│ 1  │  Alice   │  $1000  │
└────┴──────────┴─────────┘

User A: Deposits $100
User B: Deposits $200

Expected final balance: $1300
```

### Without Proper Handling (BROKEN!)

```javascript
app.post('/deposit/:id', async (req, res) => {
  const accountId = req.params.id;
  const amount = req.body.amount;

  // Step 1: Read current balance
  const account = await db.query(
    'SELECT balance FROM accounts WHERE id = ?',
    [accountId]
  );

  const currentBalance = account.balance;

  // Step 2: Calculate new balance
  const newBalance = currentBalance + amount;

  // Step 3: Update database
  await db.query(
    'UPDATE accounts SET balance = ? WHERE id = ?',
    [newBalance, accountId]
  );

  res.json({ balance: newBalance });
});
```

**What Happens with Concurrent Requests:**

```
Time   User A (deposit $100)              User B (deposit $200)
────────────────────────────────────────────────────────────────────
0ms    Request arrives
1ms    Read balance: $1000
2ms                                        Request arrives
3ms                                        Read balance: $1000 (same!)
4ms    Calculate: $1000 + $100 = $1100
5ms                                        Calculate: $1000 + $200 = $1200
6ms    Update DB: SET balance = $1100
7ms                                        Update DB: SET balance = $1200
────────────────────────────────────────────────────────────────────

Final balance: $1200 ❌ (Should be $1300!)
Lost update: $100 disappeared!
```

**This is called a RACE CONDITION!**

## Understanding Race Conditions

### What is a Race Condition?

```
A race condition occurs when:
1. Two or more operations access shared data
2. At least one operation modifies the data
3. The operations are interleaved in time
4. The final result depends on the timing (the "race")
```

### Critical Section

```javascript
// This is a CRITICAL SECTION
// Only one user should execute this at a time!

// ↓↓↓ Start of critical section ↓↓↓
const account = await db.query('SELECT balance WHERE id = ?', [id]);
const newBalance = account.balance + amount;
await db.query('UPDATE accounts SET balance = ?', [newBalance]);
// ↑↑↑ End of critical section ↑↑↑
```

### Visualizing the Problem

```
Correct (Sequential):
User A: [Read][Calculate][Write]
                                 User B: [Read][Calculate][Write]
Result: ✓ Correct

Race Condition (Concurrent):
User A: [Read]    [Calculate]    [Write]
User B:     [Read]     [Calculate]     [Write]
Result: ❌ Lost update!
```

## Solution 1: Database Transactions with Locking

### Pessimistic Locking (Lock Before Reading)

```javascript
app.post('/deposit/:id', async (req, res) => {
  const accountId = req.params.id;
  const amount = req.body.amount;

  // Start transaction
  await db.query('BEGIN TRANSACTION');

  try {
    // SELECT FOR UPDATE = Lock the row!
    const account = await db.query(
      'SELECT balance FROM accounts WHERE id = ? FOR UPDATE',
      [accountId]
    );

    // Only User A can reach here
    // User B is BLOCKED, waiting for the lock

    const newBalance = account.balance + amount;

    await db.query(
      'UPDATE accounts SET balance = ? WHERE id = ?',
      [newBalance, accountId]
    );

    // Commit transaction (releases lock)
    await db.query('COMMIT');

    res.json({ balance: newBalance });
  } catch (error) {
    // Rollback on error (releases lock)
    await db.query('ROLLBACK');
    throw error;
  }
});
```

**How it works:**

```
Time   User A                              User B
─────────────────────────────────────────────────────────────────
0ms    BEGIN TRANSACTION
1ms    SELECT ... FOR UPDATE
       ✓ Acquires lock on row
2ms                                        BEGIN TRANSACTION
3ms    Read balance: $1000                SELECT ... FOR UPDATE
4ms    Calculate: $1100                   ⏸️ WAITING FOR LOCK...
5ms    UPDATE balance = $1100             ⏸️ WAITING FOR LOCK...
6ms    COMMIT                              ⏸️ WAITING FOR LOCK...
       🔓 Releases lock
7ms                                        ✓ Acquires lock
8ms                                        Read balance: $1100 (updated!)
9ms                                        Calculate: $1300
10ms                                       UPDATE balance = $1300
11ms                                       COMMIT
─────────────────────────────────────────────────────────────────

Final balance: $1300 ✓ Correct!
```

**Key Points:**
- `SELECT FOR UPDATE` locks the row
- Other transactions WAIT until lock is released
- Lock is released on COMMIT or ROLLBACK
- Guarantees correctness at the cost of concurrency

### Optimistic Locking (No Locks, Check Before Commit)

```javascript
app.post('/deposit/:id', async (req, res) => {
  const accountId = req.params.id;
  const amount = req.body.amount;

  // Read current balance AND version
  const account = await db.query(
    'SELECT balance, version FROM accounts WHERE id = ?',
    [accountId]
  );

  const currentBalance = account.balance;
  const currentVersion = account.version;

  const newBalance = currentBalance + amount;

  // Try to update, but only if version hasn't changed!
  const result = await db.query(
    `UPDATE accounts
     SET balance = ?, version = version + 1
     WHERE id = ? AND version = ?`,
    [newBalance, accountId, currentVersion]
  );

  if (result.affectedRows === 0) {
    // Version changed! Someone else updated it
    // Retry the operation
    return res.status(409).json({
      error: 'Conflict, please retry'
    });
  }

  res.json({ balance: newBalance });
});
```

**How it works:**

```
Database:
┌────┬─────────┬─────────┐
│ id │ balance │ version │
├────┼─────────┼─────────┤
│ 1  │  $1000  │    1    │
└────┴─────────┴─────────┘

Time   User A                              User B
─────────────────────────────────────────────────────────────────
0ms    Read: balance=$1000, version=1
1ms                                        Read: balance=$1000, version=1
2ms    Calculate: $1100
3ms                                        Calculate: $1200
4ms    UPDATE WHERE version=1
       ✓ Success! Version now = 2
       Balance = $1100
5ms                                        UPDATE WHERE version=1
                                           ❌ Failed! Version is now 2, not 1
6ms                                        Return 409 Conflict
7ms                                        (Client retries)
8ms                                        Read: balance=$1100, version=2
9ms                                        Calculate: $1300
10ms                                       UPDATE WHERE version=2
                                           ✓ Success! Version now = 3
─────────────────────────────────────────────────────────────────

Final balance: $1300 ✓ Correct!
```

**Key Points:**
- No locks! Higher concurrency
- Uses a version number (or timestamp)
- If update fails, client retries
- Good when conflicts are rare

## Solution 2: Atomic Operations

Instead of read-modify-write, do it atomically:

```javascript
// WRONG: Read-modify-write (3 steps = race condition)
const account = await db.query('SELECT balance WHERE id = ?', [id]);
const newBalance = account.balance + amount;
await db.query('UPDATE SET balance = ?', [newBalance]);

// RIGHT: Atomic update (1 step = no race condition!)
await db.query(
  'UPDATE accounts SET balance = balance + ? WHERE id = ?',
  [amount, id]
);
```

**Why this works:**

```
User A: UPDATE balance = balance + 100
User B: UPDATE balance = balance + 200

Database executes these sequentially (internally locked):
1. balance = 1000 + 100 = 1100
2. balance = 1100 + 200 = 1300 ✓

The database ensures these happen one after another!
```

## Solution 3: Application-Level Locking (Distributed Systems)

When you have multiple servers, database locking isn't enough!

### Using Redis for Distributed Locks

```javascript
const Redis = require('ioredis');
const redis = new Redis();

async function withLock(key, callback) {
  const lockKey = `lock:${key}`;
  const lockValue = Math.random().toString(); // Unique ID

  // Try to acquire lock
  const acquired = await redis.set(
    lockKey,
    lockValue,
    'EX', 10, // Expire after 10 seconds (safety)
    'NX'      // Only set if not exists
  );

  if (!acquired) {
    throw new Error('Could not acquire lock');
  }

  try {
    // Execute critical section
    return await callback();
  } finally {
    // Release lock (only if we still own it)
    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
    await redis.eval(script, 1, lockKey, lockValue);
  }
}

app.post('/deposit/:id', async (req, res) => {
  const accountId = req.params.id;
  const amount = req.body.amount;

  await withLock(`account:${accountId}`, async () => {
    const account = await db.query(
      'SELECT balance FROM accounts WHERE id = ?',
      [accountId]
    );

    const newBalance = account.balance + amount;

    await db.query(
      'UPDATE accounts SET balance = ? WHERE id = ?',
      [newBalance, accountId]
    );
  });

  res.json({ success: true });
});
```

**Distributed locks across servers:**

```
Server 1 (User A)               Redis               Server 2 (User B)
─────────────────────────────────────────────────────────────────────
SET lock:account:1 xxx
✓ Got lock
                              lock:account:1 = xxx
                                                    SET lock:account:1 yyy
                                                    ❌ Failed (already exists)
Read balance                                        Retry after delay...
Update balance
DEL lock:account:1
✓ Released lock
                              (no lock)
                                                    SET lock:account:1 yyy
                                                    ✓ Got lock
                                                    Read balance
                                                    Update balance
```

## Real-World Scenarios

### Scenario 1: Inventory Management

**Problem:** Two users buying the last item

```javascript
// WRONG
app.post('/buy/:productId', async (req, res) => {
  const product = await db.query(
    'SELECT stock FROM products WHERE id = ?',
    [productId]
  );

  if (product.stock > 0) {
    // ⚠️ Race condition! Both users might pass this check
    await db.query(
      'UPDATE products SET stock = stock - 1 WHERE id = ?',
      [productId]
    );
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Out of stock' });
  }
});

// RIGHT: Atomic with check
app.post('/buy/:productId', async (req, res) => {
  const result = await db.query(
    'UPDATE products SET stock = stock - 1 WHERE id = ? AND stock > 0',
    [productId]
  );

  if (result.affectedRows === 0) {
    res.status(400).json({ error: 'Out of stock' });
  } else {
    res.json({ success: true });
  }
});
```

### Scenario 2: Social Media Likes

**Problem:** Double-liking

```javascript
// WRONG: User can like multiple times
app.post('/like/:postId', async (req, res) => {
  const existingLike = await db.query(
    'SELECT * FROM likes WHERE user_id = ? AND post_id = ?',
    [userId, postId]
  );

  if (!existingLike) {
    // ⚠️ Race condition! User might click twice quickly
    await db.query(
      'INSERT INTO likes (user_id, post_id) VALUES (?, ?)',
      [userId, postId]
    );

    await db.query(
      'UPDATE posts SET like_count = like_count + 1 WHERE id = ?',
      [postId]
    );
  }
});

// RIGHT: Use unique constraint
// Database schema:
// CREATE UNIQUE INDEX idx_likes ON likes(user_id, post_id);

app.post('/like/:postId', async (req, res) => {
  try {
    await db.query(
      'INSERT INTO likes (user_id, post_id) VALUES (?, ?)',
      [userId, postId]
    );

    // Atomic increment
    await db.query(
      'UPDATE posts SET like_count = like_count + 1 WHERE id = ?',
      [postId]
    );

    res.json({ success: true });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      // Already liked, that's okay
      res.json({ success: false, message: 'Already liked' });
    } else {
      throw error;
    }
  }
});
```

### Scenario 3: Limited Slots (Event Registration)

```javascript
// WRONG
app.post('/register/:eventId', async (req, res) => {
  const event = await db.query(
    'SELECT registered_count, max_capacity FROM events WHERE id = ?',
    [eventId]
  );

  if (event.registered_count < event.max_capacity) {
    // ⚠️ Race condition! Might exceed capacity
    await db.query(
      'INSERT INTO registrations (user_id, event_id) VALUES (?, ?)',
      [userId, eventId]
    );

    await db.query(
      'UPDATE events SET registered_count = registered_count + 1 WHERE id = ?',
      [eventId]
    );
  }
});

// RIGHT: Atomic check and update
app.post('/register/:eventId', async (req, res) => {
  await db.query('BEGIN TRANSACTION');

  try {
    const event = await db.query(
      'SELECT registered_count, max_capacity FROM events WHERE id = ? FOR UPDATE',
      [eventId]
    );

    if (event.registered_count >= event.max_capacity) {
      await db.query('ROLLBACK');
      return res.status(400).json({ error: 'Event full' });
    }

    await db.query(
      'INSERT INTO registrations (user_id, event_id) VALUES (?, ?)',
      [userId, eventId]
    );

    await db.query(
      'UPDATE events SET registered_count = registered_count + 1 WHERE id = ?',
      [eventId]
    );

    await db.query('COMMIT');
    res.json({ success: true });
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  }
});
```

## Node.js Specific: Is JavaScript Single-Threaded Safe?

**Common Misconception:** "Node.js is single-threaded, so I don't need to worry about race conditions!"

**Reality:** Race conditions STILL happen!

```javascript
let counter = 0;

app.get('/increment', async (req, res) => {
  // Step 1: Read counter
  const current = counter;

  // Step 2: Simulate database delay
  await sleep(10);

  // Step 3: Write counter
  counter = current + 1;

  res.json({ counter });
});
```

**What happens with 2 concurrent requests:**

```
Time   Request A                Request B               counter value
───────────────────────────────────────────────────────────────────
0ms    Read: current = 0                                0
1ms                             Read: current = 0       0
10ms   Await sleep...           Await sleep...          0
11ms   counter = 0 + 1          (still waiting)         1
12ms   (done)                   counter = 0 + 1         1 ❌ (should be 2!)
```

**Why?** Even though JavaScript is single-threaded, `await` pauses execution! The event loop switches to other requests.

**Solution:** Use atomic operations or locks, even in Node.js!

## Summary: Best Practices

1. **Use Atomic Operations** (best performance)
   ```javascript
   UPDATE table SET counter = counter + 1
   ```

2. **Use Database Transactions** (when you need multiple operations)
   ```javascript
   BEGIN TRANSACTION
   SELECT ... FOR UPDATE
   UPDATE ...
   COMMIT
   ```

3. **Use Optimistic Locking** (for better concurrency)
   ```javascript
   UPDATE table SET value = ? WHERE id = ? AND version = ?
   ```

4. **Use Distributed Locks** (for multi-server setups)
   ```javascript
   Redis SET lock:key value EX 10 NX
   ```

5. **Use Unique Constraints** (prevent duplicates at DB level)
   ```sql
   CREATE UNIQUE INDEX idx ON table(user_id, item_id)
   ```

**Next:** [Database Transactions and Locking](./05-database-locking.md) - Deep dive into ACID, isolation levels, and deadlocks!
