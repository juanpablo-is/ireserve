import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../services/backend/rest.service';
import { LocalStorageService } from '../services/frontend/local-storage.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';

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
    Swal.fire({
      title: this.isClient ? `Reservación a '${item.name}'` : `Reservación en <a href="/restaurant/${item.idRestaurant}">${item.restaurant}</a>`,
      html: this.getHtmlSwal(item),
      icon: 'info',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cerrar',
      showConfirmButton: item.type === 'pended' || item.type === 'actived',
      confirmButtonColor: '#3085d6',
      confirmButtonText: (this.isClient ? 'Rechazar' : 'Cancelar') + ' reservación',
      input: item.type === 'pended' || item.type === 'actived' ? 'text' : null,
      inputLabel: `Mensaje de ${this.isClient ? 'rechazo' : 'cancelación'}`,
      inputPlaceholder: `Ingrese un mensaje por la cual se ${this.isClient ? 'rechazará' : 'cancelará'} la reservación...`,
      inputAttributes: {
        'aria-label': `Ingrese un mensaje por la cual se ${this.isClient ? 'rechazará' : 'cancelará'} la reservación`
      },
      inputValidator: (value) => new Promise((resolve) => resolve(value ? null : 'Debe ingresar un mensaje.'))
    }).then((result) => {
      if (result.isConfirmed) {
        item.type = this.isClient ? 'declined' : 'canceled';
        item.message = result.value ?? null;

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

  /**
   *
   */
  getHtmlSwal(item: any): string {
    return `
      <p><b>A nombre: </b>${item.name}</p>
      <p><b>Teléfono: </b><a href="tel:${item.phone}">${item.phone}</a></p>
      <p><b>Medio de pago: </b>${item.medioPago}</p>
      <p><b>Precio: </b>$${item.price}</p>
      <p><b>Fecha reserva: </b>${item.date}</p>
      <p><b>Fecha creación: </b>${item.createdAt}</p>
      <hr />
    `;
  }

  /**
   * Formatea timestamp a tiempo relativo.
   */
  formatMoment(timestamp: number): string {
    return moment(timestamp).startOf('minute').fromNow();
  }
}
