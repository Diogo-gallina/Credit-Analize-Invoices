export class FailedSendMessageError extends Error {
  constructor(message: string) {
    super(`Failed Send Message: ${message}`);
    this.name = 'FailedSendMessageError';
  }
}
