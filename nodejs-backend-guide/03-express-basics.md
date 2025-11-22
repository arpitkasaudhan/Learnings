# Lesson 03: Express.js Basics

## What is Express?

**Express.js** is a minimal and flexible Node.js web framework.

**Features**:
- Routing
- Middleware
- Template engines
- Static files
- RESTful APIs

---

## Basic Setup

```javascript
const express = require('express');
const app = express();

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## Routing

### GET Request

```javascript
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/api/cars', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, brand: 'Honda', model: 'City' },
      { id: 2, brand: 'Maruti', model: 'Swift' }
    ]
  });
});
```

### Route Parameters

```javascript
app.get('/api/cars/:id', (req, res) => {
  const { id } = req.params;
  res.json({ id, brand: 'Honda', model: 'City' });
});
```

### Query Parameters

```javascript
// GET /api/cars?brand=Honda&year=2023
app.get('/api/cars', (req, res) => {
  const { brand, year } = req.query;
  res.json({ brand, year });
});
```

---

## HTTP Methods

```javascript
// Create
app.post('/api/cars', (req, res) => {
  const car = req.body;
  res.status(201).json({ success: true, data: car });
});

// Read
app.get('/api/cars/:id', (req, res) => {
  res.json({ id: req.params.id });
});

// Update
app.put('/api/cars/:id', (req, res) => {
  res.json({ message: 'Car updated' });
});

// Delete
app.delete('/api/cars/:id', (req, res) => {
  res.status(204).send();
});
```

---

## Request & Response

### Request Object

```javascript
app.post('/api/cars', (req, res) => {
  // Body (requires middleware)
  const { brand, model } = req.body;

  // Parameters
  const { id } = req.params;

  // Query string
  const { page, limit } = req.query;

  // Headers
  const auth = req.headers.authorization;

  // Method & URL
  console.log(req.method);  // POST
  console.log(req.url);     // /api/cars
});
```

### Response Methods

```javascript
// Send JSON
res.json({ success: true, data: car });

// Send text
res.send('Hello');

// Send status
res.status(404).json({ error: 'Not found' });

// Redirect
res.redirect('/api/cars');

// Download file
res.download('/path/to/file.pdf');
```

---

## VahanHelp Example

```javascript
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// In-memory database
let cars = [
  { id: 1, brand: 'Honda', model: 'City', price: 1500000 },
  { id: 2, brand: 'Maruti', model: 'Swift', price: 800000 }
];

// Get all cars
app.get('/api/cars', (req, res) => {
  res.json({ success: true, data: cars });
});

// Get single car
app.get('/api/cars/:id', (req, res) => {
  const car = cars.find(c => c.id === parseInt(req.params.id));

  if (!car) {
    return res.status(404).json({ error: 'Car not found' });
  }

  res.json({ success: true, data: car });
});

// Create car
app.post('/api/cars', (req, res) => {
  const newCar = {
    id: cars.length + 1,
    ...req.body
  };

  cars.push(newCar);
  res.status(201).json({ success: true, data: newCar });
});

// Update car
app.put('/api/cars/:id', (req, res) => {
  const index = cars.findIndex(c => c.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: 'Car not found' });
  }

  cars[index] = { ...cars[index], ...req.body };
  res.json({ success: true, data: cars[index] });
});

// Delete car
app.delete('/api/cars/:id', (req, res) => {
  const index = cars.findIndex(c => c.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: 'Car not found' });
  }

  cars.splice(index, 1);
  res.status(204).send();
});

app.listen(3000, () => console.log('Server started'));
```

---

## Router

Organize routes using Express Router:

```javascript
// routes/cars.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ data: [] });
});

router.get('/:id', (req, res) => {
  res.json({ id: req.params.id });
});

router.post('/', (req, res) => {
  res.status(201).json(req.body);
});

module.exports = router;

// app.js
const carRoutes = require('./routes/cars');
app.use('/api/cars', carRoutes);
```

**Next Lesson**: [04-middleware.md](04-middleware.md)
