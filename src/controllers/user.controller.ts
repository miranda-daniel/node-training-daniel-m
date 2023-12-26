import { Body, Controller, Get, Post, Route, Security } from 'tsoa';
import { LoginUserRequestType, RegisterUserRequestType, UserType } from '../types/user';
import { SessionType } from '../types/session';
import { UserService } from '../services/user.services';
import { loginValidations } from '../helpers/validations/login.validations';
import { registerValidations } from '../helpers/validations/register.validations';

@Route('users')
export class UserController extends Controller {
  /**
   *  Register User.
   * @summary Register new user in database.
   * @returns {User[]} 200 - Token
   */
  @Post('/register')
  public async register(@Body() requestBody: RegisterUserRequestType): Promise<SessionType> {
    const errorsList = registerValidations(requestBody);

    if (errorsList.length) {
      return {
        errors: errorsList, 
        token: null
      }
    }

    const session = await UserService.registerUserService(requestBody);
    return session;
  }

  /**
   *  Login User.
   * @summary Login user in app.
   * @returns {User[]} 200 - Token
   */
  @Post('/login')
  public async login(@Body() body: LoginUserRequestType): Promise<SessionType> {
    const errorsList = loginValidations(body);

    if (errorsList.length) {
      return {
        errors: errorsList, 
        token: null
      }
    }

    const session = await UserService.loginUser(body);
    return session;
  }

  /**
   *  Get all users.
   * @summary Get a list of all users.
   * @returns {User[]} 200 - List of users
   */
  @Get('/')
  @Security('jwt')
  public async getAllUsers(): Promise<UserType[]> {
    const usersResponse = await UserService.getUsersService();
    return usersResponse;
  }
}
