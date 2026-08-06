import { AbstractControl, FormControl, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Component, DestroyRef, EventEmitter, inject, OnInit, Output } from '@angular/core';

import { FormaPago } from '../../../../models/forma-pago.enum';
import { EgresoService } from '../../../../services/egreso.service';
import { Egreso } from '../../../../models/egreso.model';
import { EgresoForm } from '../../../../type/form/egreso-form.type';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { CrearEgresoRequest } from '../../../../models/request/crear-egreso.request';
import Swal from 'sweetalert2';


@Component({
    selector: 'app-egreso-crear',
    templateUrl: './egreso-crear.component.html',
    styleUrl: './egreso-crear.component.css',
    standalone: false
})
export class EgresoCrearComponent implements OnInit{
  
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly egresoService = inject(EgresoService);
  private readonly destroyRef = inject(DestroyRef);

  @Output() public cancelar = new EventEmitter<void>();

  @Output() public egresoCreado = new EventEmitter<Egreso>();

  public egresoForm!: EgresoForm;

  public ui = {
    cargando: false
  };

  ngOnInit(): void {
    this.initForm();
    this.initSubscriptions();
    this.configurarFormaPago();
  }

  /******************************************************/
  /*********************** FORM *************************/
  /******************************************************/

  private initForm(): void {
    this.egresoForm = this.fb.group({
      nombre: [''],
      motivo: ['',[Validators.required, this.noWhitespaceValidator]],
      justificacion: [''],
      formaPago: [FormaPago.EFECTIVO, Validators.required],
      monto: [ 0, [Validators.required, Validators.min(0.01)]],
      efectivoEntregado: new FormControl<number | null>(null),
      cambio: new FormControl<number | null>({value: null, disabled: true})
    });
  }

  private initSubscriptions(): void {

    this.egresoForm.controls.formaPago.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.configurarFormaPago();
        this.calcularCambio();
      });

    this.egresoForm.controls.monto.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.calcularCambio();
      });

    this.egresoForm.controls.efectivoEntregado.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.calcularCambio();
      });
  }

  /******************************************************/
  /******************* FORMA DE PAGO ********************/
  /******************************************************/

  private configurarFormaPago(): void {
    const efectivoControl = this.egresoForm.controls.efectivoEntregado;

    if (this.esPagoEfectivo) {
      efectivoControl.setValidators([Validators.required, Validators.min(0.01)]);
    } else {
      efectivoControl.clearValidators();
      efectivoControl.setValue(null, {emitEvent: false});
      this.egresoForm.controls.cambio.setValue(null, { emitEvent: false });
    }

    efectivoControl.updateValueAndValidity({
      emitEvent: false
    });
  }

  private calcularCambio(): void {
    const cambioControl = this.egresoForm.controls.cambio;

    if (!this.esPagoEfectivo) {
      cambioControl.setValue(null, {emitEvent: false});
      return;
    }

    const monto = Number(this.egresoForm.controls.monto.value);

    const efectivo = this.egresoForm.controls.efectivoEntregado.value;

    if (efectivo === null) {
      cambioControl.setValue(null, {emitEvent: false});
      this.quitarErrorEfectivoInsuficiente();
      return;
    }

    const cambio = Number(efectivo) - monto;

    cambioControl.setValue(cambio, {emitEvent: false});

    this.validarEfectivoSuficiente(Number(efectivo), monto);
  }

  private validarEfectivoSuficiente(efectivo: number, monto: number): void {

    const control = this.egresoForm.controls.efectivoEntregado;

    const erroresActuales = control.errors ?? {};

    if (efectivo < monto) {
      control.setErrors({
        ...erroresActuales,
        efectivoInsuficiente: true
      });

      return;
    }

    this.quitarErrorEfectivoInsuficiente();
  }

  private quitarErrorEfectivoInsuficiente(): void {
    const control = this.egresoForm.controls.efectivoEntregado;

    if (!control.errors?.['efectivoInsuficiente']) {
      return;
    }

    const { efectivoInsuficiente, ...otrosErrores} = control.errors;

    control.setErrors( Object.keys(otrosErrores).length > 0
        ? otrosErrores
        : null
    );
  }

  private get esPagoEfectivo(): boolean {
    return (this.egresoForm.controls.formaPago.value === FormaPago.EFECTIVO);
  }

  /******************************************************/
  /******************* GUARDAR EGRESO *******************/
  /******************************************************/

  public guardarEgreso(): void {
    if (this.egresoForm.invalid) {
      this.egresoForm.markAllAsTouched();
      return;
    }

    if (this.ui.cargando) return

    const request = this.buildRequest();

    this.ui.cargando = true;

    this.egresoService.crearEgreso(request)
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => this.ui.cargando = false)
      )
      .subscribe({
        next: egreso => {
          this.handleSuccess(egreso);
        },

        error: (error: Error) => {
          this.handleError(error);
        }
      });
  }

  /******************************************************/
  /********************** BUILDER ***********************/
  /******************************************************/

  private buildRequest(): CrearEgresoRequest {
    const form = this.egresoForm.getRawValue();

    return {
      nombre: form.nombre.trim() || null,
      motivo: form.motivo.trim(),
      justificacion: form.justificacion.trim() || null,
      formaPago: form.formaPago,
      monto: Number(form.monto),
      efectivoEntregado: this.esPagoEfectivo ? Number(form.efectivoEntregado) : null,
      cambio: this.esPagoEfectivo ? Number(form.cambio ?? 0) : null
    };
  }

  /******************************************************/
  /********************** HANDLERS **********************/
  /******************************************************/

  private handleSuccess(egreso: Egreso): void {
    this.egresoService.notificarEgresoCreado();

    this.egresoCreado.emit(egreso);

    this.resetForm();
  }

  private handleError(error: Error): void {
    Swal.fire({
      title: 'Error al registrar el egreso',
      text: error.message,
      icon: 'error'
    });
  }

  /******************************************************/
  /*********************** HELPERS **********************/
  /******************************************************/

  private noWhitespaceValidator(control: AbstractControl) {
    const value = String(control.value ?? '');

    return value.trim().length === 0 ? { whitespace: true } : null;
  }

  public resetForm(): void {
    this.egresoForm.reset({
      nombre: '',
      motivo: '',
      justificacion: '',
      formaPago: FormaPago.EFECTIVO,
      monto: 0,
      efectivoEntregado: null,
      cambio: null
    });

    this.configurarFormaPago();
  }

  public cerrarCaja(): void {
    if (this.ui.cargando) return;
    this.cancelar.emit();
  }
}
