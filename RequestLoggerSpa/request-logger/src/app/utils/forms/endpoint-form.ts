import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Endpoint } from 'src/app/models/endpoint';

export class EndpointForm extends FormGroup {
  constructor() {
    super({
      route: new FormControl('/', [
        Validators.required,
        urlValidator(/^\/[-a-zA-Z0-9@:%_+.~#?&=/]*$/i),
      ]),
      method: new FormControl('GET', [Validators.required]),
    });
  }

  get headersControl(): FormArray {
    return this.get('headers') as FormArray;
  }

  set headers(headers: Map<string, string>) {
    while (this.headersControl.length !== 0) {
      this.headersControl.removeAt(0);
    }
    for (const entry of headers.entries()) {
      this.addHeader(entry[0], entry[1]);
    }
    this.addHeader(); // Add an empty one at the end to provide an input to the user
  }

  set body(body: string) {
    this.get('body')?.setValue(body);
  }

  addStatusCodeControl(): EndpointForm {
    if (!this.contains('statusCode')) {
      this.addControl(
        'statusCode',
        new FormControl('200', [Validators.required])
      );
    }

    return this;
  }

  addHeadersControl(): EndpointForm {
    if (!this.contains('headers')) {
      this.addControl('headers', new FormArray([this.createHeader()]));
    }

    return this;
  }

  addBodyControl(): EndpointForm {
    if (!this.contains('body')) {
      this.addControl('body', new FormControl());
    }

    return this;
  }

  addHeader(
    key: string | undefined = undefined,
    value: string | undefined = undefined
  ): void {
    this.headersControl.push(this.createHeader(key, value));
  }

  deleteHeader(i: number): void {
    this.headersControl.removeAt(i);
  }

  private createHeader(
    key: string | undefined = undefined,
    value: string | undefined = undefined
  ): FormGroup {
    return new FormGroup({
      key: new FormControl(key),
      value: new FormControl(value),
    });
  }

  clear(): void {
    if (this.contains('headers')) {
      this.removeControl('headers');
      this.addHeadersControl();
    }

    if (this.contains('body')) {
      this.removeControl('body');
      this.addBodyControl();
    }

    if (this.contains('statusCode')) {
      this.removeControl('statusCode');
      this.addStatusCodeControl();
    }

    this.get('route')?.setValue('/');
    this.get('method')?.setValue('GET');
  }

  asModel(): Endpoint {
    const route = this.get('route')?.value;
    const method = this.get('method')?.value;
    const statusCode = this.get('statusCode')?.value;
    const body = this.get('body')?.value;

    const endpoint = new Endpoint(route, method, statusCode, body);

    this.headersControl.controls.forEach((header) => {
      const key = header.get('key')?.value;
      const value = header.get('value')?.value;
      if (key && value) {
        endpoint.addHeader(key, value);
      }
    });

    return endpoint;
  }
}

export function urlValidator(urlRegex: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = urlRegex.test(control.value);
    return valid ? null : { invalidUrl: { value: control.value } };
  };
}
