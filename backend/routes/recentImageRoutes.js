
import express from 'express';
import upload from '../middlewares/upload.js';
import { deleteRecentImage, getRecentImages, uploadRecentImage } from '../controllers/recentImageController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/upload', upload.single('image'), protect,uploadRecentImage);
router.get('/', getRecentImages);
router.delete('/delete/:id', protect,deleteRecentImage);
export default router;
