import multer from 'multer';
import { config } from '../config';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept standard image types
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp') {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Only JPEG, PNG, or WEBP are allowed.'));
  }
};

export const upload = multer({ 
  storage,
  limits: {
    fileSize: config.maxFileSizeBytes
  },
  fileFilter,
});
