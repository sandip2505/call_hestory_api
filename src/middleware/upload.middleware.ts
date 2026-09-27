import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { config } from '../config/env.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    
    const dir = path.join(config.uploadDir, 'recordings', year, month);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname) || '.m4a';
    cb(null, `recording-${uniqueSuffix}${ext}`);
  }
});

export const upload = multer({
  storage,
  limits: {
    fileSize: config.maxRecordingSizeMb * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    // Basic filter, accept audio
    if (file.mimetype.startsWith('audio/') || file.mimetype === 'application/octet-stream') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only audio is allowed!'));
    }
  }
});
