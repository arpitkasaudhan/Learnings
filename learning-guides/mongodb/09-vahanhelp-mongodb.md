# MongoDB for VahanHelp - Complete Implementation

## 📖 Overview

This lesson implements the complete MongoDB database for the VahanHelp application using Mongoose. We'll create all models, relationships, and service layer.

## 🏗️ Database Architecture

```
vahanhelp/
├── users (customers, dealers, admins)
├── dealers (dealer profiles)
├── cars (car listings)
├── leads (customer inquiries)
├── rcVerifications (RC check reports)
├── challans (challan searches)
├── insuranceQuotes (insurance requests)
├── notifications (push notifications)
├── savedCars (user favorites)
└── sessions (auth sessions)
```

## 👤 User Model

```javascript
// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  // Basic Info
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /^[6-9]\d{9}$/
  },

  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
    match: /^\S+@\S+\.\S+$/
  },

  name: {
    type: String,
    trim: true,
    maxlength: 100
  },

  // Authentication
  role: {
    type: String,
    enum: ['customer', 'dealer', 'admin'],
    default: 'customer'
  },

  password: {
    type: String,
    minlength: 6,
    select: false
  },

  // Profile
  avatar: String,

  // Verification
  isVerified: {
    type: Boolean,
    default: false
  },

  isActive: {
    type: Boolean,
    default: true
  },

  verifiedAt: Date,

  // Address
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },

  // Preferences
  preferences: {
    notifications: { type: Boolean, default: true },
    newsletter: { type: Boolean, default: false },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    language: {
      type: String,
      enum: ['en', 'hi'],
      default: 'en'
    }
  },

  // Push Notifications
  pushTokens: [{
    token: String,
    device: {
      type: String,
      enum: ['ios', 'android', 'web']
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Stats
  stats: {
    searchCount: { type: Number, default: 0 },
    savedCarsCount: { type: Number, default: 0 },
    rcChecksCount: { type: Number, default: 0 },
    challanChecksCount: { type: Number, default: 0 }
  },

  // Timestamps
  lastLoginAt: Date,
  lastActiveAt: Date

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

// Virtuals
userSchema.virtual('isDealer').get(function() {
  return this.role === 'dealer';
});

userSchema.virtual('isMember').get(function() {
  return this.isVerified && this.isActive;
});

// Middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Methods
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.updateLastLogin = async function() {
  this.lastLoginAt = new Date();
  this.lastActiveAt = new Date();
  return await this.save();
};

userSchema.methods.incrementStat = async function(statName) {
  this.stats[statName] = (this.stats[statName] || 0) + 1;
  return await this.save();
};

// Statics
userSchema.statics.findByPhone = function(phone) {
  return this.findOne({ phone, isActive: true });
};

module.exports = mongoose.model('User', userSchema);
```

## 🏪 Dealer Model

```javascript
// models/Dealer.js
const mongoose = require('mongoose');

const dealerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },

  // Business Info
  businessName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },

  gstin: {
    type: String,
    unique: true,
    sparse: true,
    uppercase: true,
    match: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
  },

  // Contact
  businessPhone: String,
  businessEmail: String,
  website: String,

  // Location
  address: {
    street: String,
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: String,
    landmark: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },

  // Business Details
  yearEstablished: Number,
  description: String,

  logo: String,
  coverImage: String,

  businessHours: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    openTime: String,  // "09:00"
    closeTime: String  // "18:00"
  }],

  // Verification
  isVerified: {
    type: Boolean,
    default: false
  },

  verificationDocuments: [{
    type: {
      type: String,
      enum: ['gst', 'pan', 'trade_license', 'shop_act']
    },
    url: String,
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    },
    uploadedAt: Date
  }],

  // Ratings
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },

  // Stats
  stats: {
    totalListings: { type: Number, default: 0 },
    activeListings: { type: Number, default: 0 },
    soldCars: { type: Number, default: 0 },
    totalLeads: { type: Number, default: 0 },
    views: { type: Number, default: 0 }
  },

  // Social Links
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    youtube: String
  },

  // Status
  isActive: {
    type: Boolean,
    default: true
  },

  isPremium: {
    type: Boolean,
    default: false
  },

  premiumExpiresAt: Date

}, {
  timestamps: true
});

// Indexes
dealerSchema.index({ userId: 1 });
dealerSchema.index({ 'address.city': 1, isVerified: 1 });
dealerSchema.index({ isVerified: 1, isActive: 1 });

// Virtuals
dealerSchema.virtual('cars', {
  ref: 'Car',
  localField: '_id',
  foreignField: 'dealerId'
});

// Methods
dealerSchema.methods.updateStats = async function() {
  const Car = mongoose.model('Car');
  const stats = await Car.aggregate([
    { $match: { dealerId: this._id } },
    {
      $group: {
        _id: null,
        totalListings: { $sum: 1 },
        activeListings: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        },
        soldCars: {
          $sum: { $cond: [{ $eq: ['$status', 'sold'] }, 1, 0] }
        }
      }
    }
  ]);

  if (stats.length > 0) {
    this.stats.totalListings = stats[0].totalListings;
    this.stats.activeListings = stats[0].activeListings;
    this.stats.soldCars = stats[0].soldCars;
    await this.save();
  }
};

module.exports = mongoose.model('Dealer', dealerSchema);
```

## 🚗 Car Model

```javascript
// models/Car.js
const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  dealerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dealer',
    required: true
  },

  // Basic Info
  brand: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },

  model: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },

  variant: {
    type: String,
    trim: true,
    maxlength: 100
  },

  year: {
    type: Number,
    required: true,
    min: 1950,
    max: new Date().getFullYear() + 1
  },

  // Technical Details
  fuelType: {
    type: String,
    required: true,
    enum: ['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid']
  },

  transmission: {
    type: String,
    required: true,
    enum: ['Manual', 'Automatic']
  },

  kmsDriven: {
    type: Number,
    required: true,
    min: 0
  },

  ownerNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },

  registrationNumber: {
    type: String,
    uppercase: true,
    sparse: true,
    unique: true
  },

  // Specifications
  specifications: {
    engineCapacity: Number,  // cc
    powerBHP: Number,
    torqueNM: Number,
    seatingCapacity: Number,
    mileage: Number,  // kmpl
    color: String,
    bodyType: {
      type: String,
      enum: ['Sedan', 'SUV', 'Hatchback', 'MUV', 'Coupe', 'Convertible', 'Pickup']
    }
  },

  // Features
  features: {
    safety: [String],  // ['ABS', 'Airbags', 'ESP']
    comfort: [String],  // ['AC', 'Power Windows', 'Power Steering']
    entertainment: [String],  // ['Touchscreen', 'Bluetooth', 'USB']
    exterior: [String]  // ['Alloy Wheels', 'Fog Lights', 'LED DRL']
  },

  // Pricing
  price: {
    type: Number,
    required: true,
    min: 0
  },

  originalPrice: Number,

  isNegotiable: {
    type: Boolean,
    default: true
  },

  // Location
  location: {
    city: {
      type: String,
      required: true
    },
    state: String,
    pincode: String,
    showroomAddress: String
  },

  // Media
  images: [{
    url: String,
    type: {
      type: String,
      enum: ['exterior', 'interior', 'engine', 'other']
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],

  videos: [String],

  // Description
  title: String,
  description: String,

  // Condition
  condition: {
    accidentHistory: {
      type: String,
      enum: ['none', 'minor', 'major'],
      default: 'none'
    },
    service: {
      type: String,
      enum: ['regular', 'irregular', 'unknown'],
      default: 'unknown'
    },
    insurance: {
      type: String,
      enum: ['valid', 'expired', 'none'],
      default: 'unknown'
    },
    rc: {
      type: String,
      enum: ['available', 'not_available'],
      default: 'available'
    }
  },

  // Status
  status: {
    type: String,
    enum: ['draft', 'active', 'sold', 'inactive', 'deleted'],
    default: 'draft'
  },

  // Stats
  views: {
    type: Number,
    default: 0
  },

  leads: {
    type: Number,
    default: 0
  },

  saves: {
    type: Number,
    default: 0
  },

  // Dates
  soldAt: Date,
  publishedAt: Date,
  lastBumpedAt: Date

}, {
  timestamps: true
});

// Indexes
carSchema.index({ dealerId: 1, status: 1 });
carSchema.index({ brand: 1, model: 1 });
carSchema.index({ 'location.city': 1, status: 1 });
carSchema.index({ price: 1, year: -1 });
carSchema.index({ status: 1, publishedAt: -1 });
carSchema.index({ registrationNumber: 1 }, { sparse: true });

// Text index for search
carSchema.index({
  brand: 'text',
  model: 'text',
  variant: 'text',
  title: 'text',
  description: 'text'
});

// Virtuals
carSchema.virtual('fullName').get(function() {
  return `${this.brand} ${this.model} ${this.variant || ''}`.trim();
});

carSchema.virtual('age').get(function() {
  return new Date().getFullYear() - this.year;
});

carSchema.virtual('pricePerYear').get(function() {
  return Math.round(this.price / (this.age || 1));
});

// Methods
carSchema.methods.incrementViews = async function() {
  this.views += 1;
  await this.save();
};

carSchema.methods.markAsSold = async function(soldPrice) {
  this.status = 'sold';
  this.soldAt = new Date();
  if (soldPrice) this.soldPrice = soldPrice;
  await this.save();
};

carSchema.methods.bump = async function() {
  this.lastBumpedAt = new Date();
  await this.save();
};

// Statics
carSchema.statics.search = function(filters = {}) {
  const query = { status: 'active' };

  if (filters.brand) query.brand = filters.brand;
  if (filters.model) query.model = filters.model;
  if (filters.fuelType) query.fuelType = filters.fuelType;
  if (filters.transmission) query.transmission = filters.transmission;
  if (filters.city) query['location.city'] = filters.city;

  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = filters.minPrice;
    if (filters.maxPrice) query.price.$lte = filters.maxPrice;
  }

  if (filters.minYear || filters.maxYear) {
    query.year = {};
    if (filters.minYear) query.year.$gte = filters.minYear;
    if (filters.maxYear) query.year.$lte = filters.maxYear;
  }

  if (filters.maxKms) {
    query.kmsDriven = { $lte: filters.maxKms };
  }

  return this.find(query)
    .populate('dealerId', 'businessName rating location')
    .sort({ lastBumpedAt: -1, createdAt: -1 });
};

module.exports = mongoose.model('Car', carSchema);
```

## 📋 Lead Model

```javascript
// models/Lead.js
const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },

  dealerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dealer',
    required: true
  },

  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Customer Info (snapshot at time of lead)
  customerInfo: {
    name: String,
    phone: String,
    email: String
  },

  // Lead Details
  message: String,

  interestedInTestDrive: {
    type: Boolean,
    default: false
  },

  interestedInFinance: {
    type: Boolean,
    default: false
  },

  preferredContactTime: String,

  // Status
  status: {
    type: String,
    enum: ['new', 'contacted', 'negotiating', 'test_drive_scheduled', 'converted', 'lost'],
    default: 'new'
  },

  // Communication
  messages: [{
    from: {
      type: String,
      enum: ['dealer', 'customer']
    },
    message: String,
    sentAt: {
      type: Date,
      default: Date.now
    },
    readAt: Date
  }],

  // Notes (internal for dealer)
  dealerNotes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Dates
  contactedAt: Date,
  convertedAt: Date,
  lostAt: Date,
  lostReason: String

}, {
  timestamps: true
});

// Indexes
leadSchema.index({ dealerId: 1, status: 1, createdAt: -1 });
leadSchema.index({ customerId: 1 });
leadSchema.index({ carId: 1 });

// Middleware
leadSchema.post('save', async function() {
  // Update car lead count
  const Car = mongoose.model('Car');
  const count = await this.constructor.countDocuments({ carId: this.carId });
  await Car.findByIdAndUpdate(this.carId, { leads: count });
});

// Methods
leadSchema.methods.markContacted = async function() {
  this.status = 'contacted';
  this.contactedAt = new Date();
  await this.save();
};

leadSchema.methods.markConverted = async function() {
  this.status = 'converted';
  this.convertedAt = new Date();
  await this.save();
};

leadSchema.methods.addMessage = async function(from, message) {
  this.messages.push({ from, message });
  await this.save();
};

module.exports = mongoose.model('Lead', leadSchema);
```

## 🎯 Service Layer Examples

```javascript
// services/carService.js
const Car = require('../models/Car');
const Dealer = require('../models/Dealer');

class CarService {
  // Create new listing
  async createListing(dealerId, carData) {
    const car = await Car.create({
      dealerId,
      ...carData,
      status: 'draft'
    });

    // Update dealer stats
    await Dealer.findByIdAndUpdate(dealerId, {
      $inc: { 'stats.totalListings': 1 }
    });

    return car;
  }

  // Publish listing
  async publishListing(carId, dealerId) {
    const car = await Car.findOneAndUpdate(
      { _id: carId, dealerId, status: 'draft' },
      {
        $set: {
          status: 'active',
          publishedAt: new Date()
        }
      },
      { new: true }
    );

    if (!car) throw new Error('Car not found or already published');

    await Dealer.findByIdAndUpdate(dealerId, {
      $inc: { 'stats.activeListings': 1 }
    });

    return car;
  }

  // Search cars
  async searchCars(filters, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const cars = await Car.search(filters)
      .skip(skip)
      .limit(limit);

    const total = await Car.countDocuments({
      ...Car.search(filters).getQuery()
    });

    return {
      cars,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Get car details
  async getCarDetails(carId) {
    const car = await Car.findById(carId)
      .populate('dealerId');

    if (!car) throw new Error('Car not found');

    // Increment views
    await car.incrementViews();

    return car;
  }

  // Mark as sold
  async markAsSold(carId, dealerId, soldPrice) {
    const car = await Car.findOne({ _id: carId, dealerId });
    if (!car) throw new Error('Car not found');

    await car.markAsSold(soldPrice);

    await Dealer.findByIdAndUpdate(dealerId, {
      $inc: {
        'stats.activeListings': -1,
        'stats.soldCars': 1
      }
    });

    return car;
  }
}

module.exports = new CarService();
```

```javascript
// services/leadService.js
const Lead = require('../models/Lead');
const Car = require('../models/Car');
const User = require('../models/User');

class LeadService {
  // Create lead
  async createLead(carId, customerId, data) {
    const car = await Car.findById(carId);
    if (!car) throw new Error('Car not found');

    const customer = await User.findById(customerId);
    if (!customer) throw new Error('Customer not found');

    const lead = await Lead.create({
      carId,
      dealerId: car.dealerId,
      customerId,
      customerInfo: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email
      },
      ...data
    });

    // Send notification to dealer
    // await notificationService.sendLeadNotification(car.dealerId, lead);

    return lead;
  }

  // Get dealer leads
  async getDealerLeads(dealerId, filters = {}) {
    const query = { dealerId };

    if (filters.status) query.status = filters.status;

    const leads = await Lead.find(query)
      .populate('carId', 'brand model year price images')
      .populate('customerId', 'name phone email')
      .sort({ createdAt: -1 });

    return leads;
  }

  // Respond to lead
  async respondToLead(leadId, dealerId, message) {
    const lead = await Lead.findOne({ _id: leadId, dealerId });
    if (!lead) throw new Error('Lead not found');

    await lead.addMessage('dealer', message);
    await lead.markContacted();

    // Send notification to customer
    // await notificationService.sendMessageNotification(lead.customerId, message);

    return lead;
  }
}

module.exports = new LeadService();
```

## 🗂️ Database Configuration

```javascript
// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(process.env.MONGODB_URI, options);

    console.log('✅ MongoDB Connected');

    // Enable debug in development
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', true);
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Event handlers
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
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});

module.exports = connectDB;
```

## ✅ Key Takeaways

1. **Schema design** matches application requirements
2. **Indexes** optimize common queries
3. **Virtuals** provide computed properties
4. **Methods** encapsulate business logic
5. **Population** handles relationships
6. **Service layer** manages complex operations
7. **Validation** ensures data integrity
8. **Middleware** handles side effects

## 📚 Next Steps

1. Implement remaining models (RCVerification, Challan, etc.)
2. Add more complex aggregations
3. Implement caching layer
4. Add full-text search
5. Set up database backups
6. Monitor performance

---

**Your VahanHelp MongoDB database is production-ready! 🚀**
