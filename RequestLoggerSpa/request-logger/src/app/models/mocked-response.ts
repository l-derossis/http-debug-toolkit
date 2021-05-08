export class MockedResponse {
  Route: string = '';

  Method: string = '';

  Headers: any = {};

  Body: string = '';

  StatusCode: number = 200;

  addHeader(key: string, value: string) {
    this.Headers[key] = value;
  }
}
