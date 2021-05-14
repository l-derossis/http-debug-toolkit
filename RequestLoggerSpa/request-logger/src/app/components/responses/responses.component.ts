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
import { delay, first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-responses',
  templateUrl: './responses.component.html',
  styleUrls: ['./responses.component.scss'],
})
export class ResponsesComponent implements OnInit {
  responses: MockedResponse[] = [];
  selectedResponse: MockedResponse | undefined;
  routeQueryParam: string = '';
  @ViewChild('responsesList') list: MatSelectionList | undefined;

  private _drawer: MatSidenav | undefined;
  @ViewChild('drawer') set drawer(drawer: MatSidenav | undefined) {
    this._drawer = drawer;
    if (this._drawer && this.routeQueryParam) {
      setTimeout(() => {
        // setTimeout needed to avoid modifying the view while it's rendering
        this.openDetailsDrawer(this.routeQueryParam);
      });
    }
  }

  constructor(
    private responsesService: ResponsesApiService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRoutes();

    this.route.queryParams.subscribe((p) => {
      this.routeQueryParam = p.route;
      this.openDetailsDrawer(this.routeQueryParam);
    });
  }

  responseSelected(
    _: MatSelectionListChange,
    options: SelectionModel<MatListOption>
  ) {
    this.router.navigate([], {
      queryParams: {
        route: options.selected[0]?.value.Route,
      },
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

      if (
        this.routeQueryParam &&
        this.responses.some((r) => r.Route == this.routeQueryParam)
      ) {
        this.openDetailsDrawer(this.routeQueryParam);
      }
    });
  }

  openDetailsDrawer(route: string) {
    const response = this.responses?.find((r) => r.Route == route);
    if (response) {
      this.selectedResponse = response;
      this._drawer?.open();
      this._drawer?.closedStart.pipe(first()).subscribe((_) => {
        this.list?.selectedOptions.selected[0]?.toggle();
        this.clearRouteParam();
      });
    }
  }

  clearRouteParam() {
    let params = { ...this.route.snapshot.queryParams };
    delete params.route;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
    });
  }
}
