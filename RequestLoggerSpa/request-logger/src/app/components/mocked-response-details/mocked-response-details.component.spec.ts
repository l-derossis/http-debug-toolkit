import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockedResponseDetailsComponent } from './mocked-response-details.component';

describe('MockedResponseDetailsComponent', () => {
  let component: MockedResponseDetailsComponent;
  let fixture: ComponentFixture<MockedResponseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockedResponseDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockedResponseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
