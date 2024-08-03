export class InternalServerError extends Error {
  constructor(message: string) {
    super(`InternalServerError: ${message}`);
    this.name = 'InternalServerError';
  }
}
