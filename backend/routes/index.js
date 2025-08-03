import express from 'express'
import authRoutes from './authRoute.js'
import galleryRoutes from './galleryRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import galleryImageRoutes from './galleryImageRoutes.js'
import recentImageRoutes from './recentImageRoutes.js';
import homePageRoute from './homePageRoute.js';
const router = express.Router();

router.use('/users', authRoutes);
router.use('/gallery', galleryRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/gallery-image',galleryImageRoutes)

router.use('/recent-image', recentImageRoutes);

router.use('/home-page', homePageRoute);
export default router