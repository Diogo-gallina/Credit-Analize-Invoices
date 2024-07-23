import { SendMessageCommand, SendMessageCommandInput, SQSClient } from '@aws-sdk/client-sqs';
import { awsConfig } from '../../config/awsConfig';
import { IMessagingHelper } from '../../protocols/messagingHelperInterface';
import { FailedSendMessageError } from '../../errors/FailedSendMessageError';

const client = new SQSClient(awsConfig);

export const sqsHelper: IMessagingHelper = {
  async sendMessageToQueue<T>(message: T, queueName: string, messageGroupId: string): Promise<void> {
    const params: SendMessageCommandInput = {
      QueueUrl: `https://sqs.${client.config.region}.amazonaws.com/339712871292/${queueName}`,
      MessageBody: JSON.stringify(message),
      MessageGroupId: messageGroupId,
      MessageDeduplicationId: `message-${Date.now()}`,
    };

    const command = new SendMessageCommand(params);

    try {
      await client.send(command);
      console.log('Message sent to SQS queue:', queueName);
    } catch (error) {
      throw new FailedSendMessageError(`Error sending message to SQS queue: ${error}`);
    }
  },

  consumesMessage(): Promise<string> {
    throw new Error('Function not implemented.');
  },
};
