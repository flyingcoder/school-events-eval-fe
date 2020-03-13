import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  user;
  constructor(
    public auth: AuthService,
    public router: Router
  ) { }

  canActivate(): boolean {
    if(this.auth.isTokenExpired()){
      this.router.navigate(['login']);
      //console.log(this.auth.isTokenExpired());
      return false;
    }
    return true;

  }
}
