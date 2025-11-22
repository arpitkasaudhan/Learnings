# Lesson 1: What is Git and GitHub?

## 🎯 Learning Objectives
- Understand version control
- Learn what Git is
- Know what GitHub is
- Understand why they matter

---

## What is Version Control?

**Version control tracks changes to files over time.**

### Without Version Control
```
project_final.zip
project_final_v2.zip
project_final_v2_ACTUALLY_FINAL.zip
project_final_v2_ACTUALLY_FINAL_USE_THIS_ONE.zip
```

❌ Confusing, error-prone, doesn't scale

### With Version Control (Git)
```
Git History:
├── v1.0.0 - Initial release
├── v1.1.0 - Added user auth
├── v1.2.0 - Added car listings
└── v2.0.0 - Major refactor
```

✅ Clean, trackable, professional

---

## What is Git?

**Git is a distributed version control system.**

### Key Features
- **Track changes**: Every modification recorded
- **Collaborate**: Multiple people work together
- **Revert**: Go back to any previous version
- **Branch**: Work on features separately
- **Merge**: Combine changes from different sources

### How Git Works
```
Working Directory  →  Staging Area  →  Local Repository  →  Remote Repository
   (your files)     (git add)        (git commit)         (git push)
```

---

## What is GitHub?

**GitHub is a cloud platform for hosting Git repositories.**

### Git vs GitHub
- **Git**: Version control software (runs on your computer)
- **GitHub**: Website for hosting Git repos (runs in cloud)

```
Git = Tool
GitHub = Service that uses Git
```

### Why GitHub?
- **Collaboration**: Team works on same code
- **Backup**: Code stored in cloud
- **Portfolio**: Showcase your projects
- **CI/CD**: Automate testing and deployment
- **Community**: 100M+ developers

---

## Real-World Example: Your VahanHelp Project

### Without Git/GitHub
```
- Save code on local computer
- Email code to teammates
- Manually merge changes
- Lose work if computer crashes
- Can't track who changed what
```

### With Git/GitHub
```
- Version controlled with Git
- Hosted on GitHub
- Team collaborates via pull requests
- Automatic backups
- Complete history of changes
- CI/CD pipelines
```

---

## Key Concepts

### Repository (Repo)
A folder tracked by Git.
```bash
cd /home/user/VHAPP
# This is a Git repository!
```

### Commit
A saved snapshot of your code.
```bash
git commit -m "Add user authentication"
# Creates a point in history
```

### Branch
A parallel version of code.
```
main ─┬─→ feature/add-cars
      └─→ feature/add-payments
```

### Remote
The GitHub version of your repository.
```bash
origin → http://github.com/VahanHelp999/VHAPP
```

---

## Why Learn Git & GitHub?

### For Your Career
- ✅ Required skill for developers
- ✅ Used by 99% of companies
- ✅ Enables remote collaboration
- ✅ Professionalizes your work

### For Your VahanHelp Project
- ✅ Track all backend changes
- ✅ Collaborate with team
- ✅ Automate testing (CI/CD)
- ✅ Deploy automatically
- ✅ Revert if something breaks

---

## Git Terminology

| Term | Meaning |
|------|---------|
| **Repository** | Project folder tracked by Git |
| **Commit** | Save point in history |
| **Branch** | Parallel version of code |
| **Merge** | Combine branches |
| **Pull** | Download changes |
| **Push** | Upload changes |
| **Clone** | Copy repository |
| **Fork** | Copy someone else's repo |
| **PR** | Pull Request (propose changes) |

---

## Next Steps

**Next**: [02-git-installation-setup.md](02-git-installation-setup.md) - Install and configure Git

**Also Read**: [DAILY-COMMANDS.md](DAILY-COMMANDS.md) - Commands you'll use every day
