import { InvoiceModel } from 'domain/models/invoice';

export interface AddInvoiceModel {
  userId: string;
  issuerName: string;
  document: string;
  paymentDate: Date;
  paymentAmount: number;
}

export interface AddInvoice {
  add(invoice: AddInvoiceModel): Promise<InvoiceModel>;
}
