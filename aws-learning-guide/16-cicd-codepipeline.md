# Lesson 16: CI/CD with CodePipeline

## What is CI/CD?

**CI/CD** = Continuous Integration / Continuous Deployment.

**Benefits**:
- Automated testing
- Faster releases
- Fewer bugs
- Consistent deployments
- Rollback capability

**AWS Services**:
- **CodePipeline**: Orchestration (workflow)
- **CodeBuild**: Build and test
- **CodeDeploy**: Deploy to EC2/ECS
- **CodeCommit**: Git repository (optional)

---

## CI/CD Pipeline Architecture

```
GitHub → CodePipeline → CodeBuild (Test & Build) → CodeDeploy → EC2/ECS
```

**VahanHelp Pipeline**:
```
1. Developer pushes to GitHub (main branch)
2. CodePipeline detects change
3. CodeBuild runs tests and builds Docker image
4. CodeDeploy deploys to EC2 instances
5. Health check passes → Traffic switched
```

---

## Setup: CodeBuild

### 1. Create buildspec.yml

```yaml
# buildspec.yml (in project root)
version: 0.2

phases:
  pre_build:
    commands:
      - echo Logging in to Amazon ECR...
      - aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
      - REPOSITORY_URI=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/vahanhelp-backend
      - COMMIT_HASH=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)
      - IMAGE_TAG=${COMMIT_HASH:=latest}

  build:
    commands:
      - echo Installing dependencies...
      - npm install
      - echo Running tests...
      - npm test
      - echo Building Docker image...
      - docker build -t $REPOSITORY_URI:latest .
      - docker tag $REPOSITORY_URI:latest $REPOSITORY_URI:$IMAGE_TAG

  post_build:
    commands:
      - echo Pushing Docker image...
      - docker push $REPOSITORY_URI:latest
      - docker push $REPOSITORY_URI:$IMAGE_TAG
      - echo Writing image definitions file...
      - printf '[{"name":"vahanhelp-backend","imageUri":"%s"}]' $REPOSITORY_URI:$IMAGE_TAG > imagedefinitions.json

artifacts:
  files:
    - imagedefinitions.json
    - appspec.yml
```

### 2. Create CodeBuild Project

```bash
aws codebuild create-project \
  --name vahanhelp-backend-build \
  --source type=GITHUB,location=https://github.com/vahanhelp/backend.git \
  --artifacts type=NO_ARTIFACTS \
  --environment type=LINUX_CONTAINER,image=aws/codebuild/standard:7.0,computeType=BUILD_GENERAL1_SMALL,privilegedMode=true \
  --service-role arn:aws:iam::123456789012:role/CodeBuildServiceRole \
  --environment-variables '[
    {"name":"AWS_DEFAULT_REGION","value":"us-east-1"},
    {"name":"AWS_ACCOUNT_ID","value":"123456789012"}
  ]'
```

---

## Setup: CodeDeploy

### 1. Create appspec.yml

```yaml
# appspec.yml (for EC2 deployment)
version: 0.0
os: linux

files:
  - source: /
    destination: /home/ec2-user/vahanhelp-backend

hooks:
  BeforeInstall:
    - location: scripts/before_install.sh
      timeout: 300
      runas: ec2-user

  AfterInstall:
    - location: scripts/after_install.sh
      timeout: 300
      runas: ec2-user

  ApplicationStart:
    - location: scripts/start_server.sh
      timeout: 300
      runas: ec2-user

  ValidateService:
    - location: scripts/validate_service.sh
      timeout: 300
      runas: ec2-user
```

### 2. Deployment Scripts

**scripts/before_install.sh**:
```bash
#!/bin/bash
# Stop existing application
pm2 stop vahanhelp-api || true
pm2 delete vahanhelp-api || true

# Backup current version
if [ -d "/home/ec2-user/vahanhelp-backend" ]; then
  cp -r /home/ec2-user/vahanhelp-backend /home/ec2-user/vahanhelp-backend-backup
fi
```

**scripts/after_install.sh**:
```bash
#!/bin/bash
cd /home/ec2-user/vahanhelp-backend

# Install dependencies
npm install --production

# Run migrations
npm run migrate
```

**scripts/start_server.sh**:
```bash
#!/bin/bash
cd /home/ec2-user/vahanhelp-backend

# Start with PM2
pm2 start src/server.js --name vahanhelp-api
pm2 save
```

**scripts/validate_service.sh**:
```bash
#!/bin/bash
# Health check
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health)

if [ "$response" != "200" ]; then
  echo "Health check failed"
  exit 1
fi

echo "Health check passed"
exit 0
```

### 3. Create CodeDeploy Application

```bash
# Create application
aws deploy create-application \
  --application-name VahanHelp-Backend \
  --compute-platform Server

# Create deployment group
aws deploy create-deployment-group \
  --application-name VahanHelp-Backend \
  --deployment-group-name Production \
  --deployment-config-name CodeDeployDefault.OneAtATime \
  --ec2-tag-filters Key=Name,Value=VahanHelp-Backend,Type=KEY_AND_VALUE \
  --service-role-arn arn:aws:iam::123456789012:role/CodeDeployServiceRole
```

---

## Setup: CodePipeline

```bash
# Create pipeline
aws codepipeline create-pipeline --cli-input-json file://pipeline.json
```

**pipeline.json**:
```json
{
  "pipeline": {
    "name": "VahanHelp-Backend-Pipeline",
    "roleArn": "arn:aws:iam::123456789012:role/CodePipelineServiceRole",
    "artifactStore": {
      "type": "S3",
      "location": "vahanhelp-pipeline-artifacts"
    },
    "stages": [
      {
        "name": "Source",
        "actions": [
          {
            "name": "Source",
            "actionTypeId": {
              "category": "Source",
              "owner": "ThirdParty",
              "provider": "GitHub",
              "version": "1"
            },
            "configuration": {
              "Owner": "vahanhelp",
              "Repo": "backend",
              "Branch": "main",
              "OAuthToken": "{{resolve:secretsmanager:github-token}}"
            },
            "outputArtifacts": [
              {
                "name": "SourceOutput"
              }
            ]
          }
        ]
      },
      {
        "name": "Build",
        "actions": [
          {
            "name": "Build",
            "actionTypeId": {
              "category": "Build",
              "owner": "AWS",
              "provider": "CodeBuild",
              "version": "1"
            },
            "configuration": {
              "ProjectName": "vahanhelp-backend-build"
            },
            "inputArtifacts": [
              {
                "name": "SourceOutput"
              }
            ],
            "outputArtifacts": [
              {
                "name": "BuildOutput"
              }
            ]
          }
        ]
      },
      {
        "name": "Deploy",
        "actions": [
          {
            "name": "Deploy",
            "actionTypeId": {
              "category": "Deploy",
              "owner": "AWS",
              "provider": "CodeDeploy",
              "version": "1"
            },
            "configuration": {
              "ApplicationName": "VahanHelp-Backend",
              "DeploymentGroupName": "Production"
            },
            "inputArtifacts": [
              {
                "name": "BuildOutput"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

---

## Docker Deployment (ECS)

### 1. Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "src/server.js"]
```

### 2. Create ECR Repository

```bash
# Create repository
aws ecr create-repository --repository-name vahanhelp-backend

# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  123456789012.dkr.ecr.us-east-1.amazonaws.com

# Build and push
docker build -t vahanhelp-backend .
docker tag vahanhelp-backend:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/vahanhelp-backend:latest
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/vahanhelp-backend:latest
```

---

## GitHub Actions (Alternative)

### .github/workflows/deploy.yml

```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm test

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: vahanhelp-backend
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest

      - name: Deploy to EC2
        run: |
          aws deploy create-deployment \
            --application-name VahanHelp-Backend \
            --deployment-group-name Production \
            --github-location repository=${{ github.repository }},commitId=${{ github.sha }}
```

---

## Blue/Green Deployment

**Strategy**: Deploy to new instances, switch traffic, keep old instances for rollback.

```bash
# Create deployment with blue/green
aws deploy create-deployment \
  --application-name VahanHelp-Backend \
  --deployment-group-name Production \
  --deployment-config-name CodeDeployDefault.BlueGreen \
  --description "Blue/Green deployment" \
  --s3-location bucket=vahanhelp-pipeline-artifacts,key=backend.zip,bundleType=zip
```

---

## Monitoring Pipeline

### CloudWatch Alarms

```bash
# Alert on pipeline failures
aws cloudwatch put-metric-alarm \
  --alarm-name vahanhelp-pipeline-failures \
  --metric-name PipelineExecutionFailure \
  --namespace AWS/CodePipeline \
  --statistic Sum \
  --period 300 \
  --threshold 1 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1 \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:vahanhelp-alerts
```

### SNS Notifications

```javascript
// Lambda function: Notify on pipeline events
exports.handler = async (event) => {
  const message = JSON.parse(event.Records[0].Sns.Message);

  if (message.detailType === 'CodePipeline Pipeline Execution State Change') {
    const state = message.detail.state;
    const pipeline = message.detail.pipeline;

    if (state === 'SUCCEEDED') {
      await sendSlackMessage(`✅ Deployment successful: ${pipeline}`);
    } else if (state === 'FAILED') {
      await sendSlackMessage(`❌ Deployment failed: ${pipeline}`);
    }
  }
};
```

---

## Rollback Strategy

### Manual Rollback

```bash
# List deployments
aws deploy list-deployments \
  --application-name VahanHelp-Backend \
  --deployment-group-name Production

# Get previous deployment
PREV_DEPLOYMENT_ID=d-1234567890

# Redeploy previous version
aws deploy create-deployment \
  --application-name VahanHelp-Backend \
  --deployment-group-name Production \
  --revision revisionType=S3,s3Location={bucket=vahanhelp-pipeline-artifacts,key=backend-v1.2.3.zip,bundleType=zip}
```

### Automatic Rollback

```json
{
  "autoRollbackConfiguration": {
    "enabled": true,
    "events": ["DEPLOYMENT_FAILURE", "DEPLOYMENT_STOP_ON_ALARM"]
  },
  "alarmConfiguration": {
    "enabled": true,
    "alarms": [
      {
        "name": "vahanhelp-high-errors"
      }
    ]
  }
}
```

---

## Best Practices

1. **Test locally**: Run tests before pushing
2. **Environment variables**: Use AWS Secrets Manager
3. **Health checks**: Always implement /health endpoint
4. **Gradual rollout**: Use CodeDeploy traffic shifting
5. **Monitor deployments**: CloudWatch + SNS alerts
6. **Rollback plan**: Test rollback before production
7. **Database migrations**: Run before code deployment
8. **Zero downtime**: Use load balancer + multiple instances

---

## Practice Exercise

1. Set up CodePipeline with GitHub
2. Create buildspec.yml with tests
3. Configure CodeDeploy for EC2
4. Implement blue/green deployment
5. Add CloudWatch alarms for failures
6. Test rollback strategy

---

## Complete CI/CD Workflow

```
Developer → Git Push → GitHub
                          ↓
                    CodePipeline (detect change)
                          ↓
                    CodeBuild (npm test, docker build)
                          ↓
                    ECR (push image)
                          ↓
                    CodeDeploy (deploy to EC2)
                          ↓
                    Health Check
                          ↓
                    Success → SNS → Slack notification
                    Failure → Auto rollback
```

---

**Next Lesson**: [17-ecs-docker.md](17-ecs-docker.md)
