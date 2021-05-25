import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../services/backend/rest.service';
import { LocalStorageService } from '../services/frontend/local-storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-set-menu',
  templateUrl: './set-menu.component.html',
  styleUrls: ['./set-menu.component.sass']
})

export class SetMenuComponent {

  @Input() embed: any = false;
  btnSaveMenu = '';
  idRestaurant: string;
  name: string;
  items: any;
  alertError: string;
  type = 'establecimiento';
  objectKeys = Object.keys;

  constructor(
    private restService: RestService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    const user = this.localStorageService.getData('user');
    if (!user || !user.idRestaurant) { this.router.navigate(['/register']); return; }

    this.name = user.firstname;
    this.idRestaurant = user.idRestaurant;
    this.type = user.type;

    // Consultar menu de acuerdo a restaurante para los items.
    this.restService.get(`/api/menu?idRestaurant=${this.idRestaurant}`)
      .then((result: { ok: any; status: number; body: any }) => {
        if (result.ok && result.status === 200) {
          const count = Object.keys(result.body).length;
          this.btnSaveMenu = this.embed ? 'EDITAR MENÚ' : 'INGRESAR MENU';
          if (count > 1) {
            this.items = result.body.dishes;
          }
        }
      })
      .catch(() => {
        this.alertError = 'Se ha presentado un error, intente nuevamente';
      });
  }

  /**
   * Guarda o edita el menú del establecimiento.
   */
  save(): void {
    this.alertError = '';
    this.btnSaveMenu = 'CARGANDO...';

    const body = {
      dishes: this.items,
      idRestaurant: this.idRestaurant
    };

    this.restService.post('/api/menu', body)
      .then((result: { ok: any; status: number; body: any }) => {
        if (result.ok && result.status === 201) {
          Swal.fire({
            icon: 'success',
            title: 'Menú editado',
            text: this.embed ? `El menu de su ${this.type} se ha editado.` : `El menu de su ${this.type} se ha guardado.`,
            confirmButtonText: 'Cerrar'
          });
          this.btnSaveMenu = this.embed ? 'EDITAR MENÚ' : 'INGRESAR MENU';
          this.router.navigate(['/']);
        }
      })
      .catch((e: any) => {
        this.alertError = e.error.response || 'Se ha presentado un error, intente nuevamente.';
        this.btnSaveMenu = this.embed ? 'EDITAR MENÚ' : 'INGRESAR MENU';
      });
  }

  // Retorna traducción de la categoria del menú.
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
