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
    declined: []
  };
  cancel: any = {};
  confirm: any = {};
  order: any = [];
  keysMenu : any = [];
  whatRole : boolean = true;

  @ViewChild('spinner') spinner: ElementRef;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeConfirmModal') closeConfirmModal: ElementRef;

  constructor(
    private router: Router,
    private restService: RestService,
    private localStorageService: LocalStorageService
  ) {
    this.user = this.localStorageService.getData('user');
    if (!this.user) { this.router.navigate(['/login']); return; }

    if (!(this.user.role === "Cliente")) {
      this.whatRole = false;
    } 
    if (this.whatRole) {
      this.restService.get(`/api/clireservations/${this.user.idRestaurant}`)
      .then((result: any) => {
        if (result.ok && result.status === 200) {
          this.spinner.nativeElement.remove();
          this.reservations = result.body;
        }
      })
      .catch(() => {
        this.router.navigate(['/']);
      });
    }else{
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
  }

  ngOnInit(): void {
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.forEach((popoverTriggerEl) => {
      // return new bootstrap.Popover(popoverTriggerEl);
    });
  }

  /**
   * Abre modal para eliminar reservación.
   */
  openModalCancel(item: any, obj: number): void {
    this.cancel = {
      item,
      obj
    };
  }

  openModalConfirm(item: any, obj: number): void {
    this.confirm = {
      item,
      obj
    };
  }

  openModalMenu(item: any, obj: number): void {
    this.keysMenu =  Object.keys(item.menu);
    let aux = [];
    for (let i = 0; i < this.keysMenu.length; i++) {
      aux.push({
        "nmenu":this.keysMenu[i],
        "values":item.menu[this.keysMenu[i]]
      });
    }
    this.order = aux;
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

  /** 
   * Metodo para confirmar reservación
   */
   confirmReservation(confirm: any): void{
    confirm.item.type = "actived";
    this.restService.put(`/api/reservation`, confirm)
      .then((result: any) => {
        if (result.ok && result.status === 200) {
          this.reservations.actived.push(confirm.item);
          this.reservations.pended.splice(confirm.item.id,1);
          this.closeConfirmModal.nativeElement.click();
          Swal.fire({
            icon: 'success',
            title: 'Reservación Confirmada',
            html: `La reservación en <i>${confirm.item?.name}</i> a sido confirmada.`,
            confirmButtonText: 'Cerrar',
            timer: 5000
          });
        }
      })
      .catch(() => {
        this.closeModal.nativeElement.click();
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
