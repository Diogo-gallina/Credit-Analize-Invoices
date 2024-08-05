import { InternalServerError } from '@app/errors';
import { HttpResponse } from '@presentation/protocols';

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
});

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
});

export const internalServerError = (message: string): HttpResponse => ({
  statusCode: 500,
  body: new InternalServerError(`Internal Server Error: ${message}`),
});
