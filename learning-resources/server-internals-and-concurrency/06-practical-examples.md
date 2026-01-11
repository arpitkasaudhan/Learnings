# Practical Examples: Real Code You Can Run

## Setup

First, let's set up a basic Express server with a database.

### Install Dependencies

```bash
npm install express mysql2 redis ioredis
```

### Database Setup

```sql
-- Create test database
CREATE DATABASE concurrency_demo;
USE concurrency_demo;

-- Accounts table
CREATE TABLE accounts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  balance DECIMAL(10, 2),
  version INT DEFAULT 0
);

-- Insert test data
INSERT INTO accounts (name, balance) VALUES
  ('Alice', 1000.00),
  ('Bob', 2000.00),
  ('Charlie', 3000.00);

-- Likes table (for social media example)
CREATE TABLE posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200),
  like_count INT DEFAULT 0
);

CREATE TABLE likes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  post_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_like (user_id, post_id)
);

INSERT INTO posts (title) VALUES ('My awesome post');
```

## Example 1: Race Condition (Broken)

**Demonstrates the problem!**

```javascript
const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'concurrency_demo',
  waitForConnections: true,
  connectionLimit: 10
});

// ❌ BROKEN: Has race condition!
app.post('/deposit-broken/:id', async (req, res) => {
  const accountId = req.params.id;
  const amount = parseFloat(req.body.amount);

  try {
    // Step 1: Read balance
    const [rows] = await pool.query(
      'SELECT balance FROM accounts WHERE id = ?',
      [accountId]
    );

    const currentBalance = rows[0].balance;
    console.log(`Read balance: ${currentBalance}`);

    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 100));

    // Step 2: Calculate new balance
    const newBalance = parseFloat(currentBalance) + amount;
    console.log(`New balance: ${newBalance}`);

    // Step 3: Write back
    await pool.query(
      'UPDATE accounts SET balance = ? WHERE id = ?',
      [newBalance, accountId]
    );

    res.json({ balance: newBalance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Test the Race Condition

```bash
# Terminal 1: Start server
node server.js

# Terminal 2: Send concurrent requests
curl -X POST http://localhost:3000/deposit-broken/1 \
  -H "Content-Type: application/json" \
  -d '{"amount": 100}' &

curl -X POST http://localhost:3000/deposit-broken/1 \
  -H "Content-Type: application/json" \
  -d '{"amount": 200}' &

# Check final balance
mysql> SELECT balance FROM accounts WHERE id = 1;
-- Expected: 1300
-- Actual: 1200 or 1100 ❌ (lost update!)
```

## Example 2: Fix with Atomic Operation

**Simple and correct!**

```javascript
// ✓ CORRECT: Atomic update
app.post('/deposit-atomic/:id', async (req, res) => {
  const accountId = req.params.id;
  const amount = parseFloat(req.body.amount);

  try {
    // Single atomic operation!
    await pool.query(
      'UPDATE accounts SET balance = balance + ? WHERE id = ?',
      [amount, accountId]
    );

    // Read the new balance
    const [rows] = await pool.query(
      'SELECT balance FROM accounts WHERE id = ?',
      [accountId]
    );

    res.json({ balance: rows[0].balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Test

```bash
# Reset balance
mysql> UPDATE accounts SET balance = 1000 WHERE id = 1;

# Send concurrent requests
curl -X POST http://localhost:3000/deposit-atomic/1 \
  -H "Content-Type: application/json" \
  -d '{"amount": 100}' &

curl -X POST http://localhost:3000/deposit-atomic/1 \
  -H "Content-Type: application/json" \
  -d '{"amount": 200}' &

# Check balance
mysql> SELECT balance FROM accounts WHERE id = 1;
-- Result: 1300 ✓ Correct!
```

## Example 3: Pessimistic Locking (SELECT FOR UPDATE)

**For complex operations that need multiple steps**

```javascript
// ✓ CORRECT: Pessimistic locking
app.post('/transfer', async (req, res) => {
  const { fromId, toId, amount } = req.body;
  const connection = await pool.getConnection();

  try {
    // Start transaction
    await connection.beginTransaction();

    // Lock both rows (in consistent order to prevent deadlock)
    const ids = [fromId, toId].sort((a, b) => a - b);

    const [accounts] = await connection.query(
      'SELECT id, balance FROM accounts WHERE id IN (?, ?) FOR UPDATE',
      ids
    );

    // Find each account
    const fromAccount = accounts.find(a => a.id === fromId);
    const toAccount = accounts.find(a => a.id === toId);

    if (!fromAccount || !toAccount) {
      throw new Error('Account not found');
    }

    if (fromAccount.balance < amount) {
      throw new Error('Insufficient funds');
    }

    // Perform transfer
    await connection.query(
      'UPDATE accounts SET balance = balance - ? WHERE id = ?',
      [amount, fromId]
    );

    await connection.query(
      'UPDATE accounts SET balance = balance + ? WHERE id = ?',
      [amount, toId]
    );

    // Commit transaction
    await connection.commit();

    res.json({ success: true });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});
```

### Test

```bash
# Reset balances
mysql> UPDATE accounts SET balance = 1000 WHERE id IN (1, 2);

# Transfer $500 from Alice (1) to Bob (2)
curl -X POST http://localhost:3000/transfer \
  -H "Content-Type: application/json" \
  -d '{"fromId": 1, "toId": 2, "amount": 500}'

# Check balances
mysql> SELECT * FROM accounts WHERE id IN (1, 2);
-- Alice: 500, Bob: 2500 ✓
```

## Example 4: Optimistic Locking (Version Number)

**Better concurrency for low-conflict scenarios**

```javascript
// ✓ CORRECT: Optimistic locking
app.post('/deposit-optimistic/:id', async (req, res) => {
  const accountId = req.params.id;
  const amount = parseFloat(req.body.amount);
  const maxRetries = 3;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Read current balance and version
      const [rows] = await pool.query(
        'SELECT balance, version FROM accounts WHERE id = ?',
        [accountId]
      );

      const { balance, version } = rows[0];
      const newBalance = parseFloat(balance) + amount;

      // Try to update, but only if version hasn't changed
      const [result] = await pool.query(
        `UPDATE accounts
         SET balance = ?, version = version + 1
         WHERE id = ? AND version = ?`,
        [newBalance, accountId, version]
      );

      if (result.affectedRows === 0) {
        // Version changed! Someone else updated it
        console.log(`Conflict detected, retry ${attempt + 1}`);
        await new Promise(resolve =>
          setTimeout(resolve, Math.random() * 50)
        );
        continue; // Retry
      }

      // Success!
      return res.json({ balance: newBalance, attempt: attempt + 1 });

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.status(409).json({ error: 'Too many conflicts, please retry' });
});
```

### Test

```bash
# Send many concurrent requests
for i in {1..10}; do
  curl -X POST http://localhost:3000/deposit-optimistic/1 \
    -H "Content-Type: application/json" \
    -d '{"amount": 10}' &
done

wait

# Check balance and version
mysql> SELECT balance, version FROM accounts WHERE id = 1;
-- Balance should be 1000 + (10 * 10) = 1100
-- Version should be 10
```

## Example 5: Distributed Lock with Redis

**For multi-server deployments**

```javascript
const Redis = require('ioredis');
const redis = new Redis();

// Distributed lock utility
class DistributedLock {
  constructor(redis) {
    this.redis = redis;
  }

  async acquire(key, ttl = 10000) {
    const lockKey = `lock:${key}`;
    const lockValue = Math.random().toString(36);
    const acquired = await this.redis.set(
      lockKey,
      lockValue,
      'PX', ttl,  // Expire after ttl milliseconds
      'NX'        // Only set if not exists
    );

    if (!acquired) {
      throw new Error('Could not acquire lock');
    }

    return lockValue;
  }

  async release(key, lockValue) {
    const lockKey = `lock:${key}`;
    // Lua script to ensure we only delete our own lock
    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
    return await this.redis.eval(script, 1, lockKey, lockValue);
  }

  async withLock(key, callback, ttl = 10000) {
    const lockValue = await this.acquire(key, ttl);
    try {
      return await callback();
    } finally {
      await this.release(key, lockValue);
    }
  }
}

const distributedLock = new DistributedLock(redis);

// ✓ CORRECT: Distributed lock
app.post('/deposit-distributed/:id', async (req, res) => {
  const accountId = req.params.id;
  const amount = parseFloat(req.body.amount);

  try {
    const result = await distributedLock.withLock(
      `account:${accountId}`,
      async () => {
        // This code runs exclusively across ALL servers

        const [rows] = await pool.query(
          'SELECT balance FROM accounts WHERE id = ?',
          [accountId]
        );

        const currentBalance = rows[0].balance;
        const newBalance = parseFloat(currentBalance) + amount;

        await pool.query(
          'UPDATE accounts SET balance = ? WHERE id = ?',
          [newBalance, accountId]
        );

        return newBalance;
      },
      5000 // 5 second timeout
    );

    res.json({ balance: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Example 6: Preventing Double-Like

**Using database unique constraints**

```javascript
app.post('/like/:postId', async (req, res) => {
  const postId = req.params.postId;
  const userId = req.body.userId;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Try to insert like (will fail if already exists due to unique constraint)
    await connection.query(
      'INSERT INTO likes (user_id, post_id) VALUES (?, ?)',
      [userId, postId]
    );

    // Increment like count atomically
    await connection.query(
      'UPDATE posts SET like_count = like_count + 1 WHERE id = ?',
      [postId]
    );

    await connection.commit();
    res.json({ success: true, message: 'Liked!' });

  } catch (error) {
    await connection.rollback();

    if (error.code === 'ER_DUP_ENTRY') {
      // Already liked, that's okay
      res.json({ success: false, message: 'Already liked' });
    } else {
      res.status(500).json({ error: error.message });
    }
  } finally {
    connection.release();
  }
});

app.delete('/unlike/:postId', async (req, res) => {
  const postId = req.params.postId;
  const userId = req.body.userId;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Try to delete like
    const [result] = await connection.query(
      'DELETE FROM likes WHERE user_id = ? AND post_id = ?',
      [userId, postId]
    );

    if (result.affectedRows === 0) {
      throw new Error('Not liked');
    }

    // Decrement like count atomically
    await connection.query(
      'UPDATE posts SET like_count = like_count - 1 WHERE id = ?',
      [postId]
    );

    await connection.commit();
    res.json({ success: true, message: 'Unliked!' });

  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});
```

### Test

```bash
# Same user likes the same post twice
curl -X POST http://localhost:3000/like/1 \
  -H "Content-Type: application/json" \
  -d '{"userId": 1}' &

curl -X POST http://localhost:3000/like/1 \
  -H "Content-Type: application/json" \
  -d '{"userId": 1}' &

# One succeeds, one returns "Already liked"
# Like count is correctly 1
```

## Example 7: Load Testing

**See race conditions in action!**

```javascript
// load-test.js
const axios = require('axios');

async function testConcurrency(endpoint, concurrency) {
  console.log(`\nTesting ${endpoint} with ${concurrency} concurrent requests...`);

  // Reset balance
  await axios.post('http://localhost:3000/reset');

  const promises = [];
  const startTime = Date.now();

  for (let i = 0; i < concurrency; i++) {
    promises.push(
      axios.post(`http://localhost:3000${endpoint}`, {
        amount: 10
      }).catch(err => ({
        error: err.response?.data || err.message
      }))
    );
  }

  const results = await Promise.all(promises);
  const endTime = Date.now();

  const errors = results.filter(r => r.error).length;
  const success = results.length - errors;

  console.log(`Completed in ${endTime - startTime}ms`);
  console.log(`Success: ${success}, Errors: ${errors}`);

  // Check final balance
  const balance = await axios.get('http://localhost:3000/balance/1');
  console.log(`Final balance: ${balance.data.balance}`);
  console.log(`Expected: ${1000 + (concurrency * 10)}`);
  console.log(`Lost updates: ${(concurrency * 10) - (balance.data.balance - 1000)}`);
}

async function runTests() {
  await testConcurrency('/deposit-broken/1', 100);
  await testConcurrency('/deposit-atomic/1', 100);
  await testConcurrency('/deposit-optimistic/1', 100);
}

runTests().catch(console.error);
```

### Expected Output

```
Testing /deposit-broken/1 with 100 concurrent requests...
Completed in 523ms
Success: 100, Errors: 0
Final balance: 1350
Expected: 2000
Lost updates: 650 ❌

Testing /deposit-atomic/1 with 100 concurrent requests...
Completed in 234ms
Success: 100, Errors: 0
Final balance: 2000
Expected: 2000
Lost updates: 0 ✓

Testing /deposit-optimistic/1 with 100 concurrent requests...
Completed in 312ms
Success: 100, Errors: 0
Final balance: 2000
Expected: 2000
Lost updates: 0 ✓
```

## Example 8: Deadlock Detection

**Demonstrating and handling deadlocks**

```javascript
// Create deadlock intentionally
app.post('/test-deadlock', async (req, res) => {
  const connection1 = await pool.getConnection();
  const connection2 = await pool.getConnection();

  try {
    // Transaction 1
    const txn1 = async () => {
      await connection1.beginTransaction();
      console.log('Txn1: Locking account 1');
      await connection1.query(
        'SELECT * FROM accounts WHERE id = 1 FOR UPDATE'
      );
      await sleep(100); // Give time for deadlock to form
      console.log('Txn1: Trying to lock account 2');
      await connection1.query(
        'SELECT * FROM accounts WHERE id = 2 FOR UPDATE'
      );
      await connection1.commit();
      console.log('Txn1: Success!');
    };

    // Transaction 2
    const txn2 = async () => {
      await connection2.beginTransaction();
      console.log('Txn2: Locking account 2');
      await connection2.query(
        'SELECT * FROM accounts WHERE id = 2 FOR UPDATE'
      );
      await sleep(100); // Give time for deadlock to form
      console.log('Txn2: Trying to lock account 1');
      await connection2.query(
        'SELECT * FROM accounts WHERE id = 1 FOR UPDATE'
      );
      await connection2.commit();
      console.log('Txn2: Success!');
    };

    // Run both transactions concurrently
    await Promise.all([
      txn1().catch(err => console.log('Txn1 failed:', err.code)),
      txn2().catch(err => console.log('Txn2 failed:', err.code))
    ]);

    res.json({ message: 'Check console for deadlock' });

  } finally {
    connection1.release();
    connection2.release();
  }
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

### Expected Output

```
Txn1: Locking account 1
Txn2: Locking account 2
Txn1: Trying to lock account 2
Txn2: Trying to lock account 1
Txn2 failed: ER_LOCK_DEADLOCK
Txn1: Success!
```

## Complete Server Example

```javascript
// complete-server.js
const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'concurrency_demo',
  waitForConnections: true,
  connectionLimit: 10
});

// Helper: Reset account balance
app.post('/reset', async (req, res) => {
  await pool.query('UPDATE accounts SET balance = 1000, version = 0 WHERE id = 1');
  res.json({ message: 'Reset complete' });
});

// Helper: Get balance
app.get('/balance/:id', async (req, res) => {
  const [rows] = await pool.query(
    'SELECT balance, version FROM accounts WHERE id = ?',
    [req.params.id]
  );
  res.json(rows[0]);
});

// Add all the endpoints from examples above...
// (deposit-broken, deposit-atomic, deposit-optimistic, transfer, etc.)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`
Available endpoints:
  POST /deposit-broken/:id      - ❌ Race condition demo
  POST /deposit-atomic/:id       - ✓ Atomic update
  POST /deposit-optimistic/:id   - ✓ Optimistic locking
  POST /transfer                 - ✓ Pessimistic locking
  POST /like/:postId             - ✓ Unique constraint
  GET  /balance/:id              - Get account balance
  POST /reset                    - Reset test data
  `);
});
```

## Running the Examples

```bash
# 1. Install dependencies
npm install express mysql2 redis ioredis axios

# 2. Setup database (run SQL from above)

# 3. Start server
node complete-server.js

# 4. In another terminal, run load tests
node load-test.js

# 5. Watch the console for results!
```

## Summary

These examples demonstrate:

1. **Race conditions** are real and cause data loss
2. **Atomic operations** are the simplest fix
3. **Pessimistic locking** guarantees safety but reduces concurrency
4. **Optimistic locking** provides better concurrency with retry logic
5. **Distributed locks** work across multiple servers
6. **Database constraints** prevent logical errors
7. **Deadlocks** happen and must be handled

**Key Takeaway:** Always think about concurrent access when writing server code!

---

## Next Steps

- Read about [MVCC in PostgreSQL](https://www.postgresql.org/docs/current/mvcc.html)
- Learn about [Redis transactions](https://redis.io/topics/transactions)
- Explore [distributed consensus algorithms](https://raft.github.io/)
- Study [event sourcing and CQRS](https://martinfowler.com/eaaDev/EventSourcing.html)

Happy coding! 🚀
