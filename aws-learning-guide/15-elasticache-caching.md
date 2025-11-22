# Lesson 15: ElastiCache (Caching)

## What is ElastiCache?

**ElastiCache** = Managed in-memory data store.

**Engines**:
- **Redis**: Advanced features (persistence, pub/sub, data structures)
- **Memcached**: Simple, multi-threaded

**Benefits**:
- Sub-millisecond latency
- Reduce database load
- Scale read-heavy workloads
- Session storage

---

## When to Use Caching?

### Good Use Cases

✅ **Frequently accessed data** (hot data)
✅ **Expensive queries** (complex joins, aggregations)
✅ **Session storage** (user sessions, JWT tokens)
✅ **Rate limiting** (API throttling)
✅ **Leaderboards** (sorted sets)
✅ **Real-time analytics** (counters, metrics)

### Bad Use Cases

❌ **Frequently updated data** (cache invalidation issues)
❌ **Data that must be consistent** (use database)
❌ **Large objects** (> 1MB)

---

## Create ElastiCache (Redis)

```bash
# Create Redis cluster
aws elasticache create-cache-cluster \
  --cache-cluster-id vahanhelp-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1 \
  --cache-subnet-group-name vahanhelp-subnet-group \
  --security-group-ids sg-123

# Get endpoint
aws elasticache describe-cache-clusters \
  --cache-cluster-id vahanhelp-redis \
  --show-cache-node-info
```

**Endpoint**: `vahanhelp-redis.abc123.0001.use1.cache.amazonaws.com:6379`

---

## Connect to Redis from Node.js

```javascript
const redis = require('redis');

const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST, // ElastiCache endpoint
    port: 6379
  }
});

client.on('error', (err) => console.error('Redis error:', err));
client.on('connect', () => console.log('Connected to Redis'));

await client.connect();

module.exports = client;
```

---

## Caching Patterns

### 1. Cache-Aside (Lazy Loading)

**Most common pattern**: Read from cache first, if miss → read from DB → cache it

```javascript
const redis = require('./redis');

// Get car by ID
async function getCar(carId) {
  const cacheKey = `car:${carId}`;

  // 1. Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log('Cache hit');
    return JSON.parse(cached);
  }

  // 2. Cache miss → Query database
  console.log('Cache miss');
  const car = await db.query('SELECT * FROM cars WHERE id = $1', [carId]);

  if (!car) return null;

  // 3. Store in cache (TTL: 1 hour)
  await redis.setEx(cacheKey, 3600, JSON.stringify(car));

  return car;
}

// API endpoint
app.get('/api/cars/:id', async (req, res) => {
  const car = await getCar(req.params.id);
  res.json({ car });
});
```

**Pros**: Only cache what's needed
**Cons**: Cache miss penalty, stale data

---

### 2. Write-Through

**Pattern**: Write to cache AND database together

```javascript
// Update car
async function updateCar(carId, data) {
  const cacheKey = `car:${carId}`;

  // 1. Update database
  const car = await db.query(
    'UPDATE cars SET make = $1, model = $2 WHERE id = $3 RETURNING *',
    [data.make, data.model, carId]
  );

  // 2. Update cache
  await redis.setEx(cacheKey, 3600, JSON.stringify(car));

  return car;
}
```

**Pros**: Cache always fresh
**Cons**: Write latency, unused data cached

---

### 3. Write-Behind (Write-Back)

**Pattern**: Write to cache → async write to database

```javascript
// Queue writes to database
async function updateCarAsync(carId, data) {
  const cacheKey = `car:${carId}`;

  // 1. Update cache immediately
  await redis.setEx(cacheKey, 3600, JSON.stringify(data));

  // 2. Queue database write
  await redis.lPush('db-write-queue', JSON.stringify({ carId, data }));

  return data;
}

// Worker: Process write queue
async function processWriteQueue() {
  while (true) {
    const item = await redis.brPop('db-write-queue', 0);
    if (item) {
      const { carId, data } = JSON.parse(item.element);
      await db.query('UPDATE cars SET make = $1, model = $2 WHERE id = $3', [data.make, data.model, carId]);
    }
  }
}
```

**Pros**: Fast writes
**Cons**: Data loss risk, complexity

---

## Cache Invalidation Strategies

### 1. TTL (Time-To-Live)

```javascript
// Expire after 1 hour
await redis.setEx('car:123', 3600, JSON.stringify(car));

// Expire at specific time (midnight)
const midnight = new Date();
midnight.setHours(24, 0, 0, 0);
await redis.expireAt('daily-stats', Math.floor(midnight.getTime() / 1000));
```

### 2. Manual Invalidation

```javascript
// Delete on update
async function updateCar(carId, data) {
  await db.query('UPDATE cars SET ... WHERE id = $1', [carId]);

  // Invalidate cache
  await redis.del(`car:${carId}`);
}
```

### 3. Pattern-Based Invalidation

```javascript
// Delete all car caches
async function invalidateAllCars() {
  const keys = await redis.keys('car:*');
  if (keys.length > 0) {
    await redis.del(keys);
  }
}

// Better: Use Redis SCAN (non-blocking)
async function invalidateAllCarsSafe() {
  let cursor = 0;
  do {
    const result = await redis.scan(cursor, { MATCH: 'car:*', COUNT: 100 });
    cursor = result.cursor;
    if (result.keys.length > 0) {
      await redis.del(result.keys);
    }
  } while (cursor !== 0);
}
```

---

## Advanced Redis Use Cases

### 1. Session Storage

```javascript
const session = require('express-session');
const RedisStore = require('connect-redis').default;

app.use(session({
  store: new RedisStore({ client: redis }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

// Use session
app.post('/api/auth/login', async (req, res) => {
  const user = await authenticate(req.body);
  req.session.userId = user.id;
  res.json({ user });
});

app.get('/api/me', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json({ userId: req.session.userId });
});
```

---

### 2. Rate Limiting

```javascript
// Limit: 100 requests per hour per IP
async function rateLimit(req, res, next) {
  const key = `rate-limit:${req.ip}`;

  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, 3600); // Reset after 1 hour
  }

  if (current > 100) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  res.set('X-RateLimit-Limit', 100);
  res.set('X-RateLimit-Remaining', 100 - current);

  next();
}

app.use('/api/', rateLimit);
```

---

### 3. Leaderboard (Sorted Sets)

```javascript
// Add score
async function updateLeaderboard(userId, score) {
  await redis.zAdd('leaderboard', { score, value: userId });
}

// Get top 10
async function getTopPlayers() {
  const top = await redis.zRangeWithScores('leaderboard', 0, 9, { REV: true });
  return top.map(({ value, score }) => ({ userId: value, score }));
}

// Get user rank
async function getUserRank(userId) {
  const rank = await redis.zRevRank('leaderboard', userId);
  return rank !== null ? rank + 1 : null;
}

// API
app.post('/api/game/score', async (req, res) => {
  await updateLeaderboard(req.user.id, req.body.score);
  const rank = await getUserRank(req.user.id);
  res.json({ rank });
});

app.get('/api/leaderboard', async (req, res) => {
  const top = await getTopPlayers();
  res.json({ leaderboard: top });
});
```

---

### 4. Pub/Sub (Real-time)

```javascript
// Publisher
async function notifyNewQuote(quote) {
  await redis.publish('new-quotes', JSON.stringify(quote));
}

// Subscriber
const subscriber = redis.duplicate();
await subscriber.connect();

await subscriber.subscribe('new-quotes', (message) => {
  const quote = JSON.parse(message);
  console.log('New quote received:', quote);
  // Send to WebSocket clients, update dashboard, etc.
});

// API
app.post('/api/insurance/quote', async (req, res) => {
  const quote = await InsuranceQuote.create(req.body);

  // Notify subscribers in real-time
  await notifyNewQuote(quote);

  res.status(201).json({ quote });
});
```

---

### 5. Distributed Lock

```javascript
// Prevent race conditions
async function processPayment(orderId) {
  const lockKey = `lock:order:${orderId}`;

  // Try to acquire lock (5 second TTL)
  const locked = await redis.set(lockKey, '1', { NX: true, EX: 5 });

  if (!locked) {
    throw new Error('Order is being processed by another instance');
  }

  try {
    // Process payment
    await chargeCard(orderId);
    await updateOrderStatus(orderId, 'paid');
  } finally {
    // Release lock
    await redis.del(lockKey);
  }
}
```

---

## Complete Caching Layer

```javascript
// src/services/cache.js
const redis = require('./redis');

class Cache {
  async get(key) {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key, value, ttl = 3600) {
    await redis.setEx(key, ttl, JSON.stringify(value));
  }

  async del(key) {
    await redis.del(key);
  }

  async invalidatePattern(pattern) {
    let cursor = 0;
    do {
      const result = await redis.scan(cursor, { MATCH: pattern, COUNT: 100 });
      cursor = result.cursor;
      if (result.keys.length > 0) {
        await redis.del(result.keys);
      }
    } while (cursor !== 0);
  }

  async remember(key, ttl, callback) {
    const cached = await this.get(key);
    if (cached) return cached;

    const value = await callback();
    await this.set(key, value, ttl);
    return value;
  }
}

module.exports = new Cache();
```

**Usage**:
```javascript
const cache = require('./services/cache');

// Get car (with caching)
app.get('/api/cars/:id', async (req, res) => {
  const car = await cache.remember(
    `car:${req.params.id}`,
    3600,
    () => db.query('SELECT * FROM cars WHERE id = $1', [req.params.id])
  );
  res.json({ car });
});

// Update car (invalidate cache)
app.put('/api/cars/:id', async (req, res) => {
  const car = await db.query('UPDATE cars SET ... WHERE id = $1', [req.params.id]);
  await cache.del(`car:${req.params.id}`);
  res.json({ car });
});
```

---

## Monitoring

```javascript
// Cache hit rate
let cacheHits = 0;
let cacheMisses = 0;

async function getCached(key) {
  const value = await cache.get(key);
  if (value) {
    cacheHits++;
  } else {
    cacheMisses++;
  }
  return value;
}

// Report metrics every minute
setInterval(() => {
  const total = cacheHits + cacheMisses;
  const hitRate = total > 0 ? (cacheHits / total * 100).toFixed(2) : 0;
  console.log(`Cache hit rate: ${hitRate}% (${cacheHits}/${total})`);

  // Send to CloudWatch
  trackMetric('CacheHitRate', parseFloat(hitRate), 'Percent');

  cacheHits = 0;
  cacheMisses = 0;
}, 60000);
```

---

## Practice Exercise

1. Set up ElastiCache Redis cluster
2. Implement cache-aside pattern for cars API
3. Add session storage with Redis
4. Build rate limiting middleware
5. Create leaderboard with sorted sets
6. Monitor cache hit rate

---

## Best Practices

- **Set TTL** on all keys (prevent memory leaks)
- **Use namespaces**: `car:123`, `user:456`
- **Monitor hit rate**: Target > 80%
- **Cache small objects**: < 100KB
- **Handle cache failures**: Graceful degradation
- **Use connection pooling**: `redis.createClient({ legacyMode: false })`

---

**Next Lesson**: [16-cicd-codepipeline.md](16-cicd-codepipeline.md)
