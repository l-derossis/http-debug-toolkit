import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestLoggerComponent } from './components/request-logger/request-logger.component';
import { EndpointsComponent } from './components/endpoints/endpoints.component';

const routes: Routes = [
  { path: 'log', component: RequestLoggerComponent },
  { path: 'endpoints', component: EndpointsComponent },
  { path: '', redirectTo: '/endpoints', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
