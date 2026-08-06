import { Component, DestroyRef, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import Swal from 'sweetalert2';

import { MuebleService } from '../../../services/mueble.service';

import { Mueble } from '../../../models/mueble.model';

import { MuebleForm } from '../../../type/form/mueble-form.type';

@Component({
  selector: 'app-crear-mueble',
  standalone: false,
  templateUrl: './crear-mueble.component.html',
  styleUrl: './crear-mueble.component.css',
})
export class CrearMuebleComponent implements OnInit{
  private fb = inject(NonNullableFormBuilder);
  private destroyRf = inject(DestroyRef);

  private muebleServices = inject(MuebleService);


  @Output() cancelar = new EventEmitter<void>();
  @Output() muebleCreado = new EventEmitter<Mueble>();


  //////////////FORM////////////////////////
  public muebleForm!: MuebleForm;

  ///////////////////UI STATE/////////////////

  public ui = {
    actualizar: false,
    guardando: false
  }

  ngOnInit():void{
    this.initForm()
  }

  private initForm():void{
    this.muebleForm = this.fb.group({
      id:0,
      descripcion: ['',[Validators.required, this.noWhitespaceValidator]],
      precioReferencia: [0,[Validators.required, Validators.min(1)]]
    });
  }

  ///////////////////GUARDAR MUEBLE//////////////////////

  guardarMueble():void{
    if(this.muebleForm.invalid || this.ui.guardando){
      this.muebleForm.markAllAsTouched();
      return;
    }

    this.ui.guardando = true;

    const mueble = this.buildMueble();

    this.muebleServices.crearMueble(mueble)
      .pipe(takeUntilDestroyed(this.destroyRf))
      .subscribe({
        next: (mueble) => this.handlesucces(mueble),
        error: (err:Error) => this.handleError(err) 
      });
  }

  ///////////////////////BUILDER///////////////////

  private buildMueble():Mueble{
    const form = this.muebleForm.getRawValue();

    return new Mueble(
      0,
      form.descripcion.trim(),
      form.precioReferencia
    )
  }

  /////////////////////HANDLERS////////////////////////

  private handlesucces(mueble:Mueble):void{
    this.ui.guardando = false;

    this.muebleServices.notificarMuebleCreado();

    this.muebleCreado.emit(mueble);

    Swal.fire({
      title: 'Mueble Creado correctamente',
      icon: 'success'
    });

    this.resetForm();

    //this.cerrarCaja();

  }

  handleError(err: Error): void{
    this.ui.guardando = false;

    Swal.fire({
      title: 'Error al crear Mueble',
      text: err.message,
      icon: 'error'
    });
  }


  ///////////////////HELPERS////////////////

  private noWhitespaceValidator(control: AbstractControl){
    return (control.value || ``).trim().length === 0
      ? { whitespace: true }
      : null
  }

  cerrarCaja():void{
    if(this.ui.guardando){
      return;
    }
    this.cancelar.emit();
  }

  resetForm():void{
    this.muebleForm.reset({
      id:0,
      descripcion: '',
      precioReferencia: 0
    });
  }

}
