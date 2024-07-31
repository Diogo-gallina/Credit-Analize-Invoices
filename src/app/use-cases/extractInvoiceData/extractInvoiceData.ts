/* eslint-disable radix */
/* eslint-disable no-restricted-globals */
import { IOcrAdapter } from '@infra/cloud/adapters/protocols/orcAdapterInterface';
import { AnalyzeDocumentResponse, Block } from '@aws-sdk/client-textract';
import { ParseDataError, NotFoundKeyError } from '@app/errors';

export interface ExtractedInvoiceData {
  issuerName: string;
  document: string;
  paymentDate: Date;
  paymentAmount: number;
}

const BUCKET_NAME = 'credit-analyze-invoice-files';

export class ExtractInvoiceDataUseCase {
  constructor(private readonly ocrExtractorAdapter: IOcrAdapter) {
    this.ocrExtractorAdapter = ocrExtractorAdapter;
  }

  async execute(fileName: string): Promise<ExtractedInvoiceData> {
    const analyzedData = await this.ocrExtractorAdapter.analyzeDocument(BUCKET_NAME, fileName);
    const keyValuePairs = await this.extractKeyValuePairs(analyzedData);
    const issuerName = this.getKeyValue(
      keyValuePairs,
      /Emitente|NOME \/ RAZÃO SOCIAL|RAZÃO SOCIAL|NOME|NOMERAZÃO SOCIAL|Nome Razão Social|Nome\/Razão Social|Nome\/Razao Social|Nome \/ Razao Social|Nome\/Razao Social|Nome \/ Razao Social/i,
    );
    console.log({ issuerName });

    const document = this.getKeyValue(
      keyValuePairs,
      /CNPJ\/CPF|CNPJ|CPF|CNPJ CPF|CPF\/CNPJ|CNPJ \/ CPF|Documento|Documento\/CPF|Documento\/CNPJ/i,
    );
    console.log({ document });

    const paymentDate = this.parseDate(
      this.getKeyValue(
        keyValuePairs,
        /DATA EMISSÃO|DATA SAÍDA|Data de Autorização|Data de Emissão|DATA DA EMISSÃO|Data emissão|Data saida|Data Emissão|Data Saída|Data da Emissao|Data de Emissao/i,
      ),
    );
    console.log({ paymentDate });

    const paymentAmount = this.parseAmount(
      this.getKeyValue(
        keyValuePairs,
        /VALOR TOTAL DA NOTA|VALOR TOTAL R\$|Total|VI Total|Valor total da nota|VALOR TOTAL|Valor Total|Valor Final|Total a Pagar/i,
      ),
    );
    console.log({ paymentAmount });

    return { issuerName, document, paymentDate, paymentAmount };
  }

  private getKeyValue(keyValuePairs: Map<string, string>, keyPattern: RegExp): string {
    for (const [key, value] of keyValuePairs) {
      if (keyPattern.test(key)) {
        return value;
      }
    }
    throw new NotFoundKeyError(`Key matching pattern ${keyPattern} not found.`);
  }

  private parseDate(dateStr: string): Date {
    const dateFormats = ['yyyy-MM-dd', 'dd/MM/yyyy', 'dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy'];

    for (const format of dateFormats) {
      const date = this.parseDateFormat(dateStr, format);
      if (date) {
        return date;
      }
    }

    throw new ParseDataError(`Invalid date: ${dateStr}`);
  }

  private parseDateFormat(dateStr: string, format: string): Date | null {
    const parts = dateStr.match(/(\d+)/g);
    if (!parts) return null;

    const [year, month, day] =
      format === 'yyyy-MM-dd' || format === 'yyyy/MM/dd'
        ? [parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])]
        : [parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])];

    const date = new Date(year, month, day);
    return isNaN(date.getTime()) ? null : date;
  }

  private parseAmount(amountStr: string): number {
    const amount = parseFloat(amountStr.replace(/[^\d.-]/g, ''));
    if (!isNaN(amount)) {
      return amount;
    }
    throw new ParseDataError(`Invalid amount: ${amountStr}`);
  }

  private async extractKeyValuePairs(analyzedData: AnalyzeDocumentResponse): Promise<Map<string, string>> {
    const blockMap: Map<string, Block> = new Map();
    const keyMap: Map<string, Block> = new Map();
    const valueMap: Map<string, Block> = new Map();

    for (const block of analyzedData.Blocks || []) {
      const blockId = block.Id!;
      blockMap.set(blockId, block);

      if (block.BlockType === 'KEY_VALUE_SET') {
        if (block.EntityTypes?.includes('KEY')) {
          keyMap.set(blockId, block);
        } else {
          valueMap.set(blockId, block);
        }
      }
    }

    console.log(this.getRelationships(blockMap, keyMap, valueMap));

    return this.getRelationships(blockMap, keyMap, valueMap);
  }

  private getRelationships(
    blockMap: Map<string, Block>,
    keyMap: Map<string, Block>,
    valueMap: Map<string, Block>,
  ): Map<string, string> {
    const result: Map<string, string> = new Map();

    for (const [_keyId, keyBlock] of keyMap) {
      const valueBlock = this.findValue(keyBlock, valueMap);
      const keyText = this.getText(keyBlock, blockMap);
      const valueText = this.getText(valueBlock, blockMap);
      result.set(keyText, valueText);
    }

    return result;
  }

  private findValue(keyBlock: Block, valueMap: Map<string, Block>): Block | undefined {
    let valueBlock: Block | undefined;

    for (const relationship of keyBlock.Relationships || []) {
      if (relationship.Type === 'VALUE') {
        for (const id of relationship.Ids || []) {
          valueBlock = valueMap.get(id);
        }
      }
    }

    return valueBlock;
  }

  private getText(block: Block | undefined, blockMap: Map<string, Block>): string {
    if (!block) return '';

    let text = '';

    for (const relationship of block.Relationships || []) {
      if (relationship.Type === 'CHILD') {
        for (const id of relationship.Ids || []) {
          const childBlock = blockMap.get(id);
          if (childBlock && childBlock.BlockType === 'WORD') {
            text += `${childBlock.Text} `;
          }
        }
      }
    }

    return text.trim();
  }
}
