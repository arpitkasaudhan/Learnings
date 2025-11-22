# Lesson 10: Modules

## 🎯 Learning Objectives
- Understand JavaScript modules
- Use import and export
- Organize code with modules
- Work with default and named exports

---

## Why Modules?

**Modules split code into separate files for better organization.**

```javascript
// ❌ Bad - everything in one file
// app.js (1000 lines)
function fetchCars() { }
function createCar() { }
function updateCar() { }
// ... 100 more functions

// ✅ Good - organized in modules
// services/carService.js
export function fetchCars() { }
export function createCar() { }

// services/userService.js
export function fetchUsers() { }
export function createUser() { }
```

---

## Named Exports

```javascript
// utils/math.js
export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

export const PI = 3.14159;

// app.js - import specific exports
import { add, multiply, PI } from './utils/math.js';

console.log(add(2, 3));      // 5
console.log(multiply(4, 5)); // 20
console.log(PI);             // 3.14159
```

---

## Default Export

```javascript
// services/carService.js
export default class CarService {
  async fetchCars() { }
  async createCar(data) { }
}

// app.js - import default
import CarService from './services/carService.js';

const service = new CarService();
```

---

## Mix Named and Default

```javascript
// services/api.js
export default class API {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }
}

export const API_URL = 'http://localhost:8080/api';
export const TIMEOUT = 5000;

// app.js
import API, { API_URL, TIMEOUT } from './services/api.js';
```

---

## Import Aliases

```javascript
// Rename imports
import { fetchCars as getCars } from './services/carService.js';

// Import all as namespace
import * as CarService from './services/carService.js';

CarService.fetchCars();
CarService.createCar();
```

---

## Your Backend Structure

```javascript
// src/api/controllers/car.controller.ts
export class CarController {
  async getCars(req, res, next) { }
  async getCarById(req, res, next) { }
}

// src/api/routes/car.routes.ts
import { CarController } from '../controllers/car.controller';

const router = express.Router();
router.get('/', CarController.getCars);

export default router;

// src/server.ts
import carRoutes from './api/routes/car.routes';

app.use('/api/cars', carRoutes);
```

---

## Key Takeaways

1. **Modules** organize code into files
2. **Named exports** - export multiple things
3. **Default export** - export one main thing
4. **import** - bring code from other files
5. **Aliases** - rename imports

**Next**: [11-classes.md](11-classes.md)
