import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MockedResponse } from '../models/mocked-response';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ResponsesApiService {
  private readonly baseEndpoint: string =
    environment.apiUrl + '/api/configuration/responses';
  private readonly importEndpoint: string = this.baseEndpoint + '/import';

  constructor(private http: HttpClient) {}

  registerResponse(response: MockedResponse): Observable<any> {
    return this.http.post(this.baseEndpoint, response);
  }

  registerResponses(responses: MockedResponse[]): Observable<any> {
    return this.http.post(this.importEndpoint, responses);
  }

  getResponses(): Observable<MockedResponse[]> {
    return this.http
      .get<any[]>(this.baseEndpoint)
      .pipe(map((array) => this.convertApiResponses(array)));
  }

  exportResponsesRaw(): Observable<Blob> {
    return this.http.get(this.baseEndpoint, {
      responseType: 'blob',
    });
  }

  convertApiResponse(apiResponse: any): MockedResponse {
    return new MockedResponse(
      apiResponse.route,
      apiResponse.method,
      apiResponse.statusCode,
      apiResponse.body,
      apiResponse.headers
    );
  }

  convertApiResponses(apiResponses: any[]): MockedResponse[] {
    return apiResponses.map(this.convertApiResponse);
  }
}
