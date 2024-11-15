import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { EgresoService } from '../../../../services/egreso.service';

@Component({
  selector: 'app-egreso-edit',
  templateUrl: './egreso-edit.component.html',
  styleUrl: './egreso-edit.component.css'
})
export class EgresoEditComponent implements OnInit{
  private fb = inject(FormBuilder)
  private egresoServices = inject(EgresoService)
  
  public egresoForm! :FormGroup
  public idExist:boolean = false;
  
  @Output() cancelar = new EventEmitter<void>();
  
  constructor(){this.resetForm();}
  
  ngOnInit(): void {
    this.resetForm();
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
            },error => console.error("error al actualizar egreso", error)
          )
      }
    }else{
      console.log('Formulario invalido')
    }

  }


  resetForm(){
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

}
