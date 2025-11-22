# Lesson 18: Best Practices and Security

## Git Best Practices

### 1. Write Good Commit Messages
```bash
# ✅ Good
feat: add user authentication with JWT
fix: resolve database connection timeout
docs: update API documentation for /cars endpoint
refactor: simplify car service logic
test: add unit tests for auth service

# ❌ Bad
updated files
changes
wip
asdf
fixing stuff
```

### 2. Commit Often
```bash
# ✅ Good - small, focused commits
git commit -m "feat: add login endpoint"
git commit -m "feat: add password hashing"
git commit -m "feat: add JWT token generation"

# ❌ Bad - one huge commit
git commit -m "add complete authentication system"
```

### 3. Use Branches
```bash
# ✅ Always create feature branches
git checkout -b feature/user-auth

# ❌ Never commit directly to main
git checkout main
git commit -m "quick fix"  # DON'T DO THIS!
```

### 4. Pull Before Push
```bash
# ✅ Good workflow
git pull --rebase
# ... make changes ...
git push

# ❌ Bad - causes conflicts
git push  # Without pulling first
```

---

## GitHub Security

### 1. Never Commit Secrets

**❌ Never commit:**
```javascript
// .env
MONGODB_URI=mongodb://user:password@host
JWT_SECRET=super_secret_key_123
AWS_ACCESS_KEY=AKIAIOSFODNN7EXAMPLE
```

**✅ Use:**
- GitHub Secrets for CI/CD
- Environment variables
- `.env` file (in `.gitignore`)
- Secret management services

### 2. Use .gitignore

```bash
# .gitignore
.env
.env.local
.env.*.local
*.log
node_modules/
dist/
.DS_Store
*.pem
*.key
```

### 3. Scan for Secrets

```bash
# Use git-secrets
git secrets --scan

# Use gitleaks
gitleaks detect --source . --verbose
```

### 4. Enable Branch Protection

On GitHub:
1. Settings → Branches
2. Add rule for `main`
3. Enable:
   - ✅ Require pull request reviews
   - ✅ Require status checks
   - ✅ Require signed commits
   - ✅ Include administrators

### 5. Use Dependabot

Create `.github/dependabot.yml`:
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

### 6. Enable Security Alerts

1. Settings → Security & analysis
2. Enable:
   - Dependency graph
   - Dependabot alerts
   - Dependabot security updates
   - Code scanning

---

## CI/CD Best Practices

### 1. Test Everything

```yaml
jobs:
  test:
    steps:
      - run: npm run lint
      - run: npm run type-check
      - run: npm test
      - run: npm run test:integration
      - run: npm run test:e2e
      - run: npm audit
```

### 2. Use Caching

```yaml
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

### 3. Fail Fast

```yaml
strategy:
  fail-fast: true  # Stop on first failure
```

### 4. Use Matrix Testing

```yaml
strategy:
  matrix:
    node-version: [16, 18, 20]
    os: [ubuntu-latest, windows-latest]
```

### 5. Deploy to Staging First

```yaml
jobs:
  deploy-staging:
    if: github.ref == 'refs/heads/develop'
    # Deploy to staging

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: deploy-staging
    environment: production  # Requires approval
    # Deploy to production
```

---

## Code Review Best Practices

### As Reviewer

1. **Check functionality**
   - Does code work?
   - Are there tests?
   - Edge cases handled?

2. **Check quality**
   - Readable code?
   - Good naming?
   - Comments where needed?

3. **Check security**
   - No secrets committed?
   - Input validation?
   - SQL injection safe?

4. **Be constructive**
   ```
   ✅ "Consider using map() here for better readability"
   ❌ "This code is terrible"
   ```

### As Author

1. **Self-review first**
   - Review your own PR
   - Check diff carefully
   - Test locally

2. **Write good PR description**
   ```markdown
   ## What
   Adds user authentication

   ## Why
   Users need to log in to list cars

   ## How
   - JWT token-based auth
   - Password hashing with bcrypt
   - Refresh token mechanism

   ## Testing
   - Added unit tests
   - Tested manually
   - All existing tests pass
   ```

3. **Keep PRs small**
   - 200-400 lines max
   - One feature per PR
   - Easier to review

4. **Respond quickly**
   - Address feedback promptly
   - Explain decisions
   - Update PR

---

## Branch Naming Conventions

```bash
# Features
feature/user-authentication
feature/car-search
feature/payment-integration

# Bugs
fix/login-validation
fix/database-connection
bugfix/memory-leak

# Hotfixes
hotfix/critical-security-issue
hotfix/production-bug

# Chores
chore/update-dependencies
chore/cleanup-code

# Docs
docs/api-documentation
docs/setup-guide
```

---

## Commit Message Convention

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code change (no feature/bug)
- `test`: Add tests
- `chore`: Maintenance

### Examples
```bash
feat(auth): add JWT token authentication

- Implement JWT token generation
- Add token validation middleware
- Create refresh token mechanism

Closes #123
```

```bash
fix(api): resolve CORS error in production

The API was rejecting requests from frontend due to
incorrect CORS configuration.

Fixes #456
```

---

## Security Checklist

- [ ] No secrets in code
- [ ] `.env` in `.gitignore`
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Rate limiting
- [ ] HTTPS only
- [ ] Secure headers
- [ ] Dependencies updated
- [ ] npm audit clean
- [ ] Signed commits
- [ ] Branch protection
- [ ] Two-factor authentication

---

## Performance Checklist

- [ ] Efficient algorithms
- [ ] Database indexes
- [ ] Caching strategy
- [ ] Pagination
- [ ] Lazy loading
- [ ] Image optimization
- [ ] Bundle size optimized
- [ ] API rate limiting
- [ ] Monitoring setup
- [ ] Load testing

---

## Deployment Checklist

- [ ] All tests pass
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Backup created
- [ ] Monitoring alerts set
- [ ] Rollback plan ready
- [ ] Team notified
- [ ] Health checks pass

---

## Tools and Resources

### Git Tools
- **GitKraken**: Visual Git client
- **SourceTree**: Free Git GUI
- **GitHub Desktop**: Simple GitHub client
- **git-extras**: Extra Git utilities

### CI/CD Tools
- **GitHub Actions**: Built-in CI/CD
- **CircleCI**: Fast CI/CD
- **Travis CI**: Popular CI service
- **Jenkins**: Self-hosted CI/CD

### Security Tools
- **git-secrets**: Prevent secret commits
- **gitleaks**: Find secrets in repos
- **Snyk**: Dependency security
- **Dependabot**: Auto-updates
- **CodeQL**: Code analysis

### Monitoring
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **Datadog**: Full monitoring
- **New Relic**: Application monitoring

---

## 🎉 Congratulations!

You've completed the Git & GitHub guide!

### You Now Know:
- ✅ Git fundamentals
- ✅ GitHub collaboration
- ✅ Pull requests and code review
- ✅ Branching strategies
- ✅ GitHub Actions
- ✅ Complete CI/CD pipelines
- ✅ Best practices
- ✅ Security measures

### Next Steps:
1. Apply to your VahanHelp project
2. Set up CI/CD pipeline
3. Create contribution guidelines
4. Help others with Git/GitHub
5. Contribute to open source

**Keep practicing! Git mastery comes with daily use.**

**Reference**: [DAILY-COMMANDS.md](DAILY-COMMANDS.md) - Review regularly!
