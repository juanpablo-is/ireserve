import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-restaurant',
  templateUrl: './card-restaurant.component.html',
  styleUrls: ['./card-restaurant.component.sass']
})
export class CardRestaurantComponent implements OnInit {

  @Input() item: any;

  starsEmpty = new Array(5);

  constructor() {
  }

  ngOnInit(): void {
    console.log(this.item);
  }

}
