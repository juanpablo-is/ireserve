import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from '../services/backend/rest.service';
import { LocalStorageService } from '../services/frontend/local-storage.service';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.sass']
})
export class RestaurantComponent {

  idRestaurant: any;
  data: any = {};
  objectKeys = Object.keys;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private restService: RestService,
    private localStorageService: LocalStorageService
  ) {
    const user = this.localStorageService.getData('user');
    if (!user) { this.router.navigate(['/login']); return; }

    this.idRestaurant = this.activatedRoute.snapshot.paramMap.get('id');
    if (!this.idRestaurant) {
      this.router.navigate(['/']);
      return;
    }

    this.restService.get(`/api/restaurant/${this.idRestaurant}`)
      .then(response => {
        if (response.ok && response.status === 200) {
          console.log(response.body);
          this.data = response.body;
        }
      })
      .catch();
  }

  menu = {
    breakfast: [
      {
        description: 'Hamburguesa con integrantes saludables',
        name: 'Hamburguesa especial',
        price: 2000,
        urlPhoto: 'https://firebasestorage.googleapis.com/v0/b/ireserve-e279b.appspot.com/o/hamburguesa-beyond-meat-scaled-e1577396155298.png-1619998200871?alt=media&token=64b20bcc-4acd-4c28-895f-0efa4289943e'
      }
    ],
    waffles: [
      {
        description: 'waffles con integrantes saludables',
        name: 'waffles especial',
        price: 2000,
        urlPhoto: 'https://firebasestorage.googleapis.com/v0/b/ireserve-e279b.appspot.com/o/hamburguesa-beyond-meat-scaled-e1577396155298.png-1619998200871?alt=media&token=64b20bcc-4acd-4c28-895f-0efa4289943e'
      }
    ],
  };

  transformKey = {
    breakfast: 'Desayunos',
    waffles: 'Waffles'
  };

}
