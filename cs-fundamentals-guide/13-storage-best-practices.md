# Lesson 13: Storage Best Practices

## When to Use Each Storage Type

### Storage Comparison Chart

| Feature | Cookies | Session Storage | Local Storage | IndexedDB | Cache API |
|---------|---------|----------------|---------------|-----------|-----------|
| **Size** | 4KB | 5-10MB | 5-10MB | 50MB+ | Large |
| **Lifetime** | Configurable | Tab close | Forever | Forever | Manual |
| **Server Access** | Yes (auto-sent) | No | No | No | No |
| **Performance** | Medium | Fast | Fast | Fast (async) | Very Fast |
| **Security** | Medium | High | High | High | High |
| **Use Case** | Auth tokens | Temp data | Preferences | Large datasets | Offline assets |

### Decision Tree

```
Need to send data to server with every request?
├─ YES → Use Cookies (HttpOnly for sensitive data)
└─ NO
    │
    Need data only for current tab/session?
    ├─ YES → Use Session Storage
    └─ NO
        │
        Storing large amounts of data (>10MB)?
        ├─ YES → Use IndexedDB
        └─ NO
            │
            Caching network responses for offline?
            ├─ YES → Use Cache API
            └─ NO → Use Local Storage
```

### Use Case Guide

#### Use Cookies For:

```javascript
✓ Authentication tokens
✓ Session IDs
✓ User preferences needed on server
✓ Tracking/Analytics
✓ A/B test assignments
✓ CSRF tokens

Examples:
- Login session management
- Remember me functionality
- Server-side personalization
- Shopping cart (if server needs it)
```

**Example**:
```javascript
// Authentication cookie (set by server)
Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Strict; Max-Age=3600

// Preference cookie (set by client)
document.cookie = "theme=dark; path=/; max-age=31536000";  // 1 year
```

#### Use Session Storage For:

```javascript
✓ Multi-step forms (wizard)
✓ Temporary UI state
✓ Draft content (before saving)
✓ Shopping session data
✓ One-time messages
✓ Tab-specific data

Examples:
- Form progress in checkout flow
- Filters/sorting in current tab
- Unsaved editor content
- Temporary authentication state
```

**Example**:
```javascript
// Multi-step form
// Step 1: Personal Info
sessionStorage.setItem('checkoutStep1', JSON.stringify({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '555-0123'
}));

// Step 2: Shipping Address
sessionStorage.setItem('checkoutStep2', JSON.stringify({
  address: '123 Main St',
  city: 'New York',
  zip: '10001'
}));

// Step 3: Review & Submit
const step1 = JSON.parse(sessionStorage.getItem('checkoutStep1'));
const step2 = JSON.parse(sessionStorage.getItem('checkoutStep2'));
// Submit order...
sessionStorage.clear();  // Clear after submission
```

#### Use Local Storage For:

```javascript
✓ User preferences (theme, language)
✓ Settings
✓ Non-sensitive user data
✓ Cached API responses (with TTL)
✓ Application state
✓ Recently viewed items

Examples:
- Dark/light theme preference
- Language selection
- UI layout preferences
- Shopping cart (client-side only)
- Recent searches
```

**Example**:
```javascript
// User preferences
const preferences = {
  theme: 'dark',
  language: 'en',
  fontSize: 'medium',
  notifications: true
};
localStorage.setItem('userPreferences', JSON.stringify(preferences));

// Load on page load
window.addEventListener('load', () => {
  const prefs = JSON.parse(localStorage.getItem('userPreferences') || '{}');
  applyTheme(prefs.theme);
  setLanguage(prefs.language);
});
```

#### Use IndexedDB For:

```javascript
✓ Large datasets (>10MB)
✓ Structured data with queries
✓ Offline-first applications
✓ Binary data (files, blobs)
✓ Complex data relationships
✓ PWA data storage

Examples:
- Email client (offline emails)
- Note-taking app (offline notes)
- Photo gallery (image metadata)
- E-commerce catalog (offline browsing)
- Game state and assets
```

**Example**:
```javascript
// Store offline emails
const db = await openDB('EmailApp', 1, {
  upgrade(db) {
    const emailStore = db.createObjectStore('emails', {
      keyPath: 'id',
      autoIncrement: true
    });
    emailStore.createIndex('date', 'date');
    emailStore.createIndex('sender', 'sender');
  }
});

// Add email
await db.add('emails', {
  sender: 'john@example.com',
  subject: 'Meeting',
  body: 'Let\'s meet tomorrow',
  date: new Date(),
  read: false
});

// Query emails
const unreadEmails = await db.getAllFromIndex('emails', 'read', false);
```

#### Use Cache API For:

```javascript
✓ Service Worker caching
✓ Offline functionality
✓ Static assets (HTML, CSS, JS)
✓ API response caching
✓ Progressive Web Apps (PWA)

Examples:
- Offline website functionality
- App shell caching
- Image/video caching
- API response caching
```

**Example**:
```javascript
// Service Worker: Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('app-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/styles.css',
        '/script.js',
        '/logo.png'
      ]);
    })
  );
});

// Serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

## Security Considerations

### XSS (Cross-Site Scripting) Protection

**Problem**: Malicious scripts can access storage.

```javascript
// VULNERABLE: Storing HTML from user input
const userInput = '<img src=x onerror="alert(document.cookie)">';
localStorage.setItem('content', userInput);

// Later, displaying it:
document.getElementById('content').innerHTML = localStorage.getItem('content');
// → XSS attack! Script executes

// SAFE: Sanitize before storing/displaying
import DOMPurify from 'dompurify';

const userInput = '<img src=x onerror="alert(document.cookie)">';
const sanitized = DOMPurify.sanitize(userInput);
localStorage.setItem('content', sanitized);

// Or use textContent instead of innerHTML
document.getElementById('content').textContent = localStorage.getItem('content');
```

### Never Store Sensitive Data in Client Storage

```javascript
// ❌ NEVER DO THIS:
localStorage.setItem('password', 'myPassword123');
localStorage.setItem('creditCard', '4111-1111-1111-1111');
localStorage.setItem('ssn', '123-45-6789');
localStorage.setItem('privateKey', 'abc123...');

// ✅ SAFE: Only store non-sensitive data
localStorage.setItem('theme', 'dark');
localStorage.setItem('language', 'en');

// For authentication: Use HttpOnly cookies (server-only access)
Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Strict
```

### Cookie Security Attributes

```javascript
// ❌ INSECURE
document.cookie = "sessionId=abc123";

// ✅ SECURE
document.cookie = "sessionId=abc123; " +
  "HttpOnly; " +        // Not accessible via JavaScript (XSS protection)
  "Secure; " +          // Only sent over HTTPS
  "SameSite=Strict; " + // CSRF protection
  "Max-Age=3600";       // Expires in 1 hour

// Even better: Set cookies server-side
// Server response header:
Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Strict; Max-Age=3600
```

**Cookie Attributes Explained**:
```javascript
HttpOnly:
  - Cannot be read by JavaScript
  - Prevents XSS attacks from stealing cookies
  - ✓ Use for authentication tokens

Secure:
  - Only sent over HTTPS
  - Prevents man-in-the-middle attacks
  - ✓ Always use in production

SameSite=Strict:
  - Not sent on cross-site requests
  - Prevents CSRF attacks
  - ✓ Use for sensitive cookies

SameSite=Lax:
  - Sent on top-level navigation
  - Balance between security and usability
  - ✓ Default in modern browsers

SameSite=None:
  - Always sent (requires Secure)
  - Use only if needed for cross-site functionality
  - ⚠️ Less secure
```

### Content Security Policy (CSP)

```html
<!-- Prevent inline scripts (XSS protection) -->
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self'">

<!-- Now this won't work (inline script blocked): -->
<script>
  alert(localStorage.getItem('data'));  // Blocked by CSP
</script>
```

### Encrypt Sensitive Data

```javascript
// If you MUST store sensitive data client-side (generally not recommended)
import CryptoJS from 'crypto-js';

// Encrypt
const secret = 'user-entered-password';
const data = { userId: 123, role: 'admin' };
const encrypted = CryptoJS.AES.encrypt(
  JSON.stringify(data),
  secret
).toString();
localStorage.setItem('data', encrypted);

// Decrypt
const encryptedData = localStorage.getItem('data');
const bytes = CryptoJS.AES.decrypt(encryptedData, secret);
const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

// Note: Secret key must be protected (can't be in client code)
// Better: Use server-side sessions instead
```

## Performance Optimization

### 1. Minimize Storage Access

```javascript
// ❌ BAD: Multiple storage accesses
function getPreferences() {
  const theme = localStorage.getItem('theme');
  const language = localStorage.getItem('language');
  const fontSize = localStorage.getItem('fontSize');
  return { theme, language, fontSize };
}

// ✅ GOOD: Store related data together
function getPreferences() {
  const prefs = JSON.parse(localStorage.getItem('preferences') || '{}');
  return prefs;
}

function setPreferences(prefs) {
  localStorage.setItem('preferences', JSON.stringify(prefs));
}
```

### 2. Use Compression for Large Data

```javascript
// For large strings
import pako from 'pako';

// Compress before storing
function compressAndStore(key, data) {
  const json = JSON.stringify(data);
  const compressed = pako.deflate(json, { to: 'string' });
  localStorage.setItem(key, compressed);
}

// Decompress when retrieving
function retrieveAndDecompress(key) {
  const compressed = localStorage.getItem(key);
  if (!compressed) return null;

  const decompressed = pako.inflate(compressed, { to: 'string' });
  return JSON.parse(decompressed);
}

// Can reduce storage size by 70-90% for text data
```

### 3. Implement TTL (Time To Live)

```javascript
// Storage wrapper with expiration
class StorageWithTTL {
  set(key, value, ttlSeconds) {
    const item = {
      value: value,
      expiry: Date.now() + (ttlSeconds * 1000)
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  get(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);

    // Check if expired
    if (Date.now() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return item.value;
  }
}

// Usage
const storage = new StorageWithTTL();
storage.set('cachedData', data, 3600);  // Expires in 1 hour

// Later
const data = storage.get('cachedData');  // null if expired
```

### 4. Lazy Loading from Storage

```javascript
// ❌ BAD: Load all data on page load
window.addEventListener('load', () => {
  const data1 = localStorage.getItem('data1');
  const data2 = localStorage.getItem('data2');
  const data3 = localStorage.getItem('data3');
  // ... process all data
});

// ✅ GOOD: Load only when needed
function loadData(key) {
  if (!cache[key]) {
    cache[key] = localStorage.getItem(key);
  }
  return cache[key];
}

// Load data1 only when component needs it
function ComponentA() {
  const data = loadData('data1');
  // ...
}
```

### 5. Batch Operations

```javascript
// ❌ BAD: Multiple writes
for (let i = 0; i < 100; i++) {
  localStorage.setItem(`item${i}`, data[i]);
}

// ✅ GOOD: Single write
localStorage.setItem('items', JSON.stringify(data));
```

### 6. Async Operations for Large Data

```javascript
// IndexedDB is async - won't block UI
async function saveLargeDataset(data) {
  const db = await openDB('myDB', 1);
  const tx = db.transaction('store', 'readwrite');

  for (const item of data) {
    await tx.store.add(item);
  }

  await tx.done;
}

// LocalStorage is synchronous - can block UI
function saveLargeDataset(data) {
  // ❌ Blocks UI for large data
  localStorage.setItem('data', JSON.stringify(data));
}
```

## Storage Quotas and Management

### Checking Storage Quota

```javascript
// Check available storage (Chrome/Edge)
if (navigator.storage && navigator.storage.estimate) {
  navigator.storage.estimate().then((estimate) => {
    const usage = estimate.usage;        // Bytes used
    const quota = estimate.quota;        // Total bytes available
    const percent = (usage / quota) * 100;

    console.log(`Storage used: ${(usage / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Storage quota: ${(quota / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Percentage used: ${percent.toFixed(2)}%`);
  });
}

// Typical quotas:
// - LocalStorage: 5-10 MB
// - SessionStorage: 5-10 MB
// - IndexedDB: 50 MB to unlimited (depends on browser/settings)
```

### Handling QuotaExceededError

```javascript
// Try-catch for storage operations
function safeSet(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.error('Storage quota exceeded!');

      // Clear old data
      clearOldData();

      // Retry
      try {
        localStorage.setItem(key, value);
        return true;
      } catch (e) {
        console.error('Still failed after cleanup');
        return false;
      }
    }
    return false;
  }
}

function clearOldData() {
  // Remove expired items
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const item = JSON.parse(localStorage.getItem(key) || '{}');

    if (item.expiry && Date.now() > item.expiry) {
      localStorage.removeItem(key);
    }
  }
}
```

### Storage Eviction

```javascript
// Request persistent storage (prevents eviction)
if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().then((granted) => {
    if (granted) {
      console.log('Storage will not be evicted');
    } else {
      console.log('Storage may be evicted under pressure');
    }
  });
}

// Check if storage is persistent
navigator.storage.persisted().then((persisted) => {
  console.log('Is persistent:', persisted);
});
```

## Practical Patterns

### 1. Storage Abstraction Layer

```javascript
// Abstract storage to easily switch implementations
class StorageManager {
  constructor(storage = localStorage) {
    this.storage = storage;
  }

  set(key, value, options = {}) {
    const item = {
      value: value,
      created: Date.now()
    };

    if (options.ttl) {
      item.expiry = Date.now() + (options.ttl * 1000);
    }

    try {
      this.storage.setItem(key, JSON.stringify(item));
      return true;
    } catch (e) {
      console.error('Storage error:', e);
      return false;
    }
  }

  get(key) {
    const itemStr = this.storage.getItem(key);
    if (!itemStr) return null;

    try {
      const item = JSON.parse(itemStr);

      // Check expiration
      if (item.expiry && Date.now() > item.expiry) {
        this.storage.removeItem(key);
        return null;
      }

      return item.value;
    } catch (e) {
      console.error('Parse error:', e);
      return null;
    }
  }

  remove(key) {
    this.storage.removeItem(key);
  }

  clear() {
    this.storage.clear();
  }
}

// Usage
const storage = new StorageManager(localStorage);
storage.set('user', { name: 'John' }, { ttl: 3600 });
const user = storage.get('user');
```

### 2. Sync Across Tabs

```javascript
// Listen for storage changes in other tabs
window.addEventListener('storage', (e) => {
  console.log('Storage changed in another tab');
  console.log('Key:', e.key);
  console.log('Old value:', e.oldValue);
  console.log('New value:', e.newValue);

  // Update UI based on change
  if (e.key === 'theme') {
    applyTheme(e.newValue);
  }
});

// Note: storage event only fires in OTHER tabs, not the one making the change
```

### 3. Fallback Strategy

```javascript
// Storage with fallback
class Storage {
  constructor() {
    // Try localStorage
    if (this.isAvailable('localStorage')) {
      this.storage = localStorage;
      this.type = 'localStorage';
    }
    // Fallback to sessionStorage
    else if (this.isAvailable('sessionStorage')) {
      this.storage = sessionStorage;
      this.type = 'sessionStorage';
    }
    // Fallback to in-memory
    else {
      this.storage = new Map();
      this.type = 'memory';
    }
  }

  isAvailable(type) {
    try {
      const storage = window[type];
      const test = '__test__';
      storage.setItem(test, test);
      storage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  set(key, value) {
    if (this.type === 'memory') {
      this.storage.set(key, value);
    } else {
      this.storage.setItem(key, JSON.stringify(value));
    }
  }

  get(key) {
    if (this.type === 'memory') {
      return this.storage.get(key);
    } else {
      const item = this.storage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
  }
}
```

## Anti-Patterns to Avoid

### 1. Storing Large Blobs in LocalStorage

```javascript
// ❌ BAD: Store base64 image in localStorage
fetch('/image.jpg')
  .then(r => r.blob())
  .then(blob => {
    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem('image', reader.result);  // Can exceed quota!
    };
    reader.readAsDataURL(blob);
  });

// ✅ GOOD: Use IndexedDB for blobs
const db = await openDB('images', 1);
const blob = await fetch('/image.jpg').then(r => r.blob());
await db.put('images', { id: 'logo', data: blob });
```

### 2. Synchronous Operations in Render

```javascript
// ❌ BAD: Reading storage during render
function MyComponent() {
  const data = JSON.parse(localStorage.getItem('data'));  // Blocks render!
  return <div>{data.value}</div>;
}

// ✅ GOOD: Use state and effects
function MyComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('data');
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  if (!data) return <div>Loading...</div>;
  return <div>{data.value}</div>;
}
```

### 3. Storing Everything in Storage

```javascript
// ❌ BAD: Store all app state in storage
const appState = {
  user: { ... },
  posts: [...1000 posts...],
  comments: [...10000 comments...],
  analytics: { ... }
};
localStorage.setItem('appState', JSON.stringify(appState));

// ✅ GOOD: Store only what needs persistence
// - User preferences → localStorage
// - Authentication → HttpOnly cookie
// - Large datasets → IndexedDB or fetch when needed
// - Temporary state → React state (not stored)
```

## Key Takeaways

1. **Choose storage based on use case**: cookies for server access, localStorage for preferences, IndexedDB for large data
2. **Never store sensitive data** in client storage
3. **Use HttpOnly cookies** for authentication
4. **Implement TTL** for cached data
5. **Handle quota errors** gracefully
6. **Sanitize data** to prevent XSS
7. **Minimize storage access** for performance
8. **Use compression** for large datasets

## Exercises

### Exercise 1: Storage Selection

Choose appropriate storage for each:
1. User's dark mode preference
2. Authentication token
3. Shopping cart (100 items)
4. Draft blog post (autosave)
5. Offline email client
6. Recently viewed products

### Exercise 2: Implement Storage Wrapper

Create a storage wrapper with:
- TTL support
- Compression for large data
- Fallback to sessionStorage
- Error handling

## Next Steps

In [Lesson 16: Network Debugging](./16-network-debugging.md), we'll learn:
- Network tab in DevTools
- Analyzing requests/responses
- Performance waterfall
- Debugging API calls

---

**Practice**: Audit your application's storage usage and optimize it!
