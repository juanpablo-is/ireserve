import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from '../services/backend/rest.service';
import { LocalStorageService } from '../services/frontend/local-storage.service';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.sass']
})
export class RestaurantComponent {

  @ViewChild('spinner') spinner: ElementRef;
  idRestaurant: any;
  data: any = {};
  menu: any = {};
  objectKeys = Object.keys;
  type = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private restService: RestService,
    private localStorageService: LocalStorageService
  ) {
    const user = this.localStorageService.getData('user');
    if (!user) { this.router.navigate(['/login']); return; }

    this.idRestaurant = this.activatedRoute.snapshot.paramMap.get('id');
    if (!this.idRestaurant) {
      this.router.navigate(['/']);
      return;
    }

    this.restService.get(`/api/restaurant/${this.idRestaurant}`)
      .then(response => {
        if (response.ok && response.status === 200) {
          this.data = response.body;

          this.restService.get(`/api/menu?idRestaurant=${this.idRestaurant}`)
            .then(responseRestaurant => {
              if (responseRestaurant.ok && responseRestaurant.status === 200) {
                this.menu = responseRestaurant.body.dishes;
                this.spinner.nativeElement.remove();
              } else {
                this.router.navigate(['/']);
              }
            })
            .catch(() => {
              this.router.navigate(['/']);
            });
        } else {
          this.router.navigate(['/']);
        }
      })
      .catch(() => {
        this.router.navigate(['/']);
      });
  }

  transformKey = {
    breakfast: 'Desayunos',
    platosFuertes: 'Platos fuertes',
    platosCorrientes: 'Platos corrientes',
    drinks: 'Bebidas',
    entraces: 'Entradas',
    additionals: 'Adicionales',
    desserts: 'Postres',
    iceCream: 'Helados',
    shakes: 'Batidos',
    waffles: 'Waffles',
    beers: 'Cervezas',
    cocktails: 'Cocteles',
    wines: 'Vinos',
    coffee: 'Café',
  };

  /**
   * Returna 'true' si es la primera categoria de items del menú.
   */
  firstCategory(type: string): boolean {
    if (type === this.type) {
      return true;
    }

    if (this.type === '') {
      this.type = type;
      return true;
    }
    return false;
  }

  /**
   * Evento para retroceder pestaña.
   */
  onBack(): void {
    history.back();
  }

}
