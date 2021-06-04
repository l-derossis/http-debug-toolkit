import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private hubConnection: signalR.HubConnection | undefined;

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/requestsHub`)
      .build();
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch((err) => console.log('Error while starting connection: ' + err));
  };

  public addRequestsListener(callback: (request: string) => any) {
    if (!this.hubConnection) {
      throw Error('Hub is not initialized');
    }

    this.hubConnection.on('request', (request: string) => {
      callback(request);
    });
  }
}
