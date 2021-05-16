import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelectionList } from '@angular/material/list';
import { MockedResponse } from 'src/app/models/mocked-response';
import { ResponsesApiService } from 'src/app/services/responses-api.service';
import { MatDialog } from '@angular/material/dialog';
import { ResponseCreationComponent } from '../response-creation/response-creation.component';
import { MatSidenav } from '@angular/material/sidenav';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-responses',
  templateUrl: './responses.component.html',
  styleUrls: ['./responses.component.scss'],
})
export class ResponsesComponent implements OnInit {
  responses: MockedResponse[] = [];
  selectedResponse: MockedResponse | undefined;

  private _drawer: MatSidenav | undefined;
  @ViewChild('drawer') set drawer(drawer: MatSidenav | undefined) {
    this._drawer = drawer;
    if (this._drawer) {
      setTimeout(() => {
        // setTimeout needed to avoid modifying the view while it's rendering
        this.openDetailsDrawerIfRequired();
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
      this.openDetailsDrawerIfRequired();
    });
  }

  responseSelected(index: number) {
    this.router.navigate([], {
      queryParams: {
        route: this.responses[index].Route,
        method: this.responses[index].Method,
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

      const response = this.getResponseFromQueryParams();

      if (response) {
        this.openDetailsDrawerIfRequired();
      }
    });
  }

  openDetailsDrawerIfRequired() {
    const response = this.getResponseFromQueryParams();

    if (response) {
      this.selectedResponse = response;
      this._drawer?.open();
      this._drawer?.closedStart.pipe(first()).subscribe((_) => {
        this.clearRouteMethodParams();
      });
    }
  }

  getResponseFromQueryParams(): MockedResponse | undefined {
    const route: string = this.route.snapshot.queryParams.route;
    const method: string = this.route.snapshot.queryParams.method;

    if (!route || !method) return undefined;

    const response = this.responses?.find(
      (r) =>
        r.Route.toLowerCase() == route.toLowerCase() &&
        r.Method.toLowerCase() == method.toLowerCase()
    );

    return response;
  }

  clearRouteMethodParams() {
    let params = { ...this.route.snapshot.queryParams };
    delete params.route;
    delete params.method;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
    });
  }

  exportRoutes() {
    this.responsesService.exportResponsesRaw().subscribe((blob) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = 'responses.json';
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }
}
