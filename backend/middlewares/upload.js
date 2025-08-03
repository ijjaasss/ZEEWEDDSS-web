// middlewares/upload.js
import multer from 'multer';

const upload = multer({
  dest: 'uploads/', 
  limits: { fileSize: 10 * 1024 * 1024 }, // Max 10MB
});

export default upload;
