export class MockedResponse {
  constructor(
    route: string,
    method: string,
    statusCode: number,
    body: string | undefined = undefined,
    headers: any | undefined = undefined
  ) {
    if (!route || !method || !statusCode) {
      throw new Error('Route, method and status code must be provided');
    }
    this.route = route;
    this.method = method;
    this.statusCode = statusCode;
    this.body = body;
    this.headers = headers;
  }

  route: string = '';

  method: string = '';

  headers: any = {};

  body: string | undefined;

  statusCode: number = 200;

  addHeader(key: string, value: string) {
    this.headers[key] = value;
  }
}
