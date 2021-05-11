import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatListOption, MatSelectionListChange } from '@angular/material/list';
import { MockedResponse } from 'src/app/models/mocked-response';
import { ResponsesApiService } from 'src/app/services/responses-api.service';

@Component({
  selector: 'app-responses',
  templateUrl: './responses.component.html',
  styleUrls: ['./responses.component.scss'],
})
export class ResponsesComponent implements OnInit {
  responses: MockedResponse[] = [];

  selectedResponse: MockedResponse | undefined;

  constructor(private responsesService: ResponsesApiService) {}

  ngOnInit(): void {
    this.responsesService.getResponses().subscribe((r) => {
      this.responses = r;
    });
  }

  responseSelected(
    _: MatSelectionListChange,
    options: SelectionModel<MatListOption>
  ) {
    this.selectedResponse = options.selected[0]?.value;
  }
}
