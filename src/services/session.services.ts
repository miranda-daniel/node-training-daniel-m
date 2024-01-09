import { db } from '../../prisma/db';
import { ApiError } from '../config/apiError';
import { ENV_VARIABLES } from '../config/config';
import { errors } from '../config/errors';
import { comparePasswords } from '../helpers/utils';
import { Session } from '../types/session';
import { LoginUserRequest } from '../types/session';
import JWT from 'jsonwebtoken';

export class SessionService {
  static loginUser = async (credentials: LoginUserRequest): Promise<Session> => {
    const jsonSignature = ENV_VARIABLES.jsonSignature;

    const { email, password } = credentials;

    try {
      const user = await db.user.findUnique({
        where: {
          email,
        },
      });

      const isMatch = await comparePasswords(password, user!.password);

      if (!isMatch) {
        throw new ApiError(errors.INVALID_CREDENTIALS);
      }

      const tokenCreated = JWT.sign({ userId: user!.id }, jsonSignature!, { expiresIn: 3600000 });

      return {
        errors: [],
        token: tokenCreated,
      };
    } catch (err) {
      throw new ApiError(errors.INVALID_USER);
    }
  };
}
