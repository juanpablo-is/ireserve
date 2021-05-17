import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from 'src/app/services/backend/rest.service';
import { LocalStorageService } from 'src/app/services/frontend/local-storage.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.sass']
})
export class UserInfoComponent implements OnInit {

  idUser:string
  user:any
  
  @ViewChild('firstname') firstname: ElementRef;
  
  @ViewChild('lastname') lastname : ElementRef;
  
  @ViewChild('phone ') phone : ElementRef;
  
  @ViewChild('oldpass') oldpass: ElementRef;
  
  @ViewChild('newpass') newpass: ElementRef;
  
  @ViewChild('confirmnewpass') confirmnewpass: ElementRef;


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private restService: RestService,
    private localStorageService: LocalStorageService
    ) { 
    this.idUser = this.activatedRoute.snapshot.paramMap.get('id');

    this.restService.get(`/api/user?uid=${this.idUser}`)
    .then(response => {
      if (response.ok && response.status === 200) {
        this.user = response.body.data;        
      } 
    })
    .catch(() => {
      this.router.navigate(['/']);
    }); 

    this.user = { 
      email: "",
      firstname: "",
      lastname: "",
      password:"",
      newPass: "",
      phone:"",
      role: "",
      uid: ""   
    }

  }

  updateUser():void{

    if (this.newpass.nativeElement.value === this.confirmnewpass.nativeElement.value) {
      let user ={
        email: this.user.email,
        firstname: this.firstname.nativeElement.value,
        lastname: this.lastname.nativeElement.value,
        password: this.oldpass.nativeElement.value,
        newPass: this.newpass.nativeElement.value,
        phone:this.phone.nativeElement.value,
        role: this.user.role,
        uid: this.idUser
      }
      this.restService.put(`/api/user`, user)
      .then(response => {
        if (response.ok && response.status === 200) {
          this.user = user;
          delete user.password
          delete user.newPass
          alert('informacion actualizada')
          this.localStorageService.clearStorage()
          this.localStorageService.updateData('user',user)
        } else {
        }
      })  
    } else {
      alert("Campos de credenciales incorrrectos")
    }
  }
  ngOnInit(): void {
  }

}
