import { Router } from 'express';
import * as ratingController from '../controllers/ratingController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/:userId', ratingController.getRatingsForUser);
router.post('/', ratingController.createRating);

export default router;
