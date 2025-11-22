# Lesson 11: Browser Storage Mechanisms

## Overview of Browser Storage

Modern browsers provide multiple ways to store data on the client side. Each storage mechanism has different characteristics, use cases, and limitations.

```
Browser Storage Types:
├── Cookies
├── Session Storage
├── Local Storage
├── IndexedDB
├── Cache API
└── WebSQL (Deprecated)
```

## 1. Cookies

### What are Cookies?

Cookies are small pieces of data (max 4KB) stored by the browser and sent with **every HTTP request** to the same domain.

### Cookie Characteristics

```
Size Limit:       4KB per cookie
Expiration:       Can be set (session or persistent)
Accessibility:    JavaScript + Server
Sent to Server:   YES (with every request)
Storage Location: Browser storage
Per Domain Limit: ~50 cookies
Total Limit:      ~3000 cookies total
```

### Creating Cookies

**JavaScript**:
```javascript
// Set a simple cookie
document.cookie = "username=john";

// Set cookie with expiration
const d = new Date();
d.setTime(d.getTime() + (7*24*60*60*1000)); // 7 days
document.cookie = `username=john; expires=${d.toUTCString()}; path=/`;

// Set cookie with all options
document.cookie = "sessionToken=abc123; " +
  "expires=Wed, 31 Dec 2025 23:59:59 GMT; " +
  "path=/; " +
  "domain=.example.com; " +
  "secure; " +
  "SameSite=Strict";

// Helper function to set cookies
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + d.toUTCString();
  document.cookie = `${name}=${value}; ${expires}; path=/`;
}

// Usage
setCookie('theme', 'dark', 30); // Expires in 30 days
```

**Server-Side (HTTP Response Header)**:
```http
Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Strict; Max-Age=3600
```

### Reading Cookies

```javascript
// Get all cookies (returns string)
console.log(document.cookie);
// Output: "username=john; theme=dark; sessionId=abc123"

// Helper function to get specific cookie
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Usage
const username = getCookie('username');
console.log(username); // "john"
```

### Deleting Cookies

```javascript
// Delete by setting expiration to past
document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

// Helper function
function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

// Usage
deleteCookie('username');
```

### Cookie Attributes

**Expires/Max-Age**:
```javascript
// Expires (specific date)
document.cookie = "user=john; expires=Wed, 31 Dec 2025 23:59:59 GMT";

// Max-Age (seconds from now)
document.cookie = "user=john; max-age=3600"; // 1 hour
```

**Path**:
```javascript
// Cookie available only under /admin
document.cookie = "adminToken=xyz; path=/admin";

// Cookie available site-wide
document.cookie = "theme=dark; path=/";
```

**Domain**:
```javascript
// Cookie for subdomain
document.cookie = "user=john; domain=.example.com";
// Works on: example.com, www.example.com, api.example.com
```

**Secure** (HTTPS only):
```javascript
document.cookie = "token=abc123; secure";
// Only sent over HTTPS connections
```

**HttpOnly** (Server-side only, not accessible via JavaScript):
```http
Set-Cookie: sessionId=abc123; HttpOnly
```
```javascript
// JavaScript CANNOT read HttpOnly cookies (security feature)
// Protects against XSS attacks
```

**SameSite** (CSRF protection):
```javascript
// Strict - Never sent on cross-site requests
document.cookie = "token=abc; SameSite=Strict";

// Lax - Sent on top-level navigation
document.cookie = "token=abc; SameSite=Lax";

// None - Always sent (requires Secure)
document.cookie = "token=abc; SameSite=None; Secure";
```

### Use Cases for Cookies

1. **Authentication/Session Management**
```javascript
// Server sets session cookie
Set-Cookie: sessionId=xyz789; HttpOnly; Secure; SameSite=Strict
```

2. **User Preferences**
```javascript
setCookie('theme', 'dark', 365);
setCookie('language', 'en', 365);
```

3. **Analytics/Tracking**
```javascript
setCookie('userId', 'u123', 365);
setCookie('visitCount', '5', 30);
```

4. **Shopping Cart (small data)**
```javascript
setCookie('cartItemCount', '3', 7);
```

### Viewing Cookies in DevTools

```
Chrome DevTools:
1. F12 → Application Tab
2. Storage → Cookies
3. Select your domain
4. See all cookies with their values and attributes

You can:
- View cookie values
- Edit cookies
- Delete individual cookies
- Clear all cookies
```

---

## 2. Session Storage

### What is Session Storage?

Session Storage stores data for the duration of the page session. Data is cleared when the tab is closed.

### Session Storage Characteristics

```
Size Limit:       5-10MB
Expiration:       When tab closes
Accessibility:    JavaScript only
Sent to Server:   NO
Scope:            Per tab/window
Persistence:      Session only
```

### Using Session Storage

**Set Item**:
```javascript
// Store string
sessionStorage.setItem('username', 'john');

// Store number
sessionStorage.setItem('userId', '123');

// Store object (must stringify)
const user = { name: 'John', age: 30 };
sessionStorage.setItem('user', JSON.stringify(user));
```

**Get Item**:
```javascript
// Get string
const username = sessionStorage.getItem('username');
console.log(username); // "john"

// Get object (must parse)
const userStr = sessionStorage.getItem('user');
const user = JSON.parse(userStr);
console.log(user.name); // "John"
```

**Remove Item**:
```javascript
// Remove specific item
sessionStorage.removeItem('username');

// Clear all items
sessionStorage.clear();
```

**Check if Item Exists**:
```javascript
if (sessionStorage.getItem('username') !== null) {
  console.log('Username exists');
}
```

**Get All Keys**:
```javascript
// Get all keys
for (let i = 0; i < sessionStorage.length; i++) {
  const key = sessionStorage.key(i);
  console.log(key, sessionStorage.getItem(key));
}

// Or using Object.keys
Object.keys(sessionStorage).forEach(key => {
  console.log(key, sessionStorage.getItem(key));
});
```

### Use Cases for Session Storage

1. **Form Data (during session)**
```javascript
// Save form progress
function saveFormData() {
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value
  };
  sessionStorage.setItem('formData', JSON.stringify(formData));
}

// Restore form data
function restoreFormData() {
  const formData = JSON.parse(sessionStorage.getItem('formData'));
  if (formData) {
    document.getElementById('name').value = formData.name;
    document.getElementById('email').value = formData.email;
  }
}
```

2. **Wizard/Multi-step Forms**
```javascript
// Step 1
sessionStorage.setItem('step1', JSON.stringify({ address: '123 Main St' }));

// Step 2
sessionStorage.setItem('step2', JSON.stringify({ payment: 'credit' }));

// Final step - retrieve all
const step1 = JSON.parse(sessionStorage.getItem('step1'));
const step2 = JSON.parse(sessionStorage.getItem('step2'));
```

3. **Temporary Authentication State**
```javascript
// After login
sessionStorage.setItem('isLoggedIn', 'true');
sessionStorage.setItem('userRole', 'admin');

// Check authentication
function isAuthenticated() {
  return sessionStorage.getItem('isLoggedIn') === 'true';
}
```

4. **Page State**
```javascript
// Save scroll position
window.addEventListener('scroll', () => {
  sessionStorage.setItem('scrollPos', window.scrollY);
});

// Restore scroll position
window.addEventListener('load', () => {
  const scrollPos = sessionStorage.getItem('scrollPos');
  if (scrollPos) window.scrollTo(0, parseInt(scrollPos));
});
```

---

## 3. Local Storage

### What is Local Storage?

Local Storage stores data persistently with **no expiration**. Data persists even after browser is closed.

### Local Storage Characteristics

```
Size Limit:       5-10MB
Expiration:       Never (until manually deleted)
Accessibility:    JavaScript only
Sent to Server:   NO
Scope:            Per origin (protocol + domain + port)
Persistence:      Permanent
```

### Using Local Storage

**API is identical to Session Storage**:
```javascript
// Set
localStorage.setItem('theme', 'dark');
localStorage.setItem('user', JSON.stringify({ name: 'John' }));

// Get
const theme = localStorage.getItem('theme');
const user = JSON.parse(localStorage.getItem('user'));

// Remove
localStorage.removeItem('theme');

// Clear all
localStorage.clear();

// Get number of items
console.log(localStorage.length);

// Iterate
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  console.log(key, localStorage.getItem(key));
}
```

### Use Cases for Local Storage

1. **User Preferences**
```javascript
// Save theme
function setTheme(theme) {
  localStorage.setItem('theme', theme);
  document.body.className = theme;
}

// Load theme on page load
window.addEventListener('load', () => {
  const theme = localStorage.getItem('theme') || 'light';
  setTheme(theme);
});
```

2. **Cache API Responses**
```javascript
async function getUsers() {
  // Check cache first
  const cached = localStorage.getItem('users');
  const cacheTime = localStorage.getItem('users_timestamp');

  // If cached and not expired (1 hour)
  if (cached && Date.now() - parseInt(cacheTime) < 3600000) {
    return JSON.parse(cached);
  }

  // Fetch fresh data
  const response = await fetch('/api/users');
  const users = await response.json();

  // Cache it
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('users_timestamp', Date.now().toString());

  return users;
}
```

3. **Shopping Cart**
```javascript
// Add to cart
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
}

// Get cart
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

// Remove from cart
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
}
```

4. **Recently Viewed Items**
```javascript
function addToRecentlyViewed(item) {
  let recent = JSON.parse(localStorage.getItem('recentlyViewed')) || [];

  // Remove if already exists
  recent = recent.filter(r => r.id !== item.id);

  // Add to beginning
  recent.unshift(item);

  // Keep only last 10
  recent = recent.slice(0, 10);

  localStorage.setItem('recentlyViewed', JSON.stringify(recent));
}
```

5. **Remember Me (Username)**
```javascript
// Save username (NOT password!)
function rememberUsername(username) {
  if (document.getElementById('rememberMe').checked) {
    localStorage.setItem('savedUsername', username);
  } else {
    localStorage.removeItem('savedUsername');
  }
}

// Load saved username
window.addEventListener('load', () => {
  const savedUsername = localStorage.getItem('savedUsername');
  if (savedUsername) {
    document.getElementById('username').value = savedUsername;
    document.getElementById('rememberMe').checked = true;
  }
});
```

### Storage Events

**Listen for storage changes** (in other tabs/windows):
```javascript
window.addEventListener('storage', (e) => {
  console.log('Storage changed!');
  console.log('Key:', e.key);
  console.log('Old Value:', e.oldValue);
  console.log('New Value:', e.newValue);
  console.log('URL:', e.url);

  // React to changes
  if (e.key === 'theme') {
    setTheme(e.newValue);
  }
});

// Note: Storage event only fires in OTHER tabs,
// not in the tab that made the change
```

---

## 4. IndexedDB

### What is IndexedDB?

IndexedDB is a **low-level API** for client-side storage of significant amounts of **structured data**, including files/blobs.

### IndexedDB Characteristics

```
Size Limit:       50MB+ (browser dependent, can be much larger)
Expiration:       Never (until manually deleted)
Accessibility:    JavaScript only (async API)
Sent to Server:   NO
Data Structure:   Object stores (like NoSQL database)
Indexing:         Yes (can create indexes)
Transactions:     Yes (ACID compliant)
```

### Basic IndexedDB Operations

**1. Open Database**:
```javascript
let db;

const request = indexedDB.open('MyDatabase', 1);

request.onerror = () => {
  console.error('Database failed to open');
};

request.onsuccess = () => {
  db = request.result;
  console.log('Database opened successfully');
};

request.onupgradeneeded = (e) => {
  db = e.target.result;

  // Create object store (like a table)
  const objectStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });

  // Create indexes
  objectStore.createIndex('name', 'name', { unique: false });
  objectStore.createIndex('email', 'email', { unique: true });

  console.log('Database setup complete');
};
```

**2. Add Data**:
```javascript
function addUser(user) {
  const transaction = db.transaction(['users'], 'readwrite');
  const objectStore = transaction.objectStore('users');
  const request = objectStore.add(user);

  request.onsuccess = () => {
    console.log('User added:', request.result);
  };

  request.onerror = () => {
    console.error('Error adding user');
  };
}

// Usage
addUser({ name: 'John', email: 'john@example.com', age: 30 });
```

**3. Get Data**:
```javascript
function getUser(id) {
  const transaction = db.transaction(['users'], 'readonly');
  const objectStore = transaction.objectStore('users');
  const request = objectStore.get(id);

  request.onsuccess = () => {
    console.log('User:', request.result);
  };
}
```

**4. Get All Data**:
```javascript
function getAllUsers() {
  const transaction = db.transaction(['users'], 'readonly');
  const objectStore = transaction.objectStore('users');
  const request = objectStore.getAll();

  request.onsuccess = () => {
    console.log('All users:', request.result);
  };
}
```

**5. Update Data**:
```javascript
function updateUser(id, updates) {
  const transaction = db.transaction(['users'], 'readwrite');
  const objectStore = transaction.objectStore('users');

  // Get existing user
  const getRequest = objectStore.get(id);

  getRequest.onsuccess = () => {
    const user = getRequest.result;

    // Update fields
    Object.assign(user, updates);

    // Put back
    const updateRequest = objectStore.put(user);
    updateRequest.onsuccess = () => {
      console.log('User updated');
    };
  };
}

// Usage
updateUser(1, { age: 31 });
```

**6. Delete Data**:
```javascript
function deleteUser(id) {
  const transaction = db.transaction(['users'], 'readwrite');
  const objectStore = transaction.objectStore('users');
  const request = objectStore.delete(id);

  request.onsuccess = () => {
    console.log('User deleted');
  };
}
```

**7. Search by Index**:
```javascript
function getUserByEmail(email) {
  const transaction = db.transaction(['users'], 'readonly');
  const objectStore = transaction.objectStore('users');
  const index = objectStore.index('email');
  const request = index.get(email);

  request.onsuccess = () => {
    console.log('User:', request.result);
  };
}

// Usage
getUserByEmail('john@example.com');
```

### Use Cases for IndexedDB

1. **Offline-First Applications**
2. **Large Datasets** (catalogs, product listings)
3. **Media Storage** (images, videos, audio files)
4. **Progressive Web Apps (PWA)**
5. **Complex Data Structures**

### Simplified IndexedDB with Wrapper Libraries

**Using Dexie.js (popular wrapper)**:
```javascript
// Much easier than raw IndexedDB!
const db = new Dexie('MyDatabase');

db.version(1).stores({
  users: '++id, name, email, age'
});

// Add
await db.users.add({ name: 'John', email: 'john@example.com', age: 30 });

// Get all
const users = await db.users.toArray();

// Get by ID
const user = await db.users.get(1);

// Update
await db.users.update(1, { age: 31 });

// Delete
await db.users.delete(1);

// Query
const adults = await db.users.where('age').above(18).toArray();
```

---

## 5. Cache API

### What is Cache API?

Cache API is used by **Service Workers** to cache network requests for offline access.

### Cache API Operations

```javascript
// Open cache
const cache = await caches.open('my-cache-v1');

// Add to cache
await cache.add('/index.html');
await cache.addAll(['/styles.css', '/script.js', '/image.png']);

// Fetch from cache
const response = await cache.match('/index.html');

// Put custom response in cache
await cache.put(request, response);

// Delete from cache
await cache.delete('/index.html');

// Delete entire cache
await caches.delete('my-cache-v1');

// Get all cache names
const cacheNames = await caches.keys();
```

### Use Cases for Cache API

1. **Service Workers**
2. **Offline functionality**
3. **Performance optimization**
4. **Progressive Web Apps**

---

## Storage Comparison Table

| Feature | Cookies | Session Storage | Local Storage | IndexedDB | Cache API |
|---------|---------|----------------|---------------|-----------|-----------|
| **Size Limit** | 4KB | 5-10MB | 5-10MB | 50MB+ | Large |
| **Expiration** | Configurable | Tab close | Never | Never | Manual |
| **Sent to Server** | Yes | No | No | No | No |
| **Scope** | Domain | Tab | Origin | Origin | Origin |
| **Data Type** | String | String | String | Any | Response objects |
| **Async** | No | No | No | Yes | Yes |
| **Use Case** | Auth, tracking | Temp data | Preferences | Large data | Offline cache |

## Viewing Storage in DevTools

```
Chrome DevTools (F12):
1. Application Tab
2. Storage Section:
   - Local Storage
   - Session Storage
   - IndexedDB
   - Cookies
   - Cache Storage

You can:
- View all stored data
- Edit values
- Delete items
- Clear storage
- Check storage quota
```

## Best Practices

1. **Always check if storage is available**
```javascript
function storageAvailable(type) {
  try {
    const storage = window[type];
    const test = '__storage_test__';
    storage.setItem(test, test);
    storage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

if (storageAvailable('localStorage')) {
  // Use localStorage
} else {
  // Fallback to cookies or warn user
}
```

2. **Handle quota exceeded errors**
```javascript
try {
  localStorage.setItem('key', 'value');
} catch (e) {
  if (e.name === 'QuotaExceededError') {
    console.error('Storage quota exceeded!');
    // Clear old data or notify user
  }
}
```

3. **Always validate data from storage**
```javascript
// Don't trust stored data
const userData = localStorage.getItem('user');
if (userData) {
  try {
    const user = JSON.parse(userData);
    if (user && typeof user === 'object') {
      // Use user data
    }
  } catch (e) {
    console.error('Invalid user data in storage');
    localStorage.removeItem('user');
  }
}
```

## Next Steps

In [Lesson 12: Memory Management](./12-memory-management.md), we'll learn:
- JavaScript memory model
- Heap vs Stack
- Garbage collection
- Memory leaks and how to prevent them

---

**Practice**: Open DevTools and explore the storage in your favorite websites!
