import { Router } from 'express';
import {
  getCategories, createCategory, updateCategory, deleteCategory, reorderCategories,
} from '../controllers/categoryController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.get('/', optionalAuth, getCategories);
router.post('/', protect, authorize('admin'), upload.single('image'), createCategory);
router.put('/reorder', protect, authorize('admin'), reorderCategories);
router.put('/:id', protect, authorize('admin'), upload.single('image'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

export default router;
