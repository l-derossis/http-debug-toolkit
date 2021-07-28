import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MethodRouteComponent } from './components/shared/method-route/method-route.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { NgxDropzoneModule } from 'ngx-dropzone';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RequestLoggerComponent } from './components/request-logger/request-logger.component';
import { EndpointsComponent } from './components/endpoints/endpoints.component';
import { EndpointCreationComponent } from './components/endpoint-creation/endpoint-creation.component';
import { EndpointsImportComponent } from './components/endpoints-import/endpoints-import.component';
import { EndpointUpdateComponent } from './components/endpoint-update/endpoint-update.component';
import { EndpointResponseFormComponent } from './components/endpoint-response-form/endpoint-response-form.component';

@NgModule({
  declarations: [
    AppComponent,
    RequestLoggerComponent,
    EndpointsComponent,
    EndpointCreationComponent,
    MethodRouteComponent,
    EndpointsImportComponent,
    EndpointUpdateComponent,
    EndpointResponseFormComponent,
  ],
  imports: [
    HttpClientModule,
    FlexLayoutModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    MatToolbarModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    MatSnackBarModule,
    MatListModule,
    MatDialogModule,
    MatSidenavModule,
    MatStepperModule,
    MatProgressSpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
