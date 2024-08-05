export interface HttpResponse {
  statusCode: number;
  body: any;
}

export interface HttpRequest {
  body?: any;
  file?: any;
  params?: any;
  user?: any;
}
