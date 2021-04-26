import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuService } from '../menu.service';

@Component({
  selector: 'app-set-menu',
  templateUrl: './set-menu.component.html',
  styleUrls: ['./set-menu.component.sass']
})

export class SetMenuComponent implements OnInit {

  platoFuerte = 'Plato fuerte';
  platoCorriente = 'Plato Corriente';
  bebidas = 'Bebidas';
  entradas = 'Entradas';
  adicionales = 'Adicionales';

  idRestaurant: string;
  name: string;
  form: FormGroup;
  alertError: string;
  btnSaveMenu = 'INGRESAR MENU';

  platosFuertes: any[] = [];
  platosCorrientes: any[] = [];
  drinks: any[] = [];
  entrances: any[] = [];
  additionals: any[] = [];

  constructor(
    private menuService: MenuService,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) {
    const user = JSON.parse(sessionStorage.getItem('user'));

    this.activateRoute.queryParams.subscribe(params => {
      if (!user || !params.idRestaurant) { this.router.navigate(['/register']); return; }
      this.idRestaurant = params.idRestaurant;
      this.name = user.firstname;
    });


    this.menuService.getMenu(this.idRestaurant)
      .subscribe((menu: any) => {
        const count = Object.keys(menu).length;

        if (count > 1) {
          this.platosFuertes = menu.dishes.platosFuertes;
          this.platosCorrientes = menu.dishes.platosCorrientes;
          this.drinks = menu.dishes.drinks;
          this.entrances = menu.dishes.entrances;
          this.additionals = menu.dishes.additionals;
        }
      });
  }

  save(): void {
    this.btnSaveMenu = 'CARGANDO...';
    const body = {
      dishes: {
        platosFuertes: this.platosFuertes,
        platosCorrientes: this.platosCorrientes,
        drinks: this.drinks,
        entrances: this.entrances,
        additionals: this.additionals
      },
      idRestaurant: this.idRestaurant
    };

    this.menuService.addMenuItem(body)
      .then(() => {
        this.btnSaveMenu = 'INGRESAR MENU';
        this.router.navigate(['/']);
      })
      .catch((e: any) => {
        this.alertError = e.error.response || 'Se ha presentado un error, intente nuevamente.';
        this.btnSaveMenu = 'INGRESAR MENU';
      });
  }

  ngOnInit(): void {
  }
}
