# Lesson 14: Git Hooks

## What are Git Hooks?

**Scripts that run automatically on Git events.**

---

## Common Hooks

### pre-commit
Runs before commit is created.
```bash
# .git/hooks/pre-commit
#!/bin/sh

# Run linter
npm run lint

# Run tests
npm test

# If tests fail, commit is blocked
```

### commit-msg
Validates commit message.
```bash
# .git/hooks/commit-msg
#!/bin/sh

commit_msg=$(cat "$1")

# Check conventional commit format
if ! echo "$commit_msg" | grep -qE "^(feat|fix|docs|style|refactor|test|chore):"; then
  echo "❌ Commit message must follow conventional commits"
  echo "Examples: feat: add feature, fix: resolve bug"
  exit 1
fi
```

### pre-push
Runs before push.
```bash
# .git/hooks/pre-push
#!/bin/sh

# Run tests
npm test

# Run build
npm run build

# If fails, push is blocked
```

---

## Setting Up Hooks

### Manual
```bash
cd .git/hooks
cp pre-commit.sample pre-commit
chmod +x pre-commit
# Edit pre-commit file
```

### With Husky (Recommended)
```bash
npm install --save-dev husky

# Initialize
npx husky install

# Add pre-commit hook
npx husky add .git/hooks/pre-commit "npm test"
```

### package.json
```json
{
  "scripts": {
    "prepare": "husky install"
  },
  "devDependencies": {
    "husky": "^8.0.0"
  }
}
```

---

## Example: Pre-commit Hook for VahanHelp

```bash
#!/bin/sh

echo "🔍 Running pre-commit checks..."

# Run TypeScript check
echo "Checking TypeScript..."
npm run type-check || exit 1

# Run linter
echo "Running ESLint..."
npm run lint || exit 1

# Run tests
echo "Running tests..."
npm test || exit 1

# Run Prettier
echo "Formatting code..."
npm run format

echo "✅ All checks passed!"
```

---

## Available Hooks

- `pre-commit` - Before commit
- `prepare-commit-msg` - Edit default message
- `commit-msg` - Validate message
- `post-commit` - After commit
- `pre-push` - Before push
- `pre-rebase` - Before rebase
- `post-merge` - After merge

**Next**: [15-github-actions-intro.md](15-github-actions-intro.md)
