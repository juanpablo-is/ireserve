import { Component, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.sass']
})
export class ReservationsComponent {

  user: any;
  pending: any[] = [];

  @ViewChildren('itemsPending') itemsPendingElement: QueryList<any>;
  @ViewChildren('itemsActive') itemsActiveElement: QueryList<any>;
  @ViewChildren('itemsComplete') itemsCompleteElement: QueryList<any>;

  constructor(
    private router: Router
  ) {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    if (!this.user) { this.router.navigate(['/login']); return; }
    this.pending.push({ restaurant: 'McDo', date: '12/05/2021 12:20pm', dateStart: '10/05/2021', chairs: 5, address: 'Calle 49 #29 L 04 - 3', name: 'Pablo' });
    this.pending.push({ restaurant: 'McDo', date: '12/05/2021 12:20pm', dateStart: '10/05/2021', chairs: 5, name: 'Juan' });
    this.pending.push({ restaurant: 'McDo', date: '12/05/2021 12:20pm', dateStart: '10/05/2021', chairs: 5, address: '', name: '' });
    this.pending.push({ restaurant: 'McDo', date: '12/05/2021 12:20pm', dateStart: '10/05/2021', chairs: 5, address: '', name: '' });
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
