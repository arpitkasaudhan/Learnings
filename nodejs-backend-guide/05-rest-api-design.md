# Lesson 05: REST API Design

## REST Principles

**REST** = Representational State Transfer

**Key Principles**:
1. Client-Server separation
2. Stateless
3. Cacheable
4. Uniform interface
5. Layered system

---

## HTTP Methods

```
GET    - Retrieve resources
POST   - Create new resource
PUT    - Update entire resource
PATCH  - Update partial resource
DELETE - Remove resource
```

---

## API Design

### Resource Naming

```
✅ Good:
GET    /api/cars
GET    /api/cars/:id
POST   /api/cars
PUT    /api/cars/:id
DELETE /api/cars/:id

❌ Bad:
GET    /api/get-cars
POST   /api/create-car
GET    /api/cars/getAllCars
```

### Nested Resources

```
GET    /api/users/:userId/listings
GET    /api/cars/:carId/reviews
POST   /api/cars/:carId/images
```

---

## Status Codes

```
200 OK              - Success
201 Created         - Resource created
204 No Content      - Success, no response body
400 Bad Request     - Invalid input
401 Unauthorized    - Not authenticated
403 Forbidden       - Not authorized
404 Not Found       - Resource doesn't exist
500 Server Error    - Internal error
```

---

## Response Format

### Success

```json
{
  "success": true,
  "message": "Cars retrieved successfully",
  "data": [
    { "id": 1, "brand": "Honda", "model": "City" }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
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
      { "field": "price", "message": "Price must be positive" }
    ]
  }
}
```

---

## VahanHelp API Design

```
# Auth
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

# Cars
GET    /api/cars                 # List all
GET    /api/cars/:id             # Get single
POST   /api/cars                 # Create (protected)
PUT    /api/cars/:id             # Update (protected)
DELETE /api/cars/:id             # Delete (protected)
GET    /api/cars/search          # Search
GET    /api/cars/featured        # Featured cars

# Users
GET    /api/users/profile        # Own profile (protected)
PUT    /api/users/profile        # Update profile (protected)
GET    /api/users/:userId/listings  # User's listings

# Reviews
POST   /api/cars/:carId/reviews  # Add review (protected)
GET    /api/cars/:carId/reviews  # Get reviews
```

---

## Filtering & Pagination

```javascript
// GET /api/cars?brand=Honda&minPrice=100000&page=1&limit=10

app.get('/api/cars', async (req, res) => {
  const {
    brand,
    minPrice,
    maxPrice,
    page = 1,
    limit = 10
  } = req.query;

  const query = {};
  if (brand) query.brand = brand;
  if (minPrice) query.price = { $gte: minPrice };
  if (maxPrice) query.price = { ...query.price, $lte: maxPrice };

  const skip = (page - 1) * limit;

  const cars = await Car.find(query)
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Car.countDocuments(query);

  res.json({
    success: true,
    data: cars,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});
```

---

## Versioning

```
/api/v1/cars
/api/v2/cars
```

**Next Lesson**: [06-request-validation.md](06-request-validation.md)
