import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseCreationComponent } from './response-creation.component';

describe('ResponseCreationComponent', () => {
  let component: ResponseCreationComponent;
  let fixture: ComponentFixture<ResponseCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResponseCreationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponseCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
