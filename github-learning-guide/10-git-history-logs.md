# Lesson 10: Git History and Logs

## Viewing History

### Basic Log
```bash
git log
git log --oneline
git log --oneline -5
```

### Pretty Log
```bash
git log --graph --oneline --all
git log --graph --oneline --all --decorate
```

### Search Logs
```bash
git log --grep="feat"
git log --author="your-name"
git log --since="2 weeks ago"
git log --until="yesterday"
```

### File History
```bash
git log <file>
git log -p <file>     # With changes
git log --follow <file>  # Follow renames
```

---

## Git Show

```bash
git show <commit-hash>
git show HEAD
git show HEAD~1
```

---

## Git Blame

```bash
git blame <file>
# See who changed each line
```

**Next**: [11-github-issues.md](11-github-issues.md)
