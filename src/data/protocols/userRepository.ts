import { UserModel } from '@domain/models/user';
import { AddUserModel } from '@domain/use-cases/addUser';

export interface UserRepository {
  add(userData: AddUserModel): Promise<UserModel>;
  findOneByEmail(email: string): Promise<UserModel>;
}
