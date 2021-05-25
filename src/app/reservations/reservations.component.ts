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

  /**
   *
   */
  openSwal(item, i, index): void {
    console.log(item, i);

    Swal.fire({
      title: this.isClient ? `Reservación a '${item.name}'` : `Reservación en ${item.restaurant}`,
      html: `
        <pre>
        ${JSON.stringify(item)}
        <pre>
      `,
      icon: 'info',
      showCancelButton: true,
      showConfirmButton: item.type === 'pended' || item.type === 'actived',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cerrar',
      confirmButtonText: (this.isClient ? 'Rechazar' : 'Cancelar') + ' reservación'
    }).then((result) => {
      if (result.isConfirmed) {
        item.type = this.isClient ? 'declined' : 'canceled';
        this.updateReservation(item, i, index);
      }
    });
  }

  /**
   * Cancela o rechaza la reservación.
   */
  updateReservation(item: any, type: number, index: number): void {
    this.restService.put(`/api/reservation/${item.id}`, item)
      .then((result: any) => {
        if (result.ok && result.status === 200) {
          if (type === 0) {
            this.reservations.pended.splice(index, 1);
          } else if (type === 1) {
            this.reservations.actived.splice(index, 1);
          }

          if (item.type === 'declined') {
            this.reservations.declined.push(item);
          } else if (item.type === 'canceled') {
            this.reservations.canceled.push(item);
          }

          Swal.fire({
            icon: 'success',
            title: `Reservación ${item.type === 'canceled' ? 'cancelada' : 'rechazada'}`,
            html: `La reservación ${item.type === 'canceled' ? `en <i> ${item?.restaurant} </i> se canceló` : `de <i> ${item?.name} </i> se rechazó`} exitosamente.`,
            confirmButtonText: 'Cerrar',
            timer: 6000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
          });
        }
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Falló',
          html: 'No fue posible actualizar la reservación, intente nuevamente.',
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
