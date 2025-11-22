# Lesson 5: Branches and Merging

## Branching

### Create Branch
```bash
git checkout -b feature/new-feature
git switch -c feature/new-feature  # Modern way
```

### List Branches
```bash
git branch
git branch -a
```

### Switch Branch
```bash
git checkout main
git switch main  # Modern way
```

### Delete Branch
```bash
git branch -d feature/old-feature
```

---

## Merging

### Merge Branch into Current
```bash
git checkout main
git merge feature/new-feature
```

### Fast-Forward Merge
```
main:     A─B─C
          └─D─E  feature
          
After merge:
main:     A─B─C─D─E
```

### Three-Way Merge
```
main:     A─B─C─F
             └─D─E  feature
             
After merge:
main:     A─B─C─F─M
             └─D─E─┘
```

**Next**: [06-resolving-conflicts.md](06-resolving-conflicts.md)
