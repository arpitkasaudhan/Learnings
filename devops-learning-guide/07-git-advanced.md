# Lesson 7: Git Advanced

## Introduction

You know Git basics - commit, push, pull. But DevOps requires advanced Git skills: branching strategies, rebasing, hooks, and team workflows. This lesson takes you from beginner to professional.

Think of basic Git like knowing how to drive around your neighborhood. Advanced Git is like knowing how to navigate a busy city, handle emergencies, and coordinate with other drivers.

## Git Branching Strategies

### Why Branching Strategies Matter

```
Without Strategy:
┌──────────────────────────────────┐
│  Main branch                     │
│  Everyone commits here           │
│  ├─ Conflicts everywhere         │
│  ├─ Broken code in main          │
│  └─ Hard to track features       │
└──────────────────────────────────┘

With Strategy:
┌──────────────────────────────────┐
│  Main (always stable)            │
│  ├─ Feature branches             │
│  ├─ Test before merge            │
│  └─ Clear history                │
└──────────────────────────────────┘
```

### 1. GitFlow

**Best for**: Projects with scheduled releases

```
┌────────────────────────────────────────────────────┐
│                   GitFlow                          │
├────────────────────────────────────────────────────┤
│                                                    │
│  main (production)                                 │
│  ───●────────────●─────────────●──────────        │
│      │           │             │                   │
│      │           │   v1.0      │   v2.0            │
│      │           │             │                   │
│  develop                                           │
│  ───●───●───●───●───●───●───●───●──────────        │
│      │   │   │   │   │   │   │                    │
│      │   │   │   │   │   │   │                    │
│  feature/login   │   │   │   │                    │
│  ────●───●───────┘   │   │   │                    │
│                      │   │   │                    │
│  feature/payment     │   │   │                    │
│  ────────●───●───●───┘   │   │                    │
│                          │   │                    │
│  release/v1.0            │   │                    │
│  ────────────────●───●───┘   │                    │
│                              │                    │
│  hotfix/critical-bug         │                    │
│  ────────────────────────────●                    │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Branches**:
- **main**: Production-ready code
- **develop**: Integration branch
- **feature/**: New features
- **release/**: Release preparation
- **hotfix/**: Emergency fixes

**Workflow**:
```bash
# Start feature
git checkout develop
git checkout -b feature/user-auth
# ... work on feature ...
git commit -m "Add user authentication"

# Merge to develop
git checkout develop
git merge feature/user-auth
git branch -d feature/user-auth

# Create release
git checkout -b release/v1.0 develop
# ... final testing, version bumps ...
git commit -m "Bump version to 1.0"

# Merge to main and develop
git checkout main
git merge release/v1.0
git tag -a v1.0 -m "Version 1.0"

git checkout develop
git merge release/v1.0
git branch -d release/v1.0

# Hotfix
git checkout -b hotfix/security-patch main
# ... fix the bug ...
git commit -m "Fix security vulnerability"

git checkout main
git merge hotfix/security-patch
git tag -a v1.0.1 -m "Hotfix 1.0.1"

git checkout develop
git merge hotfix/security-patch
git branch -d hotfix/security-patch
```

### 2. GitHub Flow

**Best for**: Continuous deployment, fast-paced teams

```
┌────────────────────────────────────────────┐
│            GitHub Flow                     │
├────────────────────────────────────────────┤
│                                            │
│  main (always deployable)                  │
│  ───●───●───────●───────●──────────        │
│      │   │       │       │                 │
│      │   │       │       │                 │
│  feature/add-search     │                  │
│  ────●───●───●──┘       │                  │
│                         │                  │
│  fix/bug-123            │                  │
│  ────────────●───●──────┘                  │
│                                            │
│  Workflow:                                 │
│  1. Create branch from main                │
│  2. Add commits                            │
│  3. Open Pull Request                      │
│  4. Discuss and review                     │
│  5. Deploy and test                        │
│  6. Merge to main                          │
│                                            │
└────────────────────────────────────────────┘
```

**Workflow**:
```bash
# Create feature branch
git checkout main
git pull origin main
git checkout -b feature/add-search

# Work and commit
git add .
git commit -m "Add search functionality"
git push origin feature/add-search

# Open Pull Request on GitHub
# ... review, discuss, make changes ...

# After approval, merge via GitHub
# Delete branch
git checkout main
git pull origin main
git branch -d feature/add-search
```

### 3. Trunk-Based Development

**Best for**: High-performing teams, continuous delivery

```
┌────────────────────────────────────────────┐
│       Trunk-Based Development              │
├────────────────────────────────────────────┤
│                                            │
│  main (trunk)                              │
│  ───●───●───●───●───●───●───●───●──        │
│      │   │   │   │   │   │   │            │
│      │   │   │   │   │   │   │            │
│  short-lived branches (1-2 days max)       │
│  ────●───┘   │   │   │   │   │            │
│      ────────●───┘   │   │   │            │
│          ────────────●───┘   │            │
│              ────────────────●            │
│                                            │
│  Key Points:                               │
│  - Very short-lived branches               │
│  - Merge at least daily                    │
│  - Feature flags for incomplete work       │
│  - High automation and testing             │
│                                            │
└────────────────────────────────────────────┘
```

**Workflow**:
```bash
# Create short-lived branch
git checkout main
git checkout -b add-feature

# Work for a few hours
git commit -m "Add feature (behind feature flag)"
git push origin add-feature

# Merge same day
git checkout main
git merge add-feature
git push origin main
git branch -d add-feature

# Feature not complete? Use feature flags
if (featureFlags.newSearch) {
  // new search implementation
} else {
  // old search
}
```

## Merge vs Rebase

This confuses many developers. Let's clarify!

### Merge

**Creates a merge commit**, preserving history.

```
Before:
  main:    A---B---C
                    \
  feature:          D---E

After merge:
  main:    A---B---C-------M
                    \     /
  feature:          D---E

History shows both branches
```

```bash
git checkout main
git merge feature
```

**Pros**:
- Preserves complete history
- Shows when features were integrated
- Safe, non-destructive

**Cons**:
- Cluttered history with merge commits
- Harder to follow linear progression

### Rebase

**Rewrites history**, creating linear progression.

```
Before:
  main:    A---B---C
                    \
  feature:          D---E

After rebase:
  main:    A---B---C
  feature:          A---B---C---D'---E'

Then fast-forward merge:
  main:    A---B---C---D'---E'
```

```bash
git checkout feature
git rebase main
git checkout main
git merge feature  # Fast-forward merge
```

**Pros**:
- Clean, linear history
- Easy to follow
- Easier to bisect and find bugs

**Cons**:
- Rewrites history (don't rebase shared branches!)
- Can lose context about when branches merged

### When to Use Each

**Use Merge**:
- Public/shared branches
- Want to preserve history
- Feature branches being reviewed

**Use Rebase**:
- Private branches
- Clean up before merging
- Keep feature branch up-to-date with main

### Interactive Rebase

Clean up commits before merging:

```bash
# Last 3 commits
git rebase -i HEAD~3

# Interactive editor opens:
pick abc123 Add login form
pick def456 Fix typo
pick ghi789 Add validation

# Change to:
pick abc123 Add login form
squash def456 Fix typo
squash ghi789 Add validation

# Results in single commit: "Add login form"
```

**Interactive commands**:
- `pick`: Use commit
- `reword`: Change commit message
- `edit`: Edit commit
- `squash`: Merge into previous commit
- `fixup`: Squash without keeping message
- `drop`: Remove commit

## Git Hooks

Hooks are scripts that run automatically at certain Git events.

### Types of Hooks

```
Client-Side Hooks (in .git/hooks/):
├── pre-commit       (before commit)
├── prepare-commit-msg (before commit message)
├── commit-msg       (validate commit message)
├── post-commit      (after commit)
├── pre-push         (before push)
└── post-checkout    (after checkout)

Server-Side Hooks:
├── pre-receive      (before accepting push)
├── update           (for each branch)
└── post-receive     (after accepting push)
```

### Pre-Commit Hook Example

**Lint code before commit**:

```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "Running pre-commit checks..."

# Run linter
npm run lint
if [ $? -ne 0 ]; then
  echo "Linting failed. Commit aborted."
  exit 1
fi

# Run tests
npm test
if [ $? -ne 0 ]; then
  echo "Tests failed. Commit aborted."
  exit 1
fi

echo "All checks passed!"
exit 0
```

Make executable:
```bash
chmod +x .git/hooks/pre-commit
```

### Commit-Msg Hook Example

**Enforce commit message format**:

```bash
#!/bin/bash
# .git/hooks/commit-msg

commit_msg=$(cat $1)

# Check format: "TYPE: message"
# e.g., "feat: add login" or "fix: resolve bug"

if ! echo "$commit_msg" | grep -qE "^(feat|fix|docs|style|refactor|test|chore): .+"; then
  echo "Error: Commit message must follow format:"
  echo "  TYPE: message"
  echo "  Where TYPE is: feat, fix, docs, style, refactor, test, or chore"
  echo ""
  echo "Examples:"
  echo "  feat: add user authentication"
  echo "  fix: resolve login bug"
  exit 1
fi

exit 0
```

### Pre-Push Hook Example

**Prevent pushing to main**:

```bash
#!/bin/bash
# .git/hooks/pre-push

protected_branch='main'
current_branch=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')

if [ $current_branch = $protected_branch ]; then
  echo "Direct push to $protected_branch is not allowed!"
  echo "Please use a feature branch and create a Pull Request."
  exit 1
fi

exit 0
```

### Using Husky (Better Alternative)

**Husky** manages Git hooks easily:

```bash
# Install
npm install -D husky

# Initialize
npx husky install

# Add to package.json
npm set-script prepare "husky install"
```

**package.json**:
```json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.js": ["eslint --fix", "git add"],
    "*.{json,md}": ["prettier --write", "git add"]
  }
}
```

**Create hooks**:
```bash
# Pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"

# Commit-msg hook
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit $1'
```

## Cherry-Pick

Apply specific commits to another branch.

```
  main:    A---B---C
                    \
  feature:          D---E---F

Want commit E on main:
  main:    A---B---C---E'
                    \
  feature:          D---E---F
```

```bash
# Get commit hash
git log feature
# commit abc123... (E)

# Apply to main
git checkout main
git cherry-pick abc123

# Cherry-pick multiple commits
git cherry-pick abc123 def456 ghi789

# Cherry-pick with edit
git cherry-pick -e abc123
```

**Use cases**:
- Apply hotfix to multiple branches
- Pull specific feature from large branch
- Backport fixes to older versions

## Git Stash

Save uncommitted changes temporarily.

```bash
# Stash current changes
git stash

# Stash with message
git stash save "WIP: login feature"

# List stashes
git stash list

# Apply most recent stash
git stash apply

# Apply and remove stash
git stash pop

# Apply specific stash
git stash apply stash@{2}

# Show stash changes
git stash show -p stash@{0}

# Create branch from stash
git stash branch feature-branch stash@{0}

# Drop stash
git stash drop stash@{0}

# Clear all stashes
git stash clear
```

**Use case**:
```bash
# Working on feature
git stash

# Switch to fix urgent bug
git checkout main
git checkout -b hotfix/urgent
# ... fix bug ...
git commit -m "Fix urgent bug"

# Back to feature
git checkout feature-branch
git stash pop
# Continue working
```

## Resolving Conflicts

### Understanding Conflicts

```
<<<<<<< HEAD (current branch)
const name = "Alice";
=======
const name = "Bob";
>>>>>>> feature-branch

Between <<<< and ====: Your changes
Between ==== and >>>>: Incoming changes
```

### Resolving Process

```bash
# During merge
git merge feature-branch
# CONFLICT (content): Merge conflict in file.js

# Check conflicted files
git status

# Open file, resolve conflicts
# Remove <<<<, ====, >>>> markers
# Keep desired code

# After resolving
git add file.js
git commit -m "Merge feature-branch and resolve conflicts"
```

### Conflict Resolution Tools

```bash
# Use merge tool
git mergetool

# Abort merge
git merge --abort

# Use their version
git checkout --theirs file.js
git add file.js

# Use our version
git checkout --ours file.js
git add file.js
```

## Pull Requests and Code Review

### Creating Good Pull Requests

**1. Good PR Title and Description**:
```markdown
# Add User Authentication Feature

## Summary
Implements JWT-based authentication system with login, logout, and password reset.

## Changes
- Added authentication middleware
- Created login/logout endpoints
- Implemented password hashing with bcrypt
- Added JWT token generation/validation
- Created protected route examples

## Testing
- [x] Unit tests pass
- [x] Integration tests pass
- [x] Manual testing completed
- [x] No console errors

## Screenshots
[Include screenshots of new features]

## Related Issues
Closes #123
Related to #456
```

**2. Keep PRs Small**:
- Easier to review
- Faster to merge
- Less likely to have conflicts

**3. Self-Review First**:
```bash
# Review your own changes
git diff main...feature-branch

# Check commits
git log main..feature-branch
```

### Code Review Best Practices

**As Author**:
- Write descriptive commit messages
- Keep PRs focused
- Respond to all comments
- Don't take feedback personally

**As Reviewer**:
- Be respectful and constructive
- Explain the "why" not just "what"
- Suggest improvements, don't demand
- Approve when ready, not perfect

### Review Comments

**Good Comments**:
```
✅ "Consider using async/await here for better readability.
   It would make the error handling more explicit."

✅ "Great error handling! One suggestion: we could add
   more specific error messages to help debugging."

✅ "This works, but might cause performance issues with
   large datasets. Have you considered pagination?"
```

**Bad Comments**:
```
❌ "This is wrong, fix it."
❌ "Why would you do it this way?"
❌ "This is terrible code."
```

## GitHub Features for Teams

### Issues

```bash
# Reference issue in commit
git commit -m "Fix login bug (fixes #123)"
git commit -m "Add feature (closes #456)"
```

### Projects

Organize work in Kanban boards:
- To Do
- In Progress
- In Review
- Done

### Actions (Preview for next lesson)

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: npm test
```

### Branch Protection Rules

Protect important branches:
- Require pull request reviews
- Require status checks
- Require linear history
- Include administrators

## Advanced Git Commands

### Reflog (Recover Lost Commits)

```bash
# Show all HEAD movements
git reflog

# Recover lost commit
git reflog
# Find commit hash
git checkout abc123

# Recover deleted branch
git reflog
git checkout -b recovered-branch abc123
```

### Bisect (Find Bad Commit)

```bash
# Start bisect
git bisect start

# Mark current commit as bad
git bisect bad

# Mark old commit as good
git bisect good v1.0

# Git will check out middle commit
# Test it, then mark:
git bisect bad  # or git bisect good

# Repeat until found
# Git will show the first bad commit

# End bisect
git bisect reset
```

### Blame (Find Who Changed Line)

```bash
# Show who changed each line
git blame file.js

# Blame specific lines
git blame -L 10,20 file.js

# Ignore whitespace
git blame -w file.js
```

### Worktree (Multiple Working Directories)

```bash
# Create worktree
git worktree add ../hotfix main

# Work in ../hotfix directory
cd ../hotfix
# ... make changes ...

# List worktrees
git worktree list

# Remove worktree
git worktree remove ../hotfix
```

## Git Best Practices

### 1. Write Good Commit Messages

**Format**:
```
type(scope): subject

body

footer
```

**Example**:
```
feat(auth): add JWT authentication

Implement JWT-based authentication system with:
- Login/logout endpoints
- Token generation and validation
- Middleware for protected routes

Closes #123
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, no code change
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

### 2. Commit Often, Perfect Later

```bash
# Make frequent commits
git commit -m "WIP: add login form"
git commit -m "WIP: add validation"
git commit -m "WIP: connect to API"

# Clean up before push
git rebase -i HEAD~3
# Squash into single commit
```

### 3. Never Rebase Public Branches

```bash
# ❌ Don't do this
git checkout main
git rebase feature  # main is public!

# ✅ Do this
git checkout feature
git rebase main  # feature is your branch
```

### 4. Use .gitignore

```
# .gitignore
node_modules/
.env
.DS_Store
*.log
dist/
build/
coverage/
.idea/
.vscode/
```

### 5. Keep Branches Up-to-Date

```bash
# Regularly sync with main
git checkout feature
git fetch origin
git rebase origin/main
```

## Summary

You've learned:
- Branching strategies (GitFlow, GitHub Flow, Trunk-Based)
- Merge vs Rebase (when to use each)
- Interactive rebase for clean history
- Git hooks for automation
- Cherry-pick for selective commits
- Stash for temporary storage
- Conflict resolution
- Pull request best practices
- Advanced Git commands

**Key Takeaway**: Advanced Git skills enable efficient team collaboration, clean history, and professional workflows essential for DevOps.

## Next Steps

In the next lesson, **CI/CD Concepts**, we'll learn about Continuous Integration and Continuous Delivery/Deployment - automating the entire software delivery pipeline.

---

**Challenge**:
Set up a complete Git workflow for your team:
1. Choose and document a branching strategy
2. Set up Git hooks for linting and testing
3. Create pull request templates
4. Establish code review guidelines
5. Configure branch protection rules
6. Document the entire workflow
