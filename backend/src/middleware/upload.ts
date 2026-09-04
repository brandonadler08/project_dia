import multer from 'multer';
import path from 'path';
import fs from 'fs';

const createStorage = (subfolder: string) => multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, `../../uploads/${subfolder}`);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const documentFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG and PDF are allowed for documents.'));
  }
};

const mediaFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/quicktime'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, MP4 and MOV are allowed for media.'));
  }
};

export const uploadDocument = multer({ 
  storage: createStorage('documents'),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: documentFilter
});

export const uploadMedia = multer({ 
  storage: createStorage('media'),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: mediaFilter
});
