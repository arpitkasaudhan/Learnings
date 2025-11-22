# Lesson 8: ES6 Features

## 🎯 Learning Objectives
- Learn modern JavaScript (ES6+)
- Master template literals
- Use destructuring
- Understand spread and rest operators
- Work with default parameters

---

## Template Literals

```javascript
// Old way
let name = "John";
let age = 25;
let message = "Hello, I'm " + name + " and I'm " + age + " years old";

// ✅ ES6 way - template literals
let message = `Hello, I'm ${name} and I'm ${age} years old`;

// Multiline
let html = `
  <div>
    <h1>${name}</h1>
    <p>Age: ${age}</p>
  </div>
`;

// Expressions
let price = 1000;
let total = `Total: ₹${price * 1.18}`;  // With tax
```

---

## Destructuring

### Array Destructuring

```javascript
let numbers = [1, 2, 3, 4, 5];

// Old way
let first = numbers[0];
let second = numbers[1];

// ✅ ES6 way
let [first, second, third] = numbers;
console.log(first);   // 1
console.log(second);  // 2

// Skip elements
let [one, , three] = numbers;
console.log(one);    // 1
console.log(three);  // 3

// Rest elements
let [head, ...rest] = numbers;
console.log(head);  // 1
console.log(rest);  // [2, 3, 4, 5]
```

### Object Destructuring

```javascript
let car = {
  brand: "Honda",
  model: "City",
  year: 2023,
  price: 1500000
};

// Extract properties
let { brand, model, price } = car;

// Rename
let { brand: carBrand } = car;

// Default values
let { color = "White" } = car;

// Nested destructuring
let user = {
  name: "John",
  address: {
    city: "Mumbai",
    state: "Maharashtra"
  }
};

let { name, address: { city } } = user;
console.log(city);  // "Mumbai"
```

---

## Spread Operator (...)

### Array Spread

```javascript
let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];

// Combine arrays
let combined = [...arr1, ...arr2];
console.log(combined);  // [1, 2, 3, 4, 5, 6]

// Copy array
let copy = [...arr1];

// Add elements
let extended = [...arr1, 4, 5];
console.log(extended);  // [1, 2, 3, 4, 5]
```

### Object Spread

```javascript
let car = { brand: "Honda", model: "City" };
let details = { year: 2023, price: 1500000 };

// Merge objects
let fullCar = { ...car, ...details };

// Copy object
let carCopy = { ...car };

// Override properties
let updatedCar = { ...car, price: 1400000 };
```

---

## Rest Parameters

```javascript
// Collect all arguments into array
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3));        // 6
console.log(sum(1, 2, 3, 4, 5));  // 15

// Mix with regular parameters
function greet(greeting, ...names) {
  return `${greeting} ${names.join(", ")}`;
}

console.log(greet("Hello", "John", "Jane", "Bob"));
// "Hello John, Jane, Bob"
```

---

## Default Parameters

```javascript
// Old way
function greet(name) {
  name = name || "Guest";
  return `Hello ${name}`;
}

// ✅ ES6 way
function greet(name = "Guest") {
  return `Hello ${name}`;
}

console.log(greet());        // "Hello Guest"
console.log(greet("John"));  // "Hello John"

// Multiple defaults
function createCar(brand = "Honda", model = "City", year = 2023) {
  return { brand, model, year };
}
```

---

## Arrow Functions (Quick Review)

```javascript
// Regular function
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => a + b;

// With array methods
let numbers = [1, 2, 3, 4, 5];
let doubled = numbers.map(n => n * 2);
let evens = numbers.filter(n => n % 2 === 0);
```

---

## Enhanced Object Literals

```javascript
let brand = "Honda";
let model = "City";
let year = 2023;

// Old way
let car = {
  brand: brand,
  model: model,
  year: year
};

// ✅ ES6 shorthand
let car = {
  brand,
  model,
  year,
  
  // Method shorthand
  getInfo() {
    return `${this.brand} ${this.model}`;
  },
  
  // Computed property names
  [`${brand}_${model}`]: true
};
```

---

## Real-World Example

```javascript
// API function with ES6 features
async function fetchCars({
  page = 1,
  limit = 10,
  minPrice = 0,
  maxPrice = 10000000,
  ...filters
} = {}) {
  const params = {
    page,
    limit,
    minPrice,
    maxPrice,
    ...filters
  };
  
  const response = await api.get('/cars', { params });
  const { data: { cars, pagination } } = response;
  
  return {
    cars: cars.map(car => ({
      ...car,
      priceFormatted: `₹${car.price.toLocaleString()}`
    })),
    ...pagination
  };
}

// Usage
const result = await fetchCars({ 
  page: 2, 
  brand: "Honda",
  fuelType: "Petrol" 
});
```

---

## Key Takeaways

1. **Template literals** - Use backticks for strings
2. **Destructuring** - Extract values easily
3. **Spread (...)** - Copy/merge arrays and objects
4. **Rest (...)** - Collect arguments into array
5. **Default parameters** - Set default values
6. **Arrow functions** - Concise function syntax

**Next**: [09-promises-async.md](09-promises-async.md) - Already completed!
