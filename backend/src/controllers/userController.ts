import { Response } from 'express';
import { userService } from '../services/userService';
import { catchAsync } from '../utils/catchAsync';
import { AuthRequest } from '../types';

export const getDashboard = catchAsync(async (req: AuthRequest, res: Response) => {
  const dashboardData = await userService.getDashboard(req.user!.id);

  res.status(200).json({
    status: 'success',
    data: dashboardData,
  });
});

export const getMentors = catchAsync(async (req: AuthRequest, res: Response) => {
  const mentors = await userService.getMentors(req.query, req.user?.id);

  res.status(200).json({
    status: 'success',
    data: { mentors },
  });
});

export const updateProfile = catchAsync(async (req: AuthRequest, res: Response) => {
  const updatedUser = await userService.updateProfile(req.user!.id, req.body);

  res.status(200).json({
    status: 'success',
    data: { user: updatedUser },
  });
});
