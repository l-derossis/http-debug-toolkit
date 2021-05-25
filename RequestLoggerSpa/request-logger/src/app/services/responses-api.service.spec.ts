import { TestBed } from '@angular/core/testing';

import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { ResponsesApiService } from './responses-api.service';
import { MockedResponse } from '../models/mocked-response';

describe('ResponsesApiService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  let service: ResponsesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    // Inject the http service and test controller for each test
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ResponsesApiService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a valid mocked response', () => {
    const response = new MockedResponse('/route', 'GET', 200, '', null);

    service.registerResponse(response).subscribe((_) => expect(true));

    let req = httpTestingController.expectOne(
      'https://localhost:5001/api/configuration/responses'
    );
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });

  it('should register valid mocked responses', () => {
    const responses = [
      new MockedResponse('/route1', 'GET', 200, '', null),
      new MockedResponse('/route2', 'GET', 200, '', null),
    ];

    service.registerResponses(responses).subscribe((_) => expect(true));

    let req = httpTestingController.expectOne(
      'https://localhost:5001/api/configuration/responses/import'
    );
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });

  it('should get all responses', () => {
    const responses = buildResponses(3);

    service.getResponses().subscribe((r: MockedResponse[]) => {
      expect(r).toHaveSize(3);
    });

    let req = httpTestingController.expectOne(
      'https://localhost:5001/api/configuration/responses'
    );
    expect(req.request.method).toBe('GET');
    req.flush(responses);
  });
});

function buildResponses(count: number): any {
  let responses: any[] = [];

  for (let i = 0; i < count; ++i) {
    responses.push({
      route: `/route${i}`,
      method: 'GET',
      headers: [],
      body: 'content',
      statusCode: 200,
    });
  }

  return responses;
}
