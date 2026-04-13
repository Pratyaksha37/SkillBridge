import type { IUserRepository } from '../repositories/interfaces/IUserRepository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import type { User } from '@prisma/client';
import { NotificationManager } from '../patterns/Observer.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class AuthService {
  constructor(private userRepository: IUserRepository) {}

  async register(userData: any): Promise<{ user: Omit<User, 'password'>; token: string }> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const userRole = userData.role || Role.LEARNER;

    const user = await this.userRepository.create({
      email: userData.email,
      name: userData.name,
      password: hashedPassword,
      bio: userData.bio || '',
      role: userRole
    });

    // Notify observers about new user registration
    NotificationManager.getInstance().notify('USER_REGISTERED', { id: user.id, email: user.email });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async login(credentials: any): Promise<{ user: Omit<User, 'password'>; token: string }> {
    const user = await this.userRepository.findByEmail(credentials.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(credentials.password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    // Notify observers about user login
    NotificationManager.getInstance().notify('USER_LOGGED_IN', { id: user.id });

    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async getProfile(userId: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
