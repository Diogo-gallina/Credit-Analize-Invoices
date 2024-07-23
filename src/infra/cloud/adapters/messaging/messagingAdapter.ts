import { IMessagingHelper } from '@infra/cloud/aws/protocols/messagingHelperInterface';
import { IDataForAnalysis, IMessagingAdapter } from '@infra/cloud/adapters/protocols/messagingAdapterInterface';

export class MessagingAdapter implements IMessagingAdapter {
  constructor(private readonly messagingHelper: IMessagingHelper) {
    this.messagingHelper = messagingHelper;
  }
  sendInvoiceToQueue(message: IDataForAnalysis, queueName: string, messageGroupId: string): Promise<void> {
    return this.messagingHelper.sendMessageToQueue(message, queueName, messageGroupId);
  }
  consumesAnalysisResult(): Promise<string> {
    return this.messagingHelper.consumesMessage();
  }
}
