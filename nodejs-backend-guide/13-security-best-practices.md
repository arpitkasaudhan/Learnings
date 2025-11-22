# Lesson 13: Security Best Practices

## Essential Security Packages

```bash
npm install helmet cors express-rate-limit express-mongo-sanitize xss-clean hpp
```

## Helmet - Security Headers

```javascript
const helmet = require('helmet');
app.use(helmet());
```

## CORS

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

## Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,  // 100 requests per windowMs
  message: 'Too many requests'
});

app.use('/api', limiter);

// Stricter for auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5
});

app.use('/api/auth/login', authLimiter);
```

## NoSQL Injection Prevention

```javascript
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize());
```

## XSS Protection

```javascript
const xss = require('xss-clean');
app.use(xss());
```

## Parameter Pollution

```javascript
const hpp = require('hpp');
app.use(hpp());
```

## Environment Variables

```javascript
// Never commit .env to Git!
require('dotenv').config();

// Validate required env vars
const requiredEnvVars = ['NODE_ENV', 'PORT', 'MONGODB_URI', 'JWT_SECRET'];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});
```

**Next Lesson**: [14-testing.md](14-testing.md)
