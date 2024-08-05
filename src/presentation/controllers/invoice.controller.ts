import { MissingParamError } from '@app/errors';
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
      const invoiceRequestBody: UploadInvoiceDto = httpRequest.body;
      const invoiceFile = httpRequest.file;
      const requiredFields = ['name', 'email', 'document'];
      for (const field of requiredFields) {
        if (!invoiceRequestBody[field]) return badRequest(new MissingParamError(field));
        if (!invoiceFile) return badRequest(new MissingParamError('file'));
      }
      const { name, email, document } = invoiceRequestBody!;
      const user = await this.dbAddUser.add({ name, document, email, createdAt: new Date() });
      const fileName = `${Date.now()}_${invoiceFile.originalname}`;
      const url = await this.uploadInvoiceUseCase.execute(invoiceFile, email, fileName);
      const fullFilePath = `${email}/${fileName}`;
      const invoiceData = await this.extractInvoiceData.execute(fullFilePath);
      const invoice = await this.dbAddInvoice.add({ ...invoiceData, userId: user.id, createdAt: new Date() });
      await this.sendInvoiceToQueueUseCase.execute({ invoice, user });
      return ok({
        message: 'Send file to analyze sucessfully',
        s3FileUrl: url,
      });
    } catch (error) {
      return badRequest(error);
    }
  }
}
