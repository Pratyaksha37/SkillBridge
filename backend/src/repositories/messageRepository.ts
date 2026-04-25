import { prisma } from '../config/db';

export class MessageRepository {
  async create(data: { content: string; senderId: string; sessionId: string }) {
    return prisma.message.create({
      data,
      include: {
        sender: true,
      }
    });
  }

  async findBySession(sessionId: string) {
    return prisma.message.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: true,
      }
    });
  }
}

export const messageRepository = new MessageRepository();
