import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndpointResponseFormComponent } from './endpoint-response-form.component';

describe('EndpointResponseFormComponent', () => {
  let component: EndpointResponseFormComponent;
  let fixture: ComponentFixture<EndpointResponseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EndpointResponseFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EndpointResponseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
