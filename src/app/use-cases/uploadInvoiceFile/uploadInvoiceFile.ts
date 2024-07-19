import { UserModel } from 'domain/models/user';
import { IStorageAdapter } from 'infra/cloud/adapters/protocols/storageAdapterInterface';

const BUCKET_NAME = 'invoice-files';

export class UploadInvoiceUseCase {
  constructor(private readonly storageAdapter: IStorageAdapter) {
    this.storageAdapter = storageAdapter;
  }

  async execute(invoiceFile: FileList, userData: UserModel): Promise<void> {
    const userEmail = userData.email;
    const userPath = `${userEmail}/`;

    const existingPaths = await this.storageAdapter.getAllPathsInBucket(BUCKET_NAME);
    const userPathExists = existingPaths.includes(userPath);

    if (!userPathExists) await this.storageAdapter.createPathInBucket(BUCKET_NAME, userPath);

    const timestamp = Date.now();
    const fileName = `Invoice-${timestamp}`;
    const arrayBuffer = await invoiceFile[0].arrayBuffer();
    const fileContent = Buffer.from(arrayBuffer);

    await this.storageAdapter.uploadFile(BUCKET_NAME, `${userPath}${fileName}`, fileContent);
  }
}
