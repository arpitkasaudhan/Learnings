# Git & GitHub Cheatsheet

## Basic Commands

```bash
# Initialize
git init

# Clone
git clone <url>

# Status
git status

# Add
git add <file>
git add .
git add -A

# Commit
git commit -m "message"
git commit -am "message"

# Push
git push
git push -u origin <branch>

# Pull
git pull
git pull --rebase
```

---

## Branching

```bash
# Create and switch
git checkout -b <branch>
git switch -c <branch>

# Switch
git checkout <branch>
git switch <branch>

# List
git branch
git branch -a

# Delete
git branch -d <branch>
git push origin --delete <branch>
```

---

## History

```bash
# View log
git log
git log --oneline
git log --graph --oneline --all

# Show commit
git show <hash>

# Diff
git diff
git diff --staged
git diff <branch>

# Blame
git blame <file>
```

---

## Undo

```bash
# Discard changes
git checkout -- <file>
git restore <file>

# Unstage
git reset HEAD <file>
git restore --staged <file>

# Undo commit
git reset --soft HEAD~1  # Keep changes
git reset HEAD~1         # Unstage
git reset --hard HEAD~1  # Discard

# Revert commit
git revert <hash>
```

---

## Stash

```bash
# Stash changes
git stash
git stash save "message"

# List
git stash list

# Apply
git stash pop
git stash apply

# Delete
git stash drop
git stash clear
```

---

## Remote

```bash
# View remotes
git remote -v

# Add remote
git remote add origin <url>

# Change URL
git remote set-url origin <url>

# Fetch
git fetch
git fetch origin

# Pull
git pull origin main
```

---

## Merge

```bash
# Merge
git merge <branch>

# Abort
git merge --abort
```

---

## Rebase

```bash
# Rebase
git rebase main

# Interactive
git rebase -i HEAD~3

# Abort
git rebase --abort
```

---

## GitHub CLI

```bash
# Install
npm install -g gh

# Login
gh auth login

# Create repo
gh repo create

# Clone
gh repo clone <repo>

# Create PR
gh pr create

# View PRs
gh pr list

# Check out PR
gh pr checkout <number>
```

---

## Config

```bash
# Set name
git config --global user.name "Name"

# Set email
git config --global user.email "email"

# View config
git config --list

# Edit config
git config --global --edit
```

---

## Aliases

```bash
# Create alias
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.cm commit
git config --global alias.last 'log -1 HEAD'
```

---

## Advanced

```bash
# Cherry-pick
git cherry-pick <hash>

# Tag
git tag v1.0.0
git push origin v1.0.0

# Clean
git clean -fd

# Bisect
git bisect start
git bisect bad
git bisect good <hash>
```

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `git status` | Check status |
| `git add .` | Stage all |
| `git commit -m ""` | Commit |
| `git push` | Push changes |
| `git pull` | Pull changes |
| `git checkout -b` | New branch |
| `git merge` | Merge branch |
| `git log` | View history |
| `git diff` | See changes |
| `git stash` | Save temporarily |

---

**Full guide**: Start with [DAILY-COMMANDS.md](DAILY-COMMANDS.md)
