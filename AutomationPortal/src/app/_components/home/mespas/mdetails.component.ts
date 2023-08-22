import { Component, OnInit, Input, EventEmitter, Output, TemplateRef } from '@angular/core';
import { ResponseData } from "../../../_models/response-data";
import { MespasService } from "../../../_services/mespas.service";
import { SnqService } from "../../../_services/snq.service";
import { SessionService } from "../../../_services/session.service";
import { LoaderService } from "../../../_services/loader.service";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-mdetails',
  templateUrl: './mdetails.component.html',
  styleUrls: ['./mdetails.component.scss']
})
export class MdetailsComponent implements OnInit {
  masterSelected: boolean = false;
  jsonHeader: any = [];
  jsonItem: any = [];
  jsonMappingPort: any = [];
  jsonDepartment: any = [];
  hdrId: number;
  checkedList: any;
  deleteList: any;
  hdrleadTimeforitem = "";
  leadTimeperiod = "";
  @Input() jsonpass: any;
  userName: string;
  ownershipName: string;
  jsonOwnerShip: any = [];
  @Output() routetoparentevent = new EventEmitter<string>();
  dismissible = true;
  constructor(public mespas: MespasService,
    public snq: SnqService,
    private sessionService: SessionService,
    public loaderService: LoaderService,
    private modalService: BsModalService,
    public toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.hdrId = this.jsonpass.pK_MESPASENQUIRY_HDR_ID;
    this.userName = this.sessionService.getCurrentUserName();
    this.setMappingPort();
    this.setDepartment();
    this.setStatusData(this.hdrId);
    this.masterSelected = true;
  }

  setMappingPort() {
    this.loaderService.startLoading();
    this.snq.getPortMapping()
      .subscribe((responseData: ResponseData) => {
        this.loaderService.stopLoading();
        this.jsonMappingPort = responseData;
      },
        err => {
          this.loaderService.stopLoading();
          console.log(err);
        })
  }

  setDepartment() {
    this.loaderService.startLoading();
    this.mespas.getDepartment()
      .subscribe((responseData: ResponseData) => {
        this.loaderService.stopLoading();
        this.jsonDepartment = responseData;
      },
        err => {
          this.loaderService.stopLoading();
          console.log(err);
        })
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

  btnBack() {
    this.routetoparentevent.emit("Gotoback");
  }

  setStatusData(pkId) {
    this.loaderService.startLoading();
    this.mespas.getMespasDetails(pkId)
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
    let fkHdrId = ""
    fkHdrId = this.hdrId.toString();
    if (this.jsonItem == null) {
      this.jsonItem = [{
        "pK_MESPASENQUIRY_DTL_ID": 0,
        "fkEnquiryid": parseInt(fkHdrId),
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
        "pK_MESPASENQUIRY_DTL_ID": 0,
        "fkEnquiryid": parseInt(fkHdrId),
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
          this.deleteList.push({ "PK_MESPASENQUIRY_DTL_ID": this.jsonHeader.itemDetails[i].pK_MESPASENQUIRY_DTL_ID });
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
    this.loaderService.startLoading();
    try {
      this.mespas.mespasDelete(this.deleteList)
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
    this.loaderService.startLoading();
    this.jsonHeader["status"] = "8";
    let details: any[] = this.jsonHeader["itemDetails"];
    if (details) {
      details.forEach(function (item) {
        item["status"] = "8";
      });
    }
    try {
      this.mespas.mespasUpdateData(JSON.stringify(this.jsonHeader))
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
    }else if (this.jsonHeader.deptName == null) {
      this.toastr.show(
        '<span data-notify="message">Please select department !</span>',
        "", { toastClass: "ngx-toastr alert alert-dismissible alert-success alert-notify" }
      );
      valid = false;
    } else if (this.masterSelected == false) {
      this.toastr.show(
        '<span data-notify="message">Please Select all Rows for Verification !</span>',
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
      }
      else if (detailsArray[i]['unit'] == "") {
        this.toastr.show(
          '<span data-notify="message">Unit Of ' + seq + ' row should not be blank.</span>',
          "", { toastClass: "ngx-toastr alert alert-dismissible alert-success alert-notify" }
        );
        valid = false;
        break;
      }
      else if (detailsArray[i]['unit'].length > 3) {
        this.toastr.show(
          '<span data-notify="message">Unit Of ' + seq + ' row should not be greater than 3 characters.</span>',
          "", { toastClass: "ngx-toastr alert alert-dismissible alert-success alert-notify" }
        );
        valid = false;
        break;
      }
      else if (detailsArray[i]['accountNo'] == "") {
        this.toastr.show(
          '<span data-notify="message">Account No. Of ' + seq + ' should not be blank.</span>',
          "", { toastClass: "ngx-toastr alert alert-dismissible alert-success alert-notify" }
        );
        valid = false;
        break;
      }
      else if (detailsArray[i]['accountNo'].length > 2) {
        this.toastr.show(
          '<span data-notify="message">Account No. Of ' + seq + ' should not be greater than 2 digits.</span>',
          "", { toastClass: "ngx-toastr alert alert-dismissible alert-success alert-notify" }
        );
        valid = false;
        break;
      }else if (detailsArray[i]['unit'].length > 3) {
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
      this.loaderService.startLoading();
      this.jsonHeader["status"] = "2";
      this.jsonHeader["leadTimeforitem"] = this.hdrleadTimeforitem;
      this.jsonHeader["leadTimeperiod"] = this.leadTimeperiod;
      let details: any[] = this.jsonHeader["itemDetails"];
      if (details) {
        details.forEach(function (item) {
          item["status"] = "2";
        })
      }
      try {
        this.mespas.mespasUpdateData(JSON.stringify(this.jsonHeader))
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
      this.mespas.mespasSaveAsDraft(JSON.stringify(this.jsonHeader))
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
