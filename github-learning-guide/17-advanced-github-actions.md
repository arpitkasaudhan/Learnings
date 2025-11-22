# Lesson 17: Advanced GitHub Actions

## Reusable Workflows

Create `.github/workflows/reusable-test.yml`:
```yaml
name: Reusable Test Workflow

on:
  workflow_call:
    inputs:
      node-version:
        required: true
        type: string
    secrets:
      mongodb-uri:
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
      - run: npm test
        env:
          MONGODB_URI: ${{ secrets.mongodb-uri }}
```

Use it:
```yaml
jobs:
  test-node-18:
    uses: ./.github/workflows/reusable-test.yml
    with:
      node-version: '18'
    secrets:
      mongodb-uri: ${{ secrets.MONGODB_URI }}
```

---

## Composite Actions

Create `.github/actions/setup-node-app/action.yml`:
```yaml
name: 'Setup Node App'
description: 'Setup Node.js and install dependencies'

inputs:
  node-version:
    description: 'Node.js version'
    required: false
    default: '18'

runs:
  using: 'composite'
  steps:
    - uses: actions/setup-node@v3
      with:
        node-version: ${{ inputs.node-version }}
        cache: 'npm'
    
    - run: npm ci
      shell: bash
```

Use it:
```yaml
- uses: ./.github/actions/setup-node-app
  with:
    node-version: '18'
```

---

## Conditional Execution

```yaml
steps:
  - name: Deploy
    if: github.ref == 'refs/heads/main'
    run: npm run deploy

  - name: Run only on PR
    if: github.event_name == 'pull_request'
    run: npm run test:integration

  - name: Run on success
    if: success()
    run: echo "Previous steps passed"

  - name: Run on failure
    if: failure()
    run: echo "Something failed"

  - name: Always run
    if: always()
    run: echo "Cleanup"
```

---

## Matrix Builds

```yaml
jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node-version: [16, 18, 20]
        exclude:
          - os: windows-latest
            node-version: 16
      fail-fast: false

    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm test
```

---

## Scheduled Workflows

```yaml
on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight
    - cron: '0 */6 * * *'  # Every 6 hours

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - name: Clean old artifacts
        run: |
          # Cleanup script
```

Cron syntax:
```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6)
│ │ │ │ │
* * * * *
```

---

## Manual Workflows

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy'
        required: true
        type: choice
        options:
          - staging
          - production
      version:
        description: 'Version to deploy'
        required: true
        type: string

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        run: |
          echo "Deploying version ${{ inputs.version }} to ${{ inputs.environment }}"
```

---

## Custom Actions with JavaScript

Create `.github/actions/notify-slack/index.js`:
```javascript
const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const message = core.getInput('message');
    const webhookUrl = core.getInput('webhook-url');

    // Send to Slack
    await fetch(webhookUrl, {
      method: 'POST',
      body: JSON.stringify({ text: message })
    });

    core.setOutput('status', 'success');
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
```

`.github/actions/notify-slack/action.yml`:
```yaml
name: 'Notify Slack'
description: 'Send message to Slack'
inputs:
  message:
    required: true
  webhook-url:
    required: true
outputs:
  status:
    description: 'Status of notification'
runs:
  using: 'node16'
  main: 'index.js'
```

---

## Deployment Environments

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://api.vahanhelp.com

    steps:
      - name: Deploy
        run: npm run deploy
```

Environment settings (in GitHub):
- Required reviewers
- Wait timer
- Deployment branches
- Environment secrets

---

## Artifacts and Caching

### Artifacts
```yaml
- name: Upload logs
  uses: actions/upload-artifact@v3
  if: failure()
  with:
    name: error-logs
    path: logs/
    retention-days: 7

- name: Download artifacts
  uses: actions/download-artifact@v3
  with:
    name: error-logs
```

### Caching
```yaml
- name: Cache node modules
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

---

## Output Variables

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.get-version.outputs.version }}
    steps:
      - id: get-version
        run: echo "version=$(node -p "require('./package.json').version")" >> $GITHUB_OUTPUT

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy version
        run: echo "Deploying ${{ needs.build.outputs.version }}"
```

---

## Security Scanning

```yaml
name: Security Scan

on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly
  push:
    branches: [ main ]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run npm audit
        run: npm audit --audit-level=high

      - name: Run Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

      - name: CodeQL Analysis
        uses: github/codeql-action/analyze@v2
```

---

## Performance Testing

```yaml
jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup k6
        run: |
          sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
          echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
          sudo apt-get update
          sudo apt-get install k6

      - name: Run load tests
        run: k6 run tests/load-test.js
```

---

## Complete Example: Production-Ready Workflow

```yaml
name: Production Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '18'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # Quality checks
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npx tsc --noEmit

      - name: Security audit
        run: npm audit --audit-level=moderate

  # Unit tests
  test-unit:
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - run: npm ci
      
      - name: Run unit tests
        run: npm run test:unit

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  # Integration tests
  test-integration:
    runs-on: ubuntu-latest
    needs: quality

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
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - run: npm ci

      - name: Run integration tests
        run: npm run test:integration
        env:
          MONGODB_URI: mongodb://localhost:27017/test
          REDIS_URL: redis://localhost:6379

  # Build Docker image
  build:
    runs-on: ubuntu-latest
    needs: [test-unit, test-integration]
    if: github.ref == 'refs/heads/main'

    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v3

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=sha,prefix={{branch}}-
            type=semver,pattern={{version}}
            type=raw,value=latest

      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # Deploy to production
  deploy:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment: production

    steps:
      - name: Deploy to Kubernetes
        uses: azure/k8s-deploy@v4
        with:
          manifests: |
            k8s/deployment.yaml
            k8s/service.yaml
          images: |
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest

      - name: Health check
        run: |
          for i in {1..30}; do
            if curl -f https://api.vahanhelp.com/health; then
              echo "Health check passed"
              exit 0
            fi
            sleep 10
          done
          exit 1

      - name: Notify team
        if: always()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: |
            Deployment to production: ${{ job.status }}
            Commit: ${{ github.sha }}
            Author: ${{ github.actor }}
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

**Next**: [18-best-practices-security.md](18-best-practices-security.md)
