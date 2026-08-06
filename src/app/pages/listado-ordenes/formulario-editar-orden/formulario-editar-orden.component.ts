import { Component, DestroyRef, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { OrdenCompraServices } from '../../../services/orden-compra.service';
import { ClienteService } from '../../../services/cliente.service';
import { MuebleService } from '../../../services/mueble.service';
import { OrdenCompra } from '../../../models/orden-compra.model';
import { Cliente } from '../../../models/cliente.model';
import { OrdenDetalleView } from '../../../models/interface-models/orden-detalle-view.interface';
import { EMPTY, finalize, forkJoin, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EstadoOrdenCompra } from '../../../models/estado-orden-compra.enum';
import { Mueble } from '../../../models/mueble.model';
import { ActualizarOrdenCompraRequest } from '../../../models/request/actualizar-orden-compra.request';

@Component({
  selector: 'app-formulario-editar-orden',
  standalone: false,
  templateUrl: './formulario-editar-orden.component.html',
  styleUrl: './formulario-editar-orden.component.css',
})
export class FormularioEditarOrdenComponent implements OnChanges{

  private destroyRef = inject(DestroyRef);

  private ordenService = inject(OrdenCompraServices);
  private clienteService = inject(ClienteService);
  private muebleService = inject(MuebleService);

  @Input() ordenId: number | null = null;

  @Output() ordenActualizada = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  public orden: OrdenCompra | null = null;
  public clienteSeleccionado: Cliente | null = null;
  public detalleView: OrdenDetalleView[] = [];

  public fechaEntrega = '';

  public ui = {
    cargando: false,
    guardando: false,
    error: '',
    mostrarClientes: false,
    mostrarCrearCliente: false,
    mostrarSeleccionarMueble: false,
    mostrarCrearMueble: false
  };

  ngOnChanges(changes: SimpleChanges): void {
      if(!changes['ordenId']) return;

      if(this.ordenId !== null){
        this.cargarOrden();
      }else{
        this.limpiarFormulario();
      }
  }

  /******************************************************/
  /******************* CARGAR ORDEN *********************/
  /******************************************************/

  private cargarOrden(): void {
    if (this.ordenId === null) return;

    this.limpiarFormulario();

    this.ui.cargando = true;
    this.ui.error = '';

    this.ordenService
      .cargarOrdenCompraById(this.ordenId)
      .pipe( switchMap(orden => {

          if (orden.estadoOrden !== EstadoOrdenCompra.COTIZACION) {

            this.ui.error ='Solo se pueden editar órdenes en estado cotización';

            return EMPTY;
          }

          return forkJoin({
            orden: [orden],

            cliente: this.clienteService.cargarClienteById(orden.clienteId),

            muebles:this.muebleService.cargarMueble()
          });
        }),

        takeUntilDestroyed(this.destroyRef),

        finalize(() => this.ui.cargando = false)
      )
      .subscribe({
        next: ({ orden, cliente, muebles }) => {

          this.orden = orden;
          this.clienteSeleccionado = cliente;

          this.fechaEntrega = this.formatearFechaInput(orden.fechaEntrega);

          this.detalleView = this.convertirDetalles(orden,muebles);
        },
        error: error => {
          console.error('Error al cargar la orden:', error);

          this.ui.error = 'No fue posible cargar la informacion de la orden';
        }
      });
  }

  private convertirDetalles( orden: OrdenCompra, muebles: Mueble[]): OrdenDetalleView[] {

    const mueblesMap = new Map(muebles.map(mueble => [mueble.id, mueble]));

    return orden.detalles.map(detalle => {
      const mueble = mueblesMap.get(detalle.muebleId);

      return {
        muebleId: detalle.muebleId,
        descripcion: mueble?.descripcion ?? 'Mueble no encontrado',
        cantidad: detalle.cantidad,
        precioUnitario: detalle.precioUnitario,
        precioTotal: detalle.cantidad * detalle.precioUnitario
      };
    });
  }

  /******************************************************/
  /********************** CLIENTE ************************/
  /******************************************************/

  public abrirClientes(): void {
    if (this.ui.guardando) return;

    this.ui.mostrarClientes = true;
  }

  public cerrarClientes(): void {
    this.ui.mostrarClientes = false;
  }

  public seleccionarCliente(cliente: Cliente): void {
    this.clienteSeleccionado = cliente;
    this.cerrarClientes();
  }

  //Crear cliente

  public abrirCrearCliente(): void{
    if(this.ui.guardando) return;

    this.ui.mostrarCrearCliente = true;
  }

  public cerrarCrearCliente(): void{
    this.ui.mostrarCrearCliente = false;
  }

  public clienteCreado(cliente: Cliente): void{
    this.ui.mostrarCrearCliente = false;
    this.ui.mostrarClientes = false;

    this.clienteSeleccionado = cliente;
  }

  /******************************************************/
  /********************** MUEBLES ************************/
  /******************************************************/

  public abrirSeleccionarMueble(): void {
    if (this.ui.guardando) return;

    this.ui.mostrarSeleccionarMueble = true;
  }

  public cerrarSeleccionarMueble(): void {
    this.ui.mostrarSeleccionarMueble = false;
  }

  public seleccionarMueble(mueble: Mueble): void {

    const detalleExistente = this.detalleView.find( detalle =>
          detalle.muebleId === mueble.id
      );

    if (detalleExistente) {

      detalleExistente.cantidad++;

      this.actualizarPrecioTotal(
        detalleExistente
      );

    } else {

      this.detalleView.push({
        muebleId: mueble.id,
        descripcion: mueble.descripcion,
        cantidad: 1,
        precioUnitario: mueble.precioReferencia,
        precioTotal: mueble.precioReferencia
      });
    }

    this.cerrarSeleccionarMueble();
  }

  public eliminarDetalle( index: number ): void {
    if (this.ui.guardando) return;

    this.detalleView.splice(index, 1);
  }

  public actualizarPrecioTotal( detalle: OrdenDetalleView): void {
    detalle.precioTotal = detalle.cantidad * detalle.precioUnitario;
  }

  //Crear Mueble

  public abrirCrearMueble(): void{
    if(this.ui.guardando) return;

    this.ui.mostrarCrearMueble = true;
  }

  public cerrarCrearMueble(): void{
    this.ui.mostrarCrearMueble = false;
  }

  public muebleCreado(mueble: Mueble): void{
    this.ui.mostrarCrearMueble = false;

    this.seleccionarMueble(mueble);
  }

  /******************************************************/
  /******************** GUARDAR CAMBIOS ******************/
  /******************************************************/

  public guardarCambios(): void {
    if (this.ui.guardando) return;

    if (!this.formularioValido()) return;

    if (this.ordenId === null) return;

    if (!this.clienteSeleccionado) return;

    const request = this.construirRequest();

    this.ui.guardando = true;
    this.ui.error = '';

    this.ordenService.actualizarOrdenCompra(request, this.ordenId)
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => this.ui.guardando = false)
      )
      .subscribe({
        next: () => {
          this.ordenActualizada.emit();
        },

        error: error => {
          console.error('Error al actualizar la orden:',error);

          this.ui.error = 'No fue posible actualizar la orden';
        }
      });
  }

  private construirRequest(): ActualizarOrdenCompraRequest {

    return {
      clienteId: this.clienteSeleccionado!.id,
      detallesRequest: this.detalleView.map(detalle => ({
          muebleId: detalle.muebleId,
          cantidad: detalle.cantidad,
          precioUnitario: detalle.precioUnitario
        })),
      fechaEntrega: this.fechaEntrega || null
    };
  }

  /******************************************************/
  /******************** VALIDACIONES *********************/
  /******************************************************/

  private formularioValido(): boolean {
    this.ui.error = '';

    if (!this.clienteSeleccionado) {
      this.ui.error = 'Debes seleccionar un cliente';
      return false;
    }

    if (this.detalleView.length === 0) {
      this.ui.error = 'La orden debe contener al menos un mueble';

      return false;
    }

    const detalleInvalido = this.detalleView.some( detalle =>
          detalle.cantidad <= 0 || detalle.precioUnitario <= 0
      );

    if (detalleInvalido) {
      this.ui.error = 'La cantidad y el precio unitario deben ser mayores a cero';

      return false;
    }

    return true;
  }

  /******************************************************/
  /************************ UI ****************************/
  /******************************************************/

  public cerrarFormulario(): void {
    if (this.ui.guardando) return;

    this.cancelar.emit();
  }

  private limpiarFormulario(): void {
    this.orden = null;
    this.clienteSeleccionado = null;
    this.detalleView = [];
    this.fechaEntrega = '';

    this.ui.error = '';
    this.ui.mostrarClientes = false;
    this.ui.mostrarCrearCliente = false;
    this.ui.mostrarSeleccionarMueble = false;
    this.ui.mostrarCrearMueble = false;
  }

  private formatearFechaInput(fecha: Date | null): string {
    if (!fecha) return '';

    const year = fecha.getFullYear();

    const month = String(fecha.getMonth() + 1).padStart(2, '0');

    const day = String(fecha.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  public get totalOrden(): number {
    return this.detalleView.reduce(
      (total, detalle) => total + detalle.precioTotal, 0
    );
  }
}
