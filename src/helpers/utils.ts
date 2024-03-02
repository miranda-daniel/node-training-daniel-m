import * as bcrypt from 'bcrypt';

export const hashPassword = (password: string): Promise<string> => {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hash(password, salt);
};

export const comparePasswords = async (
  password: string,
  passwordStore: string
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(password, passwordStore);
  return isMatch;
};
