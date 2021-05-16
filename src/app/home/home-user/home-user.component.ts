import { Component } from '@angular/core';
import { RestService } from 'src/app/services/backend/rest.service';

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
    private restService: RestService
  ) {
    // Logica que consulta anuncios para modificar variable.
    this.restService.get('/api/ads')
      .then((result: any) => {
        if (result.ok && result.status === 200) {
          this.itemsCarouselRestaurant = result.body;
        }
      })
      .catch();

    // Servicio para captar restaurantes.
    this.restService.get('/api/restaurants').
      then(response => {
        if (response.ok && response.status === 200) {
          this.restaurants = response.body;
          this.itemsRestaurant = this.restaurants.slice().splice(0, 12);
        }
      })
      .catch();
  }

  /**
   * Filtra restaurante de acuerdo a la categoría.
   */
  filterCategory(category: string): void {
    if (this.filter === category) { return; }
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
