# Lesson 19: Real-World Examples

## 🎯 Learning Objectives
- See JavaScript in real backend code
- Understand production patterns
- Learn from VahanHelp codebase

---

## Example 1: API Route Handler

```javascript
// From: src/api/controllers/car.controller.ts

async getCars(req, res, next) {
  try {
    // Extract query parameters with defaults
    const {
      page = 1,
      limit = 10,
      brand,
      minPrice,
      maxPrice,
      fuelType
    } = req.query;

    // Build filter object
    const filters = {};
    if (brand) filters.brand = brand;
    if (fuelType) filters.fuelType = fuelType;
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }

    // Fetch cars with pagination
    const skip = (page - 1) * limit;
    const cars = await CarModel
      .find(filters)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await CarModel.countDocuments(filters);

    res.json({
      success: true,
      data: {
        cars,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
}
```

---

## Example 2: Data Validation

```javascript
// From: src/utils/validation.ts

function validateCarData(data) {
  const errors = [];

  // Required fields
  if (!data.brand) {
    errors.push("Brand is required");
  }
  if (!data.model) {
    errors.push("Model is required");
  }
  if (!data.year) {
    errors.push("Year is required");
  }

  // Year validation
  const currentYear = new Date().getFullYear();
  if (data.year < 1990 || data.year > currentYear) {
    errors.push(`Year must be between 1990 and ${currentYear}`);
  }

  // Price validation
  if (data.price <= 0) {
    errors.push("Price must be greater than 0");
  }

  // Fuel type validation
  const validFuelTypes = ["Petrol", "Diesel", "CNG", "Electric"];
  if (data.fuelType && !validFuelTypes.includes(data.fuelType)) {
    errors.push(`Fuel type must be one of: ${validFuelTypes.join(", ")}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
```

---

## Example 3: Array Transformation

```javascript
// Transform cars for API response

function transformCarsForResponse(cars, userId = null) {
  return cars.map(car => ({
    id: car._id,
    brand: car.brand,
    model: car.model,
    year: car.year,
    price: car.price,
    priceFormatted: `₹${car.price.toLocaleString('en-IN')}`,
    kmsDriven: car.kmsDriven,
    fuelType: car.fuelType,
    transmission: car.transmission,
    images: car.images || [],
    thumbnail: car.images?.[0] || null,
    location: {
      city: car.location?.city,
      state: car.location?.state
    },
    seller: {
      id: car.sellerId,
      name: car.sellerName,
      // Hide phone for non-authenticated users
      phone: userId ? car.sellerPhone : null
    },
    isActive: car.isActive,
    createdAt: car.createdAt,
    age: new Date().getFullYear() - car.year
  }));
}
```

---

## Example 4: Async Operations

```javascript
// Parallel async operations for better performance

async function getCarDetails(carId, userId) {
  // Run multiple queries in parallel
  const [car, similarCars, inquiryCount, seller] = await Promise.all([
    CarModel.findById(carId),
    CarModel.find({
      brand: car.brand,
      _id: { $ne: carId }
    }).limit(6),
    InquiryModel.countDocuments({ carId }),
    UserModel.findById(car.sellerId).select('name phone email isVerified')
  ]);

  if (!car) {
    throw new NotFoundError("Car not found");
  }

  // Increment view count (don't wait for it)
  CarViewModel.create({ carId, userId }).catch(err => {
    console.error("Failed to log view:", err);
  });

  return {
    car: transformCarForResponse(car, userId),
    similarCars: transformCarsForResponse(similarCars, userId),
    inquiryCount,
    seller
  };
}
```

---

## Example 5: Error Handling

```javascript
// Custom error classes

class AppError extends Error {
  constructor(statusCode, message, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(400, message);
  }
}

class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(404, message);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(401, message);
  }
}

// Usage in controllers
async getCarById(req, res, next) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      throw new ValidationError("Invalid car ID");
    }

    const car = await CarService.getById(id);

    if (!car) {
      throw new NotFoundError("Car not found");
    }

    res.json({ success: true, data: car });
  } catch (error) {
    next(error);
  }
}

// Error middleware
function errorHandler(err, req, res, next) {
  const { statusCode = 500, message } = err;

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
}
```

---

## Key Takeaways

1. **Destructuring** for clean parameter handling
2. **Async/await** with proper error handling
3. **Array methods** for data transformation
4. **Parallel operations** with Promise.all
5. **Custom errors** for clear error types

**Next**: [20-common-patterns.md](20-common-patterns.md)
