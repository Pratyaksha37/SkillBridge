import { userRepository } from '../repositories/userRepository';
import { prisma } from '../config/db';

export class UserService {
  async getDashboard(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) return null;

    // Categorize skills
    const teaching = user.skills.filter(s => s.type === 'OFFER');
    const learning = user.skills.filter(s => s.type === 'SEEK');
    // Get stats
    const teachingCount = teaching.length;
    const learningCount = learning.length;
    const sessionsCount = await prisma.session.count({
      where: {
        OR: [{ teacherId: userId }, { learnerId: userId }]
      }
    });

    // Calculate average rating
    const ratings = user.ratingsReceived || [];
    const avgRating = ratings.length > 0 
      ? Number((ratings.reduce((acc, curr) => acc + curr.score, 0) / ratings.length).toFixed(1))
      : 0;

    // Find Matching Peers
    // 1. People who offer what I seek
    // 2. People who seek what I offer
    const mySeekSkillIds = learning.map(s => s.skillId);
    const myOfferSkillIds = teaching.map(s => s.skillId);

    const potentialMatches = await prisma.user.findMany({
      where: {
        id: { not: userId },
        skills: {
          some: {
            OR: [
              { type: 'OFFER', skillId: { in: mySeekSkillIds } },
              { type: 'SEEK', skillId: { in: myOfferSkillIds } }
            ]
          }
        }
      },
      include: {
        skills: {
          include: { skill: true }
        }
      },
      take: 5
    });

    const myConnections = await prisma.connection.findMany({
      where: { requesterId: userId }
    });
    const connectedIds = new Set(myConnections.map(c => c.receiverId));

    const matches = potentialMatches.map(m => {
      const offers = m.skills.filter(s => s.type === 'OFFER').map(s => s.skill.name);
      const seeks = m.skills.filter(s => s.type === 'SEEK').map(s => s.skill.name);
      
      // Calculate overlap count
      const offerMatch = m.skills.filter(s => s.type === 'OFFER' && mySeekSkillIds.includes(s.skillId)).length;
      const seekMatch = m.skills.filter(s => s.type === 'SEEK' && myOfferSkillIds.includes(s.skillId)).length;
      const matchRate = Math.min(100, Math.round(((offerMatch + seekMatch) / (mySeekSkillIds.length + myOfferSkillIds.length || 1)) * 100));

      return {
        id: m.id,
        name: m.name,
        email: m.email,
        bio: m.bio,
        matchRate: matchRate > 0 ? `${matchRate}% Match` : 'New Peer',
        offers,
        wants: seeks,
        isConnected: connectedIds.has(m.id)
      };
    });
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        about: user.about,
        location: user.location,
        availability: user.availability,
        languages: user.languages,
        rating: avgRating
      },
      skills: {
        teaching,
        learning
      },
      stats: {
        hoursTaught: sessionsCount * 1, // Mock hours
        hoursLearned: sessionsCount * 1,
        rating: avgRating,
        teachingCount,
        learningCount,
        sessionsCount
      },
      matches,
      connections: user.connectionsMade.map((c: any) => ({
        id: c.receiver.id,
        name: c.receiver.name,
        email: c.receiver.email,
        bio: c.receiver.bio,
        skills: c.receiver.skills.filter((s: any) => s.type === 'OFFER').map((s: any) => s.skill.name)
      }))
    };
  }

  async getMentors(query: any, currentUserId?: string) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 8;
    const skip = (page - 1) * limit;

    const { search, category } = query;
    const where: any = {
      skills: {
        some: {
          type: 'OFFER'
        }
      }
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
        { skills: { some: { skill: { name: { contains: search, mode: 'insensitive' } } } } }
      ];
    }

    if (category && category !== 'Skill Category' && category !== 'All Categories') {
      where.skills.some.skill = { 
        ...where.skills.some.skill,
        category: { equals: category, mode: 'insensitive' } 
      };
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        createdAt: true,
        skills: {
          where: { type: 'OFFER' },
          include: { skill: true }
        }
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get current user's connections to mark "Connected" status
    const connectedIds = new Set<string>();
    if (currentUserId) {
      const myConnections = await prisma.connection.findMany({
        where: { requesterId: currentUserId }
      });
      myConnections.forEach(c => connectedIds.add(c.receiverId));
    }

    const mentors = users.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.bio || 'Mentor',
      rating: 4.5, // Mock for now
      bio: u.bio || 'No bio provided.',
      tags: u.skills.map((s: any) => s.skill.name),
      isNew: new Date().getTime() - new Date(u.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000,
      imageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.email}`,
      isConnected: connectedIds.has(u.id)
    }));

    return mentors;
  }

  async updateProfile(userId: string, data: any) {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.about !== undefined) updateData.about = data.about;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.availability !== undefined) updateData.availability = data.availability;
    if (data.languages !== undefined) updateData.languages = data.languages;

    await userRepository.update(userId, updateData);
    return userRepository.findById(userId);
  }
}

export const userService = new UserService();
