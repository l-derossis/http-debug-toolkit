import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatListOption,
  MatSelectionList,
  MatSelectionListChange,
} from '@angular/material/list';
import { MockedResponse } from 'src/app/models/mocked-response';
import { ResponsesApiService } from 'src/app/services/responses-api.service';
import { MatDialog } from '@angular/material/dialog';
import { ResponseCreationComponent } from '../response-creation/response-creation.component';
import { MatSidenav } from '@angular/material/sidenav';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-responses',
  templateUrl: './responses.component.html',
  styleUrls: ['./responses.component.scss'],
})
export class ResponsesComponent implements OnInit {
  responses: MockedResponse[] = [];
  selectedResponse: MockedResponse | undefined;
  @ViewChild('drawer') drawer!: MatSidenav;
  @ViewChild('responsesList') list!: MatSelectionList;

  constructor(
    private responsesService: ResponsesApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadRoutes();
  }

  ngAfterViewInit(): void {}

  responseSelected(
    _: MatSelectionListChange,
    options: SelectionModel<MatListOption>
  ) {
    this.selectedResponse = options.selected[0]?.value;
    this.drawer?.open();
    this.drawer.closedStart.pipe(first()).subscribe((_) => {
      console.log('test');
      this.list.selectedOptions.selected[0]?.toggle();
    });
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
