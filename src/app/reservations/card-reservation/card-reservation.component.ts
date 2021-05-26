import { Component, Input } from '@angular/core';
import * as moment from 'moment';
import { RestService } from 'src/app/services/backend/rest.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-card-reservation',
  templateUrl: './card-reservation.component.html',
  styleUrls: ['./card-reservation.component.sass']
})
export class CardReservationComponent {

  @Input() items: any;
  @Input() key: any;

  isClient = false;
  constructor(private restService: RestService) { }

  /**
   * Abre alerta Sweelalert2 con info de reservación.
   */
  openSwal(item, i): void {
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

        this.updateReservation(item, i);
      }
    });
  }

  /**
   * Cancela o rechaza la reservación.
   */
  updateReservation(item: any, index: number): void {
    this.restService.put(`/api/reservation/${item.id}`, item)
      .then((result: any) => {
        if (result.ok && result.status === 200) {
          if (this.key === 'pending') {
            this.items.pended.splice(index, 1);
          } else if (this.key === 'actived') {
            this.items.actived.splice(index, 1);
          }

          if (item.type === 'declined') {
            this.items.declined.push(item);
          } else if (item.type === 'canceled') {
            this.items.canceled.push(item);
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
   * HTML dentro de la alerta.
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
