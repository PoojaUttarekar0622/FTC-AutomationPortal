import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { LoaderService } from '../../../_services/loader.service';
import { ResponseData } from "../../../_models/response-data";
import { SnqService } from "../../../_services/snq.service";
import { ToastrService } from "ngx-toastr";
import * as XLSX from 'xlsx';
import * as moment from 'moment';
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}
@Component({
  selector: 'app-mlmaster',
  templateUrl: './mlmaster.component.html',
  styleUrls: ['./mlmaster.component.scss']
})
export class MlmasterComponent implements OnInit {
  rows: any = [];
  mlType: any = [];
  jsonProcessType: any = []
  entries: number = 10;
  temp = [];
  activeRow: any;
  selected: any[] = [];
  jsonListData: any = [];
  masterSelected: boolean = false;
  checkedList: any;
  deleteList: any;
  processType: string;
  mlTypeval: string;
  description: string;
  SelectionType = SelectionType;
  jsonUpdate: any;
  isShowingDetails = false;
  isAddNewIMPA = false;
  isIMPAList = false;
  jsonNewIMPA: any[] = [];
  jsonNewIMPAUpdate: any;
  fileName= 'MLMaster.xlsx';
  FromDate: string = '';
  ToDate: string = '';
  today: string;
  actionDate: string = '';
  request: object = {};
  isValue: number = 1;
  isValueSecond: number = 0;

  arr = [
    { title: "Accession Number", show: true, link: "accessionNumber" },
    { title: "Title", show: true, link: "title" },
    { title: "Sub Title", show: false, link: "subTitle" },
    { title: "Status", show: true, link: "status" },
    { title: "Authors", show: true, link: "authors" },
    { title: "ISBN", show: true, link: "isbn" },
    { title: "ISBN 10", show: false, link: "isbn10" },
    { title: "ISBN 13", show: false, link: "isbn13" },
    { title: "Subjects", show: true, link: "subjects" },
    { title: "Publishers", show: false, link: "publishers" },
    { title: "Vendors", show: false, link: "vendors" },
    { title: "Contributors", show: false, link: "contributors" },
    { title: "Collaborators", show: false, link: "000000" }
  ];


  constructor(private formBuilder: FormBuilder,
    public snq: SnqService,
    public toastr: ToastrService,
    public loaderService: LoaderService,) {
  }

  ngOnInit(): void {
    this.processType = "SNQ";
    this.mlTypeval = "IMPA";
    this.today = moment().toString();
    this.today = moment(this.today).format("YYYY-MM-DD");
    this.actionDate = this.today;
    this.request = {
      "FromDate": this.today,
      "ToDate": this.today,
      "mlMasterType": this.mlTypeval,
      "processType":this.processType
    }
    this.setMLProcessType();
  }

  btnExportToExccel(){

    let Heading = [['ID', 'IMPA Code', 'Description']];

    //Had to create a new workbook and then add the header
    const wb = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    ws['!cols'] = [];
    ws['!cols'][0] = { hidden: true };
    XLSX.utils.sheet_add_aoa(ws, Heading);

    //Starting in the second row to avoid overriding and skipping headers
    XLSX.utils.sheet_add_json(ws, this.rows, { origin: 'A2', skipHeader: true });

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileName);
  }

  setMLType() {
    this.loaderService.startLoading();
    this.snq.getMLType(this.processType)
      .subscribe((responseData: ResponseData) => {
        if (responseData) {
          this.mlType = responseData;
          this.loaderService.stopLoading();
        }
      },
        err => {
          this.loaderService.stopLoading();
          console.log(err);
        })
  }

  setMLProcessType() {
    this.loaderService.startLoading();
    this.snq.getMLProcessType()
      .subscribe((responseData: ResponseData) => {
        if (responseData) {
          this.jsonProcessType = responseData;
          this.loaderService.stopLoading();
          this.setMLType();
        }
      },
        err => {
          this.loaderService.stopLoading();
          console.log(err);
        })
  }

  btnGroupFilter(num) {
    this.isValue = num;
    var date = new Date();
    if (num == 1) {
      this.actionDate = this.today;
      this.request = {
        "FromDate": this.today,
        "ToDate": this.today,
        "mlMasterType": this.mlTypeval,
        "processType":this.processType
      }
      this.setGroupFliter(this.request);
    } else if (num == 5) {
      var weekly = date.setDate(date.getDate() - 7);
      this.actionDate = moment(weekly).format("YYYY-MM-DD");
      this.request = {
        "FromDate": this.actionDate,
        "ToDate": this.today,
        "mlMasterType": this.mlTypeval,
        "processType":this.processType
      }
      this.setGroupFliter(this.request);
    }else if (num == 2) {
      var monthfirstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      this.actionDate = moment(monthfirstDay).format("YYYY-MM-DD");
      this.request = {
        "FromDate": this.actionDate,
        "ToDate": this.today,
        "mlMasterType": this.mlTypeval,
        "processType":this.processType
      }
      this.setGroupFliter(this.request);
    } else if (num == 3) {
      var quarter = Math.floor((date.getMonth() / 3));
      var QutfirstDate = new Date(date.getFullYear(), quarter * 3, 1);
      this.actionDate = moment(QutfirstDate).format("YYYY-MM-DD")
      this.request = {
        "FromDate": this.actionDate,
        "ToDate": moment(this.today).format("YYYY-MM-DD"),
        "mlMasterType": this.mlTypeval,
        "processType":this.processType
      }
      this.setGroupFliter(this.request);
    } else if (num == 4) {
      var yearfirstDay = new Date(date.getFullYear(), 0, 1);
      this.actionDate = moment(yearfirstDay).format("YYYY-MM-DD")
      this.request = {
        "FromDate": this.actionDate,
        "ToDate": moment(this.today).format("YYYY-MM-DD"),
        "mlMasterType": this.mlTypeval,
        "processType":this.processType
      }
      this.setGroupFliter(this.request)
    }
  }

  setGroupFliter(request) {
    this.loaderService.startLoading();
    this.snq.getMLData(this.request)
      .pipe()
      .subscribe(
        data => {
          if (data) {
            this.isIMPAList = true;
            this.isAddNewIMPA = false;
            this.rows = data;
            this.temp = this.rows.map((prop, key) => {
              return {
                ...prop,
                id: key
              };
            });
            this.loaderService.stopLoading();
          }
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
        "mlMasterType": this.mlTypeval,
        "processType":this.processType
      }
      this.setGroupFliter(this.request)
    }
    else {
      this.request = {
        "FromDate": "",
        "ToDate": "",
        "mlMasterType": this.mlTypeval,
        "processType":this.processType
      }
      this.setGroupFliter(this.request)
    }

  }

  onChangeProcessType() {
    this.isShowingDetails = false;
    this.setMLType()
  }

  onChangeMLType() {
    this.isShowingDetails = false;
  }

  entriesChange($event) {
    this.entries = $event.target.value;
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

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
    this.activeRow = event.row;
  }

  btnAction(desc) {
    this.isShowingDetails = true;
    this.description = desc;
    let jsonAction = {
      "mlMasterType": this.mlTypeval,
      "processType": this.processType,
      "description": desc
    }
    this.setActionData(jsonAction)
  }

  setActionData(jsonData: any) {
    this.loaderService.startLoading();
    this.snq.getMLMasterIdWiseList(jsonData)
      .subscribe((responseData: ResponseData) => {
        if (responseData) {
          this.jsonListData = responseData;
          this.loaderService.stopLoading();
        }
      },
        err => {
          this.loaderService.stopLoading();
          console.log(err);
        })
  }

  addNewRow() {
    if (this.jsonListData == null) {
      this.jsonListData = [{
        "itemIdPK": 0,
        "description": "",
        "mlMasterType": null,
        "processType": null,
        "tempDescription": "",
        "isSelected": true
      }];
    }
    else {
      this.jsonListData.push({
        "itemIdPK": 0,
        "description": "",
        "mlMasterType": null,
        "processType": null,
        "tempDescription": "",
        "isSelected": true
      });
    }
  }

  checkUncheckAll() {
    for (var i = 0; i < this.jsonListData.length; i++) {
      this.jsonListData[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }


  isAllSelected() {
    this.masterSelected = this.jsonListData.every(function (item: any) {
      return item.isSelected == true;
    })
    this.getCheckedItemList();
  }

  getCheckedItemList() {
    this.checkedList = [];
    for (var i = 0; i < this.jsonListData.length; i++) {
      if (this.jsonListData.isSelected)
        this.checkedList.push(this.jsonListData[i]);
    }
    this.checkedList = JSON.stringify(this.checkedList);
  }

  deleteRow() {
    this.deleteList = [];
    let confirmItem = [];
    if (confirm("Are you sure, you want to delete the item")) {
      for (var i = 0; i < this.jsonListData.length; i++) {
        if (this.jsonListData[i].isSelected == true) {
          this.deleteList.push({ "mlMasterType": this.mlTypeval, "processType": this.processType, "itemIdPK": parseInt(this.jsonListData[i].itemIdPK) });
        } else {
          confirmItem.push(this.jsonListData[i])
        }
      }
      this.jsonListData = confirmItem;
      this.deleteList = JSON.stringify(this.deleteList);
      this.deleteSelectedRow();
    }
  }

  deleteSelectedRow() {
    this.loaderService.startLoading();
    try {
      this.snq.deleteMLData(this.deleteList)
        .subscribe((responseData: ResponseData) => {
          let result = responseData.result;
          this.loaderService.stopLoading();
          this.toastr.show(
            '<span data-notify="message">' + result + '</span>',
            "", { toastClass: "ngx-toastr alert alert-dismissible alert-success alert-notify" }
          );
        },
          err => {
            console.log(err);
          })
    }
    catch (error) {

    }
  }

  updateData() {
    let valid = true;
    this.jsonUpdate = [];
    for (let i = 0; i < this.jsonListData.length; i++) {
      let seq = i + 1;
      if (this.jsonListData[i]['tempDescription'] == "") {
        this.toastr.show(
          '<span data-notify="message">Description Of ' + seq + ' row should not be blank.</span>',
          "", { toastClass: "ngx-toastr alert alert-dismissible alert-success alert-notify" }
        );
        valid = false;
        break;
      }
    }
    if (valid) {
      for (var i = 0; i < this.jsonListData.length; i++) {
        if (this.jsonListData[i].isSelected == true) {
          this.jsonUpdate.push({ "itemIdPK": parseInt(this.jsonListData[i].itemIdPK), "mlMasterType": this.mlTypeval, "processType": this.processType, "description": this.description, "tempDescription": this.jsonListData[i].tempDescription });
        }
      }

      try {
        this.snq.updateMLData(JSON.stringify(this.jsonUpdate))
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

  // Add New IMPA 
  btnAddNewIMPA() {
    this.processType = this.processType;
    this.mlTypeval = this.mlTypeval;
    this.isIMPAList = false;
    this.isShowingDetails = false;
    this.isAddNewIMPA = true;
    this.jsonNewIMPA = [{
      "description": "",
      "tempDescription": ""
    }];
  }

  updateIMPA() {
    let valid = true;
    this.jsonUpdate = [];

    if (this.jsonNewIMPA[0]['description'] == "") {
      this.toastr.show(
        '<span data-notify="message">IMPA Code Of 1 row should not be blank.</span>',
        "", { toastClass: "ngx-toastr alert alert-dismissible alert-success alert-notify" }
      );
      valid = false;
    }else if(this.jsonNewIMPA[0]['tempDescription'] == ""){
      this.toastr.show(
        '<span data-notify="message">Description Of 1 row should not be blank.</span>',
        "", { toastClass: "ngx-toastr alert alert-dismissible alert-success alert-notify" }
      );
      valid = false;
    }

    if (valid) {
      this.jsonNewIMPAUpdate = { "mlMasterType": "IMPA", "processType": this.processType, "description": this.jsonNewIMPA[0]["description"], "tempDescription": this.jsonNewIMPA[0]["tempDescription"] };

      try {
        this.snq.updateNewIMPAData(this.jsonNewIMPAUpdate)
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
}