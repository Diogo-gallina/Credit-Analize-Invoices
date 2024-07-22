export interface IMessagingHelper {
  sendMessageToQueue<T>(message: T, queueName: string, messageGroupId: string): Promise<void>;
  consumesMessage(): Promise<string>;
}
