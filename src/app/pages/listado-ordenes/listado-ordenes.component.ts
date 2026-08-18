import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { OrdenCompraServices } from '../../services/orden-compra.service';
import { OrdenResumenView } from '../../models/interface-models/orden-resumen-view.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { CancelarOrdenCompraRequest } from '../../models/request/cancelar-orden-compra.request';
import { ordenarPorFechaDescendente } from '../../shared/utils/sort.util';
import { PdfDownloadService } from '../../services/pdf-download.service';
import Swal from 'sweetalert2';
import { EstadoOrdenCompra } from '../../models/estado-orden-compra.enum';

@Component({
  selector: 'app-listado-ordenes',
  standalone: false,
  templateUrl: './listado-ordenes.component.html',
  styleUrl: './listado-ordenes.component.css',
})
export class ListadoOrdenesComponent implements OnInit{

  private readonly destroyRef = inject(DestroyRef);
  private readonly ordenService = inject(OrdenCompraServices);
  private readonly pdfDownloadService = inject(PdfDownloadService);

  public ordenes: OrdenResumenView[] = [];
  public ordenesFiltradas: OrdenResumenView[] = [];

  public mostrarDetalleOrden = false;
  public ordenSeleccionadaId: number | null = null;

  public ordenAccionSeleccionada: OrdenResumenView | null = null;

  public mostrarConfirmarOrden = false;
  public confirmandoOrden = false;

  public mostrarCancelarOrden = false;
  public cancelandoOrden = false;
  public motivoCancelacion = '';

  public monstrarEditarOrden = false;
  public ordenEditarId: number | null = null;

  public busqueda = '';


  public ui = {
    cargando: false,
    error: ''
  };

  ngOnInit(): void {
      this.cargarOrdenes();
  }

  /*********************************************************/
  /********************CARGAR ORDENES***********************/
  /*********************************************************/

  public cargarOrdenes(): void {
    this.ui.cargando = true;
    this.ui.error = '';

    this.ordenService.obtenerResumenOrdenes()
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => this.ui.cargando = false)
      )
      .subscribe({
        next: ordenes => {
          this.ordenes = ordenarPorFechaDescendente(ordenes, orden => orden.fecha);

          this.aplicarBusqueda();
        },
        error: (error: Error) => {
          console.error(error.message);

          this.ordenes = [];
          this.ordenesFiltradas = [];
          this.ui.error= 'No se pudo cargar las Ordenes de compra'
        }
      });
  }

  /*********************************************************/
  /*************** BUSCAR ORDENES COMPRA *******************/
  /*********************************************************/

  public buscar(texto: string): void{
    this.busqueda = texto;
    this.aplicarBusqueda();
  }

  private aplicarBusqueda(): void {
    const termino = this.busqueda.trim().toLowerCase();

    if(!termino){
      this.ordenesFiltradas = [...this.ordenes];
      return;
    }

    this.ordenesFiltradas = this.ordenes.filter(orden => {

      const coincideFolio = orden.id.toString().includes(termino);

      const coincideCliente = orden.cliente.toLowerCase().includes(termino);

      const coincideEstadoOrden = orden.estadoOrden.toLowerCase().includes(termino);
      
      const coincideProceso = orden.proceso.toLowerCase().includes(termino);
      
      const coincideEstadoPago = orden.estadoPago.toLowerCase().includes(termino);
      
      const coincideEstadoEntrega = orden.estadoEntrega.toLowerCase().includes(termino);

      return(coincideCliente || coincideFolio 
        || coincideEstadoOrden || coincideProceso
        || coincideEstadoPago || coincideEstadoEntrega);

    })

  }

  /*********************************************************/
  /***************VER DETALLES DE ORDENES*******************/
  /*********************************************************/

  public verDetalle(orden: OrdenResumenView): void {
    this.ordenSeleccionadaId = orden.id;
    this.mostrarDetalleOrden = true;
  }

  public cerrarDetalleOrden():void{
    this.mostrarDetalleOrden = false;
    this.ordenSeleccionadaId = null;
  }

  /*********************************************************/
  /*************** EDITAR ORDENES COMPRA *******************/
  /*********************************************************/

  public editarOrden(orden: OrdenResumenView): void {
    this.ordenEditarId = orden.id;
    this.monstrarEditarOrden = true;
  }

  public cerrarEditarOrden(): void{
    this.monstrarEditarOrden = false;
    this.ordenEditarId = null;
  }

  public ordenActualizada():void {
    this.cerrarEditarOrden(); 
    this.cargarOrdenes();
  }


  /*********************************************************/
  /*************** CONFIRMAR ORDENES COMPRA ****************/
  /*********************************************************/

  public confirmarOrden(orden: OrdenResumenView): void {
    this.ordenAccionSeleccionada = orden;
    this.ui.error = '';
    this.mostrarConfirmarOrden = true;
  }

  public cerrarConfirmarOrden(): void{
    if(this.confirmandoOrden) return;

    this.limpiarConfirmacionOrden();
  }

  public limpiarConfirmacionOrden(): void{
    this.mostrarConfirmarOrden = false;
    this.ordenAccionSeleccionada = null;
    this.ui.error = '';
  }

  public ejecutarConfirmarOrden(): void{
    const ordenId = this.ordenAccionSeleccionada?.id;

    if(!ordenId) return;

    this.confirmandoOrden = true;
    this.ui.error = '';

    this.ordenService.confirmarOrdenCompra(ordenId)
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => this.confirmandoOrden = false)
      )
      .subscribe({
        next: () => {
          this.limpiarConfirmacionOrden();
          this.cargarOrdenes();
        },
        error: error => {
          console.error('Error al confirmar la orden: ', error);
        
          this.ui.error = 'No fue posible Confirmar la Orden';
        }
      });
  }

  /*********************************************************/
  /*************** CANCELAR ORDENES COMPRA *****************/
  /*********************************************************/

  public cancelarOrden(orden: OrdenResumenView): void {
    this.ordenAccionSeleccionada = orden;
    this.motivoCancelacion = '';
    this.ui.error= '';
    this.mostrarCancelarOrden = true;
  }

  public cerrarCancelarOrden(): void{
    if(this.cancelandoOrden) return;

    this.limpiarCancelarOrden();
  }

  public limpiarCancelarOrden(): void{

    this.mostrarCancelarOrden = false;
    this.ordenAccionSeleccionada = null;
    this.motivoCancelacion = '';
    this.ui.error = '';

  }

  public ejecutarCancelacionOrden(): void{
    const ordenId = this.ordenAccionSeleccionada?.id;
    const motivo = this.motivoCancelacion.trim();

    if(!ordenId || !motivo) return;

    const request: CancelarOrdenCompraRequest = {motivo};

    this.cancelandoOrden = true;
    this.ui.error = '';

    this.ordenService.cancelarOrdenCompra(ordenId,request)
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => this.cancelandoOrden = false)
      )
      .subscribe({
        next: () => {
          this.limpiarCancelarOrden();
          this.cargarOrdenes()
        },
        error: error => {
          console.error('Error al cancelar la orden',error);

          this.ui.error = "No fue posible cancelar la orden";
        }
      });
  }

  /*********************************************************/
  /********************** DESCARGARGA **********************/
  /*********************************************************/

  public descargarDocumento(orden: OrdenResumenView): void {

    if (orden.estadoOrden === EstadoOrdenCompra.COTIZACION) {

      this.descargarPresupuesto(orden.id);
      return;
    }

    this.descargarOrdenCompra(orden.id);
  }

  public descargarOrdenCompra(ordenId: number): void {

    this.pdfDownloadService.obtenerOrdenCompraPdf(ordenId)
      .subscribe({
        next: blob => {

          this.pdfDownloadService.descargar(blob, `orden-compra-${ordenId}.pdf`);
        },

        error: () => {

          Swal.fire({
            title: 'Error',
            text: 'No fue posible descargar la orden de compra',
            icon: 'error'
          });
        }
      });
  }

  private descargarPresupuesto(ordenId: number): void {

    this.pdfDownloadService.obtenerPresupuestoPdf(ordenId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: blob => {

          this.pdfDownloadService.descargar(blob, `presupuesto-${ordenId}.pdf`);
        },
        error: () => {
          Swal.fire({
            title: 'Error',
            text: 'No fue posible descargar el presupuesto',
            icon: 'error'
          });
        }
      });
  }   


}
