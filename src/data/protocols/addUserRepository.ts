import { UserModel } from 'domain/models/user';
import { AddUserModel } from 'domain/usecases/addUser';

export interface AddUserRepository {
  add(userData: AddUserModel): Promise<UserModel>;
}
