import { db } from '@root/prisma/db';
import { userRandomRaw } from '@test/helpers/data-generators';
import * as utils from '@helpers/utils';
import { SessionService } from '@services/session-services';
import { errors } from '@config/errors';
import { ApiError } from '@config/api-error';
import { createUser } from '@test/helpers/utils';

const mockCredentials = {
  email: 'test1@gmail.com',
  password: 'password123',
};

describe('Session Service - Login User', () => {
  it('should sign in user created', async () => {
    await createUser({ email: mockCredentials.email });

    jest.spyOn(utils, 'comparePasswords').mockResolvedValue(true);

    const result = await SessionService.loginUser(mockCredentials);

    expect(result.token).toBeDefined();

    await db.user.delete({ where: { email: mockCredentials.email } });
  });

  it('should return a valid token when the credentials are correct', async () => {
    jest.spyOn(db.user, 'findUnique').mockResolvedValue(userRandomRaw);
    jest.spyOn(utils, 'comparePasswords').mockResolvedValue(true);

    await SessionService.loginUser(mockCredentials);

    expect(utils.comparePasswords).toHaveBeenCalledWith(
      mockCredentials.password,
      userRandomRaw.password
    );
    expect(db.user.findUnique).toHaveBeenCalledWith({
      where: { email: mockCredentials.email },
    });
  });

  it('should throw an ApiError (INVALID_USER) when user is not found', async () => {
    jest.spyOn(db.user, 'findUnique').mockResolvedValue(null);

    await expect(SessionService.loginUser(mockCredentials)).rejects.toThrow(
      new ApiError(errors.INVALID_USER)
    );
  });

  it('should throw an ApiError (INVALID CREDENTIALS) when comparePasswords fails', async () => {
    jest.spyOn(db.user, 'findUnique').mockResolvedValue(userRandomRaw);
    jest.spyOn(utils, 'comparePasswords').mockResolvedValue(false);

    await expect(SessionService.loginUser(mockCredentials)).rejects.toThrow(
      new ApiError(errors.INVALID_CREDENTIALS)
    );
  });
});
