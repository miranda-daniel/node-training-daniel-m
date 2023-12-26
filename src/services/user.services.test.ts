import { UserService } from './user.services';
import { db } from '../../prisma/db';

jest.mock('../../prisma/db', () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
    },
  },
}))

describe('UserService', () => {
  it('should return an empty array when there are no users', async () => {
    (db.user.findMany as jest.Mock).mockResolvedValueOnce([]);

    const result = await UserService.getUsersService();
    expect(result).toEqual([]);
  });

  it('should map users correctly', async () => {
    const mockUsersDb = [
      { id: 1, firstName: 'Karen', password: 'xxx', lastName: 'Doe', email: 'karen.doe@example.com' },
      { id: 2, firstName: 'David', password: 'xxx', lastName: 'Doe', email: 'david.doe@example.com' },
    ];

    (db.user.findMany as jest.Mock).mockResolvedValueOnce(mockUsersDb);
  
    const result = await UserService.getUsersService();
  
    const expectedMappedUsers = mockUsersDb.map(({ id, firstName, lastName, email }) => ({ id, firstName, lastName, email }));
    expect(result).toEqual(expectedMappedUsers);
  });
});
