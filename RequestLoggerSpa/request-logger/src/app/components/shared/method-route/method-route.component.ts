import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-method-route',
  templateUrl: './method-route.component.html',
  styleUrls: ['./method-route.component.scss'],
})
export class MethodRouteComponent implements OnInit {
  @Input() route: string = '';
  @Input() action: string = '';

  constructor() {}

  ngOnInit(): void {}
}
