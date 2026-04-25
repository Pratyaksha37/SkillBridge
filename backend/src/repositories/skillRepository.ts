import { prisma } from '../config/db';

export class SkillRepository {
  async findAll() {
    return prisma.skill.findMany();
  }

  async findByName(name: string) {
    return prisma.skill.findUnique({
      where: { name },
    });
  }

  async create(data: { name: string; category: string }) {
    return prisma.skill.create({
      data,
    });
  }

  async addUserSkill(userId: string, skillId: string, type: 'OFFER' | 'SEEK') {
    return prisma.userSkill.upsert({
      where: {
        userId_skillId_type: {
          userId,
          skillId,
          type,
        },
      },
      update: {}, // No changes if exists
      create: {
        userId,
        skillId,
        type,
      },
    });
  }

  async removeUserSkill(userId: string, skillId: string, type: 'OFFER' | 'SEEK') {
    return prisma.userSkill.delete({
      where: {
        userId_skillId_type: {
          userId,
          skillId,
          type,
        },
      },
    });
  }
}

export const skillRepository = new SkillRepository();
