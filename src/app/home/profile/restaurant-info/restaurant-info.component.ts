import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from 'src/app/services/backend/rest.service';
import { LocalStorageService } from 'src/app/services/frontend/local-storage.service';

@Component({
  selector: 'app-restaurant-info',
  templateUrl: './restaurant-info.component.html',
  styleUrls: ['./restaurant-info.component.sass']
})
export class RestaurantInfoComponent implements OnInit {
  
  user:any;
  restaurant:any = {};

  @ViewChild('address') address: ElementRef;
  
  @ViewChild('countTables') countTables : ElementRef;
  
  @ViewChild('dateStart') dateStart: ElementRef;
    
  @ViewChild('dateEnd') dateEnd : ElementRef;
  
  @ViewChild('name') name: ElementRef;
  
  @ViewChild('phone') phone: ElementRef;
  
  constructor(
    private router: Router,
    private restService: RestService,
    private localStorageService: LocalStorageService
  ) { 
    
    this.user = this.localStorageService.getData('user');
    this.restService.get(`/api/restaurant/${this.user.idRestaurant}`)
    .then(response => {
      if (response.ok && response.status === 200) {
        this.restaurant = response.body;
      } else {
        this.router.navigate(['/']);
      }
    })
    .catch(() => {
      this.router.navigate(['/']);
    }); 
  }

  updateRestaurant():void{
    let restau ={
      address: this.address.nativeElement.value,
      countTables: this.countTables.nativeElement.value,
      dateStart: this.dateStart.nativeElement.value,
      dateEnd: this.dateEnd.nativeElement.value,
      idUser: this.user.uid,
      name: this.name.nativeElement.value,
      open: this.restaurant.open,
      phone:this.phone.nativeElement.value,
      stars: this.restaurant.stars,
      type: this.restaurant.type,
      urlPhoto: this.restaurant.urlPhoto,
      idRestaurant: this.user.idRestaurant
    }
    
    this.restService.put(`/api/restaurant`, restau)
    .then(response => {
      if (response.ok && response.status === 200) {
        this.restaurant =  restau;
        alert('informacion actualizada')
      } else {
      }
    })
  } 

  ngOnInit(): void {
  }

}
