import { Router } from 'express';
import * as userController from '../controllers/userController';
import { protect, optionalProtect } from '../middleware/authMiddleware';

const router = Router();

router.get('/mentors', optionalProtect, userController.getMentors);

router.use(protect);

router.get('/dashboard', userController.getDashboard);
router.patch('/profile', userController.updateProfile);

export default router;
