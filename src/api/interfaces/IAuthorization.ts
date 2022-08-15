export interface IAuthUserData {
  id?: number;
  email: string;
  password: string;
  token?: string;
  name?: string;
}
export interface IGetAuthUsers {
  email?: string;
  password?: string;
  token?: string;
}
export interface IRegisterUserData {
  id?: number;
  email: string;
  name: string;
  password: string;
  confirmPassword?: string;
  token?: string;
}
