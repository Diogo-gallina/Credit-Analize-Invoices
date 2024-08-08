import { AnalyzeDocumentResponse } from '@aws-sdk/client-textract';

export interface IOcrHelper {
  analyzeDocument(bucketName: string, fileName: string): Promise<AnalyzeDocumentResponse>;
}
