import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/backend/rest.service';

@Component({
  selector: 'app-home-user',
  templateUrl: './home-user.component.html',
  styleUrls: ['./home-user.component.sass']
})
export class HomeUserComponent implements OnInit {

  itemsRestaurant: any[] = [];
  itemsCarouselRestaurant: any[] = [];

  constructor(
    private restService: RestService
  ) {

    // Logica que consulta anuncios para modificar variable.
    this.restService.get('/api/ads')
      .then((result: { ok: any; status: number; body: any }) => {
        if (result.ok && result.status === 201) {
          this.itemsCarouselRestaurant = result.body;
        }
      })
      .catch(e => { console.log(e); });

    this.itemsRestaurant.push({
      photo: 'https://e00-expansion.uecdn.es/assets/multimedia/imagenes/2019/06/25/15614775255199.jpg',
      name: 'McDonalds',
      stars: 1,
      diff: '75m',
      open: true,
      category: 'heladeria'
    });
    this.itemsRestaurant.push({
      photo: 'https://e00-expansion.uecdn.es/assets/multimedia/imagenes/2019/06/25/15614775255199.jpg',
      name: 'McDonalds',
      stars: 3,
      diff: '75m',
      open: true,
      category: 'heladeria'
    });
  }

  ngOnInit(): void {
  }

}
