import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  public login(email: string, password: string) {
     return this.http.post(`${this.baseUrl}/auth/login`, {email: email, password: password})
  }

  public logout() {
      return this.http.post(`${this.baseUrl}/auth/logout`, {}, this.httpHeaders)
  }

  public me() {
    return this.http.post(`${this.baseUrl}/auth/me`, {}, this.httpHeaders)
  }

  get token(): string {
     return localStorage.getItem('token');
  }

  setToken(token: string): void {
    return localStorage.setItem('token', token);
  }

  getTokenExpirationDate(token: any): Date {
      const decoded = jwt_decode(token);

      if (decoded.exp === undefined) return null;

      const date = new Date(0);
      date.setUTCSeconds(decoded.exp);
      return date;
    }

  isTokenExpired(): boolean {

      if(this.token === null) return true;

      const date = this.getTokenExpirationDate(this.token);
      if(date === undefined) return false;
      return !(date.valueOf() > new Date().valueOf());
  }

  protected get httpHeaders(): { headers: HttpHeaders } {
    return { headers: new HttpHeaders({ 'Content-Type': 'application/json', Accept: 'application/json', Authorization: 'Bearer ' + this.token }) };
  }

  protected get baseUrl(): string {
    return environment.url;
  }

  public parseToken(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = decodeURIComponent(atob(base64).split('')
          .map(character => '%' + ('00' + character.charCodeAt(0).toString(16)).slice(-2)).join(''));
    return JSON.parse(payload);
  }
}
