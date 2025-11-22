# Lesson 15: GitHub Actions Introduction

## 🎯 What is GitHub Actions?

**Automate workflows directly in your GitHub repository.**

---

## Why GitHub Actions?

- ✅ Automate testing
- ✅ Auto-deploy code
- ✅ Run code quality checks
- ✅ Build Docker images
- ✅ Publish packages
- ✅ Schedule tasks

---

## Core Concepts

### Workflow
YAML file that defines automation.
```
.github/workflows/test.yml
```

### Event
Trigger that starts workflow.
```yaml
on: [push, pull_request]
```

### Job
Set of steps that run together.
```yaml
jobs:
  test:
    runs-on: ubuntu-latest
```

### Step
Individual task in a job.
```yaml
steps:
  - name: Checkout code
    uses: actions/checkout@v3
```

---

## First Workflow: Run Tests on Push

Create `.github/workflows/test.yml`:

```yaml
name: Run Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      # Checkout code
      - name: Checkout repository
        uses: actions/checkout@v3

      # Setup Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      # Install dependencies
      - name: Install dependencies
        run: npm ci

      # Run tests
      - name: Run tests
        run: npm test

      # Run linter
      - name: Run ESLint
        run: npm run lint
```

---

## How It Works

```
1. You push code
   ↓
2. GitHub detects .github/workflows/test.yml
   ↓
3. Spins up Ubuntu machine
   ↓
4. Runs each step in order
   ↓
5. Reports success/failure
```

---

## Common Actions

### Checkout Code
```yaml
- uses: actions/checkout@v3
```

### Setup Node.js
```yaml
- uses: actions/setup-node@v3
  with:
    node-version: '18'
```

### Cache Dependencies
```yaml
- uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

### Upload Artifacts
```yaml
- uses: actions/upload-artifact@v3
  with:
    name: build
    path: dist/
```

---

## Viewing Results

1. Go to repository on GitHub
2. Click "Actions" tab
3. See all workflow runs
4. Click on run to see details
5. View logs for each step

---

## Status Badges

Add to README.md:
```markdown
![Tests](https://github.com/username/repo/workflows/Tests/badge.svg)
```

Shows: ![Tests](https://img.shields.io/badge/tests-passing-brightgreen)

---

## Example: TypeScript Backend Workflow

```yaml
name: Backend CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      mongodb:
        image: mongo:6
        ports:
          - 27017:27017

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: TypeScript compile check
        run: npx tsc --noEmit

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test
        env:
          MONGODB_URI: mongodb://localhost:27017/test
          JWT_SECRET: test-secret

      - name: Build
        run: npm run build
```

---

## Next Steps

**Next**: [16-cicd-pipelines.md](16-cicd-pipelines.md) - Build complete CI/CD pipeline

**Practice**: Add test workflow to your VahanHelp project!
