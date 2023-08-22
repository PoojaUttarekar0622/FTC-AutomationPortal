import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  loginForm: FormGroup;
  loading : boolean = false;
  submitted = false;
  returnUrl: string;
  docUrl: any;
  token: string;

  errorMessage: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {

  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.auth.signIn(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.token = data["tokenId"];
          if (this.token == "" || this.token == null) {
            this.loading = false;
            this.errorMessage = data["resultMessage"];
          } else {
            this.router.navigate(["home"]);
          }
        },
        error => {
          this.errorMessage = "API Error !!!"
          this.loading = false;
        });
  }
}

