import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ResponseData } from "../../../_models/response-data";
import { SnqService } from "../../../_services/snq.service";
import { LoaderService } from "../../../_services/loader.service";

@Component({
  selector: 'app-msddetails',
  templateUrl: './msddetails.component.html',
  styleUrls: ['./msddetails.component.scss']
})
export class MsddetailsComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  jsonHeader: any = [];
  jsonItem: any = [];
  hdrId: number;
  ZOOM_STEP: number = 0.25;
  DEFAULT_ZOOM: number = 1;
  public pdfSrc: string = '';
  public pdfZoom: number = this.DEFAULT_ZOOM;
  isShowingDetails = false;

  constructor(public snq: SnqService,
    private route: ActivatedRoute,
    public loaderService: LoaderService,
    private router: Router) {

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.hdrId = Number.parseInt(params['pkid']);
    });
    this.setStatusData(this.hdrId);
  }

  setStatusData(pkId) {
    this.loaderService.startLoading();
    this.snq.getMSDDetails(pkId)
      .subscribe((responseData: ResponseData) => {
        this.loaderService.stopLoading();
        this.jsonHeader = responseData;
        this.jsonItem = this.jsonHeader["itemDetails"]
        this.temp = this.jsonItem.map((prop, key) => {
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

  onActivate(event) {
    this.activeRow = event.row;
  }

  viewPdf() {
    if (this.isShowingDetails == false) {
      this.isShowingDetails = true;
    }
    else {
      this.isShowingDetails = false;
    }

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

}
