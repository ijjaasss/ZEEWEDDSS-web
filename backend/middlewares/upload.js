// middlewares/upload.js
import multer from 'multer';

const upload = multer({
  dest: 'uploads/', 
  limits: { fileSize: 40 * 1024 * 1024 }, // Max 40MB
});

export default upload;
