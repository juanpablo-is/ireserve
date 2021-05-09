import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.sass']
})
export class ReservationsComponent implements OnInit {

  user: any;

  constructor(
    private router: Router
  ) {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    if (!this.user) { this.router.navigate(['/login']); return; }
  }

  ngOnInit(): void {
  }

}
