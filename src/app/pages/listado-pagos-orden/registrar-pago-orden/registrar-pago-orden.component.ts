import { Component, DestroyRef, EventEmitter, inject, Output } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { PagoOrdenService } from '../../../services/pago-orden.service';
import { OrdenCompraServices } from '../../../services/orden-compra.service';
import { OrdenResumenView } from '../../../models/interface-models/orden-resumen-view.interface';
import { OrdenInfoView } from '../../../models/interface-models/orden-info-view.interface';
import { FormaPago } from '../../../models/forma-pago.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { CrearPagoOrdenRequest } from '../../../models/request/crear-pago-orden.request';

@Component({
  selector: 'app-registrar-pago-orden',
  standalone: false,
  templateUrl: './registrar-pago-orden.component.html',
  styleUrl: './registrar-pago-orden.component.css',
})
export class RegistrarPagoOrdenComponent {
  
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly pagoOrdenService = inject(PagoOrdenService);
  private readonly ordenService = inject(OrdenCompraServices);
  private readonly destroyRef = inject(DestroyRef);

  @Output() public cancelar = new EventEmitter<void>();
  @Output() public pagoRegistrado = new EventEmitter<void>();

  public ordenes: OrdenResumenView[] = [];
  public ordenSeleccionada: OrdenInfoView | null = null;

  public readonly formaPagoEnum = FormaPago;

  public ui = {
    cargandoOrdenes: false,
    cargandoDetalle: false,
    guardando: false,
    error: ''
  }

  public formulario = this.fb.group({
    ordenId: [0, [Validators.required, Validators.min(1)]],
    monto: [0, [Validators.required, Validators.min(0.01)]],
    formaPago: [FormaPago.EFECTIVO, Validators.required],
    referencia: [''],
    observaciones: ['']
  });

  public ngOnInit(): void{
    this.cargarOrdenes();

    this.formulario.controls.ordenId.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(ordenId => {
        this.seleccionarOrden(ordenId);
      });
  }

  /********************************************************/
  /******************* CARGAR ORDENES *********************/
  /********************************************************/

  private cargarOrdenes(): void{
    this.ui.cargandoOrdenes = true;
    this.ui.error = '';

    this.ordenService.obtenerResumenOrdenes()
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => this.ui.cargandoOrdenes = false)
      )
      .subscribe({
        next: ordenes => {
          this.ordenes = ordenes.filter(orden => 
            orden.estadoOrden === 'CONFIRMADA' && orden.estadoPago !== 'PAGADA'
          )
        },
        error: error => {
          console.error('Error al cargar ordenes: ', error);

          this.ui.error = 'No fue posible cargar las ordenes disponibles'
        }
      });

  }

  /********************************************************/
  /**************** SELECCIONAR ORDENES *******************/
  /********************************************************/

  public seleccionarOrden(ordenId: number): void{
    if(!ordenId){
      this.ordenSeleccionada = null;
      return;
    }

    this.ui.cargandoDetalle = true;
    this.ui.error = '';
    this.ordenSeleccionada = null;

    this.ordenService.obtenerInfoOrden(ordenId)
      .pipe(takeUntilDestroyed(this.destroyRef),
      finalize(() => this.ui.cargandoDetalle = false)
    )
    .subscribe({
      next: orden => {
        this.ordenSeleccionada = orden;

        this.formulario.controls.monto.setValue(Number(orden.saldoPendiente));
      },
      error: error => {
        console.error('Error al cargar la orden: ', error);
        this.ui.error = 'No fue posible cargar la informacion de la orden'
      }
    });

  }

  /********************************************************/
  /******************* CARGAR PAGO ORDEN ******************/
  /********************************************************/

  public guardar(): void{

    if(this.formulario.invalid || this.ui.guardando){
      this.formulario.markAllAsTouched();
      return;
    }

    if(!this.ordenSeleccionada){
      this.ui.error = 'Debes seleccionar orden';
      return;
    }

    const form = this.formulario.getRawValue();

    if(form.monto > Number(this.ordenSeleccionada.saldoPendiente)){
      this.ui.error = 'El monto no puede superar el saldo pendiente';
      return;
    }

    const request: CrearPagoOrdenRequest = {
      ordenId: form.ordenId,
      monto: form.monto,
      formaPago: form.formaPago,
      referencia: form.referencia.trim() || null,
      observaciones: form.observaciones.trim() || null
    };

    this.ui.guardando = true;
    this.ui.error = '';

    this.pagoOrdenService.crearPagoOrden(request)
      .pipe(takeUntilDestroyed(this.destroyRef),
      finalize(() => this.ui.guardando = false)  
    )
    .subscribe({
      next: () => {
        this.pagoOrdenService.notificarPagoOrdenCreado();
        this.pagoRegistrado.emit();
      },
      error: error => {
        console.error('Error al registrar el pago: ', error);

        this.ui.error = 'No fue posible registrar el pago';
      }
    });

  }

  /********************************************************/
  /*********************** HELPERS ************************/
  /********************************************************/

  public cerrar(): void{
    if(this.ui.guardando) return;

    this.cancelar.emit();
  }

  public get saldoPendiente(): number{
    return Number(this.ordenSeleccionada?.saldoPendiente ?? 0);
  }



}
