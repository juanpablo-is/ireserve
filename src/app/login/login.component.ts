import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  alertError: string;
  alertSuccess: string;

  btnLoginText = 'INICIAR SESIÓN';

  constructor(private formBuilder: FormBuilder,
              private auth: AngularFireAuth,
              private router: Router,
              private firestore: AngularFirestore
  ) { }

  ngOnInit(): void {
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
      .then(() => {
        this.firestore.collection('users', ref => ref.where('email', '==', this.form.value.email).where('password', '==', this.form.value.password))
          .get()
          .subscribe(snap => {
            this.btnLoginText = 'INICIAR SESIÓN';
            if (snap.docs.length !== 0) {
              const user: any = snap.docs[0].data();

              this.alertSuccess = `¡Bienvenido ${user.firstname}!`;
              return this.router.navigate(['/']);
            }

            return this.alertError = 'Se ha presentado un error, intente nuevamente';
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
