import { Router } from 'express';
import {
  getFoods, getFood, getPopularFoods, getFeaturedFoods,
  createFood, updateFood, deleteFood,
} from '../controllers/foodController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.get('/', optionalAuth, getFoods);
router.get('/popular', getPopularFoods);
router.get('/featured', getFeaturedFoods);
router.get('/:id', getFood);
router.post('/', protect, authorize('admin'), upload.single('image'), createFood);
router.put('/:id', protect, authorize('admin'), upload.single('image'), updateFood);
router.delete('/:id', protect, authorize('admin'), deleteFood);

export default router;
