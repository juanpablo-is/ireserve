import { Component, ElementRef, Output, ViewChild, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { setOptions, MbscDatepicker, localeEs } from '@mobiscroll/angular';
import { Reservation } from 'src/app/interfaces/reservation';
import { RestService } from 'src/app/services/backend/rest.service';
import { LocalStorageService } from 'src/app/services/frontend/local-storage.service';
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

  type = 'mesa';
  menu: any;
  objectKeys = Object.keys;

  now = new Date();
  min = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate());
  max = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate() + 6);
  countChairs = 2;
  disabledButton = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private restService: RestService,
    private serviceToast: UpdateToastService,
    private localStorageService: LocalStorageService
  ) {
    const user = this.localStorageService.getData('user');
    if (!user) { this.router.navigate(['/login']); return; }

    this.idRestaurant = this.activatedRoute.snapshot.paramMap.get('id');
    if (!this.idRestaurant) {
      this.router.navigate(['/']);
      return;
    }

    this.restService.get(`/api/restaurant/${this.idRestaurant}`)
      .then((result: { ok: any; status: number; body: any }) => {
        if (result.ok && result.status === 200) {
          this.data = result.body;
          this.data.user = user;

          if (this.data === null) { return this.router.navigate(['/']); }
          this.spinner.nativeElement.remove();

          this.restService.get(`/api/menu?idRestaurant=${this.idRestaurant}`)
            .then(responseRestaurant => {
              if (responseRestaurant.ok && responseRestaurant.status === 200) {
                this.menu = responseRestaurant.body.dishes;
              }
            })
            .catch((e) => {
              console.log(e);
            });

        } else {
          return this.router.navigate(['/']);
        }
      })
      .catch(() => {
        this.router.navigate(['/']);
      });
  }

  transformKey = {
    breakfast: 'Desayunos',
    platosFuertes: 'Platos fuertes',
    platosCorrientes: 'Platos corrientes',
    drinks: 'Bebidas',
    entraces: 'Entradas',
    additionals: 'Adicionales',
    desserts: 'Postres',
    iceCream: 'Helados',
    shakes: 'Batidos',
    waffles: 'Waffles',
    beers: 'Cervezas',
    cocktails: 'Cocteles',
    wines: 'Vinos',
    coffee: 'Café',
  };

  /**
   * Returna 'true' si es la primera categoria de items del menú.
   */
  firstCategory(type: string): boolean {
    if (type === this.type) {
      return true;
    }

    if (this.type === '') {
      this.type = type;
      return true;
    }
    return false;
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
      type: 'pended'
    };

    this.restService.post('/api/reservation', reservation)
      .then((result: { ok: any; status: number; body: any }) => {
        if (result.ok && result.status === 201) {
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
   * Evento para retroceder pestaña.
   */
  onBack(): void {
    history.back();
  }

  /**
   * Modifica el tipo de reservación en los radiobuttons.
   */
  onChangeRadio(type: string): void {
    this.type = type;
  }
}
