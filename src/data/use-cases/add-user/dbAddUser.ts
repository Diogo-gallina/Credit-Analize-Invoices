import { AddUserRepository } from 'data/protocols/addUserRepository';
import { UserModel } from 'domain/models/user';
import { AddUser, AddUserModel } from 'domain/usecases/addUser';

export class DbAddUser implements AddUser {
  constructor(private readonly addUserRepository: AddUserRepository) {
    this.addUserRepository = addUserRepository;
  }

  async add(userData: AddUserModel): Promise<UserModel> {
    const user = await this.addUserRepository.add(userData);
    return new Promise<UserModel>((resolve) => resolve(user));
  }
}
