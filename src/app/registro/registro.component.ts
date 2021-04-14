import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.sass']
})
export class RegistroComponent implements OnInit {

  form: FormGroup;

  alertError: String;
  alertSuccess: String;

  constructor(private formBuilder: FormBuilder,
    private auth: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required]],
      role: ['', [Validators.required]]
    });
  }

  registerRole(event: Event): void {
    event.preventDefault();

    if (this.form.valid) {
      this.createUser();
    }
  }

  createUser(): void {
    this.auth.createUserWithEmailAndPassword(this.form.value.email, this.form.value.password)
      .then(() => {
        this.firestore.collection("users").add(this.form.value)
          .then(() => {
            this.alertSuccess = "Registro exitoso, ingrese sesión";
            this.router.navigate(["/login"]);
          });
      }).catch(response => {
        this.alertError = this.catchError(response.code);
      });
  }

  catchError(message: String): String {
    switch (message) {
      case "auth/invalid-email":
        return "Formato de correo invalido.";
      default:
        return "";
    }
  }
}
