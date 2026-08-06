import { Component, DestroyRef, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, Validators } from '@angular/forms';
import { MuebleService } from '../../../services/mueble.service';
import { Mueble } from '../../../models/mueble.model';
import { MuebleForm } from '../../../type/form/mueble-form.type';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actualizar-mueble',
  standalone: false,
  templateUrl: './actualizar-mueble.component.html',
  styleUrl: './actualizar-mueble.component.css',
})
export class ActualizarMuebleComponent implements OnChanges{

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  
  private readonly mueblesServices = inject(MuebleService);

  @Input({ required: true}) mueble!: Mueble;

  @Output() cancelar = new EventEmitter<void>();
  @Output() muebleActualizado = new EventEmitter<Mueble>();

  public muebleForm: MuebleForm = this.fb.group({
    id: 0,
    descripcion:['',[Validators.required, this.noWhitespaceValidator]],
    precioReferencia: [0,[Validators.required, Validators.min(1)]]
  });

  public ui = {
    actualizar: true,
    guardando: false
  };

  ngOnChanges(changes: SimpleChanges): void {
      if(changes['mueble']&& this.mueble){
        this.cargarMuebleEnformulario();
      }
  }

  actualizarMueble(): void {
    if(this.muebleForm.invalid || this.ui.guardando){
      this.muebleForm.markAllAsTouched();
      return;
    }

    this.ui.guardando = true;

    const muebleActualizado = this.buildMueble();

    this.mueblesServices.actualizarMueble(muebleActualizado, this.mueble.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: mueble => {
          this.handleSuccess(mueble);
        },
        error:(error: Error) => {
          this.handleError(error);
        }
      });
  }

  private cargarMuebleEnformulario():void {
    this.muebleForm.reset({
      id:this.mueble.id,
      descripcion: this.mueble.descripcion,
      precioReferencia: this.mueble.precioReferencia
    });
  }

  private buildMueble(): Mueble{
    const form = this.muebleForm.getRawValue();

    return new Mueble(
      this.mueble.id,
      form.descripcion.trim(),
      form.precioReferencia 
    );
  }

  private handleSuccess(mueble: Mueble): void{
    this.ui.guardando = false;

    this.muebleActualizado.emit(mueble);

    Swal.fire({
      title: 'Mueble actualizado correctamente',
      icon: 'success'
    });
  }

  private handleError(error: Error): void {
    this.ui.guardando = false;

    Swal.fire({
      title: 'Error al actualizar el mueble',
      text: error.message,
      icon: 'error'
    });
  }

  private noWhitespaceValidator(control: AbstractControl) {
  return (control.value || '').trim().length === 0
    ? { whitespace: true }
    : null;
}

  cerrarCaja(): void{
    if(this.ui.guardando){
      return;
    }
    this.cancelar.emit();
  }

}
