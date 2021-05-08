import { Component, OnInit } from '@angular/core';
import { SignalRService } from 'src/app/services/signal-r.service';

@Component({
  selector: 'app-request-logger',
  templateUrl: './request-logger.component.html',
  styleUrls: ['./request-logger.component.scss'],
})
export class RequestLoggerComponent implements OnInit {
  requests: String[] = [];

  constructor(private signalrService: SignalRService) {}

  ngOnInit(): void {
    this.signalrService.startConnection();
    this.signalrService.addRequestsListener((req) => this.requests.push(req));
  }
}
