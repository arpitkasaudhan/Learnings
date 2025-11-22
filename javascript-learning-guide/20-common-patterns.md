# Lesson 20: Common Patterns

## 🎯 Learning Objectives
- Learn production-ready patterns
- Handle common scenarios
- Write maintainable code

---

## Pattern 1: Repository Pattern

```javascript
class CarRepository {
  constructor(model) {
    this.model = model;
  }

  async findAll(filters = {}, options = {}) {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
    const skip = (page - 1) * limit;

    const cars = await this.model
      .find(filters)
      .skip(skip)
      .limit(limit)
      .sort(sort);

    const total = await this.model.countDocuments(filters);

    return {
      data: cars,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async findById(id) {
    return await this.model.findById(id);
  }

  async create(data) {
    return await this.model.create(data);
  }

  async update(id, data) {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await this.model.findByIdAndDelete(id);
  }
}

const carRepository = new CarRepository(CarModel);
```

---

## Pattern 2: Middleware Pipeline

```javascript
// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError("No token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

// Permission middleware
const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      throw new ForbiddenError("Insufficient permissions");
    }
    next();
  };
};

// Usage
router.post('/cars', authenticate, requireRole('seller'), createCar);
```

---

## Pattern 3: Service Layer

```javascript
class CarService {
  static async getCarsByFilters(filters, options) {
    // Build query
    const query = this.buildQuery(filters);

    // Fetch data
    const result = await carRepository.findAll(query, options);

    // Transform response
    return {
      cars: result.data.map(this.transformCar),
      pagination: result.pagination
    };
  }

  static buildQuery(filters) {
    const query = {};

    if (filters.brand) query.brand = filters.brand;
    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = filters.minPrice;
      if (filters.maxPrice) query.price.$lte = filters.maxPrice;
    }

    return query;
  }

  static transformCar(car) {
    return {
      id: car._id,
      brand: car.brand,
      model: car.model,
      priceFormatted: `₹${car.price.toLocaleString('en-IN')}`
    };
  }
}
```

---

## Pattern 4: Dependency Injection

```javascript
class UserService {
  constructor(userRepository, emailService, cacheService) {
    this.userRepository = userRepository;
    this.emailService = emailService;
    this.cacheService = cacheService;
  }

  async createUser(data) {
    // Create user
    const user = await this.userRepository.create(data);

    // Send welcome email
    await this.emailService.sendWelcome(user.email);

    // Clear cache
    await this.cacheService.delete('users:all');

    return user;
  }
}

// Inject dependencies
const userService = new UserService(
  new UserRepository(UserModel),
  new EmailService(),
  new CacheService()
);
```

---

## Pattern 5: Event-Driven

```javascript
const EventEmitter = require('events');
const eventBus = new EventEmitter();

// Event listeners
eventBus.on('car:created', async (car) => {
  console.log('New car created:', car.id);
  await NotificationService.notifyAdmin(car);
});

eventBus.on('car:created', async (car) => {
  await EmailService.notifySeller(car.sellerId, car);
});

// Emit event
class CarService {
  static async createCar(data) {
    const car = await CarRepository.create(data);

    // Emit event
    eventBus.emit('car:created', car);

    return car;
  }
}
```

---

## 🎉 Congratulations!

You've completed the JavaScript learning guide!

### What You've Learned:
- ✅ JavaScript fundamentals
- ✅ Modern ES6+ features
- ✅ Async programming
- ✅ Object-oriented JavaScript
- ✅ Functional programming
- ✅ Error handling
- ✅ Design patterns
- ✅ Production-ready code

### Next Steps:
1. Practice building projects
2. Learn TypeScript (next guide!)
3. Contribute to open source
4. Master Node.js frameworks
5. Study system design

**Happy Coding! 🚀**
