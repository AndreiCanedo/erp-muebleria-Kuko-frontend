import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GraficaComponent } from './grafica/grafica.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { EgresoComponent } from './egreso/egreso.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    DashboardComponent,
    GraficaComponent,
    EgresoComponent
  ],
  imports: [
    CommonModule,
    NgApexchartsModule,
    FormsModule
  ]
})
export class PagesModule { }
