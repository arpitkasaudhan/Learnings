# ⭐ DAILY GIT COMMANDS - MUST REMEMBER

**These are the commands you'll use EVERY SINGLE DAY. Memorize them!**

---

## 🔥 The 10 Most Essential Commands

### 1. Check Status
```bash
git status
```
**Use**: See what files changed, what's staged, current branch
**When**: Before every commit, when confused, multiple times per day

### 2. Add Files to Staging
```bash
git add <file>           # Add specific file
git add .                # Add all changes
git add -A               # Add all changes (including deletions)
git add *.js             # Add all JS files
```
**Use**: Stage files for commit
**When**: After making changes, before commit

### 3. Commit Changes
```bash
git commit -m "message"              # Commit with message
git commit -m "feat: add new feature"  # With conventional commit
git commit -am "message"             # Add and commit (tracked files only)
```
**Use**: Save changes to local repository
**When**: After completing a logical unit of work

### 4. Push to Remote
```bash
git push                                # Push to current branch
git push origin <branch-name>           # Push to specific branch
git push -u origin <branch-name>        # Push and set upstream
```
**Use**: Upload commits to GitHub
**When**: After committing, end of work session

### 5. Pull from Remote
```bash
git pull                    # Pull latest changes
git pull origin main        # Pull from specific branch
git pull --rebase          # Pull and rebase (cleaner history)
```
**Use**: Get latest changes from team
**When**: Start of work session, before creating PR

### 6. View Branches
```bash
git branch                  # List local branches
git branch -a               # List all branches (including remote)
git branch -r               # List remote branches
```
**Use**: See available branches
**When**: Before creating new branch, checking current branch

### 7. Create and Switch Branch
```bash
git checkout -b <branch-name>      # Create and switch to new branch
git checkout <branch-name>         # Switch to existing branch
git switch <branch-name>           # Modern way to switch (Git 2.23+)
git switch -c <branch-name>        # Create and switch (modern)
```
**Use**: Create feature branches, switch between branches
**When**: Starting new feature, switching tasks

### 8. View Commit History
```bash
git log                    # Full history
git log --oneline          # Compact history (one line per commit)
git log --oneline -5       # Last 5 commits
git log --graph --oneline  # Visual graph
```
**Use**: See what was changed, find commit hashes
**When**: Before creating PR, debugging, checking history

### 9. View Changes
```bash
git diff                   # See unstaged changes
git diff --staged          # See staged changes
git diff <file>            # Changes in specific file
git diff <branch>          # Compare with another branch
```
**Use**: Review changes before committing
**When**: Before `git add`, before `git commit`

### 10. Clone Repository
```bash
git clone <url>                    # Clone repository
git clone <url> <folder-name>      # Clone into specific folder
```
**Use**: Get a copy of remote repository
**When**: Starting work on new project, contributing to repo

---

## 📅 Daily Workflow Commands

### Morning Routine
```bash
# 1. Check current status
git status

# 2. Make sure you're on right branch
git branch

# 3. Pull latest changes
git pull

# 4. Create new feature branch (if starting new work)
git checkout -b feature/my-feature

# 5. Start coding!
```

### During Development
```bash
# Check what you changed
git status
git diff

# Stage and commit frequently
git add .
git commit -m "feat: implement user login"

# Continue working...
git add .
git commit -m "fix: handle empty email"
```

### End of Day
```bash
# Review all changes
git status
git log --oneline -5

# Push your work
git push

# Or push with upstream (first time)
git push -u origin feature/my-feature
```

---

## 🚨 Emergency Commands (Must Know!)

### Undo Last Commit (Keep Changes)
```bash
git reset --soft HEAD~1
```
**Use**: Made commit by mistake, want to edit
**When**: Just committed, haven't pushed yet

### Undo Changes in File
```bash
git checkout -- <file>       # Discard changes in file
git restore <file>           # Modern way (Git 2.23+)
```
**Use**: Want to revert file to last commit
**When**: Made unwanted changes

### Undo Staging
```bash
git reset HEAD <file>        # Unstage file
git restore --staged <file>  # Modern way
```
**Use**: Accidentally staged wrong file
**When**: After `git add`

### Temporarily Save Changes
```bash
git stash                    # Stash changes
git stash pop                # Apply and remove stash
git stash apply              # Apply but keep stash
git stash list               # List all stashes
```
**Use**: Need to switch branches with uncommitted changes
**When**: Emergency task, need clean working directory

### Abort Merge
```bash
git merge --abort
```
**Use**: Merge went wrong, want to cancel
**When**: During merge with conflicts

---

## 🎯 Your VahanHelp Workflow

### Your Current Pattern
```bash
# 1. Check branch
git status

# 2. Make changes to code
# ... edit files ...

# 3. Stage changes
git add .

# 4. Commit with message
git commit -m "feat: add new endpoint"

# 5. Push to your branch
git push -u origin claude/express-backend-clean-architecture-011CV3xPmB2JdDcZUiHYYMhJ
```

### Better Pattern (Use This!)
```bash
# 1. Pull latest first
git pull --rebase

# 2. Check what branch you're on
git branch

# 3. Make your changes
# ... edit files ...

# 4. Review changes
git status
git diff

# 5. Add only what you want
git add <specific-files>

# 6. Commit with clear message
git commit -m "feat: add car search endpoint"

# 7. Push
git push
```

---

## 💡 Pro Tips Commands

### View Who Changed What
```bash
git blame <file>
```

### Search Commits
```bash
git log --grep="search term"
git log --author="your-name"
```

### See File History
```bash
git log --follow <file>
git log -p <file>           # With changes
```

### Tag Releases
```bash
git tag v1.0.0
git push origin v1.0.0
```

### Clean Untracked Files
```bash
git clean -n                # Dry run (see what will be deleted)
git clean -fd               # Actually delete
```

---

## 📝 Commit Message Templates

### Conventional Commits (Use These!)
```bash
git commit -m "feat: add user authentication"
git commit -m "fix: resolve database connection error"
git commit -m "docs: update API documentation"
git commit -m "style: format code with prettier"
git commit -m "refactor: simplify car service logic"
git commit -m "test: add unit tests for car service"
git commit -m "chore: update dependencies"
```

### Multi-line Commits
```bash
git commit -m "feat: add user authentication" -m "- Add JWT token generation
- Implement password hashing
- Create auth middleware
- Add login and signup endpoints"
```

---

## 🔄 Branch Management Commands

### Create Branch
```bash
git checkout -b feature/new-feature
git switch -c feature/new-feature    # Modern
```

### Delete Branch
```bash
git branch -d <branch-name>          # Delete local (safe)
git branch -D <branch-name>          # Force delete local
git push origin --delete <branch>    # Delete remote
```

### Rename Branch
```bash
git branch -m <old-name> <new-name>
git branch -m <new-name>             # Rename current
```

### Track Remote Branch
```bash
git checkout --track origin/<branch-name>
```

---

## 🚀 Remote Commands

### View Remotes
```bash
git remote -v
```

### Add Remote
```bash
git remote add origin <url>
```

### Change Remote URL
```bash
git remote set-url origin <new-url>
```

### Fetch Without Merge
```bash
git fetch                  # Fetch all remotes
git fetch origin           # Fetch specific remote
```

---

## 🎨 Aliases (Make Your Life Easier!)

Add these to your `~/.gitconfig`:

```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.cm commit
git config --global alias.last 'log -1 HEAD'
git config --global alias.unstage 'reset HEAD --'
git config --global alias.visual 'log --graph --oneline --all'
```

Then use:
```bash
git st          # Instead of git status
git co main     # Instead of git checkout main
git cm -m "msg" # Instead of git commit -m "msg"
git last        # See last commit
git visual      # Pretty log
```

---

## 📊 Configuration Commands

### Set Username and Email
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Set Default Editor
```bash
git config --global core.editor "code --wait"  # VS Code
git config --global core.editor "vim"          # Vim
```

### Set Default Branch Name
```bash
git config --global init.defaultBranch main
```

### View Configuration
```bash
git config --list
git config user.name
```

---

## 🔍 Search and Find Commands

### Find in Files
```bash
git grep "search term"
git grep -n "search term"        # With line numbers
git grep "search term" <branch>  # In specific branch
```

### Find Commit with Change
```bash
git log -S "code snippet"
```

### Find Who Deleted Line
```bash
git log -S "deleted line" --source --all
```

---

## ⚡ Speed Commands (Shortcuts)

```bash
# Quick commit all changes
git commit -am "message"

# Quick push
git push

# Quick pull and rebase
git pull --rebase

# Quick switch to previous branch
git checkout -

# Quick switch to main
git checkout main

# Quick see diff of last commit
git show

# Quick amend last commit (haven't pushed yet!)
git commit --amend --no-edit

# Quick stage and commit in one line
git add . && git commit -m "message" && git push
```

---

## 🎯 Commands for Your Current Project

### Check Your VahanHelp Repo Status
```bash
cd /home/user/VHAPP
git status
git branch
git log --oneline -5
```

### Create New Feature Branch
```bash
git checkout -b claude/new-feature-$(date +%s)
```

### Safe Push to Your Branch
```bash
# Check what will be pushed
git log origin/$(git branch --show-current)..HEAD --oneline

# Push
git push -u origin $(git branch --show-current)
```

### Clean Up After Work
```bash
git checkout main
git pull
git branch -d old-feature-branch
```

---

## 📖 Learning Order

**Week 1: Memorize These**
1. `git status`
2. `git add .`
3. `git commit -m "message"`
4. `git push`
5. `git pull`

**Week 2: Add These**
6. `git checkout -b <branch>`
7. `git log --oneline`
8. `git diff`
9. `git stash`
10. `git reset`

**Week 3: Master These**
11. All branch commands
12. All remote commands
13. All undo commands
14. Aliases and shortcuts

---

## 🏆 Daily Practice Routine

### Every Morning (2 minutes)
```bash
git status
git pull
```

### Before Coding (30 seconds)
```bash
git checkout -b feature/my-task
```

### While Coding (every 15-30 min)
```bash
git status
git add .
git commit -m "descriptive message"
```

### Before Leaving (2 minutes)
```bash
git status
git log --oneline -5
git push
```

---

## 🚨 REMEMBER: The Golden Rules

1. **Always `git status` before anything**
2. **Pull before you push**
3. **Commit often, push frequently**
4. **Never commit secrets (.env files)**
5. **Write clear commit messages**
6. **Create branches for features**
7. **Don't force push to main**
8. **Review before committing** (`git diff`)

---

## 🎯 Print This Section!

```
ABSOLUTE ESSENTIALS (Use 10+ times/day):
├── git status          → Check current state
├── git add .           → Stage changes
├── git commit -m ""    → Save changes
├── git push            → Upload to GitHub
└── git pull            → Download from GitHub

DAILY USE (Use 2-5 times/day):
├── git checkout -b     → Create branch
├── git log --oneline   → View history
├── git diff            → See changes
└── git stash          → Temporarily save

EMERGENCY (Use when needed):
├── git reset HEAD~1    → Undo commit
├── git checkout -- .   → Discard changes
├── git merge --abort   → Cancel merge
└── git stash pop      → Restore stashed
```

---

## 📱 Quick Reference Card

```
┌─────────────────────────────────────────┐
│         DAILY GIT COMMANDS              │
├─────────────────────────────────────────┤
│ git status    → Check status            │
│ git add .     → Stage all               │
│ git commit    → Save changes            │
│ git push      → Upload                  │
│ git pull      → Download                │
├─────────────────────────────────────────┤
│ git checkout -b → New branch            │
│ git log       → View history            │
│ git diff      → See changes             │
│ git stash     → Save temporarily        │
│ git reset     → Undo                    │
└─────────────────────────────────────────┘
```

---

**Practice these commands until they become muscle memory. You'll use them thousands of times in your career!**

**Next**: [01-what-is-git-github.md](01-what-is-git-github.md) - Learn the concepts behind these commands
