import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { Endpoint } from 'src/app/models/endpoint';
import { EndpointsApiService } from 'src/app/services/endpoints-api.service';

import { EndpointsImportComponent } from './endpoints-import.component';

describe('EndpointsImportComponent', () => {
  let component: EndpointsImportComponent;
  let fixture: ComponentFixture<EndpointsImportComponent>;

  let registerEndpointsSuccessful = true;

  const serviceStub: Partial<EndpointsApiService> = {
    registerEndpoints: (): Observable<any> => {
      return registerEndpointsSuccessful
        ? of({ message: 'Import successful', errors: [] })
        : of({
            message: 'Error(s) occured during the import',
            errors: [
              {
                route: '/route1',
                method: 'GET',
                message: 'Operation already declared',
              },
              {
                route: '/route2',
                method: 'GET',
                message: 'Operation already declared',
              },
            ],
          });
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EndpointsImportComponent],
      providers: [{ provide: EndpointsApiService, useValue: serviceStub }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EndpointsImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // STEP 1 - File import

  it('should not parse an invalid file', () => {
    const file = new File([''], 'endpoints.json');
    component.files.push(file);
    const stepEvent = new StepperSelectionEvent();
    stepEvent.selectedIndex = 1;

    component.onStepChange(stepEvent);

    expect(component.fileIsValid).toBeFalse();
  });

  it('should parse a valid file', async () => {
    const file = new File([buildEndpointsFileContent(3)], 'endpoints.json');
    component.files.push(file);

    component.fileLoading$.subscribe((loading) => {
      expect(component.fileIsValid).toBe(!loading);
      if (!loading) {
        fixture.detectChanges();
        const routes = fixture.debugElement.queryAll(
          By.css('app-method-route')
        );
        expect(routes.length).toBe(3);
        expect(component.endpoints?.length).toBe(3);
      }
    });

    component.parseFile();
  });

  // STEP 2 - Input validation

  it('should display an error on invalid input', () => {
    component.fileIsValid = false;

    fixture.detectChanges();
    const errorLabel = fixture.debugElement.query(By.css('#errorLabel'));

    expect(errorLabel).toBeDefined();
  });

  // STEP 3 - Endpoints upload

  it('should display the upload result message', async () => {
    registerEndpointsSuccessful = true;
    component.endpoints = buildEndpoints(2);

    component.endpointsUploading$.subscribe((loading) => {
      if (!loading) {
        fixture.detectChanges();
        const uploadMessage = fixture.debugElement.query(
          By.css('#uploadMessage')
        );

        expect(uploadMessage).toBeTruthy();
        expect(uploadMessage.nativeElement.innerText).toBe('Import successful');
      }
    });

    component.uploadEndpoints();
  });

  it('should display the upload result errors', async () => {
    registerEndpointsSuccessful = false;
    component.endpoints = buildEndpoints(2);

    component.endpointsUploading$.subscribe((loading) => {
      if (!loading) {
        fixture.detectChanges();
        const errors = fixture.debugElement.queryAll(By.css('.error'));

        expect(errors.length).toBe(2);
      }
    });

    component.uploadEndpoints();
  });

  function buildEndpointsFileContent(count: number): string {
    return JSON.stringify(buildEndpoints(count));
  }

  function buildEndpoints(count: number): Endpoint[] {
    const endpoints: Endpoint[] = [];

    for (let i = 0; i < count; ++i) {
      endpoints.push(new Endpoint(`/route${i}`, 'GET', 200));
    }

    return endpoints;
  }
});
