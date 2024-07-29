import { UserRepository } from '@data/protocols/userRepository';
import { UserModel } from '@domain/models/user';
import { AddUser, AddUserModel } from '@domain/use-cases/addUser';

export class DbAddUser implements AddUser {
  constructor(private readonly userRepository: UserRepository) {
    this.userRepository = userRepository;
  }
  async add(userData: AddUserModel): Promise<UserModel> {
    const userExisted = await this.userRepository.findOneByEmail(userData.email);
    if (userExisted) {
      return new Promise<UserModel>((resolve) => resolve(userExisted));
    }
    const user = await this.userRepository.add(userData);
    return new Promise<UserModel>((resolve) => resolve(user));
  }
}
