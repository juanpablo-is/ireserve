import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from 'src/app/services/backend/rest.service';
import { LocalStorageService } from 'src/app/services/frontend/local-storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent {

  user: any;
  restaurant: any;
  urlPhoto = 'https://image.flaticon.com/icons/png/512/16/16363.png';

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private restService: RestService
  ) {
    this.user = this.localStorageService.getData('user');
    if (!this.user) { this.router.navigate(['/login']); return; }

    if (this.user.role === 'Cliente') {
      this.restService.get(`/api/restaurant/${this.user.idRestaurant}`)
        .then(response => {
          if (response.ok && response.status === 200) {
            this.restaurant = response.body;
            this.urlPhoto = this.restaurant.urlPhoto;
          } else {
            this.router.navigate(['/']);
          }
        })
        .catch(() => {
          this.router.navigate(['/']);
        });
    }
  }

  /**
   * Cierra sessión en el aplicativo.
   */
  closeSession(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }

}
