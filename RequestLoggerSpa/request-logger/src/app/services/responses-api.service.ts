import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MockedResponse } from '../models/mocked-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResponsesApiService {
  private readonly apiEndpoint: string;

  constructor(private http: HttpClient) {
    this.apiEndpoint = environment.apiUrl + '/api/configuration/responses';
  }

  registerResponse(response: MockedResponse): Observable<any> {
    return this.http.post(this.apiEndpoint, response);
  }
}
