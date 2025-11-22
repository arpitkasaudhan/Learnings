# Lesson 02: Requirements Gathering

## Why Requirements Matter

**The #1 mistake** in system design: Jumping to solutions without understanding requirements.

**Good system design** starts with asking the right questions.

---

## Types of Requirements

### 1. **Functional Requirements**
What should the system **DO**?

**Examples**:
- User registration and login
- Create insurance quote
- Upload car images
- Compare quotes
- Make payment

### 2. **Non-Functional Requirements**
How should the system **PERFORM**?

**Examples**:
- Handle 10,000 users
- Respond in < 200ms
- 99.9% uptime
- Store data for 5 years
- Support mobile and web

---

## The Question Framework

### Step 1: Clarify the Problem

**Ask**:
- "What exactly are we building?"
- "Who are the users?"
- "What's the most important feature?"

**VahanHelp Example**:
```
Interviewer: Design VahanHelp.

You: Can you clarify what VahanHelp does? Is it:
     a) A platform to get car insurance quotes?
     b) A platform to buy insurance directly?
     c) Both?

Interviewer: Users get quotes from multiple providers and compare them.

You: Got it! So the core flow is:
     1. User enters car details
     2. System fetches quotes from providers
     3. User compares and selects best quote

     Is that correct?

Interviewer: Yes!
```

---

### Step 2: Identify Core Features

**Ask**:
- "What are the must-have features?"
- "What can we skip for MVP?"

**VahanHelp Core Features**:

**Must-Have (MVP)**:
1. ✅ User registration/login
2. ✅ Submit car details
3. ✅ Get insurance quotes
4. ✅ Compare quotes
5. ✅ Save favorite quotes

**Nice-to-Have (Future)**:
- ⏳ Payment processing
- ⏳ Policy management
- ⏳ Claims tracking
- ⏳ Notifications
- ⏳ Admin dashboard

**Out of Scope**:
- ❌ Insurance provider onboarding
- ❌ Underwriting logic
- ❌ Claims processing

---

### Step 3: Define Scale

**Ask**:
- "How many users?"
- "How many requests per day?"
- "Read-heavy or write-heavy?"

**Scale Questions**:

| Question | Why It Matters | VahanHelp Answer |
|----------|---------------|------------------|
| Daily Active Users (DAU)? | Server capacity | 10,000 users |
| Total users? | Database size | 100,000 users |
| Quotes per day? | API throughput | 5,000 quotes/day |
| Concurrent users? | Load balancing | 500 concurrent |
| Geographic regions? | CDN, latency | India only (for now) |
| Mobile vs web? | API design | 70% mobile, 30% web |

---

### Step 4: Performance Requirements

**Ask**:
- "What's acceptable latency?"
- "What's the uptime requirement?"
- "Any specific SLAs?"

**Performance Questions**:

| Metric | VahanHelp Target | Reasoning |
|--------|------------------|-----------|
| **API Response Time** | < 500ms | Users expect quick quotes |
| **Page Load Time** | < 2s | Keep users engaged |
| **Availability** | 99.9% | 8 hours downtime/year acceptable |
| **Data Durability** | 99.999999999% | Insurance data is critical |

**Calculation**:
```
99.9% availability = 0.1% downtime
= 365 days × 24 hours × 0.001
= 8.76 hours downtime per year
= ~43 minutes downtime per month
```

---

### Step 5: Data Requirements

**Ask**:
- "How much data will we store?"
- "How long to retain data?"
- "Any compliance requirements?"

**VahanHelp Data**:

**User Data**:
- 100,000 users × 1 KB = 100 MB

**Quote Data**:
- 5,000 quotes/day × 365 days = 1.8M quotes/year
- 1.8M × 5 KB = 9 GB/year

**Car Images** (if uploaded):
- 30% of quotes include images = 1,500 images/day
- 1,500 × 500 KB = 750 MB/day = 274 GB/year

**Total Storage (Year 1)**: ~300 GB

**Retention**:
- User data: Lifetime
- Quotes: 2 years
- Images: 1 year

**Compliance**:
- GDPR (if EU users)
- Data encryption at rest
- PII protection

---

### Step 6: Constraints

**Ask**:
- "Any budget constraints?"
- "Technology preferences?"
- "Team expertise?"
- "Timeline?"

**VahanHelp Constraints**:
- **Budget**: $500/month for infrastructure
- **Team**: 2 backend, 1 frontend, 1 DevOps
- **Timeline**: MVP in 3 months
- **Tech**: Team knows Node.js, PostgreSQL
- **Existing**: No legacy systems to integrate

---

## Requirements Document Template

### VahanHelp Requirements

#### 1. **Functional Requirements**

**Core Features**:
- [ ] User registration (email + password)
- [ ] User login (JWT authentication)
- [ ] Submit car details (make, model, year, location)
- [ ] Fetch quotes from 3+ insurance providers
- [ ] Display quotes with comparison
- [ ] Save quotes for later
- [ ] User profile management

**API Endpoints**:
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/me
PUT    /api/me

POST   /api/quotes          # Create quote request
GET    /api/quotes/:id      # Get quote details
GET    /api/quotes          # List user's quotes
POST   /api/quotes/:id/save # Save favorite quote
```

---

#### 2. **Non-Functional Requirements**

**Scale**:
- 10,000 DAU
- 100,000 total users
- 5,000 quotes/day
- 500 concurrent users

**Performance**:
- API response: < 500ms (p95)
- Database query: < 100ms
- External API timeout: 5 seconds
- Page load: < 2 seconds

**Availability**:
- Uptime: 99.9%
- RTO (Recovery Time Objective): 1 hour
- RPO (Recovery Point Objective): 24 hours

**Security**:
- HTTPS only
- JWT tokens expire in 7 days
- Password hashing (bcrypt)
- Rate limiting: 100 requests/min per IP
- CORS enabled for web app only

**Storage**:
- Year 1: 300 GB
- Year 3: 1 TB
- Backups: Daily, retained for 30 days

**Monitoring**:
- Response time metrics
- Error rate < 0.1%
- Real-time alerts for downtime

---

#### 3. **Data Model**

**Users Table**:
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Quotes Table**:
```sql
CREATE TABLE quotes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  car_make VARCHAR(100),
  car_model VARCHAR(100),
  car_year INTEGER,
  location VARCHAR(255),
  coverage_type VARCHAR(50),
  provider_quotes JSONB, -- Array of quote objects
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

#### 4. **External Dependencies**

| Service | Purpose | SLA | Timeout |
|---------|---------|-----|---------|
| Provider A API | Insurance quotes | 99% | 5s |
| Provider B API | Insurance quotes | 99% | 5s |
| Provider C API | Insurance quotes | 99% | 5s |
| SMS Gateway | OTP verification | 99.9% | 10s |
| Email Service | Notifications | 99.9% | 30s |

**Handling Failures**:
- If Provider A is down, still show quotes from B and C
- Cache provider responses for 1 hour
- Retry failed requests 3 times with exponential backoff

---

## Question Checklist

### Before You Start Designing

✅ **Functional**:
- [ ] What are the core features?
- [ ] What can be deferred to v2?
- [ ] Any specific user flows?

✅ **Scale**:
- [ ] How many users (DAU, MAU, total)?
- [ ] How many requests per day?
- [ ] Read-heavy or write-heavy?
- [ ] Expected growth rate?

✅ **Performance**:
- [ ] Latency requirements?
- [ ] Availability target?
- [ ] Peak traffic patterns?

✅ **Data**:
- [ ] How much data to store?
- [ ] Retention period?
- [ ] Compliance requirements?

✅ **Constraints**:
- [ ] Budget?
- [ ] Technology stack?
- [ ] Team size and expertise?
- [ ] Timeline?

✅ **Edge Cases**:
- [ ] What if external API is down?
- [ ] What if database is slow?
- [ ] How to handle duplicates?
- [ ] Rate limiting strategy?

---

## Common Mistakes

### ❌ Mistake 1: Not Asking Questions

```
Interviewer: Design Twitter.
You: *Immediately starts drawing architecture*
```

**Why it's bad**: You don't know what to optimize for.

### ✅ Fix:

```
You: Before I start, let me clarify:
     - Do we need to support tweets, retweets, likes, follows?
     - What scale? 100M users? 500M tweets/day?
     - Any specific features like trending topics?
     - Read-heavy or write-heavy?
```

---

### ❌ Mistake 2: Vague Requirements

```
You: We need to support "a lot of users."
```

**Why it's bad**: Can't estimate infrastructure.

### ✅ Fix:

```
You: Let me estimate based on 10,000 DAU:
     - Peak QPS: ~100 requests/second
     - Storage: ~500 GB/year
     - Servers needed: 5-10 instances
```

---

### ❌ Mistake 3: Ignoring Non-Functional Requirements

```
You: The system will have users, posts, and comments.
     *Doesn't mention performance or scale*
```

**Why it's bad**: System might be over-engineered or under-engineered.

### ✅ Fix:

```
You: For 99.9% availability, we need:
     - Multi-AZ deployment
     - Database replication
     - Load balancing
     - Health checks and auto-recovery
```

---

## Practice Exercise

**Design an E-commerce Platform**

### Your Task
Write down questions you would ask in these categories:

**Functional** (5 questions):
1. ?
2. ?
3. ?
4. ?
5. ?

**Scale** (5 questions):
1. ?
2. ?
3. ?
4. ?
5. ?

**Performance** (3 questions):
1. ?
2. ?
3. ?

### Sample Answers

**Functional**:
1. Do we need user accounts or guest checkout?
2. Support for multiple currencies?
3. Inventory management features?
4. Order tracking and history?
5. Product reviews and ratings?

**Scale**:
1. How many products in catalog?
2. Expected daily orders?
3. Concurrent users during sales?
4. Average order value?
5. Geographic distribution of users?

**Performance**:
1. What's acceptable checkout time?
2. Search latency requirements?
3. Availability during Black Friday?

---

## Real Interview Example

**Problem**: Design Instagram

**Good Requirements Gathering**:

```
You: Let me understand the scope. Should we support:

1. Core Features:
   - Posting photos? ✓
   - Following users? ✓
   - Home feed? ✓
   - Direct messaging? (Defer to v2)
   - Stories? (Defer to v2)

2. Scale:
   - How many users? (1 billion)
   - Photos per day? (100 million)
   - Average photo size? (1 MB)

3. Performance:
   - Feed load time? (< 1 second)
   - Upload time acceptable? (< 5 seconds)
   - Availability? (99.99%)

4. Constraints:
   - Global users? (Yes)
   - Mobile-first? (Yes, 90% mobile)

Interviewer: That's exactly right. Let's focus on posting photos,
             following users, and the home feed.

You: Perfect! Let me start with capacity estimation...
```

---

## Summary

**Requirements gathering** is the most important step:

✅ **Ask clarifying questions**
✅ **Define functional vs non-functional requirements**
✅ **Understand scale and constraints**
✅ **Document assumptions**
✅ **Get interviewer agreement before designing**

**Key Takeaway**: Spend 5-10 minutes on requirements. It will save hours of wasted work!

---

**Next Lesson**: [03-estimation-calculations.md](03-estimation-calculations.md)

Learn how to do back-of-envelope calculations for capacity planning!
