# Lesson 11: Lambda (Serverless)

## What is Lambda?

**Lambda** = Run code without managing servers.

**Benefits**:
- No server management
- Automatic scaling
- Pay per execution
- Event-driven

---

## Create Lambda Function

```javascript
// Image resize function
const AWS = require('aws-sdk');
const sharp = require('sharp');
const s3 = new AWS.S3();

exports.handler = async (event) => {
  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;

  const image = await s3.getObject({ Bucket: bucket, Key: key }).promise();

  const resized = await sharp(image.Body)
    .resize(800, 600)
    .jpeg({ quality: 80 })
    .toBuffer();

  await s3.putObject({
    Bucket: bucket,
    Key: `thumbnails/${key}`,
    Body: resized,
    ContentType: 'image/jpeg'
  }).promise();

  return { statusCode: 200, body: 'Image resized' };
};
```

---

## S3 Trigger

```bash
# Add S3 event notification
aws s3api put-bucket-notification-configuration \
  --bucket vahanhelp-car-images \
  --notification-configuration '{
    "LambdaFunctionConfigurations": [{
      "LambdaFunctionArn": "arn:aws:lambda:...",
      "Events": ["s3:ObjectCreated:*"]
    }]
  }'
```

**Next Lesson**: [12-elastic-beanstalk.md](12-elastic-beanstalk.md)
