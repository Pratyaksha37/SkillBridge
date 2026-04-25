import { Request, Response } from 'express';
import { skillService } from '../services/skillService';
import { catchAsync } from '../utils/catchAsync';
import { AuthRequest } from '../types';

export const getSkills = catchAsync(async (req: Request, res: Response) => {
  const skills = await skillService.getAllSkills();

  res.status(200).json({
    status: 'success',
    data: { skills },
  });
});

export const addSkill = catchAsync(async (req: AuthRequest, res: Response) => {
  const skill = await skillService.createSkill({
    ...req.body,
    userId: req.user?.id
  });

  res.status(201).json({
    status: 'success',
    data: { skill },
  });
});

export const removeSkill = catchAsync(async (req: AuthRequest, res: Response) => {
  const { skillId, type } = req.query;

  if (!skillId || !type) {
    throw new AppError('Skill ID and type are required', 400);
  }

  await skillService.removeSkillFromUser(req.user!.id, skillId as string, type as 'OFFER' | 'SEEK');

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
