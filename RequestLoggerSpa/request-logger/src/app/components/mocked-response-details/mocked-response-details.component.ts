import { Component, Input } from '@angular/core';
import { MockedResponse } from 'src/app/models/mocked-response';

@Component({
  selector: 'app-mocked-response-details',
  templateUrl: './mocked-response-details.component.html',
  styleUrls: ['./mocked-response-details.component.scss'],
})
export class MockedResponseDetailsComponent {
  @Input() response: MockedResponse | undefined = undefined;

  get displayHeaders(): boolean {
    return this.response?.headers
      ? Object.keys(this.response?.headers).length > 0
      : false;
  }
}
