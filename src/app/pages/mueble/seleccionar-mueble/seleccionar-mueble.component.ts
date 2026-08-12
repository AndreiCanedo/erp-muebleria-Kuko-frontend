import { Component, DestroyRef, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MuebleService } from '../../../services/mueble.service';
import { Mueble } from '../../../models/mueble.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CatalogoImageService } from '../../../services/catalogo-image.service';

@Component({
  selector: 'app-seleccionar-mueble',
  standalone: false,
  templateUrl: './seleccionar-mueble.component.html',
  styleUrl: './seleccionar-mueble.component.css',
})
export class SeleccionarMuebleComponent implements OnInit{

  private readonly muebleServices = inject(MuebleService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly imageService = inject(CatalogoImageService);


  @Output() muebleSeleccionado = new EventEmitter<Mueble>;
  @Output() crearMueble = new EventEmitter<void>();

  public muebles: Mueble[] = [];
  
  public textoBusqueda = '';
  
  public ui = {
    cargando:false,
    error:''
  };

  ngOnInit():void{
    this.buscarMuebles();
  }

  buscarMuebles(texto?: string):void{
    this.ui.cargando = true;
    this.ui.error = '';

    const peticion = texto 
      ? this.muebleServices.buscarMueble(texto)
      : this.muebleServices.cargarMueble();

    peticion
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (muebles) => {
          this.muebles = muebles;
          this.ui.cargando = false;
        },
        error: (err: Error) => {
          this.ui.error = err.message;
          this.ui.cargando = false;
        }
      })
  }

  /**********************************************************/
  /******************** IMAGEN MINIATURA ********************/
  /**********************************************************/

  public obtenerMiniatura(nombreArchivo: string | null): string {

    if (!nombreArchivo)  return '';

    return this.imageService.obtenerMiniatura(nombreArchivo);
  }

  /**********************************************************/
  /************************* HELPERS ************************/
  /**********************************************************/
  seleccionarMueble(mueble:Mueble): void{
    this.muebleSeleccionado.emit(mueble);
  }

  mostrarCrearMueble():void{
    this.crearMueble.emit();
  }

  buscar(texto:string): void{

    this.textoBusqueda = texto;

    this.buscarMuebles(texto.trim());

  }

  reiniciarBusqueda(): void{

    this.textoBusqueda = '';

    this.buscarMuebles();

  }

}
