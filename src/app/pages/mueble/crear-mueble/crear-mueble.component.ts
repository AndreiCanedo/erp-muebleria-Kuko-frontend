import { Component, DestroyRef, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import Swal from 'sweetalert2';

import { MuebleService } from '../../../services/mueble.service';

import { Mueble } from '../../../models/mueble.model';

import { MuebleForm } from '../../../type/form/mueble-form.type';
import { CrearMuebleRequest } from '../../../models/request/crear-mueble.request';

@Component({
  selector: 'app-crear-mueble',
  standalone: false,
  templateUrl: './crear-mueble.component.html',
  styleUrl: './crear-mueble.component.css',
})
export class CrearMuebleComponent implements OnInit{
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly destroyRf = inject(DestroyRef);
  private muebleServices = inject(MuebleService);


  @Output() cancelar = new EventEmitter<void>();
  @Output() muebleCreado = new EventEmitter<Mueble>();

  public muebleForm!: MuebleForm;

  public ui = {
    actualizar: false,
    guardando: false
  }

  ngOnInit():void{
    this.initForm();
  }

  private initForm():void{
    this.muebleForm = this.fb.group({
      id:0,
      descripcion: ['',[Validators.required, this.noWhitespaceValidator]],
      precioReferencia: [0,[Validators.required, Validators.min(1)]],
      disenoMuebleId: this.fb.control<number>(0),
      activo: this.fb.control<boolean>(true)
    });
  }

/**************************************************************/
/********************* GUARDAR MUEBLE *************************/
/**************************************************************/

  guardarMueble():void{
    if(this.muebleForm.invalid || this.ui.guardando){
      this.muebleForm.markAllAsTouched();
      return;
    }

    this.ui.guardando = true;

    const request = this.buildRequest();

    this.muebleServices.crearMueble(request)
      .pipe(takeUntilDestroyed(this.destroyRf))
      .subscribe({
        next: (mueble) => this.handlesucces(mueble),
        error: (err:Error) => this.handleError(err) 
      });
  }


/**************************************************************/
/************************ BUILD MUEBLE ************************/
/**************************************************************/

  private buildRequest():CrearMuebleRequest{
    const form = this.muebleForm.getRawValue();

    return {
      descripcion: form.descripcion.trim(),
      precioReferencia: form.precioReferencia,
      disenoMuebleId: form.disenoMuebleId || null
    }
      
  }

/**************************************************************/
/************************** HANDLERS **************************/
/**************************************************************/

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


/**************************************************************/
/*************************** HELPERS **************************/
/**************************************************************/

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
      precioReferencia: 0,
      disenoMuebleId: 0,
      activo: true
    });
  }

}
