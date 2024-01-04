import { db } from '../../prisma/db';
import { PartialUser } from '../types/user';
import { userRandom } from './test-constants';

export const createUser = async (user: PartialUser = {}) => {
  const newUser = await db.user.create({
    data: {
      firstName: user.firstName || userRandom.firstName,
      lastName: user.lastName || userRandom.lastName,
      email: user.email || userRandom.email,
      password: user.password || 'Password1'
    },
  });

  return newUser;
};
