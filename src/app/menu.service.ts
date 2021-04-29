import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { RootObject } from './menu';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  constructor(private http: HttpClient) { }

  getMenu(idRestaurant: string): Observable<RootObject> {
    const URL = `${environment.urlBackend}/api/menu?idRestaurant=${idRestaurant}`;
    return this.http.get<RootObject>(URL);
  }

  addMenuItem(body: any): Promise<any> {
    const URL = `${environment.urlBackend}/api/menu`;
    return this.http.post<any>(URL, body).toPromise();
  }
}
