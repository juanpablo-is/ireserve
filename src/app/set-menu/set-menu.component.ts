import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Categoria } from '../interfaces/menu';
import { MenuService } from '../services/backend/menu/menu.service';

@Component({
  selector: 'app-set-menu',
  templateUrl: './set-menu.component.html',
  styleUrls: ['./set-menu.component.sass']
})

export class SetMenuComponent implements OnInit {
  @ViewChild('addCategory') addCategory: ElementRef
  idRestaurant: string;
  name: string;
  form: FormGroup;
  alertError: string;
  btnSaveMenu = 'INGRESAR MENU';

  categories: any[] = [];

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
        
        if(count > 1){
          this.categories = menu.categories;
        }
        else{
          this.categories = []
        }
      });
  }

  save(): void {
    this.btnSaveMenu = 'CARGANDO...';
    const body = {
      categories: this.categories,
      idRestaurant: this.idRestaurant
    };

    this.menuService.addMenuItem(body)
      .then(() => {
        this.btnSaveMenu = 'INGRESAR MENU';
        //this.router.navigate(['/']);
        alert('Datos actualizados')
      })
      .catch((e: any) => {
        this.alertError = e.error.response || 'Se ha presentado un error, intente nuevamente.';
        this.btnSaveMenu = 'INGRESAR MENU';
      });
      console.log(this.categories)
  }

  add(): void{
    this.categories.push({
      categoryName: this.addCategory.nativeElement.value,
      categoryValues: []
    })
    this.addCategory.nativeElement.value='';
  }

  del():void{
    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i].name === this.name) {
        this.categories.splice(i, 1);
      }
    }
  }

  ngOnInit(): void {
  }
}
