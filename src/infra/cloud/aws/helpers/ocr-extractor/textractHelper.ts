import {
  TextractClient,
  TextractClientConfig,
  AnalyzeDocumentCommand,
  AnalyzeDocumentResponse,
  FeatureType,
} from '@aws-sdk/client-textract';
import { IOcrHelper } from 'infra/cloud/aws/protocols/orcHelperInterface';

const textractConfig: TextractClientConfig = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
};

const textractClient = new TextractClient(textractConfig);

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
