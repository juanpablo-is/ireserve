import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private http: HttpClient) { }

  /**
   * Petición GET a backend para traer anuncios de publicidad.
   */
  getAds(): Promise<any> {
    const URL = `${environment.urlBackend}/api/ads`;
    return this.http.get<any>(URL).toPromise();
  }
}
