import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getDataLogin(uid: string): Promise<any> {
    const URL = `${environment.urlBackend}/api/user?uid=${uid}`;
    return this.http.get<any>(URL).toPromise();
  }
}
