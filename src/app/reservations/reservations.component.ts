import { Component, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../services/backend/rest.service';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.sass']
})
export class ReservationsComponent {

  user: any;
  pending: any[] = [];
  active: any[] = [];
  complete: any[] = [];

  @ViewChildren('itemsPending') itemsPendingElement: QueryList<any>;
  @ViewChildren('itemsActive') itemsActiveElement: QueryList<any>;
  @ViewChildren('itemsComplete') itemsCompleteElement: QueryList<any>;

  constructor(
    private router: Router,
    private restService: RestService
  ) {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    if (!this.user) { this.router.navigate(['/login']); return; }

    this.restService.get(`/api/reservations/${this.user.uid}`)
      .then((result: any) => {
        if (result.ok && result.status === 200) {
          this.pending = result.body.pending;
          this.active = result.body.active;
          this.complete = result.body.complete;
        }
      })
      .catch(err => {

      });
  }

  // Colapsa acordión de tarjetas.
  collapsingCard(section: number, index: number): void {
    switch (section) {
      case 0: {
        this.collapseItems(this.itemsPendingElement, index);
        break;
      }
      case 1: {
        this.collapseItems(this.itemsActiveElement, index);
        break;
      }
      case 2: {
        this.collapseItems(this.itemsCompleteElement, index);
        break;
      }
    }
  }

  collapseItems(items: any, index: number): void {
    items.toArray().forEach((element, i) => {
      const div = element.nativeElement.children[0];
      const divHidden = element.nativeElement.children[1];

      if (i === index && divHidden.classList.contains('hidden')) {
        divHidden.classList.remove('hidden');
        div.querySelector('svg').classList.remove('fa-chevron-down');
        div.querySelector('svg').classList.add('fa-chevron-up');
      } else {
        divHidden.classList.add('hidden');
        div.querySelector('svg').classList.remove('fa-chevron-up');
        div.querySelector('svg').classList.add('fa-chevron-down');
      }
    });
  }

}
