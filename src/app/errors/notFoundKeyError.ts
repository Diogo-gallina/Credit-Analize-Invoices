export class NotFoundKeyError extends Error {
  constructor(keyName: string) {
    super(`Not found key: ${keyName}`);
    this.name = 'NotFoundKeyError';
  }
}
