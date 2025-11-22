# Lesson 16: CI/CD Pipelines

## 🎯 What is CI/CD?

### Continuous Integration (CI)
Automatically test code when pushed.

### Continuous Deployment (CD)
Automatically deploy code when tests pass.

---

## Complete CI/CD Pipeline

```
Code Push → Test → Build → Deploy to Staging → Deploy to Production
```

---

## CI Pipeline: Testing

`.github/workflows/ci.yml`:

```yaml
name: CI Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  # Job 1: Lint and Type Check
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: TypeScript check
        run: npx tsc --noEmit

      - name: Run Prettier
        run: npm run format:check

  # Job 2: Unit Tests
  test:
    runs-on: ubuntu-latest
    needs: lint  # Run after lint passes

    services:
      mongodb:
        image: mongo:6
        ports:
          - 27017:27017
      
      redis:
        image: redis:7
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit
        env:
          MONGODB_URI: mongodb://localhost:27017/test
          REDIS_URL: redis://localhost:6379
          JWT_SECRET: test-secret

      - name: Run integration tests
        run: npm run test:integration
        env:
          MONGODB_URI: mongodb://localhost:27017/test
          REDIS_URL: redis://localhost:6379

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  # Job 3: Build
  build:
    runs-on: ubuntu-latest
    needs: [lint, test]  # Run after both pass

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: dist/
```

---

## CD Pipeline: Deployment

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  workflow_dispatch:  # Manual trigger

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production  # GitHub environment

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/vahanhelp-backend
            git pull
            npm ci
            npm run build
            pm2 restart vahanhelp-backend

      - name: Health check
        run: |
          curl -f ${{ secrets.API_URL }}/health || exit 1

      - name: Notify team
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## Docker Deployment Pipeline

`.github/workflows/docker-deploy.yml`:

```yaml
name: Build and Deploy Docker

on:
  push:
    branches: [ main ]

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: |
            username/vahanhelp-backend:latest
            username/vahanhelp-backend:${{ github.sha }}
          cache-from: type=registry,ref=username/vahanhelp-backend:latest
          cache-to: type=inline

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest

    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            docker pull username/vahanhelp-backend:latest
            docker stop vahanhelp-backend || true
            docker rm vahanhelp-backend || true
            docker run -d \
              --name vahanhelp-backend \
              -p 8080:8080 \
              -e MONGODB_URI=${{ secrets.MONGODB_URI }} \
              -e JWT_SECRET=${{ secrets.JWT_SECRET }} \
              username/vahanhelp-backend:latest
```

---

## Environment-Specific Deployments

### Staging on develop, Production on main

```yaml
name: Deploy

on:
  push:
    branches: [ main, develop ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3

      - name: Determine environment
        id: env
        run: |
          if [[ "${{ github.ref }}" == "refs/heads/main" ]]; then
            echo "environment=production" >> $GITHUB_OUTPUT
            echo "api_url=https://api.vahanhelp.com" >> $GITHUB_OUTPUT
          else
            echo "environment=staging" >> $GITHUB_OUTPUT
            echo "api_url=https://staging-api.vahanhelp.com" >> $GITHUB_OUTPUT
          fi

      - name: Deploy
        run: |
          echo "Deploying to ${{ steps.env.outputs.environment }}"
          # Deploy logic here
```

---

## Secrets Management

### Add Secrets in GitHub
1. Go to repository Settings
2. Click "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Add secrets:
   - `SERVER_HOST`
   - `SERVER_USER`
   - `SSH_PRIVATE_KEY`
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `DOCKER_USERNAME`
   - `DOCKER_PASSWORD`

### Use in Workflow
```yaml
env:
  MONGODB_URI: ${{ secrets.MONGODB_URI }}
  JWT_SECRET: ${{ secrets.JWT_SECRET }}
```

---

## Matrix Testing

Test on multiple Node.js versions:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16, 18, 20]

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}

      - run: npm test
```

---

## Complete VahanHelp CI/CD Example

```yaml
name: VahanHelp Backend CI/CD

on:
  push:
    branches: [ main, develop ]
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
      redis:
        image: redis:7
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npx tsc --noEmit

      - name: Test
        run: npm test
        env:
          MONGODB_URI: mongodb://localhost:27017/test
          REDIS_URL: redis://localhost:6379
          JWT_SECRET: test-secret

      - name: Build
        run: npm run build

  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    environment: staging

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to staging
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.STAGING_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/staging
            git pull
            npm ci
            npm run build
            pm2 restart vahanhelp-staging

  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to production
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/production
            git pull
            npm ci
            npm run build
            pm2 restart vahanhelp-backend

      - name: Notify team
        uses: 8398a7/action-slack@v3
        if: always()
        with:
          status: ${{ job.status }}
          text: 'Deployment to production ${{ job.status }}'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## Best Practices

1. **Test before deploy** - Always run tests in CI
2. **Use caching** - Speed up workflows with npm cache
3. **Fail fast** - Stop on first error
4. **Notify team** - Send alerts on failure
5. **Use secrets** - Never commit credentials
6. **Environment protection** - Require approval for production
7. **Rollback plan** - Be able to revert quickly

**Next**: [17-advanced-github-actions.md](17-advanced-github-actions.md)
