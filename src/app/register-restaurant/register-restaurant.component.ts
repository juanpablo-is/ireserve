import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Restaurant } from '../restaurant';
import { RestaurantService } from '../restaurant.service';

@Component({
  selector: 'app-register-restaurant',
  templateUrl: './register-restaurant.component.html',
  styleUrls: ['./register-restaurant.component.sass']
})
export class RegisterRestaurantComponent {

  form: FormGroup;
  name: string;
  idUser: string;
  alertError: string;
  file: any;

  btnRegisterRestaurantText = 'REGISTRAR RESTAURANTE';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private service: RestaurantService
  ) {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) { this.router.navigate(['/']); return; }

    this.name = user.firstname;
    this.idUser = user.email;

    this.buildForm();
  }

  /**
   * Función para registrar un restaurante en el backend.
   */
  registerRestaurant(event: Event): void {
    event.preventDefault();

    if (this.form.valid) {
      this.form.disable();
      this.btnRegisterRestaurantText = 'CARGANDO...';

      const restaurant: Restaurant = {
        idUser: this.idUser,
        name: this.form.value.name,
        address: this.form.value.address,
        dateStart: this.form.value.dateStart,
        dateEnd: this.form.value.dateEnd,
        phone: this.form.value.phone,
        countTables: this.form.value.countTables,
      };

      this.service.createRestaurant(restaurant)
        .subscribe(
          (result: { ok: any; status: number; body: any }) => {
            this.btnRegisterRestaurantText = 'REGISTRAR RESTAURANTE';
            if (result.ok && result.status === 201) {
              this.router.navigate(['/set-menu'], { queryParams: { idRestaurant: result.body.idRestaurant } });
              return true;
            }
            this.form.enable();
            return false;
          },
          () => {
            this.alertError = 'Se ha presentado un error, intente nuevamente';
            this.btnRegisterRestaurantText = 'REGISTRAR RESTAURANTE';
            this.form.enable();
            return false;
          },
        );
    }
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      dateStart: ['', [Validators.required]],
      dateEnd: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      countTables: ['', [Validators.required]],
      filePhoto: ['', [Validators.required]]
    });
  }

  // Almacena el elemento image.
  changeFile(event: any): void {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }
}
