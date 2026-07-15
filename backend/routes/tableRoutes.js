import { Router } from 'express';
import {
  getTables, getTable, createTable, deleteTable, regenerateQR, updateTableStatus,
} from '../controllers/tableController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, getTables);
router.get('/number/:number', getTable);
router.post('/', protect, authorize('admin'), createTable);
router.put('/:id/status', protect, authorize('admin', 'waiter'), updateTableStatus);
router.put('/:id/qr', protect, authorize('admin'), regenerateQR);
router.delete('/:id', protect, authorize('admin'), deleteTable);

export default router;
