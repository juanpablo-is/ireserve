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

  constructor(
    private router: Router
  ) {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) { this.router.navigate(['/login']); return; }

    if (user.role === 'Cliente') {
      this.isUser = false;
    } else {
      this.isUser = true;
      this.itemsRestaurant.push({
        photo: 'https://www.eltiempo.com/files/image_640_428/files/crop/uploads/2019/08/09/5d4d7d63aa20a.r_1565380898512.0-0-3000-1488.jpeg',
        name: 'McDonalds',
        starts: 5,
        diff: '75m',
        open: true
      });
      this.itemsRestaurant.push({
        photo: 'https://www.eltiempo.com/files/image_640_428/files/crop/uploads/2019/08/09/5d4d7d63aa20a.r_1565380898512.0-0-3000-1488.jpeg',
        name: 'McDonalds',
        starts: 5,
        diff: '75m',
        open: true
      });
    }
  }

}
