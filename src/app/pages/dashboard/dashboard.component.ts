import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MuebleriaService } from '../../services/muebleria.service';
import { TransaccionService } from '../../services/transaccion.service';
import { Transaccion } from '../../models/transaccion.model';

import moment from 'moment';
import { StorageServiceService } from '../../services/storage-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy{
  public neto!:string
  public transacciones:Transaccion[] = []
  public trasaccionesPorSemanaIngreso:{ [key:string]:number } = {}
  public trasaccionesPorSemanaEgreso:{ [key:string]:number } = {}
  public transaccionesTotal:Transaccion[]=[]
  


  private muebleriaServices = inject(MuebleriaService)
  private transaccionServices = inject(TransaccionService)
  private storageServices = inject(StorageServiceService)

  constructor(){
  }

  ngOnInit(): void {
    this.cargarDatos();
    const idMuebleria = "1";
    this.muebleriaServices.obtennerMuebleriaById(idMuebleria)
      .subscribe(muebleria => {
        this.neto = this.formatCurrency(muebleria.neto);
      })
    
    this.transaccionServices.cargarTransaccion()
      .subscribe(transacciones =>{
        this.transaccionesTotal = transacciones;
        this.trasaccionesRecientes(transacciones)
        this.agruparTransaccionesPorSemana()
        this.actualizarDatosGrafica()
      }) 
    
  }
  //Para no acomular informacion en mi localStorage
  ngOnDestroy(): void {
      this.limpiarDatos();
  }

  //Cargar Datos Desde el LocalStorage
  private cargarDatos():void{
    const egreso = this.storageServices.cargarDatos('trasaccionesPorSemanaEgreso')
    const ingreso = this.storageServices.cargarDatos('trasaccionesPorSemanaIngreso')

    if(egreso){
      try{
        this.trasaccionesPorSemanaEgreso = JSON.parse(egreso)
      }catch(e){
        this.trasaccionesPorSemanaEgreso = egreso
      }
    }
    if(ingreso){
      try{
        this.trasaccionesPorSemanaIngreso = JSON.parse(ingreso)
      }catch(e){
        this.trasaccionesPorSemanaIngreso = ingreso
      }
    }
  }

  //Guardar Datos En El LocalStorage
  private guardarDatos(): void{
    this.storageServices.guardarDatos('trasaccionesPorSemanaEgreso', JSON.stringify(this.trasaccionesPorSemanaEgreso))
    this.storageServices.guardarDatos('trasaccionesPorSemanaIngreso', JSON.stringify(this.trasaccionesPorSemanaIngreso))
  }

  //Limpiar Datos
  private limpiarDatos(): void{
    this.storageServices.guardarDatos('trasaccionesPorSemanaEgreso', {})
    this.storageServices.guardarDatos('trasaccionesPorSemanaIngreso', {})
  }

  //Por si contamos con una actualizacion en la grafica
  actualizarDatosGrafica(): void { // Esta función forzará la detección de cambios al actualizar facturasEgreso y facturasIngreso 
    this.trasaccionesPorSemanaEgreso = { ...this.trasaccionesPorSemanaEgreso }; 
    this.trasaccionesPorSemanaIngreso = { ...this.trasaccionesPorSemanaIngreso }; 
    this.guardarDatos()//Guardar datos cada vez actualicemos
  }


  //Obtener las ultimas 6 transacciones
  trasaccionesRecientes(transacciones:Transaccion[]){
    const numArreglo = transacciones.length
    for(let i = numArreglo -1;i >= numArreglo-6 && i >= 0; i--){
      this.transacciones.push(transacciones[i])
    }
  }

  //Calcular el tipo de transaccion
  calcularTransaccion(transaccion:Transaccion):number{
    if(transaccion.tipo == 'EGRESO'){
      return transaccion.netoNuevo - transaccion.netoActual
    }else{
      return transaccion.netoActual - transaccion.netoNuevo
    }
  }


  //FORMATEAR MI Numeros a MONENA
  formatCurrency(value: number): string { 
    return value.toLocaleString('en-US', { 
          style: 'currency', 
          currency: 'USD' 
        }); 
  }

  //AGRUPAR MIS EGRESOS O INGRESOS POR SEMANA PARA LA GRAFICA
  agruparTransaccionesPorSemana(){

    //Limpiar variables antes de agrupar
    this.trasaccionesPorSemanaEgreso = {}
    this.trasaccionesPorSemanaIngreso = {}

    this.transaccionesTotal.forEach(transaccion => {
      const semana = moment(transaccion.fecha).startOf('week').format('YYYY-MM-DD');
      if(transaccion.tipo == 'EGRESO'){
        if(!this.trasaccionesPorSemanaEgreso[semana]){
          this.trasaccionesPorSemanaEgreso[semana] = 0
        }
        let monto = this.calcularTransaccion(transaccion);
        this.trasaccionesPorSemanaEgreso[semana] += monto; 
      }
      if(transaccion.tipo == 'INGRESO'){
        if(!this.trasaccionesPorSemanaIngreso[semana]){
          this.trasaccionesPorSemanaIngreso[semana] = 0
        }
        let monto = this.calcularTransaccion(transaccion);
        this.trasaccionesPorSemanaIngreso[semana] += monto;
      }
    })
    this.guardarDatos();   
  }
}
