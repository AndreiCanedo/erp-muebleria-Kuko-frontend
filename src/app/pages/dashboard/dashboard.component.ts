import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardView } from '../../models/interface-dashboard/dashboard-view.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
    standalone: false
})
export class DashboardComponent implements OnInit{
  
  private readonly dashboardService = inject(DashboardService);
  private readonly destroyRef = inject(DestroyRef);

  public dashboard: DashboardView | null = null;

  public fechaInicio = '';
  public fechaFin = '';

  public periodoSeleccionado:
  'HOY' | 'SEMANA' | 'MES' | 'PERSONALIZADO' = 'MES';

  public ui = {
    cargando: false,
    error: ''
  };

  public ngOnInit(): void {
    this.establecerPeriodoMesActual();
    this.cargarDashboard();
  }
  /*************************************************************/
  /*********************** CARGAR DASHBOARD ********************/
  /*************************************************************/
  public cargarDashboard(): void {

    const inicio = this.convertirFechaInput(this.fechaInicio);
    const fin = this.convertirFechaInput(this.fechaFin);

    
    if (!inicio || !fin) {
      this.ui.error = 'Selecciona un periodo válido';
      return;
    }
    
    if (inicio.getTime() > fin.getTime()) {
      this.ui.error ='La fecha de inicio no puede ser posterior a la fecha final';return;
    }

    this.ui.cargando = true;
    this.ui.error = '';

    this.dashboardService.obtenerDashboard(inicio, fin)
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => this.ui.cargando = false)
      )
      .subscribe({
        next: dashboard => {
          this.dashboard = dashboard;
        },
        error: error => {
          console.error('Error al cargar el dashboard:', error);

          this.dashboard = null;
          this.ui.error = 'No fue posible cargar la información del dashboard';
        }
      });
  }

  /********************************************************************/
  /*********************** CONVERCIONES DE FECHA **********************/
  /********************************************************************/

  private establecerPeriodoMesActual(): void {
    const hoy = new Date();

    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    this.fechaInicio = this.formatearFechaInput(inicioMes);

    this.fechaFin = this.formatearFechaInput(hoy);
  }

  private convertirFechaInput(fecha: string): Date | null {

    if (!fecha) return null;

    const [year, month, day] = fecha.split('-').map(Number);

    return new Date( year, month - 1, day);
  }

  private formatearFechaInput(fecha: Date): string {

    const year = fecha.getFullYear();

    const month = String(fecha.getMonth() + 1).padStart(2, '0');

    const day = String(fecha.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  /********************************************************************/
  /*********************** SELECCION DE FECHA *************************/
  /********************************************************************/

  public seleccionarPeriodo( periodo: 'HOY' | 'SEMANA' | 'MES'): void {

    this.periodoSeleccionado = periodo;

    const hoy = new Date();

    let inicio: Date;

    switch (periodo) {

      case 'HOY':
        inicio = new Date(hoy);
        break;

      case 'SEMANA':
        inicio = this.obtenerInicioSemana(hoy);
        break;

      case 'MES':
        inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        break;
    }

    this.fechaInicio = this.formatearFechaInput(inicio);
    this.fechaFin = this.formatearFechaInput(hoy);

    this.cargarDashboard();
  }

  public usarPeriodoPersonalizado(): void {
    this.periodoSeleccionado = 'PERSONALIZADO';
  }

  private obtenerInicioSemana(fecha: Date): Date {
    
    const inicio = new Date(fecha);
    const diaSemana = inicio.getDay();
    const diferencia = diaSemana === 0 ? -6 : 1 - diaSemana;

    inicio.setDate(inicio.getDate() + diferencia);

    return inicio;
  }
}
