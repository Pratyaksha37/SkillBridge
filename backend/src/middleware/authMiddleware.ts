import { Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { verifyToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import { AuthRequest } from '../types';

export const protect = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  // 1) Getting token and check if it's there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // 2) Verification token
  const decoded = verifyToken(token);

  // 3) Check if user still exists
  const currentUser = await prisma.user.findUnique({
    where: { id: decoded.id },
    include: {
      skills: {
        include: {
          skill: true,
        },
      },
      ratingsReceived: true,
    },
  });

  if (!currentUser) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser as any;
  next();
});

export const optionalProtect = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = verifyToken(token);
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        skills: { include: { skill: true } },
        ratingsReceived: true,
      },
    });
    if (currentUser) {
      req.user = currentUser as any;
    }
  } catch (err) {
    // Ignore verification errors for optional protect
  }
  
  next();
});
