# Lesson 17: Design Patterns

## 🎯 Learning Objectives
- Learn common JavaScript patterns
- Module pattern
- Singleton pattern
- Factory pattern

---

## Module Pattern

```javascript
const CarService = (function() {
  // Private variables
  const cache = new Map();
  
  // Private function
  function validateCar(car) {
    if (!car.brand || !car.model) {
      throw new Error("Invalid car");
    }
  }
  
  // Public API
  return {
    addCar(car) {
      validateCar(car);
      cache.set(car.id, car);
    },
    
    getCar(id) {
      return cache.get(id);
    }
  };
})();

CarService.addCar({ id: 1, brand: "Honda", model: "City" });
console.log(CarService.getCar(1));
```

---

## Singleton Pattern

```javascript
class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    this.connection = this.connect();
    Database.instance = this;
  }
  
  connect() {
    return "Database connected";
  }
}

const db1 = new Database();
const db2 = new Database();
console.log(db1 === db2);  // true (same instance)
```

---

## Factory Pattern

```javascript
class CarFactory {
  createCar(type) {
    switch (type) {
      case "sedan":
        return { type: "sedan", doors: 4, category: "family" };
      case "suv":
        return { type: "suv", doors: 5, category: "luxury" };
      case "hatchback":
        return { type: "hatchback", doors: 4, category: "compact" };
      default:
        throw new Error("Unknown car type");
    }
  }
}

const factory = new CarFactory();
const sedan = factory.createCar("sedan");
const suv = factory.createCar("suv");
```

---

## Key Takeaways

1. **Module** pattern for encapsulation
2. **Singleton** for single instance
3. **Factory** for object creation

**Next**: [18-best-practices.md](18-best-practices.md)
