
import express from 'express';
import upload from '../middlewares/upload.js';
import { deleteRecentImage, getRecentImages, uploadRecentImage } from '../controllers/recentImageController.js';

const router = express.Router();

router.post('/upload', upload.single('image'), uploadRecentImage);
router.get('/', getRecentImages);
router.delete('/delete/:id', deleteRecentImage);
export default router;
