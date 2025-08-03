import express from 'express';
import {
  createGallery,
  getGalleries,
  getGallery,
  updateGallery,
  deleteGallery
} from '../controllers/galleryController.js';
import { protect } from '../middlewares/authMiddleware.js';


const router = express.Router();
router.get('/getgalleries',protect,getGalleries)
router.get('/get-by-id/:id',getGallery)
router.post('/create',protect,createGallery)
router.put('/update/:id',protect,updateGallery)
router.delete('/delete/:id',protect,deleteGallery)
export default router;