import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    private service: RestaurantService
  ) {
    this.auth.user.subscribe(user => this.name = user.displayName);
    this.buildForm();
    service.get();
  }

  ngOnInit(): void {
  }

  registerRestaurant(event: Event): void {
    event.preventDefault();

    if (this.form.valid) {
      this.btnRegisterRestaurantText = 'CARGANDO...';
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
