import { Component } from '@angular/core';
import { RestService } from 'src/app/services/backend/rest.service';
import { MapCustomService } from 'src/app/services/frontend/map-custom.service';

@Component({
  selector: 'app-home-user',
  templateUrl: './home-user.component.html',
  styleUrls: ['./home-user.component.sass']
})
export class HomeUserComponent {

  itemsRestaurant: any[] = [];
  restaurants: any[] = [];
  filter = 'todos';
  itemsCarouselRestaurant: any[] = [];
  itemsCategories: any[] = [
    { key: 'todos', name: 'Todos' },
    { key: 'restaurante', name: 'Restaurante' },
    { key: 'cafeteria', name: 'Cafetería' },
    { key: 'heladeria', name: 'Heladería' },
    { key: 'bar', name: 'Bar' }
  ];

  constructor(
    private restService: RestService,
    private locationService: MapCustomService
  ) {
    // Logica que consulta anuncios para modificar variable.
    this.restService.get('/api/ads')
      .then((result: any) => {
        if (result.ok && result.status === 200) {
          this.itemsCarouselRestaurant = result.body;
        }
      })
      .catch();

    this.locationService.getPosition()
      .subscribe(data => {
        this.restService.get(`/api/restaurants?lat=${data.lat}&lng=${data.lng}`).
          then(response => {
            if (response.ok && response.status === 200) {
              this.restaurants = response.body;
              this.itemsRestaurant = this.restaurants.slice().splice(0, 12);
              this.filterCategory(this.filter, true);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }, error => { });
  }

  /**
   * Filtra restaurante de acuerdo a la categoría.
   */
  filterCategory(category: string, auto = false): void {
    if (auto || this.filter !== category) {
      this.filter = category;

      if (category === 'todos') {
        this.itemsRestaurant = this.restaurants.slice().splice(0, 12);
        return;
      }

      this.itemsRestaurant = this.restaurants.filter((restaurant) => {
        return restaurant.type === category;
      }).slice().splice(0, 12);
    }
  }
}
