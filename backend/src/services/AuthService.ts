import bcrypt from 'bcrypt';
import { userRepository } from '../repositories/userRepository';
import { AppError } from '../utils/AppError';
import { signToken } from '../utils/jwt';

export class AuthService {
  async register(data: any) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await userRepository.create({
      ...data,
      password: hashedPassword,
    });

    const token = signToken(user.id);
    return { user, token };
  }

  async login(data: any) {
    const user = await userRepository.findByEmail(data.email);
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new AppError('Incorrect email or password', 401);
    }

    const token = signToken(user.id);
    return { user, token };
  }
}

export const authService = new AuthService();
