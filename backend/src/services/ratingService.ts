import { ratingRepository } from '../repositories/ratingRepository';

export class RatingService {
  async createRating(data: { score: number; feedback?: string; raterId: string; ratedUserId: string }) {
    return ratingRepository.create(data);
  }

  async getRatingsForUser(userId: string) {
    return ratingRepository.findByRatedUser(userId);
  }
}

export const ratingService = new RatingService();
