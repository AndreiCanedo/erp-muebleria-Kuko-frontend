import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { OrdenResumenView } from '../../../models/interface-models/orden-resumen-view.interface';
import { EstadoOrdenCompra } from '../../../models/estado-orden-compra.enum';
import { ContextMenuService } from '../../../shared/directives/context-menu.service';


@Component({
  selector: 'app-tabla-ordenes',
  standalone: false,
  templateUrl: './tabla-ordenes.component.html',
  styleUrl: './tabla-ordenes.component.css',
})
export class TablaOrdenesComponent {

  private readonly contextMenu = inject(ContextMenuService)

  @Input() ordenes: OrdenResumenView[] = [];

  @Output() verDetalle = new EventEmitter<OrdenResumenView>();
  @Output() editar = new EventEmitter<OrdenResumenView>();
  @Output() confirmar = new EventEmitter<OrdenResumenView>();
  @Output() cancelar = new EventEmitter<OrdenResumenView>();
  @Output() descargarPdf = new EventEmitter<OrdenResumenView>();

  public readonly estadoOrdenCompra = EstadoOrdenCompra;

  verOrden(orden: OrdenResumenView): void{
    this.contextMenu.cerrar();
    this.verDetalle.emit(orden);
  }

  editarOrden(orden: OrdenResumenView): void{
    this.contextMenu.cerrar();
    this.editar.emit(orden);
  }

  confirmarOrden(orden: OrdenResumenView): void{
    this.contextMenu.cerrar();
    this.confirmar.emit(orden);
  }

  cancelarOrden(orden: OrdenResumenView): void{
    this.contextMenu.cerrar();
    this.cancelar.emit(orden);
  }

  public descargarDocumento(orden: OrdenResumenView): void {
    this.contextMenu.cerrar();
    this.descargarPdf.emit(orden);
  }


  trackByOrden(_:number, orden: OrdenResumenView): number{
    return orden.id;
  }


}
