import { Component } from '@angular/core';
import { RestService } from 'src/app/services/backend/rest.service';

@Component({
  selector: 'app-home-user',
  templateUrl: './home-user.component.html',
  styleUrls: ['./home-user.component.sass']
})
export class HomeUserComponent {

  itemsRestaurant: any[] = [];
  itemsCarouselRestaurant: any[] = [];

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
          this.itemsRestaurant = response.body;
        }
      })
      .catch();
  }
}
