# Lesson 14: Browser DevTools Overview

## What are Browser DevTools?

Browser Developer Tools (DevTools) are built into modern browsers and provide powerful features for:
- **Debugging** JavaScript code
- **Inspecting** HTML and CSS
- **Monitoring** network requests
- **Analyzing** performance
- **Testing** mobile responsive designs
- **Viewing** storage (cookies, localStorage, etc.)

## Opening DevTools

### Keyboard Shortcuts

```
Windows/Linux:
- F12
- Ctrl + Shift + I (Inspector)
- Ctrl + Shift + J (Console)
- Ctrl + Shift + C (Element picker)

Mac:
- Cmd + Option + I (Inspector)
- Cmd + Option + J (Console)
- Cmd + Option + C (Element picker)
```

### Other Methods

```
1. Right-click on webpage → "Inspect" or "Inspect Element"
2. Browser menu → More Tools → Developer Tools
3. Right-click element → "Inspect Element" (opens to that element)
```

## DevTools Panels Overview

### 1. Elements Panel (Inspector)

**What it does**: Inspect and modify HTML/CSS in real-time

**Key Features**:
- View DOM tree
- Edit HTML live
- Modify CSS styles
- See computed styles
- Debug layout issues
- View box model
- Check element states (:hover, :focus, etc.)

**Common Tasks**:

**Inspect an Element**:
```
1. Click the element picker icon (or Ctrl+Shift+C)
2. Hover over any element on the page
3. Click to select it
4. View HTML in Elements panel
5. View CSS in Styles pane
```

**Edit HTML**:
```
1. Right-click element → Edit as HTML
2. Make changes
3. Click outside to apply
```

**Edit CSS**:
```
1. Select element
2. In Styles pane, click on any property value
3. Type new value
4. Press Enter to apply
5. Changes apply immediately (not saved to file!)
```

**Add New CSS Rule**:
```
1. Select element
2. Click "+" button in Styles pane
3. Type selector and properties
```

**Toggle CSS Property**:
```
1. Hover over CSS property
2. Click checkbox to enable/disable
```

**See Computed Styles**:
```
1. Select element
2. Click "Computed" tab
3. See final computed values
4. See box model visualization
```

**Force Element State**:
```
1. Select element
2. Click ":hov" button
3. Check :hover, :active, :focus, :visited
4. Element shows that state
```

**View Box Model**:
```
In Computed tab:
- See margin (orange)
- See border (yellow)
- See padding (green)
- See content (blue)
- Hover to highlight on page
```

### 2. Console Panel

**What it does**: Execute JavaScript, view logs, debug errors

**Key Features**:
- Run JavaScript code
- View console.log() output
- See errors and warnings
- Test code snippets
- Access DOM elements
- Call functions

**Covered in detail in Lesson 15: Console Mastery**

### 3. Sources Panel (Debugger)

**What it does**: Debug JavaScript code with breakpoints

**Key Features**:
- View source files
- Set breakpoints
- Step through code
- Inspect variables
- Watch expressions
- Call stack
- Scope variables

**Using Breakpoints**:

**1. Line Breakpoint**:
```javascript
function calculateTotal(items) {
  let total = 0;  // ← Click line number to set breakpoint
  for (let item of items) {
    total += item.price * item.quantity;
  }
  return total;
}
```

**2. Conditional Breakpoint**:
```
1. Right-click line number
2. "Add conditional breakpoint"
3. Enter condition: item.price > 100
4. Breakpoint only triggers if condition is true
```

**3. Debugger Statement**:
```javascript
function processData(data) {
  console.log('Processing:', data);
  debugger; // ← Code pauses here when DevTools open
  const result = transform(data);
  return result;
}
```

**Stepping Through Code**:
```
When paused at breakpoint:

Step Over (F10):
- Execute current line
- Move to next line
- Don't enter functions

Step Into (F11):
- Execute current line
- Enter function calls
- Debug inside functions

Step Out (Shift+F11):
- Execute rest of current function
- Return to caller

Resume (F8):
- Continue execution
- Run until next breakpoint or end
```

**Watch Expressions**:
```
1. In Watch pane, click "+"
2. Enter expression: item.price * item.quantity
3. See value update as you step through code
```

**Call Stack**:
```
Shows function call hierarchy:
calculateTotal()
  ← processOrder()
    ← handleCheckout()
      ← buttonClickHandler()

Click any function to see its context
```

**Scope Variables**:
```
See all variables in current scope:
- Local variables
- Closure variables
- Global variables
```

### 4. Network Panel

**What it does**: Monitor all network requests

**Key Features**:
- View all HTTP requests
- See request/response headers
- View response bodies
- Check timing
- Filter by type
- Throttle network speed
- Block requests

**Network Tab Columns**:
```
Name:       File name or URL
Status:     HTTP status code (200, 404, etc.)
Type:       Resource type (document, script, image, xhr, etc.)
Initiator:  What triggered the request
Size:       Response size
Time:       How long request took
Waterfall:  Visual timeline
```

**Analyzing a Request**:
```
Click on any request to see:

Headers Tab:
- General (URL, Method, Status)
- Response Headers
- Request Headers

Preview Tab:
- Formatted preview of response

Response Tab:
- Raw response data

Timing Tab:
- DNS Lookup
- Initial Connection
- SSL/TLS Negotiation
- Request Sent
- Waiting (TTFB - Time To First Byte)
- Content Download
```

**Filtering Requests**:
```
Filter buttons:
- All: All requests
- XHR: AJAX/Fetch requests
- JS: JavaScript files
- CSS: Stylesheets
- Img: Images
- Media: Audio/Video
- Font: Fonts
- Doc: HTML documents
- WS: WebSockets
- Other: Everything else

Or type in filter box:
- domain:example.com
- method:POST
- status-code:404
- larger-than:1000
```

**Network Throttling**:
```
Simulate slow connections:
1. Click "No throttling" dropdown
2. Select:
   - Fast 3G
   - Slow 3G
   - Offline
   - Custom

Useful for testing on slow networks
```

**Block Requests**:
```
Test how app works without certain resources:
1. Right-click request
2. "Block request URL" or "Block request domain"
3. Blocked requests shown in red
```

**Copy as cURL**:
```
1. Right-click request
2. Copy → Copy as cURL
3. Paste in terminal to replay request
```

### 5. Application Panel

**What it does**: Inspect storage, cache, and app resources

**Storage Section**:

**Local Storage**:
```
Application → Storage → Local Storage → your-domain

- View all key-value pairs
- Edit values (double-click)
- Delete items (right-click → Delete)
- Clear all (right-click → Clear)
```

**Session Storage**:
```
Application → Storage → Session Storage → your-domain

- Same interface as Local Storage
- Data cleared when tab closes
```

**Cookies**:
```
Application → Storage → Cookies → your-domain

View:
- Name, Value
- Domain, Path
- Expires, Size
- HttpOnly, Secure, SameSite

Edit:
- Double-click to edit value
- Right-click → Delete to remove
- Clear all cookies
```

**IndexedDB**:
```
Application → Storage → IndexedDB → your-database

- Browse databases
- View object stores
- See all records
- Delete records
- Refresh to see updates
```

**Cache Storage**:
```
Application → Cache Storage

- View cached responses
- See cache entries
- Delete individual items
- Clear entire cache
```

**Service Workers**:
```
Application → Service Workers

- See registered service workers
- Update service worker
- Unregister
- Bypass for network (testing)
- View offline status
```

**Storage Usage**:
```
Application → Storage (bottom of list)

- See quota and usage
- Clear storage for site
- See breakdown by type
```

### 6. Performance Panel

**What it does**: Analyze runtime performance

**Key Features**:
- Record page activity
- See frame rate
- Identify bottlenecks
- View CPU usage
- Memory usage
- Screenshots

**Recording Performance**:
```
1. Click record button (●)
2. Perform actions on page
3. Click stop
4. Analyze recording

Or:
1. Click reload button (↻)
2. Records page load automatically
```

**Reading Performance Timeline**:
```
FPS (Frames Per Second):
- Green bar = 60 FPS (smooth)
- Red bar = dropped frames (janky)

CPU:
- Shows what's using CPU
- Scripting (yellow)
- Rendering (purple)
- Painting (green)

Network:
- Shows network requests over time

Frames:
- Click to see frame details
- See what happened in that frame
```

**Main Thread**:
```
Shows JavaScript execution:
- Function calls
- How long each took
- Call tree
- Bottom-up view
```

**Finding Performance Issues**:
```
Look for:
- Long yellow bars (slow JavaScript)
- Many small bars (lots of small functions)
- Red triangles (warning about issue)
- Dropped frames (red in FPS)

Click on function to see:
- Source code
- Execution time
- Self time vs total time
```

### 7. Memory Panel

**What it does**: Find memory leaks

**Key Features**:
- Heap snapshots
- Allocation timeline
- Compare snapshots
- Find detached DOM nodes

**Taking Heap Snapshot**:
```
1. Memory tab
2. Select "Heap snapshot"
3. Click "Take snapshot"
4. Analyze memory usage

View by:
- Summary: Object types and counts
- Comparison: Compare two snapshots
- Containment: Object structure
- Statistics: Memory distribution
```

**Finding Memory Leaks**:
```
1. Take snapshot (baseline)
2. Use your app
3. Take another snapshot
4. Compare snapshots
5. Look for objects that shouldn't still exist
```

### 8. Lighthouse (Audits)

**What it does**: Automated performance and quality checks

**Audits**:
- Performance
- Accessibility
- Best Practices
- SEO
- Progressive Web App

**Running Lighthouse**:
```
1. Open DevTools
2. Lighthouse tab
3. Select categories to audit
4. Select device (Mobile/Desktop)
5. Click "Generate report"
```

**Reading Report**:
```
Score: 0-100 for each category
- 90-100: Green (Good)
- 50-89: Orange (Needs improvement)
- 0-49: Red (Poor)

Opportunities:
- Suggested improvements
- Potential savings (time/size)

Diagnostics:
- Additional information
- Things to check

Passed Audits:
- What you're doing right
```

## DevTools Settings

### Customize DevTools

```
Click ⚙️ (Settings) icon:

Appearance:
- Theme (Light/Dark)
- Panel layout (Horizontal/Vertical/Auto)

Preferences:
- Disable cache (while DevTools open)
- Disable JavaScript
- Show user agent shadow DOM
- Auto-open DevTools for popups

Network:
- Custom user agent
- Throttling presets
```

### Docking Options

```
Click ⋮ (three dots) → Dock side:

- Dock to right
- Dock to left
- Dock to bottom
- Undock into separate window
```

## Common DevTools Workflows

### 1. Debug JavaScript Error

```
1. See error in Console
2. Click on file:line link
3. Opens Sources panel
4. Set breakpoint before error
5. Reload page
6. Step through code
7. Inspect variables
8. Find cause
```

### 2. Fix CSS Layout Issue

```
1. Right-click problem element → Inspect
2. View computed styles
3. Check box model
4. Toggle CSS properties
5. Adjust values live
6. Copy working CSS
7. Update source file
```

### 3. Optimize Page Load

```
1. Open Network panel
2. Reload page
3. Sort by size or time
4. Identify large/slow resources
5. Use Lighthouse for suggestions
6. Implement optimizations
7. Re-test
```

### 4. Test Responsive Design

```
1. Click device toolbar icon (Ctrl+Shift+M)
2. Select device preset or custom size
3. Test different screen sizes
4. Rotate device
5. Throttle network
6. Test touch events
```

### 5. Inspect API Calls

```
1. Network panel → XHR filter
2. Make API call in app
3. Click request
4. View request headers/body
5. View response
6. Check status code
7. Debug issues
```

## DevTools Shortcuts (Chrome)

```
General:
Ctrl+Shift+I    Open DevTools
Ctrl+Shift+C    Element picker
Ctrl+Shift+J    Console
Ctrl+[          Previous panel
Ctrl+]          Next panel

Elements:
↑↓              Navigate DOM
←→              Expand/collapse node
H               Hide element
Delete          Delete element
Ctrl+Z          Undo change

Console:
Ctrl+L          Clear console
↑↓              Previous/next command
Tab             Autocomplete
Esc             Show/hide console drawer

Sources:
Ctrl+O          Open file
Ctrl+Shift+O    Go to function
Ctrl+G          Go to line
F8              Resume/pause
F10             Step over
F11             Step into
Shift+F11       Step out
Ctrl+B          Toggle breakpoint

Search:
Ctrl+Shift+F    Search all files
Ctrl+F          Search current file
```

## DevTools in Different Browsers

### Chrome DevTools
- Most feature-rich
- Best for general development
- Excellent performance tools

### Firefox DevTools
- Great CSS Grid/Flexbox inspector
- Excellent font tools
- Good accessibility tools

### Safari DevTools
- Best for iOS debugging
- Required for Safari-specific issues
- Simpler interface

### Edge DevTools
- Based on Chromium (like Chrome)
- Similar to Chrome DevTools
- Some Microsoft-specific features

## Mobile Debugging

### Chrome on Android

```
1. Enable USB debugging on Android
2. Connect device via USB
3. Chrome → More Tools → Remote Devices
4. Select device
5. Inspect tab
6. DevTools open for mobile tab!
```

### Safari on iOS

```
1. iPhone: Settings → Safari → Advanced → Web Inspector
2. Connect iPhone via USB
3. Safari (Mac) → Develop → [Your iPhone] → [Tab]
4. DevTools open for iPhone tab!
```

## Best Practices

1. **Keep DevTools open while developing**
   - See errors immediately
   - Test changes live
   - Monitor network

2. **Use the Network panel**
   - Check every API call
   - Verify request/response
   - Monitor performance

3. **Learn keyboard shortcuts**
   - Faster workflow
   - More efficient
   - Professional

4. **Use breakpoints, not console.log**
   - More powerful
   - See all variables
   - Step through code

5. **Test on real devices**
   - Emulation is good but not perfect
   - Real device issues differ
   - Use remote debugging

6. **Run Lighthouse regularly**
   - Catch issues early
   - Improve performance
   - Better user experience

## Practical Exercises

### Exercise 1: Inspect This Page

```
1. Open DevTools (F12)
2. Use element picker
3. Select different elements
4. View their HTML and CSS
5. Try editing values
6. See changes live
```

### Exercise 2: Debug Network

```
1. Open Network panel
2. Visit your favorite website
3. See all requests
4. Find largest resource
5. Find slowest request
6. Check response headers
```

### Exercise 3: Test Performance

```
1. Run Lighthouse on a website
2. Check performance score
3. Read opportunities
4. Understand suggestions
```

### Exercise 4: Mobile Testing

```
1. Click device toolbar (Ctrl+Shift+M)
2. Select "iPhone 12"
3. Reload page
4. Test navigation
5. Try different devices
```

## Key Takeaways

1. **DevTools are essential** for web development
2. **Elements panel** for HTML/CSS debugging
3. **Console** for JavaScript errors and testing
4. **Sources** for JavaScript debugging
5. **Network** for API and performance analysis
6. **Application** for storage inspection
7. **Lighthouse** for automated audits
8. **Learn shortcuts** for efficiency
9. **Use breakpoints** instead of console.log
10. **Test on real devices** when possible

## Next Steps

Now dive deeper into specific panels:
- [Lesson 15: Console Mastery](./15-console-mastery.md)
- [Lesson 16: Network Debugging](./16-network-debugging.md)
- [Lesson 17: Performance Profiling](./17-performance-profiling.md)

---

**Practice**: Open DevTools right now and explore every panel. Get comfortable with the interface!
