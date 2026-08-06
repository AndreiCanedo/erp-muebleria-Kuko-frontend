import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EgresoForm } from '../../../type/form/egreso-form.type';
import { FormaPago } from '../../../models/forma-pago.enum';


@Component({
  selector: 'app-formulario-egreso',
  standalone: false,
  templateUrl: './formulario-egreso.component.html',
  styleUrl: './formulario-egreso.component.css',
})
export class FormularioEgresoComponent {

  @Input() public egresoForm!: EgresoForm;
  @Input() public actualizar = false;
  @Input() public cargando = false;

  @Output() public submitForm = new EventEmitter<void>();
  @Output() public cancelar = new EventEmitter<void>();

  public readonly formaPagoEnum = FormaPago;

  public onSubmit(): void {
    this.submitForm.emit();
  }

  public cerrar(): void {
    this.cancelar.emit();
  }

  public get esEfectivo(): boolean {
    return (this.egresoForm.controls.formaPago.value === FormaPago.EFECTIVO);
  }

  public get f() {
    return this.egresoForm.controls;
  }

  public isInvalid(field: keyof EgresoForm['controls']): boolean {
    
    const control = this.egresoForm.controls[field];

    return control.touched && control.invalid;
  }

}
