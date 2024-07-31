export class ParseDataError extends Error {
  constructor(paramName: string) {
    super(`Parse data error: ${paramName}`);
    this.name = 'ParseDataError';
  }
}
