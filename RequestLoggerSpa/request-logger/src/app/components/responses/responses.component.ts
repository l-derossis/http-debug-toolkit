import { Component, OnInit, ViewChild } from '@angular/core';
import { MockedResponse } from 'src/app/models/mocked-response';
import { ResponsesApiService } from 'src/app/services/responses-api.service';
import { MatDialog } from '@angular/material/dialog';
import { ResponseCreationComponent } from '../response-creation/response-creation.component';
import { MatSidenav } from '@angular/material/sidenav';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponsesImportComponent } from '../responses-import/responses-import.component';

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

    this.route.queryParams.subscribe(() => {
      this.openDetailsDrawerIfRequired();
    });
  }

  responseSelected(index: number): void {
    this.router.navigate([], {
      queryParams: {
        route: this.responses[index].route,
        method: this.responses[index].method,
      },
    });
  }

  openRouteCreationPopup(): void {
    const dialogRef = this.dialog.open(ResponseCreationComponent);
    dialogRef.componentInstance.routeCreatedEvent.subscribe(() => {
      dialogRef.close();
      this.loadRoutes();
    });
  }

  openResponsesImportPopup(): void {
    const dialogRef = this.dialog.open(ResponsesImportComponent);
    dialogRef.componentInstance.done.subscribe(() => {
      dialogRef.close();
      this.loadRoutes();
    });
  }

  loadRoutes(): void {
    this.responsesService.getResponses().subscribe((r) => {
      this.responses = r;

      const response = this.getResponseFromQueryParams();

      if (response) {
        this.openDetailsDrawerIfRequired();
      }
    });
  }

  openDetailsDrawerIfRequired(): void {
    const response = this.getResponseFromQueryParams();

    if (response) {
      this.selectedResponse = response;
      this._drawer?.open();
      this._drawer?.closedStart.pipe(first()).subscribe(() => {
        this.clearRouteMethodParams();
      });
    }
  }

  getResponseFromQueryParams(): MockedResponse | undefined {
    const route: string = this.route.snapshot.queryParams.route;
    const method: string = this.route.snapshot.queryParams.method;

    if (!route || !method) return undefined;

    return this.responses?.find(
      (r) =>
        r.route.toLowerCase() == route.toLowerCase() &&
        r.method.toLowerCase() == method.toLowerCase()
    );
  }

  clearRouteMethodParams(): void {
    const params = { ...this.route.snapshot.queryParams };
    delete params.route;
    delete params.method;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
    });
  }

  exportRoutes(): void {
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
