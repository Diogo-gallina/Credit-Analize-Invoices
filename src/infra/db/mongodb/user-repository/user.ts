import { IUserRepository } from '@data/protocols/userRepository';
import { UserModel } from '@domain/models/user';
import { AddUserModel } from '@domain/use-cases/addUser';
import { ObjectId } from 'mongodb';
import { MongoHelper } from '../helpers/mongoHelper';

export class UserMongoRepository implements IUserRepository {
  async add(userData: AddUserModel): Promise<UserModel> {
    const userCollection = await MongoHelper.getCollection('users');
    if (!userCollection) throw new Error('Failed to get collection');
    const result = await userCollection.insertOne(userData);
    if (!result || !result.insertedId) throw new Error('Failed to insert user');
    const { insertedId } = result;
    return MongoHelper.map(await userCollection.findOne({ _id: insertedId }));
  }

  async findOneByEmail(email: string): Promise<UserModel | null> {
    const userCollection = await MongoHelper.getCollection('users');
    if (!userCollection) throw new Error('Failed to get collection');
    return MongoHelper.map(await userCollection.findOne({ email })) || null;
  }

  async findOneById(userId: string): Promise<UserModel | null> {
    const userCollection = await MongoHelper.getCollection('users');
    if (!userCollection) throw new Error('Failed to get collection');
    return MongoHelper.map(await userCollection.findOne({ _id: new ObjectId(userId) })) || null;
  }
}
