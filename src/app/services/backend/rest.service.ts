import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  constructor(private http: HttpClient) { }

  private URL = `${environment.urlBackend}`;

  get(url: string): Promise<any> {
    return this.http.get(`${this.URL}${url}`, { observe: 'response' }).toPromise();
  }

  post(url: string, body: any): Promise<any> {
    return this.http.post(`${this.URL}${url}`, body, { observe: 'response' }).toPromise();
  }
}
