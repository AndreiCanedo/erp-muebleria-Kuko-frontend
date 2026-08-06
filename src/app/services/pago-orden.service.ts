
import { inject, Injectable } from '@angular/core';
import { map, Observable, Subject} from 'rxjs';

import { SharedService } from './shared.service';
import { PagoOrden } from '../models/pago-orden.model';
import { PagoOrdenDTO } from '../models/interface-models/pago-ordenDTO.interface';
import { PagoOrdenMapper } from '../mappers/pago-orden.mapper';
import { CrearPagoOrdenRequest } from '../models/request/crear-pago-orden.request';
import { ActualizarPagoOrdenRequest } from '../models/request/actualizar-pago-orden.request';
import { CancelarPagoOrdenRequest } from '../models/request/cancelar-pago-orden.request';



@Injectable({
    providedIn: 'root'
})
export class PagoOrdenService {

    private sharedServices = inject(SharedService)

    private endpoint = '/pagos-orden';
    private pagoOrdenCreadoSource = new Subject<void>();

    pagoOrdenCreado$ =  this.pagoOrdenCreadoSource.asObservable();

    notificarPagoOrdenCreado(){
        this.pagoOrdenCreadoSource.next();
    }

    cargarPagoOrden():Observable<PagoOrden[]>{
        return this.sharedServices.get<PagoOrdenDTO>(this.endpoint)
        .pipe(
            map((dtos) => dtos.map(PagoOrdenMapper.fromDTO))
        );
    }

    cargarPagoOrdenById(id:number):Observable<PagoOrden>{
        return this.sharedServices.getById<PagoOrdenDTO>(`${this.endpoint}/${id}`)
        .pipe(
            map(dto => PagoOrdenMapper.fromDTO(dto))
        );
    }

    cargarPagosPorOrden(ordenId: number): Observable<PagoOrden[]>{
        return this.sharedServices.get<PagoOrdenDTO>(`${this.endpoint}/orden/${ordenId}`)
        .pipe(
            map(dtos => dtos.map(dto => PagoOrdenMapper.fromDTO(dto)))
        );
    }

    crearPagoOrden(request: CrearPagoOrdenRequest):Observable<PagoOrden>{
        return this.sharedServices.post<PagoOrdenDTO>(this.endpoint, request)
        .pipe(
            map(dto => PagoOrdenMapper.fromDTO(dto))
        );
    }

    actualizarPagoOrden(request:ActualizarPagoOrdenRequest, id:number):Observable<PagoOrden>{
        return this.sharedServices.put<PagoOrdenDTO>(`${this.endpoint}/${id}/datos`, request)
        .pipe(
            map(dto => PagoOrdenMapper.fromDTO(dto))
        );
    }

    cancelarPagoOrden(id:number, request:CancelarPagoOrdenRequest):Observable<PagoOrden>{
        return this.sharedServices.deleteWithBody<PagoOrdenDTO>(`${this.endpoint}/${id}/cancelar`,request)
        .pipe(
            map(dto => PagoOrdenMapper.fromDTO(dto))
        );
    }

}