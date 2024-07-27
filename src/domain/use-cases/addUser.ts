import { UserModel } from '@domain/models/user';

export interface AddUserModel {
  name: string;
  document: string;
  email: string;
}

export interface AddUser {
  add(user: AddUserModel): Promise<UserModel>;
}
