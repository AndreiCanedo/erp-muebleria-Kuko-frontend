import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { EgresoService } from '../../services/egreso.service';

import { Egreso } from '../../models/egreso.model';
import { finalize } from 'rxjs';
import { EstadoEgreso } from '../../models/estado-egreso.enum';
import Swal from 'sweetalert2';
import { ordenarPorFechaDescendente } from '../../shared/utils/sort.util';

@Component({
    selector: 'app-egreso',
    templateUrl: './egreso.component.html',
    styleUrl: './egreso.component.css',
    standalone: false
})
export class EgresoComponent implements OnInit {

  private readonly egresoServices = inject(EgresoService);
  private readonly destroyRef = inject(DestroyRef);
  
  public egresos: Egreso[] = []
  public egresosFiltrados: Egreso[] = [];

  public busqueda = '';
  public estadoSeleccionado = '';
  public formaPagoSeleccionada = '';

  public ui = {
    cargando: false,
    error: '',

    modalVisible: false,
    modo: 'none' as 
      | 'crear'
      | 'editar'
      | 'detalle'
      | 'cancelar'
      | 'none',

    egresoSeleccionadoId: 0,
    mensajeExito: ''
  };
  
  ngOnInit(): void {
    this.cargarEgresos();
    this.initSubscriptions();
  }

  private initSubscriptions(): void{
    this.egresoServices.egresoCreado$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.cargarEgresos();
      })
  }

/***************************************************/
/*******************CARGAR EGRESO*******************/
/***************************************************/

  public cargarEgresos(): void{

    this.ui.cargando = true;
    this.ui.error = '';


    this.egresoServices.cargarEgresos()
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => this.ui.cargando = false)
      )
      .subscribe({
        next: egresos => {
          this.egresos = ordenarPorFechaDescendente(egresos, egreso => egreso.fecha);

          this.aplicarFiltros();

        },
        error: (err: Error) => {
          console.error(err.message);

          this.egresos = [];

          this.egresosFiltrados = [];

          this.ui.error = 'No fue posible cargar los egresos'
        }
      });
  }

/***************************************************/
/*******************FILTROS EGRESO******************/
/***************************************************/

  public aplicarFiltros(): void{
    const termino = this.busqueda.trim().toLowerCase();

    this.egresosFiltrados = this.egresos.filter(egreso => {

      const coincideBusqueda = !termino 
        || egreso.id.toString().includes(termino)
        || egreso.nombre?.toLowerCase().includes(termino)
        || egreso.motivo.toLowerCase().includes(termino)
        || egreso.justificacion?.toLowerCase().includes(termino)
        || false;

      const coincideEstado = !this.estadoSeleccionado 
        || egreso.estado === this.estadoSeleccionado;

      const coincideFormaPago = !this.formaPagoSeleccionada 
        || egreso.formaPago === this.formaPagoSeleccionada

      return( coincideBusqueda && coincideEstado && coincideFormaPago);
    });
  }

  public limpiarFiltros(): void{
    this.busqueda = '';
    this.estadoSeleccionado = '';
    this.formaPagoSeleccionada = '';

    this.aplicarFiltros();
  }

/***************************************************/
/***************** ACCIONES EGRESO *****************/
/***************************************************/

  public registrarEgreso(): void {
    this.ui.egresoSeleccionadoId = 0;
    this.abrirModal('crear');
  }

  public editarEgreso(egreso: Egreso): void{
    this.ui.egresoSeleccionadoId = egreso.id;
    this.abrirModal('editar');
  }

  public verDetalle(egreso: Egreso): void {
    this.ui.egresoSeleccionadoId = egreso.id;
    this.abrirModal('detalle');
  }

  public solicitarCancelacion(egreso: Egreso): void {
    this.ui.egresoSeleccionadoId = egreso.id;
    this.abrirModal('cancelar');
  }


/***************************************************/
/****************** RESUMEN EGRESO *****************/
/***************************************************/

  public get totalSemana(): number{
    const inicioSemana = this.obtenerInicioDeSemana(new Date());

    return this.egresos.filter(egreso => 

      egreso.estado === EstadoEgreso.APLICADO 
        && egreso.fecha !== null 
        && egreso.fecha >= inicioSemana

    )
    .reduce((total, egreso) => total + Number(egreso.monto), 0);
  }

  public get totalMes(): number{
    const hoy = new Date();

    return this.egresos.filter(egreso => 
      egreso.estado === EstadoEgreso.APLICADO 
      && egreso.fecha !== null
      && egreso.fecha.getFullYear() === hoy.getFullYear()
      && egreso.fecha.getMonth() === hoy.getMonth()
    )
    .reduce((total, egreso) => total + Number(egreso.monto), 0);
  }

  public get cantidadAplicados(): number {
    return this.egresos.filter(egreso => 
      egreso.estado === EstadoEgreso.APLICADO
    ).length;
  }

  public get cantidadCancelados(): number {
    return this.egresos.filter(egreso => 
      egreso.estado === EstadoEgreso.CANCELADO
    ).length;
  }

/***************************************************/
/********************** HELPERS ********************/
/***************************************************/


  public obtenerInicioDeSemana(fecha: Date): Date{
    
    const inicio = new Date(fecha);

    const dia = inicio.getDay();

    const diferencia = dia === 0 ? -6 : 1 - dia;

    inicio.setDate(inicio.getDate() + diferencia);

    inicio.setHours(0,0,0,0);

    return inicio;
    
  }

  private abrirModal( modo: 'crear' | 'editar' | 'detalle' | 'cancelar'): void {

    this.ui.modo = modo;
    this.ui.modalVisible = true;

  }

  cerrarModal(): void {
    this.ui.modalVisible = false;
  }

  onModalCerrado(): void {
    const mensajeExito = this.ui.mensajeExito;

    this.ui.modalVisible = false;
    this.ui.modo = 'none';
    this.ui.egresoSeleccionadoId = 0;
    this.ui.mensajeExito = '';

    if(mensajeExito){
      Swal.fire({
        title: mensajeExito,
        icon: 'success'
      });
    }
  }

  public operacionExitosa(mensaje: string): void {
    this.ui.mensajeExito = mensaje;

    this.cerrarModal();
  }

}
