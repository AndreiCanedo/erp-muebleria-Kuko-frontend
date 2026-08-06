import { inject, Injectable } from "@angular/core";
import { map, Observable, Subject } from "rxjs";

import { SharedService } from "./shared.service";

import { OrdenDetalleDTO } from "../models/interface-models/orden-detalleDTO.interface";
import { OrdenDetalleMapper } from "../mappers/orden-detalle.mapper";
import { OrdenDetalle } from "../models/orden-detalle.model";


@Injectable({
    providedIn: 'root'
})
export class OrdenDetalleService {

    private sharedServices = inject(SharedService);

    private endpoint = '/detalle';
    private ordenDetalleCreadoSourse = new Subject<void>();

    ordenDetalleCreado$ =  this.ordenDetalleCreadoSourse.asObservable();

    notificarDetalleCreado(){
        this.ordenDetalleCreadoSourse.next();
    }

    cargarDetalle():Observable<OrdenDetalle[]>{
        return this.sharedServices.get<OrdenDetalleDTO>(this.endpoint)
            .pipe(
                map((dtos) => dtos.map(OrdenDetalleMapper.fromDTO))
            );
    }

    cargarDetalleById(id:number):Observable<OrdenDetalle>{
        return this.sharedServices.getById<OrdenDetalleDTO>(`${this.endpoint}/${id}`)
            .pipe(
                map(dto => OrdenDetalleMapper.fromDTO(dto))
            );
    }
    
    crearDetalle(detalle:OrdenDetalle):Observable<OrdenDetalle>{
        return this.sharedServices.post<OrdenDetalleDTO>(this.endpoint, OrdenDetalleMapper.toDTO(detalle))
            .pipe(
                map(dto => OrdenDetalleMapper.fromDTO(dto))
            );
    }
    
    actualizarDetalle(detalle:OrdenDetalle, id:number):Observable<OrdenDetalle>{
        return this.sharedServices.put<OrdenDetalleDTO>(`${this.endpoint}/${id}`, OrdenDetalleMapper.toDTO(detalle))
            .pipe(
                map(dto => OrdenDetalleMapper.fromDTO(dto))
            );
    }
    
    eliminarDetalle(id:number):Observable<OrdenDetalle>{
        return this.sharedServices.delete<OrdenDetalleDTO>(`${this.endpoint}/${id}`)
            .pipe(
                map(dto => OrdenDetalleMapper.fromDTO(dto))
            );
    }

}