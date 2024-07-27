import { AddUserRepository } from '@data/protocols/addUserRepository';
import { UserModel } from '@domain/models/user';
import { AddUserModel } from '@domain/use-cases/addUser';
import { MongoHelper } from '../helpers/mongoHelper';

export class UserMongoRepository implements AddUserRepository {
  async add(userData: AddUserModel): Promise<UserModel> {
    const userCollection = await MongoHelper.getCollection('users');
    const result = await userCollection.insertOne(userData);
    const { insertedId } = result;
    return MongoHelper.map(await userCollection.findOne({ _id: insertedId }));
  }
}
