import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent {

  isUser: boolean;
  itemsRestaurant: any[] = [];
  itemsBannerRestaurant: any[] = [];
  buttons: any[] = [];

  constructor(
    private router: Router
  ) {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) { this.router.navigate(['/login']); return; }

    if (user.role === 'Cliente') {
      this.isUser = false;
      this.buttons.push({ name: 'Inicio', iconClass: 'fas fa-home' });
      this.buttons.push({ name: 'Reservación', iconClass: 'far fa-calendar-alt' });
      this.buttons.push({ name: 'Menú', iconClass: 'fas fa-book-open' });
      this.buttons.push({ name: 'Profile', iconClass: 'fas fa-user-circle' });
    } else {
      this.isUser = true;

      this.buttons.push({ name: 'Inicio', iconClass: 'fas fa-home' });
      this.buttons.push({ name: 'Reservación', iconClass: 'far fa-calendar-alt' });
      this.buttons.push({ name: 'Profile', iconClass: 'fas fa-user-circle' });

      this.itemsBannerRestaurant.push({ url: 'https://e00-expansion.uecdn.es/assets/multimedia/imagenes/2019/06/25/15614775255199.jpg', name: 'Mc Donalds', desc: 'Obten un 50% en tu segundo almuerzo' });
      this.itemsBannerRestaurant.push({ url: './assets/icons/banner.jpg', name: 'Mc Donalds', desc: 'Obten un 50% en tu segundo almuerzo' });

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
  }

}
