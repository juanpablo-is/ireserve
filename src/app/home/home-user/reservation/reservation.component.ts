import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { setOptions, MbscDatepicker, localeEs } from '@mobiscroll/angular';
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
export class ReservationComponent implements OnInit {

  @ViewChild('spinner') spinner: ElementRef;
  @ViewChild('picker', { static: false }) inst!: MbscDatepicker;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private serviceRestaurant: RestaurantService
  ) {
    this.idRestaurant = this.activatedRoute.snapshot.paramMap.get('id');
    if (!this.idRestaurant) {
      this.router.navigate(['/']);
      return;
    }

    this.serviceRestaurant.getRestaurant(this.idRestaurant)
      .then(data => {
        this.data = data.body;

        console.log(this.data);

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

  data: any = {};

  today = new Date();
  now = new Date();
  min = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate());
  max = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate() + 6);

  singleLabels = [];
  singleInvalid = [];

  idRestaurant: string;

  openPicker(): void {
    this.inst.open();
  }

  ngOnInit(): void {
  }

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
