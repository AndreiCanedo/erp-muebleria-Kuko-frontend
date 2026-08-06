import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Egreso } from '../../../models/egreso.model';
import { EstadoEgreso } from '../../../models/estado-egreso.enum';
import { ContextMenuService } from '../../../shared/directives/context-menu.service';

@Component({
  selector: 'app-tabla-egresos',
  standalone: false,
  templateUrl: './tabla-egresos.component.html',
  styleUrl: './tabla-egresos.component.css',
})
export class TablaEgresosComponent {

  private readonly contextMenu = inject(ContextMenuService);

  @Input() public egresos: Egreso[] = [];

  @Output() public verDetalle = new EventEmitter<Egreso>();
  @Output() public editar = new EventEmitter<Egreso>();
  @Output() public cancelar = new EventEmitter<Egreso>();

  public readonly estadoEgreso = EstadoEgreso;


  public emitirDetalle(egreso:Egreso): void{
    this.contextMenu.cerrar();
    this.verDetalle.emit(egreso);
  }

  public emitirEditar(egreso:Egreso): void{
    this.contextMenu.cerrar();
    this.editar.emit(egreso);
  }

  public emitirCancelar(egreso:Egreso): void{
    this.contextMenu.cerrar();
    this.cancelar.emit(egreso);
  }

}
