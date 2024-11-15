import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { EgresoService } from '../../services/egreso.service';
import { Egreso } from '../../models/egreso.model';
import { delay, Subscription } from 'rxjs';

@Component({
  selector: 'app-egreso',
  templateUrl: './egreso.component.html',
  styleUrl: './egreso.component.css'
})
export class EgresoComponent implements OnInit, OnDestroy {

  private egresoServices = inject(EgresoService)
  private subscription!: Subscription ;

  public egreso :Egreso = {
    id: '',
    nombre:'',
    motivo:'',
    justificacion:'',
    monto: 0,
    cambio: 0,
    formaPago: '',
    muebleria: {uid:'', neto: 0},
    transacciones: []
  };
  public buscarById!:string;
  public idExist:boolean = false;
  public existeErrorBuscarID = false;
  public egresos: Egreso[] = []
  public egresosTemp: Egreso[] = []
  //abrir y cerrar cajas de boton
  public mostrarCajaForm:boolean = false;
  public mostrarCajaFormEliminar:boolean = false;
  public mostrarTablaEliminar:boolean = false;
  public animacion:boolean = false;
  public cajaEdit = false;
  public cajaCrear = false;

  constructor(){}
  
  ngOnInit(): void {
    this.subscription = this.egresoServices.egresoCreado$.subscribe(() => this.cargarEgresos());
    this.cargarEgresos();
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
    
  monstrarEgresoById(id:string){
    
    if(id == "nuevo"){
       console.log("por aqui paso")
       return;
    }

    this.egresoServices.cargarEgresoById( id )
      .pipe(
        delay(300)
      )
      .subscribe( (egreso:Egreso) => {
        if(egreso && egreso.id){
          this.egreso = egreso;
          this.idExist = false;
          this.mostrarTablaEliminar = true;
          this.existeErrorBuscarID = false;
        }else{
          this.idExist = true;
          this.mostrarTablaEliminar = false;
          this.existeErrorBuscarID = true;
          setTimeout(() => {
            this.existeErrorBuscarID = false;
          }, 3000)
          console.error('El Egreso Cargado no tiene un id definido')
        }
      }, error =>{
        this.idExist = true;
        this.mostrarTablaEliminar = false;
        this.existeErrorBuscarID = true;
        setTimeout(() => {
          this.existeErrorBuscarID = false;
        }, 3000)
        console.error('Error al Cargar Egreso', error)
      })



  }


  formatCurrency(value: number): string { 
    return value.toLocaleString('en-US', { 
          style: 'currency', 
          currency: 'USD' 
        }); 
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

  mostrarTablaVerificar(){
    this.monstrarEgresoById(this.buscarById)
  }

  regresarVerificar(){
    this.idExist = true;
    this.mostrarTablaEliminar = false;
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
