import { Component, EventEmitter, inject, Input, OnDestroy, Output } from '@angular/core';
import { DisenoMuebleForm } from '../../../type/form/diseno-mueble-form.type';
import { CategoriaMueble } from '../../../models/categoria-mueble.enum';
import { CatalogoImageService } from '../../../services/catalogo-image.service';
import { DisenoMueble } from '../../../models/diseno-mueble.model';

@Component({
  selector: 'app-form-diseno-mueble',
  standalone: false,
  templateUrl: './form-diseno-mueble.component.html',
  styleUrl: './form-diseno-mueble.component.css',
})
export class FormDisenoMuebleComponent implements OnDestroy{

  @Input({required:true}) public disenoForm!: DisenoMuebleForm;
  @Input() public actualizar = false;
  @Input() public guardando = false;

  @Output() public submitForm = new EventEmitter<void>();
  @Output() public cancelar = new EventEmitter<void>();
  @Output() public imagenSeleccionada = new EventEmitter<File>();
  

  public readonly categorias = Object.values(CategoriaMueble);
  public archivoSeleccionado: File | null = null;
  public previewUrl: string | null = null;

  ngOnDestroy(): void {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }
  }

  public cerrarCaja(): void {
    if (this.guardando) {
      return;
    }

    this.cancelar.emit();
  }

  public onSubmit(): void {
    if (this.guardando) {
      return;
    }

    this.submitForm.emit();
  }

  public get f(): DisenoMuebleForm['controls'] {
    return this.disenoForm.controls;
  }

  public isInvalid(field: keyof DisenoMuebleForm['controls']): boolean {

    const control = this.disenoForm.controls[field];

    return control.touched && control.invalid;
  }

  public seleccionarImagen(event: Event): void {

    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];

    if (!archivo) return;

    const tiposPermitidos = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];

    if (!tiposPermitidos.includes(archivo.type)) {

      input.value = '';
      this.archivoSeleccionado = null;

      if (this.previewUrl) {
        URL.revokeObjectURL(this.previewUrl);
        this.previewUrl = null;
      }

      return;
    }

    this.archivoSeleccionado = archivo;

    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }

    this.previewUrl = URL.createObjectURL(archivo);

    this.imagenSeleccionada.emit(archivo);
  }

  


}
