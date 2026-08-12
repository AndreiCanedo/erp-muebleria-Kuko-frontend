import { Component, DestroyRef, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, Validators } from '@angular/forms';
import { DisenoMuebleService } from '../../../services/diseno-mueble.service';
import { DisenoMueble } from '../../../models/diseno-mueble.model';
import { DisenoMuebleForm } from '../../../type/form/diseno-mueble-form.type';
import { CategoriaMueble } from '../../../models/categoria-mueble.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';
import { ActualizarDisenoMuebleRequest } from '../../../models/request/actualizar-diseno-mueble.request';
import { CatalogoImageService } from '../../../services/catalogo-image.service';

@Component({
  selector: 'app-actualizar-diseno-mueble',
  standalone: false,
  templateUrl: './actualizar-diseno-mueble.component.html',
  styleUrl: './actualizar-diseno-mueble.component.css',
})
export class ActualizarDisenoMuebleComponent implements OnChanges{

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly destroyRef =inject(DestroyRef);
  private readonly disenoService =inject(DisenoMuebleService);
  private readonly imageService = inject(CatalogoImageService);

  @Input({ required: true }) public diseno!: DisenoMueble;

  @Output() public cancelar = new EventEmitter<void>();

  @Output() public disenoActualizado = new EventEmitter<DisenoMueble>();

  private imagenSeleccionada: File | null = null;

  public disenoForm: DisenoMuebleForm =
    this.fb.group({
      id: this.fb.control<number>(0),
      nombre: this.fb.control<string>('',[ Validators.required, this.noWhitespaceValidator]),
      descripcion: this.fb.control<string>(''),
      categoria: this.fb.control<CategoriaMueble>( CategoriaMueble.OTRO, Validators.required),
      activo: this.fb.control<boolean>(true)
    });

  public ui = {
    actualizar: true,
    guardando: false
  };

  ngOnChanges( changes: SimpleChanges): void {
    if ( changes['diseno'] && this.diseno) {
      this.imagenSeleccionada = null;
      this.cargarDisenoEnFormulario();
    }
  }

  /************************************************************/
  /********************** CARGAR DATOS ************************/
  /************************************************************/

  private cargarDisenoEnFormulario(): void {

    this.disenoForm.reset({

      id: this.diseno.id,
      nombre: this.diseno.nombre,
      descripcion: this.diseno.descripcion ?? '',
      categoria: this.diseno.categoria,
      activo: this.diseno.activo
    });
  }

  /************************************************************/
  /**************** ACTUALIZAR DISEÑO MUEBLE ******************/
  /************************************************************/

  public actualizarDiseno(): void {

    if (this.disenoForm.invalid || this.ui.guardando) {
      this.disenoForm.markAllAsTouched();
      return;
    }

    this.ui.guardando = true;

    if (this.imagenSeleccionada) {
      this.actualizarConNuevaImagen();
      return;
    }

    const request = this.buildRequest(this.diseno.imagenUrl, this.diseno.miniaturaUrl);

    this.enviarActualizacion(request)

    this.disenoService.actualizar(this.diseno.id, request)
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => this.ui.guardando = false)
      )
      .subscribe({

        next: diseno => {
          this.disenoActualizado.emit(diseno);

          Swal.fire({
            title: 'Diseño actualizado correctamente',
            icon: 'success'
          });

        },
        error: (error: Error) => {

          Swal.fire({
            title: 'Error al actualizar el diseño',
            text: error.message,
            icon: 'error'
          });
        }
      });
  }

  /************************************************************/
  /********************* NUEVA IMAGEN *************************/
  /************************************************************/

  private actualizarConNuevaImagen(): void {

    if (!this.imagenSeleccionada) {
      return;
    }

    this.imageService
      .subirImagen(this.imagenSeleccionada)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({

        next: imagen => {

          const request = this.buildRequest(imagen.imagenUrl, imagen.miniaturaUrl);

          this.enviarActualizacion(request);
        },

        error: error => {

          this.ui.guardando = false;

          Swal.fire({
            title: 'No se pudo subir la nueva imagen',
            text: error.message,
            icon: 'error'
          });
        }

      });
  }

  /************************************************************/
  /********************* ENVIAR UPDATE ************************/
  /************************************************************/

  private enviarActualizacion(request: ActualizarDisenoMuebleRequest): void {

    this.disenoService.actualizar(this.diseno.id, request)
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => this.ui.guardando = false)
      )
      .subscribe({
        next: diseno => {

          this.disenoActualizado.emit(diseno);

          Swal.fire({
            title:'Diseño actualizado correctamente',
            icon:'success'
          });
        },

        error: (error: Error) => {

          Swal.fire({
            title: 'Error al actualizar el diseño',
            text: error.message,
            icon:'error'
          });
        }

      });
  }

  /************************************************************/
  /**************** BUILD REQUEST ******************************/
  /************************************************************/

  private buildRequest(imagenUrl: string, miniaturaUrl: string): ActualizarDisenoMuebleRequest {

    const form = this.disenoForm.getRawValue();

    return {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() ? form.descripcion.trim() : null,
      categoria: form.categoria,
      imagenUrl,
      miniaturaUrl,
      activo: form.activo
    };
  }

  /************************************************************/
  /******************* IMAGEN SELECCIONADA ********************/
  /************************************************************/

  public seleccionarImagen(archivo: File): void {
    this.imagenSeleccionada =archivo;
  }

  /************************************************************/
  /********************** HELPERS *****************************/
  /************************************************************/

  private noWhitespaceValidator(control: AbstractControl) {

    return (control.value || '').trim().length === 0 ? { whitespace: true } : null;
  }

  public cerrarCaja(): void {

    if (this.ui.guardando) return;
    
    this.cancelar.emit();
  }

}
