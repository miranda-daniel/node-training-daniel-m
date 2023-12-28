import { User, UserRaw } from '../types/user';

class UserSerializer {
  static deSerializeUser = (userRaw: UserRaw): User => ({
    id: userRaw.id,
    email: userRaw.email,
    firstName: userRaw.firstName,
    lastName: userRaw.lastName,
  });
}

export { UserSerializer };
