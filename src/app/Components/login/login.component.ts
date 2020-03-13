import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form;

  constructor(
    private builder: FormBuilder,
    private router: Router,
    private authSrv: AuthService
  ) { }

  ngOnInit() {
    this.form = this.builder.group({email: ['', Validators.required], password: ['', Validators.required]});
    if(!this.authSrv.isTokenExpired()){
      this.router.navigate(['events']);
    }
  }

  login(user): void {
    this.authSrv.login(user.email, user.password).subscribe( (response: any) => {
      this.authSrv.setToken(response.access_token)
      this.router.navigate(['events'])
    }, error => {

    });
  }

}
