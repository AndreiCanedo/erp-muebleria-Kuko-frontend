import { Component, DestroyRef, inject } from '@angular/core';

import { OrdenCompraServices } from '../../services/orden-compra.service';

import { Cliente } from '../../models/cliente.model';
import { OrdenDetalleView } from '../../models/interface-models/orden-detalle-view.interface';
import { Mueble } from '../../models/mueble.model';
import Swal from 'sweetalert2';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CrearOrdenCompraRequest } from '../../models/request/crear-orden-compra.request';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-orden-compra',
  standalone: false,
  templateUrl: './presupuesto.component.html',
  styleUrl: './presupuesto.component.css',
})
export class PresupuestoComponent {

  private destroyRef = inject(DestroyRef);

  private ordenCompraServices = inject(OrdenCompraServices);

  /*******************************************************/
  /******************DATOS PARA TABLA*********************/
  /*******************************************************/
  
  public detalleView: OrdenDetalleView[] = [];
  public muebles: Mueble[]=[];
  public columns:string[] = [
      'Id', 
      'Cantidad', 
      'Descripcion', 
      'Precio Unitario', 
      'Precio Total', 
      '+/-'
    ];

  /******************************************************/
  /*********************UI STATE*************************/
  /******************************************************/

  public ui = {
    mostrarClientes: false,
    mostrarCrearCliente: false,
    mostrarCrearMueble: false,
    mostrarSeleccionarMueble: false,
    animado: false,
    cargando: false
  };

  /******************************************************/
  /**********************CLIENTE*************************/
  /******************************************************/

  public clienteSeleccionado: Cliente | null = null;

  mostrarClientes(): void{
    this.ui.animado = false;
    this.ui.mostrarClientes = true;
  }

  cerrarClientes(): void{
    this.ui.mostrarClientes = false;
  }

  seleccionarCliente(cliente: Cliente): void{
    this.clienteSeleccionado = cliente;
    this.cerrarClientes();
  }

  mostrarCrearCliente(): void{
    this.ui.mostrarCrearCliente = true;
  }

  cerrarCrearCliente(): void{
    this.ui.mostrarCrearCliente = false;
  }

  clienteCreado(cliente: Cliente): void{
    this.clienteSeleccionado = cliente;
    this.ui.mostrarCrearCliente = false;
    this.ui.mostrarClientes = false;
  }

  /***********************************************/
  /***************TABLA DETALLE*******************/
  /***********************************************/

  agregarFila(): void{
    this.ui.mostrarSeleccionarMueble = true;
  }

  eliminarFila(index: number): void{
    this.detalleView.splice(index,1);
  }

  mostarSeleccionarMueble():void{
    this.ui.mostrarSeleccionarMueble = true;
  }

  cerrarSeleccionarMueble():void{
    this.ui.mostrarSeleccionarMueble = false;
  }

  /******************************************************/
  /******************SELECCIONAR MUEBLE******************/
  /******************************************************/

  seleccionarMueble(mueble:Mueble):void{

    const detalleExistente = this.detalleView.find(
      detalle => detalle.muebleId === mueble.id
    );

    if(detalleExistente) {
        
      detalleExistente.cantidad++;
        
      detalleExistente.precioTotal = 
        detalleExistente.cantidad * detalleExistente.precioUnitario;
      
    } else {

      this.detalleView.push({
        muebleId: mueble.id,
        descripcion: mueble.descripcion,
        cantidad: 1,
          precioUnitario: mueble.precioReferencia,
        precioTotal: mueble.precioReferencia
      })
    }
      
    this.cerrarSeleccionarMueble();
  }

  public abrirCrearMueble(): void{
    this.ui.mostrarCrearMueble = true;

  }

  public cerrarCrearMueble(): void{
    this.ui.mostrarCrearMueble = false;
  }

  public muebleCreado(mueble: Mueble): void{
    this.ui.mostrarCrearMueble = false;
    this.ui.mostrarSeleccionarMueble = false;

    this.seleccionarMueble(mueble);
  }

  /******************************************************/
  /******************CREAR ORDEN COMPRA******************/
  /******************************************************/

  guardarOrdenCompra():void{
    if(!this.formularioValido()) return;

    if(!this.detalleValidados()) return;

    if(this.ui.cargando) return;

    if(!this.clienteSeleccionado) return;

    if(this.detalleView.length === 0 ) return;

    this.ui.cargando = true;

    const ordenCompra = this.buildRequest();

    this.ordenCompraServices.crearOrdenCompra(ordenCompra)
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => this.ui.cargando = false)
      )
      .subscribe({
        next: () => {
            
          this.limpiarFormulario();

          Swal.fire({
            title: 'Presupuesto Creado',
            icon: 'success'
          });
            
        },
        error: (err:Error) => {
          Swal.fire({
            title: 'Error al guardar',
            text: err.message,
            icon: 'error'
          });
        }
      });
  }



  /******************************************************/
  /************************BUILDER***********************/
  /******************************************************/

  private buildRequest(): CrearOrdenCompraRequest{
    return {
      clienteId: this.clienteSeleccionado!.id,
      detallesRequest: this.detalleView.map(detalle => ({
        muebleId: detalle.muebleId!,
        cantidad: detalle.cantidad,
        precioUnitario: detalle.precioUnitario
      }))
    };
  }

  /******************************************************/
  /************************HELPERS***********************/
  /******************************************************/

  actualizarPrecioTotal(detalle: OrdenDetalleView): void {
    detalle.precioTotal = detalle.cantidad * detalle.precioUnitario;
  }

  
  get totalOrden(): number{
    return this.detalleView.reduce(
      (total,detalle) => total + detalle.precioTotal,
      0
    );
  }

  private formularioValido(): boolean{
    if(!this.clienteSeleccionado){
      Swal.fire({
        title: 'Seleccione un Cliente',
        icon: 'warning'
      });

      return false;
    }

    if(this.detalleView.length === 0){
      Swal.fire({
        title: 'Agregue al menos un mueble',
        icon: 'warning'
      });

      return false;
    }

    return true;
  }


  private limpiarFormulario(): void {
    this.clienteSeleccionado = null;
    this.detalleView = [];

    // Cerrar modales por si alguno quedó abierto
    this.ui.mostrarClientes = false;
    this.ui.mostrarCrearCliente = false;
    this.ui.mostrarSeleccionarMueble = false;
    this.ui.animado = false;
  }

  /******************************************************/
  /**********************VALIDACIONES********************/
  /******************************************************/

  private detalleValidados(): boolean{
    
    const detalleInvalido = this.detalleView.find(
      detalle => detalle.cantidad <= 0 || detalle.precioUnitario <= 0
    );

    if(!detalleInvalido){
      return true;
    }

    Swal.fire({
      title: 'Detalle Invalido',
      text: 'La cantidad y el precio unitario debe ser mayor a cero',
      icon: 'warning'
    });

    return false;
  
  }

}
