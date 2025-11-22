# Lesson 16: Advanced Array Methods

## 🎯 Learning Objectives
- Master advanced array methods
- Use reduce effectively
- Chain array methods
- Work with complex data

---

## reduce()

**Most powerful - transforms array to any value.**

```javascript
// Sum
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((total, num) => total + num, 0);
console.log(sum);  // 15

// Max value
const max = numbers.reduce((max, num) => Math.max(max, num), numbers[0]);

// Group by property
const cars = [
  { brand: "Honda", price: 1500000 },
  { brand: "Maruti", price: 800000 },
  { brand: "Honda", price: 2000000 }
];

const byBrand = cars.reduce((acc, car) => {
  if (!acc[car.brand]) {
    acc[car.brand] = [];
  }
  acc[car.brand].push(car);
  return acc;
}, {});

console.log(byBrand);
// {
//   Honda: [{...}, {...}],
//   Maruti: [{...}]
// }
```

---

## find() and findIndex()

```javascript
const cars = [
  { id: 1, brand: "Honda" },
  { id: 2, brand: "Maruti" },
  { id: 3, brand: "Hyundai" }
];

// find - returns first match
const car = cars.find(c => c.id === 2);
console.log(car);  // { id: 2, brand: "Maruti" }

// findIndex - returns index
const index = cars.findIndex(c => c.id === 2);
console.log(index);  // 1
```

---

## some() and every()

```javascript
const numbers = [1, 2, 3, 4, 5];

// some - at least one passes
const hasEven = numbers.some(n => n % 2 === 0);
console.log(hasEven);  // true

// every - all must pass
const allPositive = numbers.every(n => n > 0);
console.log(allPositive);  // true
```

---

## Method Chaining

```javascript
const cars = [
  { brand: "Honda", price: 1500000, isActive: true },
  { brand: "Maruti", price: 800000, isActive: false },
  { brand: "Hyundai", price: 1200000, isActive: true },
  { brand: "BMW", price: 5000000, isActive: true }
];

// Chain multiple methods
const result = cars
  .filter(car => car.isActive)           // Only active
  .filter(car => car.price < 2000000)    // Under budget
  .map(car => ({                          // Transform
    ...car,
    priceFormatted: `₹${car.price.toLocaleString()}`
  }))
  .sort((a, b) => a.price - b.price);    // Sort by price

console.log(result);
```

---

## Key Takeaways

1. **reduce()** - Most powerful, can do anything
2. **find()** - Get first match
3. **some/every()** - Test conditions
4. **Chain methods** for clean code

**Next**: [17-design-patterns.md](17-design-patterns.md)
