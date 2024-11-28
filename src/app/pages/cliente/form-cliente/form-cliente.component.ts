import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-cliente',
  templateUrl: './form-cliente.component.html',
  styleUrl: './form-cliente.component.css'
})
export class FormClienteComponent {
  
  @Input() clienteForm!:FormGroup;
  @Input() mostrarRFC: boolean = false;
  @Output() submitForm = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();
  
  
  toggleRFC(event:any):void{
    this.mostrarRFC = event.target.checked;
  }
  
  cerrarCaja(){
    this.cancelar.emit();
  }
  onSubmit(){
    this.submitForm.emit();
  }
}
