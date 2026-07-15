import { Router } from 'express';
import {
  getIngredients, createIngredient, updateIngredient, deleteIngredient,
} from '../controllers/ingredientController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, getIngredients);
router.post('/', protect, authorize('admin'), createIngredient);
router.put('/:id', protect, authorize('admin'), updateIngredient);
router.delete('/:id', protect, authorize('admin'), deleteIngredient);

export default router;
