import { ExtractInvoiceDataUseCase } from '@app/use-cases/extractInvoiceData/extractInvoiceData';
import { SendInvoiceToQueueUseCase } from '@app/use-cases/sendInvoiceToQueue/sendInvoiceToQueue';
import { UploadInvoiceUseCase } from '@app/use-cases/uploadInvoiceFile/uploadInvoiceFile';
import { DbAddInvoice } from '@data/use-cases/add-invoice/dbAddInvoice';
import { DbAddUser } from '@data/use-cases/add-user/dbAddUser';
import { MessagingAdapter } from '@infra/cloud/adapters/messaging/messagingAdapter';
import { OcrAdapter } from '@infra/cloud/adapters/ocr-extractor/orcAdapter';
import StorageAdapter from '@infra/cloud/adapters/storage/storageAdapter';
import { sqsHelper } from '@infra/cloud/lib/aws/helpers/messaging/sqsHelper';
import { textractHelper } from '@infra/cloud/lib/aws/helpers/ocr-extractor/textractHelper';
import { s3Helper } from '@infra/cloud/lib/aws/helpers/storage/s3Helper';
import { InvoiceMongoRepository } from '@infra/db/mongodb/invoice-repository/invoice';
import { UserMongoRepository } from '@infra/db/mongodb/user-repository/user';
import { InvoiceController } from '@presentation/controllers/invoice.controller';
import { Controller } from '@presentation/protocols';

export const makeInvoiceController = (): Controller => {
  const userMongoRepository = new UserMongoRepository();
  const invoiceMongoRepository = new InvoiceMongoRepository();

  const dbAddUser = new DbAddUser(userMongoRepository);

  const storageAdapter = new StorageAdapter(s3Helper);
  const uploadInvoiceUseCase = new UploadInvoiceUseCase(storageAdapter);

  const ocrAdapter = new OcrAdapter(textractHelper);
  const extractInvoiceData = new ExtractInvoiceDataUseCase(ocrAdapter);

  const dbAddInvoice = new DbAddInvoice(invoiceMongoRepository);

  const messagingAdapter = new MessagingAdapter(sqsHelper);
  const sendInvoiceToQueueUseCase = new SendInvoiceToQueueUseCase(messagingAdapter);

  return new InvoiceController(
    dbAddUser,
    uploadInvoiceUseCase,
    extractInvoiceData,
    dbAddInvoice,
    sendInvoiceToQueueUseCase,
  );
};
