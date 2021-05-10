import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RestaurantComponent {

  constructor() { }

  data = {
    name: 'MdD',
    urlPhoto: 'https://e00-expansion.uecdn.es/assets/multimedia/imagenes/2019/06/25/15614775255199.jpg',
    type: 'Heladeria',
    open: true,
    phone: 3212312,
    stars: 4.2,
    countStars: 521,
    email: 'jua@asomc.com'
  };

  objectKeys = Object.keys;
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
