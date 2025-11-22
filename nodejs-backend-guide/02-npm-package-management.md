# Lesson 02: NPM & Package Management

## What is NPM?

**NPM** (Node Package Manager) is the default package manager for Node.js.

- **Registry**: 2+ million packages
- **CLI Tool**: Install, update, manage packages
- **Version Control**: Semantic versioning

---

## package.json

The heart of every Node.js project.

### Create package.json

```bash
# Interactive creation
npm init

# Quick creation with defaults
npm init -y
```

### Example package.json

```json
{
  "name": "vahanhelp-backend",
  "version": "1.0.0",
  "description": "VahanHelp car marketplace backend API",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest",
    "lint": "eslint src/**/*.js"
  },
  "keywords": ["cars", "marketplace", "api"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.6.4"
  }
}
```

---

## Installing Packages

### Dependencies (Production)

```bash
# Install and save to dependencies
npm install express
npm install mongoose dotenv

# Short form
npm i express mongoose dotenv

# Install specific version
npm install express@4.18.2
```

### DevDependencies (Development Only)

```bash
# Install as dev dependency
npm install --save-dev nodemon
npm install -D jest eslint prettier

# These won't be installed in production
```

### Global Packages

```bash
# Install globally
npm install -g nodemon pm2 typescript

# Use without installing
npx create-react-app my-app
```

---

## Essential Packages for Backend

### Core Packages

```bash
# Framework
npm install express

# Environment variables
npm install dotenv

# Database
npm install mongoose      # MongoDB
npm install pg sequelize  # PostgreSQL

# Authentication
npm install jsonwebtoken bcrypt

# Validation
npm install express-validator

# File upload
npm install multer

# Security
npm install helmet cors express-rate-limit
```

### Development Packages

```bash
# Auto-restart server
npm install -D nodemon

# Testing
npm install -D jest supertest

# Code quality
npm install -D eslint prettier

# Type checking
npm install -D typescript @types/node @types/express
```

---

## Package Versions

### Semantic Versioning (SemVer)

```
MAJOR.MINOR.PATCH

1.2.3
^ ^ ^
│ │ └── Bug fixes (backward compatible)
│ └──── New features (backward compatible)
└────── Breaking changes
```

### Version Symbols

```json
{
  "dependencies": {
    "express": "4.18.2",    // Exact version
    "express": "^4.18.2",   // Compatible with 4.x.x (default)
    "express": "~4.18.2",   // Compatible with 4.18.x
    "express": "*",         // Latest (not recommended)
    "express": ">=4.18.0"   // Greater than or equal
  }
}
```

---

## NPM Scripts

### Common Scripts

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "lint": "eslint src/**/*.js",
    "lint:fix": "eslint src/**/*.js --fix",
    "format": "prettier --write \"src/**/*.js\"",
    "build": "tsc",
    "clean": "rm -rf dist"
  }
}
```

### Run Scripts

```bash
# Run script
npm run dev
npm run test

# Special scripts don't need 'run'
npm start
npm test
```

### Pass Arguments

```bash
# Pass arguments to script
npm run dev -- --port=4000
```

---

## VahanHelp Backend Setup

### 1. Initialize Project

```bash
mkdir vahanhelp-backend
cd vahanhelp-backend
npm init -y
```

### 2. Install Dependencies

```bash
# Core dependencies
npm install express dotenv cors helmet
npm install mongoose
npm install jsonwebtoken bcrypt
npm install express-validator
npm install multer

# Dev dependencies
npm install -D nodemon
npm install -D jest supertest
npm install -D eslint prettier
```

### 3. Configure package.json

```json
{
  "name": "vahanhelp-backend",
  "version": "1.0.0",
  "description": "Car marketplace backend API",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest --coverage",
    "test:watch": "jest --watchAll",
    "lint": "eslint src/**/*.js",
    "format": "prettier --write \"src/**/*.js\""
  },
  "keywords": ["cars", "marketplace", "backend", "api"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-validator": "^7.0.1",
    "helmet": "^7.0.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^7.5.0",
    "multer": "^1.4.5-lts.1"
  },
  "devDependencies": {
    "eslint": "^8.49.0",
    "jest": "^29.6.4",
    "nodemon": "^3.0.1",
    "prettier": "^3.0.3",
    "supertest": "^6.3.3"
  }
}
```

### 4. Create .gitignore

```
node_modules/
.env
*.log
dist/
coverage/
.DS_Store
```

### 5. Create nodemon.json

```json
{
  "watch": ["src"],
  "ext": "js,json",
  "ignore": ["src/**/*.test.js"],
  "exec": "node src/server.js"
}
```

---

## Package Lock

### package-lock.json

- Locks exact versions of dependencies
- Ensures consistent installs across environments
- **Commit to Git**: Yes!

### npm ci vs npm install

```bash
# npm install - installs from package.json, updates lock
npm install

# npm ci - installs from package-lock.json, faster, for CI/CD
npm ci
```

---

## Managing Dependencies

### Update Packages

```bash
# Check outdated packages
npm outdated

# Update all packages
npm update

# Update specific package
npm update express

# Update to latest (even breaking changes)
npm install express@latest
```

### Remove Packages

```bash
# Uninstall package
npm uninstall mongoose
npm uninstall -D nodemon
```

### Clean Install

```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Practice: VahanHelp Project Setup

Create this structure:

```
vahanhelp-backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── tests/
├── .env.example
├── .gitignore
├── package.json
├── nodemon.json
└── README.md
```

### Basic server.js

```javascript
// src/server.js
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

### Basic app.js

```javascript
// src/app.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'VahanHelp API v1.0' });
});

module.exports = app;
```

---

## Key Takeaways

✅ **package.json** - Project metadata and dependencies
✅ **npm install** - Add packages
✅ **npm scripts** - Automate tasks
✅ **Semantic versioning** - MAJOR.MINOR.PATCH
✅ **devDependencies** - Development only packages
✅ **package-lock.json** - Lock dependency versions

**Next Lesson**: [03-express-basics.md](03-express-basics.md)
