# MongoDB Basics - Lesson 1

## 📖 Introduction

**MongoDB** is a NoSQL database that stores data in flexible, JSON-like documents instead of rows and tables.

### What is NoSQL?

**NoSQL** = "Not Only SQL" - databases that don't use traditional table structures.

**Think of it like storing actual objects instead of spreadsheet rows!**

## 🎯 Why MongoDB?

- ✅ **Flexible Schema**: Add fields without changing structure
- ✅ **JSON-like Documents**: Natural for JavaScript/Node.js
- ✅ **Scalability**: Easy horizontal scaling
- ✅ **Fast Development**: Quick iterations, no migrations
- ✅ **Rich Queries**: Powerful query language
- ✅ **Embedded Data**: Store related data together

## 🗄️ SQL vs MongoDB - Quick Comparison

| SQL | MongoDB |
|-----|---------|
| Database | Database |
| Table | Collection |
| Row | Document |
| Column | Field |
| Primary Key | _id (automatic) |
| Index | Index |
| JOIN | Embedding or $lookup |

### Visual Comparison

**SQL (Relational):**
```
users table:
+----+--------+----------------+
| id | name   | phone          |
+----+--------+----------------+
| 1  | Rahul  | 9876543210     |
| 2  | Priya  | 9876543211     |
+----+--------+----------------+

cars table:
+----+-----------+---------+---------+
| id | user_id   | brand   | model   |
+----+-----------+---------+---------+
| 1  | 1         | Maruti  | Swift   |
| 2  | 1         | Honda   | City    |
+----+-----------+---------+---------+
```

**MongoDB (Document):**
```javascript
// users collection
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "Rahul",
  phone: "9876543210",
  cars: [  // Embedded documents!
    { brand: "Maruti", model: "Swift" },
    { brand: "Honda", model: "City" }
  ]
}
```

## 📊 MongoDB Structure

### Database
Contains multiple collections
```javascript
// Show all databases
show dbs

// Create/use database
use vahanhelp

// Current database
db
```

### Collection
Group of documents (like a table)
```javascript
// Create collection (automatic when you insert)
db.createCollection("users")

// Show collections
show collections
```

### Document
A single record (like a row, but flexible!)
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),  // Auto-generated
  name: "Rahul Kumar",
  phone: "9876543210",
  email: "rahul@example.com",
  age: 28,
  isVerified: true,
  tags: ["customer", "premium"],  // Arrays!
  address: {  // Nested object!
    city: "Delhi",
    state: "Delhi",
    pincode: 110001
  },
  createdAt: ISODate("2024-11-18T10:30:00Z")
}
```

## 🚀 Getting Started

### Install MongoDB

```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS (Homebrew)
brew install mongodb-community

# Windows
# Download from mongodb.com

# Start MongoDB
mongod

# Or using MongoDB Compass (GUI)
```

### Connect to MongoDB

```bash
# Using mongo shell
mongo

# Or mongosh (new shell)
mongosh

# Connect to specific database
mongo vahanhelp
```

## 💻 Basic Operations (CRUD)

### 1. Create (Insert)

```javascript
// Insert one document
db.users.insertOne({
  name: "Rahul Kumar",
  phone: "9876543210",
  email: "rahul@example.com",
  role: "customer"
})

// Result:
{
  acknowledged: true,
  insertedId: ObjectId("507f1f77bcf86cd799439011")
}

// Insert many documents
db.users.insertMany([
  {
    name: "Priya Sharma",
    phone: "9876543211",
    email: "priya@example.com",
    role: "customer"
  },
  {
    name: "AutoWorld Dealers",
    phone: "9876543212",
    email: "autoworld@example.com",
    role: "dealer"
  }
])
```

### 2. Read (Find)

```javascript
// Find all documents
db.users.find()

// Find with pretty formatting
db.users.find().pretty()

// Find one document
db.users.findOne()

// Find with filter
db.users.find({ role: "customer" })

// Find specific fields (projection)
db.users.find(
  { role: "customer" },
  { name: 1, phone: 1, _id: 0 }  // 1 = include, 0 = exclude
)

// Find with multiple conditions
db.users.find({
  role: "customer",
  isVerified: true
})

// Count documents
db.users.countDocuments({ role: "dealer" })
```

### 3. Update

```javascript
// Update one document
db.users.updateOne(
  { phone: "9876543210" },  // Filter
  { $set: { isVerified: true } }  // Update
)

// Update multiple documents
db.users.updateMany(
  { role: "customer" },
  { $set: { membershipLevel: "silver" } }
)

// Replace entire document
db.users.replaceOne(
  { _id: ObjectId("507f1f77bcf86cd799439011") },
  {
    name: "Rahul Kumar Singh",
    phone: "9876543210",
    email: "rahul.singh@example.com"
  }
)

// Upsert (insert if not exists)
db.users.updateOne(
  { phone: "9999999999" },
  { $set: { name: "New User" } },
  { upsert: true }  // Create if doesn't exist
)
```

### 4. Delete

```javascript
// Delete one document
db.users.deleteOne({ phone: "9876543210" })

// Delete multiple documents
db.users.deleteMany({ role: "customer" })

// Delete all documents (be careful!)
db.users.deleteMany({})

// Drop entire collection
db.users.drop()
```

## 🔍 Query Operators

### Comparison Operators

```javascript
// Equal
db.cars.find({ brand: "Maruti" })

// Not equal
db.cars.find({ brand: { $ne: "Maruti" } })

// Greater than
db.cars.find({ price: { $gt: 500000 } })

// Greater than or equal
db.cars.find({ year: { $gte: 2020 } })

// Less than
db.cars.find({ price: { $lt: 1000000 } })

// Less than or equal
db.cars.find({ kmsDriven: { $lte: 50000 } })

// In array
db.cars.find({ brand: { $in: ["Maruti", "Honda", "Hyundai"] } })

// Not in array
db.cars.find({ fuelType: { $nin: ["Diesel", "CNG"] } })
```

### Logical Operators

```javascript
// AND (implicit)
db.cars.find({
  brand: "Maruti",
  year: { $gte: 2020 }
})

// AND (explicit)
db.cars.find({
  $and: [
    { brand: "Maruti" },
    { year: { $gte: 2020 } }
  ]
})

// OR
db.cars.find({
  $or: [
    { brand: "Maruti" },
    { brand: "Honda" }
  ]
})

// NOT
db.cars.find({
  price: { $not: { $gt: 1000000 } }
})

// NOR
db.cars.find({
  $nor: [
    { brand: "Maruti" },
    { brand: "Honda" }
  ]
})
```

### Element Operators

```javascript
// Field exists
db.users.find({ email: { $exists: true } })

// Field doesn't exist
db.users.find({ email: { $exists: false } })

// Type check
db.users.find({ age: { $type: "number" } })
```

### Array Operators

```javascript
// Array contains value
db.users.find({ tags: "premium" })

// Array contains all values
db.users.find({ tags: { $all: ["premium", "verified"] } })

// Array size
db.users.find({ tags: { $size: 2 } })
```

## 📝 Update Operators

```javascript
// $set - Set field value
db.users.updateOne(
  { _id: ObjectId("...") },
  { $set: { name: "New Name" } }
)

// $unset - Remove field
db.users.updateOne(
  { _id: ObjectId("...") },
  { $unset: { email: "" } }
)

// $inc - Increment number
db.users.updateOne(
  { _id: ObjectId("...") },
  { $inc: { loginCount: 1 } }
)

// $mul - Multiply number
db.cars.updateOne(
  { _id: ObjectId("...") },
  { $mul: { price: 0.9 } }  // 10% discount
)

// $rename - Rename field
db.users.updateOne(
  { _id: ObjectId("...") },
  { $rename: { "phone": "mobile" } }
)

// $min - Update if smaller
db.cars.updateOne(
  { _id: ObjectId("...") },
  { $min: { lowestPrice: 450000 } }
)

// $max - Update if larger
db.cars.updateOne(
  { _id: ObjectId("...") },
  { $max: { highestBid: 550000 } }
)

// $currentDate - Set to current date
db.users.updateOne(
  { _id: ObjectId("...") },
  { $currentDate: { lastModified: true } }
)
```

### Array Update Operators

```javascript
// $push - Add to array
db.users.updateOne(
  { _id: ObjectId("...") },
  { $push: { tags: "vip" } }
)

// $push with multiple
db.users.updateOne(
  { _id: ObjectId("...") },
  { $push: { tags: { $each: ["vip", "gold"] } } }
)

// $pull - Remove from array
db.users.updateOne(
  { _id: ObjectId("...") },
  { $pull: { tags: "basic" } }
)

// $addToSet - Add unique to array
db.users.updateOne(
  { _id: ObjectId("...") },
  { $addToSet: { tags: "premium" } }  // Only adds if not exists
)

// $pop - Remove first or last
db.users.updateOne(
  { _id: ObjectId("...") },
  { $pop: { tags: 1 } }  // 1 = last, -1 = first
)
```

## 🏃 Practical Exercises

### Exercise 1: Create a Cars Collection

```javascript
// Insert multiple cars
db.cars.insertMany([
  {
    brand: "Maruti",
    model: "Swift",
    year: 2020,
    price: 550000,
    kmsDriven: 25000,
    fuelType: "Petrol",
    transmission: "Manual",
    city: "Delhi",
    ownerNumber: 1,
    images: [
      "https://example.com/car1-img1.jpg",
      "https://example.com/car1-img2.jpg"
    ],
    features: ["ABS", "Airbags", "AC"],
    isActive: true,
    createdAt: new Date()
  },
  {
    brand: "Hyundai",
    model: "Creta",
    year: 2021,
    price: 1200000,
    kmsDriven: 15000,
    fuelType: "Diesel",
    transmission: "Automatic",
    city: "Mumbai",
    ownerNumber: 1,
    images: [
      "https://example.com/car2-img1.jpg"
    ],
    features: ["Sunroof", "Leather Seats", "Touchscreen"],
    isActive: true,
    createdAt: new Date()
  },
  {
    brand: "Tata",
    model: "Nexon",
    year: 2022,
    price: 900000,
    kmsDriven: 8000,
    fuelType: "Electric",
    transmission: "Automatic",
    city: "Bangalore",
    ownerNumber: 1,
    images: [],
    features: ["Fast Charging", "Connected Car"],
    isActive: true,
    createdAt: new Date()
  }
])
```

### Exercise 2: Query Practice

```javascript
// 1. Find all cars
db.cars.find().pretty()

// 2. Find cars in Delhi
db.cars.find({ city: "Delhi" })

// 3. Find cars priced under 1000000
db.cars.find({ price: { $lt: 1000000 } })

// 4. Find automatic transmission cars
db.cars.find({ transmission: "Automatic" })

// 5. Find cars manufactured after 2020
db.cars.find({ year: { $gt: 2020 } })

// 6. Find Maruti or Hyundai cars
db.cars.find({
  $or: [
    { brand: "Maruti" },
    { brand: "Hyundai" }
  ]
})

// 7. Find cars with less than 20000 kms and price under 600000
db.cars.find({
  kmsDriven: { $lt: 20000 },
  price: { $lt: 600000 }
})

// 8. Find cars with sunroof feature
db.cars.find({ features: "Sunroof" })

// 9. Count active cars
db.cars.countDocuments({ isActive: true })

// 10. Find only brand and model
db.cars.find({}, { brand: 1, model: 1, _id: 0 })
```

### Exercise 3: Update Operations

```javascript
// 1. Increase price of all Maruti cars by 5%
db.cars.updateMany(
  { brand: "Maruti" },
  { $mul: { price: 1.05 } }
)

// 2. Add a new feature to a specific car
db.cars.updateOne(
  { brand: "Maruti", model: "Swift" },
  { $push: { features: "Bluetooth" } }
)

// 3. Mark a car as sold (inactive)
db.cars.updateOne(
  { brand: "Tata", model: "Nexon" },
  { $set: { isActive: false } }
)

// 4. Increment views count
db.cars.updateOne(
  { brand: "Hyundai", model: "Creta" },
  { $inc: { viewsCount: 1 } }
)

// 5. Add updatedAt timestamp
db.cars.updateMany(
  {},
  { $currentDate: { updatedAt: true } }
)
```

### Exercise 4: Delete Operations

```javascript
// 1. Delete cars older than 2015
db.cars.deleteMany({ year: { $lt: 2015 } })

// 2. Delete inactive cars
db.cars.deleteMany({ isActive: false })

// 3. Delete a specific car
db.cars.deleteOne({ brand: "Maruti", model: "Swift" })
```

## 🎯 Challenge: Build a User Profile

Create a complete user document with nested data:

```javascript
db.users.insertOne({
  name: "Rahul Kumar",
  phone: "9876543210",
  email: "rahul@example.com",
  role: "customer",
  isVerified: true,
  isActive: true,

  // Nested address
  address: {
    street: "123 MG Road",
    city: "Delhi",
    state: "Delhi",
    pincode: 110001
  },

  // Array of saved cars
  savedCars: [
    ObjectId("507f1f77bcf86cd799439011"),
    ObjectId("507f1f77bcf86cd799439012")
  ],

  // Preferences object
  preferences: {
    notifications: true,
    newsletter: true,
    theme: "dark",
    language: "en"
  },

  // Activity tracking
  stats: {
    searchCount: 0,
    savedCarsCount: 0,
    rcChecksCount: 0
  },

  // Timestamps
  createdAt: new Date(),
  updatedAt: new Date(),
  lastLoginAt: new Date()
})
```

Then practice queries:
```javascript
// 1. Find users in Delhi
db.users.find({ "address.city": "Delhi" })

// 2. Find users who have notifications enabled
db.users.find({ "preferences.notifications": true })

// 3. Increment search count
db.users.updateOne(
  { phone: "9876543210" },
  { $inc: { "stats.searchCount": 1 } }
)

// 4. Add a saved car
db.users.updateOne(
  { phone: "9876543210" },
  {
    $push: { savedCars: ObjectId("507f1f77bcf86cd799439013") },
    $inc: { "stats.savedCarsCount": 1 }
  }
)

// 5. Update last login
db.users.updateOne(
  { phone: "9876543210" },
  { $currentDate: { lastLoginAt: true } }
)
```

## ✅ Key Takeaways

1. **MongoDB stores JSON-like documents** - flexible and natural for JavaScript
2. **No fixed schema** - add fields anytime
3. **Collections hold documents** - like tables hold rows
4. **_id is automatic** - unique identifier
5. **Rich query operators** - $gt, $lt, $in, $or, etc.
6. **Nested documents** - store related data together
7. **Arrays supported** - store lists directly
8. **Update operators** - $set, $inc, $push, etc.

## 🆚 When to Use MongoDB vs SQL?

**Use MongoDB when:**
- ✅ Flexible schema needed
- ✅ Rapid development
- ✅ Hierarchical data
- ✅ Scaling horizontally
- ✅ Document-based data

**Use SQL when:**
- ✅ Complex relationships
- ✅ ACID transactions critical
- ✅ Strict schema needed
- ✅ Complex joins required
- ✅ Data integrity paramount

## 🚀 Next Lesson

In [Lesson 2: Documents & Collections](./02-documents-collections.md), we'll dive deeper into:
- Document structure best practices
- Data modeling strategies
- Relationships in MongoDB
- Embedded vs Referenced data
- Collection design patterns

## 📚 Additional Resources

- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [MongoDB University](https://university.mongodb.com/) - Free courses
- [MongoDB Compass](https://www.mongodb.com/products/compass) - GUI tool

---

**Start thinking in documents, not tables! 🚀**
