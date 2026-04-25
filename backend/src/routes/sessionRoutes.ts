import { Router } from 'express';
import * as sessionController from '../controllers/sessionController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', sessionController.getSessions);
router.post('/', sessionController.createSession);

export default router;
