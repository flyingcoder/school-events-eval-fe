import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CollegeService {

  constructor(
    private http: HttpClient
  ) { }

  public store(college): Observable<any>{
    return this.http.post(`${this.baseUrl}/college/create`, college, this.httpHeaders);
  }

  public all(): Observable<any>{
    return this.http.get(`${this.baseUrl}/college/all`, this.httpHeaders);
  }

  public update(college, id): Observable<any>{
    return this.http.post(`${this.baseUrl}/college/update/${id}`, college, this.httpHeaders);
  }

  public destroy(id): Observable<any>{
    return this.http.get(`${this.baseUrl}/college/delete/${id}`, this.httpHeaders);
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
