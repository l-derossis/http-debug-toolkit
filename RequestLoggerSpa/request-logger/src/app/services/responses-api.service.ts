import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MockedResponse } from '../models/mocked-response';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ResponsesApiService {
  private readonly apiEndpoint: string;

  constructor(private http: HttpClient, private router: Router) {
    this.apiEndpoint = environment.apiUrl + '/api/configuration/responses';
  }

  registerResponse(response: MockedResponse): Observable<any> {
    return this.http.post(this.apiEndpoint, response);
  }

  getResponses(): Observable<MockedResponse[]> {
    return this.http.get<any[]>(this.apiEndpoint).pipe(
      map((array) =>
        array.map((r) => {
          let response = new MockedResponse();
          response.Body = r.body;
          response.Route = r.route;
          response.StatusCode = r.statusCode;
          response.Headers = r.headers;
          response.Method = r.method;
          return response;
        })
      )
    );
  }

  exportResponsesRaw(): Observable<Blob> {
    return this.http.get(this.apiEndpoint, {
      responseType: 'blob',
    });
  }
}
