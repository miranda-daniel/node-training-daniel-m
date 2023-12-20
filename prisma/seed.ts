import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

faker.seed(1);
const SALT_ROUNDS = 10;

const DEFAULT_PASSWORD = 'Password1';
const DEFAULT_USERS_AMOUNT = 5;

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);

  return bcrypt.hash(password, salt);
}

const seed = async () => {
  try {
    const hashedPassword = await hashPassword(DEFAULT_PASSWORD);

    await prisma.$transaction(async (prisma) => {
      for (let i = 0; i < DEFAULT_USERS_AMOUNT; i++) {
        const email = faker.internet.email();

        await prisma.user.upsert({
          where: { email },
          update: {},
          create: {
            email,
            password: hashedPassword,
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
          },
        });
      }
    });

    console.log('users created!');
  } catch (error) {
    console.error('Error creating users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
