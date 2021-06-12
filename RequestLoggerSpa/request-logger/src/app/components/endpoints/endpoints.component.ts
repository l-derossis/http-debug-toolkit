import { Component, OnInit, ViewChild } from '@angular/core';
import { Endpoint } from 'src/app/models/endpoint';
import { EndpointsApiService } from 'src/app/services/endpoints-api.service';
import { MatDialog } from '@angular/material/dialog';
import { EndpointCreationComponent } from '../endpoint-creation/endpoint-creation.component';
import { MatSidenav } from '@angular/material/sidenav';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { EndpointsImportComponent } from '../endpoints-import/endpoints-import.component';

@Component({
  selector: 'app-endpoints',
  templateUrl: './endpoints.component.html',
  styleUrls: ['./endpoints.component.scss'],
})
export class EndpointsComponent implements OnInit {
  endpoints: Endpoint[] = [];
  selectedEndpoint: Endpoint | undefined;

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
    private endpointsService: EndpointsApiService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEndpoints();

    this.route.queryParams.subscribe(() => {
      this.openDetailsDrawerIfRequired();
    });
  }

  endpointSelected(index: number): void {
    this.router.navigate([], {
      queryParams: {
        route: this.endpoints[index].route,
        method: this.endpoints[index].method,
      },
    });
  }

  openRouteCreationPopup(): void {
    const dialogRef = this.dialog.open(EndpointCreationComponent);
    dialogRef.componentInstance.routeCreatedEvent.subscribe(() => {
      dialogRef.close();
      this.loadEndpoints();
    });
  }

  openEndpointsImportPopup(): void {
    const dialogRef = this.dialog.open(EndpointsImportComponent);
    dialogRef.componentInstance.done.subscribe(() => {
      dialogRef.close();
      this.loadEndpoints();
    });
  }

  loadEndpoints(): void {
    this.endpointsService.getEndpoints().subscribe((r) => {
      this.endpoints = r;

      const endpoint = this.getEndpointFromQueryParams();

      if (endpoint) {
        this.openDetailsDrawerIfRequired();
      }
    });
  }

  openDetailsDrawerIfRequired(): void {
    const endpoint = this.getEndpointFromQueryParams();

    if (endpoint) {
      this.selectedEndpoint = endpoint;
      this._drawer?.open();
      this._drawer?.closedStart.pipe(first()).subscribe(() => {
        this.clearRouteMethodParams();
      });
    }
  }

  getEndpointFromQueryParams(): Endpoint | undefined {
    const route: string = this.route.snapshot.queryParams.route;
    const method: string = this.route.snapshot.queryParams.method;

    if (!route || !method) return undefined;

    return this.endpoints?.find(
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

  exportEndpoints(): void {
    this.endpointsService.exportEndpointsRaw().subscribe((blob) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = 'endpoints.json';
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }
}
