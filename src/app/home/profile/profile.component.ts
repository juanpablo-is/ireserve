import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from 'src/app/services/backend/rest.service';
import { LocalStorageService } from 'src/app/services/frontend/local-storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})

export class ProfileComponent implements OnInit {
  
  logo: string;
  isUser: boolean
  user: any;
  restaurant: any = {};
  
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private restService: RestService
    ) { 
    this.user = this.localStorageService.getData('user');
    if (!this.user.uid) {
      this.router.navigate(['/']);
      return;
    }

    if (this.user.role == 'Cliente' ) {
      this.isUser = true;
      this.restService.get(`/api/restaurant/${this.user.idRestaurant}`)
      .then(response => {
        if (response.ok && response.status === 200) {
          this.restaurant = response.body;
          console.log(this.restaurant.urlPhoto)
        } else {
          this.router.navigate(['/']);
        }
      })
      .catch(() => {
        this.router.navigate(['/']);
      }); 
    }else{
      this.isUser = false
      this.restaurant = {
        address: "n" ,
        countTables: "n",
        dateEnd: "n",
        dateStart: "n",
        idUser: "n",
        name:"n",
        phone:"n",
        type:"n",
        urlPhoto: "https://image.flaticon.com/icons/png/512/16/16363.png"
      }
    }
    
  }

  closeSesion() :void{
    localStorage.clear()
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
  }
}
