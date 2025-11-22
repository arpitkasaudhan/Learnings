# Lesson 11: File Uploads

## Multer Setup

```bash
npm install multer
```

## Basic Upload

```javascript
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },  // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed'));
    }
  }
});

// Single file
app.post('/api/cars/:id/image', upload.single('image'), (req, res) => {
  res.json({ file: req.file });
});

// Multiple files
app.post('/api/cars/:id/images', upload.array('images', 5), (req, res) => {
  res.json({ files: req.files });
});
```

## Cloud Storage (Cloudinary)

```bash
npm install cloudinary
```

```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (file) => {
  const result = await cloudinary.uploader.upload(file.path, {
    folder: 'vahanhelp/cars'
  });
  return result.secure_url;
};
```

**Next Lesson**: [12-error-handling.md](12-error-handling.md)
