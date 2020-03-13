import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient
  ) { }

  public all(): Observable<any>{
    return this.http.get(`${this.baseUrl}/users/all`, this.httpHeaders);
  }

  public getByType(id): Observable<any>{
    return this.http.get(`${this.baseUrl}/users/all/${id}`, this.httpHeaders);
  }

  public show(id): Observable<any>{
    return this.http.get(`${this.baseUrl}/users/show/${id}`, this.httpHeaders);
  }

  public store(user): Observable<any>{
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  public update(user, id): Observable<any>{
    return this.http.post(`${this.baseUrl}/users/update/${id}`, user, this.httpHeaders);
  }

  public destroy(id): Observable<any>{
    return this.http.get(`${this.baseUrl}/users/delete/${id}`, this.httpHeaders);
  }

  get token(): string {
     return localStorage.getItem('token');
  }

  protected get httpHeaders(): { headers: HttpHeaders } {
    return { headers: new HttpHeaders({ 'Content-Type': 'application/json', Accept: 'application/json', Authorization: 'Bearer ' + this.token }) };
  }


  protected get baseUrl(): string {
    return environment.url;
  }
}
