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

  constructor(
    private menuService: MenuService,
    private router: Router
  ) {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || !user.idRestaurant) { this.router.navigate(['/register']); return; }

    this.name = user.firstname;
    this.idRestaurant = user.idRestaurant;
    this.items = this.getItemsMenu(user.typeRestaurant);

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
        map[item] = this.items[item].items;
      }
    }
    return count > 0 ? map : false;
  }

  // Retorna items de acuerdo a tipo de restaurante.
  getItemsMenu(typeRestaurant: string): any {
    const items: any = {};

    if (typeRestaurant === 'restaurante') {
      items.breakfast = { text: 'Desayunos', items: [] };
      items.platosFuertes = { text: 'Platos fuertes', items: [] };
      items.platosCorrientes = { text: 'Platos corrientes', items: [] };
      items.drinks = { text: 'Bebidas', items: [] };
      items.entraces = { text: 'Entradas', items: [] };
      items.additionals = { text: 'Adicionales', items: [] };
      items.desserts = { text: 'Postres', items: [] };
    } else if (typeRestaurant === 'cafeteria') {
      items.breakfast = { text: 'Desayunos', items: [] };
      items.drinks = { text: 'Bebidas', items: [] };
    } else if (typeRestaurant === 'heladeria') {
      items.iceCream = { text: 'Helados', items: [] };
      items.drinks = { text: 'Bebidas', items: [] };
      items.desserts = { text: 'Postres', items: [] };
      items.shakes = { text: 'Batidos', items: [] };
      items.waffles = { text: 'Waffles', items: [] };
    } else if (typeRestaurant === 'bar') {
      items.beers = { text: 'Cervezas', items: [] };
      items.cocktails = { text: 'Cocteles', items: [] };
      items.wines = { text: 'Vinos', items: [] };
      items.coffee = { text: 'Café', items: [] };
    }

    return items;
  }
}
