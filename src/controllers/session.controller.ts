import { Body, Controller, Post, Route } from 'tsoa';
import { LoginUserRequest } from '../types/session';
import { Session } from '../types/session';
import { loginValidations } from '../helpers/validations/login.validations';
import { SessionService } from '../services/session.services';

@Route('session')
export class SessionController extends Controller {
  /**
   *  Login User.
   * @summary Login user in app.
   * @returns {Session} 200 - Token
   */
  @Post('/login')
  public async login(@Body() body: LoginUserRequest): Promise<Session> {
    const errorsList = loginValidations(body);

    if (errorsList.length) {
      return {
        errors: errorsList,
        token: null,
      };
    }

    return await SessionService.loginUser(body);
  }
}
