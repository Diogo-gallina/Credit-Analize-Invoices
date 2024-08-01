import { AddInvoice, AddInvoiceModel } from '@domain/use-cases/addInvoice';
import { InvoiceModel } from '@domain/models/invoice';
import { IInvoiceRepository } from '@data/protocols/invoiceRepository';

export class DbAddInvoice implements AddInvoice {
  constructor(private readonly invoiceRepository: IInvoiceRepository) {
    this.invoiceRepository = invoiceRepository;
  }

  async add(invoiceData: AddInvoiceModel): Promise<InvoiceModel> {
    invoiceData.createdAt = new Date();
    const invoice = await this.invoiceRepository.add(invoiceData);
    return new Promise<InvoiceModel>((resolve) => resolve(invoice));
  }
}
