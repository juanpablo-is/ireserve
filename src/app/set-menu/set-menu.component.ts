import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-set-menu',
  templateUrl: './set-menu.component.html',
  styleUrls: ['./set-menu.component.sass']
})

export class SetMenuComponent implements OnInit {

  platoFuerte:String
  platoCorriente:String
  bebidas:String
  entradas:String
  adicionales:String

  platosFuertes:any[] = [
    {name:"PFN1",price:"PFP1"},
    {name:"PFN2",price:"PFP2"}
  ]
  
  platosCorrientes:any[] = [
    {name:"PCN1",price:"PCP1"},
    {name:"PCN2",price:"PCP2"}
  ]

  drinks:any[] = [
    {name:"BN1",price:"BP1"},
    {name:"BN2",price:"BP2"}
  ]

  entrances:any[] = [
    {name:"EN1",price:"EP1"},
    {name:"EN2",price:"EP2"}
  ]
  
  additionals:any[] = [
    {name:"AN1",price:"AP1"},
    {name:"AN2",price:"AP2"}
  ]

  constructor() { 
    this.platoFuerte = "Plato fuerte"
    this.platoCorriente = "Plato Corriente"
    this.bebidas = "Bebidas"
    this.entradas= "Entradas"
    this.adicionales = "Adicionales"
  }

  ngOnInit(): void {
  }

}
