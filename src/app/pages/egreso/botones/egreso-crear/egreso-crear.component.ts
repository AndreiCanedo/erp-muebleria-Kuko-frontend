import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EgresoService } from '../../../../services/egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-egreso-crear',
  templateUrl: './egreso-crear.component.html',
  styleUrl: './egreso-crear.component.css'
})
export class EgresoCrearComponent implements OnInit{
  
  private fb = inject(FormBuilder)
  private egresoServices = inject(EgresoService)
  
  public egresoForm! :FormGroup
  
  @Output() cancelar = new EventEmitter<void>();

  constructor(){this.resetForm();}
  
  ngOnInit(): void {
    this.resetForm();
  }
  guardarEgreso(){
    if(this.egresoForm.valid){
      let egresoN = this.egresoForm.value
      this.egresoServices.crearEgreso(egresoN)
        .subscribe(
          resp => {
            Swal.fire('Factura de egreso Creada correctamente','success');
            this.egresoServices.notificarEgresoCreado();
            this.cerrarCaja();
          },error => console.error("error al crear factura egreso", error)
        ) 
    }else{
      console.log('Formulario invalido')
    }

  }


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

  cerrarCaja(){
    this.cancelar.emit();
  }

}
