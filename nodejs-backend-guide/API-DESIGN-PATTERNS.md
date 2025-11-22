# API Design Patterns

## RESTful Endpoints

```
Resource: cars

GET    /api/cars              - List all
GET    /api/cars/:id          - Get single
POST   /api/cars              - Create
PUT    /api/cars/:id          - Update (full)
PATCH  /api/cars/:id          - Update (partial)
DELETE /api/cars/:id          - Delete
```

## Nested Resources

```
GET    /api/users/:userId/listings
POST   /api/cars/:carId/reviews
GET    /api/cars/:carId/images
```

## Query Parameters

```
# Filtering
GET /api/cars?brand=Honda&year=2023

# Pagination
GET /api/cars?page=1&limit=10

# Sorting
GET /api/cars?sort=-price,year

# Field Selection
GET /api/cars?fields=brand,model,price

# Search
GET /api/cars?search=honda+city
```

## Response Formats

### Success (List)

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### Success (Single)

```json
{
  "success": true,
  "data": { "id": 1, "brand": "Honda" }
}
```

### Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      { "field": "price", "message": "Required" }
    ]
  }
}
```

## Authentication Patterns

### JWT Header

```
Authorization: Bearer <token>
```

### Protected Routes

```javascript
app.get('/api/profile', authenticate, (req, res) => {
  res.json({ user: req.user });
});
```

### Role-Based

```javascript
app.delete('/api/cars/:id', authenticate, authorize('admin'), handler);
```

## Versioning

```
/api/v1/cars
/api/v2/cars
```

## Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 min
  max: 100  // 100 requests
});

app.use('/api/', limiter);
```

## HATEOAS (Links)

```json
{
  "data": { "id": 1, "brand": "Honda" },
  "links": {
    "self": "/api/cars/1",
    "images": "/api/cars/1/images",
    "owner": "/api/users/123"
  }
}
```
