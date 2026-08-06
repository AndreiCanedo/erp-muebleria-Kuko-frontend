import { inject, Injectable } from "@angular/core";
import { map, Observable, Subject } from "rxjs";

import { SharedService } from "./shared.service";

import { MuebleDTO } from "../models/interface-models/muebleDTO.interface";
import { MuebleMapper } from "../mappers/mueble.mapper";
import { Mueble } from "../models/mueble.model";


@Injectable({
    providedIn: 'root'
})
export class MuebleService {

    private sharedServices = inject(SharedService);

    private endpoint = '/muebles';
    private muebleCreadoSourse = new Subject<void>();

    muebleCreado$ =  this.muebleCreadoSourse.asObservable();

    notificarMuebleCreado(){
        this.muebleCreadoSourse.next();
    }

    cargarMueble():Observable<Mueble[]>{
        return this.sharedServices.get<MuebleDTO>(this.endpoint)
            .pipe(
                map((dtos) => dtos.map(MuebleMapper.fromDTO))
            );
    }

    buscarMueble(texto: string):Observable<Mueble[]>{
        return this.sharedServices.get<MuebleDTO>(`${this.endpoint}/buscar`,{texto: texto.trim()})
            .pipe(
                map((dtos) => dtos.map(MuebleMapper.fromDTO))
            );
    }

    cargarMuebleById(id:number):Observable<Mueble>{
        return this.sharedServices.getById<MuebleDTO>(`${this.endpoint}/${id}`)
            .pipe(
                map(dto => MuebleMapper.fromDTO(dto))
            );
    }
    
    crearMueble(mueble:Mueble):Observable<Mueble>{
        return this.sharedServices.post<MuebleDTO>(this.endpoint, MuebleMapper.toDTO(mueble))
            .pipe(
                map(dto => MuebleMapper.fromDTO(dto))
            );
    }
    
    actualizarMueble(mueble:Mueble, id:number):Observable<Mueble>{
        return this.sharedServices.put<MuebleDTO>(`${this.endpoint}/${id}`, MuebleMapper.toDTO(mueble))
            .pipe(
                map(dto => MuebleMapper.fromDTO(dto))
            );
    }
    
    eliminarMueble(id:number):Observable<Mueble>{
        return this.sharedServices.delete<MuebleDTO>(`${this.endpoint}/${id}`)
            .pipe(
                map(dto => MuebleMapper.fromDTO(dto))
            );
    }

}