# Lesson 6: Kubernetes Basics

## What is Kubernetes?

Imagine you're managing a shipping port with thousands of containers. You need to know where each container is, route ships to the right docks, handle broken cranes, and scale operations during busy seasons. Kubernetes does this for software containers.

### Simple Explanation

**Kubernetes** (K8s) is an open-source container orchestration platform that automates deploying, scaling, and managing containerized applications.

**Key Idea**: Docker runs containers. Kubernetes manages containers at scale.

### The Kubernetes Story

```
┌─────────────────────────────────────────────┐
│         Evolution of Deployment             │
├─────────────────────────────────────────────┤
│                                             │
│  2000s: Physical Servers                    │
│  ├─ One app per server                      │
│  ├─ Expensive, underutilized                │
│  └─ Slow to deploy                          │
│                                             │
│  2010s: Virtual Machines                    │
│  ├─ Multiple apps per server                │
│  ├─ Better utilization                      │
│  └─ Still heavyweight                       │
│                                             │
│  2013: Docker Containers                    │
│  ├─ Lightweight, portable                   │
│  ├─ Fast deployment                         │
│  └─ But... how to manage thousands?         │
│                                             │
│  2014: Kubernetes                           │
│  ├─ Orchestrate containers                  │
│  ├─ Auto-scaling, self-healing              │
│  └─ Production-grade management             │
│                                             │
└─────────────────────────────────────────────┘
```

## Why Kubernetes?

### Problems Kubernetes Solves

1. **Manual Container Management**
   - Running 100s of containers manually is impossible
   - Kubernetes automates deployment and management

2. **Scaling**
   - Traffic spike? Need more containers
   - Kubernetes scales automatically

3. **High Availability**
   - Container crashes? Kubernetes restarts it
   - Node fails? Kubernetes moves containers

4. **Load Balancing**
   - Distribute traffic across containers
   - Kubernetes handles this automatically

5. **Rolling Updates**
   - Update without downtime
   - Kubernetes rolls out changes gradually

6. **Self-Healing**
   - Automatic restart of failed containers
   - Replace unhealthy containers

## Kubernetes Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Kubernetes Cluster                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────┐    │
│  │           Control Plane (Master)                  │    │
│  ├───────────────────────────────────────────────────┤    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────┐ │    │
│  │  │ API Server  │  │  Scheduler  │  │Controller│ │    │
│  │  │  (kube-api) │  │             │  │ Manager  │ │    │
│  │  └─────────────┘  └─────────────┘  └──────────┘ │    │
│  │  ┌─────────────┐                                 │    │
│  │  │    etcd     │  (Cluster state database)       │    │
│  │  └─────────────┘                                 │    │
│  └───────────────────────────────────────────────────┘    │
│                                                             │
│  ┌───────────────────────────────────────────────────┐    │
│  │                Worker Nodes                       │    │
│  ├───────────────────────────────────────────────────┤    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐        │    │
│  │  │  Node 1  │  │  Node 2  │  │  Node 3  │        │    │
│  │  ├──────────┤  ├──────────┤  ├──────────┤        │    │
│  │  │ kubelet  │  │ kubelet  │  │ kubelet  │        │    │
│  │  │ kube-    │  │ kube-    │  │ kube-    │        │    │
│  │  │ proxy    │  │ proxy    │  │ proxy    │        │    │
│  │  ├──────────┤  ├──────────┤  ├──────────┤        │    │
│  │  │  Pods    │  │  Pods    │  │  Pods    │        │    │
│  │  │┌──┐ ┌──┐│  │┌──┐ ┌──┐│  │┌──┐ ┌──┐│        │    │
│  │  ││C1│ │C2││  ││C3│ │C4││  ││C5│ │C6││        │    │
│  │  │└──┘ └──┘│  │└──┘ └──┘│  │└──┘ └──┘│        │    │
│  │  └──────────┘  └──────────┘  └──────────┘        │    │
│  └───────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Control Plane Components

1. **API Server**
   - Frontend for Kubernetes
   - All commands go through here
   - RESTful interface

2. **etcd**
   - Key-value store for cluster data
   - Stores all cluster state
   - Highly available

3. **Scheduler**
   - Assigns pods to nodes
   - Considers resources, constraints
   - Optimizes placement

4. **Controller Manager**
   - Runs controller processes
   - Ensures desired state
   - Handles node failures, replication

### Node Components

1. **kubelet**
   - Agent running on each node
   - Manages pods and containers
   - Reports to control plane

2. **kube-proxy**
   - Network proxy on each node
   - Implements service networking
   - Load balances traffic

3. **Container Runtime**
   - Runs containers (Docker, containerd)
   - Pulls images
   - Starts/stops containers

## Core Kubernetes Concepts

### 1. Pods

**The smallest deployable unit in Kubernetes.**

```
┌──────────────────────────────┐
│          Pod                 │
├──────────────────────────────┤
│  ┌────────────────────────┐ │
│  │  Container 1           │ │
│  │  (main app)            │ │
│  └────────────────────────┘ │
│  ┌────────────────────────┐ │
│  │  Container 2           │ │
│  │  (sidecar - optional)  │ │
│  └────────────────────────┘ │
│                              │
│  - Shared network namespace  │
│  - Shared storage            │
│  - Single IP address         │
└──────────────────────────────┘
```

**pod.yaml**:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.21
    ports:
    - containerPort: 80
```

### 2. Deployments

**Manages replica sets and provides declarative updates.**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3  # Run 3 copies
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
```

### 3. Services

**Expose pods to network traffic.**

```
┌─────────────────────────────────────┐
│          Service                    │
│  (Load Balancer)                    │
│                                     │
│  ┌─────┐  ┌─────┐  ┌─────┐        │
│  │Pod 1│  │Pod 2│  │Pod 3│        │
│  └─────┘  └─────┘  └─────┘        │
│                                     │
│  Provides:                          │
│  - Stable IP address                │
│  - DNS name                         │
│  - Load balancing                   │
└─────────────────────────────────────┘
```

**service.yaml**:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: LoadBalancer  # ClusterIP, NodePort, or LoadBalancer
```

### 4. ConfigMaps

**Store configuration data.**

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  database_url: "postgres://db:5432/myapp"
  log_level: "info"
  app.properties: |
    color=blue
    mode=production
```

**Using in Pod**:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-pod
spec:
  containers:
  - name: app
    image: myapp:1.0
    envFrom:
    - configMapRef:
        name: app-config
```

### 5. Secrets

**Store sensitive data.**

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
data:
  username: YWRtaW4=  # base64 encoded "admin"
  password: cGFzc3dvcmQ=  # base64 encoded "password"
```

**Using in Pod**:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-pod
spec:
  containers:
  - name: app
    image: myapp:1.0
    env:
    - name: DB_USERNAME
      valueFrom:
        secretKeyRef:
          name: db-secret
          key: username
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: db-secret
          key: password
```

### 6. Namespaces

**Virtual clusters within a cluster.**

```bash
# Create namespace
kubectl create namespace development

# List namespaces
kubectl get namespaces

# Set default namespace
kubectl config set-context --current --namespace=development
```

**namespace.yaml**:
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: production
```

## kubectl Commands

### Cluster Info

```bash
# Cluster information
kubectl cluster-info

# Get nodes
kubectl get nodes

# Describe node
kubectl describe node node-1

# Get cluster version
kubectl version
```

### Working with Pods

```bash
# Get all pods
kubectl get pods

# Get pods in all namespaces
kubectl get pods --all-namespaces

# Get pods with labels
kubectl get pods -l app=nginx

# Describe pod
kubectl describe pod nginx-pod

# Get pod logs
kubectl logs nginx-pod

# Follow logs
kubectl logs -f nginx-pod

# Logs from specific container
kubectl logs nginx-pod -c container-name

# Execute command in pod
kubectl exec nginx-pod -- ls /

# Interactive shell
kubectl exec -it nginx-pod -- /bin/bash

# Port forwarding
kubectl port-forward nginx-pod 8080:80

# Delete pod
kubectl delete pod nginx-pod
```

### Working with Deployments

```bash
# Create deployment
kubectl create deployment nginx --image=nginx:1.21

# Get deployments
kubectl get deployments

# Describe deployment
kubectl describe deployment nginx

# Scale deployment
kubectl scale deployment nginx --replicas=5

# Update image
kubectl set image deployment/nginx nginx=nginx:1.22

# Rollout status
kubectl rollout status deployment/nginx

# Rollout history
kubectl rollout history deployment/nginx

# Rollback
kubectl rollout undo deployment/nginx

# Rollback to specific revision
kubectl rollout undo deployment/nginx --to-revision=2

# Delete deployment
kubectl delete deployment nginx
```

### Working with Services

```bash
# Create service
kubectl expose deployment nginx --port=80 --type=LoadBalancer

# Get services
kubectl get services

# Describe service
kubectl describe service nginx

# Delete service
kubectl delete service nginx
```

### Working with ConfigMaps and Secrets

```bash
# Create ConfigMap from literal
kubectl create configmap app-config --from-literal=key=value

# Create ConfigMap from file
kubectl create configmap app-config --from-file=config.properties

# Get ConfigMaps
kubectl get configmaps

# Describe ConfigMap
kubectl describe configmap app-config

# Create Secret
kubectl create secret generic db-secret \
  --from-literal=username=admin \
  --from-literal=password=secret

# Get Secrets
kubectl get secrets

# Describe Secret
kubectl describe secret db-secret
```

### Apply YAML Files

```bash
# Apply configuration
kubectl apply -f deployment.yaml

# Apply all YAML files in directory
kubectl apply -f ./configs/

# Apply from URL
kubectl apply -f https://example.com/config.yaml

# Delete from file
kubectl delete -f deployment.yaml
```

### Debugging

```bash
# Get events
kubectl get events

# Get events sorted
kubectl get events --sort-by=.metadata.creationTimestamp

# Describe pod (shows events)
kubectl describe pod nginx-pod

# View logs
kubectl logs nginx-pod

# Previous container logs
kubectl logs nginx-pod --previous

# Run debugging pod
kubectl run debug --image=busybox -it --rm -- sh

# Check API resources
kubectl api-resources

# Explain resource
kubectl explain pod
kubectl explain pod.spec
```

## Creating Deployments

### Simple Node.js Deployment

**deployment.yaml**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nodejs-app
  labels:
    app: nodejs
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nodejs
  template:
    metadata:
      labels:
        app: nodejs
    spec:
      containers:
      - name: nodejs
        image: node:18-alpine
        command: ["node"]
        args: ["server.js"]
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "3000"
        resources:
          requests:
            memory: "128Mi"
            cpu: "250m"
          limits:
            memory: "256Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: nodejs-service
spec:
  selector:
    app: nodejs
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

Apply it:
```bash
kubectl apply -f deployment.yaml
kubectl get deployments
kubectl get pods
kubectl get services
```

## Scaling Applications

### Manual Scaling

```bash
# Scale to 5 replicas
kubectl scale deployment nodejs-app --replicas=5

# Verify
kubectl get pods
```

### Auto-scaling (HPA - Horizontal Pod Autoscaler)

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: nodejs-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: nodejs-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

```bash
kubectl apply -f hpa.yaml
kubectl get hpa
```

## Rolling Updates

### Update Deployment

```bash
# Update image
kubectl set image deployment/nodejs-app nodejs=node:19-alpine

# Watch rollout
kubectl rollout status deployment/nodejs-app

# Check history
kubectl rollout history deployment/nodejs-app

# Rollback if needed
kubectl rollout undo deployment/nodejs-app
```

### Update Strategy in YAML

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nodejs-app
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # Max pods over desired count
      maxUnavailable: 0  # Max pods unavailable during update
  template:
    # ... pod template
```

## Minikube (Local Kubernetes)

### Install Minikube

```bash
# Linux
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# macOS
brew install minikube

# Windows
choco install minikube
```

### Minikube Commands

```bash
# Start cluster
minikube start

# Start with specific resources
minikube start --cpus=4 --memory=8192

# Get cluster status
minikube status

# Access dashboard
minikube dashboard

# Get service URL
minikube service nodejs-service

# SSH into node
minikube ssh

# Stop cluster
minikube stop

# Delete cluster
minikube delete

# Enable addons
minikube addons enable ingress
minikube addons enable metrics-server
```

## Practical Example: Full Application

### Complete Stack

**1. Database (PostgreSQL)**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: password
        - name: POSTGRES_DB
          value: myapp
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: postgres-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
  type: ClusterIP
```

**2. API (Node.js)**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: myapi:1.0
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          value: postgres://postgres-service:5432/myapp
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: password
---
apiVersion: v1
kind: Service
metadata:
  name: api-service
spec:
  selector:
    app: api
  ports:
  - port: 3000
  type: ClusterIP
```

**3. Frontend (React)**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: myfrontend:1.0
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
spec:
  selector:
    app: frontend
  ports:
  - port: 80
  type: LoadBalancer
```

**Deploy**:
```bash
# Create secret
kubectl create secret generic db-secret --from-literal=password=secretpass

# Apply all
kubectl apply -f postgres.yaml
kubectl apply -f api.yaml
kubectl apply -f frontend.yaml

# Check status
kubectl get all
```

## Best Practices

1. **Use namespaces** for different environments
2. **Set resource limits** on all containers
3. **Use health checks** (liveness & readiness probes)
4. **Don't use latest tag** for images
5. **Use ConfigMaps** for configuration
6. **Use Secrets** for sensitive data
7. **Label everything** for organization
8. **Use rolling updates** for zero-downtime deploys
9. **Monitor and log** everything
10. **Use RBAC** for security

## Summary

You've learned:
- What Kubernetes is and why it's needed
- Kubernetes architecture
- Core concepts (Pods, Deployments, Services, ConfigMaps, Secrets, Namespaces)
- kubectl commands
- Creating and managing deployments
- Scaling applications
- Rolling updates
- Using Minikube locally
- Real-world application deployment

**Key Takeaway**: Kubernetes orchestrates containers at scale, providing automatic scaling, self-healing, and zero-downtime deployments.

## Next Steps

In the next lesson, **Git Advanced**, we'll explore advanced Git techniques including branching strategies, rebasing, hooks, and team workflows that are essential for DevOps.

---

**Challenge**:
Deploy a complete 3-tier application (database, API, frontend) on Kubernetes with:
1. Multiple replicas for high availability
2. ConfigMaps for configuration
3. Secrets for sensitive data
4. Resource limits
5. Health checks
6. Auto-scaling enabled
