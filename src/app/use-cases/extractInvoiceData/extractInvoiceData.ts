/* eslint-disable radix */
/* eslint-disable no-restricted-globals */
import { IOcrAdapter } from '@infra/cloud/adapters/protocols/orcAdapterInterface';
import { AnalyzeDocumentResponse, Block } from '@aws-sdk/client-textract';
import { ParseDataError, NotFoundKeyError } from '@app/errors';
import { parse, isValid } from 'date-fns';

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

    const issuerName = this.getKeyValue(keyValuePairs, [
      'Emitente',
      'NOME / RAZÃO SOCIAL',
      'RAZÃO SOCIAL',
      'NOME',
      'NOMERAZÃO SOCIAL',
      'Nome Razão Social',
      'Nome/Razão Social',
      'Nome/Razao Social',
      'Nome / Razao Social',
    ]);
    console.log({ issuerName });

    const document = this.getKeyValue(keyValuePairs, [
      'CNPJ/CPF',
      'CNPJ',
      'CPF',
      'CNPJ CPF',
      'CPF/CNPJ',
      'CNPJ / CPF',
      'Documento',
      'Documento/CPF',
      'Documento/CNPJ',
    ]);
    console.log({ document });

    const paymentAmount = this.parseAmount(
      this.getKeyValue(keyValuePairs, [
        'VALOR TOTAL DA NOTA',
        'VALOR TOTAL R$',
        'Total',
        'VI Total',
        'Valor total da nota',
        'VALOR TOTAL',
        'Valor Total',
        'Valor Final',
        'Total a Pagar',
        'VLR. TOT',
      ]),
    );
    console.log({ paymentAmount });

    const paymentDate = this.findValidDate(
      this.getAllKeyValues(keyValuePairs, [
        'Data emissão',
        'Data emissao',
        'DATA SAÍDA',
        'Data de Autorização',
        'Data de Emissão',
        'DATA DA EMISSÃO',
        'Data saida',
        'Data Saída',
        'Data da Emissao',
        'Data de Emissao',
      ]),
    );
    console.log({ paymentDate });

    return { issuerName, document, paymentDate, paymentAmount };
  }

  private getKeyValue(keyValuePairs: Map<string, string>, possibleKeys: string[]): string {
    const normalizedKeys = possibleKeys.map((key) => key.toLowerCase());

    for (const [key, value] of keyValuePairs) {
      if (normalizedKeys.includes(key.toLowerCase().trim())) return value;
    }
    throw new NotFoundKeyError(`Key not found. Expected one of: ${possibleKeys.join(', ')}`);
  }

  private getAllKeyValues(keyValuePairs: Map<string, string>, possibleKeys: string[]): string[] {
    const normalizedKeys = possibleKeys.map((key) => key.toLowerCase());
    const foundValues: string[] = [];

    for (const [key, value] of keyValuePairs) {
      if (normalizedKeys.includes(key.toLowerCase().trim())) foundValues.push(value);
    }

    return foundValues;
  }

  private findValidDate(possibleDates: string[]): Date {
    const currentDate = new Date();
    const oneYearInMs = 365 * 24 * 60 * 60 * 1000;

    console.log({ possibleDates });

    for (const dateStr of possibleDates) {
      if (dateStr.trim() === '') continue;
      const date = this.parseDate(dateStr);
      if (date && Math.abs(currentDate.getTime() - date.getTime()) <= oneYearInMs) return date;
    }

    throw new ParseDataError(
      `No valid date found within one year of the current date from the provided values: ${possibleDates.join(', ')}`,
    );
  }

  private parseDate(dateStr: string): Date | null {
    const dateFormats = ['yyyy-MM-dd', 'dd/MM/yyyy', 'dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy'];

    for (const format of dateFormats) {
      const date = parse(dateStr, format, new Date());
      if (isValid(date)) return date;
    }

    throw new ParseDataError(`Invalid date: ${dateStr}`);
  }

  private parseAmount(amountStr: string): number {
    const sanitizedStr = amountStr.replace(/[^\d,.-]/g, '');
    const normalizedStr = sanitizedStr.replace(',', '.');
    const amount = parseFloat(normalizedStr);

    if (!isNaN(amount)) return amount;

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
        if (block.EntityTypes?.includes('KEY')) keyMap.set(blockId, block);
        else valueMap.set(blockId, block);
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
          if (childBlock && childBlock.BlockType === 'WORD') text += `${childBlock.Text} `;
        }
      }
    }

    return text.trim();
  }
}
