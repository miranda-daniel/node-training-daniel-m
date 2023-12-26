import { db } from '../../prisma/db';
import { comparePasswords, hashPassword } from '../helpers/utils';
import { SessionType } from '../types/session';
import { LoginUserRequestType, RegisterUserRequestType, UserType } from '../types/user';
import JWT from 'jsonwebtoken';

export const getUsersService = async () => {
  const users = await db.user.findMany();

  const usersMapped: UserType[] = users.map((user) => {
    const { id, firstName, lastName, email } = user;

    return { id, firstName, lastName, email };
  });

  return usersMapped;
};

export const registerUserService = async (input: RegisterUserRequestType): Promise<SessionType> => {
  const jsonSignature = process.env.JSON_SIGNATURE;

  const { firstName, lastName, email, password } = input;

  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return {
      errors: [{ message: 'User already created' }],
      token: null,
    };
  }

  const hashedPassword = await hashPassword(password);

  const user = await db.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
    },
  });

  const tokenCreated = JWT.sign({ userId: user.id }, jsonSignature!, { expiresIn: 3600000 });

  return {
    errors: [],
    token: tokenCreated,
  };
};

export const loginUser = async (credentials: LoginUserRequestType): Promise<SessionType> => {
  const jsonSignature = process.env.JSON_SIGNATURE;

  const { email, password } = credentials;

  const user = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return {
      errors: [{ message: 'Invalid credentials' }],
      token: null,
    };
  }

  const isMatch = await comparePasswords(password, user.password);

  if (!isMatch) {
    return {
      errors: [{ message: 'Invalid credentials' }],
      token: null,
    };
  }

  const tokenCreated = JWT.sign({ userId: user.id }, jsonSignature!, { expiresIn: 3600000 });

  return {
    errors: [],
    token: tokenCreated,
  };
};
