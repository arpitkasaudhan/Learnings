# Lesson 13: Closures and Scope

## 🎯 Learning Objectives
- Understand scope (global, function, block)
- Learn closures
- Use closures practically

---

## Scope

### Global Scope
```javascript
let globalVar = "I'm global";

function test() {
  console.log(globalVar);  // Can access
}
```

### Function Scope
```javascript
function test() {
  let localVar = "I'm local";
  console.log(localVar);  // Works
}

console.log(localVar);  // ❌ Error! Not accessible
```

### Block Scope
```javascript
if (true) {
  let blockVar = "I'm block-scoped";
  const anotherBlock = "Me too";
  console.log(blockVar);  // Works
}

console.log(blockVar);  // ❌ Error!
```

---

## Closures

**Function that remembers variables from its outer scope.**

```javascript
function createCounter() {
  let count = 0;  // Private variable
  
  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getCount() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.increment());  // 1
console.log(counter.increment());  // 2
console.log(counter.getCount());   // 2
console.log(counter.decrement());  // 1
```

---

## Practical Example

```javascript
function createCarFilter(brand) {
  // 'brand' is captured in closure
  return function(car) {
    return car.brand === brand;
  };
}

const cars = [
  { brand: "Honda", model: "City" },
  { brand: "Maruti", model: "Swift" },
  { brand: "Honda", model: "Civic" }
];

const hondaFilter = createCarFilter("Honda");
const hondaCars = cars.filter(hondaFilter);
console.log(hondaCars);  // Both Honda cars
```

---

## Key Takeaways

1. **Scope** determines variable accessibility
2. **let/const** are block-scoped
3. **Closures** remember outer variables
4. **Use closures** for private data

**Next**: [14-prototypes-inheritance.md](14-prototypes-inheritance.md)
