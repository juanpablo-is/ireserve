import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.sass']
})
export class MenuItemComponent implements OnInit {

  @ViewChild('mItem') mItem: ElementRef;
  @Input() items: any[];
  @Input() userId: string;
  @Input() name: string;
  @Input() price: number;
  @Input() description: string;
  @Input() urlPhoto: string;
  constructor() { }

  ngOnInit(): void {
    console.log("entra");
    console.log(this.items)
  }

  delete(): void {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].name === this.name) {
        this.items.splice(i, 1);
        break;
      }
    }
  }
}
