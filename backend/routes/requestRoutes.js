import { Router } from 'express';
import {
  createRequest, getPendingRequests, completeRequest, getTodayRequests,
} from '../controllers/requestController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.post('/', createRequest);
router.get('/pending', protect, authorize('waiter', 'admin'), getPendingRequests);
router.get('/today', protect, authorize('admin'), getTodayRequests);
router.put('/:id/complete', protect, authorize('waiter', 'admin'), completeRequest);

export default router;
