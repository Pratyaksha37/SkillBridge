import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { catchAsync } from '../utils/catchAsync';
import { AuthRequest } from '../types';

export const register = catchAsync(async (req: Request, res: Response) => {
  const { user, token } = await authService.register(req.body);

  res.status(201).json({
    status: 'success',
    token,
    data: { user },
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { user, token } = await authService.login(req.body);

  res.status(200).json({
    status: 'success',
    token,
    data: { user },
  });
});

export const getMe = catchAsync(async (req: AuthRequest, res: Response) => {
  res.status(200).json({
    status: 'success',
    data: { user: req.user },
  });
});
