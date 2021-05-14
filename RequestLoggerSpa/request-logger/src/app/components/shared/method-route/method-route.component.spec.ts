import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodRouteComponent } from './method-route.component';

describe('ActionRouteComponent', () => {
  let component: MethodRouteComponent;
  let fixture: ComponentFixture<MethodRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MethodRouteComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
