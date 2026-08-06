import { Component, DestroyRef, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { OrdenCompraServices } from '../../../services/orden-compra.service';
import { OrdenInfoView } from '../../../models/interface-models/orden-info-view.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-detalle-orden',
  standalone: false,
  templateUrl: './detalle-orden.component.html',
  styleUrl: './detalle-orden.component.css',
})
export class DetalleOrdenComponent implements OnChanges{

  private readonly ordenCompraService = inject(OrdenCompraServices);
  private readonly destroyRef = inject(DestroyRef);

  @Input() ordenId: number | null = null;

  @Output() cancelar = new EventEmitter<void>();

  public orden:OrdenInfoView | null = null;

  public ui = {
    cargando: false,
    error: ''
  }

  ngOnChanges(changes: SimpleChanges): void {
      if(!changes['ordenId']) return;

      if(this.ordenId === null){
        this.orden = null;
        return;
      }

      this.cargarOrden(this.ordenId);
  }

  public cargarOrden(id: number): void{
    this.ui.cargando = true;
    this.ui.error = '';

    this.orden = null;

    this.ordenCompraService.obtenerInfoOrden(id)
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => this.ui.cargando = false)
      )
      .subscribe({
        next: orden => {
          this.orden = orden; 
        },
        error: error => {
          console.error('Error  al cargar la orden: ', error);
          this.ui.error = 'No fue posible cargar la informacion de la orden';
        }
      });
  }

  public reintentar(): void{
    if(this.ordenId === null){
      return;
    }
    this.cargarOrden(this.ordenId);
  }

  public cerrar(): void{
    this.cancelar.emit();
  }

}
