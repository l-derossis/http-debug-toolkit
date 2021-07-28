export class Endpoint {
  constructor(
    route: string,
    method: string,
    statusCode: number,
    body: string | undefined = undefined,
    headers: any | undefined = {}
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

  body: string | undefined;

  statusCode;

  location: string | undefined;

  headers: any;

  get headersMap(): Map<string, string> {
    const map = new Map<string, string>();

    for (const [key, value] of Object.entries(this.headers)) {
      map.set(key, value as string);
    }

    return map;
  }

  addHeader(key: string, value: string): void {
    this.headers[key] = value;
  }

  clone(): Endpoint {
    const headers: any = {};

    Object.assign(headers, this.headers);

    const clone = new Endpoint(
      this.route,
      this.method,
      this.statusCode,
      this.body,
      headers
    );

    clone.location = this.location;

    return clone;
  }
}
