import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnswersService {

  constructor(
    private http: HttpClient
  ) { }

  public all(): Observable<any>{
    return this.http.get(`${this.baseUrl}/event/all`, this.httpHeaders);
  }

  public store(answer): Observable<any>{
    return this.http.post(`${this.baseUrl}/answer/create`, answer, this.httpHeaders);
  }

  public getAnswers(id): Observable<any>{
    return this.http.get(`${this.baseUrl}/answer/event/${id}`, this.httpHeaders);
  }

  public checkAnswers(id, event): Observable<any>{
    return this.http.get(`${this.baseUrl}/answer/${id}/${event}`, this.httpHeaders);
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
