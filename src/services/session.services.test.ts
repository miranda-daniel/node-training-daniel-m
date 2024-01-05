import { db } from '../../prisma/db';
import { userRandomRaw } from '../test/test-constants';
import * as utils from '../helpers/utils';
import { SessionService } from './session.services';
import { errors } from '../config/errors';
import { ApiError } from '../config/apiError';

describe('loginUser', () => {
  const mockCredentials = {
    email: 'test1@gmail.com',
    password: 'password123',
  };

  it('should return a valid token when the credentials are correct', async () => {
    jest.spyOn(db.user, 'findUnique').mockResolvedValue(userRandomRaw);
    jest.spyOn(utils, 'comparePasswords').mockResolvedValue(true);

    const result = await SessionService.loginUser(mockCredentials);

    expect(utils.comparePasswords).toHaveBeenCalledWith(mockCredentials.password, userRandomRaw.password);
    expect(db.user.findUnique).toHaveBeenCalledWith({ where: { email: mockCredentials.email } });

    expect(result.token).toBeDefined();
  });

  it('should throw an ApiError (INVALID_USER) when user is not found', async () => {
    jest.spyOn(db.user, 'findUnique').mockResolvedValue(null);

    await expect(SessionService.loginUser(mockCredentials)).rejects.toThrow(new ApiError(errors.INVALID_USER));
  });

  it('should throw an ApiError (INVALID CREDENTIALS) when comparePasswords fails', async () => {
    jest.spyOn(db.user, 'findUnique').mockResolvedValue(userRandomRaw);
    jest.spyOn(utils, 'comparePasswords').mockResolvedValue(false);

    await expect(SessionService.loginUser(mockCredentials)).rejects.toThrow(new ApiError(errors.INVALID_CREDENTIALS));
  });
});
