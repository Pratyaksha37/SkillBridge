import { Router } from 'express';
import { prisma } from '../config/db';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/', protect, async (req: any, res: any) => {
  const { receiverId } = req.body;
  const requesterId = req.user.id;

  try {
    const connection = await prisma.connection.upsert({
      where: {
        requesterId_receiverId: { requesterId, receiverId }
      },
      update: {},
      create: { requesterId, receiverId }
    });

    res.status(201).json({ status: 'success', data: { connection } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to create connection' });
  }
});

router.delete('/:receiverId', protect, async (req: any, res: any) => {
  const { receiverId } = req.params;
  const requesterId = req.user.id;

  try {
    await prisma.connection.delete({
      where: {
        requesterId_receiverId: { requesterId, receiverId }
      }
    });

    res.status(200).json({ status: 'success', message: 'Connection removed' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to remove connection' });
  }
});

export default router;
