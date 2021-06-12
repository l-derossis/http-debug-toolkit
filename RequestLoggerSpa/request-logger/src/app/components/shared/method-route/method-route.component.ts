import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-method-route',
  templateUrl: './method-route.component.html',
  styleUrls: ['./method-route.component.scss'],
})
export class MethodRouteComponent {
  @Input() Route = '';
  @Input() Method = '';
}
