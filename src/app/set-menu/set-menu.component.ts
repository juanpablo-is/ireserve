import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuService } from '../services/backend/menu/menu.service';

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
    private menuService: MenuService,
    private router: Router
  ) {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || !user.idRestaurant) { this.router.navigate(['/register']); return; }

    this.name = user.firstname;
    this.idRestaurant = user.idRestaurant;
    this.type = user.typeRestaurant;
    this.items = this.getItemsMenu(this.type);

    // Consultar menu de acuerdo a restaurante para los items.
    // this.menuService.getMenu(this.idRestaurant)
    //   .subscribe((menu: any) => {
    //     const count = Object.keys(menu).length;
    //     if (count > 1) { }
    //   });
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

    this.menuService.addMenuItem(body)
      .then(() => {
        this.router.navigate(['/']);
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
}
