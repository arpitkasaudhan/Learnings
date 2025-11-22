# Lesson 06: API Design (REST & GraphQL)

## What is an API?

**API** = Application Programming Interface
**In web context**: How client and server communicate

**Example**:
```
Client: "Give me user #1's quotes"
API: GET /api/users/1/quotes
Server: Returns JSON with quotes
```

---

## REST API Design

**REST** = Representational State Transfer
**Key Principles**:
1. Client-Server separation
2. Stateless (no session on server)
3. Cacheable
4. Uniform interface (HTTP methods)
5. Layered system

---

### HTTP Methods

| Method | Purpose | Idempotent | Safe |
|--------|---------|------------|------|
| **GET** | Read data | ✅ | ✅ |
| **POST** | Create data | ❌ | ❌ |
| **PUT** | Update (replace) | ✅ | ❌ |
| **PATCH** | Update (partial) | ❌ | ❌ |
| **DELETE** | Delete data | ✅ | ❌ |

**Idempotent** = Same result if called multiple times
**Safe** = Doesn't modify data

---

### REST Endpoint Design

**VahanHelp API**:

```
# Authentication
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout

# Users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id

# Quotes
GET    /api/quotes           # List all quotes (with pagination)
GET    /api/quotes/:id       # Get specific quote
POST   /api/quotes           # Create new quote
PUT    /api/quotes/:id       # Update quote
DELETE /api/quotes/:id       # Delete quote

# Nested resources
GET    /api/users/:id/quotes        # All quotes for a user
GET    /api/quotes/:id/providers    # Providers for a quote
POST   /api/quotes/:id/save         # Save quote as favorite

# Filtering & Pagination
GET    /api/quotes?status=active&page=2&limit=20
GET    /api/quotes?carMake=Honda&sort=amount&order=asc
```

---

### REST Best Practices

#### 1. **Use Nouns, Not Verbs**

❌ Bad:
```
POST /api/createQuote
GET  /api/getQuote/123
POST /api/deleteQuote/123
```

✅ Good:
```
POST   /api/quotes
GET    /api/quotes/123
DELETE /api/quotes/123
```

---

#### 2. **Use Plural Nouns**

❌ Bad:
```
GET /api/quote
GET /api/quote/123
```

✅ Good:
```
GET /api/quotes
GET /api/quotes/123
```

---

#### 3. **HTTP Status Codes**

| Code | Meaning | Use When |
|------|---------|----------|
| **200** | OK | Successful GET, PUT, PATCH |
| **201** | Created | Successful POST |
| **204** | No Content | Successful DELETE |
| **400** | Bad Request | Invalid input |
| **401** | Unauthorized | Missing/invalid auth |
| **403** | Forbidden | Authenticated but no permission |
| **404** | Not Found | Resource doesn't exist |
| **409** | Conflict | Duplicate resource |
| **422** | Unprocessable Entity | Validation failed |
| **429** | Too Many Requests | Rate limit exceeded |
| **500** | Server Error | Unexpected error |
| **503** | Service Unavailable | Server down/maintenance |

---

#### 4. **Consistent Response Format**

**Success Response**:
```json
{
  "success": true,
  "data": {
    "id": 123,
    "carMake": "Honda",
    "carModel": "Civic",
    "amount": 15000
  }
}
```

**Error Response**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Car year must be between 1900 and 2024",
    "field": "carYear"
  }
}
```

**List Response with Pagination**:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

### VahanHelp REST API Implementation

**Create Quote**:
```javascript
// POST /api/quotes
app.post('/api/quotes', authenticate, async (req, res) => {
  try {
    // Validate input
    const { carMake, carModel, carYear, coverageType } = req.body;

    if (!carMake || !carModel || !carYear) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Missing required fields'
        }
      });
    }

    // Create quote
    const quote = await Quote.create({
      userId: req.user.id,
      carMake,
      carModel,
      carYear,
      coverageType
    });

    // Fetch quotes from providers (async)
    await fetchProviderQuotes(quote.id);

    res.status(201).json({
      success: true,
      data: quote
    });
  } catch (err) {
    logger.error('Quote creation failed', { error: err.message });
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to create quote'
      }
    });
  }
});
```

**Get Quotes with Filters**:
```javascript
// GET /api/quotes?status=active&carMake=Honda&page=1&limit=20
app.get('/api/quotes', authenticate, async (req, res) => {
  try {
    const {
      status = 'active',
      carMake,
      page = 1,
      limit = 20
    } = req.query;

    // Build query
    const query = {
      userId: req.user.id,
      status
    };

    if (carMake) {
      query.carMake = carMake;
    }

    // Pagination
    const offset = (page - 1) * limit;

    const [quotes, total] = await Promise.all([
      Quote.find(query).limit(limit).skip(offset).sort({ createdAt: -1 }),
      Quote.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: quotes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    logger.error('Quote fetch failed', { error: err.message });
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch quotes'
      }
    });
  }
});
```

---

### API Versioning

**Why version?**
- Breaking changes
- Support old clients
- Gradual migration

**Versioning Strategies**:

**1. URL Path** (Recommended):
```
GET /api/v1/quotes
GET /api/v2/quotes
```

**2. Header**:
```
GET /api/quotes
Header: Accept-Version: v1
```

**3. Query Parameter**:
```
GET /api/quotes?version=1
```

**VahanHelp Example**:
```javascript
// v1: Simple quote
app.get('/api/v1/quotes/:id', (req, res) => {
  const quote = await Quote.findById(req.params.id);
  res.json({ data: quote });
});

// v2: Quote with provider details
app.get('/api/v2/quotes/:id', async (req, res) => {
  const quote = await Quote.findById(req.params.id);
  const providers = await fetchProviderDetails(quote.providerIds);
  res.json({
    data: {
      ...quote,
      providers
    }
  });
});
```

---

### Rate Limiting

**Protect API** from abuse:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later'
    }
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
});

app.use('/api/', limiter);
```

**Response Headers**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1642531200
```

---

### Authentication

**JWT (JSON Web Token)** is most common:

```javascript
const jwt = require('jsonwebtoken');

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate credentials
  const user = await User.findOne({ email });
  if (!user || !await bcrypt.compare(password, user.passwordHash)) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password'
      }
    });
  }

  // Generate token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    data: {
      user: { id: user.id, email: user.email, name: user.name },
      token
    }
  });
});

// Middleware to protect routes
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({
        success: false,
        error: { code: 'NO_TOKEN', message: 'Authentication required' }
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'Invalid token' }
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' }
    });
  }
};

// Use middleware
app.get('/api/quotes', authenticate, async (req, res) => {
  // req.user is available here
  const quotes = await Quote.find({ userId: req.user.id });
  res.json({ success: true, data: quotes });
});
```

---

## GraphQL API Design

**GraphQL** = Query language for APIs
**Benefits**:
- Request exactly what you need
- Single endpoint
- Strong typing

---

### GraphQL vs REST

**REST**:
```
GET /api/users/1                 # Get user
GET /api/users/1/quotes          # Get user's quotes
GET /api/quotes/101              # Get quote details
GET /api/quotes/101/providers    # Get providers
```
**4 requests** with potential over-fetching

**GraphQL**:
```graphql
query {
  user(id: 1) {
    name
    email
    quotes {
      id
      carMake
      carModel
      amount
      providers {
        name
        price
      }
    }
  }
}
```
**1 request** with exact data needed

---

### GraphQL Schema

**VahanHelp Schema**:

```graphql
type User {
  id: ID!
  email: String!
  name: String
  quotes: [Quote!]!
  createdAt: String!
}

type Quote {
  id: ID!
  user: User!
  carMake: String!
  carModel: String!
  carYear: Int!
  coverageType: String
  amount: Float
  providers: [Provider!]!
  status: QuoteStatus!
  createdAt: String!
}

type Provider {
  id: ID!
  name: String!
  price: Float!
  coverage: String!
}

enum QuoteStatus {
  PENDING
  ACTIVE
  EXPIRED
}

type Query {
  user(id: ID!): User
  quote(id: ID!): Quote
  quotes(status: QuoteStatus, limit: Int, offset: Int): [Quote!]!
}

type Mutation {
  createQuote(input: QuoteInput!): Quote!
  updateQuote(id: ID!, input: QuoteInput!): Quote!
  deleteQuote(id: ID!): Boolean!
}

input QuoteInput {
  carMake: String!
  carModel: String!
  carYear: Int!
  coverageType: String
}
```

---

### GraphQL Implementation

```javascript
const { ApolloServer, gql } = require('apollo-server-express');

// Resolvers
const resolvers = {
  Query: {
    user: async (parent, { id }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await User.findById(id);
    },

    quotes: async (parent, { status, limit = 20, offset = 0 }, context) => {
      if (!context.user) throw new Error('Not authenticated');

      const query = { userId: context.user.id };
      if (status) query.status = status;

      return await Quote.find(query).limit(limit).skip(offset);
    }
  },

  Mutation: {
    createQuote: async (parent, { input }, context) => {
      if (!context.user) throw new Error('Not authenticated');

      const quote = await Quote.create({
        ...input,
        userId: context.user.id
      });

      return quote;
    }
  },

  Quote: {
    user: async (parent) => {
      return await User.findById(parent.userId);
    },

    providers: async (parent) => {
      return await fetchProviderQuotes(parent.id);
    }
  }
};

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return {};

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    return { user };
  }
});

// Apply to Express
await server.start();
server.applyMiddleware({ app, path: '/graphql' });
```

**Client Query**:
```graphql
query GetUserQuotes($userId: ID!) {
  user(id: $userId) {
    name
    quotes {
      id
      carMake
      carModel
      amount
    }
  }
}
```

---

## REST vs GraphQL: When to Use?

### Use REST when:
✅ Simple CRUD operations
✅ Cacheable with HTTP
✅ Team familiar with REST
✅ Mobile app (bandwidth not critical)

### Use GraphQL when:
✅ Complex, nested data
✅ Multiple client types (web, mobile, desktop)
✅ Frequent changes to data requirements
✅ Need to minimize requests

---

## API Documentation

**Always document your API!**

### Tools:
1. **Swagger/OpenAPI** (REST)
2. **GraphQL Playground** (GraphQL)
3. **Postman Collections**

**Swagger Example**:
```yaml
openapi: 3.0.0
info:
  title: VahanHelp API
  version: 1.0.0

paths:
  /api/quotes:
    get:
      summary: List all quotes
      parameters:
        - name: status
          in: query
          schema:
            type: string
            enum: [active, expired]
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Quote'
    post:
      summary: Create new quote
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/QuoteInput'
      responses:
        '201':
          description: Created

components:
  schemas:
    Quote:
      type: object
      properties:
        id:
          type: integer
        carMake:
          type: string
        carModel:
          type: string
        amount:
          type: number
```

---

## Practice Exercise

**Design REST API for a Blog**

**Requirements**:
- Users can create, read, update, delete posts
- Users can comment on posts
- Users can like posts
- Posts can have tags

**Your Task**:
1. Design endpoints
2. Choose HTTP methods
3. Define request/response format

### Sample Answer

```
# Authentication
POST   /api/auth/register
POST   /api/auth/login

# Posts
GET    /api/posts                    # List posts (with pagination)
GET    /api/posts/:id                # Get post
POST   /api/posts                    # Create post
PUT    /api/posts/:id                # Update post
DELETE /api/posts/:id                # Delete post

# Comments
GET    /api/posts/:id/comments       # List comments
POST   /api/posts/:id/comments       # Create comment
DELETE /api/comments/:id             # Delete comment

# Likes
POST   /api/posts/:id/like           # Like post
DELETE /api/posts/:id/like           # Unlike post

# Tags
GET    /api/tags                     # List tags
GET    /api/tags/:slug/posts         # Posts with tag

# Filtering
GET    /api/posts?tag=tech&author=john&sort=createdAt&order=desc
```

---

## Summary

**REST API Best Practices**:
- ✅ Use nouns, plural names
- ✅ HTTP methods correctly
- ✅ Proper status codes
- ✅ Consistent response format
- ✅ Versioning
- ✅ Authentication (JWT)
- ✅ Rate limiting
- ✅ Documentation

**GraphQL**:
- Query exactly what you need
- Single endpoint
- Great for complex data

**VahanHelp Choice**: REST for simplicity, consider GraphQL when complexity increases

---

**Next Lesson**: [07-load-balancing.md](07-load-balancing.md)

Learn how to distribute traffic across multiple servers!
