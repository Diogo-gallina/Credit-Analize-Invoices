import { IMessagingHelper } from '@infra/cloud/lib/protocols/messagingHelperInterface';
import { IDataForAnalysis, IMessagingAdapter } from '@infra/cloud/adapters/protocols/messagingAdapterInterface';
import { AnalyzedResultDto } from '@presentation/dtos/analyzedResultDto';

export class MessagingAdapter implements IMessagingAdapter {
  constructor(private readonly messagingHelper: IMessagingHelper) {
    this.messagingHelper = messagingHelper;
  }
  async sendInvoiceToQueue(message: IDataForAnalysis, queueName: string, messageGroupId: string): Promise<void> {
    return this.messagingHelper.sendMessageToQueue(message, queueName, messageGroupId);
  }
  async consumesAnalysisResult(queueName: string): Promise<AnalyzedResultDto[]> {
    return this.messagingHelper.consumesMessage<AnalyzedResultDto>(queueName);
  }
}
