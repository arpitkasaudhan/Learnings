# Lesson 16: Network Debugging with DevTools

## Introduction to Network Tab

The **Network tab** in Chrome DevTools shows all network requests made by your application, helping you debug API calls, optimize performance, and understand data flow.

### Opening Network Tab

```
Chrome DevTools:
1. Press F12 or Ctrl+Shift+I (Cmd+Opt+I on Mac)
2. Click "Network" tab
3. Reload page to see all requests (Ctrl+R)
```

### Network Panel Overview

```
Network Tab Layout:
┌─────────────────────────────────────────────────────┐
│ [🔴] [🚫] [🔍] [⚙️] Filter: [All ▼] [Search...]      │
├─────────────────────────────────────────────────────┤
│ Name          Status  Type   Size    Time  Waterfall│
├─────────────────────────────────────────────────────┤
│ index.html    200     doc    12KB    100ms ████     │
│ styles.css    200     css    5KB     50ms  ██       │
│ script.js     200     js     50KB    200ms ██████   │
│ api/users     200     xhr    2KB     300ms █████████│
│ logo.png      200     img    25KB    150ms ████     │
└─────────────────────────────────────────────────────┘

Controls:
🔴 Record: Start/stop recording network activity
🚫 Clear: Clear all requests
🔍 Filter: Filter by type (XHR, JS, CSS, etc.)
⚙️ Settings: Network conditions, throttling, etc.
```

## Understanding Request Information

### Request Columns

**Name**: Resource name/URL
```
index.html
api/users?page=1
https://cdn.example.com/logo.png
```

**Status**: HTTP status code
```
200: OK (success)
201: Created (resource created)
204: No Content (success, no response body)
301: Moved Permanently (redirect)
302: Found (temporary redirect)
304: Not Modified (cached version is valid)
400: Bad Request (client error)
401: Unauthorized (authentication required)
403: Forbidden (no permission)
404: Not Found (resource doesn't exist)
500: Internal Server Error (server error)
502: Bad Gateway (upstream server error)
503: Service Unavailable (server overloaded)
```

**Type**: Request type
```
document: HTML pages
stylesheet: CSS files
script: JavaScript files
xhr: AJAX/Fetch requests
img: Images
font: Font files
websocket: WebSocket connections
media: Video/audio
```

**Size**: Response size
```
Actual size downloaded (e.g., 25KB)
(from cache) - served from cache
(from service worker) - served by service worker
```

**Time**: Request duration
```
Total time from request start to completion
Includes: DNS lookup, connection, SSL, waiting, download
```

**Waterfall**: Visual timeline
```
Shows when request started/completed relative to page load
Colors indicate different phases:
- Gray: Queued/stalled
- Green: DNS lookup
- Orange: Initial connection
- Purple: SSL/TLS
- Blue: Sending request
- Green: Waiting (TTFB - Time To First Byte)
- Blue: Downloading content
```

### Request Details Panel

Click on any request to see detailed information:

#### Headers Tab

```
General:
  Request URL: https://api.example.com/users
  Request Method: GET
  Status Code: 200 OK
  Remote Address: 192.0.2.1:443

Response Headers:
  content-type: application/json
  cache-control: max-age=3600
  content-length: 1234
  etag: "abc123"

Request Headers:
  accept: application/json
  authorization: Bearer eyJhbG...
  user-agent: Mozilla/5.0...
  cookie: sessionId=abc123
```

**Important Headers**:

```javascript
// Request Headers
Accept: application/json               // What format client expects
Authorization: Bearer <token>          // Authentication credentials
Content-Type: application/json         // Format of request body
Cookie: sessionId=abc123              // Cookies sent to server
User-Agent: Mozilla/5.0...            // Browser/device info
Referer: https://example.com/page     // Where request came from

// Response Headers
Content-Type: application/json         // Format of response
Cache-Control: max-age=3600           // Caching instructions
ETag: "abc123"                        // Resource version identifier
Set-Cookie: sessionId=xyz             // Set cookie on client
Access-Control-Allow-Origin: *        // CORS policy
```

#### Preview Tab

```
Shows formatted response:
- JSON: Pretty-printed with expand/collapse
- HTML: Rendered preview
- Images: Image preview
- Text: Plain text
```

#### Response Tab

```
Shows raw response data:
- Exactly what server sent
- Useful for copying/debugging
```

#### Timing Tab

```
Shows detailed timing breakdown:

Queued at 0ms             - When request was queued
Started at 5ms            - When request actually started
Queueing: 5ms            - Time waiting in queue
Stalled: 10ms            - Time stalled before starting
DNS Lookup: 20ms         - Domain name resolution
Initial Connection: 50ms  - TCP handshake
SSL: 100ms               - SSL/TLS negotiation
Request Sent: 1ms        - Time to send request
Waiting (TTFB): 200ms    - Time waiting for first byte
Content Download: 50ms    - Time downloading response

Total: 436ms
```

#### Cookies Tab

```
Shows cookies sent/received:

Request Cookies:
  sessionId: abc123
  theme: dark

Response Cookies:
  newCookie: value; Expires: ...
```

## Filtering and Searching

### Filter by Type

```
All: Show all requests
XHR: AJAX/Fetch requests only
JS: JavaScript files
CSS: Stylesheets
Img: Images
Media: Audio/video
Font: Font files
Doc: HTML documents
WS: WebSockets
Manifest: Web app manifests
Other: Everything else
```

**Click to filter**:
```
Click "XHR" → See only API calls
Click "JS" → See only JavaScript files
Click multiple → See multiple types
```

### Filter by Text

```
Search box: Filter by URL/name
Examples:
  "api" → Show URLs containing "api"
  "status-code:404" → Show 404 errors
  "method:POST" → Show POST requests
  "domain:api.example.com" → Show specific domain
  "larger-than:1M" → Show files > 1MB
```

### Filter by Properties

```
Filter syntax:
  domain:*.example.com    - Specific domain
  method:POST             - HTTP method
  status-code:200         - Status code
  mime-type:image/png     - Content type
  has-response-header:set-cookie  - Has specific header
  larger-than:100k        - Size > 100KB
  -domain:cdn.example.com - Exclude domain (minus sign)
```

**Examples**:
```
Find failed requests:
  status-code:404
  status-code:500

Find large files:
  larger-than:1M

Find API calls:
  method:POST
  domain:api.example.com

Find slow requests:
  longer-than:1s
```

## Analyzing Request/Response

### Analyzing API Calls

```javascript
// Example: Debugging failed API call

// 1. Check request details
Request URL: https://api.example.com/users
Method: POST
Status: 400 Bad Request

// 2. Check request payload (Payload tab)
{
  "name": "John",
  "email": "invalid-email"  // ❌ Missing @ symbol
}

// 3. Check response (Response tab)
{
  "error": "Invalid email format",
  "field": "email"
}

// 4. Fix request
{
  "name": "John",
  "email": "john@example.com"  // ✅ Fixed
}
```

### Debugging CORS Issues

```
CORS Error in Console:
Access to fetch at 'https://api.example.com/data' from origin
'https://myapp.com' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present

Network Tab:
1. Look at failed request
2. Check Response Headers:
   ❌ Missing: Access-Control-Allow-Origin

3. Expected headers (from server):
   ✅ Access-Control-Allow-Origin: https://myapp.com
   ✅ Access-Control-Allow-Methods: GET, POST
   ✅ Access-Control-Allow-Headers: Content-Type, Authorization

Fix on server:
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://myapp.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
```

### Analyzing Authentication Issues

```
401 Unauthorized:

1. Check Request Headers:
   ❌ Missing: Authorization: Bearer <token>

2. Check if token is included:
   fetch('/api/data', {
     headers: {
       'Authorization': `Bearer ${token}`  // ✅ Add token
     }
   });

3. Check token validity:
   - Is token expired?
   - Is token format correct?
   - Check Response for details:
     { "error": "Token expired" }
```

## Network Timing Waterfall

### Understanding Waterfall Phases

```
Request Timeline:
┌─────────────────────────────────────────────────────┐
│ [Gray: Queueing] [Green: DNS] [Orange: Connect]    │
│ [Purple: SSL] [Blue: Send] [Green: Wait] [Blue: DL]│
└─────────────────────────────────────────────────────┘

Phases:
1. Queueing (Gray):
   - Request waiting in queue
   - Browser limit: 6 connections per domain
   - Solution: Use CDN for assets (different domain)

2. Stalled (Gray):
   - Time before request can be sent
   - Waiting for available connection
   - Solution: Reduce concurrent requests

3. DNS Lookup (Green):
   - Resolving domain to IP address
   - First request to domain is slow
   - Solution: DNS prefetch, use same domain

4. Initial Connection (Orange):
   - TCP handshake (SYN, SYN-ACK, ACK)
   - Solution: Keep-alive connections, HTTP/2

5. SSL/TLS (Purple):
   - SSL handshake for HTTPS
   - Solution: HTTP/2, TLS 1.3, session resumption

6. Request Sent (Blue):
   - Sending request to server
   - Usually very fast

7. Waiting (TTFB - Green):
   - Time to First Byte
   - Server processing time
   - High = slow server/database
   - Solution: Server optimization, caching

8. Content Download (Blue):
   - Downloading response
   - Large = big file or slow connection
   - Solution: Compression, smaller files
```

### Waterfall Analysis Examples

**Example 1: Slow Server Response**
```
Request: /api/users
┌────────────────────────────────────────────┐
│ [DNS: 5ms] [Connect: 20ms] [Wait: 2000ms!] │
│ [Download: 10ms]                            │
└────────────────────────────────────────────┘

Problem: Long "Waiting" (TTFB) - server is slow
Solution:
- Add database indexes
- Implement caching
- Optimize queries
```

**Example 2: Large File Download**
```
Request: /bundle.js
┌────────────────────────────────────────────┐
│ [DNS: 5ms] [Connect: 20ms] [Wait: 50ms]   │
│ [Download: 3000ms!]                         │
└────────────────────────────────────────────┘

Problem: Long download time - file too large
Solution:
- Enable gzip/brotli compression
- Code splitting
- Minification
```

**Example 3: Multiple SSL Handshakes**
```
Request 1: https://example.com/file1.js
┌────────────────────────────────────────┐
│ [DNS: 20ms] [Connect: 50ms] [SSL: 100ms]│
└────────────────────────────────────────┘

Request 2: https://example.com/file2.js
┌────────────────────────────────────────┐
│ [DNS: 0ms] [Connect: 50ms] [SSL: 100ms]│
└────────────────────────────────────────┘

Problem: SSL handshake repeated
Solution: HTTP/2 (multiplexing), connection reuse
```

## Network Throttling

### Simulating Slow Connections

```
1. Click "⚙️" (Settings) in Network tab
2. Select throttling preset:
   - Fast 3G: 1.6 Mbps down, 750 Kbps up
   - Slow 3G: 400 Kbps down, 400 Kbps up
   - Offline: No connection

3. Or create custom profile:
   - Download: 500 Kbps
   - Upload: 250 Kbps
   - Latency: 200ms
```

**Use Cases**:
```javascript
// Test how app performs on slow connections:

1. Load time on 3G
   - Do images load too slowly?
   - Are scripts blocking render?
   - Solution: Lazy loading, compression

2. Mobile experience
   - Is app usable on mobile network?
   - Loading indicators shown?
   - Solution: Progressive enhancement

3. Offline functionality
   - Does app handle network errors?
   - Service worker caching works?
   - Solution: Offline-first approach
```

### Testing with Offline Mode

```
1. Select "Offline" in throttling
2. Reload page
3. Check:
   - Does app show offline message?
   - Are cached resources loaded?
   - Do retries work properly?

Example: Offline-first app
if ('serviceWorker' in navigator) {
  window.addEventListener('offline', () => {
    showOfflineMessage();
  });

  window.addEventListener('online', () => {
    hideOfflineMessage();
    syncData();
  });
}
```

## Debugging Specific Scenarios

### 1. Debugging Fetch/AJAX Requests

```javascript
// In Network tab, filter by XHR/Fetch

// Example: Debug failed POST request
Request:
  URL: /api/users
  Method: POST
  Status: 400 Bad Request

Headers:
  Content-Type: application/json

Payload (Request body):
  {
    "name": "John",
    "age": "thirty"  // ❌ Should be number
  }

Response:
  {
    "error": "Validation failed",
    "details": {
      "age": "Must be a number"
    }
  }

Fix:
  {
    "name": "John",
    "age": 30  // ✅ Corrected
  }
```

### 2. Debugging WebSocket Connections

```
1. Filter by "WS" (WebSocket)
2. Click on WebSocket connection
3. Messages tab shows:
   ↑ Sent messages (green)
   ↓ Received messages (white)

Example:
WebSocket: wss://api.example.com/ws

Messages:
↑ {"type": "subscribe", "channel": "chat"}
↓ {"type": "confirmation", "channel": "chat"}
↓ {"type": "message", "text": "Hello!"}
↑ {"type": "message", "text": "Hi there!"}

Debugging:
- Check connection status (101 Switching Protocols)
- Verify message format
- Check for connection drops
```

### 3. Debugging Redirects

```
Request: /old-page
Status: 301 Moved Permanently
Location: /new-page

Chain:
/old-page → 301 → /new-page → 200 OK

Tips:
- Too many redirects slow down page load
- Check "Preserve log" to see redirect chain
- Optimize: Update links to point to final URL
```

### 4. Debugging Caching Issues

```
Scenario: Updated file not loading

1. Check Request Headers:
   If-None-Match: "abc123"  (ETag from previous request)

2. Check Response:
   Status: 304 Not Modified
   → Browser using cached version

3. Solutions:
   a) Hard refresh: Ctrl+Shift+R (bypasses cache)
   b) Disable cache: Check "Disable cache" in Network tab
   c) Clear specific cache: Right-click → Clear browser cache
   d) Update cache headers on server:
      Cache-Control: no-cache  (revalidate every time)
      Cache-Control: max-age=0 (expire immediately)

4. Check cache headers:
   Cache-Control: max-age=3600  (cache for 1 hour)
   ETag: "abc123"               (version identifier)
```

### 5. Debugging Failed Image Loads

```
Request: /images/logo.png
Status: 404 Not Found

Check:
1. URL correct?
   ✅ /images/logo.png
   ❌ /image/logo.png (typo)

2. File exists on server?
   Check server file system

3. CORS issue?
   Check: Access-Control-Allow-Origin header

4. Authentication required?
   Check: 401 Unauthorized status
```

## Copy/Export Requests

### Copy as cURL

```
Right-click request → Copy → Copy as cURL

Output:
curl 'https://api.example.com/users' \
  -H 'authorization: Bearer eyJhbG...' \
  -H 'content-type: application/json' \
  --data-raw '{"name":"John"}' \
  --compressed

Use in terminal to test API independently:
$ curl 'https://api.example.com/users' ...
```

### Copy as Fetch

```
Right-click request → Copy → Copy as fetch

Output:
fetch("https://api.example.com/users", {
  "headers": {
    "authorization": "Bearer eyJhbG...",
    "content-type": "application/json"
  },
  "body": "{\"name\":\"John\"}",
  "method": "POST"
});

Use in browser console to test API:
> await fetch(...)
```

### Copy Response

```
Right-click request → Copy → Copy response

Output:
{"users": [...]}

Use to:
- Save sample data
- Share with team
- Create mock data
```

### Export HAR

```
Right-click in Network tab → Save all as HAR with content

HAR (HTTP Archive):
- JSON format with all requests/responses
- Share with team for debugging
- Analyze with tools (har analyzer)
- Import in Postman/Insomnia

Use cases:
- Performance analysis
- Bug reports
- Load testing scenarios
```

## Best Practices

### 1. Always Check Network Tab When:

```
✓ API calls fail
✓ Page loads slowly
✓ Images don't load
✓ CORS errors occur
✓ Authentication fails
✓ WebSocket disconnects
✓ Resources 404
```

### 2. Use Filters Effectively

```javascript
// Find slow requests
longer-than:1s

// Find large files
larger-than:1M

// Find errors
status-code:4* status-code:5*

// Find API calls
method:POST method:PUT

// Exclude CDN
-domain:cdn.example.com
```

### 3. Preserve Log Across Navigations

```
✓ Check "Preserve log" checkbox
  - Keeps requests when page navigates
  - Essential for debugging redirects
  - Useful for multi-page flows
```

### 4. Disable Cache During Development

```
✓ Check "Disable cache" checkbox
  - Ensures latest code is loaded
  - Prevents caching issues
  - Only active when DevTools open
```

## Key Takeaways

1. **Network tab** shows all requests made by your app
2. **Status codes** indicate success/failure
3. **Headers** contain important metadata
4. **Timing** helps identify performance bottlenecks
5. **Waterfall** visualizes request timeline
6. **Throttling** tests slow connections
7. **Filter** to focus on specific request types
8. **Copy as cURL/Fetch** to reproduce requests

## Exercises

### Exercise 1: Debug API Call

Find and fix issues in these scenarios:
1. POST request returns 400 Bad Request
2. GET request returns 401 Unauthorized
3. CORS error when calling external API

### Exercise 2: Performance Analysis

1. Find requests taking > 1 second
2. Identify largest files
3. Calculate total page load time
4. Suggest optimizations

### Exercise 3: Network Throttling

1. Test app on Slow 3G
2. Identify slow-loading resources
3. Implement loading indicators

## Next Steps

In [Lesson 17: Performance Profiling](./17-performance-profiling.md), we'll learn:
- Performance tab usage
- CPU profiling
- Identifying bottlenecks
- Frame rate analysis
- Lighthouse audits

---

**Practice**: Debug a failed API call in your application using Network tab!
