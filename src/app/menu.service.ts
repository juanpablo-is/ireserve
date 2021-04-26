import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
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

  addMenuItem(body): any {
    const promesa = new Promise((resolve, reject) => {
      const URL = `${environment.urlBackend}/api/menu`;
      this.http.post<any>(URL, body).toPromise().then(res => {
        alert(res.res);
      });
    });
  }
}
