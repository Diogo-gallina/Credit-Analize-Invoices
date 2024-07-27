import { InvoiceModel } from '@domain/models/invoice';
import { AddInvoiceModel } from '@domain/use-cases/addInvoice';

export interface AddInvoiceRepository {
  add(invoiceData: AddInvoiceModel): Promise<InvoiceModel>;
}
