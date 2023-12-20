import { PrismaClient } from '@prisma/client';
import { UserType } from '../types/user';

const prisma = new PrismaClient();

export const getUsers = async () => {
  const users = await prisma.user.findMany();

  const usersMapped: UserType[] = users.map((user) => {
    const { id, firstName, lastName, email } = user;

    return { id, firstName, lastName, email };
  });

  return usersMapped;
};
