# Lesson 2: Linux Essentials for DevOps

## Why Linux for DevOps?

Imagine you're learning to drive. You could learn on any car, but if you learn on a manual transmission, you'll understand how cars work better and can drive almost anything. Linux is like that manual transmission for DevOps - it teaches you the fundamentals and is used almost everywhere in the tech world.

### Why Linux Dominates DevOps

1. **Servers run Linux**: 96.3% of the world's top 1 million servers run Linux
2. **Containers run Linux**: Docker, Kubernetes - all Linux-based
3. **Cloud runs Linux**: AWS, Azure, GCP - primarily Linux
4. **Open source**: Free, customizable, transparent
5. **Powerful CLI**: Automate everything with commands
6. **Stable and secure**: Battle-tested for decades

### Linux Distributions for DevOps

```
┌─────────────────────────────────────┐
│     Popular Linux Distributions     │
├─────────────────────────────────────┤
│                                     │
│  Ubuntu - Beginner-friendly         │
│  └─ Most popular for servers        │
│  └─ Great documentation             │
│                                     │
│  CentOS/RHEL - Enterprise           │
│  └─ Red Hat based                   │
│  └─ Used in many companies          │
│                                     │
│  Debian - Stable, reliable          │
│  └─ Ubuntu is based on Debian       │
│  └─ Very stable for servers         │
│                                     │
│  Amazon Linux - AWS optimized       │
│  └─ Built for AWS                   │
│  └─ Pre-installed AWS tools         │
│                                     │
└─────────────────────────────────────┘
```

## Essential Linux Commands

### 1. Navigation Commands

#### pwd (Print Working Directory)
Shows where you currently are in the file system.

```bash
# Show current directory
pwd
# Output: /home/user/projects
```

**Analogy**: Like asking "Where am I?" on a map.

#### ls (List)
Shows files and directories in the current location.

```bash
# Basic listing
ls

# Detailed listing (long format)
ls -l

# Show hidden files (files starting with .)
ls -a

# Human-readable sizes
ls -lh

# Sort by modification time
ls -lt

# Combine options
ls -lah
```

**Output example**:
```
-rw-r--r--  1 user group  4096 Nov 18 10:30 file.txt
drwxr-xr-x  2 user group  4096 Nov 17 08:15 folder
```

**Understanding the output**:
```
-rw-r--r--  = File permissions
1           = Number of links
user        = Owner
group       = Group
4096        = Size in bytes
Nov 18 10:30 = Last modified date/time
file.txt    = Name
```

#### cd (Change Directory)
Move between directories.

```bash
# Go to a specific directory
cd /home/user/projects

# Go to home directory
cd ~
# or just
cd

# Go up one level
cd ..

# Go up two levels
cd ../..

# Go to previous directory
cd -

# Go to root directory
cd /
```

**Tip**: Use Tab key for auto-completion!

### 2. File and Directory Operations

#### mkdir (Make Directory)
Create new directories.

```bash
# Create a single directory
mkdir my-project

# Create multiple directories
mkdir dir1 dir2 dir3

# Create nested directories (parent directories too)
mkdir -p projects/nodejs/api

# Create with specific permissions
mkdir -m 755 public-folder
```

#### touch
Create empty files or update timestamps.

```bash
# Create a new empty file
touch index.js

# Create multiple files
touch file1.txt file2.txt file3.txt

# Update modification time of existing file
touch existing-file.txt
```

#### cp (Copy)
Copy files and directories.

```bash
# Copy a file
cp source.txt destination.txt

# Copy to a directory
cp file.txt /home/user/backup/

# Copy directory (recursive)
cp -r folder/ backup-folder/

# Copy and preserve attributes (permissions, timestamps)
cp -p file.txt backup.txt

# Copy with verbose output
cp -v file.txt backup/

# Interactive mode (ask before overwriting)
cp -i file.txt existing-file.txt
```

#### mv (Move/Rename)
Move or rename files and directories.

```bash
# Rename a file
mv oldname.txt newname.txt

# Move to a directory
mv file.txt /home/user/documents/

# Move multiple files
mv file1.txt file2.txt /home/user/backup/

# Move and don't overwrite if exists
mv -n source.txt destination.txt

# Interactive mode
mv -i file.txt existing.txt
```

#### rm (Remove)
Delete files and directories.

```bash
# Remove a file
rm file.txt

# Remove multiple files
rm file1.txt file2.txt

# Remove directory and contents (recursive)
rm -r folder/

# Force remove (no confirmation)
rm -f file.txt

# Remove with confirmation for each file
rm -i file.txt

# Remove directory (must be empty)
rmdir empty-folder/

# Dangerous! Remove everything (BE CAREFUL!)
# rm -rf /  # NEVER RUN THIS!
```

**WARNING**: `rm` is permanent! There's no recycle bin in Linux CLI.

### 3. File Viewing and Editing

#### cat (Concatenate)
Display file contents.

```bash
# View file
cat file.txt

# View multiple files
cat file1.txt file2.txt

# Create a new file (Ctrl+D to save)
cat > newfile.txt

# Append to a file
cat >> existing.txt

# Show line numbers
cat -n file.txt
```

#### less
View file contents page by page (better for large files).

```bash
# View file
less large-file.txt

# Navigation:
# Space - Next page
# b - Previous page
# / - Search forward
# ? - Search backward
# q - Quit
# G - Go to end
# g - Go to beginning
```

#### head
View the beginning of a file.

```bash
# First 10 lines (default)
head file.txt

# First 20 lines
head -n 20 file.txt

# First 5 lines
head -5 file.txt
```

#### tail
View the end of a file.

```bash
# Last 10 lines (default)
tail file.txt

# Last 20 lines
tail -n 20 file.txt

# Follow file (watch for new content) - VERY USEFUL FOR LOGS!
tail -f /var/log/application.log

# Follow with line numbers
tail -fn 100 /var/log/nginx/access.log
```

**DevOps Use**: `tail -f` is essential for watching log files in real-time!

#### nano / vim
Text editors.

```bash
# Edit with nano (beginner-friendly)
nano file.txt
# Ctrl+O to save, Ctrl+X to exit

# Edit with vim (powerful but steeper learning curve)
vim file.txt
# Press 'i' to insert
# Press 'Esc' to exit insert mode
# Type ':wq' to save and quit
# Type ':q!' to quit without saving
```

### 4. File Searching

#### find
Search for files and directories.

```bash
# Find by name
find /home/user -name "*.txt"

# Find directories only
find /home/user -type d -name "project*"

# Find files only
find /home/user -type f -name "*.js"

# Find by size (larger than 100MB)
find /home/user -size +100M

# Find and execute command
find . -name "*.log" -exec rm {} \;

# Find modified in last 7 days
find /var/log -mtime -7

# Find by permissions
find /home/user -perm 644
```

#### locate
Fast file search (uses database).

```bash
# Find files
locate nginx.conf

# Update locate database
sudo updatedb

# Case-insensitive search
locate -i README.md
```

### 5. Text Processing

#### grep (Global Regular Expression Print)
Search text patterns in files.

```bash
# Search for pattern in file
grep "error" application.log

# Case-insensitive search
grep -i "error" application.log

# Show line numbers
grep -n "error" application.log

# Search recursively in directory
grep -r "TODO" ./src/

# Invert match (lines NOT containing pattern)
grep -v "success" application.log

# Count matches
grep -c "error" application.log

# Show only matched part
grep -o "error" application.log

# Search multiple files
grep "error" *.log

# Extended regex
grep -E "error|warning|critical" application.log

# Show context (3 lines before and after)
grep -C 3 "error" application.log
```

**Real DevOps example**:
```bash
# Find all error logs from today
grep "$(date +%Y-%m-%d)" /var/log/application.log | grep -i error

# Find failed login attempts
grep "Failed password" /var/log/auth.log

# Count unique IP addresses in access log
grep -oP '\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}' access.log | sort | uniq -c
```

#### sed (Stream Editor)
Edit text using patterns.

```bash
# Replace first occurrence in each line
sed 's/old/new/' file.txt

# Replace all occurrences
sed 's/old/new/g' file.txt

# Replace and save to new file
sed 's/old/new/g' file.txt > newfile.txt

# Replace in-place (modify original file)
sed -i 's/old/new/g' file.txt

# Delete lines containing pattern
sed '/pattern/d' file.txt

# Print only lines 10-20
sed -n '10,20p' file.txt

# Add line number to each line
sed = file.txt | sed 'N;s/\n/\t/'
```

**Real DevOps example**:
```bash
# Replace environment in config file
sed -i 's/development/production/g' config.yaml

# Remove comments from config
sed '/^#/d' nginx.conf
```

#### awk
Pattern scanning and processing.

```bash
# Print specific column
awk '{print $1}' file.txt

# Print first and third columns
awk '{print $1, $3}' file.txt

# Print lines where column 3 > 100
awk '$3 > 100' file.txt

# Sum all values in column 2
awk '{sum += $2} END {print sum}' file.txt

# Custom delimiter
awk -F: '{print $1}' /etc/passwd

# Print with custom formatting
awk '{printf "%-10s %s\n", $1, $2}' file.txt
```

**Real DevOps example**:
```bash
# Get all usernames from /etc/passwd
awk -F: '{print $1}' /etc/passwd

# Calculate total disk usage
df -h | awk '{sum += $3} END {print sum}'

# Parse nginx access log
awk '{print $1}' access.log | sort | uniq -c | sort -rn
```

#### cut
Cut sections from lines.

```bash
# Get first field (delimiter is tab by default)
cut -f1 file.txt

# Get first field with custom delimiter
cut -d: -f1 /etc/passwd

# Get characters 1-10
cut -c1-10 file.txt

# Get multiple fields
cut -d: -f1,3,6 /etc/passwd
```

### 6. File Permissions

Understanding Linux permissions is crucial for DevOps!

```
-rwxrwxrwx
│││││││││
││││││└┴┴─ Others (anyone else)
│││└┴┴──── Group
│└┴─────── Owner (user)
└────────── File type (- = file, d = directory, l = link)

r = read (4)
w = write (2)
x = execute (1)
```

#### chmod (Change Mode)
Change file permissions.

```bash
# Numeric method
chmod 755 script.sh
# Owner: rwx (7), Group: r-x (5), Others: r-x (5)

chmod 644 file.txt
# Owner: rw- (6), Group: r-- (4), Others: r-- (4)

# Symbolic method
chmod u+x script.sh        # Add execute for owner
chmod g-w file.txt         # Remove write for group
chmod o+r file.txt         # Add read for others
chmod a+x script.sh        # Add execute for all

# Recursive
chmod -R 755 folder/

# Common permissions
chmod 777 file.txt  # Everyone can do everything (DANGEROUS!)
chmod 700 file.txt  # Only owner can do everything
chmod 755 file.txt  # Owner all, others read+execute
chmod 644 file.txt  # Owner read+write, others read only
```

**Real DevOps examples**:
```bash
# Make script executable
chmod +x deploy.sh

# Secure SSH key
chmod 600 ~/.ssh/id_rsa

# Set directory permissions for web server
chmod -R 755 /var/www/html
```

#### chown (Change Owner)
Change file owner and group.

```bash
# Change owner
sudo chown user file.txt

# Change owner and group
sudo chown user:group file.txt

# Change only group
sudo chown :group file.txt

# Recursive
sudo chown -R user:group folder/
```

### 7. Process Management

#### ps (Process Status)
View running processes.

```bash
# Basic process list
ps

# All processes
ps aux

# Filter by name
ps aux | grep nginx

# Tree view (show parent-child)
ps auxf

# Specific user
ps -u username
```

**Understanding ps aux output**:
```
USER  PID  %CPU %MEM    VSZ   RSS TTY   STAT START TIME COMMAND
root    1   0.0  0.1 169404  3344 ?     Ss   10:20 0:00 /sbin/init
```

#### top
Real-time process monitoring.

```bash
# Start top
top

# Commands inside top:
# q - Quit
# k - Kill process
# r - Renice process
# M - Sort by memory
# P - Sort by CPU
# 1 - Show individual CPUs
```

#### htop
Better version of top (may need to install).

```bash
# Install htop
sudo apt install htop  # Ubuntu/Debian
sudo yum install htop  # CentOS/RHEL

# Run htop
htop
```

#### kill
Terminate processes.

```bash
# Kill by PID (graceful)
kill 1234

# Force kill
kill -9 1234

# Kill by name (killall)
killall nginx

# Kill by pattern (pkill)
pkill -f "python.*app.py"

# Common signals
kill -15 1234  # SIGTERM (graceful shutdown)
kill -9 1234   # SIGKILL (force kill)
kill -1 1234   # SIGHUP (reload config)
```

**Real DevOps example**:
```bash
# Find and kill a stuck process
ps aux | grep node
kill -9 1234

# Restart nginx
sudo killall -1 nginx  # Reload config
```

### 8. Package Management

#### apt (Ubuntu/Debian)

```bash
# Update package list
sudo apt update

# Upgrade all packages
sudo apt upgrade

# Install package
sudo apt install nginx

# Remove package
sudo apt remove nginx

# Remove package and config files
sudo apt purge nginx

# Search for package
apt search nginx

# Show package info
apt show nginx

# List installed packages
apt list --installed

# Clean up
sudo apt autoremove
sudo apt autoclean
```

#### yum (CentOS/RHEL)

```bash
# Update package list
sudo yum update

# Install package
sudo yum install nginx

# Remove package
sudo yum remove nginx

# Search for package
yum search nginx

# Show package info
yum info nginx

# List installed packages
yum list installed

# Clean cache
sudo yum clean all
```

### 9. Network Commands

#### ping
Test connectivity.

```bash
# Ping host
ping google.com

# Ping 5 times
ping -c 5 google.com

# Set interval
ping -i 2 google.com
```

#### curl
Transfer data from/to servers.

```bash
# GET request
curl https://api.example.com

# Save to file
curl -o file.html https://example.com

# Follow redirects
curl -L https://example.com

# POST request
curl -X POST -d "data=value" https://api.example.com

# With headers
curl -H "Content-Type: application/json" https://api.example.com

# Download file
curl -O https://example.com/file.zip
```

#### wget
Download files.

```bash
# Download file
wget https://example.com/file.zip

# Download to specific location
wget -O /path/to/file.zip https://example.com/file.zip

# Resume download
wget -c https://example.com/largefile.zip

# Download in background
wget -b https://example.com/file.zip
```

#### netstat
Network statistics.

```bash
# All connections
netstat -a

# Listening ports
netstat -l

# TCP connections
netstat -t

# UDP connections
netstat -u

# With process info
sudo netstat -tulpn

# Common combination
sudo netstat -tulpn | grep :80
```

#### ss
Modern replacement for netstat.

```bash
# Listening TCP ports
ss -lt

# All TCP connections
ss -ta

# Show process using port
ss -ltp

# Specific port
ss -ltn sport = :80
```

### 10. System Information

#### df (Disk Free)
Show disk usage.

```bash
# Basic disk usage
df

# Human-readable
df -h

# Specific filesystem type
df -t ext4

# Show inodes
df -i
```

#### du (Disk Usage)
Show directory/file sizes.

```bash
# Current directory size
du -sh .

# All files and directories
du -ah .

# Top 10 largest
du -ah . | sort -rh | head -10

# Specific directory
du -sh /var/log/*
```

#### free
Show memory usage.

```bash
# Memory info
free

# Human-readable
free -h

# Show in MB
free -m

# Continuous update
free -h -s 5
```

#### uptime
System uptime and load.

```bash
uptime
# Output: 15:30:45 up 10 days,  3:25,  2 users,  load average: 0.52, 0.48, 0.45
```

#### uname
System information.

```bash
# Kernel name
uname

# All info
uname -a

# Kernel version
uname -r

# Machine hardware
uname -m
```

## Shell Scripting Basics

### Your First Script

Create a file called `hello.sh`:

```bash
#!/bin/bash
# This is a comment

echo "Hello, DevOps!"
```

Make it executable and run:

```bash
chmod +x hello.sh
./hello.sh
```

### Variables

```bash
#!/bin/bash

# Define variables
NAME="DevOps Engineer"
AGE=25
SERVER="192.168.1.100"

# Use variables
echo "Hello, I am a $NAME"
echo "I am $AGE years old"
echo "Connecting to $SERVER"

# Command substitution
CURRENT_DATE=$(date)
echo "Today is: $CURRENT_DATE"

# User input
read -p "Enter your name: " USER_NAME
echo "Welcome, $USER_NAME!"
```

### Conditionals

```bash
#!/bin/bash

# If-else
if [ -f "file.txt" ]; then
    echo "File exists"
else
    echo "File does not exist"
fi

# Check if directory exists
if [ -d "/var/log" ]; then
    echo "Directory exists"
fi

# Number comparison
NUMBER=10
if [ $NUMBER -gt 5 ]; then
    echo "Number is greater than 5"
fi

# String comparison
NAME="DevOps"
if [ "$NAME" == "DevOps" ]; then
    echo "Name matches"
fi

# Multiple conditions
if [ $NUMBER -gt 5 ] && [ $NUMBER -lt 15 ]; then
    echo "Number is between 5 and 15"
fi
```

### Loops

```bash
#!/bin/bash

# For loop
for i in 1 2 3 4 5; do
    echo "Number: $i"
done

# For loop with range
for i in {1..10}; do
    echo "Count: $i"
done

# For loop through files
for file in *.txt; do
    echo "Processing: $file"
done

# While loop
COUNTER=0
while [ $COUNTER -lt 5 ]; do
    echo "Counter: $COUNTER"
    COUNTER=$((COUNTER + 1))
done

# Read file line by line
while IFS= read -r line; do
    echo "Line: $line"
done < file.txt
```

### Functions

```bash
#!/bin/bash

# Define function
greet() {
    echo "Hello, $1!"
}

# Call function
greet "DevOps"
greet "World"

# Function with return value
add() {
    local sum=$(($1 + $2))
    echo $sum
}

result=$(add 5 10)
echo "Sum: $result"

# Function to check if service is running
check_service() {
    if systemctl is-active --quiet $1; then
        echo "$1 is running"
        return 0
    else
        echo "$1 is not running"
        return 1
    fi
}

check_service nginx
```

### Real DevOps Script Examples

#### 1. Backup Script

```bash
#!/bin/bash

# Backup script
BACKUP_DIR="/backup"
SOURCE_DIR="/var/www/html"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_$DATE.tar.gz"

# Create backup
echo "Creating backup..."
tar -czf $BACKUP_DIR/$BACKUP_FILE $SOURCE_DIR

if [ $? -eq 0 ]; then
    echo "Backup successful: $BACKUP_FILE"
else
    echo "Backup failed!"
    exit 1
fi

# Remove backups older than 7 days
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete
echo "Old backups removed"
```

#### 2. System Health Check

```bash
#!/bin/bash

# System health check script

echo "=== System Health Check ==="
echo "Date: $(date)"
echo ""

# CPU usage
echo "CPU Usage:"
top -bn1 | grep "Cpu(s)" | awk '{print "  " $2 " user, " $4 " system"}'
echo ""

# Memory usage
echo "Memory Usage:"
free -h | grep Mem | awk '{print "  Total: " $2 ", Used: " $3 ", Free: " $4}'
echo ""

# Disk usage
echo "Disk Usage:"
df -h | grep '^/dev/' | awk '{print "  " $6 ": " $5 " used (" $3 "/" $2 ")"}'
echo ""

# Check if services are running
echo "Service Status:"
services=("nginx" "mysql" "redis")
for service in "${services[@]}"; do
    if systemctl is-active --quiet $service; then
        echo "  $service: RUNNING"
    else
        echo "  $service: STOPPED"
    fi
done
```

#### 3. Log Analyzer

```bash
#!/bin/bash

# Analyze nginx access logs

LOG_FILE="/var/log/nginx/access.log"

echo "=== Nginx Log Analysis ==="
echo ""

# Top 10 IP addresses
echo "Top 10 IP Addresses:"
awk '{print $1}' $LOG_FILE | sort | uniq -c | sort -rn | head -10
echo ""

# Top 10 URLs
echo "Top 10 URLs:"
awk '{print $7}' $LOG_FILE | sort | uniq -c | sort -rn | head -10
echo ""

# Status code distribution
echo "Status Codes:"
awk '{print $9}' $LOG_FILE | sort | uniq -c | sort -rn
echo ""

# Requests per hour
echo "Requests per Hour:"
awk '{print $4}' $LOG_FILE | cut -d: -f2 | sort | uniq -c
```

#### 4. Docker Cleanup Script

```bash
#!/bin/bash

# Docker cleanup script

echo "=== Docker Cleanup ==="
echo ""

# Remove stopped containers
echo "Removing stopped containers..."
docker container prune -f

# Remove unused images
echo "Removing unused images..."
docker image prune -a -f

# Remove unused volumes
echo "Removing unused volumes..."
docker volume prune -f

# Remove unused networks
echo "Removing unused networks..."
docker network prune -f

# Show disk usage
echo ""
echo "Docker disk usage after cleanup:"
docker system df
```

## Practical Exercises

### Exercise 1: File Management
1. Create a directory structure: `projects/nodejs/api`
2. Create 5 files in the `api` directory
3. List all files with detailed information
4. Change permissions to make one file executable
5. Copy the entire structure to `backup/`

### Exercise 2: Text Processing
1. Create a log file with sample entries
2. Use grep to find all ERROR entries
3. Use sed to replace "ERROR" with "CRITICAL"
4. Count the number of unique IP addresses using awk

### Exercise 3: Process Management
1. Run a long-running process in background
2. Use ps to find the process
3. Use top to monitor it
4. Kill the process using kill command

### Exercise 4: Shell Scripting
1. Write a script that backs up a directory
2. Add date/time to the backup filename
3. Make it remove backups older than 3 days
4. Add error handling

## Best Practices

1. **Always use absolute paths in scripts** - More reliable
2. **Quote variables** - Prevents word splitting: `"$VAR"`
3. **Check command success** - Use `$?` or `if` statements
4. **Use meaningful variable names** - `BACKUP_DIR` not `BD`
5. **Add comments** - Explain why, not what
6. **Make scripts executable** - `chmod +x script.sh`
7. **Use shellcheck** - Lint your bash scripts
8. **Handle errors** - Don't assume commands succeed
9. **Use functions** - Make code reusable
10. **Test scripts** - In safe environment first

## Troubleshooting Tips

### Permission Denied
```bash
# Problem: ./script.sh: Permission denied
# Solution:
chmod +x script.sh
```

### Command Not Found
```bash
# Problem: command: not found
# Solutions:
# 1. Install the package
sudo apt install package-name

# 2. Check if it's in PATH
echo $PATH

# 3. Use full path
/usr/bin/command
```

### No Space Left on Device
```bash
# Check disk usage
df -h

# Find large files
du -ah /var/log | sort -rh | head -20

# Clean up
sudo apt clean
sudo apt autoremove
```

### Process Won't Die
```bash
# Try graceful kill first
kill PID

# If that doesn't work
kill -9 PID

# Find all processes
ps aux | grep process-name
pkill -9 process-name
```

## Quick Reference Card

```bash
# Navigation
pwd                 # Current directory
ls -lah            # List all with details
cd /path           # Change directory
cd ~               # Go home
cd ..              # Go up

# File Operations
touch file.txt     # Create file
mkdir dir          # Create directory
cp src dst         # Copy
mv src dst         # Move/rename
rm file            # Remove file
rm -rf dir         # Remove directory

# File Viewing
cat file.txt       # View file
less file.txt      # Page through file
head file.txt      # First 10 lines
tail -f file.txt   # Follow file

# Search
find . -name "*.txt"        # Find files
grep "pattern" file.txt     # Search in file
grep -r "pattern" .         # Recursive search

# Permissions
chmod 755 file     # Change permissions
chown user file    # Change owner

# Process
ps aux             # List processes
top                # Monitor processes
kill PID           # Kill process
kill -9 PID        # Force kill

# Package Management (Ubuntu)
sudo apt update    # Update package list
sudo apt install pkg   # Install package
sudo apt remove pkg    # Remove package

# Network
ping host          # Test connectivity
curl url           # HTTP request
wget url           # Download file
netstat -tulpn     # Network connections

# System Info
df -h              # Disk usage
free -h            # Memory usage
uptime             # System uptime
uname -a           # System info
```

## Next Steps

In the next lesson, we'll dive into **Docker Fundamentals** - learning how to containerize applications, which is essential for modern DevOps. You'll learn what containers are, why they're revolutionary, and how to use Docker to build, ship, and run applications anywhere.

## Summary

Linux is the foundation of DevOps. You've learned:
- Essential commands for navigation and file management
- Text processing with grep, sed, and awk
- Process and package management
- Shell scripting basics
- Real-world DevOps scripts

Practice these commands daily - they'll become second nature. The command line is your most powerful tool as a DevOps engineer!

---

**Practice Challenge**:
Write a bash script that:
1. Checks if nginx is running
2. If running, shows its process info
3. If not running, starts it
4. Logs the action to a file with timestamp
5. Sends you the status via echo
