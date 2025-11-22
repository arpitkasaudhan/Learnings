# Lesson 07: MongoDB & Mongoose

## MongoDB Setup

```bash
npm install mongoose
```

## Connect to MongoDB

```javascript
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));
```

## Mongoose Schema

```javascript
// models/Car.js
const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true, min: 0 },
  mileage: { type: Number, default: 0 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  images: [String],
  features: [String],
  status: { type: String, enum: ['active', 'sold', 'pending'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);
```

## CRUD Operations

```javascript
const Car = require('./models/Car');

// Create
const car = await Car.create({
  brand: 'Honda',
  model: 'City',
  year: 2023,
  price: 1500000
});

// Read
const cars = await Car.find({ brand: 'Honda' });
const car = await Car.findById(id);
const car = await Car.findOne({ model: 'City' });

// Update
await Car.findByIdAndUpdate(id, { price: 1400000 }, { new: true });

// Delete
await Car.findByIdAndDelete(id);
```

## Query Operators

```javascript
// Greater than, less than
Car.find({ price: { $gte: 1000000, $lte: 2000000 } });

// In array
Car.find({ brand: { $in: ['Honda', 'Toyota'] } });

// Regex
Car.find({ model: { $regex: 'City', $options: 'i' } });

// Pagination
Car.find().skip(10).limit(10).sort({ price: -1 });
```

## Population

```javascript
const car = await Car.findById(id).populate('owner', 'name email');
```

**Next Lesson**: [08-database-sql.md](08-database-sql.md)
