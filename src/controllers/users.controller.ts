import { Controller, Get, Route } from 'tsoa';
import { getUsers } from '../services/user.services';
import { UserType } from '../types/user';

@Route('users')
export class UsersController extends Controller {
  /**
   * Get all users.
   * @summary Get a list of all users.
   * @returns {User[]} 200 - List of users
   */
  @Get('/')
  public async getAllUsers(): Promise<UserType[]> {
    const usersResponse = await getUsers();
    return usersResponse;
  }
}
