import { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { IStorageHelper } from '../../protocols/storageHelperInterface';
import { awsConfig } from '../../config/awsConfig';

const s3 = new S3Client(awsConfig);

export const s3Helper: IStorageHelper = {
  async uploadFile(bucketName: string, fileName: string, fileContent: Buffer | string): Promise<void> {
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: fileContent,
    };
    await s3.send(new PutObjectCommand(params));
  },

  async getAllPathsInBucket(bucketName: string): Promise<string[]> {
    const params = {
      Bucket: bucketName,
    };
    const data = await s3.send(new ListObjectsV2Command(params));
    return data.CommonPrefixes?.map((prefix) => prefix.Prefix) || [];
  },

  async createPathInBucket(bucketName: string, pathName: string): Promise<void> {
    const params = {
      Bucket: bucketName,
      Key: `${pathName}/`,
      Body: '',
    };
    await s3.send(new PutObjectCommand(params));
  },

  async getAllFilesInPath(bucketName: string, pathName: string): Promise<any[]> {
    const params = {
      Bucket: bucketName,
      Prefix: pathName,
    };
    const data = await s3.send(new ListObjectsV2Command(params));
    return data.Contents || [];
  },

  async getOneFileInPath(bucketName: string, pathName: string, key: string): Promise<any> {
    const params = {
      Bucket: bucketName,
      Key: `${pathName}/${key}`,
    };
    const data = await s3.send(new GetObjectCommand(params));
    return data;
  },
};
