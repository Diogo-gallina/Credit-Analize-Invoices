export interface IStorageAdapter {
  uploadFile(bucketName: string, fileName: string, fileContent: Buffer | string): Promise<string>;
  getAllPathsInBucket(bucketName: string): Promise<string[]>;
  createPathInBucket(bucketName: string, pathName: string): Promise<void>;
  getAllFilesInPath(bucketName: string, pathName: string): Promise<any[]>;
  getOneFileInPath(bucketName: string, pathName: string, key: string): Promise<any>;
}
