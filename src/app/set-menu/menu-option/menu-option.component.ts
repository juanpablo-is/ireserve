import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-menu-option',
  templateUrl: './menu-option.component.html',
  styleUrls: ['./menu-option.component.sass']
})
export class MenuOptionComponent implements OnInit {
  @Input()
  nameOption:String
  @Input()
  items:any[]

  @ViewChild("show") eShow: ElementRef
  @ViewChild("addName") addName: ElementRef
  @ViewChild("addPrice") addPrice: ElementRef

  isShowed:boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  showListOfItems(){
    if(this.isShowed===true){
      this.eShow.nativeElement.classList.add("hidden");
      this.isShowed = false;
    }
    else{
      this.eShow.nativeElement.classList.remove("hidden");
      this.isShowed = true;
    }
  }

  add(){
    let newName = this.addName.nativeElement.value
    let newPrice = this.addPrice.nativeElement.value
    this.items.push({name:newName,price:newPrice})
  }
}
