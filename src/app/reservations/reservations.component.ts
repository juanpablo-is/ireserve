import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../services/backend/rest.service';
import { LocalStorageService } from '../services/frontend/local-storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.sass']
})
export class ReservationsComponent implements OnInit {

  user: any;
  reservations = {
    pended: [],
    actived: [],
    completed: [],
    canceled: [],
    declined: [],
  };
  cancel: any = {};

  @ViewChild('spinner') spinner: ElementRef;
  @ViewChild('closeModal') closeModal: ElementRef;

  constructor(
    private router: Router,
    private restService: RestService,
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
  openModal(item: any, obj: number): void {
    this.cancel = {
      item,
      obj
    };
  }

  /**
   * Cancela la reservación a través del servicio.
   */
  cancelReservation(cancel: any): void {
    this.restService.put(`/api/reservation/${cancel.item.id}`, { ...cancel.item, type: 'canceled' })
      .then((result: any) => {
        if (result.ok && result.status === 200) {
          switch (cancel.obj) {
            case 0:
              this.reservations.pended.splice(cancel.item.id, 1);
              break;
            case 1:
              this.reservations.actived.splice(cancel.item.id, 1);
              break;
          }
          this.reservations.canceled.push(cancel.item);
          this.closeModal.nativeElement.click();

          Swal.fire({
            icon: 'success',
            title: 'Reservación cancelada',
            html: `La reservación en <i>${cancel.item?.name}</i> se canceló exitosamente.`,
            confirmButtonText: 'Cerrar',
            timer: 5000
          });
        }
      })
      .catch(() => {
        this.closeModal.nativeElement.click();
        Swal.fire({
          icon: 'error',
          title: 'Falló',
          html: 'No fue posible cancelar la reservación, intente nuevamente.',
          confirmButtonText: 'Cerrar'
        });
      });
  }

  // Colapsa acordión de tarjetas.
  collapsingCard(e): void {
    const div = e.currentTarget.parentElement.parentElement.children[0];
    const divHidden = e.currentTarget.parentElement.parentElement.children[1];

    if (divHidden.classList.contains('hidden')) {
      divHidden.classList.remove('hidden');
      div.querySelector('svg').classList.remove('fa-chevron-down');
      div.querySelector('svg').classList.add('fa-chevron-up');
    } else {
      divHidden.classList.add('hidden');
      div.querySelector('svg').classList.remove('fa-chevron-up');
      div.querySelector('svg').classList.add('fa-chevron-down');
    }
  }

}
