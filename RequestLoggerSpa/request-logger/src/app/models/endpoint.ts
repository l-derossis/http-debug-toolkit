export class Endpoint {
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

  route = '';

  method = '';

  headers: any = {};

  body: string | undefined;

  statusCode = 200;

  addHeader(key: string, value: string): void {
    this.headers[key] = value;
  }
}
