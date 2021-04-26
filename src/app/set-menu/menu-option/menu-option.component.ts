import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-menu-option',
  templateUrl: './menu-option.component.html',
  styleUrls: ['./menu-option.component.sass']
})
export class MenuOptionComponent implements OnInit {

  @Input() nameOption: string;
  @Input() items: any[];

  @ViewChild('show') eShow: ElementRef;
  @ViewChild('addName') addName: ElementRef;
  @ViewChild('addPrice') addPrice: ElementRef;

  isShowed = false;

  constructor() { }

  ngOnInit(): void {
  }

  showListOfItems(): void {
    if (this.isShowed === true) {
      this.eShow.nativeElement.classList.add('hidden');
    } else {
      this.eShow.nativeElement.classList.remove('hidden');
    }
    this.isShowed = !this.isShowed;
  }

  add(): void {
    const newName = this.addName.nativeElement.value;
    const newPrice = this.addPrice.nativeElement.value;
    if (newName && newPrice) {
      this.items.push({ name: newName, price: newPrice });
    }
    this.addName.nativeElement.value = '';
    this.addPrice.nativeElement.value = '';
  }
}
