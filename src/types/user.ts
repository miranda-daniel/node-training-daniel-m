export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface LoginUserRequest {
  email: string;
  password: string;
}

export interface RegisterUserRequest extends Omit<User, 'id'> {
  password: string;
}

export interface UserRaw extends User {
  password: string;
}
