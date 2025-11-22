# Lesson 09: Auto Scaling

## What is Auto Scaling?

**Auto Scaling** = Automatically adjust number of EC2 instances.

**Benefits**:
- Handle traffic spikes
- Reduce costs (scale down)
- High availability
- Automatic recovery

---

## Create Launch Template

```bash
aws ec2 create-launch-template \
  --launch-template-name vahanhelp-backend-template \
  --version-description v1 \
  --launch-template-data '{
    "ImageId": "ami-0c55b159cbfafe1f0",
    "InstanceType": "t2.micro",
    "KeyName": "vahanhelp-key",
    "SecurityGroupIds": ["sg-123"],
    "IamInstanceProfile": {"Arn": "arn:aws:iam::..."},
    "UserData": "IyEvYmluL2Jhc2gK..."
  }'
```

---

## Create Auto Scaling Group

```bash
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name vahanhelp-asg \
  --launch-template LaunchTemplateName=vahanhelp-backend-template \
  --min-size 2 \
  --max-size 10 \
  --desired-capacity 2 \
  --target-group-arns arn:aws:elasticloadbalancing:... \
  --vpc-zone-identifier subnet-123,subnet-456
```

---

## Scaling Policies

### Target Tracking
```bash
# Scale based on CPU
aws autoscaling put-scaling-policy \
  --auto-scaling-group-name vahanhelp-asg \
  --policy-name cpu-target-tracking \
  --policy-type TargetTrackingScaling \
  --target-tracking-configuration '{
    "PredefinedMetricSpecification": {
      "PredefinedMetricType": "ASGAverageCPUUtilization"
    },
    "TargetValue": 70.0
  }'
```

**Next Lesson**: [10-cloudfront-cdn.md](10-cloudfront-cdn.md)
