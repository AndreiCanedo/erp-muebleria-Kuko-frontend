import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MuebleriaService } from '../../services/muebleria.service';
import { TransaccionService } from '../../services/transaccion.service';
import { Transaccion } from '../../models/transaccion.model';

import { StorageServiceService } from '../../services/storage-service.service';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy{
  private muebleriaServices = inject(MuebleriaService)
  private transaccionServices = inject(TransaccionService)
  private storageServices = inject(StorageServiceService)
  private utilServices = inject(UtilService)
  
  
  public neto!:string
  public transacciones:Transaccion[] = []
  public trasaccionesPorSemanaIngreso:any = {}
  public trasaccionesPorSemanaEgreso:any = {}
  public transaccionesTotal:Transaccion[]=[]
  
  constructor(){
  }

  ngOnInit(): void {
    this.cargarDatos();
    const idMuebleria = "1";
    this.muebleriaServices.obtennerMuebleriaById(idMuebleria)
      .subscribe(muebleria => {
        this.neto = this.utilServices.formatCurrency(muebleria.neto);
      })
    
    this.transaccionServices.cargarTransaccion()
      .subscribe(transacciones =>{
        this.transaccionesTotal = transacciones;
        const agrupadas = this.transaccionServices.agruparTransaccionPorSemana(transacciones)
        this.trasaccionesRecientes(transacciones)
        this.trasaccionesPorSemanaEgreso = agrupadas.egresos
        this.trasaccionesPorSemanaIngreso = agrupadas.ingresos
        this.actualizarDatosGrafica()
      }) 
    
  }
  //Para no acomular informacion en mi localStorage
  ngOnDestroy(): void {
      // this.limpiarDatos();
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

  
  //Limpiar Datos
  private limpiarDatos(): void{
    this.storageServices.guardarDatos('trasaccionesPorSemanaEgreso', {})
    this.storageServices.guardarDatos('trasaccionesPorSemanaIngreso', {})
  }
  
  //Por si contamos con una actualizacion en la grafica
  actualizarDatosGrafica(): void { 
    this.trasaccionesPorSemanaEgreso = { ...this.trasaccionesPorSemanaEgreso }; 
    this.trasaccionesPorSemanaIngreso = { ...this.trasaccionesPorSemanaIngreso }; 
    this.guardarDatos()//Guardar datos cada vez actualicemos
  }
  
  //Guardar Datos En El LocalStorage
  private guardarDatos(): void{
    this.storageServices.guardarDatos('trasaccionesPorSemanaEgreso', JSON.stringify(this.trasaccionesPorSemanaEgreso))
    this.storageServices.guardarDatos('trasaccionesPorSemanaIngreso', JSON.stringify(this.trasaccionesPorSemanaIngreso))
  }

  //Obtener las ultimas 6 transacciones
  trasaccionesRecientes(transacciones:Transaccion[]){
    const numArreglo = transacciones.length
    for(let i = numArreglo -1;i >= numArreglo-6 && i >= 0; i--){
      this.transacciones.push(transacciones[i])
    }
  }

  //Calcular el tipo de transaccion
  calcularTransaccion(transaccion:Transaccion):string{
    let transaccionResiente = this.transaccionServices.calcularTransaccion(transaccion)
    return this.utilServices.formatCurrency(transaccionResiente)
  }

}
