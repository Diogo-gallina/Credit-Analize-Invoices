/* eslint-disable no-restricted-globals */
import { IOcrAdapter } from 'infra/cloud/adapters/protocols/orcAdapterInterface';
import { AnalyzeDocumentResponse, Block, Relationship } from '@aws-sdk/client-textract';
import { NotFoundKeyError } from 'app/errors/notFoundKeyError';
import { InvalidTypeError } from 'app/errors/invalidTypeError';

export interface ExtractedInvoiceData {
  issuerName: string;
  document: string;
  paymentDate: Date;
  paymentAmount: number;
}

const BUCKET_NAME = 'invoice-files';

export class ExtractInvoiceDataUseCase {
  constructor(private readonly ocrExtractorAdapter: IOcrAdapter) {
    this.ocrExtractorAdapter = ocrExtractorAdapter;
  }

  async execute(fileName: string): Promise<ExtractedInvoiceData> {
    const analyzedData = await this.ocrExtractorAdapter.analyzeDocument(BUCKET_NAME, fileName);

    const [issuerName, document, paymentDate, paymentAmount] = await Promise.all([
      this.extractIssuerName(analyzedData),
      this.extractDocument(analyzedData),
      this.extractPaymentDate(analyzedData),
      this.extractPaymentAmount(analyzedData),
    ]);

    return { issuerName, document, paymentDate, paymentAmount };
  }

  private async extractIssuerName(analyzedData: AnalyzeDocumentResponse): Promise<string> {
    const value = await this.extractValueFromKeyValuePairs(analyzedData, /Emitente|Issuer Name/i);

    if (value) return value;

    throw new NotFoundKeyError('Issuer Name');
  }

  private async extractDocument(analyzedData: AnalyzeDocumentResponse): Promise<string> {
    const value = await this.extractValueFromKeyValuePairs(analyzedData, /CPF|CNPJ/i);

    if (value) return value;

    throw new NotFoundKeyError('Document');
  }

  private async extractPaymentDate(analyzedData: AnalyzeDocumentResponse): Promise<Date> {
    const value = await this.extractValueFromKeyValuePairs(
      analyzedData,
      /Data\s*de\s*Pagamento|Data\s*de\s*Emissão|Data/i,
    );

    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) return date;
    }

    throw new NotFoundKeyError('Payment Date');
  }

  private async extractPaymentAmount(analyzedData: AnalyzeDocumentResponse): Promise<number> {
    const value = await this.extractValueFromKeyValuePairs(analyzedData, /Valor/i);

    if (value) {
      const amount = parseFloat(value);
      if (!isNaN(amount)) return amount;

      throw new InvalidTypeError('The Payment Amount is not a valid number.');
    }

    throw new NotFoundKeyError('Payment Amount');
  }

  private async extractValueFromKeyValuePairs(
    analyzedData: AnalyzeDocumentResponse,
    keyPattern: RegExp,
  ): Promise<string | undefined> {
    const keyValuePairs = analyzedData.Blocks.filter(
      (block: Block) => block.BlockType === 'KEY_VALUE_SET' && block.EntityTypes?.includes('KEY'),
    );

    for (const pair of keyValuePairs || []) {
      const key = pair.Relationships?.find((rel: Relationship) => rel.Type === 'CHILD')
        ?.Ids?.map((id) => analyzedData.Blocks.find((block) => block.Id === id)?.Text)
        .join(' ');

      if (key?.match(keyPattern)) {
        const value = pair.Relationships?.find((rel: Relationship) => rel.Type === 'VALUE')
          ?.Ids?.map((id) => analyzedData.Blocks.find((block) => block.Id === id)?.Text)
          .join(' ');

        return value?.trim();
      }
    }

    return undefined;
  }
}
