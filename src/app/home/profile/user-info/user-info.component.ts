import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestService } from 'src/app/services/backend/rest.service';
import { LocalStorageService } from 'src/app/services/frontend/local-storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.sass']
})
export class UserInfoComponent {

  form: FormGroup;
  user: any = {};

  @ViewChild('firstname') firstname: ElementRef;
  @ViewChild('lastname') lastname: ElementRef;
  @ViewChild('phone ') phone: ElementRef;
  @ViewChild('oldpass') oldpass: ElementRef;
  @ViewChild('newpass') newpass: ElementRef;
  @ViewChild('confirmnewpass') confirmnewpass: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private restService: RestService,
    private localStorageService: LocalStorageService
  ) {
    this.user = this.localStorageService.getData('user');
    if (!this.user) { this.router.navigate(['/login']); return; }

    this.buildForm(this.user);
  }

  /**
   * Metodo que actualiza la información del usuario.
   */
  updateUser(): void {
    if (this.newpass.nativeElement.value === this.confirmnewpass.nativeElement.value) {
      const user = {
        firstname: this.firstname.nativeElement.value,
        lastname: this.lastname.nativeElement.value,
        password: this.oldpass.nativeElement.value,
        newPass: this.newpass.nativeElement.value,
        phone: this.phone.nativeElement.value
      };

      this.restService.put(`/api/user/${this.user.uid}`, user)
        .then(response => {
          if (response.ok && response.status === 200) {
            this.user = { ...this.user, ...user };
            delete this.user.password;
            delete this.user.newPass;

            this.localStorageService.updateData('user', this.user);

            Swal.fire({
              icon: 'success',
              title: 'Información actualizada',
              html: 'Su información de perfil ha sido actualizada.',
              confirmButtonText: 'Cerrar',
              timer: 5000
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
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        html: 'No fue posible actualizar su información, intente nuevamente.',
        confirmButtonText: 'Cerrar',
      });
    }
  }

  /**
   * Crea formulario reactivo.
   */
  private buildForm(user: any): void {
    this.form = this.formBuilder.group({
      firstname: [user.firstname, [Validators.required]],
      lastname: [user.lastname, [Validators.required]],
      phone: [user.phone, [Validators.required]],
      password: [null, [Validators.minLength(6), Validators.required]],
      newPassword: [null, [Validators.minLength(6), Validators.required]],
      confirmNewPassword: [null, [Validators.minLength(6), Validators.required]]
    });
  }

}
