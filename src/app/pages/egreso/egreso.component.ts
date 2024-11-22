import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { EgresoService } from '../../services/egreso.service';
import { Egreso } from '../../models/egreso.model';
import { Subscription } from 'rxjs';
import { StorageServiceService } from '../../services/storage-service.service';
import { UtilService } from '../../services/util.service';
import { TransaccionService } from '../../services/transaccion.service';
import { Transaccion } from '../../models/transaccion.model';
import moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-egreso',
  templateUrl: './egreso.component.html',
  styleUrl: './egreso.component.css'
})
export class EgresoComponent implements OnInit, OnDestroy {

  private fb = inject(FormBuilder)
  private utilServices = inject(UtilService)
  private egresoServices = inject(EgresoService)
  private transaccionServices = inject(TransaccionService)
  

  ///////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////Datos para tabla////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////
  public egresos: any[] = []
  public egresosTemp: any[] = []
  public columns:string[] = ['id', 'nombre', 'motivo', 'justificacion', 'monto', 'cambio', 'formaPago']
  
  ///////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////Datos Egresos semanal////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////
  private subscription!: Subscription ;
  public transaccionesTotales:Transaccion[] =[]
  public egresoSemanaActual:string = '';

  ////////////////////////////TODO/////////////////////////////////////////////
  //////////////////////Estimado gasto Semanal////////////////////////////////
  /////////////////////////////////////////////////////////////////////////
  public estimadoForm!:FormGroup;
  public estimadoSemanal:string= this.utilServices.formatCurrency(138200);
  public estimadoError:boolean = false;
  
  /////////////////////////////////////////////////////////////////////////
  /////////////////////Variables para cerrar y abrir cajas///////////////////////////////
  /////////////////////////////////////////////////////////////////////////
  public cajaEdit = false;
  public cajaCrear = false;
  public animacion:boolean = false;
  public gastoSemanalActual:string = '0';
  public mostrarCajaForm:boolean = false;
  public mostrarTablaEliminar:boolean = false;
  public mostrarCajaFormEliminar:boolean = false;
  public mostrarCajaEstimado:boolean = false;

  constructor(){ this.resetForm()}
  
  ngOnInit(): void {
    this.subscription = this.egresoServices.egresoCreado$.subscribe(() => this.cargarEgresos());
    
    this.cargarEgresos();
    
    this.transaccionServices.cargarTransaccion()
      .subscribe(transacciones => {
        const agrupadas = this.transaccionServices.agruparTransaccionPorSemana(transacciones)
        this.transaccionesTotales = agrupadas.egresos
        this.transaccionSemanal();
      })
  }

  ngOnDestroy():void {
    this.subscription.unsubscribe();
  }

  cargarEgresos(){
    this.egresoServices.cargarEgresos()
      .subscribe(egresos => {
        this.egresos = egresos.map(egreso => ({
          id:egreso.id,
          nombre: egreso.nombre,
          motivo: egreso.motivo,
          justificacion: egreso.justificacion,
          monto: this.utilServices.formatCurrency(egreso.monto),
          cambio: this.utilServices.formatCurrency(egreso.cambio),
          formaPago: egreso.formaPago
        }));
        this.egresosTemp = [... this.egresos]
      })
  }


    
  formatCurrency(value: number): string { 
    return this.utilServices.formatCurrency(value)
  }

  transaccionSemanal(){
    console.log(this.transaccionesTotales)
    const semanaActual = moment().startOf('week').format('YYYY-MM-DD')
    const semanas = Object.keys(this.transaccionesTotales)
    const value = Object.values(this.transaccionesTotales)
    const ultimaSemana = value.length - 1 

    let egresoSemanaActual = 0

    if(semanas.includes(semanaActual)){
      egresoSemanaActual = Number(value[ultimaSemana])
    }else{
      egresoSemanaActual = 0;
    }

    this.egresoSemanaActual = this.utilServices.formatCurrency(egresoSemanaActual);
  }

  ////////////////////////////////TODOOOO/////////////////////////////////////
  actualizarEstimado(){
    if(this.estimadoForm.valid){
      let estimado = this.estimadoForm.get('estimado')?.value
      if(estimado != 0){
        this.estimadoSemanal = this.utilServices.formatCurrency(estimado);
        this.cerrarCaja()
      }else{
          this.estimadoError = true
      }

    }
  }

  resetForm(){
    this.estimadoForm = this.fb.group({
      estimado:['',Validators.required]
    })
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
      this.mostrarTablaEliminar = false;
      this.mostrarCajaEstimado = false;
    }, 500);
  }

  cajaEstimado(){
    this.mostrarCajaEstimado = true;
  }

}
