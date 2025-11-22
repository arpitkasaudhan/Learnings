# Lesson 18: Best Practices

## 🎯 Learning Objectives
- Write clean JavaScript
- Follow naming conventions
- Avoid common mistakes
- Optimize performance

---

## Naming Conventions

```javascript
// ✅ Good
const MAX_USERS = 100;         // Constants: UPPER_SNAKE_CASE
const userName = "John";       // Variables: camelCase
function getUserData() {}      // Functions: camelCase
class UserService {}           // Classes: PascalCase

// ❌ Bad
const max_users = 100;
const UserName = "John";
function get_user_data() {}
class userService {}
```

---

## Use const/let, not var

```javascript
// ✅ Good
const API_URL = "http://api.example.com";
let counter = 0;

// ❌ Bad
var apiUrl = "http://api.example.com";
var counter = 0;
```

---

## Arrow Functions for Callbacks

```javascript
// ✅ Good
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);

// ❌ Bad (unnecessary function keyword)
const doubled = numbers.map(function(n) {
  return n * 2;
});
```

---

## Use Template Literals

```javascript
const name = "John";
const age = 25;

// ✅ Good
const message = `Hello, I'm ${name} and I'm ${age} years old`;

// ❌ Bad
const message = "Hello, I'm " + name + " and I'm " + age + " years old";
```

---

## Destructuring

```javascript
// ✅ Good
const { brand, model, price } = car;
const [first, second] = array;

// ❌ Bad
const brand = car.brand;
const model = car.model;
const price = car.price;
```

---

## Always Use ===

```javascript
// ✅ Good
if (value === 5) {}
if (value !== null) {}

// ❌ Bad (type coercion)
if (value == 5) {}
if (value != null) {}
```

---

## Handle Errors

```javascript
// ✅ Good
async function fetchData() {
  try {
    const response = await api.get('/data');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch:", error);
    throw error;
  }
}

// ❌ Bad (no error handling)
async function fetchData() {
  const response = await api.get('/data');
  return response.data;
}
```

---

## Key Takeaways

1. **Consistent naming** conventions
2. **Use const/let** not var
3. **Use ===** not ==
4. **Handle errors** always
5. **Use modern syntax** (ES6+)

**Next**: [19-real-world-examples.md](19-real-world-examples.md)
