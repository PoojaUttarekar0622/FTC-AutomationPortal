import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from "./_guards/auth-guard.service";
import { AuthComponent } from './_components/auth/auth.component';
import { HomeComponent } from './_components/home/home.component';
import { VerificationComponent } from './_components/home/verification/verification.component';
import { InprocessComponent } from './_components/home/inprocess/inprocess.component';
import { MsderrorComponent } from './_components/home/msderror/msderror.component';
import { MsdcompletedComponent } from './_components/home/msdcompleted/msdcompleted.component';
import { MsddetailsComponent } from './_components/home/msdcompleted/msddetails.component';
import { SnqverifyComponent } from './_components/home/snqverify/snqverify.component';
import { SnqerrorComponent } from './_components/home/snqerror/snqerror.component';
import { SnqerrordtlComponent } from './_components/home/snqerrordtl/snqerrordtl.component';
import { MsdverifyComponent } from './_components/home/msdverify/msdverify.component';
import { MsdverifydtlComponent } from './_components/home/msdverifydtl/msdverifydtl.component';
import { MsderrordtlComponent } from './_components/home/msderrordtl/msderrordtl.component';
import { SnqcompletedComponent } from './_components/home/snqcompleted/snqcompleted.component';
import { SnqcompleteddtlComponent } from './_components/home/snqcompleted/snqcompleteddtl.component';
import { MsdinprocessComponent } from './_components/home/msdinprocess/msdinprocess.component';
import { ChangepasswordComponent } from './_components/home/changepassword/changepassword.component';
import { MlmasterComponent } from './_components/home/mlmaster/mlmaster.component';
import { SnqcatComponent } from './_components/home/snqcat/snqcat.component';
import { MsdcatComponent } from './_components/home/msdcat/msdcat.component';
import { MverifyComponent } from './_components/home/mespas/mverify.component';
import { MdetailsComponent } from './_components/home/mespas/mdetails.component';
import { PICChangeComponent } from './_components/home/picchange/picchange.component';
const routes: Routes = [
  { path: '', redirectTo: "home", pathMatch: 'full'},
  {
    path: 'home', component: HomeComponent,canActivate: [AuthGuardService], data: { title: 'Dashboard' },
    children: [
      { path: 'verification', component: VerificationComponent, data: { title: 'SNQ Verification' } },
      { path: 'inprocess', component: InprocessComponent, data: { title: 'SNQ Inprocess' } },
      { path: 'snqerror', component: SnqerrorComponent, data: { title: 'SNQ Error' } },
      { path: 'snqcomplete', component: SnqcompletedComponent, data: { title: 'SNQ Complete' }},
      { path: 'snqdetails', component: SnqcompleteddtlComponent, data: { title: 'SNQ Details' }},
      { path: 'snqVerify', component: SnqverifyComponent, data: { title: 'SNQ Verification Details' }},
      { path: 'snqErrordtl', component: SnqerrordtlComponent, data: { title: 'SNQ Error Details' }},
      { path: 'msdverify', component: MsdverifyComponent, data: { title: 'MSD Verification' }},
      { path: 'msdverifydtl', component: MsdverifydtlComponent, data: { title: 'MSD Verification Details' }},
      { path: 'msderror', component: MsderrorComponent, data: { title: 'MSD Error' }},
      { path: 'msderrordtl', component: MsderrordtlComponent, data: { title: 'MSD Error Details' }},
      { path: 'msdcomplete', component: MsdcompletedComponent, data: { title: 'MSD Complete' }},
      { path: 'msddetails', component: MsddetailsComponent, data: { title: 'MSD Details' }},
      { path: 'msdinprocess', component: MsdinprocessComponent, data: { title: 'MSD Inprocess' }},
      { path: 'changepwd', component: ChangepasswordComponent, data: { title: 'Change Password' } },
      { path: 'mlmaster', component: MlmasterComponent, data: { title: 'ML Master' }},
      { path: 'snqitem', component: SnqcatComponent, data: { title: 'SNQ Item' }},
      { path: 'msditem', component: MsdcatComponent, data: { title: 'MSD Item' } },
      { path: 'mespasverify', component: MverifyComponent, data: { title: 'Mespas Verify' }},
      { path: 'mespasdetails', component: MdetailsComponent, data: { title: 'Mespas Details' } },
      { path: 'PICChangeComponent', component: PICChangeComponent, data: { title: 'PIC Change' } }
    ]
  },
  { path: 'login', component: AuthComponent },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
