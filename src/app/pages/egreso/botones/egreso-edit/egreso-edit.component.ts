import { Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EgresoService } from '../../../../services/egreso.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-egreso-edit',
  templateUrl: './egreso-edit.component.html',
  styleUrl: './egreso-edit.component.css'
})
export class EgresoEditComponent implements OnInit, OnDestroy{
  private fb = inject(FormBuilder)
  private egresoServices = inject(EgresoService)
  
  public subscription!: Subscription;
  public egresoForm! :FormGroup
  public egresoId!: FormGroup
  public idExist:boolean = false;
  public existeErrorBuscarID = false;

  @Output() cancelar = new EventEmitter<void>();
  
  constructor(){this.resetForm();}
  
  ngOnInit(): void {
    this.resetForm();
  }

  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
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
            resp => {
              Swal.fire('Factura de egreso Actualizada correctamente','success');
              this.egresoServices.notificarEgresoCreado();
              this.cerrarCaja();
            },error => console.error("error al actualizar egreso", error)
          )
      }
    }else{
      console.log('Formulario invalido')
    }

  }

  buscarIdEgreso(){
    if(this.egresoId.valid){
      let idValue = this.egresoId.get('idFound')?.value
      if(idValue != null){
        this.egresoServices.cargarEgresoById(idValue).
          subscribe(egreso => {
            if(egreso){
              this.egresoForm.patchValue(egreso)
              this.idExist = true
            }else{
              this.idExist = false
              console.log('Egreso no encontrado')
            }
          },error => {
            this.idExist = false
            this.existeErrorBuscarID = true;
            setTimeout(() => {
              this.existeErrorBuscarID = false;
            }, 3000)
            console.error('Error al cargar Egreso', error)
          })
      }
    }else{
      console.log('Formulario Invalido')
    }
  }


  resetForm(){
    this.egresoId = this.fb.group({
      idFound:['', Validators.required]
    })

    this.egresoForm = this.fb.group({
      id:'',      
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

  cerrarCaja(){
    this.cancelar.emit();
  }

  regresarCaja(){
    this.resetForm();
    this.idExist=false;
  }



}
