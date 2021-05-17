import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bottom-navigation',
  templateUrl: './bottom-navigation.component.html',
  styleUrls: ['./bottom-navigation.component.sass']
})
export class BottomNavigationComponent implements OnInit {

  @Input() user: any;
  buttons: any[] = [];

  constructor(public route: Router) { }

  ngOnInit(): void {
    
    if (this.user.role === 'Cliente') {
      this.buttons.push({ name: 'Inicio', iconClass: 'fas fa-home', routing: '/' });
      this.buttons.push({ name: 'Reservación', iconClass: 'far fa-calendar-alt', routing: '/reservations' });
      this.buttons.push({ name: 'Menú', iconClass: 'fas fa-book-open', routing: '/menu' });
      this.buttons.push({ name: 'Profile', iconClass: 'fas fa-user-circle', routing: '/profile' });
    } else {
      this.buttons.push({ name: 'Inicio', iconClass: 'fas fa-home', routing: '/' });
      this.buttons.push({ name: 'Reservación', iconClass: 'far fa-calendar-alt', routing: '/reservations' });
      this.buttons.push({ name: 'Profile', iconClass: 'fas fa-user-circle', routing: '/profile' });
    }
  }

}
