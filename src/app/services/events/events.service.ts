import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(
    private http: HttpClient
  ) { }

  public all(): Observable<any>{
    return this.http.get(`${this.baseUrl}/event/all`, this.httpHeaders);
  }

  public allPerUser(id): Observable<any>{
    return this.http.get(`${this.baseUrl}/event/all/${id}`, this.httpHeaders);
  }

  public show(id): Observable<any>{
    return this.http.get(`${this.baseUrl}/event/show/${id}`, this.httpHeaders);
  }

  public store(event): Observable<any>{
    return this.http.post(`${this.baseUrl}/event/create`, event, this.httpHeaders);
  }

  public get(id): Observable<any>{
    return this.http.get(`${this.baseUrl}/event/students/${id}`, this.httpHeaders);
  }

  public update(event, id): Observable<any>{
    return this.http.post(`${this.baseUrl}/event/update/${id}`, event, this.httpHeaders);
  }

  public updateStatus(event, id): Observable<any>{
    return this.http.post(`${this.baseUrl}/event/update/status/${id}`, event, this.httpHeaders);
  }

  public send(id): Observable<any>{
    return this.http.get(`${this.baseUrl}/event/send/${id}`, this.httpHeaders);
  }

  public destroy(id): Observable<any>{
    return this.http.get(`${this.baseUrl}/event/delete/${id}`, this.httpHeaders);
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
