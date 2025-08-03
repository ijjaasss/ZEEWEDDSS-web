// routes/galleryImageRoutes.js
import express from 'express';
import upload from '../middlewares/upload.js';
import { downloadGalleryImage, uploadImage } from '../controllers/galleryImageController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/upload', upload.single('image'),protect, uploadImage);
router.get('/download',downloadGalleryImage)
export default router;
