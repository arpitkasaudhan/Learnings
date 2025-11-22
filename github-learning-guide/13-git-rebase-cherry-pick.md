# Lesson 13: Git Rebase and Cherry-pick

## Git Rebase

**Rebase moves your commits to a new base.**

### Why Rebase?
- Creates linear history
- Cleaner than merge commits
- Easier to understand project history

### Basic Rebase
```bash
git checkout feature-branch
git rebase main

# Or in one command
git rebase main feature-branch
```

### Visual Example
```
Before:
main:     A─B─C─D
           └─E─F  feature

After rebase:
main:     A─B─C─D
                 └─E'─F'  feature
```

### Interactive Rebase
```bash
git rebase -i HEAD~3

# Opens editor:
pick abc1234 feat: add feature
pick def5678 fix: typo
pick ghi9012 docs: update readme

# Change to:
pick abc1234 feat: add feature
fixup def5678 fix: typo  # Merge into previous
reword ghi9012 docs: update readme  # Change message
```

Commands:
- `pick` - Keep commit
- `reword` - Keep commit, change message
- `edit` - Stop to edit commit
- `squash` - Merge with previous, keep messages
- `fixup` - Merge with previous, discard message
- `drop` - Remove commit

---

## Cherry-pick

**Apply specific commit from another branch.**

```bash
git cherry-pick <commit-hash>
```

### Example
```bash
# You're on main
git checkout main

# Apply commit from feature branch
git cherry-pick abc1234

# Apply multiple
git cherry-pick abc1234 def5678
```

---

## When to Use

### Rebase
- ✅ Before creating PR (clean history)
- ✅ Updating feature branch with main
- ❌ Never on public/shared branches

### Cherry-pick
- ✅ Apply hotfix to multiple branches
- ✅ Pick specific feature from another branch
- ✅ Rescue commits from deleted branch

**Next**: [14-git-hooks.md](14-git-hooks.md)
