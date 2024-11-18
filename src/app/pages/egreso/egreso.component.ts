import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { EgresoService } from '../../services/egreso.service';
import { Egreso } from '../../models/egreso.model';
import { Subscription } from 'rxjs';
import { StorageServiceService } from '../../services/storage-service.service';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-egreso',
  templateUrl: './egreso.component.html',
  styleUrl: './egreso.component.css'
})
export class EgresoComponent implements OnInit, OnDestroy {

  private egresoServices = inject(EgresoService)
  private storageServices = inject(StorageServiceService)
  private utilServices = inject(UtilService)
  
  private subscription!: Subscription ;
  public egresos: Egreso[] = []
  public egresosTemp: Egreso[] = []
  
  //abrir y cerrar cajas de boton
  public mostrarCajaForm:boolean = false;
  public mostrarCajaFormEliminar:boolean = false;
  public mostrarTablaEliminar:boolean = false;
  public animacion:boolean = false;
  public cajaEdit = false;
  public cajaCrear = false;
  public gastoSemanalActual:string = '0';

  constructor(){}
  
  ngOnInit(): void {
    this.subscription = this.egresoServices.egresoCreado$.subscribe(() => this.cargarEgresos());
    this.cargarEgresos();
    this.transaccionSemanal();
  }

  ngOnDestroy():void {
    this.subscription.unsubscribe();
  }

  cargarEgresos(){
    this.egresoServices.cargarEgresos()
      .subscribe(egresos => {
        this.egresos = egresos
        this.egresosTemp = egresos
      })
  }
    
  formatCurrency(value: number): string { 
    return this.utilServices.formatCurrency(value)
  }

  transaccionSemanal(){
    
    let totalDeSemanas
    const transaccionSemanal = this.storageServices.cargarDatos('trasaccionesPorSemanaEgreso')
    console.log(transaccionSemanal)

    // totalDeSemanas = transaccionSemanal?.length
    // this.gastoSemanalActual = transaccionSemanal[totalDeSemanas]


  }



  /***********************************************************************/
  /*****************************Cajas CSS*********************************/
  /***********************************************************************/
  mostrarCajaEdit(){
    this.cajaEdit = true;
    this.cajaCrear = false;
    this.mostrarCajaFormEliminar =false;
    this.mostrarTablaEliminar = false
    this.mostrarCaja();
  }

  mostrarCajaCrear(){
    this.cajaEdit=false;
    this.cajaCrear = true;
    this.mostrarCajaFormEliminar =false;
    this.mostrarTablaEliminar = false
    this.mostrarCaja();
  }

  mostrarCajaEliminar(){
    this.animacion = true
    this.cajaEdit=false;
    this.cajaCrear =false;
    this.mostrarCajaForm = false;
    this.mostrarCajaFormEliminar = true;
    setTimeout(()=> this.animacion = false, 300);
  }

  // MONSTRAR CAJA
  mostrarCaja(){
    this.animacion = true;
    this.mostrarCajaForm = true;
    setTimeout(()=> this.animacion = false, 100);
  }

  //OCULTAR CAJA
  cerrarCaja(){
    this.animacion=true;
    setTimeout(()=>{
      this.animacion = false;
      this.mostrarCajaForm = false;
      this.cajaCrear = false;
      this.cajaEdit = false;
      this.mostrarCajaFormEliminar =false;
      this.mostrarTablaEliminar = false
    }, 500);
  }

}
