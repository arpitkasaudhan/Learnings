# Lesson 11: Infrastructure as Code (IaC)

## Introduction

Imagine setting up a server manually: click here, type there, configure this, install that. Now imagine doing that for 100 servers. Then imagine doing it again when disaster strikes. Infrastructure as Code solves this by treating infrastructure like software code.

**Infrastructure as Code (IaC)** is the practice of managing and provisioning infrastructure through machine-readable definition files, rather than physical hardware configuration or interactive configuration tools.

## What is Infrastructure as Code?

### The Problem IaC Solves

```
┌────────────────────────────────────────────────┐
│         Manual Infrastructure                  │
├────────────────────────────────────────────────┤
│  Problems:                                     │
│  ├─ Slow (hours/days to provision)            │
│  ├─ Error-prone (human mistakes)              │
│  ├─ Inconsistent (drift over time)            │
│  ├─ Undocumented (tribal knowledge)           │
│  ├─ Hard to replicate                         │
│  └─ No version control                        │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│      Infrastructure as Code                    │
├────────────────────────────────────────────────┤
│  Benefits:                                     │
│  ├─ Fast (minutes to provision)               │
│  ├─ Consistent (same every time)              │
│  ├─ Versioned (Git history)                   │
│  ├─ Documented (code is documentation)        │
│  ├─ Reusable (DRY principle)                  │
│  └─ Testable (validate before applying)       │
└────────────────────────────────────────────────┘
```

## Declarative vs Imperative

### Imperative (How)

**Specify steps to achieve desired state:**

```bash
# Imperative approach
1. Create VPC
2. Create subnet
3. Create security group
4. Launch EC2 instance
5. Configure instance
6. Install software
```

### Declarative (What)

**Specify desired end state:**

```hcl
# Declarative approach (Terraform)
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  vpc_security_group_ids = [aws_security_group.web.id]
  subnet_id     = aws_subnet.public.id
}

# Terraform figures out HOW to achieve this
```

## Terraform Basics

### What is Terraform?

**Terraform** by HashiCorp is an open-source IaC tool that lets you build, change, and version infrastructure safely and efficiently.

### Core Concepts

```
┌────────────────────────────────────────────┐
│        Terraform Concepts                  │
├────────────────────────────────────────────┤
│                                            │
│  Provider                                  │
│  └─ Plugin for infrastructure platform     │
│     (AWS, Azure, GCP, etc.)               │
│                                            │
│  Resource                                  │
│  └─ Infrastructure component               │
│     (EC2 instance, S3 bucket, etc.)       │
│                                            │
│  Data Source                               │
│  └─ Read-only information                  │
│     (AMI ID, availability zones, etc.)    │
│                                            │
│  Variable                                  │
│  └─ Input parameters                       │
│                                            │
│  Output                                    │
│  └─ Return values                          │
│                                            │
│  Module                                    │
│  └─ Reusable configuration                 │
│                                            │
│  State                                     │
│  └─ Current infrastructure state           │
│                                            │
└────────────────────────────────────────────┘
```

### Hello Terraform - AWS Example

**main.tf**:
```hcl
# Specify provider
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# Create VPC
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "main-vpc"
  }
}

# Create subnet
resource "aws_subnet" "public" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"

  tags = {
    Name = "public-subnet"
  }
}

# Create security group
resource "aws_security_group" "web" {
  name        = "web-sg"
  description = "Allow HTTP traffic"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Create EC2 instance
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.public.id

  vpc_security_group_ids = [aws_security_group.web.id]

  tags = {
    Name = "web-server"
  }
}
```

### Terraform Commands

```bash
# Initialize (download providers)
terraform init

# Format code
terraform fmt

# Validate configuration
terraform validate

# Plan changes (dry run)
terraform plan

# Apply changes
terraform apply

# Show current state
terraform show

# List resources
terraform state list

# Destroy infrastructure
terraform destroy
```

### Variables

**variables.tf**:
```hcl
variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "environment" {
  description = "Environment name"
  type        = string
}
```

**terraform.tfvars**:
```hcl
region       = "us-east-1"
instance_type = "t2.small"
environment   = "production"
```

**Using variables**:
```hcl
provider "aws" {
  region = var.region
}

resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = var.instance_type

  tags = {
    Environment = var.environment
  }
}
```

### Outputs

**outputs.tf**:
```hcl
output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.web.id
}

output "instance_public_ip" {
  description = "Public IP of the EC2 instance"
  value       = aws_instance.web.public_ip
}

output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}
```

### Modules

**modules/web-server/main.tf**:
```hcl
variable "instance_type" {
  type = string
}

variable "vpc_id" {
  type = string
}

resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = var.instance_type

  tags = {
    Name = "web-server"
  }
}

output "instance_id" {
  value = aws_instance.web.id
}
```

**Using module**:
```hcl
module "web_server" {
  source = "./modules/web-server"

  instance_type = "t2.micro"
  vpc_id        = aws_vpc.main.id
}

output "web_server_id" {
  value = module.web_server.instance_id
}
```

### State Management

```bash
# Backend configuration (store state in S3)
terraform {
  backend "s3" {
    bucket = "my-terraform-state"
    key    = "production/terraform.tfstate"
    region = "us-east-1"

    # Enable state locking
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}

# Initialize with backend
terraform init

# Migrate state
terraform init -migrate-state
```

## Ansible Basics

### What is Ansible?

**Ansible** is an open-source automation tool for configuration management, application deployment, and task automation.

### Key Concepts

```
┌────────────────────────────────────────────┐
│         Ansible Concepts                   │
├────────────────────────────────────────────┤
│                                            │
│  Inventory                                 │
│  └─ List of managed nodes                 │
│                                            │
│  Playbook                                  │
│  └─ YAML file with tasks                  │
│                                            │
│  Task                                      │
│  └─ Single action to perform              │
│                                            │
│  Module                                    │
│  └─ Reusable unit of work                 │
│     (copy, apt, service, etc.)            │
│                                            │
│  Role                                      │
│  └─ Organized collection of tasks         │
│                                            │
│  Handler                                   │
│  └─ Task triggered by notify               │
│                                            │
└────────────────────────────────────────────┘
```

### Inventory

**inventory.ini**:
```ini
[webservers]
web1.example.com
web2.example.com

[databases]
db1.example.com

[production:children]
webservers
databases

[production:vars]
ansible_user=ubuntu
ansible_ssh_private_key_file=~/.ssh/id_rsa
```

### Simple Playbook

**playbook.yml**:
```yaml
---
- name: Configure web servers
  hosts: webservers
  become: yes  # Run as sudo

  tasks:
    - name: Update apt cache
      apt:
        update_cache: yes

    - name: Install nginx
      apt:
        name: nginx
        state: present

    - name: Start nginx
      service:
        name: nginx
        state: started
        enabled: yes

    - name: Copy index.html
      copy:
        src: index.html
        dest: /var/www/html/index.html
        owner: www-data
        group: www-data
        mode: '0644'
```

### Running Playbooks

```bash
# Run playbook
ansible-playbook -i inventory.ini playbook.yml

# Check mode (dry run)
ansible-playbook -i inventory.ini playbook.yml --check

# Verbose output
ansible-playbook -i inventory.ini playbook.yml -vvv

# Run specific tags
ansible-playbook -i inventory.ini playbook.yml --tags "install"
```

### Variables and Templates

**Playbook with variables**:
```yaml
---
- name: Configure web app
  hosts: webservers
  vars:
    app_name: myapp
    app_port: 3000
    app_version: 1.0.0

  tasks:
    - name: Create app directory
      file:
        path: "/opt/{{ app_name }}"
        state: directory

    - name: Copy config template
      template:
        src: config.j2
        dest: "/opt/{{ app_name }}/config.yml"
```

**config.j2 (Jinja2 template)**:
```yaml
app:
  name: {{ app_name }}
  port: {{ app_port }}
  version: {{ app_version }}
  environment: {{ environment | default('production') }}
```

### Roles

```
roles/
├── webserver/
│   ├── tasks/
│   │   └── main.yml
│   ├── handlers/
│   │   └── main.yml
│   ├── templates/
│   │   └── nginx.conf.j2
│   ├── files/
│   │   └── index.html
│   └── defaults/
│       └── main.yml
```

**roles/webserver/tasks/main.yml**:
```yaml
---
- name: Install nginx
  apt:
    name: nginx
    state: present

- name: Copy nginx config
  template:
    src: nginx.conf.j2
    dest: /etc/nginx/nginx.conf
  notify: restart nginx

- name: Start nginx
  service:
    name: nginx
    state: started
    enabled: yes
```

**roles/webserver/handlers/main.yml**:
```yaml
---
- name: restart nginx
  service:
    name: nginx
    state: restarted
```

**Using roles**:
```yaml
---
- name: Setup web servers
  hosts: webservers
  roles:
    - webserver
```

## Terraform + Ansible Together

### Complete Infrastructure Example

**1. Terraform creates infrastructure**:

**main.tf**:
```hcl
resource "aws_instance" "web" {
  count         = 3
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  key_name      = "my-key"

  tags = {
    Name = "web-${count.index + 1}"
  }
}

# Generate Ansible inventory
resource "local_file" "inventory" {
  content = templatefile("inventory.tpl", {
    web_ips = aws_instance.web[*].public_ip
  })
  filename = "inventory.ini"
}
```

**inventory.tpl**:
```
[webservers]
%{ for ip in web_ips ~}
${ip}
%{ endfor ~}
```

**2. Ansible configures servers**:

```bash
# After terraform apply
terraform apply

# Configure servers with Ansible
ansible-playbook -i inventory.ini configure.yml
```

## Best Practices

### 1. Version Control

```bash
# Always use Git
git init
git add *.tf *.yml
git commit -m "Initial infrastructure code"
```

### 2. Environment Separation

```
infrastructure/
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   └── terraform.tfvars
│   ├── staging/
│   │   ├── main.tf
│   │   └── terraform.tfvars
│   └── production/
│       ├── main.tf
│       └── terraform.tfvars
└── modules/
    ├── networking/
    ├── compute/
    └── database/
```

### 3. Use Modules

```hcl
# Reusable, tested modules
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "my-vpc"
  cidr = "10.0.0.0/16"
}
```

### 4. Remote State

```hcl
# Never commit terraform.tfstate
terraform {
  backend "s3" {
    bucket = "my-terraform-state"
    key    = "prod/terraform.tfstate"
    region = "us-east-1"
  }
}
```

### 5. Use Variables

```hcl
# Parameterize everything
variable "environment" {}
variable "instance_count" {}
variable "instance_type" {}
```

### 6. Tag Everything

```hcl
locals {
  common_tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
    Project     = "MyApp"
  }
}

resource "aws_instance" "web" {
  # ...
  tags = merge(local.common_tags, {
    Name = "web-server"
  })
}
```

### 7. Use Workspaces

```bash
# Create workspace
terraform workspace new production
terraform workspace new staging

# List workspaces
terraform workspace list

# Switch workspace
terraform workspace select production
```

## Summary

You've learned:
- What Infrastructure as Code is and why it matters
- Declarative vs Imperative approaches
- Terraform fundamentals (providers, resources, variables, outputs, modules)
- Terraform commands and workflow
- State management
- Ansible basics (inventory, playbooks, roles)
- Combining Terraform and Ansible
- IaC best practices

**Key Takeaway**: Infrastructure as Code makes infrastructure manageable, versionable, and reproducible, treating it like application code.

## Next Steps

In the next lesson, **Monitoring and Logging**, we'll learn how to observe and understand what's happening in our systems using Prometheus, Grafana, and the ELK stack.

---

**Challenge**:
Create a complete infrastructure setup:
1. Use Terraform to provision AWS infrastructure (VPC, EC2, RDS)
2. Organize code into reusable modules
3. Use remote state with S3
4. Create separate environments (dev, staging, prod)
5. Use Ansible to configure servers
6. Automate the entire process
7. Version control everything
