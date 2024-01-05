import { Body, Controller, Post, Route } from 'tsoa';
import { LoginUserRequest } from '../types/session';
import { loginValidations } from '../helpers/validations/login.validations';
import { SessionService } from '../services/session.services';
import { ApiError } from '../config/apiError';
import { errors } from '../config/errors';

@Route('session')
export class SessionController extends Controller {
  /**
   *  Login User.
   * @summary Login user in app.
   * @returns {Session} 200 - Token
   */
  @Post('/login')
  public async login(@Body() body: LoginUserRequest) {
    const errorsList = loginValidations(body);

    if (errorsList.length) {
      return {
        errors: errorsList,
        token: null,
      };
    }

    try {
      return await SessionService.loginUser(body);
    } catch (err) {
      // TODO: see how create a middleware to handle unexpected errors to avoid coding this if everywhere.
      if (err instanceof ApiError) {
        throw err;
      } else {
        throw new ApiError(errors.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
