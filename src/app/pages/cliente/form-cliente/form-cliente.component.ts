  import { Component, EventEmitter, Input, Output } from '@angular/core';

  import { ClienteForm } from '../../../type/form/cliente-form.type';

  @Component({
      selector: 'app-form-cliente',
      templateUrl: './form-cliente.component.html',
      styleUrl: './form-cliente.component.css',
      standalone: false
  })
  export class FormClienteComponent{
    
    @Input() clienteForm!:ClienteForm;
    @Input() mostrarRFC = false;
    @Input() actualizar = false;
    @Output() submitForm = new EventEmitter<void>();
    @Output() cancelar = new EventEmitter<void>();
    @Output() toggleRFCEvent = new EventEmitter<boolean>();
    
    
    toggleRFC(event:Event):void{
      
      const checked = (event.target as HTMLInputElement).checked;

      this.toggleRFCEvent.emit(checked);

    }
    
    cerrarCaja(){
      this.cancelar.emit();
    }
    onSubmit(){
      this.submitForm.emit();
    }

    get f(){
      return this.clienteForm.controls;
    }

    isInvalid(field: keyof ClienteForm['controls']): boolean {
      const control = this.clienteForm.controls[field];
      return control.touched && control.invalid;
    }


  }
