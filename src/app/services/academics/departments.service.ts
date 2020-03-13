import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {

  constructor(
    private http: HttpClient
  ) { }

  public store(department): Observable<any>{
    return this.http.post(`${this.baseUrl}/department/create`, department, this.httpHeaders);
  }

  public getDepartmentsPerCollege(id): Observable<any>{
    return this.http.get(`${this.baseUrl}/department/all/college/${id}`, this.httpHeaders);
  }

  public all(): Observable<any>{
    return this.http.get(`${this.baseUrl}/department/all`, this.httpHeaders);
  }

  public update(department, id): Observable<any>{
    return this.http.post(`${this.baseUrl}/department/update/${id}`, department, this.httpHeaders);
  }

  public destroy(id): Observable<any>{
    return this.http.get(`${this.baseUrl}/department/delete/${id}`, this.httpHeaders);
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
