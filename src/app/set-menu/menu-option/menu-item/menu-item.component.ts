import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.sass']
})
export class MenuItemComponent implements OnInit {

  @ViewChild('mItem') mItem: ElementRef;
  @Input() name: string;
  @Input() price: number;

  constructor() { }

  ngOnInit(): void {
  }

  delete(): void {
    this.mItem.nativeElement.remove();
  }
}
