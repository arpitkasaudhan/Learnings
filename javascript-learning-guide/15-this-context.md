# Lesson 15: Understanding 'this'

## 🎯 Learning Objectives
- Understand `this` keyword
- Learn different contexts
- Use bind, call, apply

---

## What is 'this'?

**`this` refers to the object executing the current function.**

```javascript
const car = {
  brand: "Honda",
  getInfo() {
    console.log(this.brand);  // 'this' is car
  }
};

car.getInfo();  // "Honda"
```

---

## Different Contexts

### Method Call
```javascript
const obj = {
  name: "John",
  greet() {
    console.log(this.name);  // 'this' is obj
  }
};

obj.greet();  // "John"
```

### Function Call
```javascript
function test() {
  console.log(this);  // undefined (strict mode) or window (browser)
}

test();
```

### Arrow Functions
```javascript
const obj = {
  name: "John",
  greet: () => {
    console.log(this.name);  // 'this' is NOT obj!
  }
};

// Arrow functions don't have their own 'this'
```

---

## bind(), call(), apply()

```javascript
const car = {
  brand: "Honda"
};

function getInfo(model, year) {
  return `${this.brand} ${model} (${year})`;
}

// bind - returns new function
const boundFn = getInfo.bind(car);
console.log(boundFn("City", 2023));  // "Honda City (2023)"

// call - executes immediately with arguments
console.log(getInfo.call(car, "City", 2023));

// apply - executes immediately with array
console.log(getInfo.apply(car, ["City", 2023]));
```

---

## Key Takeaways

1. **'this'** depends on how function is called
2. **Arrow functions** inherit 'this'
3. **bind/call/apply** set 'this' explicitly

**Next**: [16-advanced-array-methods.md](16-advanced-array-methods.md)
