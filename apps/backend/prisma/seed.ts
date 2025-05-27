import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Kanban database...');

  await prisma.card.deleteMany();
  await prisma.board.deleteMany();

  const projectBoard = await prisma.board.create({
    data: {
      name: 'My Project Board',
    },
  });

  const personalBoard = await prisma.board.create({
    data: {
      name: 'Personal Tasks',
    },
  });

  await prisma.card.createMany({
    data: [
      {
        title: 'Set up project structure',
        description: 'Initialize the project with proper folder structure and dependencies',
        status: 'Done',
        order: 0,
        boardId: projectBoard.id,
      },
      {
        title: 'Design database schema',
        description: 'Create Prisma schema for boards and cards',
        status: 'Done',
        order: 1,
        boardId: projectBoard.id,
      },
      {
        title: 'Implement API endpoints',
        description: 'Create REST API for CRUD operations on boards and cards',
        status: 'In Progress',
        order: 2,
        boardId: projectBoard.id,
      },
      {
        title: 'Build frontend components',
        description: 'Create React components for kanban board interface',
        status: 'ToDo',
        order: 3,
        boardId: projectBoard.id,
      },
      {
        title: 'Add drag and drop functionality',
        description: 'Implement drag and drop for moving cards between columns',
        status: 'ToDo',
        order: 4,
        boardId: projectBoard.id,
      },
      {
        title: 'Deploy to production',
        description: 'Deploy both frontend and backend to cloud platforms',
        status: 'ToDo',
        order: 5,
        boardId: projectBoard.id,
      },
    ],
  });

  // Create sample cards for personal board
  await prisma.card.createMany({
    data: [
      {
        title: 'Buy groceries',
        description: 'Milk, bread, eggs, vegetables',
        status: 'ToDo',
        order: 0,
        boardId: personalBoard.id,
      },
      {
        title: 'Read a book',
        description: 'Finish reading "Clean Code" by Robert Martin',
        status: 'In Progress',
        order: 1,
        boardId: personalBoard.id,
      },
      {
        title: 'Exercise',
        description: '30 minutes cardio workout',
        status: 'Done',
        order: 2,
        boardId: personalBoard.id,
      },
    ],
  });

  console.log('✅ Kanban database seeded successfully!');
  console.log(`📋 Created ${await prisma.board.count()} boards`);
  console.log(`🎴 Created ${await prisma.card.count()} cards`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });