import { S3 } from 'aws-sdk';

export interface IStorageHelper {
  uploadFile(bucketName: string, fileName: string, fileContent: Buffer | string): Promise<string>;
  getAllPathsInBucket(bucketName: string): Promise<string[]>;
  createPathInBucket(bucketName: string, pathName: string): Promise<void>;
  getAllFilesInPath(bucketName: string, pathName: string): Promise<S3.ObjectList>;
  getOneFileInPath(bucketName: string, pathName: string, key: string): Promise<S3.GetObjectOutput>;
}
