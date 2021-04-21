import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Restaurant } from './restaurant';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  constructor(private http: HttpClient) { }

  createRestaurant(restaurant: Restaurant): any {
    const URL = 'http://localhost:3000/api/restaurant';
    return this.http
      .post(URL, restaurant, { observe: 'response' });
  }
}
