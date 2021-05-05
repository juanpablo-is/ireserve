import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bottom-navigation',
  templateUrl: './bottom-navigation.component.html',
  styleUrls: ['./bottom-navigation.component.sass']
})
export class BottomNavigationComponent implements OnInit {

  @Input() buttons: any[];

  constructor() { }

  ngOnInit(): void {
  }

}
