# Lesson 04: S3 (Simple Storage Service)

## What is S3?

**S3** = Object storage service for files.

**Use Cases**:
- Static website hosting
- File uploads (images, videos)
- Backups and archives
- Data lakes

**Features**:
- 99.999999999% (11 9's) durability
- Unlimited storage
- Scalable
- Pay per GB stored

---

## S3 Concepts

### Bucket
Container for objects (like a folder).
- Globally unique name
- Region-specific

### Object
File stored in bucket.
- Max size: 5TB
- Identified by key (path)

### Key
Unique identifier (file path).
Example: `cars/honda-city/image1.jpg`

---

## Create S3 Bucket

### Via Console
```
1. Go to S3 Dashboard
2. Create bucket
3. Bucket name: vahanhelp-car-images
4. Region: us-east-1
5. Block Public Access: Keep enabled
6. Versioning: Enable (optional)
7. Encryption: Enable (SSE-S3)
8. Create bucket
```

### Via CLI
```bash
aws s3 mb s3://vahanhelp-car-images --region us-east-1
```

---

## Upload Files

### Via Console
1. Open bucket
2. Click "Upload"
3. Select files
4. Upload

### Via CLI
```bash
# Upload file
aws s3 cp local-file.jpg s3://vahanhelp-car-images/cars/

# Upload directory
aws s3 sync ./images s3://vahanhelp-car-images/cars/

# Download file
aws s3 cp s3://vahanhelp-car-images/cars/image.jpg ./

# List objects
aws s3 ls s3://vahanhelp-car-images/
```

### Via SDK (Node.js)
```javascript
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");

const s3 = new S3Client({ region: "us-east-1" });

async function uploadFile(filePath, key) {
  const fileContent = fs.readFileSync(filePath);

  const command = new PutObjectCommand({
    Bucket: "vahanhelp-car-images",
    Key: key,
    Body: fileContent,
    ContentType: "image/jpeg"
  });

  await s3.send(command);
  console.log("File uploaded successfully");
}

uploadFile("./car.jpg", "cars/honda-city/car.jpg");
```

---

## S3 Storage Classes

```
Standard          - Frequent access, 11 9's durability
Intelligent-Tiering - Auto-moves between tiers
Standard-IA       - Infrequent access, cheaper
One Zone-IA       - Single AZ, cheapest
Glacier           - Archive, retrieval in hours
Glacier Deep Archive - Long-term archive, retrieval in 12 hours
```

---

## S3 for VahanHelp

### Multer + S3 Upload
```javascript
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({ region: "us-east-1" });

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "vahanhelp-car-images",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `cars/${Date.now()}-${file.originalname}`);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 },  // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images allowed"));
    }
  }
});

// Route
app.post("/api/cars/:id/images", upload.array("images", 5), (req, res) => {
  const imageUrls = req.files.map(file => file.location);
  res.json({ success: true, images: imageUrls });
});
```

---

## S3 Bucket Policy

Make images publicly readable:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::vahanhelp-car-images/*"
    }
  ]
}
```

---

## S3 Lifecycle Policies

Auto-delete old images:

```json
{
  "Rules": [
    {
      "Id": "DeleteOldImages",
      "Status": "Enabled",
      "Filter": { "Prefix": "temp/" },
      "Expiration": { "Days": 30 }
    }
  ]
}
```

---

## Static Website Hosting

```bash
# Enable static website hosting
aws s3 website s3://vahanhelp-frontend \
  --index-document index.html \
  --error-document error.html

# Upload React build
cd frontend
npm run build
aws s3 sync build/ s3://vahanhelp-frontend

# Access: http://vahanhelp-frontend.s3-website-us-east-1.amazonaws.com
```

**Next Lesson**: [05-rds-databases.md](05-rds-databases.md)
