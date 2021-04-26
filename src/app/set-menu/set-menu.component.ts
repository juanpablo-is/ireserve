import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuService } from '../menu.service';

@Component({
  selector: 'app-set-menu',
  templateUrl: './set-menu.component.html',
  styleUrls: ['./set-menu.component.sass']
})

export class SetMenuComponent implements OnInit {

  userId: string;
  platoFuerte: string;
  platoCorriente: string;
  bebidas: string;
  entradas: string;
  adicionales: string;
  state: any;
  form: FormGroup;
  alertError: string;

  platosFuertes: any[];
  platosCorrientes: any[];
  drinks: any[];
  entrances: any[];
  additionals: any[];

  constructor(
    private menuService: MenuService,
    private router: Router
  ) {
    this.platoFuerte = 'Plato fuerte';
    this.platoCorriente = 'Plato Corriente';
    this.bebidas = 'Bebidas';
    this.entradas = 'Entradas';
    this.adicionales = 'Adicionales';

    this.menuService.getMenu()
      .subscribe(menu => {
        const count = Object.keys(menu).length;

        if (count > 1) {
          this.userId = menu.idUser;
          this.platosFuertes = menu.dishes.platosFuertes;
          this.platosCorrientes = menu.dishes.platosCorrientes;
          this.drinks = menu.dishes.drinks;
          this.entrances = menu.dishes.entrances;
          this.additionals = menu.dishes.additionals;
        } else {
          this.userId = 'juan@ireserve.com';
          this.platosCorrientes = [];
          this.platosFuertes = [];
          this.drinks = [];
          this.entrances = [];
          this.additionals = [];
        }
      }, () => {
        this.userId = 'juan@ireserve.com';
        this.platosCorrientes = [];
        this.platosFuertes = [];
        this.drinks = [];
        this.entrances = [];
        this.additionals = [];
      });
  }

  save(): void {
    const body = {
      dishes: {
        platosFuertes: this.platosFuertes,
        platosCorrientes: this.platosCorrientes,
        drinks: this.drinks,
        entrances: this.entrances,
        additionals: this.additionals
      },
      idRestaurant: this.userId
    };

    this.menuService.addMenuItem(body)
      .then(() => {
        this.router.navigate(['/']);
      })
      .catch(e => {
        this.alertError = e.error.response || 'Se ha presentado un error, intente nuevamente.';
      });
  }

  ngOnInit(): void {
  }
}
