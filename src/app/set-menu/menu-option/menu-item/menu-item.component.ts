import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.sass']
})
export class MenuItemComponent implements OnInit {
  @ViewChild("mItem") mItem: ElementRef
  @Input()
  name:String
  @Input()
  price:Number
  
  constructor() { }

  ngOnInit(): void {
  }

  del(){
    this.mItem.nativeElement.classList.add("hidden")
  }
}
