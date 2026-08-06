import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import moment from 'moment';

import { SharedService } from './shared.service';

import { TransaccionDTO } from '../models/interface-models/transaccionDTO.interface';
import { TransaccionMapper } from '../mappers/transaccion.mapper';
import { Transaccion } from '../models/transaccion.model';

import { NaturalezaFinanciera } from '../models/naturaleza-financiera.enum';


@Injectable({
  providedIn: 'root'
})
export class TransaccionService{

  
  private sharedService = inject(SharedService)

  private endpoint = '/transacciones'

  //Estado Interno
  private transacciones$ = new BehaviorSubject<Transaccion[]>([]);

  //Estado Lectura
  public transaccionesObservable$ = this.transacciones$.asObservable();

  /*/Usar variable para no recalcular a cada rato
  private cacheAgrupado?: {
    egresos: Record<string, number>,
    ingresos: Record<string, number>
  };*/

  constructor() { }

  cargarTransaccion(): void{
    this.sharedService.get<TransaccionDTO>(this.endpoint)
      .pipe(
        map((dtos) => dtos.map(TransaccionMapper.fromDTO))
      )
      .subscribe({
        next: (transacciones) => {
          this.transacciones$.next(transacciones);

          //Generar cache
          //this.cacheAgrupado = this.agruparTransaccionPorSemana(transacciones);
        },
        error: (err) => console.error(err)
      })
  }

  obtenerTransaccionesById(id:string):Observable<Transaccion>{
    return this.sharedService.getById<TransaccionDTO>(`${this.endpoint}/${id}`)
      .pipe(
        map(dto => TransaccionMapper.fromDTO(dto))
      );
  }


}
