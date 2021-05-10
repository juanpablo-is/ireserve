import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseStorageService } from '../services/firebase-storage/firebase-storage-service';
import { Restaurant } from '../interfaces/restaurant';
import { finalize } from 'rxjs/operators';
import { RestService } from '../services/backend/rest.service';
import { LocalStorageService } from '../services/frontend/local-storage.service';

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
    private restService: RestService,
    private serviceStorage: FirebaseStorageService,
    private localStorageService: LocalStorageService
  ) {
    const user = this.localStorageService.getData('user');
    if (!user) { this.router.navigate(['/login']); return; }

    this.name = user.firstname;
    this.idUser = user.uid;

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
        type: this.form.value.type,
        name: this.form.value.name,
        address: this.form.value.address,
        dateStart: this.form.value.dateStart,
        dateEnd: this.form.value.dateEnd,
        phone: this.form.value.phone,
        countTables: this.form.value.countTables,
        urlPhoto: ''
      };

      const filePath = `${restaurant.name}-${Date.now()}`;
      const referenceFile = this.serviceStorage.referenceStorage(filePath);
      const taskUpload = this.serviceStorage.uploadStorage(filePath, this.file);
      taskUpload.snapshotChanges().pipe(
        finalize(() => {
          referenceFile.getDownloadURL().subscribe((url: string) => {
            restaurant.urlPhoto = url;
            this.restService.post('/api/restaurant', restaurant)
              .then((result: { ok: any; status: number; body: any }) => {
                this.btnRegisterRestaurantText = 'REGISTRAR RESTAURANTE';
                if (result.ok && result.status === 201) {
                  const user = this.localStorageService.getData('user');
                  user.idRestaurant = result.body.idRestaurant;
                  user.typeRestaurant = restaurant.type;
                  this.localStorageService.updateData('user', user);

                  this.router.navigate(['/set-menu']);
                  return true;
                }
                this.form.enable();
                return false;
              })
              .catch(() => {
                this.alertError = 'Se ha presentado un error, intente nuevamente';
                this.btnRegisterRestaurantText = 'REGISTRAR RESTAURANTE';
                this.form.enable();
                return false;
              });
          });
        })
      ).subscribe();
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
      type: ['', [Validators.required]],
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
