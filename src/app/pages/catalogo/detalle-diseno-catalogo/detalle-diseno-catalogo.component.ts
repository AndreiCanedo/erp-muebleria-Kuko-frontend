import { Component, DestroyRef, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DisenoMueble } from '../../../models/diseno-mueble.model';
import { MuebleService } from '../../../services/mueble.service';
import { Mueble } from '../../../models/mueble.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { CatalogoImageService } from '../../../services/catalogo-image.service';
import { StorageServiceService } from '../../../services/storage-service.service';
import { Role } from '../../../models/role.enum';

@Component({
  selector: 'app-detalle-diseno-catalogo',
  standalone: false,
  templateUrl: './detalle-diseno-catalogo.component.html',
  styleUrl: './detalle-diseno-catalogo.component.css',
})
export class DetalleDisenoCatalogoComponent implements OnChanges{

  @Input({required: true}) public diseno!: DisenoMueble;

  private readonly muebleService = inject(MuebleService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly imageService = inject(CatalogoImageService);
  private readonly storageService = inject(StorageServiceService);

  public muebles: Mueble[] = [];

  public seleccionado: Mueble | null = null;

  public ui = {
    cargando: false,
    error: ''
  };

  public ngOnChanges(changes: SimpleChanges): void {

    if (
      changes['diseno']
      && this.diseno?.id
    ) {
      this.cargarVariantes();
    }
  }

  public seleccionarMueble(mueble: Mueble): void {
    this.seleccionado = mueble;
  }

  public reintentar(): void {
    this.cargarVariantes();
  }

  /*********************************************************/
  /****************** CARGAR INFORMACION *******************/
  /*********************************************************/

  private cargarVariantes(): void {

    this.ui.cargando = true;
    this.ui.error = '';

    this.muebles = [];
    this.seleccionado = null;

    this.muebleService.buscarPorDiseno(this.diseno.id)
      .pipe(takeUntilDestroyed(this.destroyRef),
          finalize(() => this.ui.cargando = false)          
      )
      .subscribe({

        next: muebles => {

          this.muebles = muebles;

          if(muebles.length){

            this.seleccionado = muebles[0];

          }
        },

        error: (error: Error) => {
          console.error('Error al cargar variantes del diseño:', error);
          
          this.ui.error ='No se pudieron cargar las variantes disponibles';

          this.muebles = [];
          this.seleccionado = null;
        }

    });

  }

  public obtenerImagen(): string {

    return this.imageService.obtenerOriginal(this.diseno.imagenUrl);
  
  }

  /*********************************************************/
  /************************* ROLES *************************/
  /*********************************************************/

  public get role(): Role | null {
    return this.storageService.obtener<Role>('role');
  }
    
  public get puedeAdministrarMuebles(): boolean {
    return this.role === Role.ADMIN;
  }
  
  public get puedeVendedorMuebles(): boolean {
    return this.role === Role.VENDEDOR;
  }

}
