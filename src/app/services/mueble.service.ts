import { inject, Injectable } from "@angular/core";
import { map, Observable, Subject } from "rxjs";

import { SharedService } from "./shared.service";

import { MuebleDTO } from "../models/interface-models/muebleDTO.interface";
import { MuebleMapper } from "../mappers/mueble.mapper";
import { Mueble } from "../models/mueble.model";
import { ActualizarMuebleRequest } from "../models/request/actualizar-mueble.request";
import { CrearMuebleRequest } from "../models/request/crear-mueble.request";


@Injectable({
    providedIn: 'root'
})
export class MuebleService {

    private sharedServices = inject(SharedService);

    private endpoint = '/muebles';
    private muebleCreadoSourse = new Subject<void>();

    muebleCreado$ =  this.muebleCreadoSourse.asObservable();

    public notificarMuebleCreado(){
        this.muebleCreadoSourse.next();
    }

    public cargarMueble():Observable<Mueble[]>{
        return this.sharedServices.get<MuebleDTO>(this.endpoint)
            .pipe(
                map((dtos) => dtos.map(MuebleMapper.fromDTO))
            );
    }

    public buscarMueble(texto: string):Observable<Mueble[]>{
        return this.sharedServices.get<MuebleDTO>(`${this.endpoint}/buscar`,{texto: texto.trim()})
            .pipe(
                map((dtos) => dtos.map(MuebleMapper.fromDTO))
            );
    }

    public cargarMuebleById(id:number):Observable<Mueble>{
        return this.sharedServices.getById<MuebleDTO>(`${this.endpoint}/${id}`)
            .pipe(
                map(dto => MuebleMapper.fromDTO(dto))
            );
    }
    
    public crearMueble(request:CrearMuebleRequest):Observable<Mueble>{
        return this.sharedServices.post<MuebleDTO>(this.endpoint,request)
            .pipe(
                map(dto => MuebleMapper.fromDTO(dto))
            );
    }
    
    public actualizarMueble(request:ActualizarMuebleRequest, id:number):Observable<Mueble>{
        return this.sharedServices.put<MuebleDTO>(`${this.endpoint}/${id}`, request)
            .pipe(
                map(dto => MuebleMapper.fromDTO(dto))
            );
    }
    
    public eliminarMueble(id:number):Observable<Mueble>{
        return this.sharedServices.delete<MuebleDTO>(`${this.endpoint}/${id}`)
            .pipe(
                map(dto => MuebleMapper.fromDTO(dto))
            );
    }

    public buscarPorDiseno(disenoId: number): Observable<Mueble[]> {

        return this.sharedServices.get<MuebleDTO>(`/muebles/diseno/${disenoId}`)
            .pipe(
                map(dtos =>MuebleMapper.fromDTOList(dtos))
            );
    }   

    public cambiarEstado(id: number, activo: boolean): Observable<Mueble> {

        return this.sharedServices.patch<MuebleDTO>(`/muebles/${id}/estado?activo=${activo}`,{})
        .pipe(
            map(dto => MuebleMapper.fromDTO(dto))
        );
    }

}