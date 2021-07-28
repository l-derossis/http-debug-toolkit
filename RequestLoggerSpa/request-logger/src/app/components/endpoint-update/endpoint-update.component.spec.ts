import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EndpointsApiService } from 'src/app/services/endpoints-api.service';

import { EndpointUpdateComponent } from './endpoint-update.component';

describe('EndpointUpdateComponent', () => {
  let component: EndpointUpdateComponent;
  let fixture: ComponentFixture<EndpointUpdateComponent>;
  const serviceStub: Partial<EndpointsApiService> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EndpointUpdateComponent],
      providers: [{ provide: EndpointsApiService, useValue: serviceStub }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EndpointUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
