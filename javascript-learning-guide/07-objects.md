# Lesson 7: Objects

## 🎯 Learning Objectives
- Understand JavaScript objects
- Create and manipulate objects
- Access and modify properties
- Work with object methods
- Understand `this` keyword basics
- Use object destructuring

---

## What are Objects?

**Objects store collections of related data and functionality.**

```javascript
// Simple values
let brand = "Honda";
let model = "City";
let year = 2023;
let price = 1500000;

// ✅ Better - grouped in object
let car = {
  brand: "Honda",
  model: "City",
  year: 2023,
  price: 1500000
};
```

---

## Creating Objects

### 1. Object Literal (Most Common)

```javascript
let car = {
  brand: "Honda",
  model: "City",
  year: 2023,
  price: 1500000
};
```

### 2. new Object()

```javascript
let car = new Object();
car.brand = "Honda";
car.model = "City";
car.year = 2023;
```

### 3. Constructor Function

```javascript
function Car(brand, model, year) {
  this.brand = brand;
  this.model = model;
  this.year = year;
}

let car = new Car("Honda", "City", 2023);
```

---

## Accessing Properties

### Dot Notation (Preferred)

```javascript
let car = {
  brand: "Honda",
  model: "City",
  price: 1500000
};

console.log(car.brand);  // "Honda"
console.log(car.model);  // "City"
console.log(car.price);  // 1500000
```

### Bracket Notation

```javascript
console.log(car["brand"]);  // "Honda"
console.log(car["model"]);  // "City"

// Useful for dynamic property names
let property = "brand";
console.log(car[property]);  // "Honda"

// Properties with spaces or special characters
let user = {
  "first name": "John",
  "email-address": "john@example.com"
};

console.log(user["first name"]);     // "John"
console.log(user["email-address"]);  // "john@example.com"
```

---

## Modifying Objects

### Add Properties

```javascript
let car = {
  brand: "Honda",
  model: "City"
};

// Add new property
car.year = 2023;
car.price = 1500000;

console.log(car);
// { brand: "Honda", model: "City", year: 2023, price: 1500000 }
```

### Update Properties

```javascript
let car = {
  brand: "Honda",
  price: 1500000
};

// Update existing property
car.price = 1400000;

console.log(car.price);  // 1400000
```

### Delete Properties

```javascript
let car = {
  brand: "Honda",
  model: "City",
  oldProperty: "remove this"
};

// Delete property
delete car.oldProperty;

console.log(car);
// { brand: "Honda", model: "City" }
```

---

## Nested Objects

**Objects can contain other objects.**

```javascript
let car = {
  brand: "Honda",
  model: "City",
  specifications: {
    engine: "1.5L Petrol",
    transmission: "Automatic",
    mileage: "18 kmpl"
  },
  owner: {
    name: "John Doe",
    phone: "+919876543210",
    address: {
      city: "Mumbai",
      state: "Maharashtra"
    }
  }
};

// Access nested properties
console.log(car.specifications.engine);       // "1.5L Petrol"
console.log(car.owner.name);                  // "John Doe"
console.log(car.owner.address.city);          // "Mumbai"

// Safely access with optional chaining
console.log(car.owner?.phone);                // "+919876543210"
console.log(car.seller?.phone);               // undefined (no error)
```

---

## Object Methods

**Functions inside objects are called methods.**

```javascript
let car = {
  brand: "Honda",
  model: "City",
  price: 1500000,

  // Method
  getInfo: function() {
    return `${this.brand} ${this.model}`;
  },

  // Shorthand method (ES6)
  applyDiscount(percent) {
    this.price = this.price * (1 - percent / 100);
  },

  // Method to display
  display() {
    console.log(`${this.brand} ${this.model} - ₹${this.price}`);
  }
};

// Call methods
console.log(car.getInfo());  // "Honda City"
car.applyDiscount(10);       // Apply 10% discount
car.display();               // "Honda City - ₹1350000"
```

---

## The `this` Keyword

**`this` refers to the object the method belongs to.**

```javascript
let user = {
  name: "John",
  age: 30,

  greet() {
    console.log(`Hello, I'm ${this.name}`);
  },

  haveBirthday() {
    this.age++;
    console.log(`I'm now ${this.age} years old`);
  }
};

user.greet();        // "Hello, I'm John"
user.haveBirthday(); // "I'm now 31 years old"
```

**Real Example from VahanHelp:**

```javascript
let carListing = {
  brand: "Honda",
  model: "City",
  price: 1500000,
  views: 0,
  inquiries: 0,

  addView() {
    this.views++;
  },

  addInquiry() {
    this.inquiries++;
  },

  getPopularityScore() {
    return this.views * 1 + this.inquiries * 10;
  },

  getInfo() {
    return `${this.brand} ${this.model} - ₹${this.price} (${this.views} views, ${this.inquiries} inquiries)`;
  }
};

carListing.addView();
carListing.addView();
carListing.addInquiry();

console.log(carListing.getInfo());
// "Honda City - ₹1500000 (2 views, 1 inquiries)"

console.log(carListing.getPopularityScore());
// 12 (2*1 + 1*10)
```

---

## Object.keys(), Object.values(), Object.entries()

### Object.keys()

```javascript
let car = {
  brand: "Honda",
  model: "City",
  year: 2023
};

let keys = Object.keys(car);
console.log(keys);  // ["brand", "model", "year"]

// Loop through keys
for (let key of Object.keys(car)) {
  console.log(`${key}: ${car[key]}`);
}
```

### Object.values()

```javascript
let values = Object.values(car);
console.log(values);  // ["Honda", "City", 2023]

// Loop through values
for (let value of Object.values(car)) {
  console.log(value);
}
```

### Object.entries()

```javascript
let entries = Object.entries(car);
console.log(entries);
// [["brand", "Honda"], ["model", "City"], ["year", 2023]]

// Loop through entries
for (let [key, value] of Object.entries(car)) {
  console.log(`${key}: ${value}`);
}
```

---

## Object Destructuring

**Extract properties into variables.**

```javascript
let car = {
  brand: "Honda",
  model: "City",
  year: 2023,
  price: 1500000
};

// Without destructuring
let brand = car.brand;
let model = car.model;
let price = car.price;

// ✅ With destructuring (cleaner)
let { brand, model, price } = car;

console.log(brand);  // "Honda"
console.log(model);  // "City"
console.log(price);  // 1500000
```

### Rename Variables

```javascript
let car = {
  brand: "Honda",
  model: "City"
};

// Rename while destructuring
let { brand: carBrand, model: carModel } = car;

console.log(carBrand);  // "Honda"
console.log(carModel);  // "City"
```

### Default Values

```javascript
let car = {
  brand: "Honda",
  model: "City"
};

// Set default if property doesn't exist
let { brand, model, year = 2023 } = car;

console.log(year);  // 2023 (default)
```

### Nested Destructuring

```javascript
let car = {
  brand: "Honda",
  owner: {
    name: "John",
    phone: "1234567890"
  }
};

// Destructure nested object
let { brand, owner: { name, phone } } = car;

console.log(brand);  // "Honda"
console.log(name);   // "John"
console.log(phone);  // "1234567890"
```

### In Function Parameters

```javascript
// Without destructuring
function displayCar(car) {
  console.log(`${car.brand} ${car.model} - ₹${car.price}`);
}

// ✅ With destructuring (cleaner)
function displayCar({ brand, model, price }) {
  console.log(`${brand} ${model} - ₹${price}`);
}

let car = { brand: "Honda", model: "City", price: 1500000 };
displayCar(car);  // "Honda City - ₹1500000"
```

---

## Copying Objects

### Shallow Copy with Spread Operator

```javascript
let car = {
  brand: "Honda",
  model: "City",
  price: 1500000
};

// Create copy
let carCopy = { ...car };

carCopy.price = 1400000;

console.log(car.price);      // 1500000 (original unchanged)
console.log(carCopy.price);  // 1400000 (copy changed)
```

### Merge Objects

```javascript
let basicInfo = {
  brand: "Honda",
  model: "City"
};

let priceInfo = {
  price: 1500000,
  currency: "INR"
};

// Merge objects
let fullInfo = { ...basicInfo, ...priceInfo };

console.log(fullInfo);
// { brand: "Honda", model: "City", price: 1500000, currency: "INR" }
```

### Object.assign()

```javascript
let car = { brand: "Honda" };
let details = { model: "City", year: 2023 };

// Merge into new object
let merged = Object.assign({}, car, details);

console.log(merged);
// { brand: "Honda", model: "City", year: 2023 }
```

---

## Checking Properties

### Check if Property Exists

```javascript
let car = {
  brand: "Honda",
  model: "City",
  price: 1500000
};

// Using 'in' operator
console.log("brand" in car);    // true
console.log("color" in car);    // false

// Using hasOwnProperty()
console.log(car.hasOwnProperty("brand"));  // true
console.log(car.hasOwnProperty("color"));  // false

// Check if undefined
console.log(car.brand !== undefined);  // true
console.log(car.color !== undefined);  // false
```

---

## Real-World Examples

### Example 1: User Profile

```javascript
let user = {
  id: "user123",
  name: "John Doe",
  email: "john@example.com",
  phone: "+919876543210",
  role: "seller",
  isVerified: true,
  createdAt: new Date(),

  // Methods
  getFullInfo() {
    return `${this.name} (${this.email})`;
  },

  canListCar() {
    return this.isVerified && this.role === "seller";
  },

  updateProfile(updates) {
    Object.assign(this, updates);
  }
};

console.log(user.getFullInfo());     // "John Doe (john@example.com)"
console.log(user.canListCar());      // true

user.updateProfile({ phone: "+919999999999" });
console.log(user.phone);  // "+919999999999"
```

### Example 2: Car Listing

```javascript
let carListing = {
  id: "car123",
  brand: "Honda",
  model: "City",
  year: 2023,
  price: 1500000,
  kmsDriven: 15000,
  fuelType: "Petrol",
  transmission: "Automatic",
  images: ["img1.jpg", "img2.jpg", "img3.jpg"],
  seller: {
    id: "user123",
    name: "John Doe",
    phone: "+919876543210"
  },
  location: {
    city: "Mumbai",
    state: "Maharashtra"
  },
  isActive: true,
  createdAt: new Date(),

  // Methods
  getTitle() {
    return `${this.year} ${this.brand} ${this.model}`;
  },

  getPriceFormatted() {
    return `₹${this.price.toLocaleString('en-IN')}`;
  },

  getAge() {
    return new Date().getFullYear() - this.year;
  },

  applyDiscount(percent) {
    this.price = Math.round(this.price * (1 - percent / 100));
  },

  deactivate() {
    this.isActive = false;
  },

  getSummary() {
    return `${this.getTitle()} - ${this.getPriceFormatted()} - ${this.kmsDriven} km - ${this.location.city}`;
  }
};

console.log(carListing.getSummary());
// "2023 Honda City - ₹15,00,000 - 15000 km - Mumbai"

carListing.applyDiscount(10);
console.log(carListing.getPriceFormatted());
// "₹13,50,000"
```

### Example 3: API Response

```javascript
// Typical API response format
let apiResponse = {
  success: true,
  message: "Cars fetched successfully",
  data: {
    cars: [
      { id: 1, brand: "Honda", price: 1500000 },
      { id: 2, brand: "Maruti", price: 800000 }
    ],
    pagination: {
      page: 1,
      limit: 10,
      total: 45,
      hasNextPage: true
    }
  },
  timestamp: new Date().toISOString()
};

// Destructure nested data
let {
  success,
  data: { cars, pagination }
} = apiResponse;

if (success) {
  cars.forEach(car => {
    console.log(`${car.brand} - ₹${car.price}`);
  });

  console.log(`Page ${pagination.page} of ${Math.ceil(pagination.total / pagination.limit)}`);
}
```

---

## Practice Exercises

### Exercise 1: Create User Object
```javascript
// Create a user object with:
// - name, email, age, isAdmin
// - Method to greet
// - Method to check if adult (age >= 18)

// Your code here:
```

<details>
<summary>Solution</summary>

```javascript
let user = {
  name: "John Doe",
  email: "john@example.com",
  age: 25,
  isAdmin: false,

  greet() {
    return `Hello, I'm ${this.name}`;
  },

  isAdult() {
    return this.age >= 18;
  }
};

console.log(user.greet());    // "Hello, I'm John Doe"
console.log(user.isAdult());  // true
```
</details>

### Exercise 2: Object Manipulation
```javascript
// Given this object, add a discount method
// that reduces price by given percentage

let product = {
  name: "Laptop",
  price: 50000
};

// Your code here:
```

<details>
<summary>Solution</summary>

```javascript
let product = {
  name: "Laptop",
  price: 50000,

  applyDiscount(percent) {
    this.price = this.price * (1 - percent / 100);
  },

  getInfo() {
    return `${this.name} - ₹${this.price}`;
  }
};

console.log(product.getInfo());  // "Laptop - ₹50000"
product.applyDiscount(20);       // 20% off
console.log(product.getInfo());  // "Laptop - ₹40000"
```
</details>

---

## Key Takeaways

1. **Objects** store related data and methods
2. **Dot notation** for property access (preferred)
3. **Bracket notation** for dynamic properties
4. **`this`** refers to the object
5. **Object.keys/values/entries()** for iteration
6. **Destructuring** extracts properties easily
7. **Spread operator** for copying/merging
8. **Methods** are functions inside objects

---

## Next Lesson

**Next**: [08-es6-features.md](08-es6-features.md) - Modern JavaScript

---

## Self-Check Questions

1. How do you create an object?
2. What's the difference between dot and bracket notation?
3. What does `this` refer to?
4. How do you copy an object?
5. What is object destructuring?
6. How do you check if a property exists?

Ready for ES6 features? Let's go! 🚀
