import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(
    private http: HttpClient
  ) { }

  public store(course): Observable<any>{
    return this.http.post(`${this.baseUrl}/course/create`, course, this.httpHeaders);
  }

  public getCourses(id): Observable<any>{
    return this.http.get(`${this.baseUrl}/course/all/department/${id}`, this.httpHeaders);
  }

  public all(): Observable<any>{
    return this.http.get(`${this.baseUrl}/course/all`, this.httpHeaders);
  }

  public update(course, id): Observable<any>{
    return this.http.post(`${this.baseUrl}/course/update/${id}`, course, this.httpHeaders);
  }

  public destroy(id): Observable<any>{
    return this.http.get(`${this.baseUrl}/course/delete/${id}`, this.httpHeaders);
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
