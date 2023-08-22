import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ResponseData } from "../../../_models/response-data";
import { SnqService } from "../../../_services/snq.service";
import { LoaderService } from "../../../_services/loader.service";

@Component({
  selector: 'app-snqcompleteddtl',
  templateUrl: './snqcompleteddtl.component.html',
  styleUrls: ['./snqcompleteddtl.component.scss']
})
export class SnqcompleteddtlComponent implements OnInit {

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
    this.snq.getSNQDetails(pkId)
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

  onActivate(event) {
    this.activeRow = event.row;
  }

}
