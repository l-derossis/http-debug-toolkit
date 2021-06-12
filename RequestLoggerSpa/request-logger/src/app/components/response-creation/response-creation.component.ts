import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import {
  FormArray,
  FormGroup,
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { finalize } from 'rxjs/operators';
import { Endpoint } from 'src/app/models/endpoint';

import { EndpointsApiService as EndpointsApiService } from 'src/app/services/endpoints-api.service';

@Component({
  selector: 'app-response-creation',
  templateUrl: './response-creation.component.html',
  styleUrls: ['./response-creation.component.scss'],
})
export class ResponseCreationComponent {
  requestForm: FormGroup = this.formBuilder.group({
    route: this.formBuilder.control('/', [
      Validators.required,
      urlValidator(/^[-a-zA-Z0-9@:%_+.~#?&=]*$/i),
    ]),
    method: ['GET', [Validators.required]],
    body: [],
    statusCode: ['200', [Validators.required]],
    headers: this.formBuilder.array([this.createHeader()]),
  });

  headers = this.requestForm.get('headers') as FormArray;

  @Output() routeCreatedEvent = new EventEmitter();
  @ViewChild('submitButton') submitButton!: MatButton;

  constructor(
    private endpointsService: EndpointsApiService,
    private formBuilder: FormBuilder
  ) {}

  submit(): void {
    this.submitButton.disabled = true;

    const response = this.getModelFromForm();

    this.endpointsService
      .registerEndpoint(response)
      .pipe(finalize(() => (this.submitButton.disabled = false)))
      .subscribe(
        () => {
          this.routeCreatedEvent.emit();
        },
        (error) => this.handleRouteCreationError(error)
      );
  }

  handleRouteCreationError(error: HttpErrorResponse): void {
    if (error.status == 409) {
      this.requestForm.get('route')?.setErrors({ duplicate: true });
    }
  }

  getModelFromForm(): Endpoint {
    const response = new Endpoint(
      this.requestForm.get('route')?.value,
      this.requestForm.get('method')?.value,
      this.requestForm.get('statusCode')?.value,
      this.requestForm.get('body')?.value,
      {}
    );

    this.headers.controls.forEach((header) => {
      const key = header.get('key')?.value;
      const value = header.get('value')?.value;
      if (key && value) {
        response.addHeader(key, value);
      }
    });

    return response;
  }

  createHeader(): FormGroup {
    return this.formBuilder.group({
      key: '',
      value: '',
    });
  }

  addHeader(): void {
    this.headers.push(this.createHeader());
  }

  deleteHeader(i: number): void {
    this.headers.removeAt(i);
  }

  onHeaderInput(index: number): void {
    // We want to add a new line when the user starts typing something in the last header field
    // in order to avoid having to add an 'add' button
    if (
      index == this.headers.length - 1 &&
      (this.headers.at(index).get('key')?.value.length == 1 ||
        this.headers.at(index).get('value')?.value.length == 1)
    ) {
      this.addHeader();
    }
  }
}

export function urlValidator(urlRegex: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = urlRegex.test(control.value);
    return valid ? null : { invalidUrl: { value: control.value } };
  };
}
