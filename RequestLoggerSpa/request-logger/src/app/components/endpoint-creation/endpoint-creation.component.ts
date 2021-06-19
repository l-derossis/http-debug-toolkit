import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { finalize } from 'rxjs/operators';

import { EndpointsApiService as EndpointsApiService } from 'src/app/services/endpoints-api.service';
import { EndpointForm } from 'src/app/utils/forms/endpoint-form';

@Component({
  selector: 'app-endpoint-creation',
  templateUrl: './endpoint-creation.component.html',
  styleUrls: ['./endpoint-creation.component.scss'],
})
export class EndpointCreationComponent {
  requestForm: EndpointForm = new EndpointForm().addStatusCodeControl();

  @Output() routeCreatedEvent = new EventEmitter();
  @ViewChild('submitButton') submitButton!: MatButton;

  constructor(private endpointsService: EndpointsApiService) {}

  submit(): void {
    this.submitButton.disabled = true;

    const endpoint = this.requestForm.asModel();

    this.endpointsService
      .registerEndpoint(endpoint)
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
}

export function urlValidator(urlRegex: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = urlRegex.test(control.value);
    return valid ? null : { invalidUrl: { value: control.value } };
  };
}
