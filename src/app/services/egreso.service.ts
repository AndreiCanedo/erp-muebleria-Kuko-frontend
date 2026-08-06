import { inject, Injectable } from '@angular/core';
import { map, Observable, Subject} from 'rxjs';

import { SharedService } from './shared.service';

import { Egreso } from '../models/egreso.model';
import { EgresoDTO } from '../models/interface-models/egresoDTO.interface';
import { EgresoMapper } from '../mappers/egreso.mapper';
import { CrearEgresoRequest } from '../models/request/crear-egreso.request';
import { ActualizarEgresoRequest } from '../models/request/actualizar-egreso.request';
import { CancelarEgresoRequest } from '../models/request/cancelar-egreso.request';

@Injectable({
  providedIn: 'root'
})
export class EgresoService {

  private sharedServices = inject(SharedService)

  private endpoint = '/egresos';
  private egresoCreadoSource = new Subject<void>();

  egresoCreado$ = this.egresoCreadoSource.asObservable();
  
  notificarEgresoCreado(){
    this.egresoCreadoSource.next();
  }

  cargarEgresos():Observable<Egreso[]>{
    return this.sharedServices.get<EgresoDTO>(this.endpoint)
      .pipe(
        map((dtos) => dtos.map(EgresoMapper.fromDTO))
      );
  }

  cargarEgresoById(id:number):Observable<Egreso>{
    return this.sharedServices.getById<EgresoDTO>(`${this.endpoint}/${id}`)
      .pipe(
        map(dtos => {
          return EgresoMapper.fromDTO(dtos)
        })
      );
  }

  crearEgreso(request:CrearEgresoRequest):Observable<Egreso>{
    return this.sharedServices.post<EgresoDTO>(`${this.endpoint}`, request)
      .pipe(
        map(dto => EgresoMapper.fromDTO(dto))
      );
  }

  actualizarEgreso(request:ActualizarEgresoRequest, id:number):Observable<Egreso>{
    return this.sharedServices.put<EgresoDTO>(`${this.endpoint}/${id}`, request)
      .pipe(
        map(dto => EgresoMapper.fromDTO(dto))
      );
  }

  cancelarEgreso(request:CancelarEgresoRequest, id:number):Observable<Egreso>{
    return this.sharedServices.patch<EgresoDTO>(`${this.endpoint}/${id}/cancelar`, request)
      .pipe(
        map(dto => EgresoMapper.fromDTO(dto))
      );
  }

}
