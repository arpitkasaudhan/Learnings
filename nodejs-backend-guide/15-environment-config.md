# Lesson 15: Environment & Configuration

## .env File

```bash
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/vahanhelp
# OR for PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/vahanhelp

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-user
SMTP_PASS=your-pass

# Frontend
FRONTEND_URL=http://localhost:3001
```

## Config Module

```javascript
// config/config.js
module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  database: {
    uri: process.env.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRE || '7d'
  },
  cors: {
    origin: process.env.FRONTEND_URL
  }
};
```

## Multiple Environments

```javascript
// config/env/development.js
module.exports = {
  database: {
    uri: 'mongodb://localhost:27017/vahanhelp-dev',
    debug: true
  },
  logging: {
    level: 'debug'
  }
};

// config/env/production.js
module.exports = {
  database: {
    uri: process.env.MONGODB_URI,
    debug: false
  },
  logging: {
    level: 'error'
  }
};

// config/index.js
const env = process.env.NODE_ENV || 'development';
const config = require(`./env/${env}`);
module.exports = config;
```

**Next Lesson**: [16-deployment.md](16-deployment.md)
