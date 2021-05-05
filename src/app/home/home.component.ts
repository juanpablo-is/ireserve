import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent {

  isUser: boolean;
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
    }
  }

}
