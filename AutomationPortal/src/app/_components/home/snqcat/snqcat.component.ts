import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../_services/loader.service';
import { ResponseData } from "../../../_models/response-data";
import { MespasService } from "../../../_services/mespas.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-snqcat',
  templateUrl: './snqcat.component.html',
  styleUrls: ['./snqcat.component.scss']
})
export class SnqcatComponent implements OnInit {
  rows: any = [];
  entries: number = 10;
  temp = [];
  activeRow: any;
  selected: any[] = [];
  description: string;
  jsonSave: any;
  jsonDelete: any;

  constructor(
    public mespas: MespasService,
    public toastr: ToastrService,
    public loaderService: LoaderService,) {
  }

  ngOnInit(): void {
    this.setStorepartData();
  }

  onSave() {
    this.jsonSave = [];
    let valid = true;
    if (this.description == "" || this.description == null) {
      this.toastr.show(
        '<span data-notify="message">Please Enter Description Name !</span>',
        "", { toastClass: "ngx-toastr alert alert-dismissible alert-success alert-notify" }
      );
      valid = false;
    }
    if (valid) {
      this.jsonSave.push({ "snqItem_Id": 0, "itemName": this.description });
      try {
        this.mespas.saveStoreDate(JSON.stringify(this.jsonSave))
          .subscribe((responseData: ResponseData) => {
            let result = responseData.result;
            this.loaderService.stopLoading();
            this.setStorepartData();
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

  setStorepartData() {
    this.loaderService.startLoading();
    this.mespas.getStorepartData()
      .subscribe((responseData: ResponseData) => {
        if (responseData) {
          this.rows = responseData;
          this.temp = this.rows.map((prop, key) => {
            return {
              ...prop,
              id: key
            };
          });
          this.loaderService.stopLoading();
        }
      },
        err => {
          this.loaderService.stopLoading();
          console.log(err);
        })
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

  btnAction(jsonDelete) {
    this.jsonDelete = []
    if (confirm("Are you sure, you want to delete the item")) {
      this.jsonDelete.push({ "snqItem_Id": jsonDelete.snqItem_Id, "itemName": jsonDelete.itemName });

      this.loaderService.startLoading();
      try {
        this.mespas.deleteStoreData(this.jsonDelete)
          .subscribe((responseData: ResponseData) => {
            let result = responseData.result;
            this.loaderService.stopLoading();
            this.toastr.show(
              '<span data-notify="message">' + result + '</span>',
              "", { toastClass: "ngx-toastr alert alert-dismissible alert-success alert-notify" }
            );
            this.setStorepartData();
          },
            err => {
              console.log(err);
            })
      }
      catch (error) {

      }
    }
  }
}
