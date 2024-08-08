import { InvoiceModel } from '@domain/models/invoice';
import { AddInvoiceModel } from '@domain/use-cases/addInvoice';

export interface IInvoiceRepository {
  add(invoiceData: AddInvoiceModel): Promise<InvoiceModel>;
  findOneById(invoiceId: string): Promise<InvoiceModel>;
}
