import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { Endpoint } from 'src/app/models/endpoint';
import { EndpointsApiService } from 'src/app/services/endpoints-api.service';

import { ResponsesImportComponent } from './responses-import.component';

describe('ResponsesImportComponent', () => {
  let component: ResponsesImportComponent;
  let fixture: ComponentFixture<ResponsesImportComponent>;

  let registerResponsesSuccessful = true;

  const serviceStub: Partial<EndpointsApiService> = {
    registerEndpoints: (): Observable<any> => {
      return registerResponsesSuccessful
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
      declarations: [ResponsesImportComponent],
      providers: [{ provide: EndpointsApiService, useValue: serviceStub }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsesImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // STEP 1 - File import

  it('should not parse an invalid file', () => {
    const file = new File([''], 'responses.json');
    component.files.push(file);
    const stepEvent = new StepperSelectionEvent();
    stepEvent.selectedIndex = 1;

    component.onStepChange(stepEvent);

    expect(component.fileIsValid).toBeFalse();
  });

  it('should parse a valid file', async () => {
    const file = new File([buildResponseFileContent(3)], 'responses.json');
    component.files.push(file);

    component.fileLoading$.subscribe((loading) => {
      expect(component.fileIsValid).toBe(!loading);
      if (!loading) {
        fixture.detectChanges();
        const routes = fixture.debugElement.queryAll(
          By.css('app-method-route')
        );
        expect(routes.length).toBe(3);
        expect(component.responses?.length).toBe(3);
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

  // STEP 3 - Responses upload

  it('should display the upload result message', async () => {
    registerResponsesSuccessful = true;
    component.responses = buildResponses(2);

    component.responsesUploading$.subscribe((loading) => {
      if (!loading) {
        fixture.detectChanges();
        const uploadMessage = fixture.debugElement.query(
          By.css('#uploadMessage')
        );

        expect(uploadMessage).toBeTruthy();
        expect(uploadMessage.nativeElement.innerText).toBe('Import successful');
      }
    });

    component.uploadResponses();
  });

  it('should display the upload result errors', async () => {
    registerResponsesSuccessful = false;
    component.responses = buildResponses(2);

    component.responsesUploading$.subscribe((loading) => {
      if (!loading) {
        fixture.detectChanges();
        const errors = fixture.debugElement.queryAll(By.css('.error'));

        expect(errors.length).toBe(2);
      }
    });

    component.uploadResponses();
  });

  function buildResponseFileContent(count: number): string {
    return JSON.stringify(buildResponses(count));
  }

  function buildResponses(count: number): Endpoint[] {
    const responses: Endpoint[] = [];

    for (let i = 0; i < count; ++i) {
      responses.push(new Endpoint(`/route${i}`, 'GET', 200));
    }

    return responses;
  }
});
