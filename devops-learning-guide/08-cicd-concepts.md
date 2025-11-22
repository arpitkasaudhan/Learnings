# Lesson 8: CI/CD Concepts

## What is CI/CD?

Imagine building a car. In the old days, you'd build the entire car, then test it at the end - only to find major problems. Modern car manufacturing tests every part continuously as it's built. CI/CD does this for software.

### Simple Explanation

**CI/CD** stands for:
- **CI (Continuous Integration)**: Automatically test code every time someone commits
- **CD (Continuous Delivery)**: Automatically prepare code for release
- **CD (Continuous Deployment)**: Automatically deploy code to production

Think of it as an assembly line for software that catches problems early and delivers faster.

## The Problem CI/CD Solves

### Before CI/CD (Traditional Development)

```
┌────────────────────────────────────────────────┐
│         Traditional Development                │
├────────────────────────────────────────────────┤
│                                                │
│  Week 1-2: Developer A codes Feature 1        │
│  Week 1-2: Developer B codes Feature 2        │
│  Week 1-2: Developer C codes Feature 3        │
│                                                │
│  Week 3: Try to merge all code                │
│  ❌ MERGE HELL!                                │
│  - Conflicts everywhere                        │
│  - Code doesn't work together                  │
│  - Tests fail                                  │
│  - Week 3-4: Fix integration issues            │
│                                                │
│  Week 5: Manual testing                        │
│  ❌ BUGS FOUND!                                │
│                                                │
│  Week 6: Manual deployment                     │
│  ❌ PRODUCTION ISSUES!                         │
│                                                │
│  Total: 6+ weeks, high stress, poor quality    │
└────────────────────────────────────────────────┘
```

### With CI/CD

```
┌────────────────────────────────────────────────┐
│         CI/CD Development                      │
├────────────────────────────────────────────────┤
│                                                │
│  Day 1: Developer commits code                 │
│  ├─ ✅ Automated tests run                     │
│  ├─ ✅ Code quality check                      │
│  ├─ ✅ Security scan                           │
│  └─ ✅ Build succeeds                          │
│                                                │
│  Every commit:                                 │
│  - Instant feedback                            │
│  - Problems caught immediately                 │
│  - Always in deployable state                  │
│                                                │
│  Deploy to production: Minutes, not weeks      │
│  Quality: High, consistent                     │
│  Stress: Low                                   │
└────────────────────────────────────────────────┘
```

## Continuous Integration (CI)

### What is CI?

Developers integrate code into shared repository frequently (multiple times per day). Each integration is verified by automated build and tests.

### CI Workflow

```
┌─────────────────────────────────────────────────┐
│        Continuous Integration Flow              │
├─────────────────────────────────────────────────┤
│                                                 │
│  Developer        │  CI Server                  │
│                   │                             │
│  1. Write code    │                             │
│     ↓             │                             │
│  2. Run local     │                             │
│     tests         │                             │
│     ↓             │                             │
│  3. Commit & Push ────→  4. Detect change       │
│                   │         ↓                   │
│                   │      5. Checkout code       │
│                   │         ↓                   │
│                   │      6. Install deps        │
│                   │         ↓                   │
│                   │      7. Run linter          │
│                   │         ↓                   │
│                   │      8. Run tests           │
│                   │         ↓                   │
│                   │      9. Build app           │
│                   │         ↓                   │
│                   │     10. Security scan       │
│                   │         ↓                   │
│  11. Get feedback ←────  12. Report results     │
│      (pass/fail)  │                             │
│                                                 │
└─────────────────────────────────────────────────┘
```

### CI Best Practices

1. **Commit Frequently**
   ```bash
   # Bad: Commit once a week
   # Good: Commit multiple times per day
   git commit -m "Add login form" && git push
   ```

2. **Keep Builds Fast**
   - Target: Under 10 minutes
   - Parallelize tests
   - Cache dependencies
   - Use incremental builds

3. **Test in Clone of Production**
   ```yaml
   # Same OS, same dependencies
   test:
     runs-on: ubuntu-latest
     container:
       image: node:18  # Same as production
   ```

4. **Everyone Sees Results**
   - Team dashboard
   - Slack notifications
   - Email alerts

5. **Automate Everything**
   - No manual steps
   - Reproducible builds
   - Documented process

## Continuous Delivery vs Continuous Deployment

### Continuous Delivery

**Automate release process, but deploy manually.**

```
┌────────────────────────────────────────────────┐
│        Continuous Delivery                     │
├────────────────────────────────────────────────┤
│                                                │
│  Code → Build → Test → Stage → [Button] → Prod│
│                                   ↑            │
│                            Manual approval     │
│                                                │
│  Production deployments are:                   │
│  ✅ Low risk (fully tested)                    │
│  ✅ One-click (automated)                      │
│  ✅ Scheduled (business decision)              │
│                                                │
└────────────────────────────────────────────────┘
```

### Continuous Deployment

**Fully automated, deploy automatically.**

```
┌────────────────────────────────────────────────┐
│        Continuous Deployment                   │
├────────────────────────────────────────────────┤
│                                                │
│  Code → Build → Test → Stage → Prod           │
│                          ↓                     │
│                    Fully automated             │
│                                                │
│  Every commit that passes tests goes to prod   │
│  ✅ Fast feedback                              │
│  ✅ Small, frequent changes                    │
│  ✅ Requires mature testing & monitoring       │
│                                                │
└────────────────────────────────────────────────┘
```

### Comparison

| Aspect | Continuous Delivery | Continuous Deployment |
|--------|-------------------|---------------------|
| **Deploy** | Manual button click | Fully automatic |
| **Speed** | Deploy when ready | Deploy every commit |
| **Risk** | Batched changes | Smaller changes |
| **Control** | More control over timing | Less control |
| **Best For** | Regulated industries, scheduled releases | Fast-paced products |

## CI/CD Pipeline Stages

### Complete Pipeline

```
┌───────────────────────────────────────────────────────────┐
│                   CI/CD Pipeline                          │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  1. SOURCE                                                │
│  ├─ Code commit detected                                  │
│  └─ Clone repository                                      │
│                                                           │
│  2. BUILD                                                 │
│  ├─ Install dependencies                                  │
│  ├─ Compile code                                          │
│  └─ Create artifacts                                      │
│                                                           │
│  3. TEST                                                  │
│  ├─ Lint code                                             │
│  ├─ Unit tests                                            │
│  ├─ Integration tests                                     │
│  ├─ Security scanning                                     │
│  └─ Code coverage                                         │
│                                                           │
│  4. PACKAGE                                               │
│  ├─ Build Docker image                                    │
│  ├─ Tag with version                                      │
│  └─ Push to registry                                      │
│                                                           │
│  5. DEPLOY (Staging)                                      │
│  ├─ Deploy to staging environment                         │
│  ├─ Run smoke tests                                       │
│  └─ Integration tests                                     │
│                                                           │
│  6. TEST (Staging)                                        │
│  ├─ E2E tests                                             │
│  ├─ Performance tests                                     │
│  └─ Security tests                                        │
│                                                           │
│  7. APPROVE                                               │
│  ├─ Manual approval (Continuous Delivery)                 │
│  └─ Or automatic (Continuous Deployment)                  │
│                                                           │
│  8. DEPLOY (Production)                                   │
│  ├─ Deploy to production                                  │
│  ├─ Health checks                                         │
│  └─ Smoke tests                                           │
│                                                           │
│  9. MONITOR                                               │
│  ├─ Application metrics                                   │
│  ├─ Error tracking                                        │
│  ├─ User analytics                                        │
│  └─ Alerts                                                │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

## Testing Pyramid

```
┌─────────────────────────────────────────┐
│         Testing Pyramid                 │
├─────────────────────────────────────────┤
│                                         │
│              /\                         │
│             /E2E\         Slow          │
│            /Tests\        Expensive     │
│           /────────\      Few           │
│          /          \                   │
│         / Integration\    Medium        │
│        /    Tests     \   Medium cost   │
│       /────────────────\  Some          │
│      /                  \               │
│     /    Unit Tests      \ Fast         │
│    /                      \Cheap        │
│   /────────────────────────\Many        │
│                                         │
│  Unit Tests: 70%                        │
│  Integration Tests: 20%                 │
│  E2E Tests: 10%                         │
│                                         │
└─────────────────────────────────────────┘
```

### 1. Unit Tests

**Test individual functions/methods.**

```javascript
// Example: Unit test
describe('calculateTotal', () => {
  it('should sum item prices', () => {
    const items = [
      { price: 10 },
      { price: 20 },
      { price: 30 }
    ];
    expect(calculateTotal(items)).toBe(60);
  });

  it('should handle empty array', () => {
    expect(calculateTotal([])).toBe(0);
  });
});
```

**Characteristics**:
- Fast (milliseconds)
- Isolated (no dependencies)
- Many tests (hundreds/thousands)
- Run on every commit

### 2. Integration Tests

**Test components working together.**

```javascript
// Example: Integration test
describe('User API', () => {
  it('should create and retrieve user', async () => {
    // Create user
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'Alice', email: 'alice@example.com' });

    expect(response.status).toBe(201);
    const userId = response.body.id;

    // Retrieve user
    const getResponse = await request(app)
      .get(`/api/users/${userId}`);

    expect(getResponse.body.name).toBe('Alice');
  });
});
```

**Characteristics**:
- Slower (seconds)
- Tests interactions
- Moderate number
- Run before deployment

### 3. End-to-End (E2E) Tests

**Test entire application flow.**

```javascript
// Example: E2E test with Cypress
describe('Login Flow', () => {
  it('should login and see dashboard', () => {
    cy.visit('/login');
    cy.get('[data-test="email"]').type('user@example.com');
    cy.get('[data-test="password"]').type('password123');
    cy.get('[data-test="submit"]').click();

    cy.url().should('include', '/dashboard');
    cy.get('[data-test="welcome"]').should('contain', 'Welcome');
  });
});
```

**Characteristics**:
- Slowest (minutes)
- Tests real user scenarios
- Few tests (critical paths)
- Run before production deployment

## Deployment Strategies

### 1. Rolling Deployment

**Gradually update instances.**

```
┌──────────────────────────────────────────────┐
│         Rolling Deployment                   │
├──────────────────────────────────────────────┤
│                                              │
│  Start:                                      │
│  [v1] [v1] [v1] [v1]  ← All running v1      │
│                                              │
│  Step 1:                                     │
│  [v2] [v1] [v1] [v1]  ← Update one          │
│                                              │
│  Step 2:                                     │
│  [v2] [v2] [v1] [v1]  ← Update another      │
│                                              │
│  Step 3:                                     │
│  [v2] [v2] [v2] [v1]                        │
│                                              │
│  Done:                                       │
│  [v2] [v2] [v2] [v2]  ← All running v2      │
│                                              │
│  Pros: Low risk, gradual rollout            │
│  Cons: Mixed versions during deployment     │
│                                              │
└──────────────────────────────────────────────┘
```

**Kubernetes Example**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 4
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # Max 1 extra pod
      maxUnavailable: 1  # Max 1 pod down
  template:
    spec:
      containers:
      - name: myapp
        image: myapp:v2
```

### 2. Blue-Green Deployment

**Run two identical environments, switch traffic.**

```
┌──────────────────────────────────────────────┐
│         Blue-Green Deployment                │
├──────────────────────────────────────────────┤
│                                              │
│  Initial State:                              │
│  ┌─────────┐                                 │
│  │  Router │                                 │
│  └────┬────┘                                 │
│       │                                      │
│       ├────→ Blue (v1)  ← Live traffic       │
│       │      [Running]                       │
│       │                                      │
│       └────→ Green (v2) ← Deploy & test      │
│              [Idle/Testing]                  │
│                                              │
│  After Switch:                               │
│  ┌─────────┐                                 │
│  │  Router │                                 │
│  └────┬────┘                                 │
│       │                                      │
│       ├────→ Blue (v1)  ← Standby            │
│       │      [Idle]                          │
│       │                                      │
│       └────→ Green (v2) ← Live traffic       │
│              [Running]                       │
│                                              │
│  Pros: Instant rollback, zero downtime       │
│  Cons: Double resources needed               │
│                                              │
└──────────────────────────────────────────────┘
```

### 3. Canary Deployment

**Gradually shift traffic to new version.**

```
┌──────────────────────────────────────────────┐
│         Canary Deployment                    │
├──────────────────────────────────────────────┤
│                                              │
│  Step 1: 95% v1, 5% v2                      │
│  ┌─────────┐                                 │
│  │  Router │                                 │
│  └────┬────┘                                 │
│       ├────→ v1: 95% traffic                 │
│       └────→ v2:  5% traffic (canary)        │
│                   Monitor closely            │
│                                              │
│  Step 2: 70% v1, 30% v2                     │
│  (if canary looks good)                      │
│  ┌─────────┐                                 │
│  │  Router │                                 │
│  └────┬────┘                                 │
│       ├────→ v1: 70% traffic                 │
│       └────→ v2: 30% traffic                 │
│                                              │
│  Step 3: 0% v1, 100% v2                     │
│  (final)                                     │
│  ┌─────────┐                                 │
│  │  Router │                                 │
│  └────┬────┘                                 │
│       └────→ v2: 100% traffic                │
│                                              │
│  Pros: Low risk, gradual validation          │
│  Cons: Complex routing, longer deployment    │
│                                              │
└──────────────────────────────────────────────┘
```

### 4. A/B Testing

**Run multiple versions simultaneously.**

```
┌──────────────────────────────────────────────┐
│            A/B Testing                       │
├──────────────────────────────────────────────┤
│                                              │
│  ┌─────────┐                                 │
│  │  Router │                                 │
│  └────┬────┘                                 │
│       │                                      │
│       ├────→ Version A (50%)                 │
│       │      [Blue button]                   │
│       │                                      │
│       └────→ Version B (50%)                 │
│              [Red button]                    │
│                                              │
│  Measure:                                    │
│  - Click-through rate                        │
│  - Conversion rate                           │
│  - User engagement                           │
│                                              │
│  Keep winner, discard loser                  │
│                                              │
└──────────────────────────────────────────────┘
```

## CI/CD Tools Overview

### Popular CI/CD Tools

```
┌────────────────────────────────────────────────┐
│            CI/CD Tools                         │
├────────────────────────────────────────────────┤
│                                                │
│  Jenkins                                       │
│  ├─ Open source, most popular                 │
│  ├─ Highly customizable                       │
│  ├─ Large plugin ecosystem                    │
│  └─ Self-hosted                               │
│                                                │
│  GitHub Actions                                │
│  ├─ Native GitHub integration                 │
│  ├─ Free for public repos                     │
│  ├─ Easy to set up                            │
│  └─ YAML-based                                │
│                                                │
│  GitLab CI                                     │
│  ├─ Integrated with GitLab                    │
│  ├─ Auto DevOps                               │
│  ├─ Kubernetes integration                    │
│  └─ Self-hosted or cloud                      │
│                                                │
│  CircleCI                                      │
│  ├─ Fast builds                               │
│  ├─ Great Docker support                      │
│  ├─ Cloud-based                               │
│  └─ Free tier available                       │
│                                                │
│  Travis CI                                     │
│  ├─ Simple setup                              │
│  ├─ GitHub integration                        │
│  ├─ Open source friendly                      │
│  └─ Cloud-based                               │
│                                                │
└────────────────────────────────────────────────┘
```

## Simple CI/CD Pipeline Example

### Example Pipeline Configuration

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  # Stage 1: Build and Test
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Check code coverage
        run: npm run coverage

  # Stage 2: Security Scan
  security:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Run security scan
        run: npm audit

      - name: Scan for secrets
        uses: trufflesecurity/trufflehog@main

  # Stage 3: Build Docker Image
  build:
    needs: [test, security]
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Build Docker image
        run: docker build -t myapp:${{ github.sha }} .

      - name: Scan Docker image
        run: docker scan myapp:${{ github.sha }}

      - name: Push to registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push myapp:${{ github.sha }}

  # Stage 4: Deploy to Staging
  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Deploy to staging
        run: |
          # Deploy to staging server
          kubectl set image deployment/myapp myapp=myapp:${{ github.sha }} -n staging

      - name: Run smoke tests
        run: npm run test:smoke

  # Stage 5: Deploy to Production (manual approval)
  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: |
          kubectl set image deployment/myapp myapp=myapp:${{ github.sha }} -n production

      - name: Verify deployment
        run: |
          kubectl rollout status deployment/myapp -n production
```

## CI/CD Benefits

### Measurable Improvements

| Metric | Before CI/CD | After CI/CD | Improvement |
|--------|-------------|-------------|-------------|
| **Deployment Frequency** | Monthly | Daily/Hourly | 30-100x |
| **Lead Time** | Weeks | Hours | 50-100x |
| **Mean Time to Recovery** | Hours/Days | Minutes | 10-50x |
| **Change Failure Rate** | 30-40% | 0-15% | 50-70% reduction |
| **Manual Testing Time** | Days | Minutes | 100x |

### Business Benefits

1. **Faster Time to Market**
   - Deploy features quickly
   - Respond to competitors
   - Test ideas rapidly

2. **Higher Quality**
   - Catch bugs early
   - Consistent testing
   - Automated quality checks

3. **Reduced Risk**
   - Small, frequent changes
   - Easy rollback
   - Better monitoring

4. **Lower Costs**
   - Less manual work
   - Fewer bugs in production
   - Efficient resource usage

5. **Better Team Morale**
   - Less stress
   - More automation
   - Focus on creative work

## Best Practices

### 1. Build Once, Deploy Many

```bash
# Build artifact once
docker build -t myapp:v1.2.3 .

# Deploy same artifact everywhere
# Staging
kubectl set image deployment/myapp myapp=myapp:v1.2.3 -n staging

# Production
kubectl set image deployment/myapp myapp=myapp:v1.2.3 -n production
```

### 2. Keep Pipeline Fast

- **Parallelize**: Run tests in parallel
- **Cache**: Cache dependencies
- **Incremental**: Only test changed code
- **Target**: < 10 minutes for feedback

### 3. Test Automation

- Every commit runs tests
- No manual testing for basic functionality
- Automated security scanning
- Performance testing automated

### 4. Infrastructure as Code

```yaml
# Everything in code
- Application code
- Tests
- Pipeline configuration
- Infrastructure
- Deployment scripts
```

### 5. Monitor Everything

```javascript
// Instrument your code
logger.info('User logged in', { userId: user.id });
metrics.increment('login.success');

// Set up alerts
if (errorRate > 1%) {
  alert('High error rate!');
}
```

### 6. Fail Fast

```yaml
# Stop pipeline on first failure
jobs:
  test:
    steps:
      - run: npm run lint
      - run: npm test  # Only if lint passes
      - run: npm run build  # Only if tests pass
```

### 7. Make Rollback Easy

```bash
# Tag every deployment
git tag v1.2.3

# Keep previous versions
docker images myapp

# One-command rollback
kubectl rollout undo deployment/myapp
```

## Summary

You've learned:
- What CI/CD is and why it matters
- Difference between Continuous Delivery and Deployment
- CI/CD pipeline stages
- Testing pyramid (Unit, Integration, E2E)
- Deployment strategies (Rolling, Blue-Green, Canary, A/B)
- CI/CD tools overview
- Best practices for CI/CD

**Key Takeaway**: CI/CD automates the software delivery pipeline, enabling teams to deliver faster, with higher quality, and lower risk.

## Next Steps

In the next lesson, **GitHub Actions**, we'll learn hands-on how to build complete CI/CD pipelines using GitHub's native automation platform.

---

**Challenge**:
Design a CI/CD pipeline for your project that:
1. Runs tests on every commit
2. Builds Docker images
3. Deploys to staging automatically
4. Requires approval for production
5. Includes rollback strategy
6. Has monitoring and alerts
7. Completes in under 10 minutes
