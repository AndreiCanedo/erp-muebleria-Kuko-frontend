import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EgresoComponent } from './egreso/egreso.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GraficaComponent } from './grafica/grafica.component';
import { EgresoEditComponent } from './egreso/botones/egreso-edit/egreso-edit.component';
import { EgresoCrearComponent } from './egreso/botones/egreso-crear/egreso-crear.component';
import { TablaComponent } from './tabla/tabla-lectura/tabla.component';
import { ClienteComponent } from './cliente/cliente.component';
import { CrearComponent } from './cliente/crear/crear.component';
import { ActualizarClienteComponent } from './cliente/actualizar-cliente/actualizar-cliente.component';
import { FormClienteComponent } from './cliente/form-cliente/form-cliente.component';
import { InfoClienteComponent } from './cliente/info-cliente/info-cliente.component';
import { PresupuestoComponent } from './presupuesto/presupuesto.component';
import { SeleccionarClienteComponent } from './cliente/seleccionar-cliente/seleccionar-cliente.component';
import { TablaOrdenDetalleComponent } from './tabla/tabla-orden-detalle/tabla-orden-detalle.component';
import { MuebleComponent } from './mueble/mueble.component';
import { CrearMuebleComponent } from './mueble/crear-mueble/crear-mueble.component';
import { FormMuebleComponent } from './mueble/form-mueble/form-mueble.component';
import { ActualizarMuebleComponent } from './mueble/actualizar-mueble/actualizar-mueble.component';
import { ListadoOrdenesComponent } from './listado-ordenes/listado-ordenes.component';
import { TablaOrdenesComponent } from './tabla/tabla-ordenes/tabla-ordenes.component';
import { DetalleOrdenComponent } from './listado-ordenes/detalle-orden/detalle-orden.component';
import { TablaPagosOrdenComponent } from './tabla/tabla-pagos-orden/tabla-pagos-orden.component';
import { SeleccionarMuebleComponent } from './mueble/seleccionar-mueble/seleccionar-mueble.component';
import { ListadoPagosOrdenComponent } from './listado-pagos-orden/listado-pagos-orden.component';
import { DetallePagoOrdenComponent } from './listado-pagos-orden/detalle-pago-orden/detalle-pago-orden.component';
import { FormularioEditarPagoComponent } from './listado-pagos-orden/formulario-editar-pago/formulario-editar-pago.component';
import { FormularioEditarOrdenComponent } from './listado-ordenes/formulario-editar-orden/formulario-editar-orden.component';
import { TablaEgresosComponent } from './tabla/tabla-egresos/tabla-egresos.component';
import { FormularioEgresoComponent } from './egreso/formulario-egreso/formulario-egreso.component';
import { DetalleEgresoComponent } from './egreso/botones/detalle-egreso/detalle-egreso.component';
import { CancelarEgresoComponent } from './egreso/botones/cancelar-egreso/cancelar-egreso.component';

import { FormaPagoPipe } from '../pipe/forma-pago.pipe';
import { MoneyPipe } from '../pipe/money.pipe';
import { SharedModule } from "../shared/shared.module";
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages.routing';
import { RegistrarPagoOrdenComponent } from './listado-pagos-orden/registrar-pago-orden/registrar-pago-orden.component';



@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    GraficaComponent,

    EgresoComponent,
    EgresoEditComponent,
    EgresoCrearComponent,
    TablaEgresosComponent,
    FormularioEgresoComponent,
    DetalleEgresoComponent,
    CancelarEgresoComponent,

    TablaComponent,
    TablaOrdenDetalleComponent,

    ClienteComponent,
    CrearComponent,
    ActualizarClienteComponent,
    FormClienteComponent,
    InfoClienteComponent,
    SeleccionarClienteComponent,
    
    MuebleComponent,
    CrearMuebleComponent,
    ActualizarMuebleComponent,
    FormMuebleComponent,
    SeleccionarMuebleComponent,

    ListadoOrdenesComponent,
    PresupuestoComponent,
    TablaOrdenesComponent,
    DetalleOrdenComponent,
    FormularioEditarOrdenComponent,

    TablaPagosOrdenComponent,
    ListadoPagosOrdenComponent,
    DetallePagoOrdenComponent,
    FormularioEditarPagoComponent,
    RegistrarPagoOrdenComponent,
    
    
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MoneyPipe,
    FormaPagoPipe,
    SharedModule
]
})
export class PagesModule { }
