import { Request } from 'express';
import path from 'path';
import crypto from 'crypto';
import multer, { FileFilterCallback } from 'multer';

const uploadPath = path.resolve(__dirname, '..', '..', 'tmp');
const uploadFilter = (
  request: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
): void => {
  if (file.mimetype !== 'text/csv') {
    return callback(new Error('Only CSV files are accepted!'));
  }

  return callback(null, true);
};

const config = {
  destination: uploadPath,
  storage: multer.diskStorage({
    destination: uploadPath,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('HEX');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
  fileFilter: uploadFilter,
};

export default config;
