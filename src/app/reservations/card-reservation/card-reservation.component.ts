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
  @Input() isClient: any;

  constructor(private restService: RestService) { }

  /**
   * Abre alerta Sweelalert2 con info de reservación.
   */
  openInfo(item, i): void {
    Swal.fire({
      title: this.isClient ? `Reservación a <i>${item.name}</i>` : `Reservación en <a href="/restaurant/${item.idRestaurant}">${item.restaurant}</a>`,
      html: this.getInfoSweet(item),
      icon: 'info',
      iconColor: '#EF233C',
      iconHtml: '<i class="fas fa-file-alt"></i>',
      customClass: {
        confirmButton: 'btn btn-danger mx-2',
        cancelButton: 'btn btn-secondary mx-2',
        denyButton: 'btn btn-success mx-2'
      },
      buttonsStyling: false,
      showCancelButton: true,
      cancelButtonText: 'Cerrar',
      showConfirmButton: item.type === 'pended' || item.type === 'actived',
      confirmButtonText: (this.isClient ? 'Rechazar' : 'Cancelar') + ' reservación',
      showDenyButton: item.type === 'pended',
      denyButtonText: this.isClient ? 'Activar reservación' : 'Ver pedido',
      input: item.type === 'pended' || item.type === 'actived' ? 'text' : null,
      inputLabel: `Mensaje de ${this.isClient ? 'rechazo' : 'cancelación'}`,
      inputPlaceholder: `Ingrese un mensaje por la cual se ${this.isClient ? 'rechazará' : 'cancelará'} la reservación...`,
      inputAttributes: {
        'aria-label': `Ingrese un mensaje por la cual se ${this.isClient ? 'rechazará' : 'cancelará'} la reservación`
      },
      inputValidator: (value) => new Promise((resolve) => resolve(value ? null : 'Debe ingresar un mensaje.'))
    }).then((result) => {
      if (result.isConfirmed) {
        item.newMessage = {
          who: this.isClient ? 'c' : 'u',
          timestamp: new Date().getTime(),
          text: result.value ?? null
        };

        this.items[item.type][i].message.push(item.newMessage);
        item.type = this.isClient ? 'declined' : 'canceled';

        this.updateReservation(item, i);
      } else if (result.isDenied) {
        this.isClient ? this.updateReservation({ ...item, type: 'actived', newMessage: null }, i) : this.openPedido(item);
      }
    });
  }

  /**
   * Abre alerta Sweelalert2 con info de reservación.
   */
  openPedido(item): void {
    Swal.fire({
      title: 'Menu pedido',
      html: this.getPedidoSweet(item.menu),
      icon: 'info',
      iconColor: '#EF233C',
      iconHtml: '<i class="fas fa-book-open"></i>',
      showCancelButton: true,
      cancelButtonColor: '#6c757d',
      cancelButtonText: 'Cerrar',
      showConfirmButton: false
    });
  }

  /**
   * Abre alerta Sweelalert2 con info de mensajes.
   */
  openMessages({ message }, restaurant): void {
    Swal.fire({
      title: 'Mensajes de reservación',
      html: this.getMessagesSweet(message, restaurant),
      icon: 'info',
      iconColor: '#EF233C',
      iconHtml: '<i class="far fa-comment-alt"></i>',
      showCancelButton: true,
      cancelButtonColor: '#6c757d',
      cancelButtonText: 'Cerrar',
      showConfirmButton: false
    });
  }

  /**
   * Cancela o rechaza la reservación.
   */
  updateReservation(item: any, index: number): void {
    this.restService.put(`/api/reservation/${item.id}`, item)
      .then((result: any) => {
        if (result.ok && result.status === 200) {
          if (this.key === 'pended') {
            this.items.pended.splice(index, 1);
          } else if (this.key === 'actived') {
            this.items.actived.splice(index, 1);
          }

          if (item.type === 'declined') {
            this.items.declined.push(item);
          } else if (item.type === 'canceled') {
            this.items.canceled.push(item);
          } else if (item.type === 'actived') {
            this.items.actived.push(item);
          }

          Swal.fire({
            icon: 'success',
            title: `Reservación ${item.type === 'canceled' ? 'cancelada' : (item.type === 'declined' ? 'rechazada' : 'activa')}`,
            html: `La reservación ${item.type === 'canceled' ?
              `en <i> ${item?.restaurant} </i> se canceló` :
              item.type === 'declined' ?
                `de <i> ${item?.name} </i> se rechazó` :
                `de <i> ${item?.name} </i> se activó`}
               exitosamente.`,
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
   * HTML dentro de la alerta para información de la reserva.
   */
  getInfoSweet(item: any): string {
    return `
      <p><b>A nombre: </b>${item.name}</p>
      <p><b>Tipo reservación: </b>${item.typeReservation}</p>
      ${item.typeReservation === 'mesa' ? `<p><b>Cantidad mesas: </b>${item.chairs}</p>` : ''}
      <p><b>Teléfono: </b><a href="tel:${item.phone}">${item.phone}</a></p>
      <p><b>Medio de pago: </b>${item.medioPago}</p>
      <p><b>Precio: </b>$${item.price}</p>
      <p><b>Fecha reserva: </b>${item.date}</p>
      <!-- <p><b>Fecha creación: </b>${item.createdAt}</p> -->
      <hr />
    `;
  }

  /**
   * HTML dentro de la alerta para la información del pedido.
   */
  getPedidoSweet(menu: any): string {
    let text = '';

    for (const iterator of Object.keys(menu)) {
      text += `
      <div class="accordion" id="accordionExample">
        <div class="accordion-item">
        <h2 class="accordion-header" id="heading-${iterator}">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${iterator}" aria-expanded="true" aria-controls="collapse-${iterator}">
            ${this.getTranslate(iterator)}
          </button>
        </h2>
        <div id="collapse-${iterator}" class="accordion-collapse collapse" aria-labelledby="heading-${iterator}" data-bs-parent="#accordionExample">
          <div class="accordion-body text-start">
            ${Object.values(menu[iterator]).map((item: any) => `
              <h5>${item.name}</h5>
              <ul>
                <li>
                  <b>Precio:</b> $ ${item.price}
                </li>
                <li>
                  <b>Cantidad: </b>${item.count}
                </li>
              </ul>`).join('')}
          </div>
        </div>
      </div>
      `;
    }

    return text;
  }

  /**
   * HTML dentro de la alerta para la información de mensajes.
   */
  getMessagesSweet(messages: any, restaurant: string): string {
    let text = '';
    if (!messages) { return text; }

    for (const iterator of messages) {
      text += `
        <div class="message-list">
          <div class="message-list--text">
            <b>${iterator.who === 'c' ? restaurant : 'Yo'}:</b>
            <span>${iterator.text}</span>
          </div>
          <span class="message-list--date">${this.formatMoment(iterator.timestamp)}</span>
        </div>
        <hr />
      `;
    }

    return text;
  }

  /**
   * Formatea timestamp a tiempo relativo.
   */
  formatMoment(timestamp: number): string {
    return moment(timestamp).startOf('minute').fromNow();
  }

  /**
   * Retorna traducción de la categoria del menú.
   */
  getTranslate(key: string): any {
    const items: any = [];

    items.breakfast = 'Desayunos';
    items.platosFuertes = 'Platos fuertes';
    items.platosCorrientes = 'Platos corrientes';
    items.drinks = 'Bebidas';
    items.entraces = 'Entradas';
    items.additionals = 'Adicionales';
    items.desserts = 'Postres';
    items.iceCream = 'Helados';
    items.shakes = 'Batidos';
    items.waffles = 'Waffles';
    items.beers = 'Cervezas';
    items.cocktails = 'Cocteles';
    items.wines = 'Vinos';
    items.coffee = 'Café';

    return items[key] ?? '';
  }
}
