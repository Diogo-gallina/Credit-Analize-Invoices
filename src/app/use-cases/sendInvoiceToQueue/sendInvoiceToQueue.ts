import { IDataForAnalysis, IMessagingAdapter } from '@infra/cloud/adapters/protocols/messagingAdapterInterface';

const SEND_QUEUE_NAME = 'invoice-data-extracted.fifo';
const MESSAGE_GROUP_ID = 'invoiceGroup';

export class SendInvoiceToQueueUseCase {
  constructor(private readonly messagingAdapter: IMessagingAdapter) {
    this.messagingAdapter = messagingAdapter;
  }

  async execute(message: IDataForAnalysis) {
    await this.messagingAdapter.sendInvoiceToQueue(message, SEND_QUEUE_NAME, MESSAGE_GROUP_ID);
  }
}
