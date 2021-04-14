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

  constructor(private formBuilder: FormBuilder,
    private auth: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6), Validators.required]]
    });
  }

  loginUser(event: Event) {
    event.preventDefault();
    this.auth.signInWithEmailAndPassword(this.form.value.email, this.form.value.password)
      .then(() => {
        this.firestore.collection('users', ref => ref.where('email', '==', this.form.value.email).where('password', '==', this.form.value.password))
          .get()
          .subscribe(snap => {
            if (snap.docs.length === 0) {
            } else {
              this.router.navigate(['/']);
            }
          });

      }).catch(response => {
        console.log(response.message);
      });
  }
}
