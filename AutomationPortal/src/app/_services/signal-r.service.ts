import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private connection;

  constructor(private restService: RestService,) {

  }

  public startConnection() {
    this.connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(this.restService.baseSingleRUrl + 'notify')
      .build();
    this.connection.start().then(function () {
      console.log('SignalR Connected!');
    }).catch(function (err) {
      return console.error(err.toString());
    });
  }

  public getMessage(next) {
    this.connection.on('BroadcastMessage', (message) => {
      next(message);
    });
  }

  public disconnect() {
    this.connection.stop();
  }
}
