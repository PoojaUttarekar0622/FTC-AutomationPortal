import { Component, OnInit } from '@angular/core';
import { ResponseData } from "../../../_models/response-data";
import { SnqService } from "../../../_services/snq.service";
import { SessionService } from "../../../_services/session.service";
import * as moment from 'moment';
import { LoaderService } from "../../../_services/loader.service";
import { SignalRService } from "../../../_services/signal-r.service";
@Component({
  selector: 'app-msdcompleted',
  templateUrl: './msdcompleted.component.html',
  styleUrls: ['./msdcompleted.component.scss']
})
export class MsdcompletedComponent implements OnInit {
  jsonComplete: any = [];
  jsonStatus1: any = [];
  request: object = {};
  FromDate: string = '';
  ToDate: string = '';
  customername: string;
  JsonObj: any;
  jsonSourceType: any = [];
  showdetails: any;
  isValue: number = 1;
  isValueSecond: number = 0
  showMainContent: boolean = true;
  jsonHeader: any = [];
  userName: string;
  today: string;
  actionDate: string = '';

  constructor(public snq: SnqService,
    public loaderService: LoaderService,
    private sinR: SignalRService,
    private sessionService: SessionService) {

  }

  ngOnInit(): void {
    this.GetStatusCountSNQ();
    this.today = moment().toString();
    this.today = moment(this.today).format("YYYY-MM-DD");
    this.actionDate = this.today;
    this.request = {
      "FromDate": this.today,
      "ToDate": "",
      "sourceType": ""
    }
    this.setGroupFliter(this.request);
    //this.setStatusData();
    this.sinR.getMessage(
      (message) => {
        //this.setStatusData();
        this.setGroupFliter(this.request);
      }
    );

  }

  setStatusData() {
    this.loaderService.startLoading();
    this.snq.getMSDStatusSummary(4)
      .subscribe((responseData: ResponseData) => {
        this.loaderService.stopLoading();
        this.jsonComplete = responseData;
      },
        err => {
          this.loaderService.stopLoading();
          console.log(err);
        })
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

  btnGroupFilter(num) {
    this.isValue = num;
    var date = new Date();
    if (num == 1) {
      this.actionDate = this.today;
      this.request = {
        "FromDate": this.today,
        "ToDate": this.today,
        "sourceType": ""
      }
      this.setGroupFliter(this.request);
    } else if (num == 2) {
      var monthfirstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      this.actionDate = moment(monthfirstDay).format("YYYY-MM-DD");
      this.request = {
        "FromDate": this.actionDate,
        "ToDate": this.today,
        "sourceType": ""
      }
      this.setGroupFliter(this.request);
    } else if (num == 3) {
      var quarter = Math.floor((date.getMonth() / 3));
      var QutfirstDate = new Date(date.getFullYear(), quarter * 3, 1);
      this.actionDate = moment(QutfirstDate).format("YYYY-MM-DD")
      this.request = {
        "FromDate": this.actionDate,
        "ToDate": moment(this.today).format("YYYY-MM-DD"),
        "sourceType": ""
      }
      this.setGroupFliter(this.request);
    } else if (num == 4) {
      var yearfirstDay = new Date(date.getFullYear(), 0, 1);
      this.actionDate = moment(yearfirstDay).format("YYYY-MM-DD")
      this.request = {
        "FromDate": this.actionDate,
        "ToDate": moment(this.today).format("YYYY-MM-DD"),
        "sourceType": ""
      }
      this.setGroupFliter(this.request)
    }
  }

  setGroupFliter(request) {
    this.loaderService.startLoading();
    this.snq.msdcompletedtaskEnquiryList(this.request)
      .pipe()
      .subscribe(
        data => {
          this.loaderService.stopLoading();
          this.jsonComplete = data;
        },
        error => {
          this.loaderService.stopLoading();
        });
  }

  btnSearch() {
    if (this.FromDate != "" && this.ToDate != "") {
      this.request = {
        "FromDate": moment(this.FromDate).format("YYYY-MM-DD"),
        "ToDate": moment(this.ToDate).format("YYYY-MM-DD"),
        "sourceType": "",
        "CustNameShipNameRefNo": this.customername
      }
      this.setGroupFliter(this.request)
    }
    else {
      this.request = {
        "FromDate": this.actionDate,
        "ToDate": this.today,
        "CustNameShipNameRefNo": this.customername,
        "sourceType": ""
      }
      this.setGroupFliter(this.request)
    }

  }

  btnGroupFilterSecond(num) {
    this.isValueSecond = num;
    if (num == 1) {
      if (this.FromDate != "" && this.ToDate != "") {
        this.request = {
          "FromDate": moment(this.FromDate).format("YYYY-MM-DD"),
          "ToDate": moment(this.ToDate).format("YYYY-MM-DD"),
          "CustNameShipNameRefNo": this.customername,
          "sourceType": "RPABOT"
        }
        this.setGroupFliter(this.request)
      }
      else {
        this.request = {
          "FromDate": this.actionDate,
          "ToDate": this.today,
          "CustNameShipNameRefNo": this.customername,
          "sourceType": "RPABOT"
        }
        this.setGroupFliter(this.request)
      }
    } else {
      if (this.FromDate != "" && this.ToDate != "") {
        this.request = {
          "FromDate": moment(this.FromDate).format("YYYY-MM-DD"),
          "ToDate": moment(this.ToDate).format("YYYY-MM-DD"),
          "CustNameShipNameRefNo": this.customername,
          "sourceType": "MESPAS"
        }
        this.setGroupFliter(this.request)
      }
      else {
        this.request = {
          "FromDate": this.actionDate,
          "ToDate": this.today,
          "CustNameShipNameRefNo": this.customername,
          "sourceType": "MESPAS"
        }
        this.setGroupFliter(this.request)
      }
    }
  }

}
