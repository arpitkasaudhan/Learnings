# Lesson 06: Request Validation

## Why Validate?

- Prevent invalid data
- Security (SQL injection, XSS)
- Better error messages

---

## express-validator

```bash
npm install express-validator
```

### Basic Validation

```javascript
const { body, validationResult } = require('express-validator');

app.post('/api/cars',
  [
    body('brand').notEmpty().withMessage('Brand is required'),
    body('model').notEmpty().withMessage('Model is required'),
    body('price')
      .isNumeric().withMessage('Price must be a number')
      .custom(value => value > 0).withMessage('Price must be positive'),
    body('year')
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage('Invalid year')
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Process request
    res.status(201).json({ success: true, data: req.body });
  }
);
```

---

## Validation Middleware

```javascript
// middleware/validate.js
const { validationResult } = require('express-validator');

exports.validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }

  next();
};
```

### Reusable Validators

```javascript
// validators/car.js
const { body } = require('express-validator');

exports.createCarValidator = [
  body('brand')
    .trim()
    .notEmpty().withMessage('Brand is required')
    .isLength({ min: 2, max: 50 }),

  body('model')
    .trim()
    .notEmpty().withMessage('Model is required'),

  body('price')
    .isFloat({ min: 0 }).withMessage('Price must be positive'),

  body('year')
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 }),

  body('mileage')
    .optional()
    .isInt({ min: 0 }),

  body('description')
    .optional()
    .isLength({ max: 1000 }).withMessage('Description too long')
];

// Use in route
const { createCarValidator } = require('./validators/car');
const { validate } = require('./middleware/validate');

app.post('/api/cars', createCarValidator, validate, (req, res) => {
  // Request is validated
});
```

---

## Custom Validators

```javascript
body('email')
  .isEmail()
  .normalizeEmail()
  .custom(async (email) => {
    const user = await User.findOne({ email });
    if (user) {
      throw new Error('Email already exists');
    }
  }),

body('password')
  .isLength({ min: 8 })
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .withMessage('Password must contain uppercase, lowercase, and number')
```

---

## Sanitization

```javascript
body('email').normalizeEmail(),
body('brand').trim().escape(),
body('description').trim()
```

**Next Lesson**: [07-database-mongodb.md](07-database-mongodb.md)
