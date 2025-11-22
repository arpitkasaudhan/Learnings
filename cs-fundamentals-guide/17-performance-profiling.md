# Lesson 17: Performance Profiling with DevTools

## Introduction to Performance Profiling

**Performance profiling** helps you identify and fix performance bottlenecks in your web application by analyzing:
- CPU usage
- Memory consumption
- Rendering performance
- JavaScript execution
- Network activity
- Frame rate (FPS)

## Performance Tab Overview

### Opening Performance Tab

```
Chrome DevTools:
1. Press F12 (Ctrl+Shift+I on Windows/Linux, Cmd+Opt+I on Mac)
2. Click "Performance" tab
3. Click record button (🔴) or Ctrl+E
4. Perform actions in your app
5. Click stop button (⏹️)
6. Analyze results
```

### Performance Tab Layout

```
┌─────────────────────────────────────────────────────┐
│ [🔴] [⟳] [🗑️] Settings: [⚙️]                        │
├─────────────────────────────────────────────────────┤
│ FPS    ▓▓▓▓░░▓▓▓▓▓▓▓▓░░░▓▓▓                        │
│ CPU    ██████████████████████                       │
│ NET    ══════════════════════                       │
├─────────────────────────────────────────────────────┤
│ Main   ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇                     │
│        ├─ Function Call                             │
│        ├─ Parse HTML                                │
│        └─ Evaluate Script                           │
├─────────────────────────────────────────────────────┤
│ Bottom-Up | Call Tree | Event Log                   │
└─────────────────────────────────────────────────────┘

Sections:
- FPS: Frames per second (green = 60fps, red = dropped frames)
- CPU: CPU usage by category
- NET: Network activity
- Main: Main thread activity (JavaScript, rendering)
- Summary: Details about selected time range
```

## Understanding Performance Metrics

### Key Performance Metrics

**1. FPS (Frames Per Second)**
```
60 FPS = Smooth (16.67ms per frame)
30 FPS = Noticeable lag
<30 FPS = Janky/stuttering

Target: Consistent 60 FPS for smooth animations
```

**2. CPU Usage**
```
Colors in CPU chart:
- Blue: Loading (HTML parsing, network)
- Yellow: Scripting (JavaScript execution)
- Purple: Rendering (style, layout calculations)
- Green: Painting (drawing pixels)
- Gray: Other (idle, system)

High yellow = Too much JavaScript
High purple = Layout thrashing
High green = Paint issues
```

**3. Main Thread Activity**
```
Shows what's blocking the main thread:
- Long yellow bars = Slow JavaScript functions
- Multiple small tasks = Many small operations
- Empty gaps = Idle time (good!)

Goal: Short tasks, lots of idle time
```

## Recording a Performance Profile

### Basic Recording

```javascript
// 1. Open Performance tab
// 2. Click Record (🔴)
// 3. Perform action (e.g., scroll, click button, load page)
// 4. Click Stop (⏹️)
// 5. Analyze recording
```

### Page Load Performance

```
1. Ctrl+Shift+E → Start profiling and reload page
   (Records from page load start)

2. Wait for page to fully load

3. Stop recording

4. Analyze:
   - Total load time
   - Render-blocking resources
   - Long tasks
   - Layout shifts
```

### Runtime Performance

```
1. Click Record (🔴)

2. Interact with app:
   - Scroll page
   - Click buttons
   - Type in inputs
   - Animate elements

3. Stop recording

4. Analyze:
   - Frame rate drops
   - Long-running functions
   - Event handler performance
```

## Analyzing Performance Results

### 1. Identifying Bottlenecks

**Look for**:
```
✗ Red bars in FPS chart (dropped frames)
✗ Long yellow tasks (slow JavaScript)
✗ Layout thrashing (purple bars)
✗ Frequent garbage collection
✗ Tasks over 50ms (blocks user interaction)
```

**Example Analysis**:
```
FPS Chart:
┌─────────────────────────────────────┐
│ 60fps ▓▓▓▓░░░░░░▓▓▓▓▓▓              │
│           ↑ Frame drops (janky!)    │
└─────────────────────────────────────┘

Main Thread:
┌─────────────────────────────────────┐
│ ▇▇▇▇▇▇▇▇▇▇▇▇▇ (500ms)              │
│ Long task blocks UI                 │
└─────────────────────────────────────┘

Problem: JavaScript function taking 500ms
Solution: Optimize or split into smaller tasks
```

### 2. Finding Slow Functions

**Zoom into problematic area**:
```
1. Click and drag on timeline to zoom
2. Look at "Main" thread activity
3. Click on long yellow bars
4. See function details in Bottom-Up tab

Example:
Function: processData
Self Time: 450ms  (time in this function)
Total Time: 500ms (including child functions)

Source: app.js:123

Click → Opens source code at that line
```

**Bottom-Up Tab**:
```
Shows functions sorted by time spent:

Function          Self Time    Total Time
filterArray()     450ms        500ms      ← Slowest!
map()             30ms         50ms
updateUI()        10ms         10ms

Click function → See call stack
```

**Call Tree Tab**:
```
Shows function call hierarchy:

┌─ onClick()                    500ms
│  ├─ processData()             450ms  ← Main bottleneck
│  │  ├─ filterArray()          300ms
│  │  └─ sortArray()            150ms
│  └─ render()                  50ms
└─ (idle)
```

### 3. Detecting Layout Thrashing

**Layout thrashing** = Multiple forced reflows/repaints

```javascript
// ❌ BAD: Layout thrashing
for (let i = 0; i < 100; i++) {
  // Read: Forces layout calculation
  const height = element.offsetHeight;

  // Write: Invalidates layout
  element.style.height = (height + 10) + 'px';
}

// Performance profile shows:
// Purple bars (layout) after each iteration
┌─────────────────────────────────────┐
│ ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇               │
│ │││││││││││││││││││││ ← Many layouts│
└─────────────────────────────────────┘

// ✅ GOOD: Batch reads and writes
// Read all first
const heights = [];
for (let i = 0; i < 100; i++) {
  heights.push(element.offsetHeight);
}

// Then write all
for (let i = 0; i < 100; i++) {
  element.style.height = (heights[i] + 10) + 'px';
}

// Performance profile shows:
// Single layout calculation
┌─────────────────────────────────────┐
│ ▇                                   │
│ └ One layout ✓                      │
└─────────────────────────────────────┘
```

### 4. Analyzing Paint Performance

**Paint issues** = Expensive visual updates

```javascript
// High paint cost in Performance tab:
// Green bars indicate painting

Common causes:
1. Large elements being repainted
2. Complex CSS (shadows, gradients, blur)
3. Changing many elements at once

Example:
┌─────────────────────────────────────┐
│ Main  ▇▇▇▇▇▇▇▇▇▇                   │
│ Paint ████████████ (200ms)          │
│       ↑ Expensive paint!             │
└─────────────────────────────────────┘

Solutions:
1. Use CSS transforms (GPU-accelerated)
   transform: translateX(100px);  ✓
   left: 100px;                   ✗

2. Use will-change for animated elements
   will-change: transform;

3. Reduce paint area
   Use contain: layout paint;

4. Simplify styles
   Avoid: box-shadow, blur, gradients on large elements
```

## CPU Profiling

### JavaScript Profiler

```
1. Open Performance tab
2. Record profile
3. Stop recording
4. Click on JavaScript call in timeline
5. See flame chart (function call hierarchy)

Flame Chart:
┌─────────────────────────────────────┐
│ mainFunction()                      │
│ ┌───────────────────┐               │
│ │ expensiveFunc()   │               │
│ │ ┌─────────┐       │               │
│ │ │ loop()  │       │               │
│ │ └─────────┘       │               │
│ └───────────────────┘               │
└─────────────────────────────────────┘

Width = time spent
Deeper = more nested calls
Click → See source code
```

### Finding CPU-Intensive Operations

```javascript
// Example: Slow rendering

// Before optimization:
function render() {
  const items = getData();  // 10ms
  const filtered = items.filter(heavyFilter);  // 400ms ← Bottleneck!
  const sorted = filtered.sort(compare);  // 50ms
  displayItems(sorted);  // 20ms
}

// Performance profile shows:
// heavyFilter() takes 400ms

// After optimization:
function render() {
  const items = getData();  // 10ms

  // Use memoization
  const filtered = useMemo(
    () => items.filter(heavyFilter),
    [items]  // Only recompute if items change
  );  // 0ms (cached)

  const sorted = filtered.sort(compare);  // 50ms
  displayItems(sorted);  // 20ms
}

// Total: 480ms → 80ms (6x faster!)
```

## Frame Rate Analysis

### Understanding 60 FPS

```
60 FPS = 16.67ms per frame budget

Frame budget breakdown:
┌─────────────────────────────────┐
│ JavaScript: 3-4ms               │
│ Layout: 2-3ms                   │
│ Paint: 2-3ms                    │
│ Compositing: 2-3ms              │
│ Idle: 5-7ms (buffer)            │
└─────────────────────────────────┘

If total > 16.67ms → Frame drop (janky!)
```

### Detecting Jank

```
Jank = Choppy, stuttering animation

In Performance tab:
1. Look at FPS chart
2. Red/white bars = dropped frames
3. Zoom into dropped frame area
4. Identify long-running task

Example:
FPS Chart:
┌─────────────────────────────────┐
│ ▓▓▓▓░░▓▓▓▓                     │
│     ↑ Frame dropped             │
└─────────────────────────────────┘

Main Thread (zoomed):
┌─────────────────────────────────┐
│ ▇▇▇▇▇▇▇▇ (50ms)                │
│ processClick() ← Blocks frame   │
└─────────────────────────────────┘

Fix: Optimize processClick() or debounce it
```

### Optimizing Animations

```javascript
// ❌ BAD: JavaScript animation (janky)
function animate() {
  element.style.left = (position + 1) + 'px';
  requestAnimationFrame(animate);
}

// Performance: Many layout recalculations
┌─────────────────────────────────┐
│ Layout ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇         │
└─────────────────────────────────┘

// ✅ GOOD: CSS animation (smooth)
element.style.transform = `translateX(${position}px)`;

// Performance: GPU-accelerated, no layout
┌─────────────────────────────────┐
│ Composite ▇                     │
└─────────────────────────────────┘

// Or use CSS keyframes:
@keyframes slide {
  from { transform: translateX(0); }
  to { transform: translateX(100px); }
}
.element {
  animation: slide 1s ease-in-out;
}
```

## Lighthouse Audits

### Running Lighthouse

```
1. F12 → Lighthouse tab
2. Select categories:
   ☑ Performance
   ☑ Accessibility
   ☑ Best Practices
   ☑ SEO
   ☑ PWA

3. Device: Mobile / Desktop
4. Click "Analyze page load"
5. Wait for report
```

### Understanding Lighthouse Metrics

**Core Web Vitals**:
```
1. First Contentful Paint (FCP)
   - When first content appears
   - Target: < 1.8s
   - Good: User sees something quickly

2. Largest Contentful Paint (LCP)
   - When main content loads
   - Target: < 2.5s
   - Good: Page appears loaded

3. Cumulative Layout Shift (CLS)
   - Visual stability (no jumping content)
   - Target: < 0.1
   - Good: Content doesn't shift unexpectedly

4. First Input Delay (FID)
   - Time until page responds to input
   - Target: < 100ms
   - Good: Page is interactive quickly

5. Total Blocking Time (TBT)
   - Time main thread is blocked
   - Target: < 200ms
   - Good: Page responds smoothly

6. Speed Index
   - How quickly content is visually displayed
   - Target: < 3.4s
   - Good: Page loads quickly
```

### Lighthouse Recommendations

**Example Report**:
```
Performance Score: 65/100

Opportunities:
1. Eliminate render-blocking resources (0.8s)
   - Defer non-critical CSS/JS
   - Inline critical CSS

2. Properly size images (1.2s)
   - Serve responsive images
   - Use modern formats (WebP)

3. Minify JavaScript (0.5s)
   - Remove unused code
   - Minify and compress

4. Reduce unused JavaScript (1.5s)
   - Code splitting
   - Lazy loading

5. Use HTTP/2 (0.3s)
   - Enable on server

Total potential savings: 4.3s
```

## Performance Optimization Techniques

### 1. Code Splitting

```javascript
// ❌ BAD: Load everything upfront
import { Chart } from 'chart.js';
import { Editor } from 'editor';
import { Analytics } from 'analytics';

// All loaded on page load (slow!)

// ✅ GOOD: Load on demand
function openChart() {
  import('chart.js').then(({ Chart }) => {
    new Chart(ctx, config);
  });
}

function openEditor() {
  import('editor').then(({ Editor }) => {
    new Editor(element);
  });
}

// Only load when needed (fast initial load!)
```

### 2. Lazy Loading

```javascript
// ✅ Lazy load images
<img
  src="placeholder.jpg"
  data-src="actual-image.jpg"
  loading="lazy"
/>

// ✅ Lazy load components (React)
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### 3. Debouncing and Throttling

```javascript
// ❌ BAD: Handler called on every scroll (100s of times)
window.addEventListener('scroll', handleScroll);

// ✅ GOOD: Throttle (call at most once per 100ms)
window.addEventListener('scroll', throttle(handleScroll, 100));

// ✅ GOOD: Debounce (call only after scrolling stops)
window.addEventListener('scroll', debounce(handleScroll, 100));

function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}
```

### 4. Web Workers for Heavy Computations

```javascript
// ❌ BAD: Heavy computation blocks UI
function processData(data) {
  // Complex calculation taking 2 seconds
  const result = complexCalculation(data);
  updateUI(result);
}

// ✅ GOOD: Use Web Worker
// main.js
const worker = new Worker('worker.js');

worker.postMessage(data);

worker.onmessage = (e) => {
  updateUI(e.data);  // UI not blocked!
};

// worker.js
self.onmessage = (e) => {
  const result = complexCalculation(e.data);
  self.postMessage(result);
};
```

### 5. Virtual Scrolling

```javascript
// ❌ BAD: Render 10,000 items (slow!)
function List({ items }) {
  return (
    <div>
      {items.map(item => <Item key={item.id} {...item} />)}
    </div>
  );
}

// ✅ GOOD: Virtual scrolling (render only visible items)
import { FixedSizeList } from 'react-window';

function List({ items }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {({ index, style }) => (
        <Item style={style} {...items[index]} />
      )}
    </FixedSizeList>
  );
}
```

### 6. Memoization

```javascript
// ❌ BAD: Recalculate on every render
function ExpensiveComponent({ items }) {
  const filtered = items.filter(expensiveFilter);
  const sorted = filtered.sort(expensiveSort);

  return <div>{sorted.map(renderItem)}</div>;
}

// ✅ GOOD: Memoize expensive calculations
function ExpensiveComponent({ items }) {
  const filtered = useMemo(
    () => items.filter(expensiveFilter),
    [items]
  );

  const sorted = useMemo(
    () => filtered.sort(expensiveSort),
    [filtered]
  );

  return <div>{sorted.map(renderItem)}</div>;
}
```

## Performance Budget

### Setting Performance Budgets

```javascript
// Define performance budgets in your project:

Performance Budget:
- Page load time: < 3s
- Time to Interactive: < 5s
- Total JavaScript: < 300KB
- Total CSS: < 100KB
- Total Images: < 1MB
- Lighthouse score: > 90

// Monitor in CI/CD:
// Use Lighthouse CI to fail builds if budget exceeded
```

## Best Practices

### 1. Profile Regularly

```
✓ Profile during development
✓ Profile on different devices
✓ Profile with slow networks
✓ Profile with large datasets
✓ Profile before and after optimization
```

### 2. Focus on User Experience

```
Priority metrics:
1. Time to Interactive (TTI)
2. First Input Delay (FID)
3. Largest Contentful Paint (LCP)
4. Cumulative Layout Shift (CLS)

These affect perceived performance
```

### 3. Optimize Critical Rendering Path

```
1. Minimize critical resources
   - Inline critical CSS
   - Defer non-critical JS

2. Minimize critical bytes
   - Minify, compress
   - Remove unused code

3. Minimize critical path length
   - Reduce number of roundtrips
   - Use HTTP/2
```

### 4. Test on Real Devices

```
✓ Test on low-end devices
✓ Test on slow networks (3G)
✓ Test on mobile devices
✓ Use Chrome DevTools device emulation
```

## Key Takeaways

1. **Performance tab** shows CPU, memory, and rendering performance
2. **60 FPS** requires frames under 16.67ms
3. **Lighthouse** provides automated audits and recommendations
4. **Long tasks** (>50ms) block user interaction
5. **Layout thrashing** causes performance issues
6. **Code splitting** and **lazy loading** improve load times
7. **Profiling** helps identify and fix bottlenecks

## Exercises

### Exercise 1: Profile Page Load

1. Record page load performance
2. Identify render-blocking resources
3. Measure Time to Interactive
4. Suggest optimizations

### Exercise 2: Find Bottlenecks

Profile this code and optimize:
```javascript
function processItems() {
  const items = getItems();  // 1000 items
  for (let item of items) {
    const height = item.element.offsetHeight;
    item.element.style.height = (height + 10) + 'px';
  }
}
```

### Exercise 3: Lighthouse Audit

1. Run Lighthouse audit on your app
2. Implement top 3 recommendations
3. Re-run audit
4. Compare scores

## Next Steps

In [Lesson 18: Advanced DevTools](./18-advanced-devtools.md), we'll learn:
- Sources tab and debugging
- Application tab deep dive
- Security tab
- Remote debugging
- DevTools tips and tricks

---

**Practice**: Profile your application and optimize the slowest operation!
