# Mongoose ODM - Lesson 8

## 📖 Introduction to Mongoose

**Mongoose** is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a schema-based solution to model your application data.

Think of it as an ORM for MongoDB - it adds structure to MongoDB's flexibility!

## 🎯 Why Use Mongoose?

- ✅ **Schema Definition**: Define document structure
- ✅ **Validation**: Built-in and custom validators
- ✅ **Type Casting**: Automatic data type conversion
- ✅ **Middleware**: Pre/post hooks for operations
- ✅ **Query Building**: Powerful query helpers
- ✅ **Virtuals**: Computed properties
- ✅ **Population**: Automatic document references
- ✅ **Plugins**: Reusable functionality

## 🚀 Getting Started

### Installation

```bash
npm install mongoose
```

### Basic Connection

```javascript
// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});

module.exports = connectDB;
```

### Using the Connection

```javascript
// server.js
const express = require('express');
const connectDB = require('./config/database');

const app = express();

// Connect to database
connectDB();

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
```

## 📝 Schemas

Schemas define the structure of documents.

### Basic Schema

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  age: Number,
  isVerified: Boolean,
  createdAt: Date
});

// Create model
const User = mongoose.model('User', userSchema);

module.exports = User;
```

### Schema with Types and Options

```javascript
const userSchema = new mongoose.Schema({
  // Required field
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true
  },

  // Optional field with default
  name: {
    type: String,
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },

  // Email with validation
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
  },

  // Enum field
  role: {
    type: String,
    enum: {
      values: ['customer', 'dealer', 'admin'],
      message: '{VALUE} is not a valid role'
    },
    default: 'customer'
  },

  // Number with min/max
  age: {
    type: Number,
    min: [18, 'Must be at least 18 years old'],
    max: [100, 'Age cannot exceed 100']
  },

  // Boolean with default
  isVerified: {
    type: Boolean,
    default: false
  },

  // Array of strings
  tags: {
    type: [String],
    default: []
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);
```

### Nested Objects

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  phone: String,

  // Nested object
  address: {
    street: String,
    city: {
      type: String,
      required: true
    },
    state: String,
    pincode: {
      type: String,
      match: /^[0-9]{6}$/
    }
  },

  // Nested object with schema
  preferences: {
    notifications: { type: Boolean, default: true },
    newsletter: { type: Boolean, default: false },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    }
  }
});
```

### References (Relationships)

```javascript
const carSchema = new mongoose.Schema({
  brand: String,
  model: String,

  // Reference to User (dealer)
  dealerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to User model
    required: true
  },

  // Array of references
  savedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

const Car = mongoose.model('Car', carSchema);
```

### Timestamps (Automatic)

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  phone: String
}, {
  timestamps: true  // Adds createdAt and updatedAt automatically
});
```

## 🎨 Schema Types

### All Schema Types

```javascript
const exampleSchema = new mongoose.Schema({
  // String
  name: String,

  // Number
  age: Number,

  // Boolean
  isActive: Boolean,

  // Date
  birthDate: Date,

  // ObjectId
  userId: mongoose.Schema.Types.ObjectId,

  // Array
  tags: [String],
  numbers: [Number],

  // Mixed (any type)
  metadata: mongoose.Schema.Types.Mixed,

  // Buffer
  data: Buffer,

  // Map
  socialLinks: {
    type: Map,
    of: String
  },

  // Decimal128 (for precise numbers)
  price: mongoose.Schema.Types.Decimal128
});
```

## ✨ Schema Options

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  phone: String
}, {
  // Add createdAt and updatedAt
  timestamps: true,

  // Collection name (default: lowercase plural of model)
  collection: 'users',

  // Disable _id
  _id: true,

  // Version key (__v)
  versionKey: false,  // or '__version'

  // Strict mode
  strict: true,  // Ignore fields not in schema

  // toJSON options
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v;
      delete ret.password;
      return ret;
    }
  },

  // toObject options
  toObject: {
    virtuals: true
  }
});
```

## 🔧 Validation

### Built-in Validators

```javascript
const carSchema = new mongoose.Schema({
  // Required
  brand: {
    type: String,
    required: true
  },

  // Min/Max (numbers)
  year: {
    type: Number,
    min: 1900,
    max: 2100
  },

  // Min/Max length (strings)
  model: {
    type: String,
    minlength: 2,
    maxlength: 50
  },

  // Enum
  fuelType: {
    type: String,
    enum: ['Petrol', 'Diesel', 'Electric', 'CNG']
  },

  // Match (regex)
  regNumber: {
    type: String,
    match: /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/
  },

  // Unique
  vin: {
    type: String,
    unique: true
  }
});
```

### Custom Validators

```javascript
const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return /^[6-9]\d{9}$/.test(v);  // Indian mobile
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },

  age: {
    type: Number,
    validate: {
      validator: function(v) {
        return v >= 18 && v <= 100;
      },
      message: 'Age must be between 18 and 100'
    }
  },

  // Async validator
  email: {
    type: String,
    validate: {
      validator: async function(email) {
        const user = await this.constructor.findOne({ email });
        return !user;  // Valid if no user found
      },
      message: 'Email already exists'
    }
  }
});
```

## 💎 Virtuals

Computed properties that don't get saved to the database.

```javascript
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  birthDate: Date
});

// Virtual property
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual setter
userSchema.virtual('fullName').set(function(name) {
  const parts = name.split(' ');
  this.firstName = parts[0];
  this.lastName = parts[1];
});

// Virtual (computed)
userSchema.virtual('age').get(function() {
  if (!this.birthDate) return null;
  const diff = Date.now() - this.birthDate.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
});

// Usage
const user = new User({
  firstName: 'Rahul',
  lastName: 'Kumar',
  birthDate: new Date('1995-05-15')
});

console.log(user.fullName);  // "Rahul Kumar"
console.log(user.age);        // 29

user.fullName = 'Priya Sharma';
console.log(user.firstName);  // "Priya"
console.log(user.lastName);   // "Sharma"
```

## 🎣 Middleware (Hooks)

Execute logic before or after certain operations.

### Pre Hooks

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  password: String,
  email: String
});

// Before save
userSchema.pre('save', async function(next) {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return next();
  }

  // Hash password
  const bcrypt = require('bcrypt');
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Before remove
userSchema.pre('remove', async function(next) {
  // Delete related documents
  await this.model('Car').deleteMany({ dealerId: this._id });
  next();
});

// Before findOneAndUpdate
userSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});
```

### Post Hooks

```javascript
// After save
userSchema.post('save', function(doc, next) {
  console.log(`User ${doc.name} was saved`);
  next();
});

// After find
userSchema.post('find', function(docs) {
  console.log(`Found ${docs.length} documents`);
});

// Error handling
userSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('Duplicate key error'));
  } else {
    next(error);
  }
});
```

## 🔍 Methods and Statics

### Instance Methods

Methods on document instances.

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  phone: String,
  password: String,
  loginCount: { type: Number, default: 0 }
});

// Instance method
userSchema.methods.comparePassword = async function(candidatePassword) {
  const bcrypt = require('bcrypt');
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.incrementLoginCount = async function() {
  this.loginCount += 1;
  return await this.save();
};

// Usage
const user = await User.findOne({ phone: '9876543210' });
const isMatch = await user.comparePassword('password123');
if (isMatch) {
  await user.incrementLoginCount();
}
```

### Static Methods

Methods on the Model itself.

```javascript
// Static method
userSchema.statics.findByPhone = function(phone) {
  return this.findOne({ phone });
};

userSchema.statics.findActiveCustomers = function() {
  return this.find({ role: 'customer', isActive: true });
};

userSchema.statics.search = function(query) {
  return this.find({
    $or: [
      { name: new RegExp(query, 'i') },
      { email: new RegExp(query, 'i') },
      { phone: new RegExp(query, 'i') }
    ]
  });
};

// Usage
const user = await User.findByPhone('9876543210');
const customers = await User.findActiveCustomers();
const results = await User.search('rahul');
```

### Query Helpers

Custom query modifiers.

```javascript
userSchema.query.byRole = function(role) {
  return this.where({ role });
};

userSchema.query.verified = function() {
  return this.where({ isVerified: true });
};

// Usage
const dealers = await User.find().byRole('dealer').verified();
```

## 🔗 Population (References)

Automatically replace ObjectId references with actual documents.

```javascript
const carSchema = new mongoose.Schema({
  brand: String,
  model: String,
  dealerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Populate
const car = await Car.findById(carId).populate('dealerId');
console.log(car.dealerId.name);  // Dealer's name

// Populate specific fields
const car = await Car.findById(carId)
  .populate('dealerId', 'name phone email');

// Populate multiple fields
const car = await Car.findById(carId)
  .populate('dealerId')
  .populate('savedBy', 'name');

// Nested populate
const leadSchema = new mongoose.Schema({
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const lead = await Lead.findById(leadId)
  .populate({
    path: 'carId',
    populate: { path: 'dealerId' }  // Nested
  })
  .populate('customerId');
```

## 📊 CRUD Operations with Mongoose

### Create

```javascript
// Method 1: new + save
const user = new User({
  name: 'Rahul Kumar',
  phone: '9876543210',
  email: 'rahul@example.com',
  role: 'customer'
});
await user.save();

// Method 2: create
const user = await User.create({
  name: 'Priya Sharma',
  phone: '9876543211',
  email: 'priya@example.com'
});

// Method 3: insertMany
const users = await User.insertMany([
  { name: 'User 1', phone: '1111111111' },
  { name: 'User 2', phone: '2222222222' }
]);
```

### Read

```javascript
// Find all
const users = await User.find();

// Find with condition
const customers = await User.find({ role: 'customer' });

// Find one
const user = await User.findOne({ phone: '9876543210' });

// Find by ID
const user = await User.findById(userId);

// With select
const users = await User.find().select('name phone -_id');

// With sort
const users = await User.find().sort({ createdAt: -1 });

// With limit
const users = await User.find().limit(10);

// With skip (pagination)
const users = await User.find().skip(20).limit(10);

// Count
const count = await User.countDocuments({ role: 'customer' });

// Exists
const exists = await User.exists({ phone: '9876543210' });
```

### Update

```javascript
// Update one
await User.updateOne(
  { phone: '9876543210' },
  { $set: { isVerified: true } }
);

// Update many
await User.updateMany(
  { role: 'customer' },
  { $set: { membershipLevel: 'silver' } }
);

// Find and update
const user = await User.findOneAndUpdate(
  { phone: '9876543210' },
  { $set: { name: 'Rahul Singh' } },
  { new: true }  // Return updated document
);

// Find by ID and update
const user = await User.findByIdAndUpdate(
  userId,
  { $set: { isVerified: true } },
  { new: true, runValidators: true }
);
```

### Delete

```javascript
// Delete one
await User.deleteOne({ phone: '9876543210' });

// Delete many
await User.deleteMany({ isActive: false });

// Find and delete
const user = await User.findOneAndDelete({ phone: '9876543210' });

// Find by ID and delete
const user = await User.findByIdAndDelete(userId);
```

## 🎯 Complete Example: VahanHelp User Model

```javascript
// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true,
    match: [/^[6-9]\d{9}$/, 'Invalid phone number']
  },

  email: {
    type: String,
    unique: true,
    sparse: true,  // Allow multiple null values
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email']
  },

  name: {
    type: String,
    trim: true,
    maxlength: 100
  },

  role: {
    type: String,
    enum: ['customer', 'dealer', 'admin'],
    default: 'customer'
  },

  password: {
    type: String,
    minlength: 6,
    select: false  // Don't include in queries by default
  },

  avatar: {
    type: String
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  isActive: {
    type: Boolean,
    default: true
  },

  address: {
    city: String,
    state: String,
    pincode: String
  },

  preferences: {
    notifications: { type: Boolean, default: true },
    newsletter: { type: Boolean, default: false },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    }
  },

  stats: {
    searchCount: { type: Number, default: 0 },
    savedCarsCount: { type: Number, default: 0 },
    rcChecksCount: { type: Number, default: 0 }
  },

  lastLoginAt: Date,
  verifiedAt: Date

}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v;
      delete ret.password;
      return ret;
    }
  }
});

// Indexes
userSchema.index({ phone: 1 });
userSchema.index({ email: 1 }, { sparse: true });
userSchema.index({ role: 1, isActive: 1 });

// Virtual: isMember
userSchema.virtual('isMember').get(function() {
  return this.isVerified && this.isActive;
});

// Pre-save: Hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Instance method: Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method: Update last login
userSchema.methods.updateLastLogin = async function() {
  this.lastLoginAt = new Date();
  return await this.save();
};

// Static method: Find by phone
userSchema.statics.findByPhone = function(phone) {
  return this.findOne({ phone });
};

// Static method: Search
userSchema.statics.search = function(query) {
  return this.find({
    $or: [
      { name: new RegExp(query, 'i') },
      { email: new RegExp(query, 'i') },
      { phone: new RegExp(query, 'i') }
    ]
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
```

### Usage Example

```javascript
// Create user
const user = await User.create({
  phone: '9876543210',
  name: 'Rahul Kumar',
  email: 'rahul@example.com',
  password: 'securePassword123'
});

// Find user
const user = await User.findByPhone('9876543210');

// Verify password
const isValid = await user.comparePassword('securePassword123');

// Update login
if (isValid) {
  await user.updateLastLogin();
}

// Search users
const results = await User.search('rahul');

// Use virtual
console.log(user.isMember);  // true/false
```

## ✅ Key Takeaways

1. **Mongoose adds structure** to MongoDB flexibility
2. **Schemas define** document structure and validation
3. **Virtuals** create computed properties
4. **Middleware** executes logic before/after operations
5. **Methods** add functionality to documents
6. **Statics** add functionality to models
7. **Population** handles references between documents
8. **Validation** ensures data integrity

## 🚀 Next Lesson

In [Lesson 9: MongoDB for VahanHelp](./09-vahanhelp-mongodb.md), we'll implement:
- Complete VahanHelp database schema
- All models with Mongoose
- Service layer implementation
- Real-world queries
- Best practices

---

**Mongoose makes MongoDB powerful and structured! 🚀**
