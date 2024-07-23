import { InvoiceModel } from '@domain/models/invoice';
import { UserModel } from '@domain/models/user';

export interface IDataForAnalysis {
  invoice: InvoiceModel;
  user: UserModel;
}

export interface IMessagingAdapter {
  sendInvoiceToQueue(message: IDataForAnalysis, queueName: string, messageGroupId: string): Promise<void>;
  consumesAnalysisResult(): Promise<string>;
}
