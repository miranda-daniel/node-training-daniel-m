import { User, UserIndex, UserRaw } from '../types/user';
import { UsersView } from './enums';

class UserSerializer {
  static deSerialize = (object: object, view?: string): UserIndex | User => {
    switch (view) {
      case UsersView.UsersIndex:
        return this.deSerializeUserIndex(object as UserRaw);
      default:
        return this.deSerializeUser(object as UserRaw);
    }
  };

  private static deSerializeUserIndex = (userRaw: UserRaw): UserIndex => ({
    firstName: userRaw.firstName,
    lastName: userRaw.lastName,
  });

  private static deSerializeUser = (userRaw: UserRaw): User => ({
    id: userRaw.id,
    email: userRaw.email,
    firstName: userRaw.firstName,
    lastName: userRaw.lastName,
  });
}

export { UserSerializer };
