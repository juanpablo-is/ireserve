import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reservation } from 'src/app/interfaces/reservation';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private http: HttpClient) { }

  createReservation(reservation: Reservation): Promise<any> {
    const URL = `${environment.urlBackend}/api/reservation`;
    return this.http.post<any>(URL, reservation, { observe: 'response' }).toPromise();
  }
}
