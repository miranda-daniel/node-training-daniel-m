import { PrismaClient } from '@prisma/client';
import { UserType } from '../types/user';

const prisma = new PrismaClient();

export const getUsers = async () => {
  const users = await prisma.user.findMany();

  const usersMapped: UserType[] = users.map((user) => {
    const { id, firstname, lastname, email } = user;

    return { id, firstname, lastname, email };
  });

  return usersMapped;
};
