import dotenv from 'dotenv';
import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SendMessageCommand,
  SendMessageCommandInput,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { Consumer } from 'sqs-consumer';
import { awsConfig } from '../../config/awsConfig';
import { IMessagingHelper } from '../../../protocols/messagingHelperInterface';
import { FailedSendMessageError } from '../../errors/FailedSendMessageError';

dotenv.config();

const client = new SQSClient(awsConfig);

export const sqsHelper: IMessagingHelper = {
  async sendMessageToQueue<T>(message: T, queueName: string, messageGroupId: string): Promise<void> {
    try {
      const queueUrl = getQueueUrl(queueName);
      const params = createSendMessageParams(message, queueUrl, messageGroupId);
      await sendMessage(params);
      console.log('Message sent to SQS queue:', queueName);
    } catch (error) {
      handleSendMessageError(error);
    }
  },

  async consumesMessage<T>(queueName: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const queueUrl = `https://sqs.${awsConfig.region}.amazonaws.com/339712871292/${queueName}`;
      const messages: T[] = [];

      const consumer = Consumer.create({
        queueUrl,
        handleMessage: async (message) => {
          if (message.Body) {
            const parsedMessage: T = JSON.parse(message.Body);
            messages.push(parsedMessage);
          }
        },
        sqs: client,
      });

      consumer.on('error', (err) => {
        console.error('Error receiving or processing messages:', err);
        reject(err);
      });

      consumer.on('processing_error', (err) => {
        console.error('Processing error:', err);
        reject(err);
      });

      consumer.on('stopped', () => {
        console.log('Consumer stopped, resolving with processed messages');
        resolve(messages);
      });

      consumer.start();
    });
  },
};

function getQueueUrl(queueName: string): string {
  return `https://sqs.${awsConfig.region}.amazonaws.com/339712871292/${queueName}`;
}

function createSendMessageParams<T>(message: T, queueUrl: string, messageGroupId: string): SendMessageCommandInput {
  return {
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(message),
    MessageGroupId: messageGroupId,
    MessageDeduplicationId: `message-duplication-${Date.now()}`,
  };
}

async function sendMessage(params: SendMessageCommandInput) {
  const command = new SendMessageCommand(params);
  await client.send(command);
}

function handleSendMessageError(error: any) {
  console.error('Error sending message to SQS queue:', error);
  throw new FailedSendMessageError(`Error sending message to SQS queue: ${error}`);
}

async function receiveMessages(queueUrl: string) {
  const params = {
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 10,
    VisibilityTimeout: 15,
    WaitTimeSeconds: 10,
  };
  const receiveCommand = new ReceiveMessageCommand(params);
  const { Messages } = await client.send(receiveCommand);
  return Messages ?? [];
}

async function processMessages<T>(messages: any[], queueUrl: string): Promise<T[]> {
  if (messages.length === 0) {
    console.log('No messages to process.');
    return [];
  }

  const processedMessages: T[] = [];
  for (const message of messages) {
    if (message.Body) {
      const parsedMessage: T = JSON.parse(message.Body);
      await deleteMessage(queueUrl, message.ReceiptHandle);
      processedMessages.push(parsedMessage);
    }
  }
  return processedMessages;
}

async function deleteMessage(queueUrl: string, receiptHandle: string) {
  const deleteParams = {
    QueueUrl: queueUrl,
    ReceiptHandle: receiptHandle,
  };
  const deleteCommand = new DeleteMessageCommand(deleteParams);
  await client.send(deleteCommand);
}
