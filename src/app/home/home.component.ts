import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../services/frontend/local-storage.service';

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
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    this.user = this.localStorageService.getData('user');
    if (!this.user) { this.router.navigate(['/login']); return; }

    if (this.user.role === 'Cliente') {
      this.isUser = false;
    } else {
      this.isUser = true;
    }
  }

}
