import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MuebleService } from '../../services/mueble.service';
import { Mueble } from '../../models/mueble.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-mueble',
  standalone: false,
  templateUrl: './mueble.component.html',
  styleUrl: './mueble.component.css',
})
export class MuebleComponent implements OnInit{
  
  private readonly muebleService = inject(MuebleService);
  private readonly destroyRef = inject(DestroyRef);

  public muebles: Mueble[] = [];

  public textoBusqueda = '';

  public muebleSeleccionado: Mueble | null = null;

  public ui = {
    cargando: false,
    eliminando: false,

    mostrarCrear: false,
    mostrarActualizar: false,

    error:''
  };

  ngOnInit(): void {
      this.buscarMuebles();
  }

  buscarMuebles(texto?: string):void{

    const textoNormalizado = texto?.trim();

    this.ui.cargando = true;
    this.ui.error = '';

    const peticion = textoNormalizado
      ? this.muebleService.buscarMueble(textoNormalizado)
      : this.muebleService.cargarMueble()

    peticion
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.ui.cargando = false;
        })
      )
      .subscribe({
        next: muebles => {
          this.muebles = muebles;
        },
        error: error => {
          this.muebles = [];

          this.ui.error = textoNormalizado 
            ? 'No fue posible buscar los muebles' 
            : this.obtenerMensajeError(error);
        }
      });
  }

  abrirCrearMueble(): void{
    this.cerrarModales();
    this.ui.mostrarCrear = true;
  }

  cerrarCrearMueble(): void{
    this.ui.mostrarCrear = false;
  }

  abrirActualizarMueble(mueble: Mueble): void{
    this.cerrarModales();

    this.muebleSeleccionado = mueble;
    this.ui.mostrarActualizar = true;
  }

  cerrarActualizarMueble(): void {
    this.ui.mostrarActualizar = false;
    this.muebleSeleccionado = null;
  }

  handleMuebleCreado(_mueble: Mueble): void{
    this.cerrarCrearMueble();

    this.buscarMuebles(this.textoBusqueda);
  }

  handleMuebleActualizado(_mueble: Mueble): void{
    this.cerrarActualizarMueble();
    this.buscarMuebles(this.textoBusqueda);
  }

  confirmarEliminarMueble(mueble: Mueble): void{
    if(this.ui.eliminando){
      return;
    }

    Swal.fire({
      title: '¿Eliminar Mueble?',
      text: `Se eliminará "${mueble.descripcion}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then(result => {
      if(result.isConfirmed){
        this.eliminarMueble(mueble);
      }
    });
  }

  private eliminarMueble(mueble: Mueble): void{
    this.ui.eliminando = true;

    this.muebleService.eliminarMueble(mueble.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.ui.eliminando = false;

          //Eliminacion Local para evitar segunda peticion GET
          this.muebles = this.muebles.filter(
            item => item.id !== mueble.id
          );

          Swal.fire({
            title: 'Mueble eliminado correctamente',
            icon: 'success'
          });
        },
        error: error => {
          this.ui.eliminando = false;

          Swal.fire({
            title: 'Error al eliminar el mueble',
            text: this.obtenerMensajeError(error),
            icon: 'error'
          });
        }
      });
  }

  private cerrarModales(): void{
    this.ui.mostrarCrear = false;
    this.ui.mostrarActualizar = false;
    this.muebleSeleccionado = null;
  }

  private obtenerMensajeError(error: unknown): string{
    if(error instanceof Error){
      return error.message;
    }

    return 'Ocurrio un error inesperado';
  }

  public buscar(texto: string): void {
    this.textoBusqueda = texto.trim();

    this.buscarMuebles(this.textoBusqueda);
  }

}
