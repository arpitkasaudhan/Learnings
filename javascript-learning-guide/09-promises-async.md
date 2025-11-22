# Lesson 9: Promises and Async/Await

## 🎯 Learning Objectives
- Understand asynchronous JavaScript
- Master Promises
- Use async/await syntax
- Handle errors properly
- Work with multiple promises

---

## Why Asynchronous?

JavaScript is single-threaded. Async code allows non-blocking operations.

```javascript
// Synchronous (blocking)
console.log("Start");
// Wait 2 seconds (blocks everything!)
console.log("End");

// Asynchronous (non-blocking)
console.log("Start");
setTimeout(() => {
  console.log("After 2 seconds");
}, 2000);
console.log("End");

// Output:
// Start
// End
// After 2 seconds
```

---

## Promises

A Promise represents a future value.

```javascript
// Creating a Promise
const myPromise = new Promise((resolve, reject) => {
  // Async operation
  const success = true;
  
  if (success) {
    resolve("Success!");
  } else {
    reject("Error!");
  }
});

// Using a Promise
myPromise
  .then(result => {
    console.log(result);  // Success!
  })
  .catch(error => {
    console.log(error);
  });
```

---

## Promise States

```javascript
// Pending: Initial state
// Fulfilled: Operation completed successfully
// Rejected: Operation failed

const promise = new Promise((resolve, reject) => {
  // Pending...
  
  setTimeout(() => {
    resolve("Done!");  // Fulfilled
    // OR
    // reject("Error!"); // Rejected
  }, 1000);
});
```

---

## Async/Await (Modern Way)

```javascript
// Without async/await
function fetchUser() {
  return fetch('/api/user')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      return data;
    })
    .catch(error => {
      console.error(error);
    });
}

// With async/await (cleaner!)
async function fetchUser() {
  try {
    const response = await fetch('/api/user');
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}
```

---

## Real Examples from Your Backend

### Service Method

```javascript
async function sendOTP(phone) {
  try {
    // Generate OTP
    const otp = generateOTP();
    
    // Save to database (await)
    await OTPModel.create({ phone, otp });
    
    // Send SMS (await)
    await SMSService.sendOTP(phone, otp);
    
    return { success: true, message: 'OTP sent' };
  } catch (error) {
    throw new Error('Failed to send OTP');
  }
}
```

### Controller Method

```javascript
async function getCars(req, res, next) {
  try {
    // Await service call
    const cars = await CarService.getCars(query);
    
    res.status(200).json({
      success: true,
      data: cars
    });
  } catch (error) {
    next(error);
  }
}
```

### Multiple Promises

```javascript
// Sequential (slower)
const user = await UserModel.findById(id);
const cars = await CarModel.find({ userId: id });
const leads = await LeadModel.find({ userId: id });

// Parallel (faster!)
const [user, cars, leads] = await Promise.all([
  UserModel.findById(id),
  CarModel.find({ userId: id }),
  LeadModel.find({ userId: id })
]);
```

---

## Promise Methods

```javascript
// Promise.all - Wait for all
const results = await Promise.all([
  fetchUsers(),
  fetchCars(),
  fetchLeads()
]);

// Promise.race - First to finish
const first = await Promise.race([
  fetchFromAPI1(),
  fetchFromAPI2()
]);

// Promise.allSettled - Wait for all, even if some fail
const results = await Promise.allSettled([
  fetchData1(),
  fetchData2(),
  fetchData3()
]);
```

---

## Error Handling

```javascript
// Try-catch
async function getData() {
  try {
    const data = await fetchData();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;  // Re-throw if needed
  } finally {
    console.log('Cleanup');  // Always runs
  }
}

// Promise catch
fetchData()
  .then(data => console.log(data))
  .catch(error => console.error(error))
  .finally(() => console.log('Done'));
```

---

## Common Patterns

### Pattern 1: Retry Logic

```javascript
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url);
    } catch (error) {
      if (i === retries - 1) throw error;
      await delay(1000 * (i + 1));  // Exponential backoff
    }
  }
}
```

### Pattern 2: Timeout

```javascript
function timeout(promise, ms) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), ms);
  });
  
  return Promise.race([promise, timeoutPromise]);
}

// Usage
await timeout(fetchData(), 5000);  // 5 second timeout
```

---

## Practice Exercises

### Exercise 1: Create Promise
Create a promise that resolves after 2 seconds with "Success!".

<details>
<summary>Solution</summary>

```javascript
const myPromise = new Promise((resolve) => {
  setTimeout(() => {
    resolve("Success!");
  }, 2000);
});

myPromise.then(result => console.log(result));

// Or with async/await
async function test() {
  const result = await myPromise;
  console.log(result);
}
```
</details>

---

## Key Takeaways

1. **Promises represent future values**
2. **Async/await makes async code look sync**
3. **Always use try-catch with async/await**
4. **await only works inside async functions**
5. **Promise.all for parallel operations**
6. **Your entire backend uses async/await!**

**Next Lesson**: [10-modules.md](10-modules.md)

This is how your backend works! 🚀
