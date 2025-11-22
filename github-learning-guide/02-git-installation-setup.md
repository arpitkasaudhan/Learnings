# Lesson 2: Git Installation and Setup

## 🎯 Learning Objectives
- Install Git
- Configure Git
- Set up SSH keys for GitHub
- Verify installation

---

## Installation

### Check if Already Installed
```bash
git --version
# Should show: git version 2.x.x
```

✅ You already have Git installed!

---

## Configuration

### Set Your Identity
```bash
# Set name (required)
git config --global user.name "Your Name"

# Set email (required)
git config --global user.email "your.email@example.com"

# Verify
git config --list
```

### Set Default Branch Name
```bash
git config --global init.defaultBranch main
```

### Set Default Editor
```bash
# VS Code
git config --global core.editor "code --wait"

# Vim
git config --global core.editor "vim"
```

### Enable Color
```bash
git config --global color.ui true
```

---

## SSH Keys for GitHub (Recommended)

### Why SSH?
- No password needed for push/pull
- More secure than HTTPS
- Faster authentication

### Generate SSH Key
```bash
# Generate new SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Press Enter for all prompts (use defaults)

# Start SSH agent
eval "$(ssh-agent -s)"

# Add key to agent
ssh-add ~/.ssh/id_ed25519
```

### Add to GitHub
```bash
# Copy public key
cat ~/.ssh/id_ed25519.pub

# 1. Go to GitHub.com → Settings → SSH and GPG keys
# 2. Click "New SSH key"
# 3. Paste your key
# 4. Click "Add SSH key"
```

### Test Connection
```bash
ssh -T git@github.com
# Should say: "Hi username! You've successfully authenticated"
```

---

## Useful Aliases

```bash
# Create shortcuts
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.cm commit
git config --global alias.last 'log -1 HEAD'
git config --global alias.unstage 'reset HEAD --'

# Now you can use:
git st      # Instead of git status
git co main # Instead of git checkout main
```

---

## Configuration File

Your Git config is stored in `~/.gitconfig`:
```bash
cat ~/.gitconfig
```

---

## Next Steps

**Next**: [03-basic-git-commands.md](03-basic-git-commands.md) - Learn essential commands

**Reference**: [DAILY-COMMANDS.md](DAILY-COMMANDS.md) - Commands to memorize
