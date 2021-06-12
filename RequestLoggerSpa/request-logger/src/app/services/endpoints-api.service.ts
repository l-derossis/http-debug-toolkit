import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Endpoint } from '../models/endpoint';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EndpointsApiService {
  private readonly baseEndpoint: string =
    environment.apiUrl + '/api/configuration/endpoints';
  private readonly importEndpoint: string = this.baseEndpoint + '/import';

  constructor(private http: HttpClient) {}

  registerEndpoint(endpoint: Endpoint): Observable<any> {
    return this.http.post(this.baseEndpoint, endpoint);
  }

  registerEndpoints(endpoints: Endpoint[]): Observable<any> {
    return this.http.post(this.importEndpoint, endpoints);
  }

  getEndpoints(): Observable<Endpoint[]> {
    return this.http
      .get<any[]>(this.baseEndpoint)
      .pipe(map((array) => this.convertApiEndpoints(array)));
  }

  exportEndpointsRaw(): Observable<Blob> {
    return this.http.get(this.baseEndpoint, {
      responseType: 'blob',
    });
  }

  convertApiEndpoint(apiEndpoint: any): Endpoint {
    return new Endpoint(
      apiEndpoint.route,
      apiEndpoint.method,
      apiEndpoint.statusCode,
      apiEndpoint.body,
      apiEndpoint.headers
    );
  }

  convertApiEndpoints(apiEndpoints: any[]): Endpoint[] {
    return apiEndpoints.map(this.convertApiEndpoint);
  }
}
