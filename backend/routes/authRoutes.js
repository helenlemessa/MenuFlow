import { Router } from 'express';
import { login, register, getMe, getUsers, updateUser, deleteUser } from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/register', protect, authorize('admin'), register);
router.get('/users', protect, authorize('admin'), getUsers);
router.put('/users/:id', protect, authorize('admin'), updateUser);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

export default router;
