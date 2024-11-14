import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EgresoComponent } from './egreso/egreso.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GraficaComponent } from './grafica/grafica.component';



@NgModule({
  declarations: [
    DashboardComponent,
    GraficaComponent,
    EgresoComponent
  ],
  imports: [
    CommonModule,
    NgApexchartsModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PagesModule { }
