# Lesson 6: Resolving Conflicts

## What is a Merge Conflict?

Occurs when Git can't automatically merge changes.

### Example Conflict
```javascript
<<<<<<< HEAD
const API_URL = "http://localhost:8080";
=======
const API_URL = "http://production.com";
>>>>>>> feature/update-api
```

---

## Resolving Conflicts

### Step 1: See Conflicts
```bash
git status
# Shows conflicted files
```

### Step 2: Edit Files
```javascript
// Choose one or combine:
const API_URL = "http://localhost:8080";
// Remove markers: <<<<<<< ======= >>>>>>>
```

### Step 3: Mark as Resolved
```bash
git add <file>
```

### Step 4: Complete Merge
```bash
git commit
```

### Abort Merge
```bash
git merge --abort
```

---

## Tips
- Communicate with team
- Pull often to avoid conflicts
- Keep commits small
- Resolve conflicts immediately

**Next**: [07-pull-requests.md](07-pull-requests.md)
