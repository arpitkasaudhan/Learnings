# Node.js Backend Quick Reference

## Express Setup

```javascript
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => console.log('Server started'));
```

## Routes

```javascript
app.get('/api/cars', (req, res) => {});
app.post('/api/cars', (req, res) => {});
app.put('/api/cars/:id', (req, res) => {});
app.delete('/api/cars/:id', (req, res) => {});
```

## Middleware

```javascript
const middleware = (req, res, next) => {
  // Do something
  next();
};

app.use(middleware);  // Global
app.get('/api/cars', middleware, handler);  // Route-specific
```

## MongoDB/Mongoose

```javascript
const mongoose = require('mongoose');
await mongoose.connect(process.env.MONGODB_URI);

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true }
}, { timestamps: true });

const Model = mongoose.model('Model', schema);

// CRUD
await Model.create({ name: 'John' });
await Model.find({ name: 'John' });
await Model.findById(id);
await Model.findByIdAndUpdate(id, { name: 'Jane' });
await Model.findByIdAndDelete(id);
```

## Authentication

```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Hash password
const hashed = await bcrypt.hash(password, 10);

// Compare
const isMatch = await bcrypt.compare(password, hashed);

// Generate JWT
const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Verify JWT
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

## Error Handling

```javascript
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    error: err.message || 'Server Error'
  });
});
```

## Common Packages

```bash
# Framework
npm i express

# Database
npm i mongoose  # MongoDB
npm i pg sequelize  # PostgreSQL

# Authentication
npm i jsonwebtoken bcrypt

# Validation
npm i express-validator

# File Upload
npm i multer

# Security
npm i helmet cors express-rate-limit

# Dev Tools
npm i -D nodemon jest supertest
```

## Environment Variables

```javascript
require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  dbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET
};
```

## Status Codes

```
200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
500 Internal Server Error
```
