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
  user: any;

  constructor(
    private router: Router
  ) {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    if (!this.user) { this.router.navigate(['/login']); return; }

    if (this.user.role === 'Cliente') {
      this.isUser = false;
    } else {
      this.isUser = true;
    }
  }

}
