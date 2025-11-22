# Lesson 8: GitHub Workflow

## Git Flow

```
main (production)
  ↓
develop (staging)
  ↓
feature/new-feature (your work)
```

---

## Typical Workflow

### 1. Start New Feature
```bash
git checkout main
git pull
git checkout -b feature/user-auth
```

### 2. Work on Feature
```bash
# Make changes
git add .
git commit -m "feat: add login endpoint"

# Continue...
git add .
git commit -m "feat: add signup endpoint"
```

### 3. Push and Create PR
```bash
git push -u origin feature/user-auth
# Create PR on GitHub
```

### 4. Code Review
- Team reviews your PR
- You make requested changes
- Push updates

### 5. Merge
- PR approved
- Merge to develop/main
- Delete feature branch

### 6. Clean Up
```bash
git checkout main
git pull
git branch -d feature/user-auth
```

---

## Your VahanHelp Workflow

```bash
# You use:
git checkout -b claude/feature-name-sessionId

# Make changes
git add .
git commit -m "feat: add feature"

# Push
git push -u origin claude/feature-name-sessionId
```

**Next**: [09-git-stash-reset.md](09-git-stash-reset.md)
