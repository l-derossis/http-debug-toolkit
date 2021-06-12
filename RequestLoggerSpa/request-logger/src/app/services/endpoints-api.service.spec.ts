import { TestBed } from '@angular/core/testing';

import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { HttpClient } from '@angular/common/http';

import { EndpointsApiService } from './endpoints-api.service';
import { Endpoint } from '../models/endpoint';

describe('EndpointsApiService', () => {
  let httpTestingController: HttpTestingController;

  let service: EndpointsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    // Inject the http service and test controller for each test
    TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(EndpointsApiService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a valid endpoint', () => {
    const endpoint = new Endpoint('/route', 'GET', 200, '', null);

    service.registerEndpoint(endpoint).subscribe(() => expect(true));

    const req = httpTestingController.expectOne(
      'https://localhost:5001/api/configuration/endpoints'
    );
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });

  it('should register valid endpoints', () => {
    const endpoints = [
      new Endpoint('/route1', 'GET', 200, '', null),
      new Endpoint('/route2', 'GET', 200, '', null),
    ];

    service.registerEndpoints(endpoints).subscribe(() => expect(true));

    const req = httpTestingController.expectOne(
      'https://localhost:5001/api/configuration/endpoints/import'
    );
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });

  it('should get all endpoints', () => {
    const endpoints = buildEndpoints(3);

    service.getEndpoints().subscribe((r: Endpoint[]) => {
      expect(r).toHaveSize(3);
    });

    const req = httpTestingController.expectOne(
      'https://localhost:5001/api/configuration/endpoints'
    );
    expect(req.request.method).toBe('GET');
    req.flush(endpoints);
  });
});

function buildEndpoints(count: number): any {
  const endpoints: any[] = [];

  for (let i = 0; i < count; ++i) {
    endpoints.push({
      route: `/route${i}`,
      method: 'GET',
      headers: [],
      body: 'content',
      statusCode: 200,
    });
  }

  return endpoints;
}
