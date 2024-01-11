// TODO: rename to test-utils.ts
import { db } from '../../prisma/db';
import { PartialProduct } from '../types/product';
import { PartialUser } from '../types/user';
import { productRequestRandom, userRandom } from './test-constants';

export const createUser = async (user: PartialUser = {}) => {
  const newUser = await db.user.create({
    data: {
      firstName: user.firstName || userRandom.firstName,
      lastName: user.lastName || userRandom.lastName,
      email: user.email || userRandom.email,
      password: user.password || 'Password1',
    },
  });

  return newUser;
};

export const createProduct = async (product: PartialProduct = {}) => {
  const newProduct = await db.product.create({
    data: {
      title: product.title || productRequestRandom.title,
      description: product.description || productRequestRandom.description,
      userId: product.userId || 1,
    },
  });

  return newProduct;
};
