import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { HttpClientModule } from '@angular/common/http';
import { MbscModule } from '@mobiscroll/angular';

import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { RegisterRestaurantComponent } from './register-restaurant/register-restaurant.component';
import { SetMenuComponent } from './set-menu/set-menu.component';
import { MenuOptionComponent } from './set-menu/menu-option/menu-option.component';
import { MenuItemComponent } from './set-menu/menu-option/menu-item/menu-item.component';
import { HomeComponent } from './home/home.component';
import { CardRestaurantComponent } from './home/card-restaurant/card-restaurant.component';
import { BottomNavigationComponent } from './home/bottom-navigation/bottom-navigation.component';
import { HomeClientComponent } from './home/home-client/home-client.component';
import { HomeUserComponent } from './home/home-user/home-user.component';
import { ReservationComponent } from './home/home-user/reservation/reservation.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistroComponent,
    RegisterRestaurantComponent,
    SetMenuComponent,
    MenuOptionComponent,
    MenuItemComponent,
    HomeComponent,
    CardRestaurantComponent,
    BottomNavigationComponent,
    HomeClientComponent,
    HomeUserComponent,
    ReservationComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    ReactiveFormsModule,
    MbscModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
