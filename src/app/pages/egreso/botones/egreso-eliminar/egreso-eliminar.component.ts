import { Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EgresoService } from '../../../../services/egreso.service';
import { Egreso } from '../../../../models/egreso.model';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-egreso-eliminar',
  templateUrl: './egreso-eliminar.component.html',
  styleUrl: './egreso-eliminar.component.css'
})
export class EgresoEliminarComponent implements OnInit, OnDestroy {

  private fb = inject(FormBuilder)
  private egresoServices = inject(EgresoService)
  
  public egreso!:Egreso;
  public egresoId!: FormGroup;
  private subscription!: Subscription;
  public existeErrorBuscarID:boolean =false;
  public idExist:boolean = false;
  
  constructor(){this.resetForm();}
  
  ngOnInit(): void {
    this.resetForm();
  }
  
  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }
  
  @Output() cancelar = new EventEmitter<void>();

  formatCurrency(value: number): string { 
    return value.toLocaleString('en-US', { 
          style: 'currency', 
          currency: 'USD' 
        }); 
  }

  buscarId(){
    if(this.egresoId.valid){
      let idValue = this.egresoId.get('idFound')?.value;
      if(idValue != null){
        this.egresoServices.cargarEgresoById(idValue).
          subscribe(egreso => {
            if(egreso){
              this.egreso = egreso;
              console.log(this.egreso.id)
              this.idExist = true;
            }else{
              this.idExist = false;
              console.log('Egreso no encontrado')
            }
          }, error => {
            this.idExist = false
            this.existeErrorBuscarID = true;
            setTimeout(() => {
              this.existeErrorBuscarID = false;
            }, 3000)
            console.log('Error al cargar Egreso', error)
          })
      }

    }else{
      console.log('Formulario Invalido')
    }
  }

  eliminarEgreso(){
    console.log("id eliminar => ", this.egreso.id)
    if(this.egreso.id != null){
      Swal.fire({
        title: "Estas seguro que deseas eliminar la Factura de Egreso?",
        showCancelButton: true,
        confirmButtonText: "Eliminar"
      }).then((result) => {
        
        if (result.isConfirmed) {
          console.log("eliminara id => ",this.egreso.id)
        
          this.egresoServices.eliminarEgreso(this.egreso.id).
          subscribe(() =>{
            this.egresoServices.notificarEgresoCreado();
            this.cerrarCaja();
            Swal.fire("Factura Eliminada", "", "success");
          }, error => {
            Swal.fire("Error al eliminar la factura", error.message, "error")
          })
          
        
        
        } else if (result.isDenied) {
          Swal.fire("Eliminar Factura cancelada", "", "info");
        }
      });
    }
  }

  resetForm(){
    this.egresoId = this.fb.group({
      idFound:['',Validators.required]
    })
  }

  regresarCaja(){
    this.resetForm();
    this.idExist =false;
  }

  cerrarCaja(){
    this.regresarCaja();
    this.cancelar.emit();
  }


}
