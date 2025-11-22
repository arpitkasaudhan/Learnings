# Lesson 9: GitHub Actions

## Introduction

Now that you understand CI/CD concepts, let's build real pipelines! GitHub Actions is GitHub's built-in automation platform. It's like having a robot that automatically tests, builds, and deploys your code every time you push.

Think of GitHub Actions as your 24/7 DevOps assistant that never sleeps, never makes mistakes, and works for free (with limits).

## What is GitHub Actions?

**GitHub Actions** is a CI/CD platform that allows you to automate your software workflows directly in your GitHub repository.

### Key Concepts

```
┌─────────────────────────────────────────────┐
│       GitHub Actions Hierarchy              │
├─────────────────────────────────────────────┤
│                                             │
│  Workflow (YAML file)                       │
│  └── Jobs (run in parallel by default)     │
│      └── Steps (run sequentially)          │
│          └── Actions (reusable components) │
│                                             │
│  Example:                                   │
│  CI/CD Workflow                             │
│  ├── Job: Test                              │
│  │   ├── Step: Checkout code               │
│  │   ├── Step: Setup Node.js               │
│  │   ├── Step: Install dependencies        │
│  │   └── Step: Run tests                   │
│  │                                          │
│  ├── Job: Build                             │
│  │   ├── Step: Build Docker image          │
│  │   └── Step: Push to registry            │
│  │                                          │
│  └── Job: Deploy                            │
│      ├── Step: Deploy to staging           │
│      └── Step: Run smoke tests             │
│                                             │
└─────────────────────────────────────────────┘
```

### Workflows, Events, Jobs, Steps

**Workflow**: Automated process defined in YAML
**Event**: Trigger that starts workflow (push, pull_request, schedule, etc.)
**Job**: Set of steps that execute on the same runner
**Step**: Individual task (run command, use action)
**Action**: Reusable unit of code

## Your First GitHub Action

### Simple Hello World Workflow

Create `.github/workflows/hello.yml`:

```yaml
name: Hello World

# When to run this workflow
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

# Jobs to run
jobs:
  greet:
    runs-on: ubuntu-latest

    steps:
      - name: Say hello
        run: echo "Hello, GitHub Actions!"

      - name: Show date
        run: date

      - name: List files
        run: ls -la
```

**Push to GitHub**:
```bash
git add .github/workflows/hello.yml
git commit -m "Add GitHub Actions workflow"
git push
```

**View results**: Go to your repo → Actions tab

## Workflow Syntax

### Complete Workflow Example

```yaml
name: Complete CI/CD

# Triggers
on:
  # On push to main
  push:
    branches: [main]

  # On pull request to main
  pull_request:
    branches: [main]

  # Manual trigger
  workflow_dispatch:

  # Scheduled (cron)
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight

# Environment variables for all jobs
env:
  NODE_VERSION: '18'
  REGISTRY: ghcr.io

# Jobs
jobs:
  test:
    name: Run Tests
    runs-on: ubuntu-latest

    # Service containers (databases, etc.)
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    # Build matrix (test multiple versions)
    strategy:
      matrix:
        node-version: [16, 18, 20]

    steps:
      # Checkout code
      - name: Checkout repository
        uses: actions/checkout@v3

      # Setup Node.js
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      # Install dependencies
      - name: Install dependencies
        run: npm ci

      # Run linter
      - name: Run ESLint
        run: npm run lint

      # Run tests
      - name: Run tests
        run: npm test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test

      # Upload coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/coverage-final.json

  build:
    name: Build Docker Image
    needs: test  # Wait for test job
    runs-on: ubuntu-latest
    if: github.event_name == 'push'  # Only on push

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ghcr.io/${{ github.repository }}

      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    name: Deploy to Production
    needs: build
    runs-on: ubuntu-latest
    environment: production  # Requires approval
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Deploy to server
        run: |
          echo "Deploying to production..."
          # Actual deployment commands here
```

## Triggers (Events)

### Common Triggers

```yaml
# Push to branches
on:
  push:
    branches:
      - main
      - 'releases/**'

# Pull requests
on:
  pull_request:
    branches: [main]
    types: [opened, synchronize, reopened]

# Multiple events
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

# Scheduled (cron syntax)
on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight
    - cron: '0 12 * * 1'  # Monday at noon

# Manual trigger
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production

# On release published
on:
  release:
    types: [published]

# On issue or comment
on:
  issues:
    types: [opened, labeled]
  issue_comment:
    types: [created]
```

## Building a CI Pipeline

### Node.js Application CI

```yaml
name: Node.js CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [16, 18, 20]

    steps:
      - uses: actions/checkout@v3

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Upload build artifacts
        if: matrix.node-version == '18'
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: dist/
```

### Python Application CI

```yaml
name: Python CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        python-version: ['3.9', '3.10', '3.11']

    steps:
      - uses: actions/checkout@v3

      - name: Set up Python ${{ matrix.python-version }}
        uses: actions/setup-python@v4
        with:
          python-version: ${{ matrix.python-version }}
          cache: 'pip'

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          pip install -r requirements-dev.txt

      - name: Lint with flake8
        run: |
          flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics

      - name: Test with pytest
        run: |
          pytest --cov=./ --cov-report=xml

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Building and Pushing Docker Images

### Docker Build and Push

```yaml
name: Docker Build and Push

on:
  push:
    branches: [main]
    tags: ['v*']

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Log in to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract Docker metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

## Deployment Workflows

### Deploy to AWS

```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build and push image to ECR
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: myapp
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG

      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster my-cluster \
            --service my-service \
            --force-new-deployment
```

### Deploy to Kubernetes

```yaml
name: Deploy to Kubernetes

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Set up kubectl
        uses: azure/setup-kubectl@v3

      - name: Configure kubectl
        run: |
          echo "${{ secrets.KUBE_CONFIG }}" | base64 -d > kubeconfig
          echo "KUBECONFIG=$(pwd)/kubeconfig" >> $GITHUB_ENV

      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/myapp \
            myapp=ghcr.io/${{ github.repository }}:${{ github.sha }} \
            -n production

      - name: Verify deployment
        run: |
          kubectl rollout status deployment/myapp -n production
```

## Environment Variables and Secrets

### Using Secrets

```yaml
name: Use Secrets

on: [push]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Use secret in environment variable
        env:
          API_KEY: ${{ secrets.API_KEY }}
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: |
          echo "API_KEY is set"
          # Use secrets in your commands

      - name: Use secret in file
        run: |
          echo "${{ secrets.SSH_KEY }}" > private_key
          chmod 600 private_key
```

**Adding Secrets**:
1. Go to repo Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add name and value

### Environment Variables

```yaml
env:
  # Workflow-level
  NODE_ENV: production
  API_URL: https://api.example.com

jobs:
  build:
    env:
      # Job-level
      BUILD_TYPE: release

    steps:
      - name: Use environment variables
        env:
          # Step-level
          STEP_VAR: value
        run: |
          echo "NODE_ENV: $NODE_ENV"
          echo "BUILD_TYPE: $BUILD_TYPE"
          echo "STEP_VAR: $STEP_VAR"

      - name: Set environment variable for next steps
        run: echo "MY_VAR=value" >> $GITHUB_ENV

      - name: Use variable from previous step
        run: echo "MY_VAR is $MY_VAR"
```

## Matrix Builds

### Test Multiple Versions

```yaml
name: Matrix Build

on: [push]

jobs:
  test:
    runs-on: ${{ matrix.os }}

    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node-version: [16, 18, 20]
        include:
          - os: ubuntu-latest
            node-version: 20
            experimental: true
        exclude:
          - os: macos-latest
            node-version: 16

    steps:
      - uses: actions/checkout@v3

      - name: Use Node.js ${{ matrix.node-version }} on ${{ matrix.os }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}

      - run: npm ci
      - run: npm test
```

## Caching Dependencies

### Speed Up Builds with Caching

```yaml
name: Cache Dependencies

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      # Cache Node.js dependencies
      - name: Cache Node modules
        uses: actions/cache@v3
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-

      # Or use built-in caching
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - run: npm ci
      - run: npm test

  python-build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      # Cache Python dependencies
      - uses: actions/setup-python@v4
        with:
          python-version: '3.10'
          cache: 'pip'

      - run: pip install -r requirements.txt
      - run: pytest
```

## Conditional Execution

### Run Steps Conditionally

```yaml
name: Conditional Execution

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      # Only on push
      - name: Deploy
        if: github.event_name == 'push'
        run: echo "Deploying..."

      # Only on main branch
      - name: Production deploy
        if: github.ref == 'refs/heads/main'
        run: echo "Deploying to production"

      # Only on tags
      - name: Release
        if: startsWith(github.ref, 'refs/tags/')
        run: echo "Creating release"

      # On success/failure of previous step
      - name: Run tests
        id: tests
        run: npm test

      - name: On test failure
        if: failure() && steps.tests.outcome == 'failure'
        run: echo "Tests failed!"

      - name: Always run
        if: always()
        run: echo "This always runs"

      # Complex conditions
      - name: Complex condition
        if: |
          github.event_name == 'push' &&
          github.ref == 'refs/heads/main' &&
          !contains(github.event.head_commit.message, '[skip ci]')
        run: echo "Complex condition met"
```

## Real-World Examples

### Complete Node.js App Pipeline

```yaml
name: Node.js CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'

jobs:
  # Lint and test
  test:
    name: Test
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s

      redis:
        image: redis:alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run unit tests
        run: npm run test:unit

      - name: Run integration tests
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
          REDIS_URL: redis://localhost:6379
        run: npm run test:integration

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  # Build Docker image
  build:
    name: Build
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push'

    steps:
      - uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: |
            ghcr.io/${{ github.repository }}:${{ github.sha }}
            ghcr.io/${{ github.repository }}:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # Deploy to staging
  deploy-staging:
    name: Deploy to Staging
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment:
      name: staging
      url: https://staging.example.com

    steps:
      - name: Deploy to staging
        run: |
          # Your deployment commands
          echo "Deploying to staging..."

      - name: Run smoke tests
        run: |
          curl -f https://staging.example.com/health || exit 1

  # Deploy to production
  deploy-production:
    name: Deploy to Production
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://example.com

    steps:
      - name: Deploy to production
        run: |
          # Your deployment commands
          echo "Deploying to production..."

      - name: Verify deployment
        run: |
          curl -f https://example.com/health || exit 1

      - name: Notify team
        if: always()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## Reusable Workflows

### Create Reusable Workflow

**`.github/workflows/reusable-test.yml`**:
```yaml
name: Reusable Test Workflow

on:
  workflow_call:
    inputs:
      node-version:
        required: true
        type: string
    secrets:
      npm-token:
        required: true

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: ${{ inputs.node-version }}

      - run: npm ci
        env:
          NPM_TOKEN: ${{ secrets.npm-token }}

      - run: npm test
```

**Use Reusable Workflow**:
```yaml
name: Main CI

on: [push]

jobs:
  test:
    uses: ./.github/workflows/reusable-test.yml
    with:
      node-version: '18'
    secrets:
      npm-token: ${{ secrets.NPM_TOKEN }}
```

## Debugging GitHub Actions

### Debugging Techniques

```yaml
- name: Debug information
  run: |
    echo "Event: ${{ github.event_name }}"
    echo "Ref: ${{ github.ref }}"
    echo "SHA: ${{ github.sha }}"
    echo "Actor: ${{ github.actor }}"
    env

- name: Enable debug logging
  run: |
    # Set ACTIONS_STEP_DEBUG secret to true

- name: Use tmate for SSH debugging
  if: failure()
  uses: mxschmitt/action-tmate@v3
```

## Best Practices

1. **Use specific action versions**
   ```yaml
   # Good
   - uses: actions/checkout@v3.5.0

   # Avoid
   - uses: actions/checkout@main
   ```

2. **Cache dependencies**
   ```yaml
   - uses: actions/setup-node@v3
     with:
       cache: 'npm'
   ```

3. **Fail fast**
   ```yaml
   strategy:
     fail-fast: true
   ```

4. **Use matrix builds wisely**
   - Test critical combinations
   - Don't overdo it (costs money/time)

5. **Protect secrets**
   - Never echo secrets
   - Use environment-specific secrets

6. **Keep workflows DRY**
   - Use reusable workflows
   - Use composite actions

7. **Monitor workflow runs**
   - Set up notifications
   - Review failed runs
   - Optimize slow workflows

## Summary

You've learned:
- GitHub Actions fundamentals
- Workflow syntax (events, jobs, steps)
- Building CI pipelines
- Docker build and push
- Deployment workflows
- Environment variables and secrets
- Matrix builds
- Caching for speed
- Conditional execution
- Real-world examples

**Key Takeaway**: GitHub Actions provides a powerful, integrated platform for automating your entire software delivery pipeline directly within GitHub.

## Next Steps

In the next lesson, **Docker Production**, we'll learn how to run Docker containers safely and efficiently in production environments.

---

**Challenge**:
Create a complete CI/CD pipeline with GitHub Actions that:
1. Runs tests on multiple Node.js versions
2. Checks code coverage
3. Builds Docker image
4. Scans for security vulnerabilities
5. Deploys to staging automatically
6. Deploys to production with manual approval
7. Sends notifications to Slack
8. Includes rollback capability
