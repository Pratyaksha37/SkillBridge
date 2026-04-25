import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Clear existing data
  await prisma.userSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding data...');

  const users = [
    {
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      password: hashedPassword,
      bio: 'UX Designer with 5 years experience. Looking to learn React.',
    },
    {
      name: 'Michael Ross',
      email: 'michael@example.com',
      password: hashedPassword,
      bio: 'Senior Backend Engineer. Passionate about system design and Python.',
    },
    {
      name: 'Elena Rodriguez',
      email: 'elena@example.com',
      password: hashedPassword,
      bio: 'Product Manager. Expert in Agile and Scrum. Want to learn Figma.',
    },
    {
      name: 'David Kim',
      email: 'david@example.com',
      password: hashedPassword,
      bio: 'Full Stack Dev. Love TypeScript and AWS. Interested in Marketing.',
    }
  ];

  const createdUsers = await Promise.all(
    users.map(u => prisma.user.create({ data: u }))
  );

  const skills = [
    { name: 'UI/UX Design', category: 'Design' },
    { name: 'React', category: 'Development' },
    { name: 'Node.js', category: 'Development' },
    { name: 'Python', category: 'Development' },
    { name: 'Project Management', category: 'Business' },
    { name: 'Digital Marketing', category: 'Business' },
    { name: 'AWS', category: 'DevOps' },
    { name: 'Figma', category: 'Design' }
  ];

  const createdSkills = await Promise.all(
    skills.map(s => prisma.skill.create({ data: s }))
  );

  // Link skills to users
  await prisma.userSkill.createMany({
    data: [
      { userId: createdUsers[0]!.id, skillId: createdSkills[0]!.id, type: 'OFFER' },
      { userId: createdUsers[0]!.id, skillId: createdSkills[1]!.id, type: 'SEEK' },
      { userId: createdUsers[1]!.id, skillId: createdSkills[3]!.id, type: 'OFFER' },
      { userId: createdUsers[1]!.id, skillId: createdSkills[2]!.id, type: 'OFFER' },
      { userId: createdUsers[2]!.id, skillId: createdSkills[4]!.id, type: 'OFFER' },
      { userId: createdUsers[2]!.id, skillId: createdSkills[7]!.id, type: 'SEEK' },
      { userId: createdUsers[3]!.id, skillId: createdSkills[6]!.id, type: 'OFFER' },
      { userId: createdUsers[3]!.id, skillId: createdSkills[5]!.id, type: 'SEEK' },
    ]
  });

  console.log('Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
