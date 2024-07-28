import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SendMessageCommand,
  SendMessageCommandInput,
  SQSClient,
} from '@aws-sdk/client-sqs';
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

  async consumesMessage<T>(queueName: string): Promise<T[]> {
    const queueUrl = `https://sqs.${awsConfig.region}.amazonaws.com/339712871292/${queueName}`;
    const params = {
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 10,
      VisibilityTimeout: 15,
      WaitTimeSeconds: 10,
    };

    try {
      const receiveCommand = new ReceiveMessageCommand(params);
      const { Messages } = await client.send(receiveCommand);
      if (!Messages || Messages.length === 0) {
        console.log('No messages to process.');
        return [];
      }
      const processedMessages: T[] = Messages.map((message) => {
        const parsedMessage: T = JSON.parse(message.Body!);
        const deleteParams = {
          QueueUrl: queueUrl,
          ReceiptHandle: message.ReceiptHandle!,
        };
        const deleteCommand = new DeleteMessageCommand(deleteParams);
        client.send(deleteCommand);
        return parsedMessage;
      });

      return processedMessages;
    } catch (error) {
      console.error('Error receiving or deleting messages:', error);
      return [];
    }
  },
};
