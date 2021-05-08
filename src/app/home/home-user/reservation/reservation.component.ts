import { Component, ViewChild } from '@angular/core';
import { setOptions, MbscDatepicker, localeEs } from '@mobiscroll/angular';

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

  constructor() { }

  @ViewChild('picker', { static: false })
  inst!: MbscDatepicker;

  today = new Date();

  now = new Date();
  currYear = this.now.getFullYear();
  currMonth = this.now.getMonth();
  currDay = this.now.getDate();
  min = new Date(this.currYear, this.currMonth, this.currDay);
  max = new Date(this.currYear, this.currMonth, this.currDay + 6);

  singleLabels = [];
  singleInvalid = [];

  openPicker(): void {
    this.inst.open();
  }

}
