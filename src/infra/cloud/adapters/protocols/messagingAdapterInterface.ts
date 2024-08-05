import { InvoiceModel } from '@domain/models/invoice';
import { UserModel } from '@domain/models/user';
import { AnalyzedResultDto } from '@presentation/dtos/analyzedResultDto';

export interface IDataForAnalysis {
  invoice: InvoiceModel;
  user: UserModel;
}

export interface IMessagingAdapter {
  sendInvoiceToQueue(message: IDataForAnalysis, queueName: string, messageGroupId: string): Promise<void>;
  consumesAnalysisResult(queueName: string): Promise<AnalyzedResultDto[]>;
}
