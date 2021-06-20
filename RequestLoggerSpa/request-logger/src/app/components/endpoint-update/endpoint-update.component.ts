import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Endpoint } from 'src/app/models/endpoint';
import { EndpointsApiService } from 'src/app/services/endpoints-api.service';
import { EndpointForm } from 'src/app/utils/forms/endpoint-form';
import { EndpointResponseFormComponent } from '../endpoint-response-form/endpoint-response-form.component';

@Component({
  selector: 'app-endpoint-update',
  templateUrl: './endpoint-update.component.html',
  styleUrls: ['./endpoint-update.component.scss'],
})
export class EndpointUpdateComponent {
  @ViewChild(EndpointResponseFormComponent)
  responseForm!: EndpointResponseFormComponent;

  private _endpoint: Endpoint | undefined = undefined;

  @Input() set endpoint(value: Endpoint | undefined) {
    this.endpointForm.clear();
    this._endpoint = value?.clone();

    if (this._endpoint) {
      this.responseForm.body = this._endpoint.body ?? '';
      this.responseForm.headers = this._endpoint.headersMap;
      this.responseForm.statusCode = this._endpoint.statusCode;
    }
  }

  get endpoint(): Endpoint | undefined {
    return this._endpoint;
  }

  @Output() endpointUpdated = new EventEmitter();

  endpointForm: EndpointForm = new EndpointForm().addStatusCodeControl();

  updateResponse:
    | {
        message: string;
        successful: boolean;
      }
    | undefined = undefined;

  constructor(private apiService: EndpointsApiService) {}

  submit(): void {
    const endpoint = this.endpointForm.asModel();
    endpoint.location = this._endpoint?.location;

    this.apiService.updateEndpoint(endpoint).subscribe(
      () => {
        this.updateResponse = {
          message: 'Update successful',
          successful: true,
        };
      },
      (e) => {
        this.updateResponse = {
          message: e.error,
          successful: false,
        };
      }
    );
  }
}
