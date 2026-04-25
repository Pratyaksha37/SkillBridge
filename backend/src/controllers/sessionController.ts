import { Response } from 'express';
import { sessionService } from '../services/sessionService';
import { catchAsync } from '../utils/catchAsync';
import { AuthRequest } from '../types';

export const createSession = catchAsync(async (req: AuthRequest, res: Response) => {
  const session = await sessionService.createSession(req.body);

  res.status(201).json({
    status: 'success',
    data: { session },
  });
});

export const getSessions = catchAsync(async (req: AuthRequest, res: Response) => {
  const sessions = await sessionService.getSessions(req.user!.id);

  res.status(200).json({
    status: 'success',
    data: { sessions },
  });
});
