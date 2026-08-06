import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MuebleForm } from '../../../type/form/mueble-form.type';

@Component({
  selector: 'app-form-mueble',
  standalone: false,
  templateUrl: './form-mueble.component.html',
  styleUrl: './form-mueble.component.css',
})
export class FormMuebleComponent {

  @Input( {required: true} ) muebleForm!: MuebleForm;
  @Input() actualizar = false;
  @Input() guardando = false;

  @Output() submitForm = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();


  cerrarCaja(){
    if(this.guardando){
      return;
    }

    this.cancelar.emit();
  }

  onSubmit(){
    if(this.guardando){
      return;
    }

    this.submitForm.emit();
  }
  
  get f(): MuebleForm['controls']{
    return this.muebleForm.controls;
  }
  
  isInvalid(field: keyof MuebleForm['controls']): boolean {
    const control = this.muebleForm.controls[field];
    
    return control.touched && control.invalid;
  }

}
