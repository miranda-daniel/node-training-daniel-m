import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

module.exports = async () => {
  if (process.env.TEST_ENV !== 'integration') {
    return;
  }

  // Define the tables in sequential order to be deleted after ALL tests.
  const tables = ['Product', 'User'];

  for (const table of tables) {
    await db.$executeRawUnsafe(`DELETE FROM "${table}";`);
  }

  await db.$disconnect();
};
