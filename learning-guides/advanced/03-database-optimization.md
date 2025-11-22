# Database Optimization - From Beginner to Advanced

## 📖 Introduction

Database optimization is crucial for building fast, scalable applications. This guide covers optimization techniques for both SQL and MongoDB, from basic to advanced levels.

## 🎯 Performance Fundamentals

### The Query Lifecycle

```
1. Application sends query
   ↓
2. Database parses query
   ↓
3. Query planner creates execution plan
   ↓
4. Database executes query
   ↓
5. Results returned to application
```

**Optimization goal:** Minimize time at each step!

## 📊 Level 1: Beginner Optimizations

### 1. Create Indexes (Most Important!)

**What are indexes?**
Like a book's index - helps find data quickly without reading everything.

**SQL:**
```sql
-- Without index (SLOW - scans all rows)
SELECT * FROM cars WHERE brand = 'Maruti';  -- Scans 1M rows

-- Create index
CREATE INDEX idx_brand ON cars(brand);

-- With index (FAST - uses index)
SELECT * FROM cars WHERE brand = 'Maruti';  -- Scans only Maruti rows
```

**MongoDB:**
```javascript
// Without index (SLOW)
db.cars.find({ brand: "Maruti" })  // Collection scan

// Create index
db.cars.createIndex({ brand: 1 })

// With index (FAST)
db.cars.find({ brand: "Maruti" })  // Index scan
```

**When to create indexes:**
- ✅ Columns used in WHERE clauses
- ✅ Columns used in JOIN conditions
- ✅ Columns used in ORDER BY
- ✅ Foreign keys
- ❌ Columns that change frequently
- ❌ Small tables (< 1000 rows)

### 2. Select Only Needed Columns

**SQL:**
```sql
-- ❌ BAD: Returns all columns (more data transferred)
SELECT * FROM cars WHERE city = 'Delhi';

-- ✅ GOOD: Returns only needed columns
SELECT brand, model, price FROM cars WHERE city = 'Delhi';
```

**MongoDB:**
```javascript
// ❌ BAD
db.cars.find({ city: "Delhi" })

// ✅ GOOD: Projection
db.cars.find(
  { city: "Delhi" },
  { brand: 1, model: 1, price: 1, _id: 0 }
)
```

**Impact:** 50-90% reduction in data transfer!

### 3. Use LIMIT for Large Result Sets

**SQL:**
```sql
-- ❌ BAD: Returns all rows (could be millions)
SELECT * FROM cars ORDER BY created_at DESC;

-- ✅ GOOD: Returns only 20 rows
SELECT * FROM cars ORDER BY created_at DESC LIMIT 20;
```

**MongoDB:**
```javascript
// ❌ BAD
db.cars.find().sort({ createdAt: -1 })

// ✅ GOOD
db.cars.find().sort({ createdAt: -1 }).limit(20)
```

### 4. Avoid SELECT DISTINCT When Possible

**SQL:**
```sql
-- ❌ SLOW: Requires sorting entire result
SELECT DISTINCT brand FROM cars;

-- ✅ FASTER: Use GROUP BY
SELECT brand FROM cars GROUP BY brand;

-- ✅ EVEN BETTER: If you just need to check existence
SELECT brand FROM cars LIMIT 1;
```

### 5. Use Appropriate Data Types

**SQL:**
```sql
-- ❌ BAD: Wastes space, slower comparisons
phone VARCHAR(255)  -- Only need 15 chars
age INT             -- TINYINT enough
price FLOAT         -- Use DECIMAL for money

-- ✅ GOOD
phone VARCHAR(15)
age TINYINT
price DECIMAL(10,2)
```

**Impact:** Smaller data = faster queries, less storage!

## 📈 Level 2: Intermediate Optimizations

### 1. Compound Indexes

**SQL:**
```sql
-- Query uses multiple columns
SELECT * FROM cars
WHERE city = 'Delhi' AND brand = 'Maruti'
ORDER BY price;

-- Create compound index
CREATE INDEX idx_city_brand_price ON cars(city, brand, price);
```

**Index Column Order Matters!**
```sql
-- Index: (city, brand, price)

-- ✅ Uses index (left-to-right)
WHERE city = 'Delhi'
WHERE city = 'Delhi' AND brand = 'Maruti'
WHERE city = 'Delhi' AND brand = 'Maruti' AND price > 500000

-- ❌ Doesn't use index (skips left columns)
WHERE brand = 'Maruti'
WHERE price > 500000
```

**Rule:** Most selective column first (city has 100 values, brand has 20)

**MongoDB:**
```javascript
// Create compound index
db.cars.createIndex({ city: 1, brand: 1, price: 1 })

// Uses index
db.cars.find({ city: "Delhi", brand: "Maruti" }).sort({ price: 1 })
```

### 2. Covering Indexes (Advanced!)

**Covering index** = Index contains all columns needed by query.

**SQL:**
```sql
-- Query
SELECT brand, model, price FROM cars WHERE city = 'Delhi';

-- Normal index (requires table lookup)
CREATE INDEX idx_city ON cars(city);
-- Process: Index → Find matching cities → Look up rows in table → Get brand, model, price

-- Covering index (no table lookup needed!)
CREATE INDEX idx_city_brand_model_price ON cars(city, brand, model, price);
-- Process: Index → Find matching cities → Return data directly from index
```

**Speed increase:** 2-10x faster!

### 3. Avoid Functions on Indexed Columns

**SQL:**
```sql
-- ❌ BAD: Function prevents index usage
SELECT * FROM users WHERE UPPER(name) = 'RAHUL';
SELECT * FROM cars WHERE YEAR(created_at) = 2024;

-- ✅ GOOD: Index can be used
SELECT * FROM users WHERE name = 'Rahul';
SELECT * FROM cars WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01';
```

### 4. Use EXISTS Instead of COUNT

**SQL:**
```sql
-- ❌ SLOW: Counts all matching rows
SELECT COUNT(*) FROM cars WHERE dealer_id = 123;
IF count > 0 THEN ...

-- ✅ FAST: Stops at first match
SELECT EXISTS(SELECT 1 FROM cars WHERE dealer_id = 123 LIMIT 1);
```

### 5. Optimize JOINs

**SQL:**
```sql
-- ❌ BAD: No indexes on JOIN columns
SELECT u.name, c.brand
FROM users u
JOIN cars c ON u.user_id = c.dealer_id;

-- ✅ GOOD: Index both sides of JOIN
CREATE INDEX idx_users_user_id ON users(user_id);
CREATE INDEX idx_cars_dealer_id ON cars(dealer_id);
```

**Join Order Matters:**
```sql
-- ❌ SLOW: Joins large table first
SELECT *
FROM cars c
JOIN dealers d ON c.dealer_id = d.dealer_id
WHERE d.city = 'Delhi';
-- Process: Join all cars with all dealers → Filter by city

-- ✅ FAST: Filter first, then join
SELECT *
FROM dealers d
JOIN cars c ON d.dealer_id = c.dealer_id
WHERE d.city = 'Delhi';
-- Process: Filter dealers by city → Join only matching dealers
```

### 6. MongoDB: Avoid $where and $regex

**MongoDB:**
```javascript
// ❌ SLOW: $where uses JavaScript evaluation
db.users.find({
  $where: "this.age > 18"
})

// ✅ FAST: Use query operators
db.users.find({ age: { $gt: 18 } })

// ❌ SLOW: Regex can't use index efficiently
db.users.find({ name: /rahul/i })

// ✅ BETTER: Use text index for search
db.users.createIndex({ name: "text" })
db.users.find({ $text: { $search: "rahul" } })
```

## 🚀 Level 3: Advanced Optimizations

### 1. Analyze and Optimize Queries

**SQL:**
```sql
-- Analyze query execution
EXPLAIN SELECT * FROM cars WHERE city = 'Delhi' AND price > 500000;

-- Look for:
-- - Type: ALL (bad, full table scan)
-- - Type: index, ref (good)
-- - Rows: High number = slow
```

**Output:**
```
+----+-------------+-------+------+---------+------+-------+
| id | type        | rows  | key  | Extra                  |
+----+-------------+-------+------+---------+------+-------+
| 1  | ALL         | 50000 | NULL | Using where            | ❌ BAD
| 1  | ref         | 1000  | idx  | Using index condition  | ✅ GOOD
+----+-------------+-------+------+---------+------+-------+
```

**MongoDB:**
```javascript
// Analyze query
db.cars.find({ city: "Delhi", price: { $gt: 500000 } }).explain("executionStats")

// Look for:
// - totalDocsExamined: Should be close to nReturned
// - executionTimeMillis: Lower is better
// - stage: COLLSCAN (bad) vs IXSCAN (good)
```

### 2. Pagination Optimization

**SQL:**
```sql
-- ❌ BAD: OFFSET gets slower as you go deeper
SELECT * FROM cars ORDER BY created_at LIMIT 20 OFFSET 10000;
-- Reads 10,020 rows, returns 20!

-- ✅ GOOD: Cursor-based pagination
SELECT * FROM cars
WHERE created_at < '2024-01-01 10:00:00'
ORDER BY created_at DESC
LIMIT 20;
-- Reads only 20 rows!
```

**MongoDB:**
```javascript
// ❌ BAD
db.cars.find().sort({ _id: -1 }).skip(10000).limit(20)

// ✅ GOOD: Range-based
db.cars.find({ _id: { $lt: lastSeenId } })
  .sort({ _id: -1 })
  .limit(20)
```

### 3. Denormalization for Performance

Sometimes duplicating data improves performance!

**Example: Dealer car count**

**SQL - Normalized (SLOW):**
```sql
-- Every time we need dealer stats, we COUNT
SELECT
  d.*,
  COUNT(c.car_id) as car_count
FROM dealers d
LEFT JOIN cars c ON d.dealer_id = c.dealer_id
GROUP BY d.dealer_id;
```

**SQL - Denormalized (FAST):**
```sql
-- Add car_count column to dealers table
ALTER TABLE dealers ADD COLUMN car_count INT DEFAULT 0;

-- Update via trigger
CREATE TRIGGER update_dealer_car_count
AFTER INSERT ON cars
FOR EACH ROW
  UPDATE dealers
  SET car_count = car_count + 1
  WHERE dealer_id = NEW.dealer_id;

-- Now just SELECT
SELECT * FROM dealers;  -- car_count already there!
```

**MongoDB - Embedded (FAST):**
```javascript
// Store count in dealer document
{
  _id: ObjectId("..."),
  businessName: "AutoWorld",
  stats: {
    carCount: 150,  // Updated when cars added/removed
    soldCount: 50
  }
}
```

**Trade-off:** Write slower (update count), read MUCH faster!

### 4. Partial Indexes

Index only rows that matter!

**SQL (PostgreSQL):**
```sql
-- Index only active cars
CREATE INDEX idx_active_cars ON cars(city, brand) WHERE status = 'active';

-- Much smaller index = faster queries
SELECT * FROM cars WHERE status = 'active' AND city = 'Delhi';
```

**MongoDB:**
```javascript
// Index only verified dealers
db.dealers.createIndex(
  { city: 1 },
  { partialFilterExpression: { isVerified: true } }
)
```

### 5. Database Caching

**Query Caching with Redis:**

```javascript
// Before
async function getCar(carId) {
  return await Car.findById(carId);  // Always hits DB
}

// After (with Redis)
async function getCar(carId) {
  const cacheKey = `car:${carId}`;

  // Check cache first
  let car = await redis.get(cacheKey);
  if (car) {
    return JSON.parse(car);  // Cache hit!
  }

  // Cache miss - query DB
  car = await Car.findById(carId);

  // Store in cache (expire in 1 hour)
  await redis.setex(cacheKey, 3600, JSON.stringify(car));

  return car;
}
```

**Caching Strategy:**
```
Read-through cache:
1. Check cache
2. If miss, query DB
3. Store in cache
4. Return data

Cache invalidation:
1. On update: Delete from cache
2. On delete: Delete from cache
3. Time-based: TTL expiration
```

### 6. Connection Pooling

**Without Pooling (SLOW):**
```javascript
// Every request creates new connection
app.get('/api/cars', async (req, res) => {
  const connection = await createConnection();  // 50-100ms!
  const cars = await connection.query('SELECT * FROM cars');
  await connection.close();
  res.json(cars);
});
```

**With Pooling (FAST):**
```javascript
// Reuse connections from pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'vahanhelp',
  connectionLimit: 10  // Keep 10 connections ready
});

app.get('/api/cars', async (req, res) => {
  const cars = await pool.query('SELECT * FROM cars');  // <1ms!
  res.json(cars);
});
```

### 7. Batch Operations

**SQL:**
```sql
-- ❌ SLOW: 100 separate queries
for (let i = 0; i < 100; i++) {
  INSERT INTO cars VALUES (...);
}

-- ✅ FAST: 1 query
INSERT INTO cars VALUES
  (...),
  (...),
  (...),
  -- 100 rows
  (...);
```

**MongoDB:**
```javascript
// ❌ SLOW
for (let i = 0; i < 100; i++) {
  await Car.create(data[i]);  // 100 round trips
}

// ✅ FAST
await Car.insertMany(data);  // 1 round trip
```

## 🎯 VahanHelp Specific Optimizations

### 1. Car Search Optimization

```javascript
// Car Model with optimized indexes
const carSchema = new mongoose.Schema({
  brand: String,
  model: String,
  city: String,
  price: Number,
  year: Number,
  status: String
});

// Compound index for common search
carSchema.index({
  status: 1,      // Filter active first
  city: 1,        // Then by city
  price: 1,       // Then price range
  year: -1        // Then sort by year
});

// Text index for keyword search
carSchema.index({
  brand: 'text',
  model: 'text',
  variant: 'text'
});

// Partial index for active listings only
carSchema.index(
  { city: 1, brand: 1 },
  { partialFilterExpression: { status: 'active' } }
);

// Optimized search query
async function searchCars(filters) {
  const { city, minPrice, maxPrice, brand, status = 'active' } = filters;

  const query = { status };

  if (city) query.city = city;
  if (brand) query.brand = brand;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = minPrice;
    if (maxPrice) query.price.$lte = maxPrice;
  }

  // Select only needed fields
  return Car.find(query)
    .select('brand model year price images city')
    .sort({ year: -1, price: 1 })
    .limit(20)
    .lean();  // Returns plain JavaScript objects (faster!)
}
```

### 2. Dealer Dashboard Optimization

```javascript
// ❌ SLOW: Multiple queries
async function getDealerDashboard(dealerId) {
  const dealer = await Dealer.findById(dealerId);
  const cars = await Car.find({ dealerId });
  const activeCars = cars.filter(c => c.status === 'active');
  const soldCars = cars.filter(c => c.status === 'sold');
  const leads = await Lead.find({ dealerId });
  const newLeads = leads.filter(l => l.status === 'new');

  return {
    dealer,
    totalCars: cars.length,
    activeCars: activeCars.length,
    soldCars: soldCars.length,
    totalLeads: leads.length,
    newLeads: newLeads.length
  };
}

// ✅ FAST: Single aggregation query
async function getDealerDashboard(dealerId) {
  const stats = await Car.aggregate([
    { $match: { dealerId: new ObjectId(dealerId) } },
    {
      $facet: {
        carStats: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              active: {
                $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
              },
              sold: {
                $sum: { $cond: [{ $eq: ['$status', 'sold'] }, 1, 0] }
              },
              totalValue: { $sum: '$price' }
            }
          }
        ]
      }
    }
  ]);

  const leadStats = await Lead.aggregate([
    { $match: { dealerId: new ObjectId(dealerId) } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        new: {
          $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] }
        }
      }
    }
  ]);

  return {
    cars: stats[0].carStats[0],
    leads: leadStats[0]
  };
}
```

### 3. Caching Strategy for VahanHelp

```javascript
const Redis = require('ioredis');
const redis = new Redis();

// Cache popular car listings
async function getPopularCars(city) {
  const cacheKey = `popular:${city}`;

  // Check cache
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // Query DB
  const cars = await Car.find({
    city,
    status: 'active'
  })
    .sort({ views: -1 })
    .limit(10)
    .lean();

  // Cache for 1 hour
  await redis.setex(cacheKey, 3600, JSON.stringify(cars));

  return cars;
}

// Cache user profile
async function getUserProfile(userId) {
  const cacheKey = `user:${userId}`;

  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const user = await User.findById(userId).lean();

  // Cache for 30 minutes
  await redis.setex(cacheKey, 1800, JSON.stringify(user));

  return user;
}

// Invalidate cache on update
async function updateUser(userId, updates) {
  const user = await User.findByIdAndUpdate(userId, updates, { new: true });

  // Invalidate cache
  await redis.del(`user:${userId}`);

  return user;
}
```

## 📊 Performance Monitoring

### 1. MongoDB Profiler

```javascript
// Enable profiling
db.setProfilingLevel(1, { slowms: 100 });  // Log queries > 100ms

// View slow queries
db.system.profile.find().sort({ ts: -1 }).limit(10);
```

### 2. SQL Slow Query Log

```sql
-- MySQL: Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;  -- Log queries > 1 second

-- View slow queries
cat /var/log/mysql/mysql-slow.log
```

### 3. Application Monitoring

```javascript
// Track query performance
const queryStart = Date.now();
const results = await Car.find(query);
const queryTime = Date.now() - queryStart;

if (queryTime > 1000) {
  console.warn(`Slow query detected: ${queryTime}ms`, query);
}
```

## ✅ Optimization Checklist

### Before Deploying:
- [ ] Add indexes on WHERE/JOIN/ORDER BY columns
- [ ] Use compound indexes for common query patterns
- [ ] Enable query caching (Redis)
- [ ] Set up connection pooling
- [ ] Add database monitoring
- [ ] Test with production-like data volume
- [ ] Run EXPLAIN on critical queries
- [ ] Implement pagination
- [ ] Select only needed fields
- [ ] Use batch operations where possible

### Monthly Maintenance:
- [ ] Review slow query logs
- [ ] Analyze unused indexes
- [ ] Update statistics
- [ ] Check index fragmentation
- [ ] Review and update caching strategy
- [ ] Monitor database size growth
- [ ] Test backup/restore procedures

## 🎯 Quick Wins Summary

1. **Add indexes** - 10-1000x speedup
2. **Select specific columns** - 50-90% less data
3. **Use LIMIT** - Faster queries, less memory
4. **Cache frequently accessed data** - 100x faster
5. **Connection pooling** - 50ms → <1ms per query
6. **Batch operations** - 10-100x faster writes

---

**Start with indexes, they give the biggest bang for your buck! 🚀**
