import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AlertModule } from "ngx-bootstrap/alert";
import { ModalModule } from "ngx-bootstrap/modal";
import { ClipboardModule } from "ngx-clipboard";
import { ToastrModule } from "ngx-toastr";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { AppRoutingModule } from './app-routing.module';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { AppComponent } from './app.component';
import { AuthComponent } from './_components/auth/auth.component';
import { HomeComponent } from './_components/home/home.component';
import { VerificationComponent } from './_components/home/verification/verification.component';
import { InprocessComponent } from './_components/home/inprocess/inprocess.component';
import { MsderrorComponent } from './_components/home/msderror/msderror.component';
import { MsdcompletedComponent } from './_components/home/msdcompleted/msdcompleted.component';
import { MsddetailsComponent } from './_components/home/msdcompleted/msddetails.component';
import { SnqverifyComponent } from './_components/home/snqverify/snqverify.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SnqerrorComponent } from './_components/home/snqerror/snqerror.component';
import { SnqerrordtlComponent } from './_components/home/snqerrordtl/snqerrordtl.component';
import { MsdverifyComponent } from './_components/home/msdverify/msdverify.component';
import { MsdverifydtlComponent } from './_components/home/msdverifydtl/msdverifydtl.component';
import { MsderrordtlComponent } from './_components/home/msderrordtl/msderrordtl.component';
import { SnqcompletedComponent } from './_components/home/snqcompleted/snqcompleted.component';
import { SnqcompleteddtlComponent } from './_components/home/snqcompleted/snqcompleteddtl.component';
import { MsdinprocessComponent } from './_components/home/msdinprocess/msdinprocess.component';
import { TokenInterceptor } from './_helper/token.interceptor';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChangepasswordComponent } from './_components/home/changepassword/changepassword.component';
import { LoaderComponent } from './_components/loader/loader.component';
import { EnvServiceProvider } from './env.service.provider';
import { MlmasterComponent } from './_components/home/mlmaster/mlmaster.component';
import { CommonModule } from "@angular/common";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { SnqcatComponent } from './_components/home/snqcat/snqcat.component';
import { MsdcatComponent } from './_components/home/msdcat/msdcat.component';
import { MverifyComponent } from './_components/home/mespas/mverify.component';
import { MdetailsComponent } from './_components/home/mespas/mdetails.component';
import { PICChangeComponent } from './_components/home/picchange/picchange.component';
@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HomeComponent,
    VerificationComponent,
    InprocessComponent,
    MsderrorComponent,
    MsdcompletedComponent,
    MsddetailsComponent,
    SnqverifyComponent,
    SnqerrorComponent,
    SnqerrordtlComponent,
    MsdverifyComponent,
    MsdverifydtlComponent,
    MsderrordtlComponent,
    SnqcompletedComponent,
    SnqcompleteddtlComponent,
    MsdinprocessComponent,
    ChangepasswordComponent,
    LoaderComponent,
    MlmasterComponent,
    SnqcatComponent,
    MsdcatComponent,
    MverifyComponent,
    MdetailsComponent,
    PICChangeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    NgxDatatableModule,
    PdfViewerModule,
    MatTooltipModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      closeButton: true,
      enableHtml: true,
      tapToDismiss: false,
      preventDuplicates: true,
    }),
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    CommonModule,
    ProgressbarModule.forRoot(),
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
  ],
  providers: [HttpClientModule, EnvServiceProvider, {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
