import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-cliente',
  templateUrl: './form-cliente.component.html',
  styleUrl: './form-cliente.component.css'
})
export class FormClienteComponent implements OnChanges{
  
  @Input() clienteForm!:FormGroup;
  @Input() mostrarRFC!: boolean;
  @Input() actualizar!:boolean;
  @Output() submitForm = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();
  
  

  ngOnChanges(changes: SimpleChanges): void {
    console.log('RFC Form => ',this.mostrarRFC)
  }
  
  
  toggleRFC(event:any):void{
    this.mostrarRFC = event.target.checked;
    if (!this.mostrarRFC) { 
      this.clienteForm.get('rfc')?.setValue('N/A'); 
    } else { 
      this.clienteForm.get('rfc')?.setValue(''); 
    }
  }
  
  cerrarCaja(){
    this.cancelar.emit();
  }
  onSubmit(){
    this.submitForm.emit();
  }
}
