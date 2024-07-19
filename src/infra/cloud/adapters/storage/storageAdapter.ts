import { s3Helper } from 'infra/cloud/aws/helpers/storage/s3Helper';
import { S3 } from 'aws-sdk';
import { IStorageHelper } from 'infra/cloud/aws/protocols/storageHelperInterface';
import { IStorageAdapter } from '../protocols/storageAdapterInterface';

class StorageAdapter implements IStorageAdapter {
  constructor(private readonly storageHelper: IStorageHelper) {
    this.storageHelper = s3Helper;
  }
  async uploadFile(bucketName: string, fileName: string, fileContent: Buffer | string): Promise<void> {
    await this.storageHelper.uploadFile(bucketName, fileName, fileContent);
  }

  async getAllPathsInBucket(bucketName: string): Promise<string[]> {
    return this.storageHelper.getAllPathsInBucket(bucketName);
  }

  async createPathInBucket(bucketName: string, pathName: string): Promise<void> {
    this.storageHelper.createPathInBucket(bucketName, pathName);
  }

  async getAllFilesInPath(bucketName: string, pathName: string): Promise<S3.ObjectList> {
    return this.storageHelper.getAllFilesInPath(bucketName, pathName);
  }

  async getOneFileInPath(bucketName: string, pathName: string, key: string): Promise<S3.GetObjectOutput> {
    return this.storageHelper.getOneFileInPath(bucketName, pathName, key);
  }
}

export default StorageAdapter;
