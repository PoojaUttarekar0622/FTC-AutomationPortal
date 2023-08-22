import { Component } from '@angular/core';
import { SignalRService } from "./_services/signal-r.service";
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AutomationPortal';

  constructor(public sinR: SignalRService){ }

  ngOnInit(){
    this.sinR.startConnection();
  }

  ngOnDestroy(): void {
    this.sinR.disconnect();
  }
}
