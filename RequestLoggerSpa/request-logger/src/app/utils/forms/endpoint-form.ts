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
  private readonly headersControlName = 'headers';
  private readonly bodyControlName = 'body';
  private readonly statusCodeControlName = 'statusCode';
  private readonly routeControlName = 'route';
  private readonly methodControlName = 'method';

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
    return this.get(this.headersControlName) as FormArray;
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
    this.get(this.bodyControlName)?.setValue(body);
  }

  set statusCode(statusCode: number) {
    this.get(this.statusCodeControlName)?.setValue(statusCode);
  }

  addStatusCodeControl(): EndpointForm {
    if (!this.contains(this.statusCodeControlName)) {
      this.addControl(
        this.statusCodeControlName,
        new FormControl('200', [Validators.required])
      );
    }

    return this;
  }

  addHeadersControl(): EndpointForm {
    if (!this.contains(this.headersControlName)) {
      this.addControl(
        this.headersControlName,
        new FormArray([this.createHeader()])
      );
    }

    return this;
  }

  addBodyControl(): EndpointForm {
    if (!this.contains(this.bodyControlName)) {
      this.addControl(this.bodyControlName, new FormControl());
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
    if (this.contains(this.headersControlName)) {
      this.removeControl(this.headersControlName);
      this.addHeadersControl();
    }

    if (this.contains(this.bodyControlName)) {
      this.removeControl(this.bodyControlName);
      this.addBodyControl();
    }

    if (this.contains(this.statusCodeControlName)) {
      this.removeControl(this.statusCodeControlName);
      this.addStatusCodeControl();
    }

    this.get(this.routeControlName)?.setValue('/');
    this.get(this.methodControlName)?.setValue('GET');
  }

  asModel(): Endpoint {
    const route = this.get(this.routeControlName)?.value;
    const method = this.get(this.methodControlName)?.value;
    const statusCode = this.get(this.statusCodeControlName)?.value;
    const body = this.get(this.bodyControlName)?.value;

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
