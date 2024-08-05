export interface IMessagingHelper {
  sendMessageToQueue<T>(message: T, queueName: string, messageGroupId: string): Promise<void>;
  consumesMessage<T>(queueName: string): Promise<T[]>;
}
