import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from 'src/app/services/backend/rest.service';
import { LocalStorageService } from 'src/app/services/frontend/local-storage.service';
import { UpdateToastService } from 'src/app/update-toast.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.sass']
})
export class UserInfoComponent {

  idUser: string;
  user: any = {};

  @ViewChild('firstname') firstname: ElementRef;
  @ViewChild('lastname') lastname: ElementRef;
  @ViewChild('phone ') phone: ElementRef;
  @ViewChild('oldpass') oldpass: ElementRef;
  @ViewChild('newpass') newpass: ElementRef;
  @ViewChild('confirmnewpass') confirmnewpass: ElementRef;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private restService: RestService,
    private serviceToast: UpdateToastService,
    private localStorageService: LocalStorageService
  ) {
    const user = this.localStorageService.getData('user');
    if (!user) { this.router.navigate(['/login']); return; }

    this.idUser = this.activatedRoute.snapshot.paramMap.get('id');
    if (!this.idUser) {
      this.router.navigate(['/profile']);
      return;
    }

    this.restService.get(`/api/user?uid=${this.idUser}`)
      .then(response => {
        if (response.ok && response.status === 200) {
          this.user = response.body.data;
        }
      })
      .catch(() => {
        this.router.navigate(['/profile']);
      });
  }

  /**
   * Metodo que actualiza la información del usuario.
   */
  updateUser(): void {
    if (this.newpass.nativeElement.value === this.confirmnewpass.nativeElement.value) {
      const user = {
        email: this.user.email,
        firstname: this.firstname.nativeElement.value,
        lastname: this.lastname.nativeElement.value,
        password: this.oldpass.nativeElement.value,
        newPass: this.newpass.nativeElement.value,
        phone: this.phone.nativeElement.value,
        role: this.user.role,
        uid: this.idUser
      };

      this.restService.put('/api/user', user)
        .then(response => {
          if (response.ok && response.status === 200) {
            this.user = user;
            delete user.password;
            delete user.newPass;

            this.localStorageService.clearStorage();
            this.localStorageService.updateData('user', user);

            this.serviceToast.updateData({
              title: 'Información actualizada',
              body: 'Su información de perfil ha sido actualizada.',
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
    } else {
      this.serviceToast.updateData({
        title: 'Las contraseñas no coinciden',
        body: 'Los valores de contraseña y confirmar contraseña no coinciden.',
        seconds: 4, status: false
      });
    }
  }

}
