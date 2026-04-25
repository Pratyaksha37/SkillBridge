import { prisma } from '../config/db';

export class SessionRepository {
  async create(data: any) {
    return prisma.session.create({
      data,
      include: {
        teacher: true,
        learner: true,
        skill: true,
      }
    });
  }

  async findByUser(userId: string) {
    return prisma.session.findMany({
      where: {
        OR: [
          { teacherId: userId },
          { learnerId: userId }
        ]
      },
      include: {
        teacher: true,
        learner: true,
        skill: true,
      }
    });
  }

  async findById(id: string) {
    return prisma.session.findUnique({
      where: { id },
      include: {
        teacher: true,
        learner: true,
        skill: true,
      }
    });
  }
}

export const sessionRepository = new SessionRepository();
