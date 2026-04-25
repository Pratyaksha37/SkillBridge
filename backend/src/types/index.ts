import { Request } from 'express';
import { User } from '@prisma/client';

export type UserWithoutPassword = Omit<User, 'password'>;

export interface AuthRequest extends Request {
  user?: UserWithoutPassword;
}
