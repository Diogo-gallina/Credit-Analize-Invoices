import { IOcrHelper } from '@infra/cloud/lib/protocols/orcHelperInterface';
import { AnalyzeDocumentResponse } from '@aws-sdk/client-textract';
import { IOcrAdapter } from '../protocols/orcAdapterInterface';

export class OcrAdapter implements IOcrAdapter {
  constructor(private readonly ocrHelper: IOcrHelper) {
    this.ocrHelper = ocrHelper;
  }

  async analyzeDocument(bucketName: string, fileName: string): Promise<AnalyzeDocumentResponse> {
    return this.ocrHelper.analyzeDocument(bucketName, fileName);
  }
}
