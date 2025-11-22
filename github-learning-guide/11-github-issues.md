# Lesson 11: GitHub Issues

## Creating Issues

### Good Issue Template
```markdown
### Bug Description
Clear description of the problem

### Steps to Reproduce
1. Go to login page
2. Enter invalid email
3. Click submit
4. See error

### Expected Behavior
Should show validation error

### Actual Behavior
Application crashes

### Environment
- OS: Ubuntu 22.04
- Browser: Chrome 120
- Node: 18.x
```

---

## Labels
- `bug` - Something isn't working
- `feature` - New feature request
- `documentation` - Documentation update
- `help wanted` - Need help
- `good first issue` - Good for beginners

---

## Linking Issues to PRs
```bash
git commit -m "fix: resolve login bug

Closes #123"
```

**Next**: [12-forking-contributing.md](12-forking-contributing.md)
