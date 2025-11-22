# Lesson 12: Error Handling

## 🎯 Learning Objectives
- Handle errors with try/catch
- Throw custom errors
- Understand error types
- Handle async errors

---

## try...catch

```javascript
try {
  // Code that might throw error
  let result = riskyOperation();
  console.log(result);
} catch (error) {
  // Handle error
  console.error("Error occurred:", error.message);
}
```

---

## Throwing Errors

```javascript
function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}

try {
  console.log(divide(10, 2));  // 5
  console.log(divide(10, 0));  // Throws error
} catch (error) {
  console.error(error.message);  // "Cannot divide by zero"
}
```

---

## Custom Errors

```javascript
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

function validateAge(age) {
  if (age < 0) {
    throw new ValidationError("Age cannot be negative");
  }
  if (age < 18) {
    throw new ValidationError("Must be 18 or older");
  }
  return true;
}

try {
  validateAge(15);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error("Validation failed:", error.message);
  }
}
```

---

## Async Error Handling

```javascript
// With async/await
async function fetchCar(id) {
  try {
    const response = await fetch(`/api/cars/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const car = await response.json();
    return car;
  } catch (error) {
    console.error("Failed to fetch car:", error.message);
    throw error;  // Re-throw if needed
  }
}
```

---

## Backend Example

```javascript
class CarController {
  async getCar(req, res, next) {
    try {
      const { id } = req.params;
      
      // Validation
      if (!id) {
        throw new ValidationError("Car ID is required");
      }
      
      // Fetch car
      const car = await CarService.getById(id);
      
      if (!car) {
        throw new NotFoundError("Car not found");
      }
      
      res.json({ success: true, data: car });
    } catch (error) {
      next(error);  // Pass to error middleware
    }
  }
}
```

---

## Key Takeaways

1. **try/catch** catches errors
2. **throw** creates errors
3. **Custom errors** for specific cases
4. **Always catch async errors**
5. **Re-throw when needed**

**Next**: [13-closures-scope.md](13-closures-scope.md)
