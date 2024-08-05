import { TextractClient, AnalyzeDocumentCommand, AnalyzeDocumentResponse, FeatureType } from '@aws-sdk/client-textract';
import { IOcrHelper } from '@infra/cloud/aws/protocols/orcHelperInterface';
import { awsConfig } from '../../config/awsConfig';

const textractClient = new TextractClient(awsConfig);

export const textractHelper: IOcrHelper = {
  async analyzeDocument(bucketName: string, fileName: string): Promise<AnalyzeDocumentResponse> {
    const params = {
      Document: {
        S3Object: {
          Bucket: bucketName,
          Name: fileName,
        },
      },
      FeatureTypes: [FeatureType.FORMS],
    };

    const command = new AnalyzeDocumentCommand(params);
    const response = await textractClient.send(command);
    return response;
  },
};
