import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoaderService } from '../../_services/loader.service';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;
  loadingSubscription: Subscription;
  
  constructor(private loadingScreenService: LoaderService) {
  }

  ngOnInit() {
    this.loadingSubscription = this.loadingScreenService.loadingStatus.subscribe((value) => {
      this.isLoading = value;
    });
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }
}
