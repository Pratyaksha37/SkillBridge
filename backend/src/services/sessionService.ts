import { sessionRepository } from '../repositories/sessionRepository';

export class SessionService {
  async createSession(data: any) {
    return sessionRepository.create({
      ...data,
      scheduledAt: new Date(data.scheduledAt)
    });
  }

  async getSessions(userId: string) {
    return sessionRepository.findByUser(userId);
  }
}

export const sessionService = new SessionService();
