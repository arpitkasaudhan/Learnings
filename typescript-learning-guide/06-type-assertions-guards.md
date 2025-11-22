# Lesson 6: Type Assertions and Guards

## 🎯 Learning Objectives
- Use type assertions
- Create type guards
- Narrow types safely
- Use typeof and instanceof

---

## Type Assertions

```typescript
// Tell TypeScript "trust me, I know the type"
let value: any = "Hello";

// Using 'as'
let length = (value as string).length;

// Using angle brackets
let length2 = (<string>value).length;
```

---

## Type Guards

```typescript
// typeof guard
function printValue(value: string | number) {
  if (typeof value === "string") {
    console.log(value.toUpperCase());  // TypeScript knows it's string
  } else {
    console.log(value.toFixed(2));      // TypeScript knows it's number
  }
}

// instanceof guard
class Car {}
class Bike {}

function displayVehicle(vehicle: Car | Bike) {
  if (vehicle instanceof Car) {
    // TypeScript knows it's Car
  } else {
    // TypeScript knows it's Bike
  }
}
```

---

## Custom Type Guards

```typescript
interface Car {
  brand: string;
  model: string;
  doors: number;
}

interface Bike {
  brand: string;
  model: string;
  type: "sports" | "cruiser";
}

// Custom type guard function
function isCar(vehicle: Car | Bike): vehicle is Car {
  return (vehicle as Car).doors !== undefined;
}

function display(vehicle: Car | Bike) {
  if (isCar(vehicle)) {
    console.log(`Car with ${vehicle.doors} doors`);
  } else {
    console.log(`Bike type: ${vehicle.type}`);
  }
}
```

---

## Key Takeaways

1. **Type assertions** tell TypeScript the type
2. **typeof** for primitive types
3. **instanceof** for classes
4. **Custom guards** with `is` keyword

**Next**: [07-generics.md](07-generics.md)
