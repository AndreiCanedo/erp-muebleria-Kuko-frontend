import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { EgresoComponent } from './egreso/egreso.component';


const routes: Routes = [
  {path:'dashboard',component:PagesComponent,children:[
    {path:'', component:DashboardComponent},
    {path:'egreso', component:EgresoComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }