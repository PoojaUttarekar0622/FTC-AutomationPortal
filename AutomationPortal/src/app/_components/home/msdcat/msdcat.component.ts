import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../_services/loader.service';
import { ResponseData } from "../../../_models/response-data";
import { MespasService } from "../../../_services/mespas.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-msdcat',
  templateUrl: './msdcat.component.html',
  styleUrls: ['./msdcat.component.scss']
})
export class MsdcatComponent implements OnInit {
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
    this.setSparepartData();
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
      this.jsonSave.push({ "msdItem_Id": 0, "itemName": this.description });
      try {
        this.mespas.saveSpareDate(JSON.stringify(this.jsonSave))
          .subscribe((responseData: ResponseData) => {
            let result = responseData.result;
            this.loaderService.stopLoading();
            this.setSparepartData();
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

  setSparepartData() {
    this.loaderService.startLoading();
    this.mespas.getSparepartData()
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
      this.jsonDelete.push({ "msdItem_Id": jsonDelete.msdItem_Id, "itemName": jsonDelete.itemName });

      this.loaderService.startLoading();
      try {
        this.mespas.deleteSpareData(this.jsonDelete)
          .subscribe((responseData: ResponseData) => {
            let result = responseData.result;
            this.loaderService.stopLoading();
            this.toastr.show(
              '<span data-notify="message">' + result + '</span>',
              "", { toastClass: "ngx-toastr alert alert-dismissible alert-success alert-notify" }
            );
            this.setSparepartData();
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
