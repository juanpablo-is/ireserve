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

  getMenu(): Observable<RootObject> {
    const constId = 'juan@ireserve.com';
    const URL = `${environment.urlBackend}/api/menu?idUser=${constId}`;
    return this.http.get<RootObject>(URL);
  }

  addMenuItem(body: any): Promise<any> {
    const URL = `${environment.urlBackend}/api/menu`;
    return this.http.post<any>(URL, body).toPromise();
  }
}
