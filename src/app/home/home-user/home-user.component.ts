import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/backend/utils/utils.service';

@Component({
  selector: 'app-home-user',
  templateUrl: './home-user.component.html',
  styleUrls: ['./home-user.component.sass']
})
export class HomeUserComponent implements OnInit {

  itemsRestaurant: any[] = [];
  itemsCarouselRestaurant: any[] = [];

  constructor(
    private services: UtilsService
  ) {

    // Logica que consulta anuncios para modificar variable.
    this.services.getAds()
      .then(ads => {
        this.itemsCarouselRestaurant = ads;
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
