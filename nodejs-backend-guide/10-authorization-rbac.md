# Lesson 10: Authorization & RBAC

## Role-Based Access Control

```javascript
// middleware/authorize.js
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Not authorized to access this resource'
      });
    }
    next();
  };
};

// Usage
const { protect } = require('./middleware/auth');
const { authorize } = require('./middleware/authorize');

app.delete('/api/cars/:id',
  protect,
  authorize('admin', 'seller'),
  async (req, res) => {
    // Only admin and sellers can delete
  }
);
```

## Resource Ownership

```javascript
exports.checkOwnership = (model) => async (req, res, next) => {
  const resource = await model.findById(req.params.id);

  if (!resource) {
    return res.status(404).json({ error: 'Resource not found' });
  }

  if (resource.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized' });
  }

  req.resource = resource;
  next();
};

// Usage
app.put('/api/cars/:id',
  protect,
  checkOwnership(Car),
  async (req, res) => {
    // Only owner or admin can update
  }
);
```

**Next Lesson**: [11-file-uploads.md](11-file-uploads.md)
