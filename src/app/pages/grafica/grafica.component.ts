import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexStroke, ApexTitleSubtitle, ApexXAxis } from 'ng-apexcharts';
import { text } from 'stream/consumers';

export type ChartOptions ={
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  stroke: ApexStroke;
}

@Component({
  selector: 'app-grafica',
  templateUrl: './grafica.component.html',
  styles: ``
})
export class GraficaComponent implements OnInit, OnChanges {
  @Input() facturasEgreso: { [key:string]:number } = {}
  @Input() facturasIngreso: { [key:string]:number } = {}

  public facturasEgresoN: { [key:string]:number } = {}

  public chartOptions: Partial<ChartOptions> | any

  constructor(private cdr:ChangeDetectorRef){
    this.chartOptions={
      series:[],
      chart:{
        type: 'line',
        height: 350,
        toolbar:{
          show:false
        }
      },
      title: {
        text: ''
      },
      xaxis: {
        categories:[]
      },
      stroke:{
        curve: 'smooth'
      }
    };
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['facturasEgreso'] || changes['facturasIngreso'] ){
      this.facturasEgresoN = this.facturasEgreso
      this.actualizarGrafica();
    }

  }

  ngOnInit(): void {

    this.actualizarGrafica();
  }

  actualizarGrafica(){
    const categorias = Object.keys(this.facturasEgreso);
    const datosEgresos = Object.values(this.facturasEgreso);
    const datosIngresos = Object.values(this.facturasIngreso);

    console.log("valor Egreso:",datosEgresos)
    console.log("valor Ingreso:",datosIngresos)

    this.chartOptions.series = [
      {
        name: 'Egreso',
        data: datosEgresos
      },
      {
        name: 'Ingreso',
        data: datosIngresos
      }
    ];
    this.chartOptions.xaxis = {
      categories: categorias
    };

    this.cdr.detectChanges();
  }
}
