import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { LoaderService } from '../../../_services/loader.service';
import { ResponseData } from "../../../_models/response-data";
import { SnqService } from "../../../_services/snq.service";
import { ToastrService } from "ngx-toastr";
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}
@Component({
  selector: 'app-picchange',
  templateUrl: './picchange.component.html',
  styleUrls: ['./picchange.component.scss']
})
export class PICChangeComponent implements OnInit {
  rows: any = [];
  temp = [];
  activeRow: any;
  selected: any[] = [];
  entries: number = 10;
  templateCustomerName: string;
  AS400CustomerName: string;
  AS400UserID: string;
  emailId: string;
  customerId: number;
  jsonUpdate: any;
  constructor(public snq: SnqService,
    public toastr: ToastrService,
    public loaderService: LoaderService) { }

  ngOnInit(): void {
    this.setPICData()
  }

  setPICData() {
    this.loaderService.startLoading();
    this.snq.getCustomerData()
      .subscribe((responseData: ResponseData) => {
        if (responseData) {
          this.loaderService.stopLoading();
          this.rows = responseData;
          this.temp = this.rows.map((prop, key) => {
            return {
              ...prop,
              id: key
            };
          });
        }
      },
        err => {
          this.loaderService.stopLoading();
          console.log(err);
        })
  }

  btnAction(rowdata) {
    this.templateCustomerName = rowdata.templateCustomerName;
    this.AS400CustomerName = rowdata.aS400CustomerName;
    this.AS400UserID = rowdata.aS400UserId;
    this.emailId = rowdata.customerEmailId;
    this.customerId = rowdata.customerId;
  }

  onUpdate() {
    let valid = true;
    this.jsonUpdate = [];
    if (this.AS400UserID == "" || this.AS400UserID == null) {
      this.toastr.show(
        '<span data-notify="message">Please Enter AS400 User Id !</span>',
        "", { toastClass: "ngx-toastr alert alert-dismissible alert-success alert-notify" }
      );
      valid = false;
    } else if (this.emailId == "" || this.emailId == null) {
      this.toastr.show(
        '<span data-notify="message">Please Enter Email Id !</span>',
        "", { toastClass: "ngx-toastr alert alert-dismissible alert-success alert-notify" }
      );
      valid = false;
    }
    if (valid) {
      this.jsonUpdate = {
        "customerId": this.customerId,
        "templateCustomerName": this.templateCustomerName,
        "aS400CustomerName": this.AS400CustomerName,
        "aS400UserId": this.AS400UserID,
        "customerEmailId": this.emailId
      }
      try {
        console.log("this", this.jsonUpdate)
        this.snq.updateCustomerDate(this.jsonUpdate)
          .subscribe((responseData: ResponseData) => {
            let result = responseData.result;
            this.loaderService.stopLoading();
            this.toastr.show(
              '<span data-notify="message">' + result + '</span>',
              "", { toastClass: "ngx-toastr alert alert-dismissible alert-success alert-notify" }
            );
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

  filterTable(filterValue: string) {
    let searchdata = filterValue.split(' ');
    this.temp = this.rows.map((prop, key) => {
      return {
        ...prop,
        id: key
      };
    });

    for (let i = 0; i < searchdata.length; i++) {
      this.temp = this.temp.filter(item => {
        for (let key in item) {
          if (item[key] != null && item[key].toString().toLowerCase().includes(searchdata[i].toLowerCase())) {
            return true
          }
        }
        return false;
      })
    }
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
    this.activeRow = event.row;
  }

}
