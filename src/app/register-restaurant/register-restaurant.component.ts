import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Restaurant } from '../restaurant';
import { RestaurantService } from '../restaurant.service';

@Component({
  selector: 'app-register-restaurant',
  templateUrl: './register-restaurant.component.html',
  styleUrls: ['./register-restaurant.component.sass']
})
export class RegisterRestaurantComponent implements OnInit {

  form: FormGroup;
  name: string;

  btnRegisterRestaurantText = 'REGISTRAR RESTAURANTE';

  constructor(
    private formBuilder: FormBuilder,
    private auth: AngularFireAuth,
    private router: Router,
    private service: RestaurantService
  ) {
    // tslint:disable-next-line: deprecation
    this.auth.user.subscribe(user => this.name = user.displayName);
    this.buildForm();
  }

  ngOnInit(): void {
  }

  registerRestaurant(event: Event): void {
    event.preventDefault();

    if (this.form.valid) {
      this.form.disable();
      this.btnRegisterRestaurantText = 'CARGANDO...';

      const restaurant: Restaurant = {
        name: this.form.value.name,
        address: this.form.value.address,
        dateStart: this.form.value.dateStart,
        dateEnd: this.form.value.dateEnd,
        phone: this.form.value.phone,
        countTables: this.form.value.countTables,
      };

      this.service.createRestaurant(restaurant)
        .subscribe(
          (result: { ok: any; status: number; }) => {
            this.btnRegisterRestaurantText = 'REGISTRAR RESTAURANTE';
            if (result.ok && result.status === 201) {
              this.router.navigate(['/']);
              return true;
            }
            this.form.enable();
            return false;
          },
          () => {
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
      countTables: ['', [Validators.required]]
    });
  }
}
