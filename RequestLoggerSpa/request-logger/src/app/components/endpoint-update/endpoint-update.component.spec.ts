import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndpointUpdateComponent } from './endpoint-update.component';

describe('EndpointUpdateComponent', () => {
  let component: EndpointUpdateComponent;
  let fixture: ComponentFixture<EndpointUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EndpointUpdateComponent ]
    })
    .compileComponents();
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
