import { Router } from 'express';
import * as skillController from '../controllers/skillController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/', skillController.getSkills);
router.post('/', protect, skillController.addSkill);
router.delete('/', protect, skillController.removeSkill);

export default router;
