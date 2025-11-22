# Lesson 3: Operators and Conditions

## 🎯 Learning Objectives
- Understand all JavaScript operators
- Learn comparison and logical operators
- Master if/else statements
- Use switch statements
- Work with ternary operators
- Understand truthy and falsy values

---

## Operators in JavaScript

### 1. Arithmetic Operators

```javascript
let a = 10;
let b = 3;

// Addition
console.log(a + b);  // 13

// Subtraction
console.log(a - b);  // 7

// Multiplication
console.log(a * b);  // 30

// Division
console.log(a / b);  // 3.333...

// Modulus (remainder)
console.log(a % b);  // 1

// Exponentiation (power)
console.log(a ** b);  // 1000 (10^3)

// Increment
a++;
console.log(a);  // 11

// Decrement
b--;
console.log(b);  // 2
```

**Real Example:**
```javascript
// Calculate car price after discount
let originalPrice = 500000;
let discountPercent = 10;
let discount = originalPrice * (discountPercent / 100);
let finalPrice = originalPrice - discount;
console.log(finalPrice);  // 450000
```

---

### 2. Assignment Operators

```javascript
let x = 10;

// Basic assignment
x = 5;

// Add and assign
x += 3;   // Same as: x = x + 3
console.log(x);  // 8

// Subtract and assign
x -= 2;   // Same as: x = x - 2
console.log(x);  // 6

// Multiply and assign
x *= 4;   // Same as: x = x * 4
console.log(x);  // 24

// Divide and assign
x /= 3;   // Same as: x = x / 3
console.log(x);  // 8

// Modulus and assign
x %= 5;   // Same as: x = x % 5
console.log(x);  // 3
```

---

### 3. Comparison Operators

```javascript
let a = 10;
let b = "10";
let c = 20;

// Equal (loose equality - converts types)
console.log(a == b);   // true (10 == "10")

// Strict equal (checks type AND value)
console.log(a === b);  // false (number !== string)
console.log(a === 10); // true

// Not equal
console.log(a != c);   // true

// Strict not equal
console.log(a !== b);  // true (different types)

// Greater than
console.log(c > a);    // true

// Less than
console.log(a < c);    // true

// Greater than or equal
console.log(a >= 10);  // true

// Less than or equal
console.log(c <= 20);  // true
```

**Important: Always use `===` and `!==` (strict comparison)!**

```javascript
// ❌ Bad - can lead to bugs
if (price == "100") {  // true even if price is number
  // ...
}

// ✅ Good - explicit type checking
if (price === 100) {
  // ...
}
```

---

### 4. Logical Operators

```javascript
// AND (&&) - both must be true
let age = 25;
let hasLicense = true;

if (age >= 18 && hasLicense) {
  console.log("Can drive");
}

// OR (||) - at least one must be true
let isWeekend = true;
let isHoliday = false;

if (isWeekend || isHoliday) {
  console.log("Day off!");
}

// NOT (!) - inverts boolean
let isLoggedIn = false;

if (!isLoggedIn) {
  console.log("Please login");
}
```

**Real Example:**
```javascript
// Check if user can list a car
let isVerified = true;
let hasCompletedProfile = true;
let isActive = true;

if (isVerified && hasCompletedProfile && isActive) {
  console.log("You can list your car");
} else {
  console.log("Complete your profile first");
}
```

---

### 5. String Operators

```javascript
// Concatenation with +
let firstName = "John";
let lastName = "Doe";
let fullName = firstName + " " + lastName;
console.log(fullName);  // "John Doe"

// Concatenation with +=
let message = "Hello";
message += " World";
console.log(message);  // "Hello World"

// Template literals (better way)
let brand = "Honda";
let model = "City";
let carName = `${brand} ${model}`;
console.log(carName);  // "Honda City"
```

---

## Conditional Statements

### 1. if Statement

```javascript
let age = 18;

if (age >= 18) {
  console.log("Adult");
}
```

### 2. if...else Statement

```javascript
let age = 16;

if (age >= 18) {
  console.log("Adult");
} else {
  console.log("Minor");
}
```

### 3. if...else if...else Statement

```javascript
let score = 85;

if (score >= 90) {
  console.log("Grade: A");
} else if (score >= 80) {
  console.log("Grade: B");
} else if (score >= 70) {
  console.log("Grade: C");
} else if (score >= 60) {
  console.log("Grade: D");
} else {
  console.log("Grade: F");
}
```

**Real Example:**
```javascript
// Car price range filter
let price = 750000;

if (price < 500000) {
  console.log("Budget cars");
} else if (price >= 500000 && price < 1000000) {
  console.log("Mid-range cars");
} else if (price >= 1000000 && price < 2000000) {
  console.log("Premium cars");
} else {
  console.log("Luxury cars");
}
```

---

### 4. Switch Statement

```javascript
let day = "Monday";

switch (day) {
  case "Monday":
    console.log("Start of work week");
    break;
  case "Tuesday":
  case "Wednesday":
  case "Thursday":
    console.log("Mid week");
    break;
  case "Friday":
    console.log("Last work day");
    break;
  case "Saturday":
  case "Sunday":
    console.log("Weekend!");
    break;
  default:
    console.log("Invalid day");
}
```

**Real Example:**
```javascript
// Car fuel type
let fuelType = "Petrol";

switch (fuelType) {
  case "Petrol":
    console.log("Fuel efficiency: 15-20 km/l");
    break;
  case "Diesel":
    console.log("Fuel efficiency: 20-25 km/l");
    break;
  case "CNG":
    console.log("Fuel efficiency: 25-30 km/kg");
    break;
  case "Electric":
    console.log("Range: 200-400 km per charge");
    break;
  default:
    console.log("Unknown fuel type");
}
```

---

### 5. Ternary Operator

**Syntax:** `condition ? valueIfTrue : valueIfFalse`

```javascript
let age = 20;
let status = age >= 18 ? "Adult" : "Minor";
console.log(status);  // "Adult"

// Same as:
let status2;
if (age >= 18) {
  status2 = "Adult";
} else {
  status2 = "Minor";
}
```

**Real Examples:**
```javascript
// Check if car is available
let isActive = true;
let availability = isActive ? "Available" : "Sold";
console.log(availability);

// Calculate discount
let price = 500000;
let isPremiumUser = true;
let finalPrice = isPremiumUser ? price * 0.9 : price;
console.log(finalPrice);  // 450000 or 500000

// Button text
let isLoading = false;
let buttonText = isLoading ? "Loading..." : "Submit";
```

**Nested Ternary (use sparingly):**
```javascript
let score = 85;
let grade = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : "D";
console.log(grade);  // "B"

// Better as if...else for readability
```

---

## Truthy and Falsy Values

### Falsy Values (evaluate to false)

```javascript
// These 6 values are falsy:
if (false) { }       // false
if (0) { }           // zero
if ("") { }          // empty string
if (null) { }        // null
if (undefined) { }   // undefined
if (NaN) { }         // Not a Number

// All are falsy
console.log(Boolean(false));      // false
console.log(Boolean(0));          // false
console.log(Boolean(""));         // false
console.log(Boolean(null));       // false
console.log(Boolean(undefined));  // false
console.log(Boolean(NaN));        // false
```

### Truthy Values (everything else)

```javascript
// These are truthy:
if (true) { }        // true
if (1) { }           // any non-zero number
if ("hello") { }     // any non-empty string
if ([]) { }          // empty array (truthy!)
if ({}) { }          // empty object (truthy!)
if (function() {}) { }  // any function

console.log(Boolean(true));       // true
console.log(Boolean(42));         // true
console.log(Boolean("hello"));    // true
console.log(Boolean([]));         // true
console.log(Boolean({}));         // true
```

**Real Example:**
```javascript
// Check if user is logged in
let authToken = localStorage.getItem('token');

if (authToken) {
  // Token exists (truthy)
  console.log("User is logged in");
} else {
  // Token is null/undefined (falsy)
  console.log("Please login");
}

// Check if array has items
let cars = getCars();

if (cars.length) {
  // length > 0 (truthy)
  console.log("Cars available");
} else {
  // length === 0 (falsy)
  console.log("No cars found");
}
```

---

## Short-Circuit Evaluation

### AND (&&) - stops at first falsy

```javascript
// Returns first falsy value, or last value if all truthy
console.log(true && true);        // true
console.log(true && false);       // false
console.log(false && true);       // false

console.log(1 && 2);              // 2 (both truthy, returns last)
console.log(0 && 2);              // 0 (first is falsy)
console.log(1 && 0);              // 0 (second is falsy)

// Use case: Execute only if condition is true
let user = { name: "John" };
user && console.log(user.name);   // Prints "John"

let noUser = null;
noUser && console.log(noUser.name);  // Doesn't execute
```

### OR (||) - stops at first truthy

```javascript
// Returns first truthy value, or last value if all falsy
console.log(true || false);       // true
console.log(false || true);       // true
console.log(false || false);      // false

console.log(1 || 2);              // 1 (first is truthy)
console.log(0 || 2);              // 2 (first is falsy)
console.log(0 || 0);              // 0 (both falsy, returns last)

// Use case: Default values
let username = "";
let displayName = username || "Guest";
console.log(displayName);  // "Guest"

let price = 0;
let displayPrice = price || "Free";
console.log(displayPrice);  // "Free" (careful with 0!)
```

**Real Example:**
```javascript
// Get user or default
function getUser() {
  let user = localStorage.getItem('user');
  return user || { name: 'Guest', role: 'visitor' };
}

// Check permission before action
let isAdmin = false;
isAdmin && deleteUser();  // Won't execute

// Set default value
let limit = req.query.limit || 10;  // Default to 10
```

---

## Nullish Coalescing Operator (??)

**Returns right side only if left is `null` or `undefined`**

```javascript
// Difference from ||
let count = 0;

// With || (wrong for 0)
let display1 = count || 10;
console.log(display1);  // 10 (0 is falsy)

// With ?? (correct for 0)
let display2 = count ?? 10;
console.log(display2);  // 0 (0 is not null/undefined)

// Examples
let value1 = null ?? "default";      // "default"
let value2 = undefined ?? "default"; // "default"
let value3 = 0 ?? "default";         // 0
let value4 = "" ?? "default";        // ""
let value5 = false ?? "default";     // false
```

**Real Example:**
```javascript
// Safe default for numerical values
let limit = req.query.limit ?? 10;
let page = req.query.page ?? 1;
let minPrice = req.query.minPrice ?? 0;

// Won't override 0 values (which || would do)
```

---

## Optional Chaining (?.)

**Safely access nested properties**

```javascript
// Without optional chaining
let user = null;
// console.log(user.address.city);  // ❌ Error!

// With optional chaining
console.log(user?.address?.city);  // undefined (no error)

// Examples
let car = {
  brand: "Honda",
  owner: {
    name: "John"
  }
};

console.log(car?.brand);              // "Honda"
console.log(car?.owner?.name);        // "John"
console.log(car?.seller?.phone);      // undefined (no error)
console.log(car?.getPrice?.());       // undefined (method doesn't exist)
```

**Real Example:**
```javascript
// Safely access API response
function displayCarDetails(response) {
  let brand = response?.data?.car?.brand || "Unknown";
  let price = response?.data?.car?.price ?? 0;
  let ownerName = response?.data?.car?.owner?.name ?? "N/A";

  console.log(`${brand} - ₹${price} - Owner: ${ownerName}`);
}
```

---

## Practice Exercises

### Exercise 1: Age Checker
```javascript
// Write code to check age and print:
// "Child" if age < 13
// "Teenager" if age 13-17
// "Adult" if age >= 18

let age = 15;
// Your code here:
```

<details>
<summary>Solution</summary>

```javascript
let age = 15;

if (age < 13) {
  console.log("Child");
} else if (age >= 13 && age <= 17) {
  console.log("Teenager");
} else {
  console.log("Adult");
}

// Or with ternary (less readable)
let category = age < 13 ? "Child" : age <= 17 ? "Teenager" : "Adult";
console.log(category);
```
</details>

### Exercise 2: Login Check
```javascript
// Check if user can login:
// - username must not be empty
// - password length >= 6
// Print "Login successful" or error message

let username = "john";
let password = "123456";
// Your code here:
```

<details>
<summary>Solution</summary>

```javascript
let username = "john";
let password = "123456";

if (!username) {
  console.log("Username is required");
} else if (password.length < 6) {
  console.log("Password must be at least 6 characters");
} else {
  console.log("Login successful");
}

// Or combined
if (username && password.length >= 6) {
  console.log("Login successful");
} else {
  console.log("Invalid credentials");
}
```
</details>

### Exercise 3: Price Calculator
```javascript
// Calculate final price with discount:
// - If purchase > 100000, 10% discount
// - If purchase > 50000, 5% discount
// - Otherwise, no discount

let purchaseAmount = 75000;
// Your code here:
```

<details>
<summary>Solution</summary>

```javascript
let purchaseAmount = 75000;
let discount = 0;

if (purchaseAmount > 100000) {
  discount = 0.10;
} else if (purchaseAmount > 50000) {
  discount = 0.05;
}

let discountAmount = purchaseAmount * discount;
let finalPrice = purchaseAmount - discountAmount;

console.log(`Original: ₹${purchaseAmount}`);
console.log(`Discount: ${discount * 100}%`);
console.log(`Final: ₹${finalPrice}`);
```
</details>

---

## Real-World Examples from Backend

### Example 1: Request Validation
```javascript
function validateCarListing(data) {
  if (!data.brand) {
    return { valid: false, error: "Brand is required" };
  }

  if (!data.model) {
    return { valid: false, error: "Model is required" };
  }

  if (data.year < 1990 || data.year > new Date().getFullYear()) {
    return { valid: false, error: "Invalid year" };
  }

  if (data.price <= 0) {
    return { valid: false, error: "Price must be greater than 0" };
  }

  return { valid: true };
}
```

### Example 2: Permission Check
```javascript
function canEditCar(car, user) {
  // Admin can edit any car
  if (user.role === 'admin') {
    return true;
  }

  // Owner can edit their car
  if (car.sellerId === user.userId) {
    return true;
  }

  // Otherwise, no permission
  return false;
}

// Or shorter with ||
function canEditCar(car, user) {
  return user.role === 'admin' || car.sellerId === user.userId;
}
```

### Example 3: Status Check
```javascript
function getCarStatus(car) {
  if (!car.isActive) {
    return "Inactive";
  }

  if (car.isSold) {
    return "Sold";
  }

  if (car.isVerified === false) {
    return "Pending Verification";
  }

  return "Active";
}
```

---

## Key Takeaways

1. **Use `===` and `!==`** for strict comparison
2. **Falsy values**: `false`, `0`, `""`, `null`, `undefined`, `NaN`
3. **Everything else is truthy** (including `[]`, `{}`)
4. **Ternary operator** for simple conditions
5. **if...else** for complex logic
6. **switch** for multiple specific values
7. **Short-circuit evaluation** with `&&` and `||`
8. **Nullish coalescing (`??`)** for safe defaults
9. **Optional chaining (`?.`)** for safe property access

---

## Next Lesson

**Next**: [04-loops-iteration.md](04-loops-iteration.md) - Learn about loops

---

## Self-Check Questions

1. What's the difference between `==` and `===`?
2. Name all 6 falsy values in JavaScript
3. When should you use `switch` vs `if...else`?
4. What does `0 || 10` return?
5. What does `0 ?? 10` return?
6. What's the difference between `||` and `??`?

Ready for loops? Let's go! 🚀
