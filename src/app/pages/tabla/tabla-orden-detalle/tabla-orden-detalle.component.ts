import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrdenDetalleView } from '../../../models/interface-models/orden-detalle-view.interface';

@Component({
  selector: 'app-tabla-orden-detalle',
  standalone: false,
  templateUrl: './tabla-orden-detalle.component.html',
  styleUrl: './tabla-orden-detalle.component.css',
})
export class TablaOrdenDetalleComponent {

  @Input() detalles: OrdenDetalleView[] = [];


  @Output() agregar = new EventEmitter<void>();
  @Output() eliminar = new EventEmitter<number>();
  @Output() actualizar = new EventEmitter<OrdenDetalleView>();

  actualizarFila(index: number): void{
    
    this.actualizar.emit(this.detalles[index]);
  }

  eliminarFila(index: number): void{
    this.eliminar.emit(index);
  }

  agregarFila(): void{
    this.agregar.emit();
  }

}
