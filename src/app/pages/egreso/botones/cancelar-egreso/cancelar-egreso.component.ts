import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { EgresoService } from '../../../../services/egreso.service';
import { Egreso } from '../../../../models/egreso.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { EstadoEgreso } from '../../../../models/estado-egreso.enum';
import { error } from 'console';
import { CancelarEgresoRequest } from '../../../../models/request/cancelar-egreso.request';
import Swal from 'sweetalert2';

type CancelarEgresoForm = FormGroup<{
  motivo: FormControl<string>;
}>;

@Component({
  selector: 'app-cancelar-egreso',
  standalone: false,
  templateUrl: './cancelar-egreso.component.html',
  styleUrl: './cancelar-egreso.component.css',
})
export class CancelarEgresoComponent implements OnInit{

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly egresoService = inject(EgresoService);
  private readonly destroyRf= inject(DestroyRef);

  @Input() public egresoId!: number;

  @Output() public cancelar = new EventEmitter<void>();
  @Output() public egresoCancelado = new EventEmitter<Egreso>();

  public egreso: Egreso | null = null;
  public cancelarForm!: CancelarEgresoForm;

  public ui = {
    cargando: false,
    cancelando: false,
    error: ''
  }

  ngOnInit(): void {
      this.initForm();

      if(this.egresoId){
        this.cargarEgreso(this.egresoId);
      }
  }

  /*****************************************************/
  /********************** FORM *************************/
  /*****************************************************/

  private initForm(): void{
    this.cancelarForm = this.fb.group({
      motivo: ['', [Validators.required,Validators.minLength(3)]]
    });
  }

  /*****************************************************/
  /******************* CARGAR EGRESO *******************/
  /*****************************************************/

  private cargarEgreso(id: number): void{
    this.ui.cargando = true;
    this.ui.error = '';
    this.egreso = null;

    this.egresoService.cargarEgresoById(id)
      .pipe(takeUntilDestroyed(this.destroyRf),
      finalize(() => this.ui.cargando = false)  
    )
    .subscribe({
      next: egreso => {
        if(egreso.estado === EstadoEgreso.CANCELADO){
          this.ui.error = 'Este egreso ya se encuentra cancelado';
          return;
        }

        this.egreso = egreso;
      },
      error: error => {
        console.error('Error al cargar el egreso: ',error);
        this.ui.error = 'No fue posible cargar el egreso';
      }
    });

  }

  /*****************************************************/
  /****************** CANCELAR EGRESO ******************/
  /*****************************************************/

  public confirmarCancelacion(): void{
    if(this.cancelarForm.invalid){
      this.cancelarForm.markAllAsTouched();
      return;
    }

    if(!this.egreso || this.ui.cancelando) return;

    const request = this.buildRequest();

    this.ui.cancelando = true;

    this.egresoService.cancelarEgreso(request,this.egreso.id)
      .pipe(takeUntilDestroyed(this.destroyRf),
      finalize(() => this.ui.cancelando = false)
    )
    .subscribe({
      next: egreso => {
        this.handleSuccess(egreso);
      },
      error: error => {
        this.handleError(error);
      }
    });
  }

  /*****************************************************/
  /********************** BUILDER **********************/
  /*****************************************************/

  private buildRequest(): CancelarEgresoRequest {
    const form = this.cancelarForm.getRawValue();
    return {
      motivo: form.motivo.trim()
    };
  }

  /*****************************************************/
  /********************** HANDLERS *********************/
  /*****************************************************/

  private handleSuccess(egreso:Egreso): void{
    this.egresoService.notificarEgresoCreado();

    this.egresoCancelado.emit(egreso);

    //this.resetForm();
  }
  
  private handleError(error:Error): void{
    console.error('Error al cancelar el egreso: ', error);

    this.ui.error = 'Error al cancelar el egreso';
  }

  /*****************************************************/
  /********************** HELPERS **********************/
  /*****************************************************/

  public cerrarCaja(): void{
    if(this.ui.cancelando) return;

    this.cancelar.emit();
  }

  public reintentar(): void{
    if(!this.egresoId) return;

    this.cargarEgreso(this.egresoId);
  }

  public get motivoInvalido(): boolean{
    const control = this.cancelarForm.controls.motivo;

    return control.touched && control.invalid;
  }

}
