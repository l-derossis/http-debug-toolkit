import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormGroup,
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UrlTree } from '@angular/router';
import { MockedResponse } from 'src/app/models/mocked-response';

import { ResponsesApiService } from 'src/app/services/responses-api.service';

@Component({
  selector: 'app-response-creation',
  templateUrl: './response-creation.component.html',
  styleUrls: ['./response-creation.component.scss'],
})
export class ResponseCreationComponent implements OnInit {
  requestForm: FormGroup = this.formBuilder.group({
    route: this.formBuilder.control('/', [
      Validators.required,
      urlValidator(/^\/[-a-zA-Z0-9@:%_+.~#?&=\/]*$/i),
    ]),
    method: ['GET', [Validators.required]],
    body: [],
    statusCode: ['200', [Validators.required]],
    headers: this.formBuilder.array([this.createHeader()]),
  });

  headers = this.requestForm.get('headers') as FormArray;

  constructor(
    private reponsesService: ResponsesApiService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  submit() {
    let response = this.getModelFromForm();

    console.log(response);

    this.reponsesService.registerResponse(response).subscribe(
      (obj) => {
        this.openSnackBar('Mocked response successfully created.');
      },
      (error) => console.error(error)
    );
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', { duration: 2000 });
  }

  getModelFromForm(): MockedResponse {
    let response = new MockedResponse();
    response.Method = this.requestForm.get('method')?.value;
    response.Route = this.requestForm.get('route')?.value;
    response.Body = this.requestForm.get('body')?.value;
    response.StatusCode = this.requestForm.get('statusCode')?.value;

    this.headers.controls.forEach((header) => {
      let key = header.get('key')?.value;
      let value = header.get('value')?.value;
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

  addHeader() {
    this.headers.push(this.createHeader());
  }

  deleteHeader(i: number) {
    this.headers.removeAt(i);
  }

  onHeaderInput(index: number) {
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
  return (control: AbstractControl): { [key: string]: any } | null => {
    const valid = urlRegex.test(control.value);
    return valid ? null : { invalidUrl: { value: control.value } };
  };
}
