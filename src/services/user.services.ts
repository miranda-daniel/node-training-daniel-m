import { db } from '../../prisma/db';
import { ApiError } from '../config/apiError';
import { errors } from '../config/errors';
import { hashPassword } from '../helpers/utils';
import { UsersView } from '../serializers/enums';
import { UserSerializer } from '../serializers/user.seralizer';
import { RegisterUserRequest, User, UserRaw } from '../types/user';

export class UserService {
  static getUsersService = async () => {
    try {
      const usersListRaw = await db.user.findMany();

      return  usersListRaw.map((user: UserRaw) => UserSerializer.deSerialize(user, UsersView.UsersIndex));
    } catch (err) {
      throw new ApiError(errors.INTERNAL_SERVER_ERROR);
    }
  };

  static registerUserService = async (input: RegisterUserRequest) => {
    const { firstName, lastName, email, password } = input;

    const hashedPassword = await hashPassword(password);

    let userCreated: UserRaw;

    try {
      userCreated = await db.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
        },
      });

      return UserSerializer.deSerialize(userCreated) as User;
    } catch (err) {
      throw new ApiError(errors.USER_ALREADY_EXISTS);
    }
  };
}
