import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestLoggerComponent } from './components/request-logger/request-logger.component';
import { ResponsesComponent } from './components/responses/responses.component';

const routes: Routes = [
  { path: 'log', component: RequestLoggerComponent },
  { path: 'responses', component: ResponsesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
