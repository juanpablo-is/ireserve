import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../services/backend/user/user.service';

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
    private userService: UserService
  ) {
    const user = sessionStorage.getItem('user');
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
        this.userService.getDataLogin(data.user.uid)
          .then((response: any) => {
            if (response.data) {
              this.alertSuccess = `¡Bienvenido ${response.data.firstname}!`;
              sessionStorage.setItem('user', JSON.stringify(response.data));

              this.router.navigate(['/']);
            } else {
              console.error(response);
              this.alertError = 'Se ha presentado un error, intente nuevamente';
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
