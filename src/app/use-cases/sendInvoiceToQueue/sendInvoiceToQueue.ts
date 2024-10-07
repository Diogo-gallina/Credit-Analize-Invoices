import { QUEUES } from '@app/utils/constants';
import { IDataForAnalysis, IMessagingAdapter } from '@infra/cloud/adapters/protocols/messagingAdapterInterface';

const MESSAGE_GROUP_ID = 'invoice-group';

export class SendInvoiceToQueueUseCase {
  constructor(private readonly messagingAdapter: IMessagingAdapter) {
    this.messagingAdapter = messagingAdapter;
  }

  async execute(message: IDataForAnalysis) {
    await this.messagingAdapter.sendInvoiceToQueue(message, QUEUES.INVOICE_DATA_EXTRACTED, MESSAGE_GROUP_ID);
  }
}
