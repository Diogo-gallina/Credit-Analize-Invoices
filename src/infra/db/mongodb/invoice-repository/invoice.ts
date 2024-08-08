import { IInvoiceRepository } from '@data/protocols/invoiceRepository';
import { InvoiceModel } from '@domain/models/invoice';
import { AddInvoiceModel } from '@domain/use-cases/addInvoice';
import { ObjectId } from 'mongodb';
import { MongoHelper } from '../helpers/mongoHelper';

export class InvoiceMongoRepository implements IInvoiceRepository {
  async add(invoiceData: AddInvoiceModel): Promise<InvoiceModel> {
    const invoiceCollection = await MongoHelper.getCollection('invoices');
    const result = await invoiceCollection.insertOne(invoiceData);
    const { insertedId } = result;
    return MongoHelper.map(await invoiceCollection.findOne({ _id: insertedId }));
  }

  async findOneById(invoiceId: string): Promise<InvoiceModel> {
    const userCollection = await MongoHelper.getCollection('invoices');
    if (!userCollection) throw new Error('Failed to get collection');
    return MongoHelper.map(await userCollection.findOne({ _id: new ObjectId(invoiceId) })) || null;
  }
}
