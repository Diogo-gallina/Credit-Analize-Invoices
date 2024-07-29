import { IStorageAdapter } from '@infra/cloud/adapters/protocols/storageAdapterInterface';

const BUCKET_NAME = 'credit-analyze-invoice-files';

export class UploadInvoiceUseCase {
  constructor(private readonly storageAdapter: IStorageAdapter) {
    this.storageAdapter = storageAdapter;
  }

  async execute(invoiceFile: Express.Multer.File, userEmail: string, fileName: string): Promise<string> {
    const userPath = `${userEmail}/`;

    const existingPaths = await this.storageAdapter.getAllPathsInBucket(BUCKET_NAME);
    const userPathExists = existingPaths.includes(userPath);

    if (!userPathExists) await this.storageAdapter.createPathInBucket(BUCKET_NAME, userPath);

    const fileContent = invoiceFile.buffer;
    if (!fileContent) {
      throw new Error('File content is missing or invalid');
    }

    const fullFilePath = `${userPath}${fileName}`;
    await this.storageAdapter.uploadFile(BUCKET_NAME, fullFilePath, fileContent);
    return `https://${BUCKET_NAME}.s3.amazonaws.com/${encodeURIComponent(userEmail)}/${fileName}`;
  }
}
