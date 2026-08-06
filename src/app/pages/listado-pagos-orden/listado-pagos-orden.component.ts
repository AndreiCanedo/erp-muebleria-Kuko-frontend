import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { PagoOrdenService } from '../../services/pago-orden.service';
import { PagoOrden } from '../../models/pago-orden.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { ActualizarPagoOrdenRequest } from '../../models/request/actualizar-pago-orden.request';
import { ordenarPorFechaDescendente } from '../../shared/utils/sort.util';

@Component({
  selector: 'app-listado-pagos-orden',
  standalone: false,
  templateUrl: './listado-pagos-orden.component.html',
  styleUrl: './listado-pagos-orden.component.css',
})
export class ListadoPagosOrdenComponent implements OnInit{

  private readonly pagoOrdenService = inject(PagoOrdenService);
  private readonly destroyRef = inject(DestroyRef);

  public pagos: PagoOrden[] = [];
  public pagosFiltrados: PagoOrden[] = [];

  public busqueda = '';
  public estadoSeleccionado = '';
  public formaPagoSeleccionado = '';
  public tipoPagoSeleccionado = '';

  public mostrarDetalleOrden = false;
  public ordenSeleccionadaId: number | null = null;

  public mostrarDetallePago = false;
  public pagoSeleccionado: PagoOrden | null = null;

  public mostrarEditarPago = false;
  public guardandoPago = false;

  public mostrarCancelarPago = false;
  public cancelandoPago = false;
  public motivoCancelacion = '';

  public mostrarRegistroPago = false;

  public ui = {
    cargando: false,
    error: ''
  };

  ngOnInit(): void {
      this.cargarPagos();
  }

  /***********************************************/
  /****************CARGAR PAGOS*******************/
  /***********************************************/

  cargarPagos(): void{

    this.ui.cargando = true;
    this.ui.error = '';

    this.pagoOrdenService.cargarPagoOrden()
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => this.ui.cargando = false)
      )
      .subscribe({
        next: pagos => {
          this.pagos = ordenarPorFechaDescendente(pagos, pago => pago.fechaRegistro);
          this.aplicarFiltros();
        },
        error: (error:Error)  => {
          console.error('Error al cargar los pagos: ', error);

          this.ui.error = 'No fue posible cargar los pagos de las ordenes'
        }
      });
  }

  /***********************************************/
  /********************FILTROS********************/
  /***********************************************/

  public aplicarFiltros(): void{
    const termino = this.busqueda.trim().toLowerCase();

    this.pagosFiltrados = this.pagos.filter(pago => {

      const coincideBusqueda = !termino 
        || pago.id.toString().includes(termino)
        || pago.ordenId.toString().includes(termino)
        || pago.referencia?.toLowerCase().includes(termino)
        || false;

      const coincideEstado = !this.estadoSeleccionado 
        || pago.estado === this.estadoSeleccionado;

      const coincideFormaPago = !this.formaPagoSeleccionado
        || pago.formaPago === this.formaPagoSeleccionado;

      const coincideTipoPago = !this.tipoPagoSeleccionado
        || pago.tipoPago === this.tipoPagoSeleccionado;

      return (coincideBusqueda && coincideEstado && coincideFormaPago && coincideTipoPago);

    });
  }

  public limpiarFiltros(): void{
    this.busqueda = '';
    this.estadoSeleccionado = '';
    this.formaPagoSeleccionado = '';
    this.tipoPagoSeleccionado = '';

    this.aplicarFiltros();
  }

  public get totalIngresos(): number{
    return this.pagos.filter(pago => pago.estado === 'APLICADO')
      .reduce((total, pago) => total + Number(pago.monto), 0)
  }

  public get cantidadAplicados(): number{
    return this.pagos.filter(pago => pago.estado === 'APLICADO').length;
  }

  public get cantidadCancelados(): number{
    return this.pagos.filter(pago => pago.estado === 'CANCELADO').length;
  }

  /***********************************************/
  /***************DETALLE ORDEN*******************/
  /***********************************************/

  public verOrden(ordenId: number): void{
    this.ordenSeleccionadaId = ordenId;
    this.mostrarDetalleOrden = true;
  }

  public cerrarDetalleOrden():void{
    this.mostrarDetalleOrden = false;
    this.ordenSeleccionadaId = null;
  }

  /***********************************************/
  /****************DETALLE PAGO*******************/
  /***********************************************/

  public verDetallePago(pago: PagoOrden): void {
    this.pagoSeleccionado = pago;
    this.mostrarDetallePago = true;
  }

  public cerrarDetallePago(): void{
    this.mostrarDetallePago = false;
    this.pagoSeleccionado = null;
  }

  /***********************************************/
  /***************PAGO ACTUALIZAR*****************/
  /***********************************************/

  public editarPago(pago: PagoOrden): void {
    
    if(pago.estado !== 'APLICADO') return;

    this.pagoSeleccionado = pago;
    this.mostrarEditarPago = true;
  }

  public cerrarEditarPago(): void{
    
    if(this.guardandoPago) return;

    this.mostrarEditarPago = false;
    this.pagoSeleccionado = null;
  }

  public guardarEdicionPago(request: ActualizarPagoOrdenRequest): void{
    
    if(!this.pagoSeleccionado?.id) return;

    this.guardandoPago = true;

    this.pagoOrdenService.actualizarPagoOrden(request, this.pagoSeleccionado.id)
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => this.guardandoPago = false)
      )
      .subscribe({
        next: () => {
          this.guardandoPago = false
          this.cargarPagos();
          this.cerrarEditarPago();
        },
        error: error => {
          console.error('Error al actualizar el Pago: ', error);

          this.ui.error = 'No fue posible actualizar el pago'
        }
      });
  }


  /***********************************************/
  /***************CANCELACION PAGOS***************/
  /***********************************************/

  public solicitarCancelacion(pago: PagoOrden): void {
    
    if(pago.estado !== 'APLICADO') return;

    this.pagoSeleccionado = pago;
    this.motivoCancelacion = '';
    this.mostrarCancelarPago = true;
  }

  public cerrarCancelarPago():void {
    if (this.cancelandoPago) return;

    this.mostrarCancelarPago = false;
    this.pagoSeleccionado = null;
    this.motivoCancelacion = '';
  }

  public confirmarCancelacion(): void {
    const motivo = this.motivoCancelacion.trim();

    if(!this.pagoSeleccionado?.id || !motivo) return;

    this.cancelandoPago = true;

    this.pagoOrdenService.cancelarPagoOrden(this.pagoSeleccionado.id, {motivo: motivo})
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => this.cancelandoPago = false)
      )
      .subscribe({
        next: () => {
          this.cancelandoPago = false;
          this.cerrarCancelarPago();
          this.cargarPagos();
        },
        error: error => {
          console.error('Error al Cancelar el Pago: ', error);

          this.ui.error = 'No fue posible cancelar el pago';
        }
      })
  }

  /***********************************************/
  /***************** CREAR PAGOS *****************/
  /***********************************************/

  public abrirRegistrarPago(): void{
    this.mostrarRegistroPago = true;
  }

  public cerrarRegistroPago(): void{
    this.mostrarRegistroPago = false;
  }

  public pagoRegistrado(): void{
    this.cerrarRegistroPago();
    this.cargarPagos();
  }
}
