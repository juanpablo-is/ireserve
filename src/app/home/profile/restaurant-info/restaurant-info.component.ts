import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from 'src/app/services/backend/rest.service';
import { LocalStorageService } from 'src/app/services/frontend/local-storage.service';
import { UpdateToastService } from 'src/app/update-toast.service';

@Component({
  selector: 'app-restaurant-info',
  templateUrl: './restaurant-info.component.html',
  styleUrls: ['./restaurant-info.component.sass']
})
export class RestaurantInfoComponent {

  user: any;
  restaurant: any = {};

  @ViewChild('address') address: ElementRef;
  @ViewChild('countTables') countTables: ElementRef;
  @ViewChild('dateStart') dateStart: ElementRef;
  @ViewChild('dateEnd') dateEnd: ElementRef;
  @ViewChild('name') name: ElementRef;
  @ViewChild('phone') phone: ElementRef;

  constructor(
    private router: Router,
    private restService: RestService,
    private serviceToast: UpdateToastService,
    private localStorageService: LocalStorageService
  ) {
    this.user = this.localStorageService.getData('user');
    if (!this.user) { this.router.navigate(['/login']); return; }

    this.restService.get(`/api/restaurant/${this.user.idRestaurant}`)
      .then(response => {
        if (response.ok && response.status === 200) {
          this.restaurant = response.body;
        }
      })
      .catch(() => {
        this.router.navigate(['/profile']);
      });
  }

  /**
   * Método que actualiza información del restaurante.
   */
  updateRestaurant(): void {
    const restaurant = {
      address: this.address.nativeElement.value,
      countTables: this.countTables.nativeElement.value,
      dateStart: this.dateStart.nativeElement.value,
      dateEnd: this.dateEnd.nativeElement.value,
      idUser: this.user.uid,
      name: this.name.nativeElement.value,
      open: this.restaurant.open,
      phone: this.phone.nativeElement.value,
      stars: this.restaurant.stars,
      type: this.restaurant.type,
      urlPhoto: this.restaurant.urlPhoto,
      idRestaurant: this.user.idRestaurant
    };

    this.restService.put('/api/restaurant', restaurant)
      .then(response => {
        if (response.ok && response.status === 200) {
          this.restaurant = restaurant;

          this.serviceToast.updateData({
            title: 'Información actualizada',
            body: 'Su información de restaurante ha sido actualizada.',
            seconds: 7, status: true
          });

          this.router.navigate(['/profile']);
        } else {
          this.serviceToast.updateData({
            title: 'Error al actualizar',
            body: 'No fue posible actualizar su información, intente nuevamente.',
            seconds: 4, status: false
          });
        }
      })
      .catch(() => {
        this.serviceToast.updateData({
          title: 'Error al actualizar',
          body: 'No fue posible actualizar su información, intente nuevamente.',
          seconds: 4, status: false
        });
      });
  }

}
