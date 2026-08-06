import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { EgresoComponent } from './egreso/egreso.component';
import { ClienteComponent } from './cliente/cliente.component';
import { PresupuestoComponent } from './presupuesto/presupuesto.component';
import { MuebleComponent } from './mueble/mueble.component';
import { ListadoOrdenesComponent } from './listado-ordenes/listado-ordenes.component';
import { ListadoPagosOrdenComponent } from './listado-pagos-orden/listado-pagos-orden.component';


const routes: Routes = [
  {path:'',component:PagesComponent,children:[
    {path:'dashboard',component:DashboardComponent},
    {path:'clientes', component:ClienteComponent},
    {path:'muebles', component:MuebleComponent},
    {path:'ordenes', component:ListadoOrdenesComponent},
    {path: 'presupuesto', component: PresupuestoComponent},
    {path: 'pagos', component: ListadoPagosOrdenComponent},
    {path:'egresos', component:EgresoComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }