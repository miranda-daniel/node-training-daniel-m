import { faker } from '@faker-js/faker';
import { RegisterUserRequest, User, UserRaw } from '../types/user';
import { UserSerializer } from '../serializers/user-seralizer';
import { CreateProductRequest, ProductIndex, ProductIndexRaw, ProductRaw, UpdateProductRequest } from '../types/product';
import { ProductSerializer } from '../serializers/product-serializer';

export const userRandomRaw: UserRaw = {
  id: faker.number.int(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
};

// ---------------------------------

export const registerUserRandom: RegisterUserRequest = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
};

export const userRandom: User = UserSerializer.serializeUser(userRandomRaw);

export const productRandomRaw: ProductRaw = {
  id: faker.number.int(),
  title: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  userId: faker.number.int(),
};

export const productRandom = ProductSerializer.serialize(productRandomRaw);

export const productIndexRandomRaw: ProductIndexRaw = {
  id: faker.number.int(),
  title: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  userId: faker.number.int(),
  user: {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  },
};

export const productIndexRandom: ProductIndex = {
  id: faker.number.int(),
  title: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  userId: faker.number.int(),
  user: {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  },
};

export const productRequestRandom: CreateProductRequest | UpdateProductRequest = {
  title: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
};
