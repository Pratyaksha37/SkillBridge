import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import skillRoutes from './skillRoutes';
import sessionRoutes from './sessionRoutes';
import messageRoutes from './messageRoutes';
import ratingRoutes from './ratingRoutes';
import connectionRoutes from './connectionRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/skills', skillRoutes);
router.use('/sessions', sessionRoutes);
router.use('/messages', messageRoutes);
router.use('/ratings', ratingRoutes);
router.use('/connections', connectionRoutes);

export default router;
