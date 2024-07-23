import { InvoiceModel } from '@domain/models/invoice';
import { AddInvoiceModel } from '@domain/usecases/addInvoice';

export interface AddInvoiceRepository {
  add(invoiceData: AddInvoiceModel): Promise<InvoiceModel>;
}
