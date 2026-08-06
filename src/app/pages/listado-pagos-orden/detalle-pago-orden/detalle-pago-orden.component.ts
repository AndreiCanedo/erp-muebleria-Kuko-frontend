import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PagoOrden } from '../../../models/pago-orden.model';

@Component({
  selector: 'app-detalle-pago-orden',
  standalone: false,
  templateUrl: './detalle-pago-orden.component.html',
  styleUrl: './detalle-pago-orden.component.css',
})
export class DetallePagoOrdenComponent {

  @Input() public pago: PagoOrden | null = null;

  @Output() public cancelar = new EventEmitter<void>();

  public cerrar(): void{
    this.cancelar.emit();
  }

}
