import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
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

  cancel: any = {};

  @ViewChildren('itemsPending') itemsPendingElement: QueryList<any>;
  @ViewChildren('itemsActive') itemsActiveElement: QueryList<any>;
  @ViewChildren('itemsComplete') itemsCompleteElement: QueryList<any>;
  @ViewChild('closeModal') closeModal: ElementRef;

  constructor(
    private element: ElementRef,
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
      .catch(() => {
        this.router.navigate(['/']);
        this.element.nativeElement.destroy();
      });
  }

  /**
   * Abre modal para eliminar reservación.
   */
  openModal(item, obj, index): void {
    this.cancel = {
      name: item.restaurant,
      id: item.id,
      index,
      obj,
    };
  }

  /**
   * Cancela la reservación a través del servicio.
   */
  cancelReservation(item: any): void {
    this.restService.delete(`/api/reservation/${item.id}`)
      .then((result: any) => {
        if (result.ok && result.status === 200) {
          switch (item.obj) {
            case 0:
              this.pending.splice(item.id, 1);
              break;
            case 1:
              this.active.splice(item.id, 1);
              break;
          }
          this.closeModal.nativeElement.click();
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
