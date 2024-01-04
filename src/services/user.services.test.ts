import { db } from '../../prisma/db';
import { ApiError } from '../config/apiError';
import { UserService } from './user.services';
import { createUser } from '../test/utils';
import { UserSerializer } from '../serializers/user-seralizer';
import { UserIndex } from '../types/user';
import { errors } from '../config/errors';
import { userRandomRaw } from '../test/test-constants';

describe('UserService - Get Users', () => {
  beforeEach(async () => await createUser({ email: 'test1@gmail.com' }));

  afterEach(async () => {
    await db.user.delete({ where: { email: 'test1@gmail.com' } });
  });

  it('should return an array', async () => {
    const usersListRaw = await UserService.getUsersService();

    expect(usersListRaw).toBeInstanceOf(Array);
  });

  it('should serialize user response', async () => {
    jest.spyOn(db.user, 'findMany').mockResolvedValue([userRandomRaw]);

    const usersSerialized: UserIndex[] = [
      {
        firstName: userRandomRaw.firstName,
        lastName: userRandomRaw.lastName,
      },
    ];

    expect(usersSerialized).toEqual(UserSerializer.serializeUserListIndex([userRandomRaw]));
  });

  it('should throw an ApiError on database error', async () => {
    jest.spyOn(db.user, 'findMany').mockRejectedValue(new Error('Database error'));

    await expect(UserService.getUsersService()).rejects.toThrow(new ApiError(errors.INTERNAL_SERVER_ERROR));
  });

  it('should handle errors correctly and throw an ApiError with INTERNAL_SERVER_ERROR code', async () => {
    jest.spyOn(UserService, 'getUsersService').mockRejectedValue(new ApiError(errors.INTERNAL_SERVER_ERROR));

    try {
      await UserService.getUsersService();
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);

      if (error instanceof ApiError) {
        expect(error.errorCode).toBe(errors.INTERNAL_SERVER_ERROR.errorCode);
      } else {
        fail('Must be an ApiError');
      }
    }
  });
});
