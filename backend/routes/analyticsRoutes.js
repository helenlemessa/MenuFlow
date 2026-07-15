import { Router } from 'express';
import {
  getDashboardStats, getRevenueChart, getOrdersPerDay,
} from '../controllers/analyticsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/dashboard', protect, authorize('admin'), getDashboardStats);
router.get('/revenue', protect, authorize('admin'), getRevenueChart);
router.get('/orders-per-day', protect, authorize('admin'), getOrdersPerDay);

export default router;
