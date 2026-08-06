import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { CategoryScale, Chart, ChartConfiguration, ChartDataset, Filler, Legend, LineController, LineElement, LinearScale, PointElement, Tooltip} from 'chart.js';
import { DashboardFinanzaPuntoView } from '../../../models/interface-dashboard/dashboard-view.interface';

Chart.register(
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);


@Component({
  selector: 'app-grafica-finanzas',
  standalone: false,
  templateUrl: './grafica-finanzas.component.html',
  styleUrl: './grafica-finanzas.component.css',
})
export class GraficaFinanzasComponent implements AfterViewInit, OnChanges, OnDestroy{

  @Input() public puntos: DashboardFinanzaPuntoView[] = [];

  @ViewChild('graficaCanvas')
  private canvas?: ElementRef<HTMLCanvasElement>;

  private grafica: Chart<'line'> | null = null;

  private vistaInicializada = false;

  public ngAfterViewInit(): void {
    this.vistaInicializada = true;
    queueMicrotask(() => this.renderizarGrafica());
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!changes['puntos'] || !this.vistaInicializada) {
      return;
    }


    queueMicrotask(() => this.renderizarGrafica());
  }

  public ngOnDestroy(): void {
    this.destruirGrafica();
  }

  private renderizarGrafica(): void {
    const canvas = this.canvas?.nativeElement;

    if (!canvas || this.puntos.length === 0) {
      this.destruirGrafica();
      return;
    }

    this.destruirGrafica();

    const estilos = getComputedStyle(document.documentElement);

    const colorPrimary = estilos.getPropertyValue('--color-primary').trim() || '#2563eb';

    const colorSuccess = estilos.getPropertyValue('--color-success').trim() || '#16a34a';

    const colorDanger = estilos.getPropertyValue('--color-danger').trim() || '#dc2626';

    const colorText = estilos.getPropertyValue('--color-text').trim() || '#1f2937';

    const colorMuted = estilos.getPropertyValue('--color-text-muted').trim() || '#6b7280';

    const colorBorder = estilos.getPropertyValue('--color-border').trim() || '#e5e7eb';

    const configuracion: ChartConfiguration<'line'> = {
      type: 'line',

      data: {
        labels: this.puntos.map(punto => this.formatearFecha(punto.fecha)),

        datasets: this.construirDatasets(colorSuccess, colorDanger, colorPrimary)
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,

        animation: {
          duration: 250
        },

        normalized: true,

        interaction: {
          mode: 'index',
          intersect: false
        },

        plugins: {
          legend: {display: false},

          tooltip: {
            displayColors: true,

            callbacks: { 
              label: contexto => {
                const nombre = contexto.dataset.label ?? '';

                const valor =contexto.parsed.y ?? 0;

                return `${nombre}: ${this.formatearMoneda(valor)}`;
              }
            }
          }
        },

        elements: {
          line: {
            borderWidth: 2.2,
            tension: 0.3
          },

          point: {
            radius: this.puntos.length > 20 ? 1.5 : 3,
            hoverRadius: 5,
            borderWidth: 1.5
          }
        },

        scales: {
          x: {
            grid: {display: false},

            ticks: {
              color: colorMuted,
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 10
            },

            border: {
              color: colorBorder
            }
          },

          y: {
            beginAtZero: true,

            grid: {
              color: colorBorder
            },

            ticks: {
              color: colorMuted,

              callback: valor =>
                this.formatearCantidadCompacta(Number(valor))
            },

            border: {
              display: false
            }
          }
        }
      }
    };

    this.grafica = new Chart(canvas, configuracion);

    canvas.style.color = colorText;
  }

  private construirDatasets(
    colorSuccess: string,
    colorDanger: string,
    colorPrimary: string
  ): ChartDataset<'line'>[] {

    return [
      {
        label: 'Ingresos',
        data: this.puntos.map(punto => punto.ingresos),
        borderColor: colorSuccess,
        backgroundColor: colorSuccess,
        pointBackgroundColor: colorSuccess
      },
      {
        label: 'Egresos',
        data: this.puntos.map(punto => punto.egresos),
        borderColor: colorDanger,
        backgroundColor: colorDanger,
        pointBackgroundColor: colorDanger
      },
      {
        label: 'Balance',
        data: this.puntos.map(punto => punto.balance),
        borderColor: colorPrimary,
        backgroundColor: colorPrimary,
        pointBackgroundColor: colorPrimary,
        borderDash: [6, 4]
      }
    ];
  }

  private destruirGrafica(): void {
    this.grafica?.destroy();
    this.grafica = null;
  }

  private formatearFecha(fecha: Date): string {
    return new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short'}).format(fecha);
  }

  private formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN' }).format(valor);
  }

  private formatearCantidadCompacta(valor: number): string {
    return new Intl.NumberFormat('es-MX', { notation: 'compact', maximumFractionDigits: 1}).format(valor);
  }

}
