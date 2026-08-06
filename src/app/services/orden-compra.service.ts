import { inject, Injectable } from "@angular/core";
import { forkJoin, map, Observable, Subject, switchMap } from "rxjs";

import { SharedService } from "./shared.service";
import { ClienteService } from "./cliente.service";
import { PagoOrdenService } from "./pago-orden.service";

import { OrdenCompra } from "../models/orden-compra.model";
import { OrdenCompraDTO } from "../models/interface-models/orden-compraDTO.interface";
import { OrdenCompraMapper } from "../mappers/orden-compra.mappers";
import { CrearOrdenCompraRequest } from "../models/request/crear-orden-compra.request";
import { ActualizarOrdenCompraRequest } from "../models/request/actualizar-orden-compra.request";
import { CancelarOrdenCompraRequest } from "../models/request/cancelar-orden-compra.request";
import { OrdenResumenView } from "../models/interface-models/orden-resumen-view.interface";
import { OrdenResumenMapper } from "../mappers/orden-resumen.mapper";
import { OrdenInfoView } from "../models/interface-models/orden-info-view.interface";
import { OrdenDetalleMapper } from "../mappers/orden-detalle.mapper";
import { PagoOrdenViewMapper } from "../mappers/pago-orden-view.mapper";
import { OrdenInfoMapper } from "../mappers/orden-info.mapper";
import { MuebleService } from "./mueble.service";

@Injectable({
    providedIn: 'root'
})

export class OrdenCompraServices{

    private sharedServices = inject(SharedService);
    private clienteService = inject(ClienteService);
    private muebleService = inject(MuebleService)
    private pagoOrdenService = inject(PagoOrdenService);

    private readonly endpoint = "/ordenes";
    private ordenCompraCreadaSource = new Subject<void>();

    ordenCompraCreada$ = this.ordenCompraCreadaSource.asObservable();

    notificarOrdenCompraCreada(){
        this.ordenCompraCreadaSource.next();
    }

    cargarOrdenCompra(): Observable<OrdenCompra[]>{
        return this.sharedServices.get<OrdenCompraDTO>(this.endpoint)
            .pipe(
                map((dtos) => dtos.map(OrdenCompraMapper.fromDTO))
            );
    }

    cargarOrdenCompraById(id: number): Observable<OrdenCompra>{
        return this.sharedServices.getById<OrdenCompraDTO>(`${this.endpoint}/${id}`)
            .pipe(
                map((dto) => OrdenCompraMapper.fromDTO(dto))
            );
    }

    obtenerResumenOrdenes(): Observable<OrdenResumenView[]>{
        return forkJoin({
            ordenes: this.cargarOrdenCompra(),
            clientes: this.clienteService.cargarCliente()
        }).pipe(
            map(({ordenes, clientes}) => {
                
                const clientesMap = new Map(
                    clientes.map(cliente => [cliente.id, cliente])
                );

                return ordenes.map(orden =>
                    OrdenResumenMapper.fromOrden(orden, clientesMap.get(orden.clienteId) ?? null)
                );
            })
        );
    }

    //Con el forkJoin me permite hacer 3 peticiones para no sobre cargar la pagina y hacerlo con un
    //solo servicio
    obtenerInfoOrden(id:number): Observable<OrdenInfoView>{
        return this.cargarOrdenCompraById(id)
            .pipe(
                switchMap(orden => {

                    return forkJoin({
                        cliente: this.clienteService.cargarClienteById(orden.clienteId),

                        pagos: this.pagoOrdenService.cargarPagosPorOrden(orden.id),

                        muebles: this.muebleService.cargarMueble()
                    })
                    .pipe(
                        map(({ cliente, pagos, muebles}) => {
                            const mueblesMap = new Map(muebles.map(mueble => [mueble.id, mueble]))

                            const detalles = orden.detalles.map(detalle => OrdenDetalleMapper.toView(detalle, mueblesMap.get(detalle.muebleId) ?? null));

                            const pagosView = pagos.map(pago => PagoOrdenViewMapper.fromModel(pago));

                            return OrdenInfoMapper.fromData(
                                orden,
                                cliente,
                                detalles,
                                pagosView
                            );
                        })
                    );

                })
            );
    }

    cargarOrdenesPorCliente(clienteId:number): Observable<OrdenCompra[]>{
        return this.cargarOrdenCompra().pipe(
            map(ordenes => 
                ordenes.filter(orden => orden.clienteId === clienteId)
            )
        );
    }

    public obtenerResumenOrdenesPorCliente(clienteId: number): Observable<OrdenResumenView[]>{
        return forkJoin({
            ordenes: this.cargarOrdenCompra(),
            cliente: this.clienteService.cargarClienteById(clienteId)
        }).pipe(
            map(({ ordenes, cliente }) => 
                ordenes.filter(orden => orden.clienteId === clienteId)
                    .map(orden => OrdenResumenMapper.fromOrden(orden, cliente))
            )
        )
    }

    crearOrdenCompra(request: CrearOrdenCompraRequest): Observable<OrdenCompra>{
        return this.sharedServices.post<OrdenCompraDTO>(this.endpoint, request)
            .pipe(
                map(dto => OrdenCompraMapper.fromDTO(dto))
            );
    }

    actualizarOrdenCompra(request: ActualizarOrdenCompraRequest, id:number): Observable<OrdenCompra>{
        return this.sharedServices.put<OrdenCompraDTO>(`${this.endpoint}/${id}`, request)
            .pipe(
                map(dto => OrdenCompraMapper.fromDTO(dto))
            );
    }

    confirmarOrdenCompra(id:number): Observable<OrdenCompra>{
        return this.sharedServices.patch<OrdenCompraDTO>(`${this.endpoint}/${id}/confirmar`,{})
            .pipe(
                map(dto => OrdenCompraMapper.fromDTO(dto))
            );
    }

    cancelarOrdenCompra(id:number, request: CancelarOrdenCompraRequest): Observable<OrdenCompra>{
        return this.sharedServices.patch<OrdenCompraDTO>(`${this.endpoint}/${id}/cancelar`,request)
            .pipe(
                map(dto => OrdenCompraMapper.fromDTO(dto))
            );
    }

    eliminarOrdenCompra(id:number): Observable<OrdenCompra>{
        return this.sharedServices.delete<OrdenCompraDTO>(`${this.endpoint}/${id}`)
            .pipe(
                map(dto => OrdenCompraMapper.fromDTO(dto))
            );
    }

}