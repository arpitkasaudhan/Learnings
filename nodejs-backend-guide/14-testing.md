# Lesson 14: Testing

## Setup

```bash
npm install --save-dev jest supertest mongodb-memory-server
```

## Jest Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js']
};
```

## Unit Tests

```javascript
// utils/validator.test.js
const { isValidEmail } = require('./validator');

describe('Email Validator', () => {
  test('validates correct email', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
  });

  test('rejects invalid email', () => {
    expect(isValidEmail('invalid-email')).toBe(false);
  });
});
```

## API Integration Tests

```javascript
// __tests__/cars.test.js
const request = require('supertest');
const app = require('../src/app');
const Car = require('../src/models/Car');

describe('Cars API', () => {
  beforeEach(async () => {
    await Car.deleteMany({});
  });

  test('GET /api/cars returns all cars', async () => {
    await Car.create({ brand: 'Honda', model: 'City', year: 2023, price: 1500000 });

    const res = await request(app)
      .get('/api/cars')
      .expect(200);

    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].brand).toBe('Honda');
  });

  test('POST /api/cars creates new car', async () => {
    const carData = {
      brand: 'Maruti',
      model: 'Swift',
      year: 2023,
      price: 800000
    };

    const res = await request(app)
      .post('/api/cars')
      .send(carData)
      .expect(201);

    expect(res.body.data.brand).toBe('Maruti');

    const cars = await Car.find();
    expect(cars).toHaveLength(1);
  });
});
```

## Test Database

```javascript
// tests/setup.js
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
```

**Next Lesson**: [15-environment-config.md](15-environment-config.md)
