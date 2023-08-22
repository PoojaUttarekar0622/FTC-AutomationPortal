import { Component, OnInit, Input, EventEmitter, Output, TemplateRef } from '@angular/core';
import { ResponseData } from "../../../_models/response-data";
import { SnqService } from "../../../_services/snq.service";
import { SessionService } from "../../../_services/session.service";
import { LoaderService } from "../../../_services/loader.service";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: 'app-msdverifydtl',
  templateUrl: './msdverifydtl.component.html',
  styleUrls: ['./msdverifydtl.component.scss']
})
export class MsdverifydtlComponent implements OnInit {
  masterSelected: boolean = false;
  jsonHeader: any = [];
  jsonItem: any = [];
  hdrId: number;
  checkedList: any;
  deleteList: any;
  isShowingDetails = true;

  ZOOM_STEP: number = 0.25;
  DEFAULT_ZOOM: number = 1;
  public pdfSrc: string = '';
  public pdfZoom: number = this.DEFAULT_ZOOM;
  hdrleadTimeforitem = "";
  leadTimeperiod = "";

  @Input() jsonpass: any;
  showbtn: boolean = false;
  userName: string;
  jsonOwnerShip: any = [];
  @Output() routetoparentevent = new EventEmitter<string>();

  constructor(public snq: SnqService,
    public loaderService: LoaderService,
    private modalService: BsModalService,
    public toastr: ToastrService,
    private sessionService: SessionService) {
  }

  ngOnInit(): void {
    this.hdrId = this.jsonpass.PK_MSDENQUIRY_HDR_ID;
    this.userName = this.sessionService.getCurrentUserName();
    this.setStatusData(this.hdrId);
    this.masterSelected = true;
    this.getOwnerShip(this.hdrId)
  }

  getOwnerShip(hdrId) {
    this.loaderService.startLoading();
    this.snq.getMSDOwnerShipAction(hdrId)
      .subscribe((responseData: ResponseData) => {
        this.loaderService.stopLoading();
        this.jsonOwnerShip = responseData;
        if (this.userName != this.jsonOwnerShip.userName) {
          this.showbtn = false;
        } else {
          this.showbtn = true;
        }
      },
        err => {
          this.loaderService.stopLoading();
          console.log(err);
        })
  }

  viewPdf() {
    if (this.isShowingDetails == false) {
      this.isShowingDetails = true;
    }
    else {
      this.isShowingDetails = false;
    }

  }

  btnBack() {
    this.routetoparentevent.emit("Gotoback");
  }

  public zoomIn() {
    this.pdfZoom += this.ZOOM_STEP;
  }

  public zoomOut() {
    if (this.pdfZoom > this.DEFAULT_ZOOM) {
      this.pdfZoom -= this.ZOOM_STEP;
    }
  }

  public resetZoom() {
    this.pdfZoom = this.DEFAULT_ZOOM;
  }


  setStatusData(pkId) {
    this.loaderService.startLoading();
    this.snq.getMSDDetails(pkId)
      .subscribe((responseData: ResponseData) => {
        this.loaderService.stopLoading();
        this.jsonHeader = responseData;
        this.jsonItem = this.jsonHeader["itemDetails"]
      },
        err => {
          this.loaderService.stopLoading();
          console.log(err);
        })
  }

  addNewRow() {
    if (this.jsonItem == null) {
      this.jsonItem = [{
        "pK_MSDENQUIRY_DTL_ID": 0,
        "fkEnquiryid": this.hdrId,
        "partCode": "",
        "partName": "",
        "quantity": "",
        "unit": "",
        "price": "",
        "cost": "",
        "status": "",
        "errorCode": "",
        "accountNo": "",
        "seqNo": "",
        "seqNoText": null,
        "accountDescription": "",
        "leadTime": 0,
        "leadTimeperiod": "",
        "isSelected": true
      }];
    }
    else {
      this.jsonItem.push({
        "pK_MSDENQUIRY_DTL_ID": 0,
        "fkEnquiryid": this.hdrId,
        "partCode": "",
        "partName": "",
        "quantity": "",
        "unit": "",
        "price": "",
        "cost": "",
        "status": "",
        "errorCode": "",
        "accountNo": "",
        "seqNo": "",
        "seqNoText": null,
        "accountDescription": "",
        "leadTime": 0,
        "leadTimeperiod": "",
        "isSelected": true
      });
    }
  }

  DeleteRow() {
    this.deleteList = [];
    let confirmItem = [];
    if (confirm("Are you sure, you want to delete the item")) {
      for (var i = 0; i < this.jsonHeader.itemDetails.length; i++) {

        if (this.jsonHeader.itemDetails[i].isSelected == true) {
          this.deleteList.push({ "PK_MSDENQUIRY_DTL_ID": this.jsonHeader.itemDetails[i].pK_MSDENQUIRY_DTL_ID });
        } else {
          confirmItem.push(this.jsonHeader.itemDetails[i])
        }
      }
      this.jsonHeader.itemDetails = confirmItem;
      this.deleteList = JSON.stringify(this.deleteList);
      this.deleteSelectedRow();
    }
  }

  deleteSelectedRow() {
    try {
      this.loaderService.startLoading();
      this.snq.deleteMSDrow(this.deleteList)
        .subscribe((responseData: ResponseData) => {
          this.loaderService.stopLoading();
          this.setStatusData(this.hdrId)
        },
          err => {
            console.log(err);
          })
    }
    catch (error) {

    }
  }

  checkUncheckAll() {
    for (var i = 0; i < this.jsonHeader.itemDetails.length; i++) {
      this.jsonHeader.itemDetails[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  isAllSelected() {
    this.masterSelected = this.jsonHeader.itemDetails.every(function (item: any) {
      return item.isSelected == true;
    })
    this.getCheckedItemList();
  }

  getCheckedItemList() {
    this.checkedList = [];
    for (var i = 0; i < this.jsonHeader.itemDetails.length; i++) {
      if (this.jsonHeader.itemDetails[i].isSelected)
        this.checkedList.push(this.jsonHeader.itemDetails[i]);
    }
    this.checkedList = JSON.stringify(this.checkedList);
  }

  rejectdata() {
    this.jsonHeader["status"] = "8";
    let details: any[] = this.jsonHeader["itemDetails"];
    if (details) {
      details.forEach(function (item) {
        item["status"] = "8";
      });
    }

    try {
      this.loaderService.startLoading();
      this.snq.msdUpdateData(JSON.stringify(this.jsonHeader))
        .subscribe((responseData: ResponseData) => {
          this.loaderService.stopLoading();
          this.routetoparentevent.emit("Gotoback");
        },
          err => {
            console.log(err);
          })
    }
    catch (error) {

    }
  }

  notificationModal: BsModalRef;
  notification = {
    keyboard: true,
    class: "modal-dialog-bottom modal-success"
  };

  openNotificationModal(modalNotification: TemplateRef<any>) {
    this.notificationModal = this.modalService.show(
      modalNotification,
      this.notification
    );
  }

  btnUpdateData() {
    let valid = true;
    let detailsArray: any[] = this.jsonHeader["itemDetails"];
    if (this.jsonHeader.owner == "") {
      this.toastr.show(
        '<span data-notify="message">Please Enter Valid Owner Name !</span>',
        "", { toastClass: "ngx-toastr alert alert-dismissible alert-success alert-notify" }
      );
      valid = false;
    } else if (this.jsonHeader.enqrefNo == "") {
      this.toastr.show(
        '<span data-notify="message">Please Enter Valid Enquiry Ref Number !</span>',
        "", { toastClass: "ngx-toastr alert alert-dismissible alert-success alert-notify" }
      );
      valid = false;
    } else if (this.jsonHeader.maker == "") {
      this.toastr.show(
        '<span data-notify="message">Please Enter Valid Maker !</span>',
        "", { toastClass: "ngx-toastr alert alert-dismissible alert-success alert-notify" }
      );
      valid = false;
    }

    for (let i = 0; i < detailsArray.length; i++) {
      let seq = i + 1;
      if (detailsArray[i]['seqNo'] == "") {
        this.toastr.show(
          '<span data-notify="message">Serial Number Of ' + seq + ' row should not be blank.</span>',
          "", { toastClass: "ngx-toastr alert alert-dismissible alert-success alert-notify" }
        );
        valid = false;
        break;
      } else if (detailsArray[i]['seqNo'].length > 5) {
        this.toastr.show(
          '<span data-notify="message">Serial Number Of ' + seq + ' row should not be greater than 5 digits.</span>',
          "", { toastClass: "ngx-toastr alert alert-dismissible alert-success alert-notify" }
        );
        valid = false;
        break;
      } else if (detailsArray[i]['seqNoText'] != null) {
        if (detailsArray[i]['seqNoText'].length > 1) {
          this.toastr.show(
            '<span data-notify="message">SeqNoText Number Of ' + seq + ' row should not be greater than 1 Character.</span>',
            "", { toastClass: "ngx-toastr alert alert-dismissible alert-success alert-notify" }
          );
          valid = false;
          break;
        }
      } else if (detailsArray[i]['partName'] == "") {
        this.toastr.show(
          '<span data-notify="message">Desription Of ' + seq + ' row should not be blank.</span>',
          "", { toastClass: "ngx-toastr alert alert-dismissible alert-success alert-notify" }
        );
        valid = false;
        break;
      } else if (detailsArray[i]['quantity'] == "") {
        this.toastr.show(
          '<span data-notify="message">Quantity Of ' + seq + ' row should not be blank.</span>',
          "", { toastClass: "ngx-toastr alert alert-dismissible alert-success alert-notify" }
        );
        valid = false;
        break;
      } else if (detailsArray[i]['unit'] == "") {
        this.toastr.show(
          '<span data-notify="message">Unit Of ' + seq + ' row should not be blank.</span>',
          "", { toastClass: "ngx-toastr alert alert-dismissible alert-success alert-notify" }
        );
        valid = false;
        break;
      } else if (detailsArray[i]['unit'].length > 3) {
        this.toastr.show(
          '<span data-notify="message">Unit Of ' + seq + ' row should not be greater than 3 characters.</span>',
          "", { toastClass: "ngx-toastr alert alert-dismissible alert-success alert-notify" }
        );
        valid = false;
        break;
      } else if (detailsArray[i]['leadTime'] && (detailsArray[i]['leadTime'] !== "" || detailsArray[i]['leadTime'] !== 0) && !detailsArray[i]['leadTimeperiod'] && (detailsArray[i]['leadTimeperiod'] != "" || detailsArray[i]['leadTimeperiod'] != null)) {
        this.toastr.show(
          '<span data-notify="message">Please select ' + seq + ' Period.</span>',
          "", { toastClass: "ngx-toastr alert alert-dismissible alert-success alert-notify" }
        );
        valid = false;
        break;
      } else if (detailsArray[i]['leadTimeperiod'] && (detailsArray[i]['leadTimeperiod'] != "" || detailsArray[i]['leadTimeperiod'] != null) && !detailsArray[i]['leadTime'] && (detailsArray[i]['leadTime'] == null || detailsArray[i]['leadTime'] == 0)) {
        this.toastr.show(
          '<span data-notify="message">Enter ' + seq + ' Lead Time.</span>',
          "", { toastClass: "ngx-toastr alert alert-dismissible alert-success alert-notify" }
        );
        valid = false;
        break;
      }
    }

    if (valid) {
      this.jsonHeader["status"] = "2";
      this.jsonHeader["leadTimeforitem"] = this.hdrleadTimeforitem;
      this.jsonHeader["leadTimeperiod"] = this.leadTimeperiod;
      let detailsArray: any[] = this.jsonHeader["itemDetails"];
      if (detailsArray) {
        detailsArray.forEach(function (item) {
          item["status"] = "2";
        });
      }

      try {
        this.loaderService.startLoading();
        this.snq.msdUpdateData(JSON.stringify(this.jsonHeader))
          .subscribe((responseData: ResponseData) => {
            this.loaderService.stopLoading();
            this.routetoparentevent.emit("Gotoback");
          },
            err => {
              this.loaderService.stopLoading();
              console.log(err);
            })
      }
      catch (error) {

      }
    }
  }

  saveAsDraft() {
    this.loaderService.startLoading();
    this.jsonHeader["status"] = "1";
    this.jsonHeader["saveAsDraft"] = "saveInVerification";
    let details: any[] = this.jsonHeader["itemDetails"];
    if (details) {
      details.forEach(function (item) {
        item["status"] = "1";
      })
    }
    try {
      this.snq.msdSaveAsDraft(JSON.stringify(this.jsonHeader))
        .subscribe((responseData: ResponseData) => {
          this.loaderService.stopLoading();
          this.routetoparentevent.emit("Gotoback");
        },
          err => {
            this.loaderService.stopLoading();
            console.log(err);
          })
    }
    catch (error) {
    }

  }
}
