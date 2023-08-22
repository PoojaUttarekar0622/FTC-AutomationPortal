import { Component, OnInit } from '@angular/core';
import { ResponseData } from "../../../_models/response-data";
import { SnqService } from "../../../_services/snq.service";
import { SessionService } from "../../../_services/session.service";
import { LoaderService } from "../../../_services/loader.service";
import { SignalRService } from "../../../_services/signal-r.service";
import * as moment from 'moment';
import swal from "sweetalert2";

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {
  jsonStatus: any = [];
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
  constructor(
    private snq: SnqService,
    private sinR: SignalRService,
    private sessionService: SessionService,
    private loaderService: LoaderService) {
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
        this.setGroupFliter(this.request);
        //this.setStatusData();
      }
    );
   
  }

  setPKStatusData(pkId, status) {
    this.snq.getOwnerShipAction(pkId)
      .subscribe((responseData: ResponseData) => {
        this.jsonHeader = responseData;
        let userOwner = this.jsonHeader.userName;
        this.userName = this.sessionService.getCurrentUserName();
        if (this.jsonHeader.action == "YES") {
          if (this.userName == this.jsonHeader.userName) {

          } else {
            swal.fire("Ownership taken by " + userOwner + " !");
          }
          let jsonpass = { 'PK_SNQENQUIRY_HDR_ID': status.pK_SNQENQUIRY_HDR_ID, "Ownership": 1, 'action': "YES", 'userName': status.userName }
          this.JsonObj = jsonpass;
          this.showdetails = true;
          this.showMainContent = false;
        } else {
          swal.fire({
            title: 'Take Owner Ship',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel'
          }).then((result) => {
            if (result.value) {
              let jsonpass = { 'PK_SNQENQUIRY_HDR_ID': status.pK_SNQENQUIRY_HDR_ID, "Ownership": 1, 'action': "YES", 'userName': status.userName }
              this.JsonObj = jsonpass;
              this.updateOwnership(jsonpass);
            } else if (result.dismiss === swal.DismissReason.cancel) {
              this.showdetails = false;
              this.showMainContent = true;
            }
          })
        }
      },
        err => {
          console.log(err);
        })
  }

  btn_action(status) {
    this.setPKStatusData(status.pK_SNQENQUIRY_HDR_ID, status);
  }

  updateOwnership(jsonpass) {
    this.loaderService.startLoading();
    try {
      this.snq.snqUpdateOwnerShip(JSON.stringify(jsonpass))
        .subscribe((responseData: ResponseData) => {
          this.showdetails = true;
          this.showMainContent = false;
          this.loaderService.stopLoading();
        },
          err => {
            this.loaderService.stopLoading();
            console.log(err);
          })
    }
    catch (error) {

    }
  }

  showbtnBackContent(event) {
    this.showMainContent = true;
    this.showdetails = false;
    //this.setStatusData();
    this.setGroupFliter(this.request);
  }

  setStatusData() {
    this.loaderService.startLoading();
    this.snq.getStatusSummary(1)
      .subscribe((responseData: ResponseData) => {
        this.loaderService.stopLoading();
        this.jsonStatus = responseData;
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
    this.snq.getStatusCountSNQ(this.request)
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
    this.snq.snqverifytaskEnquiryList(this.request)
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