import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { EgresoComponent } from './egreso/egreso.component';
import { ClienteComponent } from './cliente/cliente.component';


const routes: Routes = [
  {path:'dashboard',component:PagesComponent,children:[
    {path:'', component:DashboardComponent},
    {path:'egreso', component:EgresoComponent},
    {path:'cliente', component:ClienteComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }