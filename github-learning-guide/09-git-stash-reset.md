# Lesson 9: Git Stash and Reset

## Git Stash

**Temporarily save uncommitted changes.**

### Save Changes
```bash
git stash
git stash save "WIP: working on feature"
```

### List Stashes
```bash
git stash list
```

### Apply Stash
```bash
git stash pop       # Apply and remove
git stash apply     # Apply and keep
git stash apply stash@{0}  # Apply specific
```

### Delete Stash
```bash
git stash drop stash@{0}
git stash clear  # Delete all
```

---

## Git Reset

### Soft Reset (Keep Changes)
```bash
git reset --soft HEAD~1
# Undo last commit, keep changes staged
```

### Mixed Reset (Unstage)
```bash
git reset HEAD~1
# Undo last commit, unstage changes
```

### Hard Reset (Discard)
```bash
git reset --hard HEAD~1
# ⚠️ Undo last commit, LOSE all changes
```

---

## Git Revert

**Create new commit that undoes changes.**
```bash
git revert <commit-hash>
# Safer than reset for pushed commits
```

**Next**: [10-git-history-logs.md](10-git-history-logs.md)
