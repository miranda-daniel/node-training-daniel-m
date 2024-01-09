import { faker } from '@faker-js/faker';
import { hashPassword } from '../src/helpers/utils';
import { db } from './db';

faker.seed(1);
const DEFAULT_PASSWORD = 'Password1';
const DEFAULT_USERS_AMOUNT = 5;
const PRODUCTS_PER_USER = 3;

const seed = async () => {
  try {
    const hashedPassword = await hashPassword(DEFAULT_PASSWORD);

    await db.$transaction(async (prisma) => {
      for (let i = 0; i < DEFAULT_USERS_AMOUNT; i++) {
        const email = faker.internet.email();

        const user = await prisma.user.upsert({
          where: { email },
          update: {},
          create: {
            email,
            password: hashedPassword,
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
          },
        });

        for (let j = 0; j < PRODUCTS_PER_USER; j++) {
          await prisma.product.create({
            data: {
              title: faker.commerce.productName(),
              description: faker.commerce.productDescription(),
              userId: user.id,
            },
          });
        }
      }
    });

    console.info('users created!');
  } catch (error) {
    console.error('Error creating users:', error);
  } finally {
    await db.$disconnect();
  }
}

seed();
