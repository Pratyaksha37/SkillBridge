import { skillRepository } from '../repositories/skillRepository';
import { AppError } from '../utils/AppError';

export class SkillService {
  async getAllSkills() {
    return skillRepository.findAll();
  }

  async createSkill(data: { name: string; category: string; userId?: string; type?: 'OFFER' | 'SEEK' }) {
    let skill = await skillRepository.findByName(data.name);
    
    if (!skill) {
      skill = await skillRepository.create({
        name: data.name,
        category: data.category
      });
    }

    if (data.userId && data.type) {
      await skillRepository.addUserSkill(data.userId, skill.id, data.type);
    }

    return skill;
  }

  async removeSkillFromUser(userId: string, skillId: string, type: 'OFFER' | 'SEEK') {
    return skillRepository.removeUserSkill(userId, skillId, type);
  }
}

export const skillService = new SkillService();
