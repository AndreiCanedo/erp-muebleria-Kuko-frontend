import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { EgresoService } from '../../../../services/egreso.service';
import { Egreso } from '../../../../models/egreso.model';
import { EstadoEgreso } from '../../../../models/estado-egreso.enum';
import { error } from 'console';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-detalle-egreso',
  standalone: false,
  templateUrl: './detalle-egreso.component.html',
  styleUrl: './detalle-egreso.component.css',
})
export class DetalleEgresoComponent implements OnInit{

  private readonly egresoService = inject(EgresoService);
  private readonly destroyRef = inject(DestroyRef);

  @Input() public egresoId!: number;

  @Output() public cancelar = new EventEmitter<void>();

  public egreso: Egreso | null = null;

  public readonly estadoEgreso = EstadoEgreso;

  public ui = {
    cargando: false,
    error: ''
  };

  ngOnInit(): void {
      if(this.egresoId){
        this.cargarEgreso(this.egresoId);
      }
  }

  public cargarEgreso(id:number): void{
    this.ui.cargando = true;
    this.ui.error = '';
    this.egreso = null;

    this.egresoService.cargarEgresoById(id)
      .pipe(takeUntilDestroyed(this.destroyRef),
      finalize(() => this.ui.cargando = false)
    )
    .subscribe({
      next: egreso => {
        this.egreso = egreso;
      },
      error: error => {
        console.error('Error al cargar el detalle de egreso', error);

        this.ui.error = 'No fue posible cargar el detalle del egreso'
      }
    });

  }

  public reintentar(): void {
    if(!this.egresoId) return;

    this.cargarEgreso(this.egresoId);
  }

  public cerrar():void{
    this.cancelar.emit();
  }

}
