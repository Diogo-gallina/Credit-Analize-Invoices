import AWS, { S3 } from 'aws-sdk';
import { IStorageHelper } from '../../protocols/storageHelperInterface';

const s3 = new AWS.S3();

export const s3Helper: IStorageHelper = {
  async uploadFile(bucketName: string, fileName: string, fileContent: Buffer | string): Promise<void> {
    const params: S3.PutObjectRequest = {
      Bucket: bucketName,
      Key: fileName,
      Body: fileContent,
    };
    await s3.putObject(params).promise();
  },

  async getAllPathsInBucket(bucketName: string): Promise<string[]> {
    const params: S3.ListObjectsV2Request = {
      Bucket: bucketName,
      Delimiter: '/',
    };
    const data = await s3.listObjectsV2(params).promise();
    return data.CommonPrefixes?.map((prefix) => prefix.Prefix) || [];
  },

  async createPathInBucket(bucketName: string, pathName: string): Promise<void> {
    const params: S3.PutObjectRequest = {
      Bucket: bucketName,
      Key: `${pathName}/`,
      Body: '',
    };
    await s3.putObject(params).promise();
  },

  async getAllFilesInPath(bucketName: string, pathName: string): Promise<S3.ObjectList> {
    const params: S3.ListObjectsV2Request = {
      Bucket: bucketName,
      Prefix: pathName,
    };
    const data = await s3.listObjectsV2(params).promise();
    return data.Contents || [];
  },

  async getOneFileInPath(bucketName: string, pathName: string, key: string): Promise<S3.GetObjectOutput> {
    const params: S3.GetObjectRequest = {
      Bucket: bucketName,
      Key: `${pathName}/${key}`,
    };
    const data = await s3.getObject(params).promise();
    return data;
  },
};
