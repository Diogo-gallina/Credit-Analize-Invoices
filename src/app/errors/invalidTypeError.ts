export class InvalidTypeError extends Error {
  constructor(message: string) {
    super(`Invalid type: ${message}`);
    this.name = 'InvalidTypeError';
  }
}
