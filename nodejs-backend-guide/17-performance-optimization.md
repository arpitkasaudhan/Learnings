# Lesson 17: Performance Optimization

## Database Indexing

```javascript
// MongoDB indexes
carSchema.index({ brand: 1 });
carSchema.index({ price: 1 });
carSchema.index({ 'location.city': 1 });
carSchema.index({ brand: 1, model: 1 });

// Compound index for common queries
carSchema.index({ status: 1, createdAt: -1 });
```

## Caching with Redis

```bash
npm install redis
```

```javascript
const redis = require('redis');
const client = redis.createClient({ url: process.env.REDIS_URL });

app.get('/api/cars', async (req, res) => {
  const cacheKey = 'all_cars';

  // Check cache
  const cached = await client.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }

  // Query database
  const cars = await Car.find();

  // Save to cache (expire in 5 minutes)
  await client.setEx(cacheKey, 300, JSON.stringify(cars));

  res.json(cars);
});
```

## Compression

```bash
npm install compression
```

```javascript
const compression = require('compression');
app.use(compression());
```

## Query Optimization

```javascript
// ❌ Bad - N+1 query problem
const cars = await Car.find();
for (const car of cars) {
  car.owner = await User.findById(car.ownerId);
}

// ✅ Good - Use populate
const cars = await Car.find().populate('owner');

// ✅ Better - Select only needed fields
const cars = await Car.find()
  .select('brand model price')
  .populate('owner', 'name email');
```

## Clustering

```javascript
const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  const cpus = os.cpus().length;

  for (let i = 0; i < cpus; i++) {
    cluster.fork();
  }

  cluster.on('exit', () => {
    cluster.fork();
  });
} else {
  // Worker process
  require('./app');
}
```

**Next Lesson**: [18-microservices-basics.md](18-microservices-basics.md)
