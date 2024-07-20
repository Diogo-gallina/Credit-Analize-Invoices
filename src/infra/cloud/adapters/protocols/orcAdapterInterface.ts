import { AnalyzeDocumentResponse } from '@aws-sdk/client-textract';

export interface IOcrAdapter {
  analyzeDocument(bucketName: string, fileName: string): Promise<AnalyzeDocumentResponse>;
}
