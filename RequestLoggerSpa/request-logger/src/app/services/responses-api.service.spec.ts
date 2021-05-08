import { TestBed } from '@angular/core/testing';

import { ResponsesApiService } from './responses-api.service';

describe('ResponsesApiService', () => {
  let service: ResponsesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResponsesApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
