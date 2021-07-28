import { Component, Input } from '@angular/core';
import { EndpointForm } from 'src/app/utils/forms/endpoint-form';

@Component({
  selector: 'app-endpoint-response-form',
  templateUrl: './endpoint-response-form.component.html',
  styleUrls: ['./endpoint-response-form.component.scss'],
})
export class EndpointResponseFormComponent {
  private _requestForm: EndpointForm = new EndpointForm()
    .addHeadersControl()
    .addBodyControl()
    .addStatusCodeControl();

  get requestForm(): EndpointForm {
    return this._requestForm;
  }

  @Input() set requestForm(value: EndpointForm) {
    this._requestForm = value;
    this._requestForm
      ?.addHeadersControl()
      .addBodyControl()
      .addStatusCodeControl();
  }

  set body(body: string) {
    this._requestForm.body = body;
  }

  set headers(headers: Map<string, string>) {
    this._requestForm.headers = headers;
  }

  set statusCode(statusCode: number) {
    this._requestForm.statusCode = statusCode;
  }

  onHeaderInput(index: number): void {
    // We want to add a new line when the user starts typing something in the last header field
    // in order to avoid having to add an 'add' button
    if (
      index == this._requestForm.headersControl.length - 1 &&
      (this._requestForm.headersControl.at(index).get('key')?.value.length ==
        1 ||
        this._requestForm.headersControl.at(index).get('value')?.value.length ==
          1)
    ) {
      this._requestForm?.addHeader();
    }
  }
}
