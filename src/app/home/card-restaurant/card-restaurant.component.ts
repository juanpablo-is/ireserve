import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-restaurant',
  templateUrl: './card-restaurant.component.html',
  styleUrls: ['./card-restaurant.component.sass']
})
export class CardRestaurantComponent implements OnInit {

  @Input() item: any;

  constructor() {
    // console.log(this.item);
  }

  ngOnInit(): void {
    console.log(this.item);
  }

}
