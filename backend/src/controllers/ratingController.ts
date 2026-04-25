import { Response } from 'express';
import { ratingService } from '../services/ratingService';
import { catchAsync } from '../utils/catchAsync';
import { AuthRequest } from '../types';

export const createRating = catchAsync(async (req: AuthRequest, res: Response) => {
  const rating = await ratingService.createRating({
    ...req.body,
    raterId: req.user!.id,
  });

  res.status(201).json({
    status: 'success',
    data: { rating },
  });
});

export const getRatingsForUser = catchAsync(async (req: AuthRequest, res: Response) => {
  const ratings = await ratingService.getRatingsForUser(req.params.userId as string);

  res.status(200).json({
    status: 'success',
    data: { ratings },
  });
});
