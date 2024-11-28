import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EgresoComponent } from './egreso/egreso.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GraficaComponent } from './grafica/grafica.component';
import { EgresoEditComponent } from './egreso/botones/egreso-edit/egreso-edit.component';
import { EgresoCrearComponent } from './egreso/botones/egreso-crear/egreso-crear.component';
import { BrowserModule } from '@angular/platform-browser';
import { EgresoEliminarComponent } from './egreso/botones/egreso-eliminar/egreso-eliminar.component';
import { TablaComponent } from './tabla/tabla.component';
import { ClienteComponent } from './cliente/cliente.component';
import { CrearComponent } from './cliente/crear/crear.component';
import { ActualizarClienteComponent } from './cliente/actualizar-cliente/actualizar-cliente.component';
import { FormClienteComponent } from './cliente/form-cliente/form-cliente.component';



@NgModule({
  declarations: [
    DashboardComponent,
    GraficaComponent,
    EgresoComponent,
    EgresoEditComponent,
    EgresoCrearComponent,
    EgresoEliminarComponent,
    TablaComponent,
    ClienteComponent,
    CrearComponent,
    ActualizarClienteComponent,
    FormClienteComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    NgApexchartsModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PagesModule { }
