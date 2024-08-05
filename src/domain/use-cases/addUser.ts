import { UserModel } from '@domain/models/user';

export interface AddUserModel {
  name: string;
  document: string;
  email: string;
  createdAt: Date;
}

export interface AddUser {
  add(user: AddUserModel): Promise<UserModel>;
}
