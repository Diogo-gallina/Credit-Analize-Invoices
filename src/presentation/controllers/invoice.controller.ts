import { ExtractInvoiceDataUseCase } from '@app/use-cases/extractInvoiceData/extractInvoiceData';
import { SendInvoiceToQueueUseCase } from '@app/use-cases/sendInvoiceToQueue/sendInvoiceToQueue';
import { UploadInvoiceUseCase } from '@app/use-cases/uploadInvoiceFile/uploadInvoiceFile';
import { DbAddInvoice } from '@data/use-cases/add-invoice/dbAddInvoice';
import { DbAddUser } from '@data/use-cases/add-user/dbAddUser';
import { UploadInvoiceDto } from '@presentation/dtos/uploadInvoiceDto';
import { badRequest, ok } from '@presentation/helper/httpHelper';
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols';

export class InvoiceController implements Controller {
  constructor(
    private readonly dbAddUser: DbAddUser,
    private readonly uploadInvoiceUseCase: UploadInvoiceUseCase,
    private readonly extractInvoiceData: ExtractInvoiceDataUseCase,
    private readonly dbAddInvoice: DbAddInvoice,
    private readonly sendInvoiceToQueueUseCase: SendInvoiceToQueueUseCase,
  ) {
    this.dbAddUser = dbAddUser;
    this.uploadInvoiceUseCase = uploadInvoiceUseCase;
    this.extractInvoiceData = extractInvoiceData;
    this.dbAddInvoice = dbAddInvoice;
    this.sendInvoiceToQueueUseCase = sendInvoiceToQueueUseCase;
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      console.log({ httpRequest });
      const invoiceRequestBody: UploadInvoiceDto = httpRequest.body;
      console.log({ invoiceRequestBody });
      const { name, email, document, invoiceFile } = invoiceRequestBody!;
      if (!name || !email || !document || !invoiceFile) {
        return badRequest(new Error('Missing required fields'));
      }
      const user = await this.dbAddUser.add({ name, document, email });
      const fileName = `Invoice-${Date.now()}`;
      await this.uploadInvoiceUseCase.execute(invoiceFile, user.email, fileName);
      const invoiceData = await this.extractInvoiceData.execute(fileName);
      const invoice = await this.dbAddInvoice.add({ ...invoiceData, userId: user.id });
      await this.sendInvoiceToQueueUseCase.execute({ invoice, user });
      return ok('Send Message');
    } catch (error) {
      return badRequest(error);
    }
  }
}
