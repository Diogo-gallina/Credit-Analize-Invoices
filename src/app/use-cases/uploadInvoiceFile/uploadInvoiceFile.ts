import { IStorageAdapter } from '@infra/cloud/adapters/protocols/storageAdapterInterface';

const BUCKET_NAME = 'invoice-files';

export class UploadInvoiceUseCase {
  constructor(private readonly storageAdapter: IStorageAdapter) {
    this.storageAdapter = storageAdapter;
  }

  async execute(invoiceFile: File, userEmail: string, fileName: string): Promise<void> {
    const userPath = `${userEmail}/`;

    const existingPaths = await this.storageAdapter.getAllPathsInBucket(BUCKET_NAME);
    const userPathExists = existingPaths.includes(userPath);

    if (!userPathExists) await this.storageAdapter.createPathInBucket(BUCKET_NAME, userPath);

    const arrayBuffer = await invoiceFile[0].arrayBuffer();
    const fileContent = Buffer.from(arrayBuffer);
    const fullFilePath = `${userPath}${fileName}`;

    await this.storageAdapter.uploadFile(BUCKET_NAME, fullFilePath, fileContent);
  }
}
