# Lesson 18: Advanced DevTools Techniques

## Sources Tab - Advanced Debugging

### Sources Tab Overview

```
Sources Tab Layout:
┌─────────────────────────────────────────────────────┐
│ File Navigator | Code Editor | Debugger Sidebar    │
├─────────────────────────────────────────────────────┤
│ Page           | function add(a, b) {               │
│ ├── index.html |   debugger; ←                      │
│ ├── styles.css |   return a + b;  Breakpoint  ●     │
│ └── app.js     | }                                  │
│                |                                     │
│ Workspace      | [Step Over] [Step Into] [Step Out] │
│ Snippets       |                                     │
│ Overrides      | Scope:                             │
│                |   Local: a=5, b=3                  │
│                |   Global: window, document         │
│                |                                     │
│                | Call Stack:                        │
│                |   add (app.js:5)                   │
│                |   onClick (app.js:10)              │
│                |                                     │
│                | Watch:                             │
│                |   a + b = 8                        │
└─────────────────────────────────────────────────────┘
```

### Types of Breakpoints

#### 1. Line Breakpoints

```javascript
// Click line number to add breakpoint
function calculateTotal(items) {
  let total = 0;  // ● Breakpoint here (click line 2)

  for (let item of items) {
    total += item.price;
  }

  return total;
}

// Execution pauses at breakpoint
// Inspect variables in Scope panel
```

#### 2. Conditional Breakpoints

```javascript
// Right-click line number → Add conditional breakpoint
function processItems(items) {
  for (let i = 0; i < items.length; i++) {
    processItem(items[i]);  // ● Break only if: i === 50
  }
}

// Pauses only when condition is true
// Useful for debugging specific iterations
```

#### 3. Logpoints

```javascript
// Right-click line number → Add logpoint
function updateUser(user) {
  // Logpoint: 'Updating user:', user.id
  database.update(user);
}

// Logs to console without stopping execution
// No need to add console.log() in code
```

#### 4. DOM Breakpoints

```javascript
// Right-click element in Elements tab → Break on:

1. Subtree modifications
   - Breaks when children are added/removed
   - Example: element.appendChild(child)

2. Attribute modifications
   - Breaks when attributes change
   - Example: element.className = 'active'

3. Node removal
   - Breaks when element is removed
   - Example: element.remove()

// Useful for finding where DOM is being modified
```

#### 5. Event Listener Breakpoints

```javascript
// Sources tab → Event Listener Breakpoints

// Check "click" → Breaks on ANY click event
// Useful for finding which code handles an event

Categories:
- Mouse: click, mousedown, mouseover
- Keyboard: keydown, keypress, keyup
- Touch: touchstart, touchmove, touchend
- Form: submit, change, focus, blur
- Clipboard: copy, paste, cut
- Load: load, error
- Timer: setInterval, setTimeout
```

#### 6. XHR/Fetch Breakpoints

```javascript
// Sources tab → XHR/Fetch Breakpoints
// Click + → Enter URL pattern

// Examples:
api/users     → Breaks on requests containing "api/users"
*.json        → Breaks on all JSON requests
POST          → Breaks on POST requests

// Pauses before fetch/XHR is sent
// Inspect request details before sending
```

#### 7. Exception Breakpoints

```javascript
// Sources tab → Pause on exceptions checkbox

// Uncaught exceptions:
☑ Pause on exceptions

// All exceptions (including caught):
☑ Pause on caught exceptions

// Example:
try {
  throw new Error('Something went wrong');  // ● Pauses here
} catch (e) {
  console.error(e);
}
```

### Debugger Controls

```
Play/Pause (F8):
  Resume script execution

Step Over (F10):
  Execute current line, don't go into functions
  add(5, 3);  → Execute add() without stepping into it

Step Into (F11):
  Step into function call
  add(5, 3);  → Jump into add() function

Step Out (Shift+F11):
  Finish current function and return to caller

Step (F9):
  Step to next line (same as Step Over for non-function calls)
```

### Watch Expressions

```javascript
// Add expressions to watch their values during debugging

function calculateDiscount(price, percent) {
  debugger;
  const discount = price * (percent / 100);
  const final = price - discount;
  return final;
}

// Watch panel:
price           → 100
percent         → 20
discount        → 20
final           → 80
price - discount → 80  (custom expression)
```

### Call Stack

```javascript
// Shows function call hierarchy

function main() {
  processData();  // Call stack: main → processData
}

function processData() {
  filterItems();  // Call stack: main → processData → filterItems
}

function filterItems() {
  debugger;  // Pause here
  // Call Stack panel shows:
  // filterItems (app.js:15)
  // processData (app.js:10)
  // main (app.js:5)
}

// Click any frame to see its scope/variables
```

### Scope Panel

```javascript
function outer(x) {
  const outerVar = 'outer';

  function inner(y) {
    const innerVar = 'inner';
    debugger;  // Pause here

    // Scope panel shows:
    // Local:
    //   innerVar: "inner"
    //   y: 10
    //   this: Window
    // Closure (outer):
    //   outerVar: "outer"
    //   x: 5
    // Global:
    //   window: Window
    //   document: Document
  }

  inner(10);
}

outer(5);
```

## Snippets - Reusable Code

### Creating Snippets

```javascript
// Sources tab → Snippets → + New snippet

// Example: Clear all localStorage
// Name: clear-storage.js
localStorage.clear();
sessionStorage.clear();
console.log('Storage cleared!');

// Run: Ctrl+Enter or right-click → Run

// Use cases:
// - Testing code quickly
// - Utility functions
// - Debugging helpers
// - Reusable scripts
```

### Useful Snippet Examples

#### 1. Find All Event Listeners

```javascript
// find-listeners.js
const allElements = document.querySelectorAll('*');
const elementsWithListeners = [];

allElements.forEach(element => {
  const listeners = getEventListeners(element);
  if (Object.keys(listeners).length > 0) {
    elementsWithListeners.push({
      element: element,
      listeners: listeners
    });
  }
});

console.table(elementsWithListeners);
```

#### 2. Performance Monitor

```javascript
// performance-monitor.js
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(`${entry.name}: ${entry.duration}ms`);
  }
});

observer.observe({ entryTypes: ['measure', 'navigation'] });
console.log('Performance monitoring started');
```

#### 3. Debug All Fetch Calls

```javascript
// debug-fetch.js
const originalFetch = window.fetch;

window.fetch = function(...args) {
  console.log('Fetch called:', args);
  return originalFetch.apply(this, args)
    .then(response => {
      console.log('Fetch response:', response);
      return response;
    })
    .catch(error => {
      console.error('Fetch error:', error);
      throw error;
    });
};

console.log('Fetch debugging enabled');
```

## Local Overrides

### Override Network Resources

```
1. Sources tab → Overrides → Select folder for overrides
2. Network tab → Right-click resource → Save for overrides
3. Edit file in Sources → Overrides
4. Reload page → Modified version loads

Use cases:
- Test fixes without deploying
- Debug production issues
- Experiment with CSS/JS changes
- Test different API responses
```

**Example**:
```javascript
// Override API response
// 1. Network tab → api/users → Save for overrides
// 2. Sources → Overrides → api/users
// 3. Edit response:
{
  "users": [
    { "id": 1, "name": "Test User", "email": "test@example.com" }
  ]
}
// 4. Reload page → New response loads
```

## Application Tab Deep Dive

### Storage Section

```
Application Tab:
├── Storage
│   ├── Local Storage
│   ├── Session Storage
│   ├── IndexedDB
│   ├── Cookies
│   └── Cache Storage
├── Application
│   ├── Manifest
│   ├── Service Workers
│   └── Storage Usage
└── Background Services
    ├── Background Fetch
    ├── Background Sync
    └── Notifications
```

### Service Workers

```javascript
// Application tab → Service Workers

// Controls:
☑ Offline (test offline mode)
☑ Update on reload (force SW update)
[Unregister] (remove service worker)
[Update] (manually update SW)

// Status indicators:
● Green: Active and running
● Gray: Stopped
● Red: Error

// Example: Debug service worker
self.addEventListener('fetch', (event) => {
  console.log('SW intercepted:', event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

### Cache Storage

```javascript
// Application tab → Cache Storage

// View cached resources
Cache: app-v1
├── /
├── /styles.css
├── /script.js
└── /logo.png

// Right-click:
- Delete entry (remove from cache)
- Refresh cache view
- Clear cache storage

// Programmatically in Console:
caches.open('app-v1').then(cache => {
  cache.keys().then(keys => console.log(keys));
});
```

### Storage Usage

```javascript
// Application tab → Storage → Usage

Storage Quota: 500 MB
Used: 45 MB (9%)

Breakdown:
- IndexedDB: 30 MB
- Cache Storage: 10 MB
- Local Storage: 5 MB

[Clear site data] (clear all storage)

// Check programmatically:
navigator.storage.estimate().then(estimate => {
  console.log('Usage:', estimate.usage);
  console.log('Quota:', estimate.quota);
});
```

## Security Tab

### View Security Information

```
Security Tab:
┌─────────────────────────────────────────┐
│ ✓ Secure connection (HTTPS)            │
│                                         │
│ Certificate:                            │
│   Issued to: example.com                │
│   Issued by: Let's Encrypt              │
│   Valid: Jan 1 - Dec 31, 2025          │
│                                         │
│ Connection:                             │
│   Protocol: TLS 1.3                     │
│   Cipher: AES_128_GCM                   │
│                                         │
│ Resources:                              │
│   ✓ All resources served over HTTPS    │
│   ✗ Mixed content detected              │
└─────────────────────────────────────────┘
```

### Common Security Issues

```javascript
// 1. Mixed Content (HTTP resources on HTTPS page)
// Security tab shows warning:
✗ Mixed content: http://example.com/image.jpg

// Fix: Use HTTPS
<img src="https://example.com/image.jpg" />

// 2. Certificate Issues
✗ Certificate expired
✗ Certificate not trusted
✗ Hostname mismatch

// 3. Insecure Connections
✗ Page loaded over HTTP (not secure)

// Fix: Redirect to HTTPS
if (location.protocol !== 'https:') {
  location.protocol = 'https:';
}
```

## Remote Debugging

### Debug Mobile Devices

#### Android (Chrome DevTools)

```
Setup:
1. Enable USB debugging on Android device
2. Connect device via USB
3. Chrome → chrome://inspect
4. Select device → Inspect

Features:
- View device screen
- Interact with page
- Use all DevTools features
- Network throttling
- Geolocation override
```

#### iOS (Safari Web Inspector)

```
Setup:
1. Enable Web Inspector on iOS device
   Settings → Safari → Advanced → Web Inspector
2. Connect device via USB
3. Safari → Develop → [Device Name] → [Page]

Features:
- Element inspection
- Console access
- Network monitoring
- Debugger
```

### Remote Debugging over Network

```javascript
// Start Chrome with remote debugging
chrome --remote-debugging-port=9222

// Connect from another device:
http://[your-ip]:9222

// Useful for:
- Testing on local network devices
- Debugging smart TVs
- Testing on other computers
```

## DevTools Tips and Tricks

### 1. Command Menu

```
Ctrl+Shift+P (Cmd+Shift+P on Mac)
→ Opens command menu

Useful commands:
> Capture screenshot
> Capture full size screenshot
> Show console
> Disable JavaScript
> Clear site data
> Open file
> Run snippet
> Show coverage
```

### 2. Console Utilities

```javascript
// $ - document.querySelector
$('button')  // First button element
$$('button') // All button elements (array)

// $0 - Currently selected element in Elements tab
$0.style.color = 'red';

// $_ - Last evaluated expression
2 + 2  // 4
$_     // 4

// copy() - Copy to clipboard
copy($('button'))  // Copies element to clipboard

// monitor() - Log function calls
function add(a, b) { return a + b; }
monitor(add);
add(5, 3);  // Console: function add called with arguments: 5, 3

// monitorEvents() - Log events
monitorEvents(window, 'resize');
// Resizing window → Logs resize events

// getEventListeners() - Get element's listeners
getEventListeners($('button'));
```

### 3. Console Styling

```javascript
// Styled console output
console.log('%cStyled!', 'color: blue; font-size: 20px; font-weight: bold;');

// Multiple styles
console.log(
  '%cError: %cSomething failed',
  'color: red; font-weight: bold',
  'color: gray'
);

// ASCII art
console.log(`
  %c██████╗ ███████╗██╗   ██╗
  %c██╔══██╗██╔════╝██║   ██║
  %c██║  ██║█████╗  ██║   ██║
  %c██║  ██║██╔══╝  ╚██╗ ██╔╝
  %c██████╔╝███████╗ ╚████╔╝
  %c╚═════╝ ╚══════╝  ╚═══╝
`, 'color: #00ff00');
```

### 4. Live Expressions

```javascript
// Console → Create live expression (eye icon)

// Examples:
document.body.scrollTop     // Updates as you scroll
performance.now()           // Current timestamp
window.innerWidth           // Updates on resize

// Shows value in real-time
// No need to re-evaluate
```

### 5. Code Coverage

```javascript
// Ctrl+Shift+P → Show Coverage
// Click Record → Use app → Stop

Coverage Report:
┌─────────────────────────────────────────┐
│ File        │ Unused │ Used │ Coverage  │
├─────────────────────────────────────────┤
│ app.js      │ 150 KB │ 50 KB│ 33%       │
│ vendor.js   │ 800 KB │ 200KB│ 25%       │
└─────────────────────────────────────────┘

// Red = unused code
// Green = used code

// Optimize by:
- Code splitting
- Tree shaking
- Removing unused libraries
```

### 6. Network Request Blocking

```javascript
// Network tab → Right-click → Block request URL

// Block patterns:
*.google-analytics.com/*   // Block analytics
*/ads/*                    // Block ads
*.mp4                      // Block videos

// Use cases:
- Test without analytics
- Simulate blocked resources
- Test error handling
```

### 7. Sensors Emulation

```javascript
// Ctrl+Shift+P → Show Sensors

Override:
- Location (GPS coordinates)
- Orientation (device tilt)
- Touch events

// Example: Test geolocation
Location: San Francisco, CA
Latitude: 37.7749
Longitude: -122.4194

// Code will receive fake location:
navigator.geolocation.getCurrentPosition((pos) => {
  console.log(pos.coords.latitude);  // 37.7749
});
```

### 8. Rendering Tab

```javascript
// Ctrl+Shift+P → Show Rendering

Options:
☑ Paint flashing (shows repainted areas)
☑ Layout Shift Regions (shows CLS)
☑ Frame Rendering Stats (FPS meter)
☑ Scrolling performance issues
☐ Emulate CSS media (print, dark mode)

// Useful for:
- Identifying paint performance issues
- Debugging layout shifts
- Testing dark mode
```

### 9. Animations Tab

```javascript
// Ctrl+Shift+P → Show Animations

Features:
- Replay animations
- Slow down animations (25%, 10%)
- Inspect animation timeline
- Modify timing functions

// Example: Debug animation
@keyframes slide {
  from { transform: translateX(0); }
  to { transform: translateX(100px); }
}

// Animations tab:
- Visualize timeline
- Adjust speed
- Pause/resume
```

### 10. Workspace for Persistent Edits

```javascript
// Sources tab → Filesystem → Add folder to workspace

// Edit files directly in DevTools
// Changes saved to disk immediately

// Useful for:
- Editing local development files
- Testing changes persistently
- Full IDE-like experience in browser
```

## Keyboard Shortcuts

### General

```
F12 / Ctrl+Shift+I      Open DevTools
Ctrl+Shift+P            Command menu
Ctrl+Shift+C            Inspect element
Ctrl+F                  Search in current panel
Esc                     Toggle console drawer
Ctrl+L                  Clear console
```

### Debugging

```
F8                      Resume/Pause
F10                     Step over
F11                     Step into
Shift+F11               Step out
Ctrl+B                  Toggle breakpoint
Ctrl+Shift+E            Run selected code
```

### Elements

```
Ctrl+Shift+C            Select element
H                       Hide element
Scroll into view        Right-click → Scroll into view
Delete                  Delete node
Ctrl+Z                  Undo
```

### Console

```
Ctrl+L                  Clear console
Tab                     Autocomplete
Ctrl+Enter              Evaluate multiline expression
Up/Down arrows          History navigation
```

## Best Practices

### 1. Use Breakpoints Instead of console.log

```javascript
// ❌ Less efficient
function processData(data) {
  console.log('data:', data);
  const result = transform(data);
  console.log('result:', result);
  return result;
}

// ✅ Better
function processData(data) {
  debugger;  // or add breakpoint
  const result = transform(data);
  return result;
}
// Inspect variables in Scope panel
```

### 2. Use Conditional Breakpoints for Specific Cases

```javascript
// Break only on error conditions
function processItem(item) {
  if (item.isValid()) {
    process(item);  // ● Breakpoint: !item.isValid()
  }
}
```

### 3. Use Logpoints for Non-Intrusive Logging

```javascript
// No need to modify code
// Right-click line → Add logpoint
// Message: 'Processing item:', item.id
```

### 4. Leverage Console Utilities

```javascript
// Quick debugging without typing
$0           // Selected element
$$('div')    // All divs
copy(data)   // Copy to clipboard
```

### 5. Use Snippets for Reusable Scripts

```javascript
// Create snippets for common tasks
// - Clear storage
// - Log all event listeners
// - Performance monitoring
// - Debug helpers
```

## Key Takeaways

1. **Breakpoints** are powerful for debugging (conditional, DOM, XHR)
2. **Sources tab** provides full debugging capabilities
3. **Snippets** allow reusable code execution
4. **Local Overrides** let you test changes without deploying
5. **Remote debugging** enables mobile device debugging
6. **Command menu** (Ctrl+Shift+P) provides quick access to features
7. **Console utilities** ($, copy, monitor) speed up debugging
8. **Code coverage** helps identify unused code

## Exercises

### Exercise 1: Debug Complex Code

Debug this code using breakpoints:
```javascript
function calculatePrice(items, discount) {
  let total = 0;
  for (let item of items) {
    total += item.price * item.quantity;
  }
  return total * (1 - discount / 100);
}

// Debug: Why is price negative for some inputs?
```

### Exercise 2: Create Useful Snippet

Create a snippet that:
1. Finds all images on page
2. Logs which are loaded vs failed
3. Shows total image size

### Exercise 3: Remote Debug Mobile

1. Set up remote debugging for mobile device
2. Debug responsive layout issues
3. Test touch events

## Next Steps

Continue learning:
- [Lesson 6: DBMS Introduction](./06-dbms-introduction.md)
- [Lesson 7: Relational Databases](./07-relational-databases.md)
- [Lesson 8: NoSQL Databases](./08-nosql-databases.md)

---

**Practice**: Master DevTools by debugging real issues in your applications!
