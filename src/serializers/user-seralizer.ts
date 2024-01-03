import { User, UserIndex, UserRaw } from '../types/user';

enum UsersView {
  UsersIndex = 'usersIndex',
}

class UserSerializer {
  static serializeUserListIndex = (userListRaw: UserRaw[]) =>
    userListRaw.map((user: UserRaw) => UserSerializer.serialize(user, UsersView.UsersIndex));

  static serialize = (userObject: UserRaw, view?: string): UserIndex | User => {
    switch (view) {
      case UsersView.UsersIndex:
        return this.serializeUserIndex(userObject);
      default:
        return this.serializeUser(userObject);
    }
  };

  private static serializeUserIndex = (userRaw: UserRaw): UserIndex => ({
    firstName: userRaw.firstName,
    lastName: userRaw.lastName,
  });

  private static serializeUser = (userRaw: UserRaw): User => ({
    id: userRaw.id,
    email: userRaw.email,
    firstName: userRaw.firstName,
    lastName: userRaw.lastName,
  });
}

export { UserSerializer };
