# MongoDB Documents & Collections - Lesson 2

## 📖 Documents Deep Dive

**Document** = JSON-like object with key-value pairs (BSON internally).

### Document Structure

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),  // Unique ID (auto-generated)
  name: "Rahul Kumar",                         // String
  age: 28,                                     // Number
  isVerified: true,                            // Boolean
  tags: ["premium", "verified"],               // Array
  address: {                                   // Nested object
    city: "Delhi",
    pincode: 110001
  },
  createdAt: ISODate("2024-11-18T10:30:00Z")  // Date
}
```

### Data Types

```javascript
{
  // String
  name: "Rahul",

  // Numbers
  age: 28,                    // Int32
  price: 550000,             // Int32/Int64
  rating: 4.5,               // Double

  // Boolean
  isActive: true,

  // Date
  createdAt: new Date(),
  timestamp: ISODate("2024-11-18"),

  // ObjectId
  _id: ObjectId("..."),
  userId: ObjectId("..."),

  // Array
  tags: ["tag1", "tag2"],
  items: [
    { name: "Item 1", qty: 2 },
    { name: "Item 2", qty: 5 }
  ],

  // Nested Document
  address: {
    street: "123 Main St",
    city: "Delhi"
  },

  // Null
  middleName: null,

  // Binary Data
  file: BinData(0, "..."),

  // Regular Expression
  pattern: /^test/i
}
```

### ObjectId

```javascript
// 12-byte identifier
ObjectId("507f1f77bcf86cd799439011")
//        |timestamp|machineId|processId|counter|

// Properties
const id = new ObjectId();
id.getTimestamp();  // When created
id.toString();      // Convert to string

// Creating specific ObjectId
const customId = ObjectId("507f1f77bcf86cd799439011");
```

## 📚 Collections

**Collection** = Group of documents (like SQL table, but flexible schema).

### Creating Collections

```javascript
// Explicit creation
db.createCollection("users");

// Implicit (created on first insert)
db.users.insertOne({ name: "Rahul" });  // Creates collection automatically

// With options
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "phone"],
      properties: {
        name: { bsonType: "string" },
        phone: { bsonType: "string" },
        age: { bsonType: "int", minimum: 0, maximum: 150 }
      }
    }
  },
  validationLevel: "moderate",  // or "strict", "off"
  validationAction: "warn"      // or "error"
});
```

### Capped Collections

Fixed-size collections that automatically delete oldest documents.

```javascript
db.createCollection("logs", {
  capped: true,
  size: 10000000,   // 10 MB
  max: 5000         // Max 5000 documents
});

// Use case: Logs, real-time data, chat messages
```

## 🏗️ Schema Design Patterns

### 1. Embedding (Denormalization)

Store related data together.

**Use when:**
- Data accessed together
- One-to-few relationship
- Data doesn't change often

```javascript
// User with embedded address
{
  _id: ObjectId("..."),
  name: "Rahul Kumar",
  phone: "9876543210",
  address: {              // Embedded!
    street: "123 MG Road",
    city: "Delhi",
    state: "Delhi",
    pincode: "110001"
  },
  preferences: {          // Embedded!
    notifications: true,
    theme: "dark"
  }
}

// Car with embedded images
{
  _id: ObjectId("..."),
  brand: "Maruti",
  model: "Swift",
  images: [               // Embedded array!
    { url: "img1.jpg", type: "exterior" },
    { url: "img2.jpg", type: "interior" }
  ]
}
```

**Advantages:**
- ✅ Single query to get all data
- ✅ Faster reads
- ✅ Atomic updates

**Disadvantages:**
- ❌ Data duplication
- ❌ Document size limit (16 MB)
- ❌ Complex updates

### 2. Referencing (Normalization)

Store references to other documents.

**Use when:**
- One-to-many relationship
- Many-to-many relationship
- Data changes frequently
- Prevent duplication

```javascript
// Users collection
{
  _id: ObjectId("user123"),
  name: "Rahul Kumar",
  phone: "9876543210"
}

// Cars collection (references user)
{
  _id: ObjectId("car456"),
  brand: "Maruti",
  model: "Swift",
  dealerId: ObjectId("user123")  // Reference!
}

// Query with $lookup (like JOIN)
db.cars.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "dealerId",
      foreignField: "_id",
      as: "dealer"
    }
  }
]);
```

**Advantages:**
- ✅ No duplication
- ✅ Smaller documents
- ✅ Easier updates

**Disadvantages:**
- ❌ Multiple queries or $lookup
- ❌ Slower reads

### 3. Hybrid Approach

Combine embedding and referencing.

```javascript
// Lead with embedded customer snapshot + reference
{
  _id: ObjectId("..."),
  carId: ObjectId("car456"),      // Reference
  customerId: ObjectId("user789"), // Reference

  // Snapshot at time of lead (embedded)
  customerSnapshot: {
    name: "Priya Sharma",
    phone: "9876543211",
    email: "priya@example.com"
  },

  // Embedded messages
  messages: [
    { from: "dealer", text: "Hello!", sentAt: ISODate("...") },
    { from: "customer", text: "Hi!", sentAt: ISODate("...") }
  ],

  status: "new",
  createdAt: ISODate("...")
}
```

**Why hybrid?**
- Customer info at time of lead (historical data)
- Still reference for current customer data
- Messages embedded (accessed together)

## 🔄 Document Patterns

### Pattern 1: Subset Pattern

Embed frequently accessed data, reference rest.

```javascript
// Products with reviews

// Product document (embed top 10 recent reviews)
{
  _id: ObjectId("..."),
  name: "Maruti Swift",
  price: 550000,
  recentReviews: [  // Subset of reviews
    { user: "Rahul", rating: 5, text: "Great car!" },
    { user: "Priya", rating: 4, text: "Good value" }
    // ... top 10 only
  ],
  totalReviews: 150
}

// All reviews in separate collection
{
  _id: ObjectId("..."),
  productId: ObjectId("..."),
  user: "Amit",
  rating: 5,
  text: "Excellent!",
  createdAt: ISODate("...")
}
```

### Pattern 2: Extended Reference

Store frequently used fields from referenced document.

```javascript
// Instead of just ID
{
  dealerId: ObjectId("...")  // Need to fetch dealer for each car
}

// Store commonly needed fields
{
  dealerId: ObjectId("..."),
  dealerName: "AutoWorld",    // Denormalized!
  dealerCity: "Delhi"         // Denormalized!
}

// Trade-off: Faster reads, must update when dealer changes
```

### Pattern 3: Bucketing

Group data into buckets (time-series, logs).

```javascript
// Instead of one document per view
{
  carId: ObjectId("..."),
  userId: ObjectId("..."),
  viewedAt: ISODate("...")
}

// Bucket by hour
{
  carId: ObjectId("..."),
  hour: ISODate("2024-11-18T10:00:00Z"),
  views: [
    { userId: ObjectId("..."), viewedAt: ISODate("...") },
    { userId: ObjectId("..."), viewedAt: ISODate("...") }
    // ... all views in this hour
  ],
  count: 25
}
```

## 📏 Document Size Limits

**Maximum document size: 16 MB**

```javascript
// Check document size
Object.bsonsize({ /* your document */ })  // Bytes

// If too large, use references or GridFS
```

## 🎯 VahanHelp Schema Design

### Users (Embedding)

```javascript
{
  _id: ObjectId("..."),
  phone: "9876543210",
  name: "Rahul Kumar",
  role: "customer",

  // Embedded (accessed together)
  address: {
    city: "Delhi",
    state: "Delhi",
    pincode: "110001"
  },

  preferences: {
    notifications: true,
    theme: "dark",
    language: "en"
  },

  // Embedded (small array)
  pushTokens: [
    { token: "expo-token-123", device: "ios" }
  ],

  stats: {
    searchCount: 0,
    savedCarsCount: 0
  }
}
```

### Cars (Hybrid)

```javascript
{
  _id: ObjectId("..."),

  // Reference to dealer
  dealerId: ObjectId("..."),

  // Extended reference (frequently displayed)
  dealerName: "AutoWorld",
  dealerCity: "Delhi",

  // Basic info
  brand: "Maruti",
  model: "Swift",
  year: 2020,
  price: 550000,

  // Embedded (accessed together)
  specifications: {
    engineCapacity: 1200,
    mileage: 22.5,
    color: "Red"
  },

  features: {
    safety: ["ABS", "Airbags"],
    comfort: ["AC", "Power Windows"]
  },

  images: [
    { url: "img1.jpg", type: "exterior", isPrimary: true },
    { url: "img2.jpg", type: "interior" }
  ],

  // Stats
  views: 150,
  saves: 25,
  leads: 10
}
```

### Leads (Hybrid with Snapshot)

```javascript
{
  _id: ObjectId("..."),

  // References
  carId: ObjectId("..."),
  customerId: ObjectId("..."),
  dealerId: ObjectId("..."),

  // Customer snapshot (historical)
  customerInfo: {
    name: "Priya Sharma",
    phone: "9876543211",
    email: "priya@example.com"
  },

  // Embedded messages
  messages: [
    {
      from: "customer",
      message: "Interested in test drive",
      sentAt: ISODate("...")
    },
    {
      from: "dealer",
      message: "Sure! When are you available?",
      sentAt: ISODate("...")
    }
  ],

  status: "new",
  createdAt: ISODate("...")
}
```

## ✅ Best Practices

1. **Embed when data is accessed together**
2. **Reference for large/changing data**
3. **Denormalize for read performance**
4. **Keep documents under 16 MB**
5. **Use arrays for bounded lists only**
6. **Index frequently queried fields**
7. **Design for your query patterns**

## 🏃 Exercises

```javascript
// 1. Create user with embedded data
db.users.insertOne({
  name: "Rahul",
  phone: "9876543210",
  address: {
    city: "Delhi",
    pincode: "110001"
  },
  preferences: {
    theme: "dark"
  }
});

// 2. Query nested fields
db.users.find({ "address.city": "Delhi" });
db.users.find({ "preferences.theme": "dark" });

// 3. Update nested fields
db.users.updateOne(
  { phone: "9876543210" },
  { $set: { "address.city": "Mumbai" } }
);

// 4. Add to array
db.users.updateOne(
  { phone: "9876543210" },
  { $push: { pushTokens: { token: "new-token", device: "android" } } }
);
```

---

**Design documents for how you'll query them! 📊**
