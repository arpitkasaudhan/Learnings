# Lesson 14: Prototypes and Inheritance

## 🎯 Learning Objectives
- Understand prototypes
- Learn prototype chain
- Use prototypal inheritance

---

## What are Prototypes?

**Every object has a prototype - another object it inherits from.**

```javascript
const car = {
  brand: "Honda",
  model: "City"
};

// car inherits from Object.prototype
console.log(car.toString());  // Inherited method
console.log(car.hasOwnProperty("brand"));  // true
```

---

## Prototype Chain

```javascript
function Car(brand, model) {
  this.brand = brand;
  this.model = model;
}

// Add method to prototype
Car.prototype.getInfo = function() {
  return `${this.brand} ${this.model}`;
};

const car1 = new Car("Honda", "City");
const car2 = new Car("Maruti", "Swift");

console.log(car1.getInfo());  // "Honda City"
console.log(car2.getInfo());  // "Maruti Swift"

// Both share same method (memory efficient)
console.log(car1.getInfo === car2.getInfo);  // true
```

---

## Key Takeaways

1. **Prototypes** enable inheritance
2. **Prototype chain** looks up properties
3. **Classes** use prototypes internally

**Next**: [15-this-context.md](15-this-context.md)
