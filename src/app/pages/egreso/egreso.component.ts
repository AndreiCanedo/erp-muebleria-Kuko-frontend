import { Component, inject, OnInit } from '@angular/core';
import { EgresoService } from '../../services/egreso.service';
import { Egreso } from '../../models/egreso.model';
import { delay } from 'rxjs';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-egreso',
  templateUrl: './egreso.component.html',
  styleUrl: './egreso.component.css'
})
export class EgresoComponent implements OnInit {

  private egresoServices = inject(EgresoService)
  private fb = inject(FormBuilder)

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
  public mostrarCajaForm:boolean = false;
  public mostrarCajaFormEliminar:boolean = false;
  public mostrarTablaEliminar:boolean = false;
  public animacion:boolean = false;
  public cajaEdit = false;
  public cajaCrear = false;
  public egresoForm!: FormGroup;

  constructor(){
    this.resetForm();
  }
  
  ngOnInit(): void {
    this.cargarEgresos();
  }

  cargarEgresos(){
    this.egresoServices.cargarEgresos()
      .subscribe(egresos => {
        this.egresos = egresos
        this.egresosTemp = egresos
      })
  }

  

  guardarEgreso(){
    if(this.egresoForm.valid){
      let idValue = this.egresoForm.get('id')?.value
      let egresoN = this.egresoForm.value
      console.log('egreso component => ', this.egresoForm.value)
      console.log('id => ', idValue)
      if(idValue != null){
        this.egresoServices.actualizarEgreso(egresoN,idValue)
          .subscribe(
            resp => Swal.fire('Factura de egreso Actualizada correctamente','success'),
            error => console.error("error al actualizar egreso", error)
          )
      }else{
        this.egresoServices.crearEgreso(egresoN)
        .subscribe(
          resp => Swal.fire('Factura de egreso Creada correctamente','success'),
          error => console.error("error al crear factura egreso", error)
        )
      }
    }else{
      console.log('Formulario invalido')
    }

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
    this.resetForm();
    this.cajaEdit = true;
    this.cajaCrear = false;
    this.mostrarCajaFormEliminar =false;
    this.mostrarTablaEliminar = false
    this.mostrarCaja();
  }

  mostrarCajaCrear(){
    this.resetForm();
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
    setTimeout(()=> this.animacion = false, 300);
  }

  //OCULTAR CAJA
  cerrarCaja(event:Event){
    event.preventDefault();//evitar que se envie los datos
    this.resetForm();//cada vez que cerremos reiniciemos formulario
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

  //Reiniciar Servicios
  resetForm(){
    this.egresoForm = this.fb.group({
      
      nombre:[ '', Validators.required ],
      motivo:[ '', Validators.required ],
      justificacion:[ '', Validators.required],
      monto:[ 0, Validators.required],
      cambio:[ 0 ],
      formaPago:[ '', Validators.required],
      muebleria: this.fb.group({
        id:['1']
      })
    })
  }

}
