import { db } from '../../prisma/db';
import { UserType } from '../types/user';

export const getUsersService = async () => {
  const users = await db.user.findMany();

  const usersMapped: UserType[] = users.map((user) => {
    const { id, firstName, lastName, email } = user;

    return { id, firstName, lastName, email };
  });

  return usersMapped;
};
