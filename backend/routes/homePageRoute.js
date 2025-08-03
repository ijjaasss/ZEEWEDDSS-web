// routes/backgroundImageRoutes.js
import express from 'express';

import upload from '../middlewares/upload.js';
import { getBackgroundImage, uploadBackgroundImage } from '../controllers/homePageController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.post('/upload', upload.single('image'), protect ,uploadBackgroundImage);
router.get('/', getBackgroundImage);

export default router;
