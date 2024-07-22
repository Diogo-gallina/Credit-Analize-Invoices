import { IMessagingHelper } from 'infra/cloud/aws/protocols/messagingHelperInterface';
import { IDataForAnalysis, IMessagingAdapter } from '../protocols/messagingAdapterInterface';

const SEND_QUEUE_NAME = 'invoice-data-extracted.fifo';
const MESSAGE_GROUP_ID = 'invoiceGroup';

export class MessagingAdapter implements IMessagingAdapter {
  constructor(private readonly messagingHelper: IMessagingHelper) {
    this.messagingHelper = messagingHelper;
  }
  sendInvoiceToQueue(message: IDataForAnalysis): Promise<void> {
    return this.messagingHelper.sendMessageToQueue(message, SEND_QUEUE_NAME, MESSAGE_GROUP_ID);
  }
  consumesAnalysisResult(): Promise<string> {
    return this.messagingHelper.consumesMessage();
  }
}
