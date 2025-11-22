# Lesson 04: Middleware

## What is Middleware?

Functions that have access to `req`, `res`, and `next`.

```javascript
function middleware(req, res, next) {
  // Do something
  next();  // Pass to next middleware
}
```

---

## Built-in Middleware

```javascript
// Parse JSON
app.use(express.json());

// Parse URL-encoded
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));
```

---

## Custom Middleware

```javascript
// Logger middleware
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

app.use(logger);

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Verify token
  req.user = { id: 1, email: 'user@example.com' };
  next();
};

// Use on specific routes
app.get('/api/profile', authenticate, (req, res) => {
  res.json({ user: req.user });
});
```

---

## Error Handling Middleware

```javascript
// Must have 4 parameters
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: err.message || 'Internal Server Error'
  });
});
```

---

## Third-Party Middleware

```javascript
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

app.use(helmet());        // Security headers
app.use(cors());          // CORS
app.use(morgan('dev'));   // Logging
```

---

## VahanHelp Example

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token || !token.startsWith('Bearer')) {
    return res.status(401).json({ error: 'Not authorized' });
  }

  token = token.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Usage
app.get('/api/my-listings', protect, (req, res) => {
  res.json({ userId: req.user.id });
});
```

**Next Lesson**: [05-rest-api-design.md](05-rest-api-design.md)
