export interface UserBaseType {
  email: string;
  firstName: string;
  lastName: string;
}

export interface UserType extends UserBaseType {
  id: number;
}

export interface RegisterUserRequestType extends Omit<UserBaseType, 'id'> {
  password: string;
}

export interface LoginUserRequestType {
  email: string;
  password: string;
}
