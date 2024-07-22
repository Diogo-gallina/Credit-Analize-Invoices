import { IDataForAnalysis } from 'infra/cloud/adapters/protocols/messagingAdapterInterface';

export interface IMessagingHelper {
  sendInvoiceToQueue(message: IDataForAnalysis): Promise<void>;
  consumesAnalysisResult(): Promise<string>;
}
