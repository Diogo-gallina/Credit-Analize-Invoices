import { AddInvoiceRepository } from '@data/protocols/addInvoiceRepository';
import { InvoiceModel } from '@domain/models/invoice';
import { AddInvoiceModel } from '@domain/usecases/addInvoice';
import { MongoHelper } from '../helpers/mongoHelper';

export class InvoiceMongoRepository implements AddInvoiceRepository {
  async add(invoiceData: AddInvoiceModel): Promise<InvoiceModel> {
    const invoiceCollection = await MongoHelper.getCollection('invoices');
    const result = await invoiceCollection.insertOne(invoiceData);
    const { insertedId } = result;
    return MongoHelper.map(await invoiceCollection.findOne({ _id: insertedId }));
  }
}
