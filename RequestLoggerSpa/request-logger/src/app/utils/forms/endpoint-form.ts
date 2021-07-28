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
  public static readonly headersControlName = 'headers';
  public static readonly bodyControlName = 'body';
  public static readonly statusCodeControlName = 'statusCode';
  public static readonly routeControlName = 'route';
  public static readonly methodControlName = 'method';

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
    return this.get(EndpointForm.headersControlName) as FormArray;
  }

  set headers(headers: Map<string, string>) {
    if (!this.headersControl) {
      this.addHeadersControl();
    }

    while (this.headersControl.length !== 0) {
      this.headersControl.removeAt(0);
    }
    for (const entry of headers.entries()) {
      this.addHeader(entry[0], entry[1]);
    }
    this.addHeader(); // Add an empty one at the end to provide an input to the user
  }

  set body(body: string) {
    this.get(EndpointForm.bodyControlName)?.setValue(body);
  }

  set statusCode(statusCode: number) {
    this.get(EndpointForm.statusCodeControlName)?.setValue(statusCode);
  }

  addStatusCodeControl(): EndpointForm {
    if (!this.contains(EndpointForm.statusCodeControlName)) {
      this.addControl(
        EndpointForm.statusCodeControlName,
        new FormControl('200', [Validators.required])
      );
    }

    return this;
  }

  addHeadersControl(): EndpointForm {
    if (!this.contains(EndpointForm.headersControlName)) {
      this.addControl(
        EndpointForm.headersControlName,
        new FormArray([this.createHeader()])
      );
    }

    return this;
  }

  addBodyControl(): EndpointForm {
    if (!this.contains(EndpointForm.bodyControlName)) {
      this.addControl(EndpointForm.bodyControlName, new FormControl());
    }

    return this;
  }

  addHeader(
    key: string | undefined = undefined,
    value: string | undefined = undefined
  ): void {
    if (!this.headersControl) {
      this.addHeadersControl();
    }

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
    if (this.contains(EndpointForm.headersControlName)) {
      this.removeControl(EndpointForm.headersControlName);
      this.addHeadersControl();
    }

    if (this.contains(EndpointForm.bodyControlName)) {
      this.removeControl(EndpointForm.bodyControlName);
      this.addBodyControl();
    }

    if (this.contains(EndpointForm.statusCodeControlName)) {
      this.removeControl(EndpointForm.statusCodeControlName);
      this.addStatusCodeControl();
    }

    this.get(EndpointForm.routeControlName)?.setValue('/');
    this.get(EndpointForm.methodControlName)?.setValue('GET');
  }

  asModel(): Endpoint {
    const route = this.get(EndpointForm.routeControlName)?.value;
    const method = this.get(EndpointForm.methodControlName)?.value;
    const statusCode = this.get(EndpointForm.statusCodeControlName)?.value;
    const body = this.get(EndpointForm.bodyControlName)?.value;

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
