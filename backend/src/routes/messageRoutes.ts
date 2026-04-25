import { Router } from 'express';
import * as messageController from '../controllers/messageController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/:sessionId', messageController.getMessages);
router.post('/', messageController.sendMessage);

export default router;
