# Lesson 12: Forking and Contributing

## Forking

### Fork Repository
1. Go to repository on GitHub
2. Click "Fork" button
3. Fork is created in your account

### Clone Your Fork
```bash
git clone <your-fork-url>
```

### Add Upstream
```bash
git remote add upstream <original-repo-url>
git remote -v
```

### Sync with Upstream
```bash
git fetch upstream
git checkout main
git merge upstream/main
```

---

## Contributing to Open Source

### Step 1: Find Project
- Look for "good first issue" label
- Read CONTRIBUTING.md
- Check if issue is assigned

### Step 2: Fork and Clone
```bash
git clone <your-fork>
cd project
git remote add upstream <original>
```

### Step 3: Create Branch
```bash
git checkout -b fix/issue-123
```

### Step 4: Make Changes
```bash
# Fix the issue
git add .
git commit -m "fix: resolve issue #123"
```

### Step 5: Push and Create PR
```bash
git push origin fix/issue-123
# Create PR on GitHub
```

### Step 6: Address Feedback
- Respond to comments
- Make changes
- Push updates

**Next**: [13-git-rebase-cherry-pick.md](13-git-rebase-cherry-pick.md)
