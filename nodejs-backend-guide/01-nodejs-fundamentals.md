# Lesson 01: Node.js Fundamentals

## What is Node.js?

**Node.js** is a JavaScript runtime built on Chrome's V8 engine that allows you to run JavaScript on the server.

**Key Points**:
- JavaScript outside the browser
- Event-driven, non-blocking I/O
- Perfect for building scalable network applications
- Same language for frontend and backend

---

## Why Node.js?

### 1. **JavaScript Everywhere**
```javascript
// Same language on client and server
// Frontend (React)
function Car({ brand, model }) {
  return <div>{brand} {model}</div>;
}

// Backend (Node.js)
function getCar(brand, model) {
  return { brand, model };
}
```

### 2. **Fast & Scalable**
- Non-blocking I/O
- Event-driven architecture
- Handles thousands of concurrent connections

### 3. **Large Ecosystem**
- npm: 2+ million packages
- Active community
- Rich tooling

### 4. **Real-World Usage**
- Netflix, PayPal, LinkedIn, Uber, NASA
- APIs, microservices, real-time apps

---

## The Event Loop

Node.js is **single-threaded** but handles concurrency through the **event loop**.

### Blocking vs Non-Blocking

```javascript
// ❌ Blocking (synchronous)
const fs = require('fs');

const data = fs.readFileSync('file.txt', 'utf8');
console.log(data);
console.log('This waits for file read');

// ✅ Non-Blocking (asynchronous)
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});
console.log('This runs immediately');
```

### Event Loop Visualization
```
   ┌───────────────────────────┐
┌─>│           timers          │ setTimeout, setInterval
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           poll            │ Incoming connections, data
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           check           │ setImmediate
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

---

## Module System

Node.js uses **CommonJS modules** by default.

### Exporting Modules

```javascript
// car.js
class Car {
  constructor(brand, model) {
    this.brand = brand;
    this.model = model;
  }

  getInfo() {
    return `${this.brand} ${this.model}`;
  }
}

// Export single item
module.exports = Car;

// Or export multiple items
module.exports = {
  Car,
  createCar: (brand, model) => new Car(brand, model)
};
```

### Importing Modules

```javascript
// app.js
const Car = require('./car');

const myCar = new Car('Honda', 'City');
console.log(myCar.getInfo());

// Destructure imports
const { Car, createCar } = require('./car');
const car = createCar('Maruti', 'Swift');
```

### ES Modules (Modern)

```javascript
// car.mjs (or add "type": "module" in package.json)
export class Car {
  constructor(brand, model) {
    this.brand = brand;
    this.model = model;
  }
}

export const createCar = (brand, model) => new Car(brand, model);

// app.mjs
import { Car, createCar } from './car.mjs';
```

---

## Built-in Modules

### fs (File System)

```javascript
const fs = require('fs');

// Read file
fs.readFile('data.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// Write file
fs.writeFile('output.txt', 'Hello World', (err) => {
  if (err) throw err;
  console.log('File written');
});

// Promises API (modern)
const fsPromises = require('fs').promises;

async function readFileAsync() {
  try {
    const data = await fsPromises.readFile('data.txt', 'utf8');
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
```

### path

```javascript
const path = require('path');

console.log(path.join('/users', 'john', 'docs', 'file.txt'));
// /users/john/docs/file.txt

console.log(path.basename('/users/john/file.txt'));  // file.txt
console.log(path.dirname('/users/john/file.txt'));   // /users/john
console.log(path.extname('file.txt'));               // .txt
```

### http

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
```

---

## Async Patterns

### 1. Callbacks (Old Way)

```javascript
function getCar(id, callback) {
  setTimeout(() => {
    callback(null, { id, brand: 'Honda' });
  }, 1000);
}

getCar(1, (err, car) => {
  if (err) console.error(err);
  console.log(car);
});
```

### 2. Promises

```javascript
function getCar(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ id, brand: 'Honda' });
    }, 1000);
  });
}

getCar(1)
  .then(car => console.log(car))
  .catch(err => console.error(err));
```

### 3. Async/Await (Modern, Best)

```javascript
async function fetchCar(id) {
  try {
    const car = await getCar(id);
    console.log(car);
  } catch (err) {
    console.error(err);
  }
}

fetchCar(1);
```

---

## VahanHelp Example

### Project Structure
```
vahanhelp-backend/
├── src/
│   ├── models/
│   │   └── Car.js
│   ├── services/
│   │   └── carService.js
│   ├── utils/
│   │   └── fileHelper.js
│   └── app.js
├── package.json
└── README.md
```

### Car Model (models/Car.js)

```javascript
class Car {
  constructor(data) {
    this.id = data.id;
    this.brand = data.brand;
    this.model = data.model;
    this.year = data.year;
    this.price = data.price;
  }

  getInfo() {
    return `${this.brand} ${this.model} (${this.year})`;
  }

  isNew() {
    return new Date().getFullYear() === this.year;
  }
}

module.exports = Car;
```

### Car Service (services/carService.js)

```javascript
const Car = require('../models/Car');

class CarService {
  constructor() {
    this.cars = [];
  }

  async createCar(carData) {
    const car = new Car({ ...carData, id: Date.now() });
    this.cars.push(car);
    return car;
  }

  async getAllCars() {
    return this.cars;
  }

  async getCarById(id) {
    return this.cars.find(car => car.id === id);
  }
}

module.exports = new CarService();
```

### Main App (app.js)

```javascript
const carService = require('./services/carService');

async function main() {
  // Create cars
  await carService.createCar({
    brand: 'Honda',
    model: 'City',
    year: 2023,
    price: 1500000
  });

  await carService.createCar({
    brand: 'Maruti',
    model: 'Swift',
    year: 2022,
    price: 800000
  });

  // Get all cars
  const cars = await carService.getAllCars();
  console.log('All cars:', cars);
}

main().catch(console.error);
```

---

## Practice Exercise

Create a simple file-based database for VahanHelp:

```javascript
// db.js - Simple JSON database
const fs = require('fs').promises;
const path = require('path');

class Database {
  constructor(filename) {
    this.filepath = path.join(__dirname, filename);
  }

  async read() {
    try {
      const data = await fs.readFile(this.filepath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      return [];
    }
  }

  async write(data) {
    await fs.writeFile(
      this.filepath,
      JSON.stringify(data, null, 2),
      'utf8'
    );
  }

  async insert(item) {
    const data = await this.read();
    item.id = Date.now();
    data.push(item);
    await this.write(data);
    return item;
  }

  async findAll() {
    return await this.read();
  }

  async findById(id) {
    const data = await this.read();
    return data.find(item => item.id === id);
  }
}

module.exports = Database;

// Usage
const db = new Database('cars.json');

async function test() {
  await db.insert({ brand: 'Honda', model: 'City' });
  const cars = await db.findAll();
  console.log(cars);
}

test();
```

---

## Key Takeaways

✅ **Node.js** = JavaScript runtime for server-side
✅ **Event Loop** = Non-blocking, asynchronous I/O
✅ **Modules** = Code organization (CommonJS or ES modules)
✅ **Built-in modules** = fs, path, http, etc.
✅ **Async/Await** = Modern way to handle asynchronous code
✅ **Best for** = APIs, real-time apps, microservices

---

## What's Next?

Now that you understand Node.js fundamentals, let's learn package management!

**Next Lesson**: [02-npm-package-management.md](02-npm-package-management.md)

---

**Remember**: Node.js is all about asynchronous, event-driven programming!

**Keep learning! 🚀**
