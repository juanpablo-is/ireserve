import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReservationComponent } from './home/home-user/reservation/reservation.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { RegisterRestaurantComponent } from './register-restaurant/register-restaurant.component';
import { RegistroComponent } from './registro/registro.component';
import { SetMenuComponent } from './set-menu/set-menu.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { ProfileComponent } from './home/profile/profile.component';
import { UserInfoComponent } from './home/profile/user-info/user-info.component';
import { RestaurantInfoComponent } from './home/profile/restaurant-info/restaurant-info.component';
import { MenuComponent } from './menu/menu.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistroComponent },
  { path: 'register-restaurant', component: RegisterRestaurantComponent },
  { path: 'set-menu', component: SetMenuComponent },
  { path: 'reservation', redirectTo: '' },
  { path: 'reservation/:id', component: ReservationComponent },
  { path: 'reservations', component: ReservationsComponent },
  { path: 'restaurant', redirectTo: '' },
  { path: 'restaurant/:id', component: RestaurantComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'user-info', component: UserInfoComponent },
  { path: 'restaurant-info', component: RestaurantInfoComponent },
  { path: 'menu', component: MenuComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
