import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { DisenoMuebleService } from '../../services/diseno-mueble.service';
import { DisenoMueble } from '../../models/diseno-mueble.model';
import { CategoriaMueble } from '../../models/categoria-mueble.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';
import { ContextMenuService } from '../../shared/directives/context-menu.service';
import { CatalogoImageService } from '../../services/catalogo-image.service';

@Component({
  selector: 'app-catalogo',
  standalone: false,
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css',
})
export class CatalogoComponent implements OnInit{

  private readonly destroyRef = inject(DestroyRef);
  private readonly disenoMuebleService = inject(DisenoMuebleService);
  private readonly contextMenu = inject(ContextMenuService);
  private readonly imageService = inject(CatalogoImageService);

  public disenos: DisenoMueble[] = [];
  public disenosFiltrados: DisenoMueble[] = [];

  public readonly categorias = Object.values(CategoriaMueble);

  public busqueda = '';
  public categoriaSeleccionada: CategoriaMueble | null = null;

  public mostrarDetalle = false;
  public mostrarCrear = false;
  public mostrarActualizar = false;

  public disenoSeleccionado: DisenoMueble | null = null;

  public ui = {
    cargando: false,
    cambiandoEstado: false,
    error: ''
  };

  ngOnInit(): void {
    this.cargarCatalogo();
  }

  /******************************************************/
  /******************* CARGAR CATÁLOGO ******************/
  /******************************************************/

  public cargarCatalogo(): void {

    this.ui.cargando = true;
    this.ui.error = '';

    this.disenoMuebleService.obtenerActivos()
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => this.ui.cargando = false)
      )
      .subscribe({
        next: disenos => {

          this.disenos = disenos;
          this.aplicarFiltros();

        },
        error: (error: Error) => {

          console.error('Error al cargar el catálogo:', error);

          this.disenos = [];
          this.disenosFiltrados = [];

          this.ui.error = 'No se pudo cargar el catálogo de muebles';
        }
      });
  }

  /******************************************************/
  /*********************** BUSCAR ***********************/
  /******************************************************/

  public buscar(texto: string): void {

    this.busqueda = texto;
    this.aplicarFiltros();
  }

  /******************************************************/
  /********************* CATEGORÍA **********************/
  /******************************************************/

  public cambiarCategoria(categoria: CategoriaMueble | null): void {

    this.categoriaSeleccionada = categoria;
    this.aplicarFiltros();
  }

  public limpiarCategoria(): void {

    this.categoriaSeleccionada = null;
    this.aplicarFiltros();
  }

  /******************************************************/
  /********************** FILTRADO **********************/
  /******************************************************/

  private aplicarFiltros(): void {

    const termino = this.busqueda.trim().toLowerCase();

    this.disenosFiltrados = this.disenos.filter(diseno => {

        const coincideTexto = !termino || diseno.nombre.toLowerCase().includes(termino)
          || diseno.descripcion ?.toLowerCase().includes(termino);

        const coincideCategoria = !this.categoriaSeleccionada 
          || diseno.categoria === this.categoriaSeleccionada;

        return (coincideTexto && coincideCategoria);
      });
  }

  /******************************************************/
  /********************** DETALLE ***********************/
  /******************************************************/

  public verDetalle(diseno: DisenoMueble): void {
    this.contextMenu.cerrar();

    this.disenoSeleccionado = diseno;
    this.mostrarDetalle = true;
  }

  public cerrarDetalle(): void {

    this.mostrarDetalle = false;
    this.disenoSeleccionado = null;
  }

  /******************************************************/
  /*********************** CREAR ************************/
  /******************************************************/

  public abrirCrear(): void {
    this.cerrarModales();
    this.mostrarCrear = true;
  }

  public cerrarCrear(): void {
    this.mostrarCrear = false;
  }

  public disenoCreado(_diseno: DisenoMueble): void {
    this.cerrarCrear();
    this.cargarCatalogo();
  }

  /******************************************************/
  /********************* ACTUALIZAR *********************/
  /******************************************************/

  public abrirActualizar(diseno: DisenoMueble): void {

    this.contextMenu.cerrar();

    this.cerrarModales();

    this.disenoSeleccionado = diseno;
    this.mostrarActualizar = true;
  }

  public cerrarActualizar(): void {

    this.mostrarActualizar = false;
    this.disenoSeleccionado = null;
  }

  public disenoActualizado(_diseno: DisenoMueble): void {

    this.cerrarActualizar();
    this.cargarCatalogo();
  }

  /******************************************************/
  /*********************** TRACK ************************/
  /******************************************************/

  public trackByDiseno(_: number, diseno: DisenoMueble): number {

    return diseno.id;
  }

  /******************************************************/
  /********************** ESTADO ************************/
  /******************************************************/

  public confirmarCambiarEstado(diseno: DisenoMueble): void {

    this.contextMenu.cerrar();

    if (this.ui.cambiandoEstado) return;
    

    const nuevoEstado = !diseno.activo;

    Swal.fire({
      title: nuevoEstado ? '¿Activar diseño?' : '¿Desactivar diseño?',
      text: nuevoEstado
        ? `"${diseno.nombre}" volverá a aparecer en el catálogo.`
        : `"${diseno.nombre}" dejará de aparecer en el catálogo.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: nuevoEstado ? 'Sí, activar' : 'Sí, desactivar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then(result => {

      if (result.isConfirmed) {
        this.cambiarEstado(diseno, nuevoEstado);
      }
    });
  }

  private cambiarEstado(diseno: DisenoMueble, activo: boolean): void {

    this.ui.cambiandoEstado = true;

    this.disenoMuebleService.cambiarEstado(diseno.id, activo)
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => this.ui.cambiandoEstado = false))
      .subscribe({
        next: () => {

          this.cargarCatalogo();

          Swal.fire({
            title: activo ? 'Diseño activado' : 'Diseño desactivado',
            icon: 'success'
          });
        },

        error: (error: Error) => {

          Swal.fire({
            title: 'No fue posible cambiar el estado',
            text: error.message,
            icon: 'error'
          });
        }

      });
  }

  /******************************************************/
  /*********************** HELPERS **********************/
  /******************************************************/

  private cerrarModales(): void {

    this.mostrarDetalle = false;
    this.mostrarCrear = false;
    this.mostrarActualizar = false;

    this.disenoSeleccionado = null;
  }

  public obtenerImagen(diseno: DisenoMueble): string {
    
    if(diseno.miniaturaUrl){
      return this.imageService.obtenerMiniatura(diseno.miniaturaUrl);
    }

    return this.imageService.obtenerOriginal(diseno.imagenUrl);
  }


}
