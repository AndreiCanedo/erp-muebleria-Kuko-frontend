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
import { authGuard } from '../guards/auth.guard';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { roleGuard } from '../guards/role.guard';
import { Role } from '../models/role.enum';


const routes: Routes = [
  {path:'',component:PagesComponent,
    canActivate: [authGuard], 
    canActivateChild: [authGuard], 
    children:[
      { path:'dashboard',component:DashboardComponent, canActivate: [roleGuard], data: {roles: [Role.ADMIN]} },
      { path:'clientes', component:ClienteComponent, canActivate: [roleGuard], data: {roles: [Role.ADMIN, Role.VENDEDOR]} },
      { path:'muebles', component:MuebleComponent, canActivate: [roleGuard], data: {roles: [Role.ADMIN, Role.VENDEDOR]} },
      { path:'catalogo', component:CatalogoComponent, canActivate: [roleGuard], data: {roles: [Role.ADMIN, Role.VENDEDOR, Role.USER]} },
      { path:'ordenes', component:ListadoOrdenesComponent, canActivate: [roleGuard], data: {roles: [Role.ADMIN]} },
      { path: 'presupuesto', component: PresupuestoComponent, canActivate: [roleGuard], data: {roles: [Role.ADMIN, Role.VENDEDOR]} },
      { path: 'pagos', component: ListadoPagosOrdenComponent, canActivate: [roleGuard], data: {roles: [Role.ADMIN]} },
      { path:'egresos', component:EgresoComponent, canActivate: [roleGuard], data: {roles: [Role.ADMIN]} },
      { path:'usuarios', component:UsuariosComponent, canActivate: [roleGuard], data: {roles: [Role.ADMIN]} },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }