import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Muebleria } from '../models/mueblerias.model';
import { SharedService } from './shared.service';
import { MuebleriaDTO } from '../models/interface-models/muebleriaDTO.interface';
import { MuebleriaMapper } from '../mappers/muebleria.mapper';


@Injectable({
  providedIn: 'root'
})
export class MuebleriaService {

  private sharedService = inject(SharedService)

  private endpoint = '/muebleria'
  
  constructor() { }

  cargarMuebleria():Observable<Muebleria[]>{
    return this.sharedService.get<MuebleriaDTO>(this.endpoint)
      .pipe(
        map((dtos) => dtos.map(MuebleriaMapper.fromDTO))
      );
  
  }

  obtennerMuebleriaById(id:string):Observable<Muebleria>{
    return this.sharedService.getById<MuebleriaDTO>(`${this.endpoint}/${id}`)
      .pipe(
        map(dto => MuebleriaMapper.fromDTO(dto))
      );
  }

}
