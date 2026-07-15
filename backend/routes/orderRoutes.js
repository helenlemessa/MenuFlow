import { Router } from 'express';
import {
  createOrder, getActiveOrders, getOrdersByTable, completeOrder,
  getRecentOrders, getTodayOrders, markOrderPaid,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.post('/', createOrder);
router.get('/active', protect, authorize('kitchen', 'admin', 'waiter'), getActiveOrders);
router.get('/recent', protect, authorize('admin', 'waiter'), getRecentOrders);
router.get('/today', protect, authorize('admin'), getTodayOrders);
router.get('/table/:tableNumber', protect, authorize('waiter', 'admin'), getOrdersByTable);
router.put('/:id/complete', protect, authorize('kitchen', 'admin'), completeOrder);
router.put('/:id/paid', protect, authorize('waiter', 'admin'), markOrderPaid);

export default router;
