import { IMessagingHelper } from 'infra/cloud/aws/protocols/messagingHelperInterface';
import { IDataForAnalysis, IMessagingAdapter } from '../protocols/messagingAdapterInterface';

export class MessagingAdapter implements IMessagingAdapter {
  constructor(private readonly messagingHelper: IMessagingHelper) {
    this.messagingHelper = messagingHelper;
  }
  sendInvoiceToQueue(message: IDataForAnalysis): Promise<void> {
    return this.messagingHelper.sendInvoiceToQueue(message);
  }
  consumesAnalysisResult(): Promise<string> {
    return this.messagingHelper.consumesAnalysisResult();
  }
}
