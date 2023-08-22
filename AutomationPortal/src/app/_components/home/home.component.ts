import { Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/_services/auth.service';
import { SessionService } from "src/app/_services/session.service";
import { TaskService } from 'src/app/_services/task.service';
import { SnqService } from "../../_services/snq.service";
import { ResponseData } from "../../_models/response-data";

var misc: any = {
  sidebar_mini_active: true
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = false;
  sidenavOpen: boolean = false;
  pageTitle: string;
  userName: string;
  RoleID: number;
  roleName: string;
  jsonStatus: any = [];
  jsonStatus1: any = [];
  tokenid: string;
  request: object = {};
  showSNQ: boolean = false;
  showMSD: boolean = false;
  showML: boolean = false;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private auth: AuthService,
    private titleService: Title,
    private task: TaskService,
    private sessionService: SessionService,
    public snq: SnqService
  ) {
    this.userName = this.sessionService.getCurrentUserName();
    this.tokenid = this.sessionService.getToken();
    this.RoleID = this.sessionService.getRole();
    this.roleName = this.sessionService.getRoleName();
    this.subscribeToRouteChangeEvents();
  }

  ngOnInit() {
    if (this.roleName == "ADMIN") {
      this.showMSD = true;
      this.showSNQ = true;
      this.showML = false;
    } else if (this.roleName == "SNQUSER") {
      this.showMSD = false;
      this.showSNQ = true;
      this.showML = false;
    } else if (this.roleName == "MSDUSER") {
      this.showMSD = true;
      this.showSNQ = false;
      this.showML = false;
    } else if (this.roleName == "SNQADMIN") {
      this.showMSD = false;
      this.showSNQ = true;
      this.showML = true;
    }
    this.GetStatusCountMSD();
    this.GetStatusCountSNQ();
  }

  GetStatusCountMSD() {
    this.request = {
      "FromDate": "",
      "ToDate": "",
      "token": this.tokenid
    }
    this.task.getStatusCountMSD(this.request)
      .pipe()
      .subscribe(
        data => {
          this.jsonStatus = data;
        },
        error => {
        });
  }
  GetStatusCountSNQ() {
    this.request = {
      "FromDate": "",
      "ToDate": "",
      "token": this.tokenid
    }
    this.task.getStatusCountSNQ(this.request)
      .pipe()
      .subscribe(
        data => {
          this.jsonStatus = data;
        },
        error => {
        });
  }

  onMouseEnterSidenav() {
    if (!document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.add("g-sidenav-show");
    }
  }
  onMouseLeaveSidenav() {
    if (!document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.remove("g-sidenav-show");
    }
  }
  minimizeSidebar() {
    const sidenavToggler = document.getElementsByClassName(
      "sidenav-toggler"
    )[0];
    const body = document.getElementsByTagName("body")[0];
    if (body.classList.contains("g-sidenav-pinned")) {
      misc.sidebar_mini_active = true;
    } else {
      misc.sidebar_mini_active = false;
    }
    if (misc.sidebar_mini_active === true) {
      body.classList.remove("g-sidenav-pinned");
      body.classList.add("g-sidenav-hidden");
      sidenavToggler.classList.remove("active");
      misc.sidebar_mini_active = false;
    } else {
      body.classList.add("g-sidenav-pinned");
      body.classList.remove("g-sidenav-hidden");
      sidenavToggler.classList.add("active");
      misc.sidebar_mini_active = true;
    }
  }

  toggleSidenav() {
    if (document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.remove("g-sidenav-pinned");
      document.body.classList.add("g-sidenav-hidden");
      this.sidenavOpen = false;
    } else {
      document.body.classList.add("g-sidenav-pinned");
      document.body.classList.remove("g-sidenav-hidden");
      this.sidenavOpen = true;
    }
  }

  private getLatestChild(route) {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }

  private subscribeToRouteChangeEvents() {
    // Set initial title
    const latestRoute = this.getLatestChild(this.activeRoute);
    if (latestRoute) {
      this.setTitleFromRouteData(latestRoute.data.getValue());
    }
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activeRoute),
      map((route) => this.getLatestChild(route)),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data),
    ).subscribe((event) => {
      this.setTitleFromRouteData(event);
    });
  }

  private setTitleFromRouteData(routeData) {
    if (routeData && routeData['title']) {
      this.pageTitle = routeData['title'];
    } else {
      this.pageTitle = 'No title';
    }
  }

  logout() {
    this.auth.logout();
    this.releaseOwnership();
    this.releaseMSDOwnership();
    this.router.navigate(["login"]);
  }

  // @HostListener('window:beforeclose', ['$event'])
  // onWindowClose(event: any): void {
  //   console.log("Event", event)
  //   this.releaseOwnership();
  //   //this.setTitleFromRouteData
  //   // event.preventDefault();
  //   // event.returnValue = false;
  // }


  releaseOwnership() {
    try {
      this.snq.snqReleaseOwnerShip()
        .subscribe((responseData: ResponseData) => {
        },
          err => {
            console.log(err);
          })
    }
    catch (error) {

    }
  }

  releaseMSDOwnership() {
    try {
      this.snq.msdReleaseOwnerShip()
        .subscribe((responseData: ResponseData) => {
        },
          err => {
            console.log(err);
          })
    }
    catch (error) {

    }
  }

}
