import { AddInvoice, AddInvoiceModel } from '@domain/use-cases/addInvoice';
import { InvoiceModel } from '@domain/models/invoice';
import { AddInvoiceRepository } from '@data/protocols/addInvoiceRepository';

export class DbAddInvoice implements AddInvoice {
  constructor(private readonly addInvoiceRepository: AddInvoiceRepository) {
    this.addInvoiceRepository = addInvoiceRepository;
  }

  async add(invoiceData: AddInvoiceModel): Promise<InvoiceModel> {
    const invoice = await this.addInvoiceRepository.add(invoiceData);
    return new Promise<InvoiceModel>((resolve) => resolve(invoice));
  }
}
