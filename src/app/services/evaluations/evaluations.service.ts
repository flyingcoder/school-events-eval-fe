import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EvaluationsService {

  constructor(
    private http: HttpClient
  ) { }

  public all(): Observable<any>{
    return this.http.get(`${this.baseUrl}/evaluation/all`, this.httpHeaders);
  }

  public allPerUser(id): Observable<any>{
    return this.http.get(`${this.baseUrl}/evaluation/all/${id}`, this.httpHeaders);
  }

  public show(id): Observable<any>{
    return this.http.get(`${this.baseUrl}/evaluation/show/${id}`, this.httpHeaders);
  }

  public store(evaluation): Observable<any>{
    return this.http.post(`${this.baseUrl}/evaluation/create`, evaluation, this.httpHeaders);
  }

  public storeCriteria(criteria): Observable<any>{
    return this.http.post(`${this.baseUrl}/criteria/create`, criteria, this.httpHeaders);
  }

  public storeSubcriteria(subcriteria): Observable<any>{
    return this.http.post(`${this.baseUrl}/subcriteria/create`, subcriteria, this.httpHeaders);
  }

  public destroy(id): Observable<any>{
    return this.http.get(`${this.baseUrl}/evaluation/delete/${id}`, this.httpHeaders);
  }

  public destroyCriteria(id): Observable<any>{
    return this.http.get(`${this.baseUrl}/criteria/delete/${id}`, this.httpHeaders);
  }

  public destroySubriteria(id): Observable<any>{
    return this.http.get(`${this.baseUrl}/subcriteria/delete/${id}`, this.httpHeaders);
  }

  public destroySubcriteria(id): Observable<any>{
    return this.http.get(`${this.baseUrl}/subcriteria/delete/${id}`, this.httpHeaders);
  }

  public update(evaluation, id): Observable<any>{
    return this.http.post(`${this.baseUrl}/evaluation/update/${id}`, evaluation, this.httpHeaders);
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
