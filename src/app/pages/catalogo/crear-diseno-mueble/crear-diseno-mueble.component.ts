import { Component, DestroyRef, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, Validators } from '@angular/forms';
import { DisenoMuebleService } from '../../../services/diseno-mueble.service';
import { DisenoMueble } from '../../../models/diseno-mueble.model';
import { DisenoMuebleForm } from '../../../type/form/diseno-mueble-form.type';
import { CategoriaMueble } from '../../../models/categoria-mueble.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';
import { CrearDisenoMuebleRequest } from '../../../models/request/crear-diseno-mueble.request';
import { CatalogoImageService } from '../../../services/catalogo-image.service';

@Component({
  selector: 'app-crear-diseno-mueble',
  standalone: false,
  templateUrl: './crear-diseno-mueble.component.html',
  styleUrl: './crear-diseno-mueble.component.css',
})
export class CrearDisenoMuebleComponent implements OnInit{

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly disenoService = inject(DisenoMuebleService);
  private readonly imageService = inject(CatalogoImageService);

  @Output() public cancelar = new EventEmitter<void>();
  @Output() public disenoCreado = new EventEmitter<DisenoMueble>();

  public disenoForm!: DisenoMuebleForm;
  private imagenSeleccionada: File | null = null;

  public ui = {
    actualizar: false,
    guardando: false
  };

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {

    this.disenoForm = this.fb.group({

      id: this.fb.control<number>(0),
      nombre: this.fb.control<string>('',[Validators.required, this.noWhitespaceValidator]),
      descripcion: this.fb.control<string>(''),
      categoria: this.fb.control<CategoriaMueble>(CategoriaMueble.OTRO, Validators.required),
      activo: this.fb.control<boolean>(true)
    });
  }

  /********************************************************************/
  /******************* GUARDAR DISEÑO MUEBLE **************************/
  /********************************************************************/

  public guardarDiseno(): void {

    if (this.disenoForm.invalid || this.ui.guardando) {
      this.disenoForm.markAllAsTouched();
      return;
    }

    if(!this.imagenSeleccionada){
      Swal.fire({
        title: 'Seleccione imagen',
        icon: 'warning'
      });

      return;
    }

    this.ui.guardando = true;

    this.imageService.subirImagen(this.imagenSeleccionada)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: imagen => {
          const request = this.buildRequest(imagen.imagenUrl, imagen.miniaturaUrl);

          this.crearDiseno(request);
        },
        error: error => {
          this.ui.guardando = false;

          Swal.fire({
            title: 'No se pudo subir la imagen',
            text: error.message,
            icon: 'error'
          });
        }
      });
  }

  /********************************************************************/
  /********************** CREAR DISEÑO MUEBLE *************************/
  /********************************************************************/

  private crearDiseno(request: CrearDisenoMuebleRequest): void {

  this.disenoService.crear(request)
    .pipe(takeUntilDestroyed(this.destroyRef),
      finalize(() => this.ui.guardando = false))
    .subscribe({
      next: diseno => {

        this.disenoCreado.emit(diseno);

        Swal.fire({
          title: 'Diseño creado correctamente',
          icon: 'success'
        });
      },
      error: (error: Error) => {

        Swal.fire({
          title: 'Error al crear el diseño',
          text: error.message,
          icon: 'error'
        });
      }
    });
}

  /********************************************************************/
  /********************** BUILD DISEÑO MUEBLE *************************/
  /********************************************************************/

  private buildRequest(imagenUrl: string, miniaturaUrl:string): CrearDisenoMuebleRequest {

    const form = this.disenoForm.getRawValue();

    return {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() ? form.descripcion.trim() : null,
      categoria: form.categoria,
      imagenUrl,
      miniaturaUrl
    };
  }

  /********************************************************************/
  /********************************* HELPER ***************************/
  /********************************************************************/

  private noWhitespaceValidator(control: AbstractControl) {
    return (control.value || '').trim().length === 0 ? { whitespace: true } : null;
  }

  public cerrarCaja(): void {

    if (this.ui.guardando) return;
    
    this.cancelar.emit();
  }

  private resetForm(): void {

    this.disenoForm.reset({

      id: 0,
      nombre: '',
      descripcion: '',
      categoria: CategoriaMueble.OTRO,
      activo: true
    });
  }

  public seleccionarImagen(archivo: File): void{
    this.imagenSeleccionada = archivo;
  }

}
