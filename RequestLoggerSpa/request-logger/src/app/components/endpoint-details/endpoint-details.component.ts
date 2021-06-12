import { Component, Input } from '@angular/core';
import { Endpoint } from 'src/app/models/endpoint';

@Component({
  selector: 'app-endpoint-details',
  templateUrl: './endpoint-details.component.html',
  styleUrls: ['./endpoint-details.component.scss'],
})
export class EndpointDetailsComponent {
  @Input() endpoint: Endpoint | undefined = undefined;

  get displayHeaders(): boolean {
    return this.endpoint?.headers
      ? Object.keys(this.endpoint?.headers).length > 0
      : false;
  }
}
