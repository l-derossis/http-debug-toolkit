import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestLoggerComponent } from './request-logger.component';

describe('RequestLoggerComponent', () => {
  let component: RequestLoggerComponent;
  let fixture: ComponentFixture<RequestLoggerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestLoggerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestLoggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
