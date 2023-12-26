import { UserController } from './user.controller'; 
import { UserService } from '../services/user.services'; 
import { UserType } from '../types/user';

jest.mock('../services/user.services', () => ({
  getUsersService: jest.fn(),
}));

const controller = new UserController();

describe('User Controller', () => {
  it('should call getUsers service once', async () => {
    await controller.getAllUsers();

    expect(UserService.getUsersService).toHaveBeenCalledTimes(1);
  });

  it('should return an array of users', async () => {
    const mockUsers: UserType[] = [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
    ];

    (UserService.getUsersService as jest.Mock).mockResolvedValueOnce(mockUsers);

    const result = await controller.getAllUsers();

    expect(result).toBeInstanceOf(Array);
    expect(result).toEqual(mockUsers);
  });
});
