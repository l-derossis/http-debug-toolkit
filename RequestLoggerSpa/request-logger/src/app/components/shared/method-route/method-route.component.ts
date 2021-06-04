import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-method-route',
  templateUrl: './method-route.component.html',
  styleUrls: ['./method-route.component.scss'],
  host: {},
})
export class MethodRouteComponent {
  @Input() Route: string = '';
  @Input() Method: string = '';
}
