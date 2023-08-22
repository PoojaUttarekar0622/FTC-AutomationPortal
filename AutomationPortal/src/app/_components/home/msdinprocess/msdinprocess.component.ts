import { Component, OnInit } from '@angular/core';
import { ResponseData } from "../../../_models/response-data";
import { SnqService } from "../../../_services/snq.service";
import { SessionService } from "../../../_services/session.service";
import { LoaderService } from "../../../_services/loader.service";
import { SignalRService } from "../../../_services/signal-r.service";
@Component({
  selector: 'app-msdinprocess',
  templateUrl: './msdinprocess.component.html',
  styleUrls: ['./msdinprocess.component.scss']
})
export class MsdinprocessComponent implements OnInit {

  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  jsonInprocess: any = [];
  
  jsonStatus1: any = [];
  request: object = {};
  tokenid: string;
  FromDate: string = '';
  ToDate: string = '';

  constructor(
    public snq: SnqService,
    private sinR: SignalRService,
    private sessionService: SessionService,
    public loaderService: LoaderService,
  ) { }

  ngOnInit(): void {
    this.setStatusData();
    this.sinR.getMessage(
      (message) => {
        this.setStatusData();
      }
    ); 
    this.GetStatusCountSNQ();
  }

  GetStatusCountSNQ() {
    this.request = {
      "FromDate": "",
      "ToDate": "",
      "token": this.sessionService.getToken()
    }
    this.snq.getStatusCountMSD(this.request)
      .pipe()
      .subscribe(
        data => {
          this.jsonStatus1 = data;
        },
        error => {
        });
  }

  setStatusData() {
    this.loaderService.startLoading();
    this.snq.getMSDStatusSummary(3)
      .subscribe((responseData: ResponseData) => {
        this.loaderService.stopLoading();
        this.jsonInprocess = responseData;
        this.temp = this.jsonInprocess.map((prop, key) => {
          return {
            ...prop,
            id: key
          };
        });
      },
        err => {
          this.loaderService.stopLoading();
          console.log(err);
        })
  }

  onActivate(event) {
    this.activeRow = event.row;
  }

}

