import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterRestaurantComponent } from './register-restaurant/register-restaurant.component';
import { RegistroComponent } from './registro/registro.component';
import { SetMenuComponent } from './set-menu/set-menu.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistroComponent },
  { path: 'register-restaurant', component: RegisterRestaurantComponent },
  { path: 'set-menu', component: SetMenuComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
