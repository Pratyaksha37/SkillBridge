import { Response } from 'express';
import { messageService } from '../services/messageService';
import { catchAsync } from '../utils/catchAsync';
import { AuthRequest } from '../types';

export const sendMessage = catchAsync(async (req: AuthRequest, res: Response) => {
  const message = await messageService.sendMessage({
    ...req.body,
    senderId: req.user!.id,
  });

  res.status(201).json({
    status: 'success',
    data: { message },
  });
});

export const getMessages = catchAsync(async (req: AuthRequest, res: Response) => {
  const messages = await messageService.getMessages(req.params.sessionId as string);

  res.status(200).json({
    status: 'success',
    data: { messages },
  });
});
