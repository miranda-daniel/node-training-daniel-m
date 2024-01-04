import { faker } from '@faker-js/faker';
import { User, UserRaw } from '../types/user';
import { UserSerializer } from '../serializers/user-seralizer';

export const userRandomRaw: UserRaw = {
  id: faker.number.int(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
};

export const userRandom: User = UserSerializer.serializeUser(userRandomRaw);
