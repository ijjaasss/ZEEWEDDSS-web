import express from 'express'
import { getCurrentUser, loginUser, logoutUser } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
const router = express.Router();



router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getCurrentUser);
export default router