import { prisma } from '../config/db';

export class RatingRepository {
  async create(data: { score: number; feedback?: string; raterId: string; ratedUserId: string }) {
    return prisma.rating.create({
      data,
      include: {
        rater: true,
        ratedUser: true,
      }
    });
  }

  async findByRatedUser(ratedUserId: string) {
    return prisma.rating.findMany({
      where: { ratedUserId },
      include: {
        rater: true,
      }
    });
  }
}

export const ratingRepository = new RatingRepository();
