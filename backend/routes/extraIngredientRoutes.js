import { Router } from 'express';
import {
  getExtraIngredients, createExtraIngredient, updateExtraIngredient, deleteExtraIngredient,
} from '../controllers/extraIngredientController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, getExtraIngredients);
router.post('/', protect, authorize('admin'), createExtraIngredient);
router.put('/:id', protect, authorize('admin'), updateExtraIngredient);
router.delete('/:id', protect, authorize('admin'), deleteExtraIngredient);

export default router;
