export class InvoiceModel {
  id: string;
  userId: string;
  issuerName: string;
  document: string;
  paymentDate: Date;
  paymentAmount: number;
  createdAt: Date;
}
