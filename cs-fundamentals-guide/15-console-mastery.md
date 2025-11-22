# Lesson 15: Console Mastery

## The Browser Console

The console is your **best friend** for debugging, testing, and understanding how your code works. Mastering it will make you a much more efficient developer.

## Opening the Console

```
Chrome/Edge:     F12 or Ctrl+Shift+J (Windows) / Cmd+Option+J (Mac)
Firefox:         F12 or Ctrl+Shift+K (Windows) / Cmd+Option+K (Mac)
Safari:          Cmd+Option+C (Mac, enable Developer menu first)

Or: Right-click → Inspect → Console tab
```

## Console Methods

### 1. console.log()

**Basic logging**:
```javascript
console.log('Hello, World!');
console.log('User:', 'John', 'Age:', 30);

// Multiple values
console.log('Name:', name, 'Email:', email);

// With template literals
console.log(`User ${name} is ${age} years old`);
```

**Logging objects**:
```javascript
const user = { name: 'John', age: 30, email: 'john@example.com' };

// Bad: shows [object Object]
console.log('User: ' + user);

// Good: shows actual object
console.log('User:', user);
console.log({ user }); // Shows variable name + value
```

**Computed property names** (very useful):
```javascript
// Instead of:
console.log('user:', user);
console.log('posts:', posts);
console.log('comments:', comments);

// Do this:
console.log({ user, posts, comments });
// Output: { user: {...}, posts: [...], comments: [...] }
```

### 2. console.error()

**For errors** (red text, stack trace):
```javascript
console.error('Failed to load user data');
console.error('Error:', error);

// Custom error
try {
  // some code
} catch (error) {
  console.error('Something went wrong:', error);
}
```

### 3. console.warn()

**For warnings** (yellow text):
```javascript
console.warn('This feature is deprecated');
console.warn('Low battery:', batteryLevel);

if (age < 18) {
  console.warn('User is under 18');
}
```

### 4. console.info()

**For informational messages**:
```javascript
console.info('App version: 1.2.3');
console.info('Server connected successfully');
```

### 5. console.table()

**Display arrays/objects as tables** (super useful!):
```javascript
const users = [
  { name: 'John', age: 30, city: 'NY' },
  { name: 'Jane', age: 25, city: 'LA' },
  { name: 'Bob', age: 35, city: 'Chicago' }
];

console.table(users);
```
Output:
```
┌─────────┬────────┬─────┬──────────┐
│ (index) │  name  │ age │   city   │
├─────────┼────────┼─────┼──────────┤
│    0    │ 'John' │ 30  │   'NY'   │
│    1    │ 'Jane' │ 25  │   'LA'   │
│    2    │ 'Bob'  │ 35  │ 'Chicago'│
└─────────┴────────┴─────┴──────────┘
```

**Table with specific columns**:
```javascript
console.table(users, ['name', 'age']); // Show only name and age
```

### 6. console.dir()

**Display object properties** (interactive tree):
```javascript
const element = document.getElementById('myButton');

console.log(element);  // Shows DOM representation
console.dir(element);  // Shows JavaScript object properties
```

### 7. console.group() / console.groupEnd()

**Group related logs**:
```javascript
console.group('User Details');
console.log('Name:', user.name);
console.log('Email:', user.email);
console.log('Age:', user.age);
console.groupEnd();

console.group('API Requests');
console.log('GET /users');
console.log('POST /users');
console.groupEnd();
```

**Collapsed groups**:
```javascript
console.groupCollapsed('Debug Info');
console.log('Variable 1:', var1);
console.log('Variable 2:', var2);
console.groupEnd();
// Group is collapsed by default, click to expand
```

**Nested groups**:
```javascript
console.group('Level 1');
console.log('Level 1 message');

  console.group('Level 2');
  console.log('Level 2 message');

    console.group('Level 3');
    console.log('Level 3 message');
    console.groupEnd();

  console.groupEnd();
console.groupEnd();
```

### 8. console.time() / console.timeEnd()

**Measure execution time**:
```javascript
console.time('Array processing');

// Some code to measure
for (let i = 0; i < 1000000; i++) {
  // process
}

console.timeEnd('Array processing');
// Output: Array processing: 45.678ms
```

**Multiple timers**:
```javascript
console.time('Total');
console.time('Step 1');
// Step 1 code
console.timeEnd('Step 1');

console.time('Step 2');
// Step 2 code
console.timeEnd('Step 2');

console.timeEnd('Total');
```

**Real-world example**:
```javascript
async function fetchUsers() {
  console.time('Fetch Users');

  const response = await fetch('/api/users');
  const users = await response.json();

  console.timeEnd('Fetch Users');
  // Output: Fetch Users: 234.56ms

  return users;
}
```

### 9. console.count() / console.countReset()

**Count function calls**:
```javascript
function processItem(item) {
  console.count('processItem called');
  // process item
}

processItem(1); // processItem called: 1
processItem(2); // processItem called: 2
processItem(3); // processItem called: 3

console.countReset('processItem called');
processItem(4); // processItem called: 1 (reset)
```

**Different counters**:
```javascript
function handleClick(button) {
  console.count(`Button ${button} clicked`);
}

handleClick('A'); // Button A clicked: 1
handleClick('B'); // Button B clicked: 1
handleClick('A'); // Button A clicked: 2
handleClick('A'); // Button A clicked: 3
handleClick('B'); // Button B clicked: 2
```

### 10. console.assert()

**Log only if condition is false**:
```javascript
const age = 15;
console.assert(age >= 18, 'User must be 18 or older');
// If age < 18, logs: Assertion failed: User must be 18 or older

const response = { status: 404 };
console.assert(response.status === 200, 'Expected status 200, got', response.status);

// Multiple assertions
function divide(a, b) {
  console.assert(b !== 0, 'Cannot divide by zero');
  return a / b;
}
```

### 11. console.trace()

**Show stack trace** (how we got here):
```javascript
function third() {
  console.trace('Trace point');
}

function second() {
  third();
}

function first() {
  second();
}

first();
```
Output shows call stack:
```
Trace point
  third @ script.js:2
  second @ script.js:6
  first @ script.js:10
  (anonymous) @ script.js:13
```

### 12. console.clear()

**Clear console**:
```javascript
console.clear();
// Clears all previous console output
```

## Console Styling

### Styled Console Output

**Basic styling**:
```javascript
console.log('%cHello World', 'color: blue; font-size: 20px');
console.log('%cError!', 'color: red; font-weight: bold; font-size: 24px');
console.log('%cSuccess!', 'color: green; background: #dfd; padding: 5px');
```

**Multiple styles**:
```javascript
console.log(
  '%cWarning: %cThis is important!',
  'color: orange; font-weight: bold',
  'color: black; font-style: italic'
);
```

**Complex styling**:
```javascript
console.log(
  '%c  App Started  ',
  'background: linear-gradient(to right, #667eea 0%, #764ba2 100%); ' +
  'color: white; ' +
  'font-size: 16px; ' +
  'font-weight: bold; ' +
  'padding: 10px 20px; ' +
  'border-radius: 5px'
);
```

**Creative console art**:
```javascript
console.log('%c🚀 App Version 1.0.0', 'font-size: 20px');

console.log(
  '%c STOP! ',
  'color: white; background: red; font-size: 40px; font-weight: bold; padding: 10px'
);
console.log(
  '%c This is a browser feature intended for developers. ',
  'font-size: 16px'
);
```

## Advanced Console Techniques

### 1. Conditional Logging

**Only log in development**:
```javascript
const DEBUG = true; // or process.env.NODE_ENV !== 'production'

function debugLog(...args) {
  if (DEBUG) {
    console.log(...args);
  }
}

debugLog('This only logs in development');
```

**Log levels**:
```javascript
const LogLevel = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

let currentLevel = LogLevel.DEBUG;

const logger = {
  error: (...args) => currentLevel >= LogLevel.ERROR && console.error(...args),
  warn: (...args) => currentLevel >= LogLevel.WARN && console.warn(...args),
  info: (...args) => currentLevel >= LogLevel.INFO && console.info(...args),
  debug: (...args) => currentLevel >= LogLevel.DEBUG && console.log(...args)
};

// Usage
logger.error('Critical error');
logger.warn('Warning message');
logger.info('Info message');
logger.debug('Debug details');

// Change level
currentLevel = LogLevel.WARN; // Now only errors and warnings log
```

### 2. Performance Monitoring

```javascript
// Measure performance
function measurePerformance(fn, label) {
  console.time(label);
  const result = fn();
  console.timeEnd(label);
  return result;
}

// Usage
const result = measurePerformance(() => {
  return array.map(x => x * 2).filter(x => x > 10);
}, 'Array operations');
```

### 3. Object Inspection

```javascript
// Deep clone check
const original = { a: 1, b: { c: 2 } };
const clone = JSON.parse(JSON.stringify(original));

console.log('Original:', original);
console.log('Clone:', clone);
console.log('Are same?', original === clone); // false
console.log('Deep equal?', JSON.stringify(original) === JSON.stringify(clone)); // true
```

### 4. API Response Debugging

```javascript
async function fetchAndLog(url) {
  console.group(`🌐 Fetching: ${url}`);
  console.time('Request time');

  try {
    const response = await fetch(url);

    console.log('Status:', response.status);
    console.log('Headers:', [...response.headers.entries()]);

    const data = await response.json();
    console.timeEnd('Request time');

    console.log('Response:', data);
    console.table(Array.isArray(data) ? data : [data]);

    console.groupEnd();
    return data;

  } catch (error) {
    console.timeEnd('Request time');
    console.error('Fetch failed:', error);
    console.groupEnd();
    throw error;
  }
}

// Usage
fetchAndLog('https://api.example.com/users');
```

### 5. Function Call Tracking

```javascript
function trackCalls(fn, name) {
  return function(...args) {
    console.group(`📞 ${name} called`);
    console.log('Arguments:', args);
    console.time(`${name} execution`);

    const result = fn.apply(this, args);

    console.timeEnd(`${name} execution`);
    console.log('Result:', result);
    console.groupEnd();

    return result;
  };
}

// Usage
const add = trackCalls((a, b) => a + b, 'add');
add(5, 3);
// Output:
// 📞 add called
//   Arguments: [5, 3]
//   add execution: 0.01ms
//   Result: 8
```

## Console Shortcuts & Tips

### 1. Quick Access to Last Result

```javascript
// Type in console:
2 + 2
// Output: 4

$_
// Output: 4 (last result)

// Use in calculations:
$_ * 2
// Output: 8
```

### 2. Quick Element Selection

```javascript
// In console:
$('button')          // Same as document.querySelector('button')
$$('button')         // Same as document.querySelectorAll('button')
$0                   // Currently selected element in Elements tab
$1                   // Previously selected element
$2                   // Element selected before that
```

### 3. Monitor Events

```javascript
// Monitor all events on element
monitorEvents(document.body);
// Now click, scroll, etc. and see events logged

// Monitor specific events
monitorEvents(document.body, ['click', 'scroll']);

// Stop monitoring
unmonitorEvents(document.body);
```

### 4. Monitor Function Calls

```javascript
// Log when function is called
monitor(myFunction);

// Now every time myFunction is called:
// function myFunction called with arguments: [arg1, arg2]

// Stop monitoring
unmonitor(myFunction);
```

### 5. Copy to Clipboard

```javascript
// Copy any value to clipboard
copy({ name: 'John', age: 30 });
// Object copied to clipboard as JSON

copy($$('a')); // Copy all links
```

### 6. Get Event Listeners

```javascript
// Get all event listeners on element
getEventListeners(document.getElementById('myButton'));

// Output:
// {
//   click: [{ listener: function, useCapture: false, ... }],
//   mouseenter: [{ listener: function, useCapture: false, ... }]
// }
```

## Debugging with Console

### 1. Debugging Variables

```javascript
function calculateTotal(items) {
  console.log('Input:', { items });

  const subtotal = items.reduce((sum, item) => {
    console.log('Processing item:', item);
    return sum + item.price * item.quantity;
  }, 0);
  console.log('Subtotal:', subtotal);

  const tax = subtotal * 0.1;
  console.log('Tax:', tax);

  const total = subtotal + tax;
  console.log('Total:', total);

  return total;
}
```

### 2. Debugging API Calls

```javascript
async function loginUser(email, password) {
  console.group('🔐 Login Attempt');
  console.log('Email:', email);
  console.log('Password:', '*'.repeat(password.length));
  console.time('Login time');

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      console.error('Login failed:', response.statusText);
      throw new Error('Login failed');
    }

    const data = await response.json();
    console.log('Login successful:', data);
    console.timeEnd('Login time');
    console.groupEnd();

    return data;

  } catch (error) {
    console.error('Login error:', error);
    console.timeEnd('Login time');
    console.groupEnd();
    throw error;
  }
}
```

### 3. Debugging State Changes

```javascript
let state = { count: 0, user: null };

function setState(newState) {
  console.group('📊 State Update');
  console.log('Old state:', state);
  console.log('New values:', newState);

  state = { ...state, ...newState };

  console.log('New state:', state);
  console.groupEnd();
}

// Usage
setState({ count: 1 });
setState({ user: { name: 'John' } });
```

## Console Best Practices

### 1. Remove Console Logs in Production

```javascript
// Development
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info');
}

// Or use a build tool to remove console.log automatically
```

### 2. Use Meaningful Labels

```javascript
// Bad
console.log(user);

// Good
console.log('Current user:', user);
console.log({ user }); // Shows variable name
```

### 3. Use Appropriate Methods

```javascript
// Use console.error for errors
console.error('Failed to save user');

// Use console.warn for warnings
console.warn('Deprecated API used');

// Use console.info for info
console.info('App initialized');

// Use console.log for general debugging
console.log('Variable value:', value);
```

### 4. Group Related Logs

```javascript
// Instead of:
console.log('Request started');
console.log('URL:', url);
console.log('Method:', method);
console.log('Request complete');

// Do this:
console.group('API Request');
console.log('URL:', url);
console.log('Method:', method);
console.groupEnd();
```

### 5. Use console.table for Arrays

```javascript
// Instead of:
users.forEach(user => console.log(user));

// Do this:
console.table(users);
```

## Console Exercises

### Exercise 1: Debug a Function

```javascript
// This function has bugs. Use console to find them:
function calculateDiscount(price, discountPercent) {
  const discount = price * discountPercent;
  const finalPrice = price - discount;
  return finalPrice;
}

// Test
console.log(calculateDiscount(100, 20)); // Expected: 80, Got: ?

// Add console logs to debug
function calculateDiscount(price, discountPercent) {
  console.log('Input:', { price, discountPercent });

  const discount = price * discountPercent;
  console.log('Discount:', discount); // Bug found! Should divide by 100

  const finalPrice = price - discount;
  console.log('Final price:', finalPrice);

  return finalPrice;
}
```

### Exercise 2: Track Performance

```javascript
// Measure performance of different array methods
const arr = Array.from({ length: 10000 }, (_, i) => i);

console.time('for loop');
let sum1 = 0;
for (let i = 0; i < arr.length; i++) {
  sum1 += arr[i];
}
console.timeEnd('for loop');

console.time('forEach');
let sum2 = 0;
arr.forEach(n => sum2 += n);
console.timeEnd('forEach');

console.time('reduce');
const sum3 = arr.reduce((a, b) => a + b, 0);
console.timeEnd('reduce');
```

### Exercise 3: Debug API Calls

```javascript
// Add comprehensive logging to this API function
async function getUser(id) {
  // Your code here with console logging
  const response = await fetch(`/api/users/${id}`);
  const user = await response.json();
  return user;
}
```

## Key Takeaways

1. **console.log()** is just the beginning - use all console methods
2. **console.table()** is amazing for arrays and objects
3. **console.group()** organizes related logs
4. **console.time()** measures performance
5. **Style your logs** with %c for better visibility
6. **Use appropriate methods** (error, warn, info, log)
7. **Remove logs in production** or use conditional logging
8. **Console shortcuts** ($0, $_, $$) speed up debugging

## Next Steps

In [Lesson 16: Network Debugging](./16-network-debugging.md), we'll learn:
- Network tab in DevTools
- Analyzing requests and responses
- Performance timing
- Network throttling

---

**Practice**: Open any website, open console (F12), and try all console methods!
