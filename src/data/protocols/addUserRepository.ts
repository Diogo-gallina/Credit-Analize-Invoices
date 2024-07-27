import { UserModel } from '@domain/models/user';
import { AddUserModel } from '@domain/use-cases/addUser';

export interface AddUserRepository {
  add(userData: AddUserModel): Promise<UserModel>;
}
