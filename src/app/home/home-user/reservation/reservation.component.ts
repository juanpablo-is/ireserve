import { Component, ElementRef, Output, ViewChild, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { setOptions, MbscDatepicker, localeEs } from '@mobiscroll/angular';
import { Reservation } from 'src/app/interfaces/reservation';
import { ReservationService } from 'src/app/services/backend/reservation/reservation.service';
import { RestaurantService } from 'src/app/services/backend/restaurant/restaurant.service';
import { UpdateToastService } from 'src/app/update-toast.service';

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
  @ViewChild('picker_day', { static: false }) pickerDay!: MbscDatepicker;
  @ViewChild('picker_hour', { static: false }) pickerHour!: MbscDatepicker;
  @ViewChild('inputName') inputName: ElementRef;
  @ViewChild('inputPhone') inputPhone: ElementRef;

  data: any = {};
  idRestaurant: string;

  now = new Date();
  min = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate());
  max = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate() + 6);
  countChairs = 2;
  disabledButton = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private serviceRestaurant: RestaurantService,
    private serviceReservation: ReservationService,
    private serviceToast: UpdateToastService
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

  /**
   * Envia la información de la reserva al servicio backend.
   */
  sendReservation(): void {
    this.disabledButton = true;

    const hour = this.pickerHour.getVal();
    const day = this.pickerDay.getVal();
    const date = day.toDateString() + ' ' + hour.getHours() + ':' + hour.getMinutes() + ':00';

    const reservation: Reservation = {
      name: this.inputName.nativeElement.value,
      phone: this.inputPhone.nativeElement.value,
      chairs: this.countChairs,
      day: day.getDate(),
      hour: hour.getHours() + ':' + hour.getMinutes(),
      timestamp: new Date(date).getTime(),
      idUser: this.data.user.uid,
      idRestaurant: this.idRestaurant,
      state: false
    };

    this.serviceReservation.createReservation(reservation)
      .then(response => {
        if (response.ok && response.status === 201) {
          this.serviceToast.updateData({
            title: 'Reservación creada', body: `La reservación en <i>${this.data.name}</i> fue exitosa.<br/>Pero falta confirmación del restaurante.`,
            seconds: 7, status: true
          });
          return this.router.navigate(['/']);
        }
        this.serviceToast.updateData({ title: 'Falló', body: `La reservación falló, intente nuevamente.`, status: false });
        this.disabledButton = false;
      })
      .catch(() => {
        this.serviceToast.updateData({ title: 'Falló', body: `La reservación falló, intente nuevamente.`, status: false });
        this.disabledButton = false;
      });
  }

  /**
   * Modifica la cantidad de sillas de acuerdo al radio button.
   */
  onItemChange(item: number): void {
    this.countChairs = item;
  }

  /**
   * Evento handler a los datepicker.
   */
  onChange(): void {
    this.disabledButton = false;
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
