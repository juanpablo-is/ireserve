import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReservationComponent } from './home/home-user/reservation/reservation.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { RegisterRestaurantComponent } from './register-restaurant/register-restaurant.component';
import { RegistroComponent } from './registro/registro.component';
import { SetMenuComponent } from './set-menu/set-menu.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistroComponent },
  { path: 'register-restaurant', component: RegisterRestaurantComponent },
  { path: 'set-menu', component: SetMenuComponent },
  { path: 'reservation', redirectTo: '' },
  { path: 'reservation/:id', component: ReservationComponent },
  { path: 'reservations', component: ReservationsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
