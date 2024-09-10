import { db } from '@root/prisma/db';
import { productRequestRandom, userRandom } from './data-generators';
import { PartialProduct } from '@typing/product';
import { PartialUser } from '@typing/user';

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
