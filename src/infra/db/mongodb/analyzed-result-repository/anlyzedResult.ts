import { IAnalyzedResultRepository } from '@data/protocols/analyzedRepository';
import { AddAnalyzedResultModel } from '@domain/use-cases/addAnalyzedResult';
import { AnalyzedResultModel } from '@domain/models/analyzedResult';
import { ObjectId } from 'mongodb';
import { MongoHelper } from '../helpers/mongoHelper';

export class AnalyzedResultMongoRepository implements IAnalyzedResultRepository {
  async add(analyzedResultData: AddAnalyzedResultModel): Promise<AnalyzedResultModel> {
    const analyzedResultCollection = await MongoHelper.getCollection('analyzedResults');
    const result = await analyzedResultCollection.insertOne(analyzedResultData);
    const { insertedId } = result;
    return MongoHelper.map(await analyzedResultCollection.findOne({ _id: insertedId }));
  }

  async findOneById(analyzedResultId: string): Promise<AnalyzedResultModel> {
    const analyzedResultCollection = await MongoHelper.getCollection('analyzedResults');
    const objectId = new ObjectId(analyzedResultId);
    return MongoHelper.map(await analyzedResultCollection.findOne({ _id: objectId }));
  }
}
