import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../services/backend/rest.service';
import { LocalStorageService } from '../services/frontend/local-storage.service';
import { UpdateToastService } from '../update-toast.service';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.sass']
})
export class ReservationsComponent implements OnInit {

  user: any;
  reservations: any[] = [];

  cancel: any = {};

  @ViewChild('spinner') spinner: ElementRef;
  @ViewChildren('itemsPending') itemsPendingElement: QueryList<any>;
  @ViewChildren('itemsActive') itemsActiveElement: QueryList<any>;
  @ViewChildren('itemsComplete') itemsCompleteElement: QueryList<any>;
  @ViewChild('closeModal') closeModal: ElementRef;

  constructor(
    private router: Router,
    private restService: RestService,
    private toastService: UpdateToastService,
    private localStorageService: LocalStorageService
  ) {
    this.user = this.localStorageService.getData('user');
    if (!this.user) { this.router.navigate(['/login']); return; }

    this.restService.get(`/api/reservations/${this.user.uid}`)
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
    popoverTriggerList.forEach((popoverTriggerEl) => {
      return new bootstrap.Popover(popoverTriggerEl);
    });
  }

  /**
   * Abre modal para eliminar reservación.
   */
  openModal(item: any, obj: number, index: number): void {
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
              // this.pending.splice(item.id, 1);
              break;
            case 1:
              // this.active.splice(item.id, 1);
              break;
          }
          this.closeModal.nativeElement.click();
          this.toastService.updateData({
            title: 'Cancelada', body: `La reservación en <i>${item.name}</i> se canceló exitosamente.`, seconds: 5, status: true
          });
        }
      })
      .catch(() => {
        this.closeModal.nativeElement.click();
        this.toastService.updateData({
          title: 'Falló', body: 'No fue posible cancelar la reservación, intente nuevamente.', seconds: 5, status: false
        });
      });
  }

  // Colapsa acordión de tarjetas.
  collapsingCard(section: number, index: number): void {
    switch (section) {
      case 0:
        this.collapseItems(this.itemsPendingElement, index);
        break;
      case 1:
        this.collapseItems(this.itemsActiveElement, index);
        break;
      case 2:
        this.collapseItems(this.itemsCompleteElement, index);
        break;
    }
  }

  collapseItems(items: any, index: number): void {
    items.toArray().forEach((element: any, i: number) => {
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
