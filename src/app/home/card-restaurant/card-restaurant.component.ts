import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-restaurant',
  templateUrl: './card-restaurant.component.html',
  styleUrls: ['./card-restaurant.component.sass']
})
export class CardRestaurantComponent {

  @Input() item: any;

  constructor() {
  }
}
