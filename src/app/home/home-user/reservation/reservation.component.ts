import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { setOptions, MbscDatepicker, localeEs } from '@mobiscroll/angular';
import { Reservation } from 'src/app/interfaces/reservation';
import { ReservationService } from 'src/app/services/backend/reservation/reservation.service';
import { RestaurantService } from 'src/app/services/backend/restaurant/restaurant.service';

setOptions({
  locale: localeEs,
  theme: 'windows',
  themeVariant: 'light',
  calendarType: 'week'
});
@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.sass']
})
export class ReservationComponent {

  @ViewChild('spinner') spinner: ElementRef;
  @ViewChild('picker', { static: false }) inst!: MbscDatepicker;
  @ViewChild('inputName') inputName: ElementRef;
  @ViewChild('inputPhone') inputPhone: ElementRef;

  data: any = {};
  idRestaurant: string;

  countChairs = 2;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private serviceRestaurant: RestaurantService,
    private serviceReservation: ReservationService
  ) {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) { this.router.navigate(['/login']); return; }

    this.idRestaurant = this.activatedRoute.snapshot.paramMap.get('id');
    if (!this.idRestaurant) {
      this.router.navigate(['/']);
      return;
    }

    this.serviceRestaurant.getRestaurant(this.idRestaurant)
      .then(data => {
        this.data = data.body;
        this.data.user = user;

        if (!(data.ok && data.status === 200) || this.data === null) {
          return this.router.navigate(['/']);
        }
        this.spinner.nativeElement.remove();
        this.data.open = this.calculateOpenRestaurant(this.data.dateStart, this.data.dateEnd);
      })
      .catch(error => {
        console.log(error);

        if (!(error.ok && error.status === 200)) {
          return this.router.navigate(['/']);
        }
      });
  }

  now = new Date();
  min = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate());
  max = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate() + 6);

  singleLabels = [];
  singleInvalid = [];

  /**
   * Envia la información de la reserva al servicio backend.
   */
  sendReservation(): void {
    const reservation: Reservation = {
      name: this.inputName.nativeElement.value,
      phone: this.inputPhone.nativeElement.value,
      chairs: this.countChairs,
      day: '',
      hour: '',
      idUser: this.data.user.uid,
      idRestaurant: this.idRestaurant,
      state: false
    };

    this.serviceReservation.createReservation(reservation)
      .then(data => {
        console.log(data);

      })
      .catch(error => {
        console.error(error);
      });
  }

  /**
   * Modifica la cantidad de sillas de acuerdo al radio button.
   */
  onItemChange(item): void {
    this.countChairs = item;
  }

  openPicker(): void {
    this.inst.open();
  }

  /**
   * Calcula si el restaurante está abierto o cerrado de acuerdo a la fecha.
   */
  calculateOpenRestaurant(start: any, end: any): boolean {
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();

    const timeStart = start.split(':');
    const timeEnd = end.split(':');

    if ((hour >= timeStart[0] && minute >= timeStart[1]) && (hour <= timeEnd[0] && minute < timeEnd[1])) {
      return true;
    }
    return false;
  }
}
