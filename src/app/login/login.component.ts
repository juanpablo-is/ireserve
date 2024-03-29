import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestService } from '../services/backend/rest.service';
import { LocalStorageService } from '../services/frontend/local-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {

  form: FormGroup;

  alertError: string;
  alertSuccess: string;

  btnLoginText = 'INICIAR SESIÓN';

  constructor(
    private formBuilder: FormBuilder,
    private auth: AngularFireAuth,
    private router: Router,
    private restService: RestService,
    private localStorageService: LocalStorageService
  ) {
    const user = this.localStorageService.getData('user');
    if (user) { this.router.navigate(['/']); return; }

    this.buildForm();
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6), Validators.required]]
    });
  }

  loginUser(event: Event): void {
    event.preventDefault();
    this.btnLoginText = 'CARGANDO...';

    this.auth.signInWithEmailAndPassword(this.form.value.email, this.form.value.password)
      .then((data) => {
        this.restService.get(`/api/user/${data.user.uid}`)
          .then((result: any) => {
            if (result.ok && result.status === 200) {
              if (result.body.data) {
                this.alertSuccess = `¡Bienvenido ${result.body.data.firstname}!`;
                this.localStorageService.updateData('user', result.body.data);

                this.router.navigate(['/']);
              } else {
                console.error(result.body);
                this.alertError = 'Se ha presentado un error, intente nuevamente';
              }
            }
          });
      }).catch(response => {
        this.btnLoginText = 'INICIAR SESIÓN';
        this.alertError = this.catchError(response.code);
      });
  }

  catchError(message: string): string {
    switch (message) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Inicio sesión incorrecto, intente nuevamente.';
      default:
        return '';
    }
  }
}
