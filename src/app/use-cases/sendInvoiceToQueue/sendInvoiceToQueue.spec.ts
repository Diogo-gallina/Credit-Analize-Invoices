import { IDataForAnalysis, IMessagingAdapter } from '@infra/cloud/adapters/protocols/messagingAdapterInterface';
import { IMessagingHelper } from '@infra/cloud/lib/protocols/messagingHelperInterface';
import { MessagingAdapter } from '@infra/cloud/adapters/messaging/messagingAdapter';
import { SendInvoiceToQueueUseCase } from './sendInvoiceToQueue';

const makeFakeMessage = (): IDataForAnalysis => ({
  invoice: {
    id: 'anyInvoiceId',
    userId: 'anyUserId',
    issuerName: 'anyIssuerName',
    document: 'anyDocument',
    paymentDate: new Date('2022-03-01'),
    paymentAmount: 200,
    createdAt: new Date('2022-01-01'),
  },
  user: {
    id: 'anyUserId',
    name: 'anyUserName',
    document: 'anyUserDocument',
    email: 'anyUserEmail',
    createdAt: new Date('2022-01-01'),
  },
});

const makeMessagingHelper = (): IMessagingHelper => ({
  // eslint-disable-next-line no-void
  sendMessageToQueue: jest.fn().mockResolvedValue(void 0),
  consumesMessage: jest.fn().mockResolvedValue([]),
});

interface SutTypes {
  messagingAdapterStub: IMessagingAdapter;
  sut: SendInvoiceToQueueUseCase;
}

const makeSut = (): SutTypes => {
  const messagingHelperStub = makeMessagingHelper();
  const messagingAdapterStub = new MessagingAdapter(messagingHelperStub);
  const sut = new SendInvoiceToQueueUseCase(messagingAdapterStub);
  return {
    messagingAdapterStub,
    sut,
  };
};

describe('Send Invoice To Queue Use Case', () => {
  it('should call sendInvoiceToQueue method with correct params', async () => {
    const { sut, messagingAdapterStub } = makeSut();
    const sendInvoiceToQueueSpy = jest.spyOn(messagingAdapterStub, 'sendInvoiceToQueue');
    const queueName = 'invoice-data-extracted.fifo';
    const messageGroupId = 'invoice-group';
    const message = makeFakeMessage();
    await sut.execute(message);
    expect(sendInvoiceToQueueSpy).toHaveBeenCalledWith(message, queueName, messageGroupId);
  });
});
