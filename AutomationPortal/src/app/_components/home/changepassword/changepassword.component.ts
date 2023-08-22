import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ResponseData } from "../../../_models/response-data";
import { SessionService } from 'src/app/_services/session.service';
import { AuthService } from '../../../_services/auth.service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {

  changepwdFrom: FormGroup;
  errorMessage: string;
  submitted = false;
  userId: string;
  userName: string;

  jsonResponse : any =[];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private sesionService: SessionService,
    private auth: AuthService
  ) {
    this.userName = sesionService.getLoginName();
    this.userId = sesionService.getUserId();
  }

  ngOnInit() {
    this.changepwdFrom = this.formBuilder.group({
      userId: this.userId,
      userName: this.userName,
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.changepwdFrom.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.changepwdFrom.invalid) {
      return;
    }
    let changepwdJson = this.changepwdFrom.getRawValue();
    this.changePassword(changepwdJson)
  }


  changePassword(changepwdJson: any) {
    try {
      this.auth.changePassword(JSON.stringify(changepwdJson))
        .subscribe((responseData: ResponseData) => {
          this.jsonResponse = responseData
          this.errorMessage = this.jsonResponse.resultMessage;
        },
          err => {
            console.log(err);
          })
    }
    catch (error) {
    }
  }

}
