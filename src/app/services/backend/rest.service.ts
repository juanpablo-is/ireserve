import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { RootObject } from 'src/app/interfaces/menu';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  constructor(private http: HttpClient) { }

  private URL = `${environment.urlBackend}`;

  get(url: string): Promise<any> {
    return this.http.get(`${this.URL}${url}`).toPromise();
  }

  post(url: string, body: any): Promise<any> {
    return this.http.post(`${this.URL}${url}`, body, { observe: 'response' }).toPromise();
  }

  getMenu(idRestaurant: string): Observable<RootObject> {
    const URL = `${environment.urlBackend}/api/menu?idRestaurant=${idRestaurant}`;
    return this.http.get<RootObject>(URL);
  }

  addMenuItem(body: any): Promise<any> {
    const URL = `${environment.urlBackend}/api/menu`;
    return this.http.post<any>(URL, body).toPromise();
  }
}
