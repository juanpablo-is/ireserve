import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.sass']
})
export class MenuItemComponent {

  @Input() items: any[];
  @Input() userId: string;
  @Input() data: any;
  @Input() index: any;

  isShowed = true;

  constructor() { }

  showItem(): void {
    this.isShowed = !this.isShowed;
  }

  delete(): void {
    this.items.splice(this.index, 1);
  }
}
