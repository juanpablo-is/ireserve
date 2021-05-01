import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Restaurant } from './interfaces/restaurant';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  constructor(private http: HttpClient) { }

  createRestaurant(restaurant: Restaurant): any {
    const URL = `${environment.urlBackend}/api/restaurant`;

    return this.http
      .post(URL, restaurant, { observe: 'response' });
  }
}
