import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RestService } from '../services/backend/rest.service';

@Component({
  selector: 'app-set-menu',
  templateUrl: './set-menu.component.html',
  styleUrls: ['./set-menu.component.sass']
})

export class SetMenuComponent {

  btnSaveMenu = 'INGRESAR MENU';
  idRestaurant: string;
  name: string;
  form: FormGroup;
  items: any;
  alertError: string;
  type = 'establecimiento';

  constructor(
    private restService: RestService,
    private router: Router
  ) {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || !user.idRestaurant) { this.router.navigate(['/register']); return; }

    this.name = user.firstname;
    this.idRestaurant = user.idRestaurant;
    this.type = user.typeRestaurant;
    this.items = this.getItemsMenu(this.type);

    // Consultar menu de acuerdo a restaurante para los items.
    this.restService.get(`/api/menu?idRestaurant=${this.idRestaurant}`)
      .then((result: { ok: any; status: number; body: any }) => {
        if (result.ok && result.status === 200) {
          const count = Object.keys(result.body).length;

          if (count > 1) {
            this.items = this.parseItems(result.body.dishes);
          }
        }
      })
      .catch(() => {
        this.alertError = 'Se ha presentado un error, intente nuevamente';
      });
  }

  save(): void {
    this.alertError = '';
    this.btnSaveMenu = 'CARGANDO...';

    const dishes = this.getItemsMap();
    if (!dishes) {
      this.alertError = 'Debe ingresar al menos un producto.';
      this.btnSaveMenu = 'INGRESAR MENU';
      return;
    }

    const body = {
      dishes,
      idRestaurant: this.idRestaurant
    };

    this.restService.post('/api/menu', body)
      .then((result: { ok: any; status: number; body: any }) => {
        if (result.ok && result.status === 201) {
          this.btnSaveMenu = 'INGRESAR MENU';
          this.router.navigate(['/']);
        }
      })
      .catch((e: any) => {
        this.alertError = e.error.response || 'Se ha presentado un error, intente nuevamente.';
        this.btnSaveMenu = 'INGRESAR MENU';
      });
  }

  // Convierte la variable 'items' en object para Firebase.
  getItemsMap(): {} {
    const map = {};
    let count = 0;
    for (const item in this.items) {
      if (Object.prototype.hasOwnProperty.call(this.items, item)) {
        if (this.items[item].items.length > 0) {
          count++;
        }

        map[this.items[item].key] = this.items[item].items;
      }
    }
    return count > 0 ? map : false;
  }

  // Retorna items de acuerdo a tipo de restaurante.
  getItemsMenu(typeRestaurant: string): any {
    const items: any = [];

    if (typeRestaurant === 'restaurante') {
      items.push({ key: 'breakfast', text: 'Desayunos', items: [] });
      items.push({ key: 'platosFuertes', text: 'Platos fuertes', items: [] });
      items.push({ key: 'platosCorrientes', text: 'Platos corrientes', items: [] });
      items.push({ key: 'drinks', text: 'Bebidas', items: [] });
      items.push({ key: 'entraces', text: 'Entradas', items: [] });
      items.push({ key: 'additionals', text: 'Adicionales', items: [] });
      items.push({ key: 'desserts', text: 'Postres', items: [] });
    } else if (typeRestaurant === 'cafeteria') {
      items.push({ key: 'breakfast', text: 'Desayunos', items: [] });
      items.push({ key: 'drinks', text: 'Bebidas', items: [] });
    } else if (typeRestaurant === 'heladeria') {
      items.push({ key: 'iceCream', text: 'Helados', items: [] });
      items.push({ key: 'drinks', text: 'Bebidas', items: [] });
      items.push({ key: 'desserts', text: 'Postres', items: [] });
      items.push({ key: 'shakes', text: 'Batidos', items: [] });
      items.push({ key: 'waffles', text: 'Waffles', items: [] });
    } else if (typeRestaurant === 'bar') {
      items.push({ key: 'beers', text: 'Cervezas', items: [] });
      items.push({ key: 'cocktails', text: 'Cocteles', items: [] });
      items.push({ key: 'wines', text: 'Vinos', items: [] });
      items.push({ key: 'coffee', text: 'Café', items: [] });
    }

    return items;
  }

  // Parsea los items de DB de acuerdo a la estructura de categorias.
  parseItems(menu): any[] {
    const newItems = [];

    for (const item in menu) {
      if (Object.prototype.hasOwnProperty.call(menu, item)) {
        const da = this.items.filter(it => it.key === item)[0];
        newItems.push({ text: da.text, items: menu[item] });
      }
    }
    return newItems;
  }
}
