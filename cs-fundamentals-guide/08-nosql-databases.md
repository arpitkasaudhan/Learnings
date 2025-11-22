# Lesson 8: NoSQL Databases

## Introduction to NoSQL

**NoSQL** (Not Only SQL) databases are non-relational databases designed for:
- **Flexible schemas** (no fixed structure)
- **Horizontal scaling** (add more servers)
- **High performance** (fast reads/writes)
- **Large-scale data** (millions of records)

### SQL vs NoSQL Quick Comparison

```
SQL (Relational):
✓ Fixed schema (structure defined beforehand)
✓ Tables with rows and columns
✓ ACID transactions
✓ Complex queries with JOINs
✗ Difficult to scale horizontally
✗ Schema changes are costly

NoSQL:
✓ Flexible schema (structure can vary)
✓ Various data models (documents, key-value, etc.)
✓ Easy horizontal scaling
✓ Fast performance
✗ Limited ACID (eventual consistency)
✗ No standard query language
```

## MongoDB - Document Database

### What is MongoDB?

MongoDB stores data as **JSON-like documents** in **collections** (instead of tables).

```
MongoDB Structure:
├── Database (e.g., "ecommerce_db")
│   ├── Collections (e.g., "users", "products")
│   │   └── Documents (JSON objects)
```

### Document Structure

```javascript
// A MongoDB document (user)
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "address": {                    // Nested object
    "street": "123 Main St",
    "city": "New York",
    "zip": "10001"
  },
  "hobbies": ["reading", "gaming", "hiking"],  // Array
  "orders": [                     // Array of objects
    {
      "orderId": "ORD001",
      "total": 99.99,
      "date": ISODate("2025-01-15")
    },
    {
      "orderId": "ORD002",
      "total": 149.99,
      "date": ISODate("2025-01-20")
    }
  ],
  "createdAt": ISODate("2025-01-01T00:00:00Z"),
  "updatedAt": ISODate("2025-01-20T10:30:00Z")
}
```

**Key Features**:
- `_id`: Unique identifier (auto-generated if not provided)
- Flexible schema: Documents in same collection can have different fields
- Nested data: Objects within objects
- Arrays: Multiple values in one field

### MongoDB CRUD Operations

#### 1. CREATE (Insert)

```javascript
// Insert one document
db.users.insertOne({
  name: "John Doe",
  email: "john@example.com",
  age: 30,
  city: "New York"
});

// Insert multiple documents
db.users.insertMany([
  {
    name: "Jane Smith",
    email: "jane@example.com",
    age: 25,
    city: "Los Angeles"
  },
  {
    name: "Bob Johnson",
    email: "bob@example.com",
    age: 35,
    city: "Chicago"
  }
]);

// Insert with nested data
db.users.insertOne({
  name: "Alice Brown",
  email: "alice@example.com",
  age: 28,
  address: {
    street: "456 Oak Ave",
    city: "Houston",
    state: "TX",
    zip: "77001"
  },
  tags: ["premium", "verified"]
});
```

#### 2. READ (Find)

```javascript
// Find all documents
db.users.find();

// Find with filter
db.users.find({ age: 30 });
db.users.find({ city: "New York" });

// Find one document
db.users.findOne({ email: "john@example.com" });

// Comparison operators
db.users.find({ age: { $gt: 25 } });        // Greater than
db.users.find({ age: { $gte: 25 } });       // Greater than or equal
db.users.find({ age: { $lt: 35 } });        // Less than
db.users.find({ age: { $lte: 35 } });       // Less than or equal
db.users.find({ age: { $ne: 30 } });        // Not equal

// Multiple conditions (AND)
db.users.find({
  age: { $gte: 25 },
  city: "New York"
});

// OR conditions
db.users.find({
  $or: [
    { city: "New York" },
    { city: "Los Angeles" }
  ]
});

// IN operator
db.users.find({
  city: { $in: ["New York", "Los Angeles", "Chicago"] }
});

// Pattern matching (regex)
db.users.find({ name: /^John/ });           // Starts with "John"
db.users.find({ email: /@gmail\.com$/ });   // Gmail users

// Nested field queries
db.users.find({ "address.city": "Houston" });
db.users.find({ "address.zip": "77001" });

// Array queries
db.users.find({ tags: "premium" });         // Has "premium" tag
db.users.find({ tags: { $all: ["premium", "verified"] } });  // Has both tags

// Exists check
db.users.find({ address: { $exists: true } });   // Has address field
db.users.find({ phone: { $exists: false } });    // Doesn't have phone

// Projection (select specific fields)
db.users.find({}, { name: 1, email: 1 });   // Only name and email
db.users.find({}, { age: 0 });              // All except age

// Sort
db.users.find().sort({ age: 1 });           // Ascending
db.users.find().sort({ age: -1 });          // Descending
db.users.find().sort({ city: 1, age: -1 }); // Multiple fields

// Limit and Skip (pagination)
db.users.find().limit(10);                  // First 10
db.users.find().skip(10).limit(10);         // Skip 10, get next 10

// Count
db.users.countDocuments({ city: "New York" });
```

#### 3. UPDATE

```javascript
// Update one document
db.users.updateOne(
  { email: "john@example.com" },  // Filter
  { $set: { age: 31 } }            // Update
);

// Update multiple documents
db.users.updateMany(
  { city: "New York" },
  { $set: { state: "NY" } }
);

// Update operators
// $set - Set field value
db.users.updateOne(
  { _id: ObjectId("...") },
  { $set: { age: 31, city: "Boston" } }
);

// $unset - Remove field
db.users.updateOne(
  { _id: ObjectId("...") },
  { $unset: { age: "" } }
);

// $inc - Increment/decrement
db.products.updateOne(
  { _id: ObjectId("...") },
  { $inc: { stock: -1 } }  // Decrease stock by 1
);

db.users.updateOne(
  { _id: ObjectId("...") },
  { $inc: { loginCount: 1 } }  // Increment login count
);

// $push - Add to array
db.users.updateOne(
  { _id: ObjectId("...") },
  { $push: { tags: "vip" } }
);

// $pull - Remove from array
db.users.updateOne(
  { _id: ObjectId("...") },
  { $pull: { tags: "basic" } }
);

// $addToSet - Add to array (only if not exists)
db.users.updateOne(
  { _id: ObjectId("...") },
  { $addToSet: { tags: "verified" } }
);

// Replace entire document (except _id)
db.users.replaceOne(
  { email: "john@example.com" },
  {
    name: "John Doe",
    email: "john@example.com",
    age: 31
  }
);

// Upsert (update or insert if not exists)
db.users.updateOne(
  { email: "new@example.com" },
  { $set: { name: "New User", age: 25 } },
  { upsert: true }
);
```

#### 4. DELETE

```javascript
// Delete one document
db.users.deleteOne({ email: "john@example.com" });

// Delete multiple documents
db.users.deleteMany({ age: { $lt: 18 } });

// Delete all documents in collection
db.users.deleteMany({});

// Drop entire collection
db.users.drop();
```

### MongoDB Aggregation Pipeline

Powerful framework for data processing and analysis.

```javascript
// Basic aggregation
db.orders.aggregate([
  // Stage 1: Filter
  { $match: { status: "completed" } },

  // Stage 2: Group and calculate
  {
    $group: {
      _id: "$userId",
      totalOrders: { $sum: 1 },
      totalSpent: { $sum: "$total" },
      avgOrderValue: { $avg: "$total" }
    }
  },

  // Stage 3: Sort
  { $sort: { totalSpent: -1 } },

  // Stage 4: Limit
  { $limit: 10 }
]);

// Join collections (lookup)
db.orders.aggregate([
  {
    $lookup: {
      from: "users",           // Collection to join
      localField: "userId",    // Field in orders
      foreignField: "_id",     // Field in users
      as: "userInfo"           // Output array field
    }
  },
  {
    $unwind: "$userInfo"       // Convert array to object
  },
  {
    $project: {                // Select fields
      orderId: "$_id",
      total: 1,
      userName: "$userInfo.name",
      userEmail: "$userInfo.email"
    }
  }
]);

// Complex aggregation example
db.products.aggregate([
  // Filter by category
  { $match: { category: "Electronics" } },

  // Group by subcategory
  {
    $group: {
      _id: "$subcategory",
      avgPrice: { $avg: "$price" },
      minPrice: { $min: "$price" },
      maxPrice: { $max: "$price" },
      totalProducts: { $sum: 1 }
    }
  },

  // Add calculated field
  {
    $addFields: {
      priceRange: { $subtract: ["$maxPrice", "$minPrice"] }
    }
  },

  // Sort by average price
  { $sort: { avgPrice: -1 } }
]);
```

### MongoDB Indexes

Improve query performance.

```javascript
// Create index
db.users.createIndex({ email: 1 });         // Ascending
db.users.createIndex({ age: -1 });          // Descending
db.users.createIndex({ city: 1, age: -1 }); // Compound index

// Unique index
db.users.createIndex({ email: 1 }, { unique: true });

// Text index (for text search)
db.products.createIndex({ name: "text", description: "text" });

// Use text search
db.products.find({ $text: { $search: "laptop gaming" } });

// View indexes
db.users.getIndexes();

// Drop index
db.users.dropIndex("email_1");
```

### MongoDB with Node.js

```javascript
const { MongoClient } = require('mongodb');

// Connect to MongoDB
const client = new MongoClient('mongodb://localhost:27017');

async function run() {
  try {
    await client.connect();
    const db = client.db('myapp');
    const users = db.collection('users');

    // Insert
    const result = await users.insertOne({
      name: "John Doe",
      email: "john@example.com",
      age: 30
    });
    console.log('Inserted:', result.insertedId);

    // Find
    const user = await users.findOne({ email: "john@example.com" });
    console.log('Found user:', user);

    // Update
    await users.updateOne(
      { email: "john@example.com" },
      { $set: { age: 31 } }
    );

    // Find all
    const allUsers = await users.find({ age: { $gte: 25 } }).toArray();
    console.log('All users:', allUsers);

    // Delete
    await users.deleteOne({ email: "john@example.com" });

  } finally {
    await client.close();
  }
}

run();
```

### MongoDB with Mongoose (ODM)

```javascript
const mongoose = require('mongoose');

// Connect
await mongoose.connect('mongodb://localhost:27017/myapp');

// Define schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, min: 0, max: 120 },
  address: {
    street: String,
    city: String,
    zip: String
  },
  createdAt: { type: Date, default: Date.now }
});

// Create model
const User = mongoose.model('User', userSchema);

// Create
const user = new User({
  name: "John Doe",
  email: "john@example.com",
  age: 30
});
await user.save();

// Or use create
await User.create({
  name: "Jane Smith",
  email: "jane@example.com",
  age: 25
});

// Find
const users = await User.find({ age: { $gte: 25 } });
const john = await User.findOne({ email: "john@example.com" });
const userById = await User.findById(userId);

// Update
await User.updateOne(
  { email: "john@example.com" },
  { $set: { age: 31 } }
);

// Or find and update
const updatedUser = await User.findOneAndUpdate(
  { email: "john@example.com" },
  { $set: { age: 31 } },
  { new: true }  // Return updated document
);

// Delete
await User.deleteOne({ email: "john@example.com" });

// Validation example
userSchema.path('email').validate(function(email) {
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailRegex.test(email);
}, 'Invalid email format');
```

## Redis - Key-Value Store

### What is Redis?

**Redis** (Remote Dictionary Server) is an in-memory key-value store known for extreme speed.

```
Redis Features:
✓ In-memory (extremely fast)
✓ Key-value store
✓ Multiple data structures
✓ Persistence options
✓ Pub/Sub messaging
✓ Expiration (TTL)
```

### Redis Data Types

#### 1. Strings

```javascript
// Set and get
SET user:1:name "John Doe"
GET user:1:name  // "John Doe"

// Set with expiration (TTL in seconds)
SET session:abc123 "user_data" EX 3600  // Expires in 1 hour
SETEX session:abc123 3600 "user_data"   // Same as above

// Increment/Decrement
SET pageviews 100
INCR pageviews      // 101
INCRBY pageviews 10 // 111
DECR pageviews      // 110

// Multiple set/get
MSET user:1:name "John" user:1:age "30"
MGET user:1:name user:1:age
```

#### 2. Hashes (Objects)

```javascript
// Set hash fields
HSET user:1 name "John Doe"
HSET user:1 email "john@example.com"
HSET user:1 age 30

// Set multiple fields
HMSET user:1 name "John Doe" email "john@example.com" age 30

// Get hash field
HGET user:1 name        // "John Doe"

// Get all fields
HGETALL user:1
// {
//   "name": "John Doe",
//   "email": "john@example.com",
//   "age": "30"
// }

// Increment hash field
HINCRBY user:1 loginCount 1

// Check if field exists
HEXISTS user:1 email    // 1 (true)

// Delete field
HDEL user:1 age
```

#### 3. Lists (Arrays)

```javascript
// Push to list (left/right)
LPUSH queue:emails "email1@example.com"  // Add to beginning
RPUSH queue:emails "email2@example.com"  // Add to end

// Pop from list
LPOP queue:emails   // Get and remove from beginning
RPOP queue:emails   // Get and remove from end

// Get range
LRANGE queue:emails 0 -1  // Get all items
LRANGE queue:emails 0 9   // Get first 10 items

// Length
LLEN queue:emails

// Use case: Activity feed
LPUSH user:1:feed "Posted a photo"
LPUSH user:1:feed "Liked a post"
LRANGE user:1:feed 0 9  // Get last 10 activities
```

#### 4. Sets (Unique Values)

```javascript
// Add to set
SADD user:1:interests "coding"
SADD user:1:interests "gaming"
SADD user:1:interests "reading"
SADD user:1:interests "coding"  // Ignored (duplicate)

// Get all members
SMEMBERS user:1:interests
// ["coding", "gaming", "reading"]

// Check membership
SISMEMBER user:1:interests "coding"  // 1 (true)

// Remove from set
SREM user:1:interests "gaming"

// Set operations
SADD user:1:tags "javascript" "nodejs" "react"
SADD user:2:tags "javascript" "python" "django"

// Union (all unique items)
SUNION user:1:tags user:2:tags
// ["javascript", "nodejs", "react", "python", "django"]

// Intersection (common items)
SINTER user:1:tags user:2:tags
// ["javascript"]

// Difference
SDIFF user:1:tags user:2:tags
// ["nodejs", "react"]
```

#### 5. Sorted Sets (with Scores)

```javascript
// Add with score
ZADD leaderboard 100 "player1"
ZADD leaderboard 200 "player2"
ZADD leaderboard 150 "player3"

// Get rank (0-based)
ZRANK leaderboard "player1"     // 0 (lowest score)

// Get reverse rank
ZREVRANK leaderboard "player2"  // 0 (highest score)

// Get by rank
ZRANGE leaderboard 0 -1         // All, by score ascending
ZREVRANGE leaderboard 0 9       // Top 10, by score descending

// Get with scores
ZRANGE leaderboard 0 -1 WITHSCORES

// Get score
ZSCORE leaderboard "player1"    // 100

// Increment score
ZINCRBY leaderboard 50 "player1"  // Now 150

// Get by score range
ZRANGEBYSCORE leaderboard 100 200  // Players with score 100-200
```

### Redis Use Cases

#### 1. Session Storage

```javascript
// Node.js with Redis
const redis = require('redis');
const client = redis.createClient();

// Store session
await client.setEx(
  `session:${sessionId}`,
  3600,  // Expire in 1 hour
  JSON.stringify({
    userId: 123,
    username: "john",
    loggedIn: true
  })
);

// Get session
const sessionData = await client.get(`session:${sessionId}`);
const session = JSON.parse(sessionData);

// Extend session
await client.expire(`session:${sessionId}`, 3600);

// Delete session (logout)
await client.del(`session:${sessionId}`);
```

#### 2. Caching

```javascript
async function getUser(userId) {
  const cacheKey = `user:${userId}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log('Cache hit!');
    return JSON.parse(cached);
  }

  // Cache miss - fetch from database
  console.log('Cache miss - fetching from DB');
  const user = await db.users.findById(userId);

  // Store in cache for 1 hour
  await redis.setEx(cacheKey, 3600, JSON.stringify(user));

  return user;
}

// Invalidate cache on update
async function updateUser(userId, data) {
  await db.users.update(userId, data);
  await redis.del(`user:${userId}`);  // Clear cache
}
```

#### 3. Rate Limiting

```javascript
async function rateLimit(userId, maxRequests = 100, windowSeconds = 3600) {
  const key = `ratelimit:${userId}`;

  // Increment request count
  const requests = await redis.incr(key);

  // Set expiration on first request
  if (requests === 1) {
    await redis.expire(key, windowSeconds);
  }

  // Check if limit exceeded
  if (requests > maxRequests) {
    throw new Error('Rate limit exceeded');
  }

  return { requests, remaining: maxRequests - requests };
}

// Usage in API
app.get('/api/data', async (req, res) => {
  try {
    const { requests, remaining } = await rateLimit(req.user.id);
    res.set('X-RateLimit-Remaining', remaining);
    // ... handle request
  } catch (error) {
    res.status(429).json({ error: 'Too many requests' });
  }
});
```

#### 4. Real-time Leaderboard

```javascript
// Add score
async function addScore(playerId, score) {
  await redis.zIncrBy('leaderboard', score, playerId);
}

// Get top 10
async function getTopPlayers(limit = 10) {
  const players = await redis.zRevRange('leaderboard', 0, limit - 1, {
    WITHSCORES: true
  });

  // Format: [{ value: 'player1', score: 1000 }, ...]
  return players.map(({ value, score }) => ({
    playerId: value,
    score: score
  }));
}

// Get player rank
async function getPlayerRank(playerId) {
  const rank = await redis.zRevRank('leaderboard', playerId);
  const score = await redis.zScore('leaderboard', playerId);
  return { rank: rank + 1, score };  // +1 for 1-based ranking
}
```

#### 5. Job Queue

```javascript
// Add job to queue
await redis.rPush('jobs:email', JSON.stringify({
  to: 'user@example.com',
  subject: 'Welcome!',
  body: 'Welcome to our platform'
}));

// Worker processes jobs
async function processJobs() {
  while (true) {
    // Blocking pop (waits for job)
    const job = await redis.blPop('jobs:email', 0);

    if (job) {
      const jobData = JSON.parse(job.element);
      await sendEmail(jobData);
    }
  }
}
```

## When to Use Each NoSQL Type

### Use MongoDB When:
```
✓ Flexible, evolving schema
✓ Hierarchical/nested data
✓ Document-based data (products, users, posts)
✓ Need to query complex data
✓ Real-time applications
✓ Content management systems
✓ User profiles with varying fields

Examples:
- E-commerce product catalogs
- User profiles
- Content management
- Mobile app backends
```

### Use Redis When:
```
✓ Need extreme speed (in-memory)
✓ Caching frequently accessed data
✓ Session management
✓ Real-time analytics
✓ Leaderboards/rankings
✓ Rate limiting
✓ Pub/Sub messaging
✓ Temporary data with expiration

Examples:
- Session storage
- Cache layer
- Real-time leaderboards
- Rate limiting
- Job queues
```

## Comparison: SQL vs MongoDB vs Redis

| Feature | SQL | MongoDB | Redis |
|---------|-----|---------|-------|
| **Data Model** | Tables | Documents | Key-Value |
| **Schema** | Fixed | Flexible | None |
| **Relationships** | JOINs | Embedded/Refs | Manual |
| **Transactions** | ACID | ACID (4.0+) | Limited |
| **Scaling** | Vertical | Horizontal | Horizontal |
| **Speed** | Medium | Fast | Very Fast |
| **Storage** | Disk | Disk | Memory |
| **Use Case** | Complex queries | Flexible data | Caching, speed |

## Best Practices

### MongoDB Best Practices

1. **Design for your access patterns**
```javascript
// Bad: Separate collections requiring JOINs
users: { _id, name }
addresses: { userId, street, city }

// Good: Embed related data
users: {
  _id,
  name,
  address: { street, city }
}
```

2. **Use indexes wisely**
```javascript
// Index frequently queried fields
db.users.createIndex({ email: 1 });
db.products.createIndex({ category: 1, price: -1 });

// But avoid too many indexes (slows writes)
```

3. **Limit document size** (max 16MB)
```javascript
// Don't store huge arrays
// Instead, use references or separate collections
```

### Redis Best Practices

1. **Use appropriate data structures**
```javascript
// Use hashes for objects (more memory efficient)
HSET user:1 name "John" age 30  // Better than multiple strings
```

2. **Set expiration on temp data**
```javascript
SETEX cache:key 3600 "data"  // Auto-cleanup
```

3. **Use pipelining for multiple commands**
```javascript
const pipeline = redis.pipeline();
pipeline.set('key1', 'value1');
pipeline.set('key2', 'value2');
pipeline.set('key3', 'value3');
await pipeline.exec();  // Send all at once
```

## Key Takeaways

1. **MongoDB** is great for flexible, document-based data
2. **Redis** excels at caching and real-time features
3. **Choose based on use case**, not preference
4. **Polyglot persistence**: Use multiple databases together
5. **NoSQL** trades ACID for scalability and flexibility

## Exercises

### Exercise 1: MongoDB

Create a blog system with posts and comments:
1. Design document structure
2. Write queries to find all posts by author
3. Add comments to posts
4. Find posts with more than 10 comments

### Exercise 2: Redis

Implement:
1. User session storage with 1-hour expiration
2. API rate limiting (100 requests/hour)
3. Shopping cart (hash structure)
4. Recent activity feed (list structure)

## Next Steps

In [Lesson 9: Database Optimization](./09-database-optimization.md), we'll learn:
- Indexing strategies
- Query optimization
- Database normalization
- Performance tuning

---

**Practice**: Build a simple cache layer using Redis for a MongoDB application!
