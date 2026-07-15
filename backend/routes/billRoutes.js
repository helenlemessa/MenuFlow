import { Router } from 'express';
import {
  getTableBill, getPendingBills, createBillFromRequest, markBillPaid, getTodayRevenue,
} from '../controllers/billController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/pending', protect, authorize('waiter', 'admin'), getPendingBills);
router.get('/today', protect, authorize('admin'), getTodayRevenue);
router.get('/table/:tableNumber', protect, authorize('waiter', 'admin'), getTableBill);
router.post('/', protect, authorize('waiter', 'admin'), createBillFromRequest);
router.put('/paid', protect, authorize('waiter', 'admin'), markBillPaid);

export default router;
