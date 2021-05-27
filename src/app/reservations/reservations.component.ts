import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../services/backend/rest.service';
import { LocalStorageService } from '../services/frontend/local-storage.service';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.sass']
})
export class ReservationsComponent implements OnInit {

  user: any;
  reservations = { pended: [], actived: [], completed: [], canceled: [], declined: [] };
  isClient = false;

  @ViewChild('spinner') spinner: ElementRef;

  constructor(
    private router: Router,
    private restService: RestService,
    private localStorageService: LocalStorageService
  ) {
    this.user = this.localStorageService.getData('user');
    if (!this.user) { this.router.navigate(['/login']); return; }
    this.isClient = this.user?.role === 'Cliente';

    const URL = this.isClient ? `/api/reservations/${this.user.idRestaurant}?restaurant=true` : `/api/reservations/${this.user.uid}`;
    this.restService.get(URL)
      .then((result: any) => {
        if (result.ok && result.status === 200) {
          this.spinner.nativeElement.remove();

          this.reservations = result.body;
        }
      })
      .catch(() => {
        this.router.navigate(['/']);
      });
  }

  ngOnInit(): void {
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    // popoverTriggerList.forEach((popoverTriggerEl) => {
    // return new bootstrap.Popover(popoverTriggerEl);
    // });
  }

}