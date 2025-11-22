# Lesson 7: Pull Requests

## What is a Pull Request?

**A request to merge your changes into another branch.**

---

## Creating Pull Request

### Step 1: Create Branch
```bash
git checkout -b feature/new-feature
```

### Step 2: Make Changes and Commit
```bash
# Edit files
git add .
git commit -m "feat: add new feature"
```

### Step 3: Push Branch
```bash
git push -u origin feature/new-feature
```

### Step 4: Create PR on GitHub
1. Go to repository on GitHub
2. Click "Pull requests"
3. Click "New pull request"
4. Select your branch
5. Add title and description
6. Click "Create pull request"

---

## PR Best Practices

### Good PR Title
```
✅ feat: add user authentication
✅ fix: resolve database connection error
✅ docs: update API documentation

❌ updated files
❌ changes
❌ wip
```

### Good PR Description
```markdown
## Summary
Adds user authentication with JWT tokens

## Changes
- Add auth middleware
- Create login/signup endpoints
- Add password hashing
- Update user model

## Test Plan
- [x] Unit tests pass
- [x] Manual testing completed
- [x] No breaking changes
```

---

## Code Review

### As Reviewer
- Read code carefully
- Test locally
- Leave constructive comments
- Approve or request changes

### As Author
- Respond to feedback
- Make requested changes
- Update PR
- Resolve conversations

---

## Merging PR

### Merge Strategies

**1. Merge Commit** (Default)
```
main:     A─B─C─F─M
             └─D─E─┘
```

**2. Squash and Merge** (Clean)
```
main:     A─B─C─F─S
              (D+E combined)
```

**3. Rebase and Merge** (Linear)
```
main:     A─B─C─F─D'─E'
```

**Next**: [08-github-workflow.md](08-github-workflow.md)
