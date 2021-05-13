import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatListOption, MatSelectionListChange } from '@angular/material/list';
import { MockedResponse } from 'src/app/models/mocked-response';
import { ResponsesApiService } from 'src/app/services/responses-api.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ResponseCreationComponent } from '../response-creation/response-creation.component';

@Component({
  selector: 'app-responses',
  templateUrl: './responses.component.html',
  styleUrls: ['./responses.component.scss'],
})
export class ResponsesComponent implements OnInit {
  responses: MockedResponse[] = [];

  selectedResponse: MockedResponse | undefined;

  constructor(
    private responsesService: ResponsesApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadRoutes();
  }

  responseSelected(
    _: MatSelectionListChange,
    options: SelectionModel<MatListOption>
  ) {
    this.selectedResponse = options.selected[0]?.value;
  }

  openRouteCreationPopup(): void {
    const dialogRef = this.dialog.open(ResponseCreationComponent);
    dialogRef.componentInstance.routeCreatedEvent.subscribe((_) => {
      dialogRef.close();
      this.loadRoutes();
    });
  }

  loadRoutes() {
    this.responsesService.getResponses().subscribe((r) => {
      this.responses = r;
    });
  }
}
