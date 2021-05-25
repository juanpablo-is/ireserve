import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestService } from 'src/app/services/backend/rest.service';
import { LocalStorageService } from 'src/app/services/frontend/local-storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-restaurant-info',
  templateUrl: './restaurant-info.component.html',
  styleUrls: ['./restaurant-info.component.sass']
})
export class RestaurantInfoComponent {

  form: FormGroup;
  user: any;

  @ViewChild('address') address: ElementRef;
  @ViewChild('countTables') countTables: ElementRef;
  @ViewChild('dateStart') dateStart: ElementRef;
  @ViewChild('dateEnd') dateEnd: ElementRef;
  @ViewChild('name') name: ElementRef;
  @ViewChild('phone') phone: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private restService: RestService,
    private localStorageService: LocalStorageService
  ) {
    this.user = this.localStorageService.getData('user');
    if (!this.user) { this.router.navigate(['/login']); return; }

    this.restService.get(`/api/restaurant/${this.user.idRestaurant}`)
      .then(response => {
        if (response.ok && response.status === 200) {
          this.buildForm(response.body);
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
      name: this.name.nativeElement.value,
      phone: this.phone.nativeElement.value
    };

    this.restService.put(`/api/restaurant/${this.user.idRestaurant}`, restaurant)
      .then(response => {
        if (response.ok && response.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Información actualizada',
            html: 'Su información de restaurante ha sido actualizada.',
            confirmButtonText: 'Cerrar',
            timer: 7000
          });

          this.router.navigate(['/profile']);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar',
            html: 'No fue posible actualizar su información, intente nuevamente.',
            confirmButtonText: 'Cerrar',
          });
        }
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          html: 'No fue posible actualizar su información, intente nuevamente.',
          confirmButtonText: 'Cerrar',
        });
      });
  }

  /**
   * Crea formulario reactivo.
   */
  private buildForm(restaurant): void {
    this.form = this.formBuilder.group({
      countTables: [restaurant.countTables, [Validators.required]],
      dateStart: [restaurant.dateStart, [Validators.required]],
      dateEnd: [restaurant.dateEnd, [Validators.required]],
      name: [restaurant.name, [Validators.required]],
      phone: [restaurant.phone, [Validators.required]]
    });
  }
}
