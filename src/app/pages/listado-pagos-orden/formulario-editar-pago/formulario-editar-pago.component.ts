import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { PagoOrden } from '../../../models/pago-orden.model';
import { ActualizarPagoOrdenRequest } from '../../../models/request/actualizar-pago-orden.request';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-formulario-editar-pago',
  standalone: false,
  templateUrl: './formulario-editar-pago.component.html',
  styleUrl: './formulario-editar-pago.component.css',
})
export class FormularioEditarPagoComponent implements OnChanges{

  @Input() public pago: PagoOrden | null = null;
  @Input() public guardando = false;

  @Output() public guardar = new EventEmitter<ActualizarPagoOrdenRequest>();
  @Output() public cancelar = new EventEmitter<void>();

  public formulario: FormGroup;
  private readonly fb = inject(FormBuilder);

  constructor(){
    this.formulario = this.fb.group({
      formaPago: ['', Validators.required],
      referencia: [''],
      observaciones: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
      if(!changes['pago'] || !this.pago){
        return;
      }

      this.formulario.reset({
        formaPago: this.pago.formaPago,
        referencia: this.pago.referencia ?? '',
        observaciones: this.pago.observaciones ?? ''
      })
  }

  public enviar(): void{
    if(this.formulario.invalid){
      this.formulario.markAllAsTouched();
      return;
    }

    const value = this.formulario.getRawValue();

    this.guardar.emit({
      formaPago: value.formaPago,
      referencia: value.referencia?.trim() || null,
      observaciones: value.observaciones?.trim() || null
    });
  }

  public cerrar(): void{
    this.cancelar.emit();
  }


}
