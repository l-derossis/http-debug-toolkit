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
  private readonly clearEndpoint: string = this.baseEndpoint + '/clear';

  constructor(private http: HttpClient) {}

  registerEndpoint(endpoint: Endpoint): Observable<Endpoint> {
    return this.http.post<Endpoint>(this.baseEndpoint, endpoint);
  }

  registerEndpoints(endpoints: Endpoint[]): Observable<any> {
    return this.http.post(this.importEndpoint, endpoints);
  }

  getEndpoints(): Observable<Endpoint[]> {
    return this.http
      .get<Endpoint[]>(this.baseEndpoint)
      .pipe(map((array) => this.convertApiEndpoints(array)));
  }

  updateEndpoint(endpoint: Endpoint): Observable<any> {
    if (!endpoint.location)
      throw new Error('Endpoint must have a location to be updated');

    return this.http.put(endpoint.location, endpoint);
  }

  exportEndpointsRaw(): Observable<Blob> {
    return this.http.get(this.baseEndpoint, {
      responseType: 'blob',
    });
  }

  clearEndpoints(): Observable<string> {
    return this.http.post(this.clearEndpoint, {}, { responseType: 'text' });
  }

  convertApiEndpoint(apiEndpoint: Endpoint): Endpoint {
    const endpoint = new Endpoint(
      apiEndpoint.route,
      apiEndpoint.method,
      apiEndpoint.statusCode,
      apiEndpoint.body,
      apiEndpoint.headers
    );

    endpoint.location = apiEndpoint.location;

    return endpoint;
  }

  convertApiEndpoints(apiEndpoints: any[]): Endpoint[] {
    return apiEndpoints.map(this.convertApiEndpoint);
  }
}
