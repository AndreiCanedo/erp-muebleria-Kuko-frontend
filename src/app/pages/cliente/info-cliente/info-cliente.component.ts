import { Component, DestroyRef, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../models/cliente.model';
import { OrdenCompraServices } from '../../../services/orden-compra.service';
import { OrdenResumenView } from '../../../models/interface-models/orden-resumen-view.interface';
import { finalize, forkJoin } from 'rxjs';
import { ordenarPorFechaDescendente } from '../../../shared/utils/sort.util';

@Component({
    selector: 'app-info-cliente',
    templateUrl: './info-cliente.component.html',
    styleUrl: './info-cliente.component.css',
    standalone: false
})
export class InfoClienteComponent {

  private clienteServices = inject(ClienteService);
  private ordenServices = inject(OrdenCompraServices);
  private destroyRef = inject(DestroyRef);

  public cliente: Cliente | null = null;
  public ordenes: OrdenResumenView[] = [];

  public ordenSeleccionadaId: number | null = null;
  public mostrarDetalleOrden = false;

  @Input() idInfo!:number;
  @Input() keyInfo!:number;
  @Output() cancelar = new EventEmitter<void>();

  public ui = {
    cargando: false,
    error: ''
  }

  ngOnChanges(changes:SimpleChanges):void{

    const id = Number(changes['idInfo']?.currentValue);
  
    if(!id) return;

    this.cargarExpediente(id);
  }



  ///////////////////////////////////////
  ////////////CARGAR CLIENTES////////////
  ///////////////////////////////////////

  private cargarExpediente(clienteId: number): void{

    this.ui.cargando = true;
    this.ui.error = '';

    this.cliente = null;
    this.ordenes = [];

    forkJoin({
      cliente: this.clienteServices.cargarClienteById(clienteId),
      ordenes: this.ordenServices.obtenerResumenOrdenesPorCliente(clienteId)
    })
    .pipe(takeUntilDestroyed(this.destroyRef),
      finalize(() => this.ui.cargando = false)
    )
    .subscribe({
      next: ({ cliente, ordenes }) => {
        this.cliente = cliente;

        this.ordenes = ordenarPorFechaDescendente(ordenes, orden => orden.fecha)
      },
      error: error => {
        console.error('Error al cargar expediente: ', error);

        this.ui.error = 'No fue posible cargar el expediente del cliente';
      }
    });

  }

  public get totalOrdenes(): number{
    return this.ordenes.length;
  }

  public get ultimaCompra(): Date | null{
    const fechas = this.ordenes
      .map(orden => orden.fecha)
      .filter((fecha): fecha is Date => fecha != null );

    if(fechas.length === 0) return null;

    return fechas.reduce((ultima, fecha) => 
      new Date(fecha).getTime() > new Date(ultima).getTime() ? fecha : ultima
    );
  }

  public get tieneSaldoPendiente(): boolean{
    return this.ordenes.some(orden => 
      orden.estadoPago !== 'PAGADA'
    );
  }

  public cerrarCaja(): void {
    this.cancelar.emit();

  }

  /***********************************************************/
  /******************** MOSTRAR DETALLE ORDEN ****************/
  /***********************************************************/

  public verDetalleOrden(ordenId: number): void{
    this.ordenSeleccionadaId = ordenId;
    this.mostrarDetalleOrden = true;
  }

  public cerrarDetalleOrden(): void{
    this.mostrarDetalleOrden = false;
    this.ordenSeleccionadaId = null;
  }

}
