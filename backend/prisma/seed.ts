import 'dotenv/config';
import { PrismaClient, Role, SkillType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcrypt';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Clean up existing data (Optional, be careful)
  // await prisma.userSkill.deleteMany();
  // await prisma.skill.deleteMany();
  // await prisma.user.deleteMany();

  // 2. Create Skills
  const skillsData = [
    { name: 'UI/UX Design', category: 'Design' },
    { name: 'Figma', category: 'Design' },
    { name: 'React Development', category: 'Coding' },
    { name: 'Node.js', category: 'Coding' },
    { name: 'Full-stack Dev', category: 'Coding' },
    { name: 'Growth Marketing', category: 'Marketing' },
    { name: 'SEO', category: 'Marketing' },
    { name: 'Data Science', category: 'Data' },
    { name: 'Python', category: 'Data' },
    { name: 'Photography', category: 'Art' },
    { name: 'Lightroom', category: 'Art' },
    { name: 'Content Strategy', category: 'Writing' },
    { name: 'Angel Investing', category: 'Finance' },
    { name: 'Abstract Oil Painting', category: 'Art' },
  ];

  for (const s of skillsData) {
    await prisma.skill.upsert({
      where: { name: s.name },
      update: {},
      create: s,
    });
  }

  const allSkills = await prisma.skill.findMany();
  const getSkillId = (name: string) => allSkills.find(s => s.name === name)?.id;

  // 3. Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = [
    {
      email: 'sarah@example.com',
      name: 'Sarah Chen',
      password: hashedPassword,
      bio: 'Specializing in UX research and interactive prototypes.',
      title: 'Senior Product Designer',
      role: Role.TEACHER,
      imageUrl: 'https://picsum.photos/seed/sarah/200/200',
      skills: [
        { name: 'UI/UX Design', type: SkillType.OFFER, level: 'Expert' },
        { name: 'Figma', type: SkillType.OFFER, level: 'Expert' }
      ]
    },
    {
      email: 'marcus@example.com',
      name: 'Marcus Thorne',
      password: hashedPassword,
      bio: 'Passion for teaching React and Node.js best practices.',
      title: 'Full-stack Architect',
      role: Role.TEACHER,
      imageUrl: 'https://picsum.photos/seed/marcus2/200/200',
      skills: [
        { name: 'Full-stack Dev', type: SkillType.OFFER, level: 'Expert' },
        { name: 'React Development', type: SkillType.OFFER, level: 'Expert' },
        { name: 'Node.js', type: SkillType.OFFER, level: 'Advanced' }
      ]
    },
    {
      email: 'elena@example.com',
      name: 'Elena Rodriguez',
      password: hashedPassword,
      bio: 'Helping startups grow through SEO and content.',
      title: 'Digital Marketing Strategist',
      role: Role.TEACHER,
      imageUrl: 'https://picsum.photos/seed/elena2/200/200',
      skills: [
        { name: 'Growth Marketing', type: SkillType.OFFER, level: 'Expert' },
        { name: 'SEO', type: SkillType.OFFER, level: 'Advanced' },
        { name: 'UI/UX Design', type: SkillType.SEEK, level: 'Beginner' }
      ]
    },
    {
      email: 'david@example.com',
      name: 'David Kim',
      password: hashedPassword,
      bio: 'Expertise in machine learning and visualization using Python.',
      title: 'Data Scientist',
      role: Role.TEACHER,
      imageUrl: 'https://picsum.photos/seed/david/200/200',
      skills: [
        { name: 'Data Science', type: SkillType.OFFER, level: 'Expert' },
        { name: 'Python', type: SkillType.OFFER, level: 'Expert' }
      ]
    }
  ];

  for (const u of users) {
    const { skills, ...userData } = u;
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: userData,
      create: userData,
    });

    for (const s of skills) {
      const skillId = getSkillId(s.name);
      if (skillId) {
        await prisma.userSkill.upsert({
          where: {
            userId_skillId_type: {
              userId: user.id,
              skillId: skillId,
              type: s.type
            }
          },
          update: { level: s.level },
          create: {
            userId: user.id,
            skillId: skillId,
            type: s.type,
            level: s.level
          }
        });
      }
    }
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
