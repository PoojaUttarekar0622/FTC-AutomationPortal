import { Component, OnInit } from '@angular/core';
import { ResponseData } from "../../../_models/response-data";
import { SnqService } from "../../../_services/snq.service";
import { SessionService } from "../../../_services/session.service";
import { LoaderService } from "../../../_services/loader.service";
import { SignalRService } from "../../../_services/signal-r.service";
@Component({
  selector: 'app-inprocess',
  templateUrl: './inprocess.component.html',
  styleUrls: ['./inprocess.component.scss']
})
export class InprocessComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;

  jsonInprocess: any = [];
  jsonInprocess1: any = [];
  request :object={};
  tokenid: string;

  constructor(
    public snq: SnqService,
    private sinR: SignalRService,
    private sessionService: SessionService,
    public loaderService: LoaderService
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

  setStatusData() {
    this.loaderService.startLoading();
    this.snq.getStatusSummary(3)
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
  GetStatusCountSNQ() {
    this.request = {
      "FromDate":"",
        "ToDate":"",
        "token": this.sessionService.getToken()
        }
    this.snq.getStatusCountSNQ(this.request)
      .pipe()
      .subscribe(
        data => {
          this.jsonInprocess1 = data;
        },
        error => {
        });
  }

  onActivate(event) {
    this.activeRow = event.row;
  }

}
