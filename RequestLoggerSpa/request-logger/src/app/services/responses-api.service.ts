import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Endpoint } from '../models/endpoint';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ResponsesApiService {
  private readonly baseEndpoint: string =
    environment.apiUrl + '/api/configuration/endpoints';
  private readonly importEndpoint: string = this.baseEndpoint + '/import';

  constructor(private http: HttpClient) {}

  registerResponse(response: Endpoint): Observable<any> {
    return this.http.post(this.baseEndpoint, response);
  }

  registerResponses(responses: Endpoint[]): Observable<any> {
    return this.http.post(this.importEndpoint, responses);
  }

  getResponses(): Observable<Endpoint[]> {
    return this.http
      .get<any[]>(this.baseEndpoint)
      .pipe(map((array) => this.convertApiResponses(array)));
  }

  exportResponsesRaw(): Observable<Blob> {
    return this.http.get(this.baseEndpoint, {
      responseType: 'blob',
    });
  }

  convertApiResponse(apiResponse: any): Endpoint {
    return new Endpoint(
      apiResponse.route,
      apiResponse.method,
      apiResponse.statusCode,
      apiResponse.body,
      apiResponse.headers
    );
  }

  convertApiResponses(apiResponses: any[]): Endpoint[] {
    return apiResponses.map(this.convertApiResponse);
  }
}
