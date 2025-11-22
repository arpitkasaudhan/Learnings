# System Design Learning Guide

## Overview

Learn how to design scalable, reliable, and maintainable systems from scratch. This guide covers everything you need to know to design backends, frontends, and complete applications.

**Target**: Beginners to Advanced developers who want to master system design for interviews and real-world projects.

---

## 🎯 What You'll Learn

- ✅ Requirements gathering (functional & non-functional)
- ✅ Design scalable architectures
- ✅ Choose the right database, cache, and message queue
- ✅ Handle millions of users
- ✅ Trade-offs and decision-making
- ✅ Real-world system designs (Twitter, Instagram, Uber, etc.)

---

## 📚 Learning Path

### **Beginner Level** (10 hours)

1. [What is System Design?](01-what-is-system-design.md)
2. [Requirements Gathering](02-requirements-gathering.md)
3. [Back-of-Envelope Estimation](03-estimation-calculations.md)
4. [Client-Server Architecture](04-client-server-architecture.md)
5. [Databases: SQL vs NoSQL](05-databases-sql-nosql.md)
6. [API Design (REST, GraphQL)](06-api-design.md)

**After Beginner**: You can gather requirements and design basic client-server applications.

---

### **Intermediate Level** (15 hours)

7. [Load Balancing](07-load-balancing.md)
8. [Caching Strategies](08-caching-strategies.md)
9. [Database Scaling (Replication, Sharding)](09-database-scaling.md)
10. [Message Queues & Pub/Sub](10-message-queues.md)
11. [CDN & Static Content](11-cdn-static-content.md)
12. [Microservices vs Monolith](12-microservices-vs-monolith.md)

**After Intermediate**: You can design systems that handle high traffic and scale horizontally.

---

### **Advanced Level** (20 hours)

13. [Distributed Systems Fundamentals](13-distributed-systems.md)
14. [CAP Theorem & Consistency](14-cap-theorem-consistency.md)
15. [Rate Limiting & Throttling](15-rate-limiting.md)
16. [Search & Autocomplete](16-search-autocomplete.md)
17. [Notifications & Real-time Systems](17-notifications-realtime.md)
18. [Security & Authentication](18-security-authentication.md)

**After Advanced**: You can design complex distributed systems and handle edge cases.

---

### **Real-World System Designs** (20 hours)

19. [Design URL Shortener (like Bit.ly)](19-design-url-shortener.md)
20. [Design Twitter/X](20-design-twitter.md)
21. [Design Instagram](21-design-instagram.md)
22. [Design Uber/Ride Sharing](22-design-uber.md)
23. [Design Netflix/Video Streaming](23-design-netflix.md)
24. [Design WhatsApp/Chat App](24-design-whatsapp.md)

---

## 🛠️ Quick Reference

- [System Design Checklist](SYSTEM-DESIGN-CHECKLIST.md) - Step-by-step guide for every design
- [Technology Choices](TECHNOLOGY-CHOICES.md) - When to use what
- [Common Patterns](COMMON-PATTERNS.md) - Reusable design patterns
- [Interview Guide](INTERVIEW-GUIDE.md) - Ace system design interviews

---

## 🎓 How to Use This Guide

### For Learning
1. **Start with Beginner**: Understand fundamentals
2. **Practice Intermediate**: Build scalable systems
3. **Master Advanced**: Handle complex scenarios
4. **Apply Real-World**: Design actual systems

### For Interviews
1. Read **all lessons** once
2. Practice **real-world designs** (19-24)
3. Use **System Design Checklist** during interviews
4. Review **Interview Guide** for tips

### For Building VahanHelp
Each lesson includes VahanHelp-specific examples:
- Car insurance quote system
- User management
- Payment processing
- Image uploads
- Search & filters

---

## 📊 System Design Process

```
1. Requirements Gathering
   ├─ Functional: What should the system do?
   └─ Non-functional: Scale, performance, availability

2. Estimation
   ├─ Traffic (QPS)
   ├─ Storage (TB/day)
   └─ Bandwidth (GB/s)

3. High-Level Design
   ├─ Draw architecture diagram
   ├─ Identify components
   └─ Data flow

4. Deep Dive
   ├─ Database schema
   ├─ API design
   ├─ Algorithms
   └─ Trade-offs

5. Optimization
   ├─ Caching
   ├─ Load balancing
   ├─ Replication
   └─ Sharding

6. Edge Cases
   ├─ Failures
   ├─ Security
   └─ Monitoring
```

---

## 🏗️ VahanHelp System Design Example

### High-Level Architecture

```
┌────────────────────────────────────────────────────┐
│                   USERS                            │
│  (Web, Mobile, API clients)                        │
└───────────────────┬────────────────────────────────┘
                    │
            ┌───────▼────────┐
            │   DNS (Route53)│
            └───────┬────────┘
                    │
            ┌───────▼────────┐
            │   CDN (CloudFront)
            └───────┬────────┘
                    │
         ┌──────────┴──────────┐
         │                     │
    ┌────▼─────┐         ┌────▼──────┐
    │   S3     │         │    WAF    │
    │ (Static) │         │(Firewall) │
    └──────────┘         └────┬──────┘
                              │
                      ┌───────▼────────┐
                      │  Load Balancer │
                      └───────┬────────┘
                              │
                   ┌──────────┼──────────┐
                   │          │          │
              ┌────▼───┐ ┌───▼────┐ ┌───▼────┐
              │ API    │ │ API    │ │ API    │
              │Server 1│ │Server 2│ │Server 3│
              └────┬───┘ └───┬────┘ └───┬────┘
                   │         │          │
                   └─────────┼──────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
         ┌────▼────┐    ┌────▼────┐   ┌────▼─────┐
         │  Cache  │    │Database │   │  Queue   │
         │ (Redis) │    │(Postgres)│  │  (SQS)   │
         └─────────┘    └────┬────┘   └────┬─────┘
                             │             │
                        ┌────▼────┐   ┌────▼─────┐
                        │ Replica │   │ Workers  │
                        │  (Read) │   │ (Lambda) │
                        └─────────┘   └──────────┘
```

### Key Decisions

| Aspect | Choice | Reason |
|--------|--------|--------|
| **Frontend** | React (SPA) | Fast, modern, component-based |
| **Backend** | Node.js + Express | JavaScript everywhere, non-blocking I/O |
| **Database** | PostgreSQL | ACID, relations, insurance data integrity |
| **Cache** | Redis | Fast, sessions, rate limiting |
| **Storage** | S3 | Scalable, cheap, car images |
| **CDN** | CloudFront | Fast content delivery globally |
| **Queue** | SQS | Async tasks (email, notifications) |
| **Deployment** | AWS ECS Fargate | Containers, auto-scaling |

---

## 🔥 Common System Design Mistakes

❌ **Not asking clarifying questions**
✅ Ask about scale, users, features, constraints

❌ **Jumping into implementation too quickly**
✅ Start with high-level design first

❌ **Ignoring non-functional requirements**
✅ Consider scalability, availability, latency

❌ **Not considering trade-offs**
✅ Discuss pros/cons of each decision

❌ **Over-engineering for small scale**
✅ Design for current scale + 10x growth

---

## 📈 Scale Reference

| Users | QPS | Database | Servers | Strategy |
|-------|-----|----------|---------|----------|
| **1K** | <10 | Single DB | 1 server | Monolith, vertical scaling |
| **10K** | 100 | Primary + Replica | 2-3 servers | Add caching, load balancer |
| **100K** | 1K | Sharded | 5-10 servers | Microservices, CDN |
| **1M** | 10K | Distributed | 50+ servers | Message queues, async processing |
| **10M+** | 100K+ | Multi-region | 100s+ servers | Global CDN, edge computing |

**VahanHelp Current**: ~1K users → Single DB, 2 servers, caching
**VahanHelp Target (1 year)**: ~100K users → Sharded DB, 10 servers, microservices

---

## 💡 Key Principles

### 1. **Start Simple**
Don't over-engineer. Build for current scale.

### 2. **Horizontal Scaling**
Add more servers, not bigger servers.

### 3. **Decouple Components**
Use message queues, APIs, microservices.

### 4. **Cache Aggressively**
Cache everything that doesn't change often.

### 5. **Async Everything**
Use queues for slow operations (email, images).

### 6. **Monitor Everything**
Logs, metrics, alerts, dashboards.

### 7. **Plan for Failure**
Redundancy, backups, graceful degradation.

---

## 🎯 Learning Goals by Level

### Beginner
- [ ] Understand client-server model
- [ ] Choose database (SQL vs NoSQL)
- [ ] Design basic REST API
- [ ] Draw simple architecture diagrams

### Intermediate
- [ ] Design for 100K users
- [ ] Implement caching strategy
- [ ] Scale database (replication)
- [ ] Use message queues

### Advanced
- [ ] Design for 10M+ users
- [ ] Handle distributed systems
- [ ] Design microservices
- [ ] Optimize for global scale

---

## 📖 Recommended Reading

### Books
- "Designing Data-Intensive Applications" by Martin Kleppmann
- "System Design Interview" by Alex Xu
- "Building Microservices" by Sam Newman

### Online Resources
- [System Design Primer (GitHub)](https://github.com/donnemartin/system-design-primer)
- [High Scalability](http://highscalability.com/)
- [AWS Architecture Center](https://aws.amazon.com/architecture/)

---

## 🚀 Practice Projects

Build these to solidify your learning:

1. **URL Shortener** (Beginner)
   - Shorten URLs, redirect, analytics

2. **Twitter Clone** (Intermediate)
   - Posts, follows, timeline, notifications

3. **E-commerce Platform** (Advanced)
   - Products, cart, orders, payments, inventory

4. **VahanHelp** (Real-world)
   - Car insurance quotes, user management, payments

---

## 📝 Interview Preparation

### Time Allocation (45 min interview)
- **5 min**: Requirements gathering
- **5 min**: Estimation
- **15 min**: High-level design
- **15 min**: Deep dive
- **5 min**: Edge cases & wrap-up

### What Interviewers Look For
✅ Clarifying questions
✅ Trade-off discussions
✅ Scalability thinking
✅ Communication skills
✅ Problem-solving approach

---

## 🎓 Next Steps

1. **Start with Lesson 01**: [What is System Design?](01-what-is-system-design.md)
2. **Complete all 24 lessons** in order
3. **Practice with real-world designs** (19-24)
4. **Build your own projects** applying these concepts
5. **Review VahanHelp architecture** decisions

---

**Time to Complete**: 65+ hours total
- Beginner (01-06): ~10 hours
- Intermediate (07-12): ~15 hours
- Advanced (13-18): ~20 hours
- Real-world (19-24): ~20 hours

---

**Let's start designing scalable systems!** 🚀

---

## When to Delete This Guide

Delete this guide when:
- ✅ You can confidently design systems for 10M+ users
- ✅ You've passed system design interviews
- ✅ You've built and deployed production systems
- ✅ You understand all trade-offs and design patterns

**For now**: Keep it as your system design bible! 📖
