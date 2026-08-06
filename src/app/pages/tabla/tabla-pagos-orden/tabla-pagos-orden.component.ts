import { Component, EventEmitter, Input, Output } from '@angular/core';

import { PagoOrden } from '../../../models/pago-orden.model';

@Component({
  selector: 'app-tabla-pagos-orden',
  standalone: false,
  templateUrl: './tabla-pagos-orden.component.html',
  styleUrl: './tabla-pagos-orden.component.css',
})
export class TablaPagosOrdenComponent {

  @Input() public pagos: PagoOrden[] = [];

  @Output() public verOrden = new EventEmitter<number>();
  @Output() public verDetalle = new EventEmitter<PagoOrden>();
  @Output() public editar = new EventEmitter<PagoOrden>();
  @Output() public cancelar = new EventEmitter<PagoOrden>();

  public esAplicado(pago: PagoOrden): boolean {
    return pago.estado === 'APLICADO';
  }

  public emitirVerOrden(pago: PagoOrden): void{
    this.verOrden.emit(pago.ordenId);
  }

  public emitirVerDetalle(pago: PagoOrden): void{
    this.verDetalle.emit(pago);
  }

  public emitirEditar(pago: PagoOrden): void{
    this.editar.emit(pago);
  }

  public emitirCancelar(pago: PagoOrden): void{
    this.cancelar.emit(pago);
  }

}
