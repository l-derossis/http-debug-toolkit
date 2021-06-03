import { Component, Input, OnInit } from '@angular/core';
import { MockedResponse } from 'src/app/models/mocked-response';

@Component({
  selector: 'app-mocked-response-details',
  templateUrl: './mocked-response-details.component.html',
  styleUrls: ['./mocked-response-details.component.scss'],
})
export class MockedResponseDetailsComponent implements OnInit {
  @Input() response: MockedResponse | undefined = undefined;

  get displayHeaders(): boolean {
    return this.response?.headers
      ? Object.keys(this.response?.headers).length > 0
      : false;
  }

  constructor() {}

  ngOnInit(): void {}
}
