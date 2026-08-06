import { AbstractControl, FormControl, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Egreso } from '../../../../models/egreso.model';
import { EgresoForm } from '../../../../type/form/egreso-form.type';
import { EgresoService } from '../../../../services/egreso.service';
import { FormaPago } from '../../../../models/forma-pago.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { ActualizarEgresoRequest } from '../../../../models/request/actualizar-egreso.request';
import Swal from 'sweetalert2';



@Component({
    selector: 'app-egreso-edit',
    templateUrl: './egreso-edit.component.html',
    styleUrl: './egreso-edit.component.css',
    standalone: false
})
export class EgresoEditComponent implements OnInit{

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly egresoService = inject(EgresoService);
  private readonly destroyRef = inject(DestroyRef);

  @Input() public egresoId!: number;

  @Output() public cancelar = new EventEmitter<void>();
  @Output() public egresoActualizado = new EventEmitter<Egreso>();

  public egresoForm!: EgresoForm;
  public egresoSeleccionado: Egreso | null = null;

  public ui = {
    cargando: false,
    guardando: false,
    error: ''
  }

  ngOnInit(): void {
    this.initForm();
    this.initSubscriptions();
    this.configurarFormaPago();

    if(this.egresoId) {
      this.cargarEgreso(this.egresoId);
    }
  }


/***************************************************/
/********************** FORM ***********************/
/***************************************************/

  private initForm(): void{
    this.egresoForm = this.fb.group({
      nombre: [''],
      motivo: ['',[Validators.required, this.noWhitespaceValidator]],
      justificacion:[''],
      formaPago:[FormaPago.EFECTIVO,Validators.required],
      monto:[0,[Validators.required, Validators.min(0.01)]],
      efectivoEntregado: new FormControl<number | null>(null),
      cambio: new FormControl<number | null>({value: null, disabled: true})
    });
  }

  private initSubscriptions(): void{
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

/****************************************************************/  
/*********************** CARGAR EGRESO **************************/  
/****************************************************************/  

  private cargarEgreso(id:number): void{
    this.ui.cargando = true;
    this.ui.error = '';
    this.egresoSeleccionado = null;

    this.egresoService.cargarEgresoById(id)
      .pipe(takeUntilDestroyed(this.destroyRef),
      finalize(() => this.ui.cargando = false)
    )
    .subscribe({
      next: egreso => {
        this.egresoSeleccionado = egreso;
        this.patchForm(egreso);
      },
      error: error => {
        console.error('Error al cargar el egreso', error);
        this.ui.error = 'No fue posible cargar el Egreso'
      }
    });
  }

  private patchForm(egreso: Egreso): void{
    this.egresoForm.patchValue({
      nombre: egreso.nombre ?? '',
      motivo: egreso.motivo,
      justificacion: egreso.justificacion ?? '',
      formaPago: egreso.formaPago,
      monto: egreso.monto,
      efectivoEntregado: egreso.efectivoEntregado,
      cambio: egreso.cambio
    });

    this.configurarFormaPago();
    this.calcularCambio();
  }

/****************************************************************/  
/************************** FORMA PAGO **************************/  
/****************************************************************/ 

  private get esPagoEfectivo(): boolean{
    return (this.egresoForm.controls.formaPago.value === FormaPago.EFECTIVO);
  }

  private configurarFormaPago(): void{
    const efectivoControl = this.egresoForm.controls.efectivoEntregado;

    if(this.esPagoEfectivo){
      efectivoControl.setValidators([Validators.required,Validators.min(0.01)]);
    } else {
      efectivoControl.clearValidators();
      efectivoControl.setValue(null, {emitEvent: false});
      this.egresoForm.controls.cambio.setValue(null, {emitEvent: false});
    }

    efectivoControl.updateValueAndValidity({ emitEvent: false });
  }

  private calcularCambio(): void{
    const cambioControl = this.egresoForm.controls.cambio;

    if(!this.esPagoEfectivo){
      cambioControl.setValue(null, {emitEvent: false});
      return;
    }

    const monto = Number(this.egresoForm.controls.monto.value);

    const efectivo = this.egresoForm.controls.efectivoEntregado.value;

    if(efectivo === null){
      cambioControl.setValue(null, {emitEvent: false});

      this.quitarErrorEfectivoInsuficiente();
      return;
    }

    const cambio = Number(efectivo) - monto;

    cambioControl.setValue(cambio, {emitEvent: false});

    this.validarEfectivoSuficiente(Number(efectivo), monto);

  }

  private validarEfectivoSuficiente(efectivo: number, monto: number): void{

    const control = this.egresoForm.controls.efectivoEntregado;

    const erroresActuales = control.errors ?? {};

    if(efectivo < monto) {
      control.setErrors({
        ...erroresActuales,
        efectivoInsuficiente: true
      });

      return;
    }

    this.quitarErrorEfectivoInsuficiente();

  }

  private quitarErrorEfectivoInsuficiente(): void{
    const control = this.egresoForm.controls.efectivoEntregado;

    if(!control.errors?.['efectivoInsuficiente']) return;

    const {efectivoInsuficiente, ...otrosErrores} = control.errors;

    control.setErrors(Object.keys(otrosErrores).length > 0 
      ? otrosErrores
      : null
    )
  }

/****************************************************************/  
/********************** ACTUALIZAR EGRESO ***********************/  
/****************************************************************/ 

  public actualizarEgreso(): void{
    if(this.egresoForm.invalid){
      this.egresoForm.markAllAsTouched();
      return;
    }

    if(this.ui.guardando || !this.egresoSeleccionado) return;

    const request = this.buildRequest();

    this.ui.guardando = true;
    this.ui.error = '';

    this.egresoService.actualizarEgreso(request, this.egresoSeleccionado.id)
      .pipe(takeUntilDestroyed(this.destroyRef),
      finalize(() => this.ui.guardando = false)
    )
    .subscribe({
      next: egreso => {
        this.handleSuccess(egreso);
      },
      error: error => {
        this.handleError(error)
      }
    });

  }

/****************************************************************/  
/*************************** BUILDER ****************************/  
/****************************************************************/ 

  private buildRequest(): ActualizarEgresoRequest{
    const form = this.egresoForm.getRawValue();

    return{
      nombre: form.nombre.trim() || null,
      motivo: form.motivo.trim(),
      justificacion: form.justificacion.trim() || null,
      formaPago: form.formaPago,
      monto: Number(form.monto),
      efectivoEntregado: this.esPagoEfectivo ? Number(form.efectivoEntregado) : null,
      cambio: this.esPagoEfectivo ? Number(form.cambio) : null,
    };
  }

/****************************************************************/  
/************************** HNADLERS ****************************/  
/****************************************************************/ 

  private handleSuccess(egreso: Egreso): void{
    this.egresoService.notificarEgresoCreado();
    this.egresoActualizado.emit(egreso);

  }

  private handleError(error: Error): void{

    console.error('Error al Actualizar el egreso: ', error);

    Swal.fire({
      title: 'Error al actualizar el egreso',
      text: error.message,
      icon: 'error'
    });
  }

/****************************************************************/  
/*********************** HELPERS EGRESO *************************/  
/****************************************************************/ 

  private noWhitespaceValidator(control: AbstractControl){
    const value = String(control.value ?? '');

    return value.trim().length === 0 ? { whitespace: true } : null;
  }

  public cerrarCaja(): void{
    if(this.ui.guardando) return;

    this.cancelar.emit();
  }

}
