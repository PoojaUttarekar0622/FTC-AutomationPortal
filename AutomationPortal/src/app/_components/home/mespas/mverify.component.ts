import { Component, OnInit } from '@angular/core';
import { ResponseData } from "../../../_models/response-data";
import { MespasService } from "../../../_services/mespas.service";
import { SessionService } from "../../../_services/session.service";
import { LoaderService } from "../../../_services/loader.service";
import { SignalRService } from "../../../_services/signal-r.service";
import * as moment from 'moment';
import swal from "sweetalert2";

@Component({
  selector: 'app-mverify',
  templateUrl: './mverify.component.html',
  styleUrls: ['./mverify.component.scss']
})
export class MverifyComponent implements OnInit {

  jsonStatus: any = [];
  request: object = {};
  JsonObj: any;
  FromDate: string = '';
  ToDate: string = '';
  customername: string;
  showdetails: any;
  isValue: number = 1;
  isValueSecond: number = 0
  showMainContent: boolean = true;
  jsonHeader: any = [];
  userName: string;
  today: string;
  actionDate: string = '';
  constructor(
    private mespas: MespasService,
    private sinR: SignalRService,
    private sessionService: SessionService,
    private loaderService: LoaderService) {
  }

  ngOnInit(): void {
    this.today = moment().toString();
    this.today = moment(this.today).format("YYYY-MM-DD");
    this.actionDate = this.today;
    this.request = {
      "FromDate": this.today,
      "ToDate": "",
      "sourceType": ""
    }
    this.setGroupFliter(this.request);
    this.sinR.getMessage(
      (message) => {
        this.setGroupFliter(this.request);
      });
  }

  btn_action(status) {
    let jsonpass = { 'pK_MESPASENQUIRY_HDR_ID': status.pK_MESPASENQUIRY_HDR_ID}
    this.JsonObj = jsonpass;
    this.showdetails = true;
    this.showMainContent = false;
  }

  showbtnBackContent(event) {
    this.showMainContent = true;
    this.showdetails = false;
    this.setGroupFliter(this.request);
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
    this.mespas.mespasNotstarted(this.request)
      .pipe()
      .subscribe(
        data => {
          this.loaderService.stopLoading();
          this.jsonStatus = data;
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
        "FromDate": "",
        "ToDate": "",
        "sourceType": "",
        "CustNameShipNameRefNo": this.customername
      }
      this.setGroupFliter(this.request)
    }

  }
}