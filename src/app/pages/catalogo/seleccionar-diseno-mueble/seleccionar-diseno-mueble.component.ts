import { Component, DestroyRef, EventEmitter, inject, Output } from '@angular/core';
import { DisenoMueble } from '../../../models/diseno-mueble.model';
import { CategoriaMueble } from '../../../models/categoria-mueble.enum';
import { DisenoMuebleService } from '../../../services/diseno-mueble.service';
import { CatalogoImageService } from '../../../services/catalogo-image.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-seleccionar-diseno-mueble',
  standalone: false,
  templateUrl: './seleccionar-diseno-mueble.component.html',
  styleUrl: './seleccionar-diseno-mueble.component.css',
})
export class SeleccionarDisenoMuebleComponent {

  private readonly disenoMuebleService = inject(DisenoMuebleService)
  private readonly imageService = inject(CatalogoImageService);
  private readonly destroyRef = inject(DestroyRef);


  @Output() public disenoSeleccionado = new EventEmitter<DisenoMueble>();
  @Output() public cancelar = new EventEmitter<void>();


  public disenos: DisenoMueble[] = [];
  public disenosFiltrados: DisenoMueble[] = [];

  public readonly categorias = Object.values(CategoriaMueble);
  public textoBusqueda = '';
  public categoriaSeleccionada: CategoriaMueble | null = null;

  public ui = {
    cargando: false,
    error: ''
  };

  ngOnInit(): void {

    this.cargarDisenos();
  }


  /************************************************************/
  /********************* CARGAR DISEÑOS ***********************/
  /************************************************************/

  public cargarDisenos(): void {

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

          console.error('Error al cargar diseños:', error);

          this.disenos = [];
          this.disenosFiltrados = [];

          this.ui.error = 'No fue posible cargar los diseños';
        }

      });
  }


  /************************************************************/
  /************************ BUSCAR ****************************/
  /************************************************************/

  public buscar(texto: string): void {

    this.textoBusqueda = texto.trim();

    this.aplicarFiltros();
  }


  /************************************************************/
  /*********************** CATEGORÍA **************************/
  /************************************************************/

  public cambiarCategoria(categoria: CategoriaMueble | null): void {

    this.categoriaSeleccionada = categoria;

    this.aplicarFiltros();
  }


  public limpiarFiltros(): void {

    this.textoBusqueda = '';

    this.categoriaSeleccionada = null;

    this.aplicarFiltros();
  }


  /************************************************************/
  /************************ FILTRAR ***************************/
  /************************************************************/

  private aplicarFiltros(): void {

    const texto = this.textoBusqueda.trim().toLowerCase();

    this.disenosFiltrados = this.disenos.filter(diseno => {

        const coincideTexto = !texto
          || diseno.nombre.toLowerCase().includes(texto)
          || diseno.descripcion?.toLowerCase().includes(texto);

        const coincideCategoria = !this.categoriaSeleccionada
          || diseno.categoria === this.categoriaSeleccionada;

        return (coincideTexto && coincideCategoria );
      });
  }


  /************************************************************/
  /********************** SELECCIONAR *************************/
  /************************************************************/

  public seleccionarDiseno(diseno: DisenoMueble): void {

    this.disenoSeleccionado.emit(diseno);
  }


  /************************************************************/
  /************************ IMAGEN ****************************/
  /************************************************************/

  public obtenerMiniatura(diseno: DisenoMueble): string {

    if (!diseno.miniaturaUrl) return '';

    return this.imageService.obtenerMiniatura(diseno.miniaturaUrl);
  }


  /************************************************************/
  /************************ CERRAR ****************************/
  /************************************************************/

  public cerrar(): void {

    this.cancelar.emit();
  }


}
