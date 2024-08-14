import { IStorageAdapter } from '@infra/cloud/adapters/protocols/storageAdapterInterface';
import { Readable } from 'nodemailer/lib/xoauth2';
import { UploadInvoiceUseCase } from './uploadInvoiceFile';

const makeFakeFile = (): Express.Multer.File => ({
  fieldname: 'invoiceFile',
  originalname: 'invoice.pdf',
  encoding: '7bit',
  mimetype: 'application/pdf',
  buffer: Buffer.from('any content'),
  size: 100,
  stream: new Readable(),
  destination: 'any_destination',
  filename: 'any_filename',
  path: 'any_path',
});

const makeStorageAdapterStub = (): IStorageAdapter => {
  class StorageAdapterStub implements IStorageAdapter {
    uploadFile(bucketName: string, fileName: string, fileContent: Buffer | string): Promise<void> {
      return Promise.resolve();
    }
    getAllPathsInBucket(bucketName: string): Promise<string[]> {
      return Promise.resolve(['user_email_path_bucket_1', 'user_email_path_bucket_2']);
    }
    createPathInBucket(bucketName: string, pathName: string): Promise<void> {
      return Promise.resolve();
    }
    getAllFilesInPath(bucketName: string, pathName: string): Promise<any[]> {
      throw new Error('Method not implemented.');
    }
    getOneFileInPath(bucketName: string, pathName: string, key: string): Promise<any> {
      throw new Error('Method not implemented.');
    }
  }
  return new StorageAdapterStub();
};

interface SutTypes {
  sut: UploadInvoiceUseCase;
  storageAdapterStub: IStorageAdapter;
}

const makeSut = (): SutTypes => {
  const storageAdapterStub = makeStorageAdapterStub();
  const sut = new UploadInvoiceUseCase(storageAdapterStub);
  return {
    sut,
    storageAdapterStub,
  };
};

describe('Upload Invoice UseCase', () => {
  it('should call getAllPathsInBucket with correct param', async () => {
    const { sut, storageAdapterStub } = makeSut();
    const getAllPathsInBucketSpy = jest.spyOn(storageAdapterStub, 'getAllPathsInBucket');
    const bucketName = 'credit-analyze-invoice-files';
    const userEmail = 'user@example.com';
    const fileName = 'any_file_name';
    const file = makeFakeFile();
    await sut.execute(file, userEmail, fileName);
    expect(getAllPathsInBucketSpy).toHaveBeenCalledTimes(1);
    expect(getAllPathsInBucketSpy).toHaveBeenCalledWith(bucketName);
  });

  it('should call createPathInBucket with correct param if userPath does not exists', async () => {
    const { sut, storageAdapterStub } = makeSut();
    const createPathInBucketSpy = jest.spyOn(storageAdapterStub, 'createPathInBucket');
    const bucketName = 'credit-analyze-invoice-files';
    const userEmail = 'user@example.com';
    const fileName = 'any_file_name';
    const userPath = `${userEmail}/`;
    const file = makeFakeFile();
    await sut.execute(file, userEmail, fileName);
    expect(createPathInBucketSpy).toHaveBeenCalledTimes(1);
    expect(createPathInBucketSpy).toHaveBeenCalledWith(bucketName, userPath);
  });

  it('should not call createPathInBucket if userPath exists', async () => {
    const { sut, storageAdapterStub } = makeSut();
    const userPath = 'user@example.com/';
    jest.spyOn(storageAdapterStub, 'getAllPathsInBucket').mockResolvedValue([userPath, 'any_path']);
    const createPathInBucketSpy = jest.spyOn(storageAdapterStub, 'createPathInBucket');
    const userEmail = 'user@example.com';
    const fileName = 'any_file_name';
    const file = makeFakeFile();
    await sut.execute(file, userEmail, fileName);
    expect(createPathInBucketSpy).not.toHaveBeenCalled();
  });

  test('should trows Error if buffer file does not exist', async () => {
    const { sut } = makeSut();
    const file = makeFakeFile();
    file.buffer = null;
    const userEmail = 'user@example.com';
    const fileName = 'any_file_name';
    await expect(sut.execute(file, userEmail, fileName)).rejects.toBeInstanceOf(Error);
    await expect(sut.execute(file, userEmail, fileName)).rejects.toThrow('File content is missing or invalid');
  });
});
